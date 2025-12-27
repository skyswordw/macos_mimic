import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaTrash, FaTrashRestore, FaFile, FaFolder, FaImage, FaFileAlt, FaMusic, FaVideo, FaExclamationTriangle, FaTimes, FaCheck } from 'react-icons/fa'
import { useStore } from '../store/useStore'

const getFileIcon = (type) => {
    switch (type) {
        case 'folder': return FaFolder
        case 'image': return FaImage
        case 'document': return FaFileAlt
        case 'music': return FaMusic
        case 'video': return FaVideo
        default: return FaFile
    }
}

const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now - date

    if (diff < 60000) return 'Just now'
    if (diff < 3600000) return `${Math.floor(diff / 60000)} min ago`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} hours ago`
    if (diff < 604800000) return `${Math.floor(diff / 86400000)} days ago`

    return date.toLocaleDateString()
}

const Trash = () => {
    const { darkMode, trashItems, restoreFromTrash, emptyTrash, deleteFromTrash } = useStore()
    const [selectedItems, setSelectedItems] = useState([])
    const [showEmptyConfirm, setShowEmptyConfirm] = useState(false)
    const [viewMode, setViewMode] = useState('list') // list or grid

    const toggleSelect = (id) => {
        setSelectedItems(prev =>
            prev.includes(id)
                ? prev.filter(i => i !== id)
                : [...prev, id]
        )
    }

    const selectAll = () => {
        if (selectedItems.length === trashItems.length) {
            setSelectedItems([])
        } else {
            setSelectedItems(trashItems.map(item => item.id))
        }
    }

    const handleRestore = () => {
        selectedItems.forEach(id => restoreFromTrash(id))
        setSelectedItems([])
    }

    const handleDelete = () => {
        selectedItems.forEach(id => deleteFromTrash(id))
        setSelectedItems([])
    }

    const handleEmptyTrash = () => {
        emptyTrash()
        setShowEmptyConfirm(false)
        setSelectedItems([])
    }

    const isEmpty = trashItems.length === 0

    return (
        <div className={`w-full h-full flex flex-col ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
            {/* Toolbar */}
            <div className={`h-12 flex items-center justify-between px-4 border-b ${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex items-center gap-3">
                    <FaTrash className={`w-5 h-5 ${isEmpty ? (darkMode ? 'text-gray-600' : 'text-gray-300') : (darkMode ? 'text-gray-400' : 'text-gray-500')}`} />
                    <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        Trash
                    </span>
                    <span className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        {trashItems.length} {trashItems.length === 1 ? 'item' : 'items'}
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    {selectedItems.length > 0 && (
                        <>
                            <button
                                onClick={handleRestore}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                                    darkMode ? 'bg-green-600 hover:bg-green-500 text-white' : 'bg-green-500 hover:bg-green-600 text-white'
                                }`}
                            >
                                <FaTrashRestore className="w-3.5 h-3.5" />
                                Restore
                            </button>
                            <button
                                onClick={handleDelete}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                                    darkMode ? 'bg-red-600 hover:bg-red-500 text-white' : 'bg-red-500 hover:bg-red-600 text-white'
                                }`}
                            >
                                <FaTimes className="w-3.5 h-3.5" />
                                Delete
                            </button>
                        </>
                    )}
                    {!isEmpty && (
                        <button
                            onClick={() => setShowEmptyConfirm(true)}
                            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                                darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                            }`}
                        >
                            Empty Trash
                        </button>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto">
                {isEmpty ? (
                    <div className="flex flex-col items-center justify-center h-full">
                        <FaTrash className={`w-20 h-20 mb-4 ${darkMode ? 'text-gray-700' : 'text-gray-200'}`} />
                        <h2 className={`text-xl font-medium mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            Trash is Empty
                        </h2>
                        <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                            Items you delete will appear here
                        </p>
                    </div>
                ) : (
                    <div className="p-4">
                        {/* Select All */}
                        <div className={`flex items-center gap-2 mb-4 pb-2 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                            <input
                                type="checkbox"
                                checked={selectedItems.length === trashItems.length}
                                onChange={selectAll}
                                className="w-4 h-4 rounded"
                            />
                            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                {selectedItems.length > 0 ? `${selectedItems.length} selected` : 'Select all'}
                            </span>
                        </div>

                        {/* Items List */}
                        <div className="space-y-2">
                            {trashItems.map(item => {
                                const Icon = getFileIcon(item.type)
                                const isSelected = selectedItems.includes(item.id)

                                return (
                                    <motion.div
                                        key={item.id}
                                        layout
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                                            isSelected
                                                ? darkMode ? 'bg-blue-900/30 border border-blue-500/50' : 'bg-blue-50 border border-blue-200'
                                                : darkMode ? 'bg-gray-800/50 hover:bg-gray-800 border border-transparent' : 'bg-gray-50 hover:bg-gray-100 border border-transparent'
                                        }`}
                                        onClick={() => toggleSelect(item.id)}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={isSelected}
                                            onChange={() => {}}
                                            className="w-4 h-4 rounded"
                                        />
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                            darkMode ? 'bg-gray-700' : 'bg-gray-200'
                                        }`}>
                                            <Icon className={`w-5 h-5 ${
                                                item.type === 'folder' ? 'text-yellow-500' :
                                                item.type === 'image' ? 'text-pink-500' :
                                                item.type === 'music' ? 'text-purple-500' :
                                                item.type === 'video' ? 'text-red-500' :
                                                darkMode ? 'text-gray-400' : 'text-gray-500'
                                            }`} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className={`font-medium truncate ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                                {item.name}
                                            </p>
                                            <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                                {item.originalPath || 'Desktop'}
                                            </p>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                                {formatDate(item.deletedAt)}
                                            </span>
                                            {item.size && (
                                                <span className={`text-xs ${darkMode ? 'text-gray-600' : 'text-gray-300'}`}>
                                                    {item.size}
                                                </span>
                                            )}
                                        </div>
                                    </motion.div>
                                )
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* Empty Trash Confirmation Modal */}
            <AnimatePresence>
                {showEmptyConfirm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-50 flex items-center justify-center bg-black/50"
                        onClick={() => setShowEmptyConfirm(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className={`w-80 rounded-xl shadow-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="p-6 text-center">
                                <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                                    darkMode ? 'bg-red-900/30' : 'bg-red-100'
                                }`}>
                                    <FaExclamationTriangle className="w-8 h-8 text-red-500" />
                                </div>
                                <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                    Empty Trash?
                                </h3>
                                <p className={`text-sm mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                    {trashItems.length} {trashItems.length === 1 ? 'item' : 'items'} will be permanently deleted. This action cannot be undone.
                                </p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setShowEmptyConfirm(false)}
                                        className={`flex-1 py-2 rounded-lg transition-colors ${
                                            darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                                        }`}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleEmptyTrash}
                                        className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                                    >
                                        Empty Trash
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default Trash
