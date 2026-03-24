import { Router } from 'express'
import { googleLogin, login, logout, me, register } from '../controllers/authController.js'
import { requireAuth } from '../middleware/auth.js'

export const authRoutes = Router()

authRoutes.post('/register', register)
authRoutes.post('/login', login)
authRoutes.post('/google', googleLogin)
authRoutes.post('/logout', logout)
authRoutes.get('/me', requireAuth, me)

