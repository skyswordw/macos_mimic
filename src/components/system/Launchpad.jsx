import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../../store/useStore'
import { FaSearch, FaFolderOpen, FaSafari, FaTerminal, FaCalculator, FaRegStickyNote, FaCog, FaCode, FaMusic, FaComments, FaImage, FaCalendarAlt, FaCloudSun, FaEnvelope, FaTasks, FaChartArea, FaFileImage, FaFileAlt, FaClock, FaChartLine, FaMapMarkerAlt, FaVideo, FaBook, FaAddressBook, FaPodcast, FaHdd, FaInfoCircle, FaNewspaper, FaFont, FaCamera, FaMicrophone, FaStore, FaBookOpen, FaMagic } from 'react-icons/fa'

const apps = [
    { id: 'finder', title: 'Finder', icon: FaFolderOpen, color: 'text-blue-500' },
    { id: 'safari', title: 'Safari', icon: FaSafari, color: 'text-blue-400' },
    { id: 'mail', title: 'Mail', icon: FaEnvelope, color: 'text-blue-500' },
    { id: 'messages', title: 'Messages', icon: FaComments, color: 'text-green-500' },
    { id: 'facetime', title: 'FaceTime', icon: FaVideo, color: 'text-green-500' },
    { id: 'music', title: 'Music', icon: FaMusic, color: 'text-red-500' },
    { id: 'photos', title: 'Photos', icon: FaImage, color: 'text-pink-500' },
    { id: 'books', title: 'Books', icon: FaBook, color: 'text-orange-500' },
    { id: 'maps', title: 'Maps', icon: FaMapMarkerAlt, color: 'text-green-600' },
    { id: 'stocks', title: 'Stocks', icon: FaChartLine, color: 'text-green-500' },
    { id: 'clock', title: 'Clock', icon: FaClock, color: 'text-orange-500' },
    { id: 'textedit', title: 'TextEdit', icon: FaFileAlt, color: 'text-gray-600' },
    { id: 'preview', title: 'Preview', icon: FaFileImage, color: 'text-orange-400' },
    { id: 'calendar', title: 'Calendar', icon: FaCalendarAlt, color: 'text-red-500' },
    { id: 'reminders', title: 'Reminders', icon: FaTasks, color: 'text-orange-500' },
    { id: 'weather', title: 'Weather', icon: FaCloudSun, color: 'text-cyan-500' },
    { id: 'vscode', title: 'VS Code', icon: FaCode, color: 'text-blue-600' },
    { id: 'terminal', title: 'Terminal', icon: FaTerminal, color: 'text-gray-700' },
    { id: 'activity-monitor', title: 'Activity Monitor', icon: FaChartArea, color: 'text-purple-500' },
    { id: 'calculator', title: 'Calculator', icon: FaCalculator, color: 'text-gray-600' },
    { id: 'notes', title: 'Notes', icon: FaRegStickyNote, color: 'text-yellow-500' },
    { id: 'contacts', title: 'Contacts', icon: FaAddressBook, color: 'text-brown-500' },
    { id: 'podcasts', title: 'Podcasts', icon: FaPodcast, color: 'text-purple-500' },
    { id: 'disk-utility', title: 'Disk Utility', icon: FaHdd, color: 'text-gray-500' },
    { id: 'system-info', title: 'System Info', icon: FaInfoCircle, color: 'text-blue-500' },
    { id: 'news', title: 'News', icon: FaNewspaper, color: 'text-red-500' },
    { id: 'font-book', title: 'Font Book', icon: FaFont, color: 'text-green-600' },
    { id: 'photo-booth', title: 'Photo Booth', icon: FaCamera, color: 'text-red-500' },
    { id: 'voice-memos', title: 'Voice Memos', icon: FaMicrophone, color: 'text-red-500' },
    { id: 'app-store', title: 'App Store', icon: FaStore, color: 'text-blue-500' },
    { id: 'dictionary', title: 'Dictionary', icon: FaBookOpen, color: 'text-amber-600' },
    { id: 'shortcuts', title: 'Shortcuts', icon: FaMagic, color: 'text-pink-500' },
    { id: 'settings', title: 'Settings', icon: FaCog, color: 'text-gray-500' },
]

// Items per page based on screen size
const ITEMS_PER_PAGE = 21 // 7 columns x 3 rows for desktop

