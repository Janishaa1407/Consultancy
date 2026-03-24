const STORAGE_KEY = 'activityLog_v1'
const MAX_EVENTS = 1000

function safeParse(json, fallback) {
  try {
    const parsed = JSON.parse(json)
    return parsed ?? fallback
  } catch {
    return fallback
  }
}

function readEvents() {
  const raw = localStorage.getItem(STORAGE_KEY)
  const data = raw ? safeParse(raw, []) : []
  return Array.isArray(data) ? data : []
}

function writeEvents(events) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events))
}

export function getActivityEvents() {
  return readEvents()
}

export function clearActivityEvents() {
  writeEvents([])
}

export function logActivityEvent({ type, user, meta } = {}) {
  const now = new Date()
  const email = user?.email || meta?.email || ''
  const firstName = user?.firstName || meta?.firstName || ''
  const lastName = user?.lastName || meta?.lastName || ''

  const event = {
    id: `${now.getTime()}_${Math.random().toString(16).slice(2)}`,
    type: type || 'unknown',
    at: now.toISOString(),
    user: {
      email,
      name: `${firstName} ${lastName}`.trim(),
      isAdmin: Boolean(user?.isAdmin),
    },
    meta: meta && typeof meta === 'object' ? meta : undefined,
  }

  const existing = readEvents()
  const next = [event, ...existing].slice(0, MAX_EVENTS)
  writeEvents(next)
  return event
}

