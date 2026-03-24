import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import { env } from './config/env.js'
import { authRoutes } from './routes/authRoutes.js'
import { productRoutes } from './routes/productRoutes.js'
import { orderRoutes } from './routes/orderRoutes.js'
import { addressRoutes } from './routes/addressRoutes.js'
import { adminRoutes } from './routes/adminRoutes.js'
import { errorMiddleware } from './utils/errors.js'

export function createApp() {
  const app = express()

  app.use(
    cors({
      origin: env.clientOrigin,
      credentials: true,
    })
  )
  app.use(helmet())
  app.use(cookieParser())
  app.use(express.json({ limit: '1mb' }))

  app.use(
    rateLimit({
      windowMs: 60 * 1000,
      limit: 120,
      standardHeaders: 'draft-7',
      legacyHeaders: false,
    })
  )

  app.get('/api/health', (_req, res) => res.json({ ok: true }))

  app.use('/api/auth', authRoutes)
  app.use('/api/products', productRoutes)
  app.use('/api/orders', orderRoutes)
  app.use('/api/addresses', addressRoutes)
  app.use('/api/admin', adminRoutes)

  app.use(errorMiddleware)
  return app
}

