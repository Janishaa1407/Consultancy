import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Package, Truck, Users, LogOut, Bell } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { api } from '../../api/client'

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/orders', label: 'Orders', icon: Truck },
  { to: '/admin/users', label: 'Users', icon: Users },
]

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState([])
  const [unread, setUnread] = useState(0)
  const [open, setOpen] = useState(false)

  const loadNotifications = async () => {
    try {
      const data = await api.get('/admin/notifications?limit=20')
      setNotifications(data.notifications || [])
      setUnread(data.unread || 0)
    } catch {
      // no-op
    }
  }

  useEffect(() => {
    loadNotifications()
    const id = setInterval(loadNotifications, 8000)
    return () => clearInterval(id)
  }, [])

  const markRead = async (id) => {
    await api.patch(`/admin/notifications/${id}/read`, {})
    await loadNotifications()
  }

  const markAllRead = async () => {
    await api.patch('/admin/notifications/read-all', {})
    await loadNotifications()
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-end mb-4">
          <div className="relative">
            <button
              onClick={() => setOpen((v) => !v)}
              className="relative bg-white border rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unread > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full min-w-5 h-5 px-1 flex items-center justify-center">
                  {unread > 9 ? '9+' : unread}
                </span>
              )}
            </button>
            {open && (
              <div className="absolute right-0 mt-2 w-96 max-w-[90vw] bg-white border rounded-xl shadow-lg z-20">
                <div className="flex items-center justify-between px-4 py-3 border-b">
                  <div className="font-semibold text-gray-900">Admin notifications</div>
                  <button
                    onClick={markAllRead}
                    className="text-sm text-primary-700 font-semibold hover:text-primary-800"
                  >
                    Mark all read
                  </button>
                </div>
                <div className="max-h-96 overflow-auto">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-sm text-gray-600">No notifications yet.</div>
                  ) : (
                    notifications.map((n) => (
                      <button
                        key={n._id}
                        onClick={() => markRead(n._id)}
                        className={`w-full text-left px-4 py-3 border-b last:border-b-0 hover:bg-gray-50 ${
                          n.isRead ? 'bg-white' : 'bg-blue-50/40'
                        }`}
                      >
                        <div className="font-semibold text-gray-900">{n.title}</div>
                        <div className="text-sm text-gray-700 mt-1">{n.message}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {n.createdAt ? new Date(n.createdAt).toLocaleString() : ''}
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <aside className="lg:col-span-3">
            <div className="bg-white border rounded-xl shadow-sm p-4 sticky top-24">
              <Link to="/" className="block font-bold text-gray-900 text-lg mb-4">
                SathyaAgro Admin
              </Link>
              <div className="text-sm text-gray-600 mb-4">
                Signed in as <span className="font-semibold">{user?.email}</span>
              </div>
              <nav className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.end}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2 rounded-lg font-semibold transition ${
                          isActive ? 'bg-primary-600 text-white' : 'text-gray-700 hover:bg-gray-100'
                        }`
                      }
                    >
                      <Icon className="w-5 h-5" />
                      {item.label}
                    </NavLink>
                  )
                })}
              </nav>
              <button
                onClick={() => logout().finally(() => navigate('/login'))}
                className="mt-4 w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-red-200 text-red-700 font-semibold hover:bg-red-50"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </aside>

          <section className="lg:col-span-9">
            <Outlet />
          </section>
        </div>
      </div>
    </div>
  )
}

