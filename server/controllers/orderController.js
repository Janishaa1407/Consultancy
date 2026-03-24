import mongoose from 'mongoose'
import { z } from 'zod'
import { Address } from '../models/Address.js'
import { Order } from '../models/Order.js'
import { Product } from '../models/Product.js'
import { User } from '../models/User.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/errors.js'
import { sendOrderPlacedNotifications, sendOrderStatusNotifications } from '../services/notificationService.js'

function normalizeStatus(status) {
  if (
    status === 'ordered' ||
    status === 'processing' ||
    status === 'shipped' ||
    status === 'out_for_delivery' ||
    status === 'delivered'
  )
    return status
  return 'ordered'
}

export const placeOrder = asyncHandler(async (req, res) => {
  const schema = z.object({
    addressId: z.string().min(1),
    requirements: z.string().optional().default(''),
    items: z.array(
      z.object({
        productId: z.string().min(1),
        quantity: z.number().int().min(1),
      })
    ),
  })
  const parsed = schema.safeParse(req.body)
  if (!parsed.success) throw new ApiError(400, 'Invalid input')

  const userId = req.user._id
  const address = await Address.findOne({ _id: parsed.data.addressId, user: userId }).lean()
  if (!address) throw new ApiError(400, 'Invalid address')

  const productIds = parsed.data.items.map((i) => i.productId)
  const products = await Product.find({ _id: { $in: productIds } }).lean()
  const byId = new Map(products.map((p) => [String(p._id), p]))

  const orderItems = parsed.data.items.map((i) => {
    const p = byId.get(i.productId)
    if (!p) throw new ApiError(400, 'Invalid product in cart')
    if (p.stock < i.quantity) throw new ApiError(409, `Insufficient stock for ${p.name}`)
    return {
      product: new mongoose.Types.ObjectId(i.productId),
      name: p.name,
      price: p.price,
      quantity: i.quantity,
      image: p.image || '',
    }
  })

  const totalPrice = orderItems.reduce((sum, it) => sum + it.price * it.quantity, 0)

  // Stock update (best-effort atomic per product)
  const ops = orderItems.map((it) => ({
    updateOne: {
      filter: { _id: it.product, stock: { $gte: it.quantity } },
      update: { $inc: { stock: -it.quantity } },
    },
  }))
  const bulkRes = await Product.bulkWrite(ops, { ordered: true })
  const expected = orderItems.length
  const modified = bulkRes?.modifiedCount ?? 0
  if (modified !== expected) {
    // If any stock update failed, attempt to rollback what was modified
    await Product.bulkWrite(
      orderItems.map((it) => ({
        updateOne: { filter: { _id: it.product }, update: { $inc: { stock: it.quantity } } },
      })),
      { ordered: false }
    )
    throw new ApiError(409, 'Stock changed, please retry')
  }

  const order = await Order.create({
    user: userId,
    items: orderItems,
    totalPrice,
    status: 'ordered',
    address: address._id,
    requirements: parsed.data.requirements,
    deliveryTimelineDays: 0,
    expectedDeliveryAt: null,
    shipping: {
      deliveryStatus: 'ordered',
      trackingUpdates: [{ status: 'ordered', note: 'Order placed' }],
    },
  })

  // Ensure user's phone is stored for SMS/WhatsApp delivery if provided at checkout.
  const contactPhone = address?.contactPhone || ''
  if (contactPhone) {
    await User.updateOne(
      { _id: userId, $or: [{ phone: { $exists: false } }, { phone: '' }] },
      { $set: { phone: contactPhone } }
    )
  }

  const full = await Order.findById(order._id)
    .populate('address')
    .populate('user', 'name email phone')
    .populate('items.product')
    .lean()

  await sendOrderPlacedNotifications(full, full.user, full.address)
  res.json({ order: full })
})

export const myOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .populate('address')
    .populate('items.product')
    .lean()
  res.json({ orders })
})

export const getMyOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id, user: req.user._id })
    .populate('address')
    .populate('items.product')
    .lean()
  if (!order) throw new ApiError(404, 'Not found')
  res.json({ order })
})

export const adminListOrders = asyncHandler(async (_req, res) => {
  const orders = await Order.find()
    .sort({ createdAt: -1 })
    .populate('user', 'name email phone')
    .populate('address')
    .populate('items.product')
    .lean()
  res.json({ orders })
})

export const adminUpdateOrderStatus = asyncHandler(async (req, res) => {
  const schema = z.object({
    status: z.enum(['ordered', 'processing', 'shipped', 'out_for_delivery', 'delivered']),
    note: z.string().optional().default(''),
    deliveryTimelineDays: z.number().int().min(0).max(30).optional(),
  })
  const parsed = schema.safeParse(req.body)
  if (!parsed.success) throw new ApiError(400, 'Invalid input')

  const status = normalizeStatus(parsed.data.status)
  const order = await Order.findById(req.params.id)
  if (!order) throw new ApiError(404, 'Not found')

  order.status = status
  order.shipping.deliveryStatus = status
  if (typeof parsed.data.deliveryTimelineDays === 'number') {
    order.deliveryTimelineDays = parsed.data.deliveryTimelineDays
    if (parsed.data.deliveryTimelineDays === 0) {
      order.expectedDeliveryAt = null
    } else {
      order.expectedDeliveryAt = new Date(Date.now() + parsed.data.deliveryTimelineDays * 24 * 60 * 60 * 1000)
    }
  }
  order.shipping.trackingUpdates.unshift({ status, note: parsed.data.note || '' })
  order.shipping.trackingUpdates = order.shipping.trackingUpdates.slice(0, 50)
  await order.save()

  const full = await Order.findById(order._id)
    .populate('user', 'name email phone')
    .populate('address')
    .populate('items.product')
    .lean()

  await sendOrderStatusNotifications(full, full.user, full.address, parsed.data.note || '')
  res.json({ order: full })
})

export const streamMyOrder = asyncHandler(async (req, res) => {
  // SSE stream: pushes when order.updatedAt changes
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  })

  const orderId = req.params.id
  let lastUpdatedAt = null
  let closed = false

  const send = (event, data) => {
    res.write(`event: ${event}\n`)
    res.write(`data: ${JSON.stringify(data)}\n\n`)
  }

  const tick = async () => {
    if (closed) return
    const order = await Order.findOne({ _id: orderId, user: req.user._id })
      .populate('address')
      .populate('items.product')
      .lean()
    if (!order) {
      send('error', { error: 'Not found' })
      res.end()
      return
    }
    const updatedAt = order.updatedAt ? new Date(order.updatedAt).toISOString() : null
    if (updatedAt && updatedAt !== lastUpdatedAt) {
      lastUpdatedAt = updatedAt
      send('order', { order })
    } else {
      send('ping', { t: Date.now() })
    }
  }

  const interval = setInterval(() => {
    tick().catch((e) => send('error', { error: e?.message || 'Error' }))
  }, 2000)

  req.on('close', () => {
    closed = true
    clearInterval(interval)
  })

  await tick()
})

