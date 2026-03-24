import { Resend } from 'resend'
import twilio from 'twilio'
import { env } from '../config/env.js'
import { Notification } from '../models/Notification.js'
import { User } from '../models/User.js'

const resend = env.resendApiKey ? new Resend(env.resendApiKey) : null
const twilioClient = env.twilioAccountSid && env.twilioAuthToken
  ? twilio(env.twilioAccountSid, env.twilioAuthToken)
  : null

function asCurrency(num) {
  return `INR ${Number(num || 0).toFixed(2)}`
}

function normalizePhone(input) {
  const raw = String(input || '').trim()
  if (!raw) return ''
  if (raw.startsWith('+')) return raw
  const digits = raw.replace(/\D/g, '')
  if (!digits) return ''
  // Assume Indian numbers when local 10-digit format is provided.
  if (digits.length === 10) return `+91${digits}`
  return `+${digits}`
}

async function sendEmail(to, subject, html) {
  if (!resend || !to) return { ok: false, reason: 'email-not-configured' }
  try {
    await resend.emails.send({
      from: env.resendFromEmail,
      to,
      subject,
      html,
    })
    return { ok: true }
  } catch (e) {
    return { ok: false, reason: e?.message || 'email-send-failed' }
  }
}

async function sendSms(to, body) {
  const toPhone = normalizePhone(to)
  if (!twilioClient || !env.twilioSmsFrom || !toPhone) return { ok: false, reason: 'sms-not-configured' }
  try {
    await twilioClient.messages.create({ from: env.twilioSmsFrom, to: toPhone, body })
    return { ok: true }
  } catch (e) {
    return { ok: false, reason: e?.message || 'sms-send-failed' }
  }
}

async function sendWhatsapp(to, body) {
  const toPhone = normalizePhone(to)
  if (!twilioClient || !env.twilioWhatsappFrom || !toPhone) return { ok: false, reason: 'whatsapp-not-configured' }
  try {
    const toAddress = toPhone.startsWith('whatsapp:') ? toPhone : `whatsapp:${toPhone}`
    const fromAddress = env.twilioWhatsappFrom.startsWith('whatsapp:')
      ? env.twilioWhatsappFrom
      : `whatsapp:${env.twilioWhatsappFrom}`
    await twilioClient.messages.create({ from: fromAddress, to: toAddress, body })
    return { ok: true }
  } catch (e) {
    return { ok: false, reason: e?.message || 'whatsapp-send-failed' }
  }
}

function buildOrderItemsText(order) {
  return (order.items || [])
    .map((it) => `${it.name} x${it.quantity}`)
    .join(', ')
}

async function createInAppNotification(data) {
  return Notification.create(data)
}

async function notifyAdminsNewOrder(order, user, address) {
  const admins = await User.find({ role: 'admin' }).select('email phone _id').lean()
  const adminEmails = new Set([env.adminEmail, ...admins.map((a) => a.email).filter(Boolean)])
  const adminPhones = new Set([env.adminPhone, ...admins.map((a) => a.phone).filter(Boolean)])

  const itemsText = buildOrderItemsText(order)
  const when = new Date(order.createdAt || Date.now()).toLocaleString()
  const title = `New order placed (#${String(order._id).slice(-6)})`
  const message = `Customer ${user?.name || user?.email} placed order at ${when}. Items: ${itemsText}. Total: ${asCurrency(order.totalPrice)}.`

  for (const admin of admins) {
    await createInAppNotification({
      recipientRole: 'admin',
      recipientUser: admin._id,
      channels: ['inapp', 'email', 'sms', 'whatsapp'],
      type: 'order_placed',
      title,
      message,
      orderId: order._id,
      metadata: {
        customer: {
          name: user?.name || '',
          email: user?.email || '',
          phone: user?.phone || address?.contactPhone || '',
        },
        address: {
          fullAddress: address?.fullAddress || '',
          city: address?.city || '',
          pincode: address?.pincode || '',
        },
      },
    })
  }

  const html = `
    <h2>${title}</h2>
    <p>${message}</p>
    <p><strong>Customer:</strong> ${user?.name || ''} (${user?.email || ''}, ${user?.phone || address?.contactPhone || ''})</p>
    <p><strong>Delivery Address:</strong> ${address?.fullAddress || ''}, ${address?.city || ''} - ${address?.pincode || ''}</p>
  `

  for (const email of adminEmails) {
    await sendEmail(email, title, html)
  }
  for (const phone of adminPhones) {
    await sendSms(phone, message)
    await sendWhatsapp(phone, message)
  }
}

async function notifyUserOrderPlaced(order, user, address) {
  const itemsText = buildOrderItemsText(order)
  const title = `Order confirmed (#${String(order._id).slice(-6)})`
  const message = `Hi ${user?.name || 'Customer'}, your order is placed. Items: ${itemsText}. Total: ${asCurrency(order.totalPrice)}. Status: ordered.`

  await createInAppNotification({
    recipientRole: 'user',
    recipientUser: user?._id || null,
    channels: ['email', 'sms', 'whatsapp'],
    type: 'order_placed',
    title,
    message,
    orderId: order._id,
    metadata: {},
  })

  const html = `
    <h2>${title}</h2>
    <p>${message}</p>
    <p>We will notify you as the order progresses.</p>
  `
  await sendEmail(user?.email || '', title, html)
  const phone = user?.phone || address?.contactPhone || ''
  await sendSms(phone, message)
  await sendWhatsapp(phone, message)
}

async function notifyUserStatusUpdate(order, user, address, note) {
  const title = `Order update (#${String(order._id).slice(-6)})`
  const message = `Hi ${user?.name || 'Customer'}, your order status is now "${order.status}".${note ? ` Note: ${note}` : ''}`

  await createInAppNotification({
    recipientRole: 'user',
    recipientUser: user?._id || null,
    channels: ['email', 'sms', 'whatsapp'],
    type: 'order_status_updated',
    title,
    message,
    orderId: order._id,
    metadata: {},
  })

  const html = `
    <h2>${title}</h2>
    <p>${message}</p>
    ${
      order.expectedDeliveryAt
        ? `<p>Expected delivery: ${new Date(order.expectedDeliveryAt).toLocaleString()}</p>`
        : ''
    }
  `
  await sendEmail(user?.email || '', title, html)
  const phone = user?.phone || address?.contactPhone || ''
  await sendSms(phone, message)
  await sendWhatsapp(phone, message)
}

export async function sendOrderPlacedNotifications(order, user, address) {
  await Promise.allSettled([
    notifyAdminsNewOrder(order, user, address),
    notifyUserOrderPlaced(order, user, address),
  ])
}

export async function sendOrderStatusNotifications(order, user, address, note) {
  await Promise.allSettled([
    notifyUserStatusUpdate(order, user, address, note),
  ])
}

