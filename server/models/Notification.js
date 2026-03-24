import mongoose from 'mongoose'

const NotificationSchema = new mongoose.Schema(
  {
    recipientRole: { type: String, enum: ['admin', 'user'], required: true, index: true },
    recipientUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null, index: true },
    channels: { type: [String], default: [] }, // email, sms, whatsapp, inapp
    type: { type: String, required: true }, // order_placed, order_status_updated
    title: { type: String, required: true },
    message: { type: String, required: true },
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', default: null, index: true },
    isRead: { type: Boolean, default: false, index: true },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
)

export const Notification = mongoose.models.Notification || mongoose.model('Notification', NotificationSchema)

