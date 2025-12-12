import React, { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../../store/useStore'
import {
    FaFolderOpen, FaSafari, FaTerminal, FaCalculator, FaRegStickyNote,
    FaCog, FaTrash, FaCode, FaMusic, FaComments, FaImage, FaCalendarAlt,
    FaCloudSun, FaEnvelope, FaTasks, FaChartArea, FaFileImage, FaFileAlt
} from 'react-icons/fa'

const appIcons = {
    'finder': { icon: FaFolderOpen, color: 'bg-blue-500' },
    'safari': { icon: FaSafari, color: 'bg-blue-400' },
    'mail': { icon: FaEnvelope, color: 'bg-blue-600' },
    'messages': { icon: FaComments, color: 'bg-green-500' },
    'music': { icon: FaMusic, color: 'bg-red-500' },
    'photos': { icon: FaImage, color: 'bg-gradient-to-br from-pink-500 to-yellow-500' },
    'textedit': { icon: FaFileAlt, color: 'bg-gray-500' },
    'preview': { icon: FaFileImage, color: 'bg-orange-400' },
    'calendar': { icon: FaCalendarAlt, color: 'bg-red-500' },
    'reminders': { icon: FaTasks, color: 'bg-orange-500' },
    'weather': { icon: FaCloudSun, color: 'bg-cyan-500' },
    'vscode': { icon: FaCode, color: 'bg-blue-600' },
    'terminal': { icon: FaTerminal, color: 'bg-gray-800' },
    'activity-monitor': { icon: FaChartArea, color: 'bg-green-600' },
    'calculator': { icon: FaCalculator, color: 'bg-gray-600' },
    'notes': { icon: FaRegStickyNote, color: 'bg-yellow-500' },
    'settings': { icon: FaCog, color: 'bg-gray-500' },
    'trash': { icon: FaTrash, color: 'bg-gray-600' },
}

const AppSwitcher = () => {
    const { windows, activeWindowId, focusWindow, darkMode } = useStore()
    const [isVisible, setIsVisible] = useState(false)
    const [selectedIndex, setSelectedIndex] = useState(0)

    // Get open windows sorted by z-index (most recent first)
    const openWindows = windows
        .filter(w => w.isOpen)
        .sort((a, b) => b.zIndex - a.zIndex)

    const handleKeyDown = useCallback((e) => {
        // Cmd+Tab or Alt+Tab to open switcher
        if ((e.metaKey || e.altKey) && e.key === 'Tab') {
            e.preventDefault()

            if (openWindows.length === 0) return

            if (!isVisible) {
                setIsVisible(true)
                setSelectedIndex(openWindows.length > 1 ? 1 : 0)
            } else {
                // Cycle through apps
                if (e.shiftKey) {
                    setSelectedIndex((prev) => (prev - 1 + openWindows.length) % openWindows.length)
                } else {
                    setSelectedIndex((prev) => (prev + 1) % openWindows.length)
                }
            }
        }

        // Arrow keys when visible
        if (isVisible) {
            if (e.key === 'ArrowRight') {
                e.preventDefault()
                setSelectedIndex((prev) => (prev + 1) % openWindows.length)
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault()
                setSelectedIndex((prev) => (prev - 1 + openWindows.length) % openWindows.length)
            } else if (e.key === 'Escape') {
                e.preventDefault()
                setIsVisible(false)
            }
        }
    }, [isVisible, openWindows.length])

    const handleKeyUp = useCallback((e) => {
        // Release Cmd/Alt to select the app
        if ((e.key === 'Meta' || e.key === 'Alt') && isVisible) {
            if (openWindows[selectedIndex]) {
                focusWindow(openWindows[selectedIndex].id)
            }
            setIsVisible(false)
        }
    }, [isVisible, selectedIndex, openWindows, focusWindow])

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown)
        window.addEventListener('keyup', handleKeyUp)
        return () => {
            window.removeEventListener('keydown', handleKeyDown)
            window.removeEventListener('keyup', handleKeyUp)
        }
    }, [handleKeyDown, handleKeyUp])

    if (!isVisible || openWindows.length === 0) return null

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="fixed inset-0 flex items-center justify-center z-[9999] pointer-events-none"
            >
                <motion.div
                    className={`rounded-2xl p-4 shadow-2xl pointer-events-auto ${
                        darkMode
                            ? 'bg-gray-800/90 border border-gray-700'
                            : 'bg-white/90 border border-gray-200'
                    } backdrop-blur-xl`}
                >
                    <div className="flex items-center gap-2">
                        {openWindows.map((window, index) => {
                            const appConfig = appIcons[window.id] || { icon: FaFolderOpen, color: 'bg-gray-500' }
                            const Icon = appConfig.icon
                            const isSelected = index === selectedIndex

                            return (
                                <motion.div
                                    key={window.id}
                                    whileHover={{ scale: 1.05 }}
                                    onClick={() => {
                                        focusWindow(window.id)
                                        setIsVisible(false)
                                    }}
                                    className={`flex flex-col items-center gap-2 p-3 rounded-xl cursor-pointer transition-all ${
                                        isSelected
                                            ? darkMode
                                                ? 'bg-gray-700 ring-2 ring-blue-500'
                                                : 'bg-gray-200 ring-2 ring-blue-500'
                                            : ''
                                    }`}
                                >
                                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${appConfig.color} shadow-lg`}>
                                        <Icon className="text-white text-3xl" />
                                    </div>
                                    <span className={`text-xs font-medium max-w-[80px] truncate ${
                                        darkMode ? 'text-white' : 'text-gray-800'
                                    }`}>
                                        {window.title}
                                    </span>
                                </motion.div>
                            )
                        })}
                    </div>

                    {/* Selected app title */}
                    <div className={`text-center mt-3 text-sm font-medium ${
                        darkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                        {openWindows[selectedIndex]?.title || 'No apps open'}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}

export default AppSwitcher
