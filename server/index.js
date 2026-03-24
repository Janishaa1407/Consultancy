import bcrypt from 'bcryptjs'
import { connectDb } from './config/db.js'
import { env } from './config/env.js'
import { User } from './models/User.js'
import { Product } from './models/Product.js'
import { createApp } from './app.js'

async function ensureSeedAdmin() {
  const email = (process.env.SEED_ADMIN_EMAIL || 'admin@shop.local').toLowerCase()
  const password = process.env.SEED_ADMIN_PASSWORD || 'admin123'
  const name = process.env.SEED_ADMIN_NAME || 'Shop Owner'

  const existing = await User.findOne({ email }).lean()
  if (existing) return
  const passwordHash = bcrypt.hashSync(password, 10)
  await User.create({ name, email, phone: '', passwordHash, role: 'admin' })
  // eslint-disable-next-line no-console
  console.log(`Seeded admin user: ${email} / ${password}`)
}

async function ensureSeedProducts() {
  const count = await Product.countDocuments()
  if (count > 0) return

  const now = new Date().toISOString()
  await Product.insertMany([
    {
      name: 'NPK 19-19-19 Premium Fertilizer',
      price: 1250,
      description: 'Balanced NPK fertilizer for all crops',
      stock: 50,
      image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400',
    },
    {
      name: 'Organic Compost Fertilizer',
      price: 850,
      description: '100% organic compost for sustainable farming',
      stock: 40,
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400',
    },
    {
      name: 'Urea 46-0-0 High Nitrogen',
      price: 950,
      description: 'High nitrogen content for rapid vegetative growth',
      stock: 60,
      image: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=400',
    },
    {
      name: 'Vermicompost Premium',
      price: 1200,
      description: 'Premium worm castings for superior soil health',
      stock: 30,
      image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400',
    },
    {
      name: 'DAP 18-46-0 Fertilizer',
      price: 1100,
      description: 'Diammonium Phosphate for root and flower development',
      stock: 25,
      image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400',
    },
  ])

  // eslint-disable-next-line no-console
  console.log(`Seeded ${now} products`)
}

async function main() {
  await connectDb()
  await ensureSeedAdmin()
  await ensureSeedProducts()
  const app = createApp()
  app.listen(env.port, () => {
    // eslint-disable-next-line no-console
    console.log(`API listening on http://localhost:${env.port}`)
  })
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err)
  process.exit(1)
})

