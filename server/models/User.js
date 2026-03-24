import mongoose from 'mongoose'

const LoginActivitySchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['login', 'logout', 'google_login'], required: true },
    at: { type: Date, default: Date.now },
    ip: { type: String, default: '' },
    userAgent: { type: String, default: '' },
  },
  { _id: false }
)

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true, unique: true },
    phone: { type: String, default: '' },
    passwordHash: { type: String, default: null },
    googleId: { type: String, default: null },
    role: { type: String, enum: ['user', 'admin'], default: 'user', index: true },
    blocked: { type: Boolean, default: false },
    loginActivity: { type: [LoginActivitySchema], default: [] },
  },
  { timestamps: true }
)

UserSchema.set('toJSON', {
  transform(_doc, ret) {
    delete ret.passwordHash
    delete ret.__v
    return ret
  },
})

export const User = mongoose.models.User || mongoose.model('User', UserSchema)

