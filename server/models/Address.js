import mongoose from 'mongoose'

const AddressSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    fullAddress: { type: String, required: true },
    city: { type: String, required: true },
    pincode: { type: String, required: true },
    contactName: { type: String, default: '' },
    contactPhone: { type: String, default: '' },
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true }
)

export const Address = mongoose.models.Address || mongoose.model('Address', AddressSchema)

