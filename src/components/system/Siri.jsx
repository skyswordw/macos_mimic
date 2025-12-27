import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../../store/useStore'
import { FaMicrophone, FaTimes, FaVolumeUp, FaCloudSun, FaCalendarAlt, FaMusic, FaClock, FaCalculator, FaSearch } from 'react-icons/fa'

const Siri = ({ isOpen, onClose }) => {
    const { darkMode, openWindow, addNotification, toggleDarkMode } = useStore()
    const [isListening, setIsListening] = useState(false)
    const [query, setQuery] = useState('')
    const [response, setResponse] = useState(null)
    const [isProcessing, setIsProcessing] = useState(false)
    const inputRef = useRef(null)

    useEffect(() => {
        if (isOpen) {
            setQuery('')
            setResponse(null)
            setTimeout(() => inputRef.current?.focus(), 100)
        }
    }, [isOpen])

    const suggestions = [
        { text: "What's the weather?", icon: FaCloudSun },
        { text: "Open Calculator", icon: FaCalculator },
        { text: "What time is it?", icon: FaClock },
        { text: "Play some music", icon: FaMusic },
        { text: "Show my calendar", icon: FaCalendarAlt },
        { text: "Turn on dark mode", icon: FaVolumeUp },
    ]

    const processQuery = (text) => {
        const lowerText = text.toLowerCase()
        setIsProcessing(true)

        setTimeout(() => {
            let result = { text: '', action: null }

            if (lowerText.includes('weather')) {
                result = { text: "It's currently 72°F and sunny in San Francisco.", icon: FaCloudSun }
            } else if (lowerText.includes('time')) {
                const time = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
                result = { text: `The time is ${time}.`, icon: FaClock }
            } else if (lowerText.includes('calculator') || lowerText.includes('calculate')) {
                result = { text: "Opening Calculator...", action: () => openWindow('calculator', 'Calculator', 'calculator') }
            } else if (lowerText.includes('music') || lowerText.includes('play')) {
                result = { text: "Opening Music...", action: () => openWindow('music', 'Music', 'music') }
            } else if (lowerText.includes('calendar')) {
                result = { text: "Opening Calendar...", action: () => openWindow('calendar', 'Calendar', 'calendar') }
            } else if (lowerText.includes('dark mode')) {
                if (lowerText.includes('on') || lowerText.includes('enable')) {
                    result = { text: "Turning on dark mode...", action: () => { if (!darkMode) toggleDarkMode() } }
                } else if (lowerText.includes('off') || lowerText.includes('disable')) {
                    result = { text: "Turning off dark mode...", action: () => { if (darkMode) toggleDarkMode() } }
                } else {
                    result = { text: "Toggling dark mode...", action: toggleDarkMode }
                }
            } else if (lowerText.includes('safari') || lowerText.includes('browser')) {
                result = { text: "Opening Safari...", action: () => openWindow('safari', 'Safari', 'safari') }
            } else if (lowerText.includes('notes') || lowerText.includes('note')) {
                result = { text: "Opening Notes...", action: () => openWindow('notes', 'Notes', 'notes') }
            } else if (lowerText.includes('terminal')) {
                result = { text: "Opening Terminal...", action: () => openWindow('terminal', 'Terminal', 'terminal') }
            } else if (lowerText.includes('settings') || lowerText.includes('preferences')) {
                result = { text: "Opening Settings...", action: () => openWindow('settings', 'Settings', 'settings') }
            } else if (lowerText.includes('hello') || lowerText.includes('hi')) {
                result = { text: "Hello! How can I help you today?" }
            } else if (lowerText.includes('thank')) {
                result = { text: "You're welcome! Is there anything else?" }
            } else if (lowerText.includes('who are you') || lowerText.includes('what are you')) {
                result = { text: "I'm Siri, your virtual assistant. I can help you with various tasks on your Mac." }
            } else if (lowerText.includes('joke')) {
                const jokes = [
                    "Why do programmers prefer dark mode? Because light attracts bugs!",
                    "There are only 10 types of people in the world: those who understand binary and those who don't.",
                    "Why did the developer go broke? Because he used up all his cache!"
                ]
                result = { text: jokes[Math.floor(Math.random() * jokes.length)] }
            } else {
                result = { text: `I found some results for "${text}". Would you like me to search the web?`, icon: FaSearch }
            }

            setResponse(result)
            if (result.action) {
                setTimeout(() => {
                    result.action()
                    onClose()
                }, 1000)
            }
            setIsProcessing(false)
        }, 1000)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (query.trim()) {
            processQuery(query)
        }
    }

    const handleSuggestionClick = (suggestion) => {
        setQuery(suggestion.text)
        processQuery(suggestion.text)
    }

    if (!isOpen) return null

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[60] flex items-start justify-center pt-20"
                onClick={onClose}
            >
                {/* Backdrop */}
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

                {/* Siri Panel */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    onClick={e => e.stopPropagation()}
                    className={`relative w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl ${
                        darkMode ? 'bg-gray-900/95' : 'bg-white/95'
                    } backdrop-blur-xl`}
                >
                    {/* Header */}
                    <div className="p-4 flex items-center justify-between border-b border-gray-200/20">
                        <div className="flex items-center gap-3">
                            <motion.div
                                animate={isListening || isProcessing ? { scale: [1, 1.2, 1] } : {}}
                                transition={{ duration: 1, repeat: Infinity }}
                                className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 flex items-center justify-center"
                            >
                                <FaMicrophone className="text-white" />
                            </motion.div>
                            <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Siri</span>
                        </div>
                        <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-500/20">
                            <FaTimes className={darkMode ? 'text-white' : 'text-gray-600'} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        {/* Input */}
                        <form onSubmit={handleSubmit}>
                            <input
                                ref={inputRef}
                                type="text"
                                value={query}
                                onChange={e => setQuery(e.target.value)}
                                placeholder="Ask Siri anything..."
                                className={`w-full px-4 py-3 rounded-xl text-lg outline-none ${
                                    darkMode ? 'bg-gray-800 text-white placeholder-gray-400' : 'bg-gray-100 text-gray-900 placeholder-gray-500'
                                }`}
                            />
                        </form>

                        {/* Response */}
                        <AnimatePresence mode="wait">
                            {isProcessing ? (
                                <motion.div
                                    key="processing"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="mt-6 flex items-center justify-center"
                                >
                                    <motion.div
                                        animate={{ scale: [1, 1.2, 1] }}
                                        transition={{ duration: 0.8, repeat: Infinity }}
                                        className="flex gap-1"
                                    >
                                        {[0, 1, 2].map(i => (
                                            <motion.div
                                                key={i}
                                                animate={{ y: [0, -10, 0] }}
                                                transition={{ duration: 0.5, delay: i * 0.1, repeat: Infinity }}
                                                className="w-3 h-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-500"
                                            />
                                        ))}
                                    </motion.div>
                                </motion.div>
                            ) : response ? (
                                <motion.div
                                    key="response"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className={`mt-6 p-4 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}
                                >
                                    <div className="flex items-start gap-3">
                                        {response.icon && <response.icon className="text-purple-500 text-xl mt-1" />}
                                        <p className={`text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>{response.text}</p>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="suggestions"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="mt-6"
                                >
                                    <div className={`text-sm mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Suggestions</div>
                                    <div className="grid grid-cols-2 gap-2">
                                        {suggestions.map((suggestion, i) => (
                                            <motion.button
                                                key={i}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => handleSuggestionClick(suggestion)}
                                                className={`p-3 rounded-xl text-left flex items-center gap-2 ${
                                                    darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'
                                                }`}
                                            >
                                                <suggestion.icon className="text-purple-500" />
                                                <span className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>{suggestion.text}</span>
                                            </motion.button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Gradient bar */}
                    <div className="h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500" />
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}

export default Siri
