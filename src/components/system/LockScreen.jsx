import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../../store/useStore'
import { FaUser, FaFingerprint, FaArrowRight } from 'react-icons/fa'

const LockScreen = ({ onUnlock }) => {
    const { darkMode, wallpaper } = useStore()
    const [password, setPassword] = useState('')
    const [error, setError] = useState(false)
    const [currentTime, setCurrentTime] = useState(new Date())
    const [showPasswordField, setShowPasswordField] = useState(false)
    const inputRef = useRef(null)

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000)
        return () => clearInterval(timer)
    }, [])

    useEffect(() => {
        if (showPasswordField && inputRef.current) {
            inputRef.current.focus()
        }
    }, [showPasswordField])

    const formatTime = (date) => {
        return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
    }

    const formatDate = (date) => {
        return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (password === '' || password.toLowerCase() === 'password' || password === '1234') {
            onUnlock()
        } else {
            setError(true)
            setPassword('')
            setTimeout(() => setError(false), 500)
        }
    }

    const handleClick = () => {
        if (!showPasswordField) {
            setShowPasswordField(true)
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
            style={{
                backgroundImage: `url(${wallpaper})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}
            onClick={handleClick}
        >
            {/* Blur overlay */}
            <div className="absolute inset-0 backdrop-blur-xl bg-black/30" />

            {/* Content */}
            <div className="relative z-10 text-center text-white">
                {/* Time */}
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mb-8"
                >
                    <div className="text-8xl font-light tracking-tight">{formatTime(currentTime)}</div>
                    <div className="text-2xl mt-2 opacity-80">{formatDate(currentTime)}</div>
                </motion.div>

                {/* User Avatar */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-col items-center"
                >
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center mb-4 shadow-2xl">
                        <FaUser className="text-4xl text-white" />
                    </div>
                    <div className="text-xl font-medium mb-4">User</div>
                </motion.div>

                {/* Password Field */}
                <AnimatePresence>
                    {showPasswordField && (
                        <motion.form
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                            onSubmit={handleSubmit}
                            onClick={e => e.stopPropagation()}
                            className="mt-4"
                        >
                            <motion.div
                                animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}
                                transition={{ duration: 0.4 }}
                            >
                                <input
                                    ref={inputRef}
                                    type="password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="Enter Password"
                                    className={`w-64 px-4 py-3 rounded-full bg-white/20 backdrop-blur-md border-2 text-white placeholder-white/50 text-center outline-none transition-colors ${
                                        error ? 'border-red-500' : 'border-white/30 focus:border-white/60'
                                    }`}
                                />
                            </motion.div>
                            <div className="flex items-center justify-center gap-4 mt-4">
                                <button
                                    type="submit"
                                    className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/30 transition-colors"
                                >
                                    <FaArrowRight />
                                </button>
                            </div>
                            <div className="mt-4 text-sm opacity-60">
                                Press Enter or click arrow to unlock
                            </div>
                            <div className="mt-2 text-xs opacity-40">
                                Hint: Leave empty, or enter "password" or "1234"
                            </div>
                        </motion.form>
                    )}
                </AnimatePresence>

                {!showPasswordField && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="mt-4 text-sm opacity-60"
                    >
                        Click anywhere to unlock
                    </motion.div>
                )}

                {/* Touch ID hint */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-2 opacity-40"
                >
                    <FaFingerprint className="text-xl" />
                    <span className="text-sm">Touch ID or Enter Password</span>
                </motion.div>
            </div>
        </motion.div>
    )
}

export default LockScreen
