import { Router } from 'express'
import {
  createProduct,
  deleteProduct,
  getProduct,
  listProducts,
  updateProduct,
} from '../controllers/productController.js'
import { requireAuth, requireRole } from '../middleware/auth.js'

export const productRoutes = Router()

// public
productRoutes.get('/', listProducts)
productRoutes.get('/:id', getProduct)

// admin
productRoutes.post('/admin', requireAuth, requireRole('admin'), createProduct)
productRoutes.put('/admin/:id', requireAuth, requireRole('admin'), updateProduct)
productRoutes.delete('/admin/:id', requireAuth, requireRole('admin'), deleteProduct)