const Launchpad = () => {
    const { isLaunchpadOpen, toggleLaunchpad, openWindow, darkMode } = useStore()
    const [search, setSearch] = useState('')
    const [currentPage, setCurrentPage] = useState(0)
    const inputRef = useRef(null)

    // Keyboard handler for ESC and arrow keys
    useEffect(() => {
        if (!isLaunchpadOpen) return

        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                toggleLaunchpad()
            } else if (e.key === 'ArrowLeft' && currentPage > 0) {
                setCurrentPage(prev => prev - 1)
            } else if (e.key === 'ArrowRight') {
                // Calculate totalPages inline to avoid dependency issues
                const currentFilteredApps = apps.filter(app =>
                    app.title.toLowerCase().includes(search.toLowerCase())
                )
                const totalPages = Math.ceil(currentFilteredApps.length / ITEMS_PER_PAGE)
                if (currentPage < totalPages - 1) {
                    setCurrentPage(prev => prev + 1)
                }
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [isLaunchpadOpen, toggleLaunchpad, currentPage, search])

    // Reset page when search changes
    useEffect(() => {
        setCurrentPage(0)
    }, [search])

    // Focus search input when opened
    useEffect(() => {
        if (isLaunchpadOpen) {
            setSearch('')
            setCurrentPage(0)
            setTimeout(() => inputRef.current?.focus(), 100)
        }
    }, [isLaunchpadOpen])

    if (!isLaunchpadOpen) return null

    const filteredApps = apps.filter(app => app.title.toLowerCase().includes(search.toLowerCase()))

    // Pagination
    const totalPages = Math.ceil(filteredApps.length / ITEMS_PER_PAGE)
    const paginatedApps = filteredApps.slice(
        currentPage * ITEMS_PER_PAGE,
        (currentPage + 1) * ITEMS_PER_PAGE
    )

    const handleAppClick = (app) => {
        openWindow(app.id, app.title, app.id)
        toggleLaunchpad()
    }

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className={`absolute inset-0 z-40 backdrop-blur-2xl flex flex-col items-center pt-12 sm:pt-20 transition-colors duration-500 ${
                    darkMode ? 'bg-black/30' : 'bg-white/20'
                }`}
                onClick={toggleLaunchpad}
            >
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1, duration: 0.3 }}
                    className={`w-11/12 sm:w-96 h-10 rounded-lg flex items-center px-3 gap-2 mb-8 sm:mb-16 border transition-colors duration-500 ${
                        darkMode
                            ? 'bg-gray-700/50 border-gray-600/50'
                            : 'bg-gray-200/50 border-white/20'
                    }`}
                    onClick={(e) => e.stopPropagation()}
                >
                    <FaSearch className={`transition-colors duration-500 ${darkMode ? 'text-gray-300' : 'text-gray-500'}`} />
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Search"
                        className={`bg-transparent border-none outline-none flex-1 transition-colors duration-500 ${
                            darkMode ? 'text-white placeholder-gray-400' : 'text-white placeholder-gray-500'
                        }`}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </motion.div>

                <div
                    className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 gap-6 sm:gap-8 md:gap-12 max-w-5xl px-4"
                    onClick={(e) => e.stopPropagation()}
                >
                    {paginatedApps.map((app, index) => (
                        <motion.div
                            key={app.id}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{
                                delay: 0.15 + index * 0.02,
                                type: "spring",
                                stiffness: 300,
                                damping: 20
                            }}
                            whileHover={{ scale: 1.1, y: -5 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex flex-col items-center gap-2 sm:gap-4 cursor-pointer"
                            onClick={() => handleAppClick(app)}
                        >
                            <motion.div
                                className={`w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-2xl sm:rounded-[2rem] shadow-xl flex items-center justify-center text-3xl sm:text-4xl md:text-5xl ${
                                    darkMode ? 'bg-gray-700/90' : 'bg-white/90'
                                }`}
                                whileHover={{
                                    boxShadow: darkMode
                                        ? "0 0 30px rgba(255, 255, 255, 0.3)"
                                        : "0 0 30px rgba(0, 0, 0, 0.2)"
                                }}
                            >
                                <app.icon className={app.color} />
                            </motion.div>
                            <span className="text-white font-medium text-xs sm:text-sm drop-shadow-md">{app.title}</span>
                        </motion.div>
                    ))}
                </div>

                {/* Page dots */}
                {totalPages > 1 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex items-center justify-center gap-2 mt-8 sm:mt-12"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {Array.from({ length: totalPages }).map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentPage(index)}
                                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                                    currentPage === index
                                        ? 'bg-white w-6'
                                        : 'bg-white/40 hover:bg-white/60'
                                }`}
                            />
                        ))}
                    </motion.div>
                )}

                {/* Empty state */}
                {paginatedApps.length === 0 && search && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-white/60 text-center mt-8"
                    >
                        <p className="text-lg">No apps found</p>
                        <p className="text-sm mt-1">Try a different search term</p>
                    </motion.div>
                )}
            </motion.div>
        </AnimatePresence>
    )
}

export default Launchpad
