import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'
import { User } from '../models/User.js'

function getTokenFromReq(req) {
  const auth = req.headers.authorization || ''
  const [scheme, token] = auth.split(' ')
  if (scheme === 'Bearer' && token) return token
  if (req.cookies?.token) return req.cookies.token
  return null
}

export async function requireAuth(req, res, next) {
  const token = getTokenFromReq(req)
  if (!token) return res.status(401).json({ error: 'Unauthorized' })
  try {
    const payload = jwt.verify(token, env.jwtSecret)
    const user = await User.findById(payload.sub).select('name email phone role blocked').lean()
    if (!user) return res.status(401).json({ error: 'Unauthorized' })
    if (user.blocked) return res.status(403).json({ error: 'User is blocked' })
    req.user = user
    return next()
  } catch {
    return res.status(401).json({ error: 'Unauthorized' })
  }
}

export function requireRole(role) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' })
    if (req.user.role !== role) return res.status(403).json({ error: 'Forbidden' })
    return next()
  }
}

