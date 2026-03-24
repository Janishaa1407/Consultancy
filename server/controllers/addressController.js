import { z } from 'zod'
import { Address } from '../models/Address.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/errors.js'

export const listMyAddresses = asyncHandler(async (req, res) => {
  const addresses = await Address.find({ user: req.user._id || req.user.id }).sort({ createdAt: -1 }).lean()
  res.json({ addresses })
})

export const createAddress = asyncHandler(async (req, res) => {
  const schema = z.object({
    fullAddress: z.string().min(5),
    city: z.string().min(1),
    pincode: z.string().min(4),
    contactName: z.string().optional().default(''),
    contactPhone: z.string().optional().default(''),
    isDefault: z.boolean().optional().default(false),
  })
  const parsed = schema.safeParse(req.body)
  if (!parsed.success) throw new ApiError(400, 'Invalid input')

  const userId = req.user._id || req.user.id

  if (parsed.data.isDefault) {
    await Address.updateMany({ user: userId }, { $set: { isDefault: false } })
  }

  const address = await Address.create({ ...parsed.data, user: userId })
  res.json({ address })
})

export const setDefaultAddress = asyncHandler(async (req, res) => {
  const userId = req.user._id || req.user.id
  const address = await Address.findOne({ _id: req.params.id, user: userId })
  if (!address) throw new ApiError(404, 'Not found')
  await Address.updateMany({ user: userId }, { $set: { isDefault: false } })
  address.isDefault = true
  await address.save()
  res.json({ address })
})

export const deleteAddress = asyncHandler(async (req, res) => {
  const userId = req.user._id || req.user.id
  const address = await Address.findOneAndDelete({ _id: req.params.id, user: userId }).lean()
  if (!address) throw new ApiError(404, 'Not found')
  res.json({ ok: true })
})

