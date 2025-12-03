import React, { useEffect } from 'react'
import { useStore } from '../../store/useStore'
import { motion, AnimatePresence } from 'framer-motion'
import { FaTimes, FaBell, FaCheckDouble, FaTrash, FaEnvelope, FaBatteryQuarter, FaApple, FaCalendarAlt, FaMusic, FaExclamationTriangle } from 'react-icons/fa'

// App icons mapping
const appIcons = {
    'System': FaApple,
    'Messages': FaEnvelope,
    'Battery': FaBatteryQuarter,
    'Calendar': FaCalendarAlt,
    'Music': FaMusic,
    'Reminder': FaBell,
    'Warning': FaExclamationTriangle,
}

const appColors = {
    'System': 'bg-gray-500',
    'Messages': 'bg-green-500',
    'Battery': 'bg-yellow-500',
    'Calendar': 'bg-red-500',
    'Music': 'bg-pink-500',
    'Reminder': 'bg-purple-500',
    'Warning': 'bg-orange-500',
}

// Format time ago
const formatTimeAgo = (timestamp) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diff = Math.floor((now - time) / 1000)

    if (diff < 60) return 'Just now'
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`
    return time.toLocaleDateString()
}

const NotificationCenter = () => {
    const {
        isNotificationCenterOpen,
        toggleNotificationCenter,
        darkMode,
        notifications,
        dismissNotification,
        markNotificationRead,
        markAllNotificationsRead,
        clearAllNotifications,
        addNotification,
        openWindow
    } = useStore()

    // Handle notification click
    const handleNotificationClick = (notif) => {
        markNotificationRead(notif.id)

        // Execute action based on notification type
        if (notif.action) {
            switch (notif.action.type) {
                case 'open-app':
                    openWindow(notif.action.appId, notif.action.appTitle || notif.action.appId, notif.action.appId)
                    toggleNotificationCenter()
                    break
                case 'open-url':
                    window.open(notif.action.url, '_blank')
                    break
                case 'custom':
                    if (notif.action.callback) {
                        notif.action.callback()
                    }
                    break
                default:
                    // Default behavior based on app
                    const appMap = {
                        'Messages': { id: 'messages', title: 'Messages' },
                        'Calendar': { id: 'calendar', title: 'Calendar' },
                        'Mail': { id: 'mail', title: 'Mail' },
                        'Music': { id: 'music', title: 'Music' },
                        'Reminder': { id: 'reminders', title: 'Reminders' }
                    }

                    if (appMap[notif.app]) {
                        openWindow(appMap[notif.app].id, appMap[notif.app].title, appMap[notif.app].id)
                        toggleNotificationCenter()
                    }
            }
        }
    }

    // Add sample notifications on first load if empty
    useEffect(() => {
        if (notifications.length === 0) {
            // Add welcome notification
            setTimeout(() => {
                addNotification({
                    title: 'Welcome to macOS',
                    message: 'Enjoy exploring the simulated macOS experience!',
                    app: 'System',
                    action: {
                        type: 'open-app',
                        appId: 'finder',
                        appTitle: 'Finder'
                    }
                })
            }, 1000)

            setTimeout(() => {
                addNotification({
                    title: 'Tips & Tricks',
                    message: 'Press Cmd+Shift+3 to take a screenshot, or Cmd+K to open Spotlight.',
                    app: 'System'
                })
            }, 2000)

            setTimeout(() => {
                addNotification({
                    title: 'New Message',
                    message: 'You have 3 unread messages.',
                    app: 'Messages',
                    action: {
                        type: 'open-app',
                        appId: 'messages',
                        appTitle: 'Messages'
                    }
                })
            }, 3000)
        }
    }, [])

    const unreadCount = notifications.filter(n => !n.read).length

    return (
        <AnimatePresence>
            {isNotificationCenterOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-40 bg-transparent"
                        onClick={toggleNotificationCenter}
                    />
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className={`absolute right-0 top-7 sm:top-8 bottom-0 w-full sm:w-80 backdrop-blur-2xl border-l shadow-2xl z-50 p-3 sm:p-4 flex flex-col transition-colors duration-500 ${
                            darkMode
                                ? 'bg-gray-900/30 border-gray-600/30'
                                : 'bg-white/20 border-white/20'
                        }`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center gap-2">
                                <h3 className="text-white font-semibold text-lg">Notifications</h3>
                                {unreadCount > 0 && (
                                    <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                                        {unreadCount}
                                    </span>
                                )}
                            </div>
                            <button onClick={toggleNotificationCenter} className="text-white/60 hover:text-white">
                                <FaTimes />
                            </button>
                        </div>

                        {/* Action buttons */}
                        {notifications.length > 0 && (
                            <div className="flex gap-2 mb-3">
                                <button
                                    onClick={markAllNotificationsRead}
                                    className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs transition-colors ${
                                        darkMode
                                            ? 'bg-gray-700/50 hover:bg-gray-600/50 text-gray-300'
                                            : 'bg-white/10 hover:bg-white/20 text-white/80'
                                    }`}
                                >
                                    <FaCheckDouble className="text-[10px]" />
                                    Mark all read
                                </button>
                                <button
                                    onClick={clearAllNotifications}
                                    className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs transition-colors ${
                                        darkMode
                                            ? 'bg-gray-700/50 hover:bg-red-600/50 text-gray-300 hover:text-red-300'
                                            : 'bg-white/10 hover:bg-red-500/20 text-white/80 hover:text-red-300'
                                    }`}
                                >
                                    <FaTrash className="text-[10px]" />
                                    Clear all
                                </button>
                            </div>
                        )}

                        {/* Notifications list */}
                        <div className="flex-1 flex flex-col gap-2 overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="flex-1 flex flex-col items-center justify-center text-white/50">
                                    <FaBell className="text-4xl mb-3 opacity-50" />
                                    <p className="text-sm">No notifications</p>
                                </div>
                            ) : (
                                notifications.map(notif => {
                                    const IconComponent = appIcons[notif.app] || FaBell
                                    const bgColor = appColors[notif.app] || 'bg-blue-500'

                                    return (
                                        <motion.div
                                            key={notif.id}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            layout
                                            className={`backdrop-blur-md rounded-xl p-3 border shadow-sm transition-all group ${
                                                notif.action ? 'cursor-pointer' : 'cursor-default'
                                            } ${
                                                darkMode
                                                    ? 'bg-gray-800/40 border-gray-600/30 hover:bg-gray-700/50'
                                                    : 'bg-white/10 border-white/10 hover:bg-white/20'
                                            } ${!notif.read ? 'ring-1 ring-blue-500/30' : ''}`}
                                            onClick={() => handleNotificationClick(notif)}
                                        >
                                            <div className="flex justify-between items-start mb-1">
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-5 h-5 rounded flex items-center justify-center ${bgColor}`}>
                                                        <IconComponent className="text-white text-[10px]" />
                                                    </div>
                                                    <span className="text-xs text-white/80 font-medium">{notif.app}</span>
                                                    {!notif.read && (
                                                        <span className="w-2 h-2 rounded-full bg-blue-500" />
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] text-white/50">
                                                        {formatTimeAgo(notif.timestamp)}
                                                    </span>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            dismissNotification(notif.id)
                                                        }}
                                                        className="opacity-0 group-hover:opacity-100 text-white/40 hover:text-white/80 transition-opacity"
                                                    >
                                                        <FaTimes className="text-xs" />
                                                    </button>
                                                </div>
                                            </div>
                                            <h4 className="text-white font-medium text-sm">{notif.title}</h4>
                                            <p className="text-white/70 text-xs mt-0.5 line-clamp-2">{notif.message}</p>

                                            {/* Action buttons */}
                                            {notif.action && (
                                                <div className="mt-2 pt-2 border-t border-white/10 flex gap-2">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            handleNotificationClick(notif)
                                                        }}
                                                        className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-medium transition-colors ${
                                                            darkMode
                                                                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                                                : 'bg-blue-500 hover:bg-blue-600 text-white'
                                                        }`}
                                                    >
                                                        {notif.action.label || 'Open'}
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            dismissNotification(notif.id)
                                                        }}
                                                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                                                            darkMode
                                                                ? 'hover:bg-gray-600/50 text-gray-300'
                                                                : 'hover:bg-white/20 text-white/80'
                                                        }`}
                                                    >
                                                        Dismiss
                                                    </button>
                                                </div>
                                            )}
                                        </motion.div>
                                    )
                                })
                            )}
                        </div>

                        {/* Today's date widget */}
                        <div className={`mt-3 p-3 rounded-xl backdrop-blur-md border ${
                            darkMode
                                ? 'bg-gray-800/30 border-gray-600/30'
                                : 'bg-white/10 border-white/10'
                        }`}>
                            <div className="text-center">
                                <div className="text-red-500 text-xs font-semibold uppercase">
                                    {new Date().toLocaleDateString('en-US', { weekday: 'long' })}
                                </div>
                                <div className="text-white text-3xl font-light">
                                    {new Date().getDate()}
                                </div>
                                <div className="text-white/60 text-sm">
                                    {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}

export default NotificationCenter
