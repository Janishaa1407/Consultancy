import { asyncHandler } from '../utils/asyncHandler.js'
import { Order } from '../models/Order.js'
import { Product } from '../models/Product.js'
import { User } from '../models/User.js'
import { Notification } from '../models/Notification.js'
import { ApiError } from '../utils/errors.js'

export const metrics = asyncHandler(async (_req, res) => {
  const [totalUsers, totalOrders, totalProducts, recentOrders] = await Promise.all([
    User.countDocuments({ role: 'user' }),
    Order.countDocuments({}),
    Product.countDocuments({}),
    Order.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('user', 'name email')
      .lean(),
  ])

  res.json({
    totalUsers,
    totalOrders,
    totalProducts,
    recentOrders: recentOrders.map((o) => ({
      _id: o._id,
      status: o.status,
      totalPrice: o.totalPrice,
      createdAt: o.createdAt,
      user: o.user,
    })),
  })
})

export const listUsers = asyncHandler(async (_req, res) => {
  const users = await User.find()
    .sort({ createdAt: -1 })
    .select('name email phone role blocked createdAt')
    .lean()
  res.json({ users })
})

export const customersWithOrders = asyncHandler(async (_req, res) => {
  // Returns user details + last order time + total orders
  const users = await User.find({ role: 'user' })
    .select('name email phone blocked createdAt')
    .sort({ createdAt: -1 })
    .lean()

  // Simple scalable-enough approach for MVP (can be optimized with aggregation later)
  const userIds = users.map((u) => u._id)
  const orderCounts = await Order.aggregate([
    { $match: { user: { $in: userIds } } },
    { $group: { _id: '$user', count: { $sum: 1 }, last: { $max: '$createdAt' } } },
  ])
  const byUser = new Map(orderCounts.map((x) => [String(x._id), x]))

  res.json({
    customers: users.map((u) => ({
      ...u,
      orderCount: byUser.get(String(u._id))?.count || 0,
      lastOrderAt: byUser.get(String(u._id))?.last || null,
    })),
  })
})

export const setUserBlocked = asyncHandler(async (req, res) => {
  const { blocked } = req.body || {}
  if (typeof blocked !== 'boolean') throw new ApiError(400, 'Invalid input')
  const user = await User.findByIdAndUpdate(req.params.id, { blocked }, { new: true })
    .select('name email phone role blocked createdAt')
    .lean()
  if (!user) throw new ApiError(404, 'Not found')
  res.json({ user })
})

export const listAdminNotifications = asyncHandler(async (req, res) => {
  const limit = Math.min(Math.max(Number(req.query.limit || 20), 1), 100)
  const notifications = await Notification.find({
    recipientRole: 'admin',
    $or: [
      { recipientUser: req.user._id || req.user.id },
      { recipientUser: null },
    ],
  })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean()

  const unread = await Notification.countDocuments({
    recipientRole: 'admin',
    $or: [
      { recipientUser: req.user._id || req.user.id },
      { recipientUser: null },
    ],
    isRead: false,
  })

  res.json({ notifications, unread })
})

export const markAdminNotificationRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findOneAndUpdate(
    {
      _id: req.params.id,
      recipientRole: 'admin',
      $or: [
        { recipientUser: req.user._id || req.user.id },
        { recipientUser: null },
      ],
    },
    { $set: { isRead: true } },
    { new: true }
  ).lean()

  if (!notification) throw new ApiError(404, 'Not found')
  res.json({ notification })
})

export const markAllAdminNotificationsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany(
    {
      recipientRole: 'admin',
      $or: [
        { recipientUser: req.user._id || req.user.id },
        { recipientUser: null },
      ],
      isRead: false,
    },
    { $set: { isRead: true } }
  )
  res.json({ ok: true })
})

