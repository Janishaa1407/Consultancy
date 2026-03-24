import { Router } from 'express'
import {
  adminListOrders,
  adminUpdateOrderStatus,
  getMyOrderById,
  myOrders,
  placeOrder,
  streamMyOrder,
} from '../controllers/orderController.js'
import { requireAuth, requireRole } from '../middleware/auth.js'

export const orderRoutes = Router()

orderRoutes.post('/', requireAuth, placeOrder)
orderRoutes.get('/my', requireAuth, myOrders)
orderRoutes.get('/my/:id', requireAuth, getMyOrderById)
orderRoutes.get('/my/:id/stream', requireAuth, streamMyOrder)

orderRoutes.get('/admin', requireAuth, requireRole('admin'), adminListOrders)
orderRoutes.patch('/admin/:id/status', requireAuth, requireRole('admin'), adminUpdateOrderStatus)

