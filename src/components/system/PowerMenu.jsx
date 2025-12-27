import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../../store/useStore'
import { FaPowerOff, FaRedo, FaMoon, FaSignOutAlt, FaLock, FaTimes } from 'react-icons/fa'

const PowerMenu = ({ isOpen, onClose, onAction }) => {
    const { darkMode } = useStore()

    const options = [
        { id: 'sleep', label: 'Sleep', icon: FaMoon, description: 'Put your Mac to sleep' },
        { id: 'restart', label: 'Restart...', icon: FaRedo, description: 'Restart your Mac' },
        { id: 'shutdown', label: 'Shut Down...', icon: FaPowerOff, description: 'Turn off your Mac' },
        { id: 'lock', label: 'Lock Screen', icon: FaLock, description: 'Lock your screen', shortcut: '⌃⌘Q' },
        { id: 'logout', label: 'Log Out User...', icon: FaSignOutAlt, description: 'Log out of your account', shortcut: '⇧⌘Q' },
    ]

    const handleAction = (actionId) => {
        onAction(actionId)
        onClose()
    }

    if (!isOpen) return null

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[70] flex items-center justify-center"
                onClick={onClose}
            >
                {/* Backdrop */}
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

                {/* Menu */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    onClick={e => e.stopPropagation()}
                    className={`relative w-80 rounded-2xl overflow-hidden shadow-2xl ${
                        darkMode ? 'bg-gray-800/95' : 'bg-white/95'
                    } backdrop-blur-xl`}
                >
                    {/* Header */}
                    <div className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center">
                                    <FaPowerOff className="text-white" />
                                </div>
                                <div>
                                    <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Power Options</div>
                                    <div className="text-xs text-gray-500">Choose an action</div>
                                </div>
                            </div>
                            <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-500/20">
                                <FaTimes className={darkMode ? 'text-white' : 'text-gray-600'} />
                            </button>
                        </div>
                    </div>

                    {/* Options */}
                    <div className="p-2">
                        {options.map((option, index) => (
                            <motion.button
                                key={option.id}
                                whileHover={{ backgroundColor: darkMode ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.1)' }}
                                onClick={() => handleAction(option.id)}
                                className={`w-full p-3 rounded-lg flex items-center gap-3 text-left ${
                                    index > 0 && index < 3 ? '' : ''
                                }`}
                            >
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                                    option.id === 'shutdown' ? 'bg-red-500/20 text-red-500' :
                                    option.id === 'restart' ? 'bg-orange-500/20 text-orange-500' :
                                    option.id === 'sleep' ? 'bg-purple-500/20 text-purple-500' :
                                    option.id === 'lock' ? 'bg-blue-500/20 text-blue-500' :
                                    'bg-gray-500/20 text-gray-500'
                                }`}>
                                    <option.icon className="text-lg" />
                                </div>
                                <div className="flex-1">
                                    <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{option.label}</div>
                                    <div className="text-xs text-gray-500">{option.description}</div>
                                </div>
                                {option.shortcut && (
                                    <div className="text-xs text-gray-400 font-mono">{option.shortcut}</div>
                                )}
                            </motion.button>
                        ))}
                    </div>

                    {/* Cancel button */}
                    <div className={`p-3 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                        <button
                            onClick={onClose}
                            className={`w-full py-2 rounded-lg font-medium ${
                                darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                            }`}
                        >
                            Cancel
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}

export default PowerMenu
