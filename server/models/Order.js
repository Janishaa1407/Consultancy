import mongoose from 'mongoose'

const OrderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
    image: { type: String, default: '' },
  },
  { _id: false }
)

const ShippingUpdateSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ['ordered', 'processing', 'shipped', 'out_for_delivery', 'delivered'],
      required: true,
    },
    note: { type: String, default: '' },
    at: { type: Date, default: Date.now },
  },
  { _id: false }
)

const OrderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    items: { type: [OrderItemSchema], required: true },
    totalPrice: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ['ordered', 'processing', 'shipped', 'out_for_delivery', 'delivered'],
      default: 'ordered',
      index: true,
    },
    address: { type: mongoose.Schema.Types.ObjectId, ref: 'Address', required: true },
    requirements: { type: String, default: '' },
    deliveryTimelineDays: { type: Number, min: 0, default: 0 },
    expectedDeliveryAt: { type: Date, default: null },
    shipping: {
      deliveryStatus: {
        type: String,
        enum: ['ordered', 'processing', 'shipped', 'out_for_delivery', 'delivered'],
        default: 'ordered',
      },
      trackingUpdates: { type: [ShippingUpdateSchema], default: [] },
    },
  },
  { timestamps: true }
)

export const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema)

