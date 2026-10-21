import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUser, logout } from '../api/auth'
import api from '../api/axios'

export default function Navbar({ title, onMenuClick }) {
  const navigate = useNavigate()
  const user = getUser()

  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [showNotifications, setShowNotifications] = useState(false)

  const notificationRef = useRef(null)

  // Fetch notifications
  async function fetchNotifications() {
    try {
      const response = await api.get('/notifications')

      setNotifications(response.data.notifications || [])
      setUnreadCount(response.data.unreadCount || 0)
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
    }
  }

  // Load notifications when Navbar appears
  useEffect(() => {
    if (!user) return

    fetchNotifications()

    // Refresh every 30 seconds
    const interval = setInterval(() => {
      fetchNotifications()
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Mark one notification as read
  async function handleNotificationClick(notification) {
    try {
      if (!notification.read) {
        await api.put(`/notifications/${notification._id}/read`)
      }

      setNotifications((current) =>
        current.map((item) =>
          item._id === notification._id
            ? { ...item, read: true }
            : item
        )
      )

      setUnreadCount((current) =>
        notification.read ? current : Math.max(current - 1, 0)
      )

      setShowNotifications(false)

      if (notification.link) {
        navigate(notification.link)
      }
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
    }
  }

  // Mark all notifications as read
  async function handleMarkAllRead() {
    try {
      await api.put('/notifications/read-all')

      setNotifications((current) =>
        current.map((notification) => ({
          ...notification,
          read: true,
        }))
      )

      setUnreadCount(0)
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error)
    }
  }

  function handleLogout() {
    logout()
    navigate('/', { replace: true })
  }

  // Convert date into readable text
  function formatNotificationTime(date) {
    const notificationDate = new Date(date)
    const now = new Date()

    const difference = Math.floor(
      (now - notificationDate) / 1000
    )

    if (difference < 60) {
      return 'Just now'
    }

    if (difference < 3600) {
      return `${Math.floor(difference / 60)} min ago`
    }

    if (difference < 86400) {
      return `${Math.floor(difference / 3600)} hr ago`
    }

    if (difference < 604800) {
      return `${Math.floor(difference / 86400)} day ago`
    }

    return notificationDate.toLocaleDateString()
  }

  return (
    <header className="bg-navy-800 border-b border-navy-600 px-4 md:px-6 h-16 flex items-center justify-between shrink-0">

      {/* Left side */}
      <div className="flex items-center gap-3">

        <button
          onClick={onMenuClick}
          className="md:hidden text-slate-400 hover:text-slate-50 p-1 -ml-1"
          aria-label="Open menu"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              d="M3 6h18M3 12h18M3 18h18"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <h1 className="text-lg font-serif font-semibold text-slate-50">
          {title}
        </h1>

      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">

        {/* Notification Bell */}
        {user && (
          <div
            ref={notificationRef}
            className="relative"
          >

            <button
              type="button"
              onClick={() =>
                setShowNotifications((current) => !current)
              }
              className="relative flex h-9 w-9 items-center justify-center rounded-lg text-slate-300 hover:bg-navy-700 hover:text-white transition"
              aria-label="Notifications"
            >

              {/* Bell icon */}
              <svg
                width="21"
                height="21"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                <path
                  d="M13.73 21a2 2 0 0 1-3.46 0"
                  strokeLinecap="round"
                />
              </svg>

              {/* Unread badge */}
              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 flex min-w-[18px] h-[18px] items-center justify-center rounded-full bg-rust-500 px-1 text-[10px] font-bold text-white">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}

            </button>

            {/* Notification dropdown */}
            {showNotifications && (
              <div className="absolute right-0 top-12 z-50 w-[350px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-navy-600 bg-navy-800 shadow-2xl">

                {/* Header */}
                <div className="flex items-center justify-between border-b border-navy-600 px-4 py-3">

                  <div>
                    <h3 className="text-sm font-semibold text-slate-50">
                      Notifications
                    </h3>

                    {unreadCount > 0 && (
                      <p className="mt-0.5 text-xs text-slate-400">
                        {unreadCount} unread
                      </p>
                    )}
                  </div>

                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={handleMarkAllRead}
                      className="text-xs font-medium text-teal-400 hover:text-teal-300"
                    >
                      Mark all as read
                    </button>
                  )}

                </div>

                {/* Notifications */}
                <div className="max-h-[400px] overflow-y-auto">

                  {notifications.length === 0 ? (
                    <div className="px-4 py-10 text-center">
                      <div className="mb-3 text-3xl">
                        🔔
                      </div>

                      <p className="text-sm font-medium text-slate-300">
                        No notifications
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        You're all caught up.
                      </p>
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <button
                        key={notification._id}
                        type="button"
                        onClick={() =>
                          handleNotificationClick(notification)
                        }
                        className={`w-full border-b border-navy-700 px-4 py-3 text-left transition hover:bg-navy-700 ${
                          !notification.read
                            ? 'bg-navy-700/50'
                            : ''
                        }`}
                      >

                        <div className="flex gap-3">

                          {/* Status indicator */}
                          <div className="pt-1.5">
                            <span
                              className={`block h-2 w-2 rounded-full ${
                                notification.read
                                  ? 'bg-slate-600'
                                  : 'bg-teal-400'
                              }`}
                            />
                          </div>

                          <div className="min-w-0 flex-1">

                            <div className="flex items-start justify-between gap-2">

                              <p className="text-sm font-semibold text-slate-100">
                                {notification.title}
                              </p>

                              <span className="shrink-0 text-[10px] text-slate-500">
                                {formatNotificationTime(
                                  notification.createdAt
                                )}
                              </span>

                            </div>

                            <p className="mt-1 text-xs leading-5 text-slate-400">
                              {notification.message}
                            </p>

                          </div>

                        </div>

                      </button>
                    ))
                  )}

                </div>

              </div>
            )}

          </div>
        )}

        {/* User information */}
        {user && (
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-slate-50 leading-tight">
              {user.name}
            </p>

            <p className="text-xs text-slate-400 capitalize leading-tight">
              {user.role}
            </p>
          </div>
        )}

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="text-sm font-medium text-rust-400 border border-rust-600/30 bg-rust-600/15 rounded px-3 py-1.5 hover:bg-rust-600/25"
        >
          Logout
        </button>

      </div>

    </header>
  )
}