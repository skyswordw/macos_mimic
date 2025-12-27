import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../store/useStore'
import { FaPlay, FaPlus, FaTrash, FaEdit, FaMagic, FaClock, FaHome, FaMusic, FaCamera, FaEnvelope, FaCalendarAlt, FaCloudSun, FaStar, FaCog, FaFolder, FaGlobe, FaBell, FaBatteryFull, FaWifi, FaMoon, FaSun, FaVolumeUp, FaVolumeMute, FaLock, FaSearch, FaTimes, FaCheck, FaArrowRight, FaDesktop } from 'react-icons/fa'

const categories = [
    { id: 'all', label: 'All Shortcuts', icon: FaFolder },
    { id: 'favorites', label: 'Favorites', icon: FaStar },
    { id: 'automation', label: 'Automation', icon: FaMagic },
    { id: 'productivity', label: 'Productivity', icon: FaClock },
    { id: 'media', label: 'Media', icon: FaMusic },
    { id: 'system', label: 'System', icon: FaCog },
]

const defaultShortcuts = [
    {
        id: 1,
        name: 'Good Morning',
        icon: FaSun,
        color: 'bg-gradient-to-br from-yellow-400 to-orange-500',
        category: 'automation',
        favorite: true,
        actions: ['Turn on lights', 'Read weather', 'Play morning playlist', 'Show calendar'],
        trigger: 'Daily at 7:00 AM'
    },
    {
        id: 2,
        name: 'Work Focus',
        icon: FaDesktop,
        color: 'bg-gradient-to-br from-blue-500 to-purple-600',
        category: 'productivity',
        favorite: true,
        actions: ['Enable Do Not Disturb', 'Open VS Code', 'Open Safari', 'Play focus music'],
        trigger: 'Manual'
    },
    {
        id: 3,
        name: 'Night Mode',
        icon: FaMoon,
        color: 'bg-gradient-to-br from-indigo-600 to-purple-800',
        category: 'automation',
        favorite: false,
        actions: ['Enable Dark Mode', 'Reduce brightness', 'Set volume to 30%', 'Enable Night Shift'],
        trigger: 'Sunset'
    },
    {
        id: 4,
        name: 'Quick Screenshot',
        icon: FaCamera,
        color: 'bg-gradient-to-br from-pink-500 to-red-500',
        category: 'productivity',
        favorite: true,
        actions: ['Take screenshot', 'Save to Desktop', 'Copy to clipboard'],
        trigger: 'Keyboard shortcut'
    },
    {
        id: 5,
        name: 'Low Battery Mode',
        icon: FaBatteryFull,
        color: 'bg-gradient-to-br from-green-500 to-teal-600',
        category: 'system',
        favorite: false,
        actions: ['Reduce brightness to 50%', 'Disable background apps', 'Enable battery saver'],
        trigger: 'When battery below 20%'
    },
    {
        id: 6,
        name: 'Mute Everything',
        icon: FaVolumeMute,
        color: 'bg-gradient-to-br from-gray-600 to-gray-800',
        category: 'system',
        favorite: false,
        actions: ['Mute system volume', 'Enable Do Not Disturb', 'Pause music'],
        trigger: 'Manual'
    },
    {
        id: 7,
        name: 'Share Current Page',
        icon: FaGlobe,
        color: 'bg-gradient-to-br from-cyan-500 to-blue-600',
        category: 'productivity',
        favorite: false,
        actions: ['Get Safari URL', 'Copy to clipboard', 'Show notification'],
        trigger: 'Manual'
    },
    {
        id: 8,
        name: 'Meeting Prep',
        icon: FaCalendarAlt,
        color: 'bg-gradient-to-br from-red-500 to-pink-600',
        category: 'productivity',
        favorite: true,
        actions: ['Check calendar', 'Open Notes', 'Enable Do Not Disturb', 'Join meeting link'],
        trigger: '5 min before event'
    },
    {
        id: 9,
        name: 'Weather Report',
        icon: FaCloudSun,
        color: 'bg-gradient-to-br from-blue-400 to-cyan-500',
        category: 'automation',
        favorite: false,
        actions: ['Get current weather', 'Show notification', 'Speak weather summary'],
        trigger: 'Manual'
    },
    {
        id: 10,
        name: 'Lock Mac',
        icon: FaLock,
        color: 'bg-gradient-to-br from-gray-700 to-gray-900',
        category: 'system',
        favorite: true,
        actions: ['Lock screen', 'Pause media'],
        trigger: 'Keyboard shortcut'
    },
]

