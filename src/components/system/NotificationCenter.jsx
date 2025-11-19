import React from 'react'
import { useStore } from '../../store/useStore'
import { motion, AnimatePresence } from 'framer-motion'
import { FaTimes } from 'react-icons/fa'

const NotificationCenter = () => {
    const { isNotificationCenterOpen, toggleNotificationCenter } = useStore()

    const notifications = [
        { id: 1, title: 'Welcome to macOS', message: 'Enjoy your stay!', time: 'Now', app: 'System' },
        { id: 2, title: 'Battery Low', message: 'Connect to power source', time: '10m ago', app: 'System' },
        { id: 3, title: 'New Message', message: 'Hey, how are you?', time: '1h ago', app: 'Messages' },
    ]

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
                        className="absolute right-0 top-8 bottom-0 w-80 bg-white/20 backdrop-blur-2xl border-l border-white/20 shadow-2xl z-50 p-4 flex flex-col gap-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-white font-semibold text-lg">Notifications</h3>
                            <button onClick={toggleNotificationCenter} className="text-white/60 hover:text-white">
                                <FaTimes />
                            </button>
                        </div>

                        <div className="flex flex-col gap-3 overflow-y-auto">
                            {notifications.map(notif => (
                                <div key={notif.id} className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10 shadow-sm hover:bg-white/20 transition-colors cursor-default">
                                    <div className="flex justify-between items-start mb-1">
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 rounded bg-blue-500" />
                                            <span className="text-xs text-white/80 font-medium">{notif.app}</span>
                                        </div>
                                        <span className="text-[10px] text-white/50">{notif.time}</span>
                                    </div>
                                    <h4 className="text-white font-medium text-sm">{notif.title}</h4>
                                    <p className="text-white/70 text-xs mt-0.5">{notif.message}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}

export default NotificationCenter
