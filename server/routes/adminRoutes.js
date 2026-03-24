import { Router } from 'express'
import {
  customersWithOrders,
  listAdminNotifications,
  listUsers,
  markAdminNotificationRead,
  markAllAdminNotificationsRead,
  metrics,
  setUserBlocked,
} from '../controllers/adminController.js'
import { requireAuth, requireRole } from '../middleware/auth.js'

export const adminRoutes = Router()

adminRoutes.get('/metrics', requireAuth, requireRole('admin'), metrics)
adminRoutes.get('/users', requireAuth, requireRole('admin'), listUsers)
adminRoutes.get('/customers', requireAuth, requireRole('admin'), customersWithOrders)
adminRoutes.patch('/users/:id/block', requireAuth, requireRole('admin'), setUserBlocked)
adminRoutes.get('/notifications', requireAuth, requireRole('admin'), listAdminNotifications)
adminRoutes.patch('/notifications/read-all', requireAuth, requireRole('admin'), markAllAdminNotificationsRead)
adminRoutes.patch('/notifications/:id/read', requireAuth, requireRole('admin'), markAdminNotificationRead)

