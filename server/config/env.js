import dotenv from 'dotenv'

dotenv.config()

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 5000),
  mongoUri: process.env.MONGO_URI || '',
  jwtSecret: process.env.JWT_SECRET || 'dev_secret_change_me',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  googleClientId: process.env.GOOGLE_CLIENT_ID || '',
  resendApiKey: process.env.RESEND_API_KEY || '',
  resendFromEmail: process.env.RESEND_FROM_EMAIL || 'no-reply@sathyaagro.local',
  twilioAccountSid: process.env.TWILIO_ACCOUNT_SID || '',
  twilioAuthToken: process.env.TWILIO_AUTH_TOKEN || '',
  twilioSmsFrom: process.env.TWILIO_SMS_FROM || '',
  twilioWhatsappFrom: process.env.TWILIO_WHATSAPP_FROM || '',
  adminEmail: process.env.ADMIN_EMAIL || 'admin@shop.local',
  adminPhone: process.env.ADMIN_PHONE || '',
}

