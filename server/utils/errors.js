export class ApiError extends Error {
  constructor(status, message) {
    super(message)
    this.status = status
  }
}

export function errorMiddleware(err, req, res, _next) {
  const status = err?.status || 500
  const message = status === 500 ? 'Internal server error' : err.message || 'Error'
  if (status === 500) {
    // eslint-disable-next-line no-console
    console.error(err)
  }
  res.status(status).json({ error: message })
}