const actionIcons = {
    'Turn on lights': FaSun,
    'Read weather': FaCloudSun,
    'Play morning playlist': FaMusic,
    'Show calendar': FaCalendarAlt,
    'Enable Do Not Disturb': FaBell,
    'Open VS Code': FaDesktop,
    'Open Safari': FaGlobe,
    'Play focus music': FaMusic,
    'Enable Dark Mode': FaMoon,
    'Reduce brightness': FaSun,
    'Set volume to 30%': FaVolumeUp,
    'Enable Night Shift': FaMoon,
    'Take screenshot': FaCamera,
    'Save to Desktop': FaFolder,
    'Copy to clipboard': FaDesktop,
    'Reduce brightness to 50%': FaSun,
    'Disable background apps': FaCog,
    'Enable battery saver': FaBatteryFull,
    'Mute system volume': FaVolumeMute,
    'Pause music': FaMusic,
    'Get Safari URL': FaGlobe,
    'Show notification': FaBell,
    'Check calendar': FaCalendarAlt,
    'Open Notes': FaEdit,
    'Join meeting link': FaGlobe,
    'Get current weather': FaCloudSun,
    'Speak weather summary': FaVolumeUp,
    'Lock screen': FaLock,
    'Pause media': FaMusic,
}

const Shortcuts = () => {
    const { darkMode, addNotification } = useStore()
    const [shortcuts, setShortcuts] = useState(defaultShortcuts)
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [selectedShortcut, setSelectedShortcut] = useState(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [isRunning, setIsRunning] = useState(null)
    const [showEditor, setShowEditor] = useState(false)

    const filteredShortcuts = shortcuts.filter(shortcut => {
        const matchesCategory = selectedCategory === 'all' ||
            (selectedCategory === 'favorites' && shortcut.favorite) ||
            shortcut.category === selectedCategory
        const matchesSearch = shortcut.name.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesCategory && matchesSearch
    })

    const runShortcut = async (shortcut) => {
        setIsRunning(shortcut.id)
        addNotification({
            title: 'Shortcuts',
            message: `Running "${shortcut.name}"...`,
            app: 'Shortcuts'
        })

        // Simulate running each action
        for (let i = 0; i < shortcut.actions.length; i++) {
            await new Promise(resolve => setTimeout(resolve, 500))
        }

        setIsRunning(null)
        addNotification({
            title: 'Shortcuts',
            message: `"${shortcut.name}" completed successfully!`,
            app: 'Shortcuts'
        })
    }

    const toggleFavorite = (id) => {
        setShortcuts(prev => prev.map(s =>
            s.id === id ? { ...s, favorite: !s.favorite } : s
        ))
    }

    const deleteShortcut = (id) => {
        setShortcuts(prev => prev.filter(s => s.id !== id))
        if (selectedShortcut?.id === id) {
            setSelectedShortcut(null)
        }
    }

    return (
        <div className={`h-full flex ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
            {/* Sidebar */}
            <div className={`w-64 border-r flex flex-col ${darkMode ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-white'}`}>
                <div className="p-4">
                    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                        <FaSearch className="text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search shortcuts..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="bg-transparent flex-1 outline-none text-sm"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-auto">
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`w-full px-4 py-2.5 flex items-center gap-3 text-left ${
                                selectedCategory === cat.id
                                    ? (darkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white')
                                    : (darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100')
                            }`}
                        >
                            <cat.icon className={selectedCategory === cat.id ? 'text-white' : 'text-gray-400'} />
                            <span>{cat.label}</span>
                            {cat.id !== 'all' && (
                                <span className="ml-auto text-xs opacity-60">
                                    {shortcuts.filter(s => cat.id === 'favorites' ? s.favorite : s.category === cat.id).length}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                <div className={`p-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <button
                        onClick={() => setShowEditor(true)}
                        className="w-full py-2 rounded-lg bg-blue-500 text-white flex items-center justify-center gap-2 hover:bg-blue-600"
                    >
                        <FaPlus /> New Shortcut
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto">
                {selectedShortcut ? (
                    /* Shortcut Detail View */
                    <div className="p-6">
                        <button
                            onClick={() => setSelectedShortcut(null)}
                            className="text-blue-500 mb-4 flex items-center gap-1"
                        >
                            ← Back to shortcuts
                        </button>

                        <div className="flex items-start gap-6 mb-8">
                            <div className={`w-24 h-24 rounded-2xl ${selectedShortcut.color} flex items-center justify-center text-4xl text-white shadow-lg`}>
                                <selectedShortcut.icon />
                            </div>
                            <div className="flex-1">
                                <h1 className="text-3xl font-bold mb-2">{selectedShortcut.name}</h1>
                                <p className="text-gray-500 mb-4">Trigger: {selectedShortcut.trigger}</p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => runShortcut(selectedShortcut)}
                                        disabled={isRunning === selectedShortcut.id}
                                        className="px-4 py-2 rounded-lg bg-blue-500 text-white flex items-center gap-2 hover:bg-blue-600 disabled:opacity-50"
                                    >
                                        {isRunning === selectedShortcut.id ? (
                                            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                                                <FaCog />
                                            </motion.div>
                                        ) : (
                                            <FaPlay />
                                        )}
                                        {isRunning === selectedShortcut.id ? 'Running...' : 'Run'}
                                    </button>
                                    <button
                                        onClick={() => toggleFavorite(selectedShortcut.id)}
                                        className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}
                                    >
                                        <FaStar className={selectedShortcut.favorite ? 'text-yellow-500' : ''} />
                                    </button>
                                    <button
                                        className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}
                                    >
                                        <FaEdit />
                                    </button>
                                    <button
                                        onClick={() => deleteShortcut(selectedShortcut.id)}
                                        className="p-2 rounded-lg bg-red-500 text-white"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Actions List */}
                        <div className={`rounded-2xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                            <h3 className="font-semibold mb-4">Actions</h3>
                            <div className="space-y-3">
                                {selectedShortcut.actions.map((action, i) => {
                                    const ActionIcon = actionIcons[action] || FaCog
                                    return (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                            className={`flex items-center gap-4 p-3 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
                                        >
                                            <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center text-white">
                                                {i + 1}
                                            </div>
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white">
                                                <ActionIcon />
                                            </div>
                                            <span className="flex-1">{action}</span>
                                            <FaArrowRight className="text-gray-400" />
                                        </motion.div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Shortcuts Grid */
                    <div className="p-6">
                        <h2 className="text-2xl font-bold mb-6">
                            {categories.find(c => c.id === selectedCategory)?.label}
                        </h2>

                        {filteredShortcuts.length > 0 ? (
                            <div className="grid grid-cols-3 gap-4">
                                {filteredShortcuts.map(shortcut => (
                                    <motion.div
                                        key={shortcut.id}
                                        whileHover={{ scale: 1.02, y: -2 }}
                                        whileTap={{ scale: 0.98 }}
                                        className={`relative group rounded-2xl overflow-hidden cursor-pointer ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
                                        onClick={() => setSelectedShortcut(shortcut)}
                                    >
                                        <div className={`h-32 ${shortcut.color} flex items-center justify-center`}>
                                            <shortcut.icon className="text-5xl text-white drop-shadow-lg" />
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-semibold mb-1">{shortcut.name}</h3>
                                            <p className="text-sm text-gray-500">{shortcut.actions.length} actions</p>
                                        </div>

                                        {/* Quick actions */}
                                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); runShortcut(shortcut) }}
                                                className="p-2 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30"
                                            >
                                                {isRunning === shortcut.id ? (
                                                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                                                        <FaCog />
                                                    </motion.div>
                                                ) : (
                                                    <FaPlay />
                                                )}
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); toggleFavorite(shortcut.id) }}
                                                className="p-2 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30"
                                            >
                                                <FaStar className={shortcut.favorite ? 'text-yellow-300' : ''} />
                                            </button>
                                        </div>

                                        {shortcut.favorite && (
                                            <div className="absolute top-2 left-2">
                                                <FaStar className="text-yellow-400" />
                                            </div>
                                        )}
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20">
                                <FaMagic className="text-6xl mx-auto mb-4 text-gray-300" />
                                <h3 className="text-xl font-semibold mb-2">No shortcuts found</h3>
                                <p className="text-gray-500">Create a new shortcut to get started</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* New Shortcut Editor Modal */}
            <AnimatePresence>
                {showEditor && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/50 flex items-center justify-center z-50"
                        onClick={() => setShowEditor(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className={`w-96 rounded-2xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
                            onClick={e => e.stopPropagation()}
                        >
                            <h2 className="text-xl font-bold mb-4">New Shortcut</h2>
                            <p className="text-gray-500 mb-6">
                                Shortcut editor is coming soon! For now, explore the pre-made shortcuts.
                            </p>
                            <button
                                onClick={() => setShowEditor(false)}
                                className="w-full py-2 rounded-lg bg-blue-500 text-white"
                            >
                                Got it
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default Shortcuts
