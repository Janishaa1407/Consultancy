import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { OAuth2Client } from 'google-auth-library'
import { z } from 'zod'
import { env } from '../config/env.js'
import { User } from '../models/User.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/errors.js'

const googleClient = env.googleClientId ? new OAuth2Client(env.googleClientId) : null

function signToken(user) {
  return jwt.sign({ sub: String(user._id), role: user.role, email: user.email }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  })
}

function setAuthCookie(res, token) {
  res.cookie('token', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: env.nodeEnv === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  })
}

export const register = asyncHandler(async (req, res) => {
  const schema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
    phone: z.string().optional().default(''),
    password: z.string().min(6),
  })
  const parsed = schema.safeParse(req.body)
  if (!parsed.success) throw new ApiError(400, 'Invalid input')
  const { name, email, phone, password } = parsed.data

  const exists = await User.findOne({ email: email.toLowerCase() }).lean()
  if (exists) throw new ApiError(409, 'Email already registered')

  const passwordHash = bcrypt.hashSync(password, 10)
  const user = await User.create({
    name,
    email: email.toLowerCase(),
    phone,
    passwordHash,
    role: 'user',
    loginActivity: [{ type: 'login', ip: req.ip, userAgent: req.get('user-agent') || '' }],
  })

  const token = signToken(user)
  setAuthCookie(res, token)
  return res.json({ token, user })
})

export const login = asyncHandler(async (req, res) => {
  const schema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
  })
  const parsed = schema.safeParse(req.body)
  if (!parsed.success) throw new ApiError(400, 'Invalid input')

  const email = parsed.data.email.toLowerCase()
  const user = await User.findOne({ email })
  if (!user) throw new ApiError(401, 'Invalid credentials')
  if (user.blocked) throw new ApiError(403, 'User is blocked')
  if (!user.passwordHash) throw new ApiError(401, 'Password login not enabled')

  const ok = bcrypt.compareSync(parsed.data.password, user.passwordHash)
  if (!ok) throw new ApiError(401, 'Invalid credentials')

  user.loginActivity.unshift({
    type: 'login',
    ip: req.ip,
    userAgent: req.get('user-agent') || '',
  })
  user.loginActivity = user.loginActivity.slice(0, 50)
  await user.save()

  const token = signToken(user)
  setAuthCookie(res, token)
  return res.json({ token, user })
})

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie('token', { httpOnly: true, sameSite: 'lax', secure: env.nodeEnv === 'production' })
  return res.json({ ok: true })
})

export const me = asyncHandler(async (req, res) => {
  // `requireAuth` sets req.user
  return res.json({ user: req.user })
})

export const googleLogin = asyncHandler(async (req, res) => {
  const schema = z.object({ idToken: z.string().min(10) })
  const parsed = schema.safeParse(req.body)
  if (!parsed.success) throw new ApiError(400, 'Invalid input')
  if (!googleClient) throw new ApiError(500, 'Google login not configured')

  const ticket = await googleClient.verifyIdToken({
    idToken: parsed.data.idToken,
    audience: env.googleClientId,
  })
  const payload = ticket.getPayload()
  if (!payload?.email) throw new ApiError(400, 'Invalid Google token')

  const email = payload.email.toLowerCase()
  const googleId = payload.sub
  const name = payload.name || email.split('@')[0]

  let user = await User.findOne({ email })
  if (!user) {
    user = await User.create({
      name,
      email,
      phone: '',
      googleId,
      role: 'user',
      loginActivity: [{ type: 'google_login', ip: req.ip, userAgent: req.get('user-agent') || '' }],
    })
  } else {
    if (user.blocked) throw new ApiError(403, 'User is blocked')
    if (!user.googleId) user.googleId = googleId
    user.loginActivity.unshift({
      type: 'google_login',
      ip: req.ip,
      userAgent: req.get('user-agent') || '',
    })
    user.loginActivity = user.loginActivity.slice(0, 50)
    await user.save()
  }

  const token = signToken(user)
  setAuthCookie(res, token)
  return res.json({ token, user })
})

