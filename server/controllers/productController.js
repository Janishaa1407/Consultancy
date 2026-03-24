import { z } from 'zod'
import { Product } from '../models/Product.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/errors.js'

export const listProducts = asyncHandler(async (_req, res) => {
  const products = await Product.find().sort({ createdAt: -1 }).lean()
  res.json({ products })
})

export const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).lean()
  if (!product) throw new ApiError(404, 'Not found')
  res.json({ product })
})

export const createProduct = asyncHandler(async (req, res) => {
  const schema = z.object({
    name: z.string().min(1),
    price: z.number().nonnegative(),
    description: z.string().optional().default(''),
    stock: z.number().int().nonnegative().optional().default(0),
    image: z.string().optional().default(''),
  })
  const parsed = schema.safeParse(req.body)
  if (!parsed.success) throw new ApiError(400, 'Invalid input')
  const product = await Product.create(parsed.data)
  res.json({ product })
})

export const updateProduct = asyncHandler(async (req, res) => {
  const schema = z.object({
    name: z.string().min(1),
    price: z.number().nonnegative(),
    description: z.string().optional().default(''),
    stock: z.number().int().nonnegative().optional().default(0),
    image: z.string().optional().default(''),
  })
  const parsed = schema.safeParse(req.body)
  if (!parsed.success) throw new ApiError(400, 'Invalid input')
  const product = await Product.findByIdAndUpdate(req.params.id, parsed.data, { new: true }).lean()
  if (!product) throw new ApiError(404, 'Not found')
  res.json({ product })
})

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id).lean()
  if (!product) throw new ApiError(404, 'Not found')
  res.json({ ok: true })
})

