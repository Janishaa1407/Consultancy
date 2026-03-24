import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function ensureGoogleScript() {
  return new Promise((resolve, reject) => {
    if (document.getElementById('google-identity-script')) return resolve()

    const script = document.createElement('script')
    script.id = 'google-identity-script'
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Failed to load Google Identity script'))
    document.body.appendChild(script)
  })
}

export default function GoogleLoginButton() {
  const { loginWithGoogle, setError } = useAuth()
  const navigate = useNavigate()
  const buttonHostRef = useRef(null)
  const [loading, setLoading] = useState(false)

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || ''

  useEffect(() => {
    let cancelled = false
    async function init() {
      if (!googleClientId) return
      await ensureGoogleScript()
      if (cancelled) return

      if (!window.google?.accounts?.id) return

      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: async (response) => {
          try {
            setError?.(null)
            setLoading(true)
            const idToken = response?.credential
            if (!idToken) throw new Error('Google token missing')
            const loggedInUser = await loginWithGoogle(idToken)
            navigate(loggedInUser?.role === 'admin' ? '/admin' : '/account')
          } catch (e) {
            setError?.(e?.message || 'Google login failed')
          } finally {
            setLoading(false)
          }
        },
      })

      if (buttonHostRef.current) {
        window.google.accounts.id.renderButton(buttonHostRef.current, {
          theme: 'outline',
          size: 'large',
          width: '100%',
          text: 'continue_with',
          shape: 'pill',
        })
      }
    }

    init().catch((e) => {
      setError?.(e?.message || 'Google login init failed')
    })

    return () => {
      cancelled = true
    }
  }, [googleClientId])

  if (!googleClientId) return null

  return (
    <div className="mt-4">
      {/* Host element for Google-rendered button */}
      <div ref={buttonHostRef} />
      {loading && <div className="text-sm text-gray-600 mt-2">Signing in with Google...</div>}
      {error && (
        <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2 mt-2">
          {error}
        </div>
      )}
    </div>
  )
}

