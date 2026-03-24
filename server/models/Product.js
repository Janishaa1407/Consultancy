import mongoose from 'mongoose'

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    description: { type: String, default: '' },
    stock: { type: Number, default: 0, min: 0 },
    image: { type: String, default: '' },
  },
  { timestamps: true }
)

export const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema)

