import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../../store/useStore'
import { FaPlus, FaTimes } from 'react-icons/fa'

const MissionControl = () => {
    const {
        windows,
        currentDesktop = 1,
        setCurrentDesktop,
        desktops = [1],
        addDesktop,
        removeDesktop,
        moveWindowToDesktop,
        isMissionControlOpen,
        toggleMissionControl,
        darkMode
    } = useStore()

    const [selectedDesktop, setSelectedDesktop] = useState(currentDesktop)
    const [draggedWindow, setDraggedWindow] = useState(null)

    useEffect(() => {
        const handleKeyDown = (e) => {
            // F3 键或 Ctrl+Up 触发 Mission Control
            if (e.key === 'F3' || (e.ctrlKey && e.key === 'ArrowUp')) {
                e.preventDefault()
                toggleMissionControl?.()
            }
            // Escape 关闭
            if (e.key === 'Escape' && isMissionControlOpen) {
                toggleMissionControl?.()
            }
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [isMissionControlOpen, toggleMissionControl])

    if (!isMissionControlOpen) return null

    // 获取指定桌面的窗口
    const getWindowsForDesktop = (desktopId) => {
        return windows.filter(w =>
            w.isOpen && (w.desktop === desktopId || (!w.desktop && desktopId === 1))
        )
    }

    // 处理桌面切换
    const handleDesktopSelect = (desktopId) => {
        setCurrentDesktop?.(desktopId)
        setSelectedDesktop(desktopId)
        setTimeout(() => toggleMissionControl?.(), 300)
    }

    // 处理添加新桌面
    const handleAddDesktop = () => {
        const newDesktopId = Math.max(...(desktops || [1])) + 1
        addDesktop?.(newDesktopId)
    }

    // 处理删除桌面
    const handleRemoveDesktop = (desktopId) => {
        if ((desktops || [1]).length > 1) {
            removeDesktop?.(desktopId)
            if (selectedDesktop === desktopId) {
                setSelectedDesktop((desktops || [1])[0])
            }
        }
    }

    // 处理窗口拖拽
    const handleWindowDragStart = (windowId) => {
        setDraggedWindow(windowId)
    }

    const handleWindowDrop = (desktopId) => {
        if (draggedWindow) {
            moveWindowToDesktop?.(draggedWindow, desktopId)
            setDraggedWindow(null)
        }
    }

    // 生成缩略图内容
    const getAppThumbnail = (windowComponent) => {
        const thumbnails = {
            'finder': '📁 Finder',
            'safari': '🌐 Safari',
            'messages': '💬 Messages',
            'music': '🎵 Music',
            'terminal': '⌨️ Terminal',
            'calculator': '🔢 Calculator',
            'notes': '📝 Notes',
            'settings': '⚙️ Settings',
            'vscode': '💻 VS Code'
        }
        return thumbnails[windowComponent] || '📄 App'
    }

    return (
        <AnimatePresence>
            {isMissionControlOpen && (
                <motion.div
                    className={`fixed inset-0 z-[100] backdrop-blur-xl transition-colors duration-500 ${
                        darkMode ? 'bg-black/80' : 'bg-black/70'
                    }`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    onClick={toggleMissionControl}
                >
                    {/* 顶部桌面缩略图栏 */}
                    <motion.div
                        className="absolute top-4 sm:top-8 left-0 right-0 px-2 sm:px-8"
                        initial={{ y: -100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1, duration: 0.3 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-center gap-2 sm:gap-4 overflow-x-auto pb-2">
                            {/* 桌面缩略图 */}
                            {(desktops || [1]).map((desktopId) => (
                                <motion.div
                                    key={desktopId}
                                    className="relative group"
                                    whileHover={{ scale: 1.05 }}
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={() => handleWindowDrop(desktopId)}
                                >
                                    <div
                                        onClick={() => handleDesktopSelect(desktopId)}
                                        className={`
                                            relative w-32 h-20 sm:w-48 sm:h-32 rounded-lg overflow-hidden cursor-pointer flex-shrink-0
                                            ${selectedDesktop === desktopId
                                                ? 'ring-2 sm:ring-4 ring-blue-500 ring-opacity-70'
                                                : 'ring-1 sm:ring-2 ring-white/20'}
                                            transition-all duration-200
                                        `}
                                    >
                                        {/* 桌面背景缩略图 */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/30 to-blue-600/30" />

                                        {/* 窗口预览 */}
                                        <div className="absolute inset-2 flex flex-wrap gap-1">
                                            {getWindowsForDesktop(desktopId).slice(0, 4).map((window, idx) => (
                                                <div
                                                    key={window.id}
                                                    className="w-[45%] h-[45%] bg-white/10 backdrop-blur rounded text-[8px] flex items-center justify-center text-white/70"
                                                >
                                                    {getAppThumbnail(window.component)}
                                                </div>
                                            ))}
                                        </div>

                                        {/* 桌面标签 */}
                                        <div className="absolute bottom-1 left-1 right-1 text-center">
                                            <span className="text-xs text-white/90 font-medium">
                                                Desktop {desktopId}
                                            </span>
                                        </div>
                                    </div>

                                    {/* 删除按钮 */}
                                    {(desktops || [1]).length > 1 && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleRemoveDesktop(desktopId)
                                            }}
                                            className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <FaTimes className="text-white text-xs" />
                                        </button>
                                    )}
                                </motion.div>
                            ))}

                            {/* 添加新桌面按钮 */}
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleAddDesktop}
                                className="w-32 h-20 sm:w-48 sm:h-32 rounded-lg border-2 border-dashed border-white/30 hover:border-white/50 flex items-center justify-center transition-colors flex-shrink-0"
                            >
                                <div className="text-white/50 hover:text-white/70 transition-colors">
                                    <FaPlus className="text-2xl mb-1" />
                                    <div className="text-xs">Add Desktop</div>
                                </div>
                            </motion.button>
                        </div>
                    </motion.div>

                    {/* 当前桌面的窗口展示 */}
                    <motion.div
                        className="absolute top-28 sm:top-48 left-2 sm:left-8 right-2 sm:right-8 bottom-16 sm:bottom-24 overflow-y-auto"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.3 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="text-white/70 text-xs sm:text-sm mb-2 sm:mb-4">
                            Desktop {selectedDesktop} - {getWindowsForDesktop(selectedDesktop).length} window(s)
                        </div>

                        {/* 窗口网格 */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-4 max-w-6xl mx-auto">
                            {getWindowsForDesktop(selectedDesktop).map((window, index) => (
                                <motion.div
                                    key={window.id}
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 0.3 + index * 0.05 }}
                                    whileHover={{ scale: 1.05, y: -5 }}
                                    draggable
                                    onDragStart={() => handleWindowDragStart(window.id)}
                                    className="relative group cursor-move"
                                >
                                    <div className="aspect-[4/3] bg-white/10 backdrop-blur-md rounded-lg overflow-hidden border border-white/20 shadow-2xl">
                                        {/* 窗口标题栏 */}
                                        <div className="h-6 bg-gray-800/50 flex items-center px-2">
                                            <div className="flex gap-1">
                                                <div className="w-2 h-2 rounded-full bg-red-500" />
                                                <div className="w-2 h-2 rounded-full bg-yellow-500" />
                                                <div className="w-2 h-2 rounded-full bg-green-500" />
                                            </div>
                                            <span className="text-[10px] text-white/70 ml-2 truncate">
                                                {window.title}
                                            </span>
                                        </div>

                                        {/* 窗口内容预览 */}
                                        <div className="h-full flex items-center justify-center text-4xl">
                                            {getAppThumbnail(window.component).split(' ')[0]}
                                        </div>
                                    </div>

                                    {/* 窗口标题 */}
                                    <div className="absolute -bottom-6 left-0 right-0 text-center">
                                        <span className="text-xs text-white/70">
                                            {window.title}
                                        </span>
                                    </div>
                                </motion.div>
                            ))}

                            {/* 空状态 */}
                            {getWindowsForDesktop(selectedDesktop).length === 0 && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="col-span-4 flex flex-col items-center justify-center h-64 text-white/30"
                                >
                                    <div className="text-6xl mb-4">🖥️</div>
                                    <p className="text-lg">No windows on this desktop</p>
                                    <p className="text-sm mt-2">Open some apps to see them here</p>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>

                    {/* 底部提示 */}
                    <motion.div
                        className="absolute bottom-8 left-0 right-0 text-center text-white/50 text-sm"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        <p>Click on a desktop to switch • Drag windows to move them between desktops</p>
                        <p className="text-xs mt-1">Press Escape to exit</p>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default MissionControl