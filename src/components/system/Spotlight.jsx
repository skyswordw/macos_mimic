import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../../store/useStore'
import { FaSearch, FaFolderOpen, FaSafari, FaTerminal, FaCalculator, FaRegStickyNote, FaCog, FaCode, FaMusic, FaComments, FaImage, FaCalendarAlt, FaCloudSun, FaEnvelope, FaTasks, FaChartArea, FaFileImage, FaGlobe, FaHistory, FaEquals, FaClock, FaFile, FaRocket, FaFileAlt } from 'react-icons/fa'

const apps = [
    { id: 'finder', title: 'Finder', icon: FaFolderOpen, color: 'text-blue-500', category: 'Applications' },
    { id: 'safari', title: 'Safari', icon: FaSafari, color: 'text-blue-400', category: 'Applications' },
    { id: 'mail', title: 'Mail', icon: FaEnvelope, color: 'text-blue-500', category: 'Applications' },
    { id: 'messages', title: 'Messages', icon: FaComments, color: 'text-green-500', category: 'Applications' },
    { id: 'music', title: 'Music', icon: FaMusic, color: 'text-red-500', category: 'Applications' },
    { id: 'photos', title: 'Photos', icon: FaImage, color: 'text-pink-500', category: 'Applications' },
    { id: 'textedit', title: 'TextEdit', icon: FaFileAlt, color: 'text-gray-600', category: 'Applications' },
    { id: 'preview', title: 'Preview', icon: FaFileImage, color: 'text-orange-400', category: 'Applications' },
    { id: 'calendar', title: 'Calendar', icon: FaCalendarAlt, color: 'text-red-500', category: 'Applications' },
    { id: 'reminders', title: 'Reminders', icon: FaTasks, color: 'text-orange-500', category: 'Applications' },
    { id: 'weather', title: 'Weather', icon: FaCloudSun, color: 'text-cyan-500', category: 'Applications' },
    { id: 'vscode', title: 'VS Code', icon: FaCode, color: 'text-blue-600', category: 'Applications' },
    { id: 'terminal', title: 'Terminal', icon: FaTerminal, color: 'text-gray-700', category: 'Applications' },
    { id: 'activity-monitor', title: 'Activity Monitor', icon: FaChartArea, color: 'text-purple-500', category: 'Applications' },
    { id: 'calculator', title: 'Calculator', icon: FaCalculator, color: 'text-gray-600', category: 'Applications' },
    { id: 'notes', title: 'Notes', icon: FaRegStickyNote, color: 'text-yellow-500', category: 'Applications' },
    { id: 'settings', title: 'Settings', icon: FaCog, color: 'text-gray-500', category: 'Applications' },
    { id: 'launchpad', title: 'Launchpad', icon: FaRocket, color: 'text-gray-500', category: 'Applications' },
]

// 模拟最近文件
const recentFiles = [
    { id: 'recent-1', name: 'presentation.pdf', type: 'PDF Document', icon: FaFile, color: 'text-red-500' },
    { id: 'recent-2', name: 'project-notes.txt', type: 'Text Document', icon: FaFile, color: 'text-gray-500' },
    { id: 'recent-3', name: 'screenshot.png', type: 'Image', icon: FaImage, color: 'text-pink-500' },
]

const Spotlight = () => {
    const { isSpotlightOpen, toggleSpotlight, openWindow, darkMode, recentApps } = useStore()
    const [search, setSearch] = useState('')
    const [selectedIndex, setSelectedIndex] = useState(0)
    const inputRef = useRef(null)

    // 计算器功能
    const evaluateMath = (expression) => {
        try {
            // 安全的数学表达式评估
            const sanitized = expression.replace(/[^0-9+\-*/().%\s]/g, '')
            if (!sanitized || sanitized.trim() === '') return null

            // 使用Function来安全评估
            const result = Function('"use strict";return (' + sanitized + ')')()
            if (typeof result === 'number' && !isNaN(result) && isFinite(result)) {
                return result
            }
            return null
        } catch {
            return null
        }
    }

    const mathResult = evaluateMath(search)

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.metaKey && e.key === 'k') {
                e.preventDefault()
                toggleSpotlight()
            }
            if (e.key === 'Escape' && isSpotlightOpen) {
                toggleSpotlight()
            }
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [isSpotlightOpen, toggleSpotlight])

    useEffect(() => {
        if (isSpotlightOpen) {
            setSearch('')
            setSelectedIndex(0)
            setTimeout(() => inputRef.current?.focus(), 10)
        }
    }, [isSpotlightOpen])

    // 搜索结果
    const filteredApps = search
        ? apps.filter(app => app.title.toLowerCase().includes(search.toLowerCase()))
        : []

    const filteredFiles = search
        ? recentFiles.filter(file => file.name.toLowerCase().includes(search.toLowerCase()))
        : []

    // 构建所有结果列表
    const allResults = []

    // 如果有数学计算结果
    if (mathResult !== null) {
        allResults.push({
            type: 'calculator',
            id: 'calc-result',
            title: `= ${mathResult}`,
            subtitle: 'Calculator',
            icon: FaEquals,
            color: 'text-green-500'
        })
    }

    // 添加应用结果
    filteredApps.forEach(app => {
        allResults.push({
            type: 'app',
            id: app.id,
            title: app.title,
            subtitle: 'Application',
            icon: app.icon,
            color: app.color,
            app
        })
    })

    // 添加文件结果
    filteredFiles.forEach(file => {
        allResults.push({
            type: 'file',
            id: file.id,
            title: file.name,
            subtitle: file.type,
            icon: file.icon,
            color: file.color
        })
    })

    // 如果有搜索词但没结果，添加网页搜索选项
    if (search && allResults.length === 0) {
        allResults.push({
            type: 'web',
            id: 'web-search',
            title: `Search "${search}" on the web`,
            subtitle: 'Web Search',
            icon: FaGlobe,
            color: 'text-blue-500'
        })
    }

    // 键盘导航
    useEffect(() => {
        const handleArrowKeys = (e) => {
            if (!isSpotlightOpen) return

            if (e.key === 'ArrowDown') {
                e.preventDefault()
                setSelectedIndex(prev => Math.min(prev + 1, allResults.length - 1))
            } else if (e.key === 'ArrowUp') {
                e.preventDefault()
                setSelectedIndex(prev => Math.max(prev - 1, 0))
            }
        }
        window.addEventListener('keydown', handleArrowKeys)
        return () => window.removeEventListener('keydown', handleArrowKeys)
    }, [isSpotlightOpen, allResults.length])

    // 重置选择当搜索变化时
    useEffect(() => {
        setSelectedIndex(0)
    }, [search])

    if (!isSpotlightOpen) return null

    const handleOpen = (result) => {
        if (result.type === 'app') {
            openWindow(result.app.id, result.app.title, result.app.id)
        } else if (result.type === 'web') {
            window.open(`https://www.google.com/search?q=${encodeURIComponent(search)}`, '_blank')
        } else if (result.type === 'calculator') {
            // 复制结果到剪贴板
            navigator.clipboard?.writeText(mathResult.toString())
        }
        toggleSpotlight()
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && allResults.length > 0) {
            handleOpen(allResults[selectedIndex])
        }
    }

    // 建议内容（没有搜索时显示）
    const renderSuggestions = () => (
        <div className="py-3">
            {/* 最近应用 */}
            {recentApps.length > 0 && (
                <>
                    <div className={`px-4 py-1 text-xs font-bold flex items-center gap-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        <FaHistory className="text-xs" /> Recent Apps
                    </div>
                    {recentApps.slice(0, 3).map((recentApp) => {
                        const appInfo = apps.find(a => a.id === recentApp.id)
                        if (!appInfo) return null
                        return (
                            <div
                                key={recentApp.id}
                                className={`px-4 py-2 flex items-center gap-3 cursor-pointer transition-colors ${
                                    darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                                }`}
                                onClick={() => {
                                    openWindow(appInfo.id, appInfo.title, appInfo.id)
                                    toggleSpotlight()
                                }}
                            >
                                <appInfo.icon className={`text-xl ${appInfo.color}`} />
                                <span>{appInfo.title}</span>
                            </div>
                        )
                    })}
                </>
            )}

            {/* 快捷提示 */}
            <div className={`px-4 py-1 mt-2 text-xs font-bold flex items-center gap-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                <FaClock className="text-xs" /> Quick Tips
            </div>
            <div className={`px-4 py-2 text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                <p className="mb-1">• Type app names to search</p>
                <p className="mb-1">• Type math expressions (e.g., 2+2)</p>
                <p>• Press Enter to open top result</p>
            </div>
        </div>
    )

    return (
        <AnimatePresence>
            {isSpotlightOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-50 flex justify-center pt-16 sm:pt-32 px-4"
                    onClick={toggleSpotlight}
                >
                    <motion.div
                        initial={{ scale: 0.95, y: -20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.95, y: -20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className={`w-full max-w-[600px] backdrop-blur-xl rounded-xl shadow-2xl overflow-hidden border flex flex-col transition-colors duration-500 max-h-[70vh] ${
                            darkMode
                                ? 'bg-gray-800/90 border-gray-600/50'
                                : 'bg-white/80 border-white/40'
                        }`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* 搜索输入 */}
                        <div className={`h-12 sm:h-16 flex items-center px-3 sm:px-4 gap-3 sm:gap-4 border-b transition-colors duration-500 ${
                            darkMode ? 'border-gray-600/50' : 'border-gray-200/50'
                        }`}>
                            <FaSearch className={`text-lg sm:text-2xl transition-colors duration-500 ${darkMode ? 'text-gray-300' : 'text-gray-400'}`} />
                            <input
                                ref={inputRef}
                                type="text"
                                placeholder="Spotlight Search"
                                className={`flex-1 bg-transparent border-none outline-none text-lg sm:text-2xl transition-colors duration-500 ${
                                    darkMode
                                        ? 'text-gray-100 placeholder-gray-400'
                                        : 'text-gray-700 placeholder-gray-400'
                                }`}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={handleKeyDown}
                            />
                        </div>

                        {/* 搜索结果 */}
                        <div className="overflow-auto">
                            {search ? (
                                allResults.length > 0 ? (
                                    <div className="py-2">
                                        {/* 按类型分组 */}
                                        {mathResult !== null && (
                                            <>
                                                <div className={`px-4 py-1 text-xs font-bold ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                    Calculator
                                                </div>
                                                <div
                                                    className={`px-4 py-3 flex items-center gap-3 cursor-pointer transition-colors ${
                                                        selectedIndex === 0
                                                            ? 'bg-blue-500 text-white'
                                                            : darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                                                    }`}
                                                    onClick={() => handleOpen(allResults[0])}
                                                >
                                                    <FaEquals className={`text-2xl ${selectedIndex === 0 ? 'text-white' : 'text-green-500'}`} />
                                                    <div>
                                                        <div className="text-2xl font-medium">{mathResult}</div>
                                                        <div className={`text-xs ${selectedIndex === 0 ? 'text-white/70' : darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                                            Click to copy result
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        )}

                                        {filteredApps.length > 0 && (
                                            <>
                                                <div className={`px-4 py-1 text-xs font-bold ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                    Applications
                                                </div>
                                                {filteredApps.map((app, i) => {
                                                    const resultIndex = mathResult !== null ? i + 1 : i
                                                    return (
                                                        <div
                                                            key={app.id}
                                                            className={`px-4 py-2 flex items-center gap-3 cursor-pointer transition-colors ${
                                                                selectedIndex === resultIndex
                                                                    ? 'bg-blue-500 text-white'
                                                                    : darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                                                            }`}
                                                            onClick={() => handleOpen({ type: 'app', app })}
                                                        >
                                                            <app.icon className={`text-xl ${selectedIndex === resultIndex ? 'text-white' : app.color}`} />
                                                            <div>
                                                                <span className="text-lg">{app.title}</span>
                                                                <span className={`text-xs ml-2 ${selectedIndex === resultIndex ? 'text-white/70' : darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                                                    Application
                                                                </span>
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                            </>
                                        )}

                                        {filteredFiles.length > 0 && (
                                            <>
                                                <div className={`px-4 py-1 text-xs font-bold ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                    Documents
                                                </div>
                                                {filteredFiles.map((file, i) => {
                                                    const resultIndex = (mathResult !== null ? 1 : 0) + filteredApps.length + i
                                                    return (
                                                        <div
                                                            key={file.id}
                                                            className={`px-4 py-2 flex items-center gap-3 cursor-pointer transition-colors ${
                                                                selectedIndex === resultIndex
                                                                    ? 'bg-blue-500 text-white'
                                                                    : darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                                                            }`}
                                                        >
                                                            <file.icon className={`text-xl ${selectedIndex === resultIndex ? 'text-white' : file.color}`} />
                                                            <div>
                                                                <span className="text-lg">{file.name}</span>
                                                                <span className={`text-xs ml-2 ${selectedIndex === resultIndex ? 'text-white/70' : darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                                                    {file.type}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                            </>
                                        )}

                                        {/* Web搜索选项 */}
                                        {filteredApps.length === 0 && filteredFiles.length === 0 && mathResult === null && (
                                            <div
                                                className={`px-4 py-2 flex items-center gap-3 cursor-pointer transition-colors ${
                                                    selectedIndex === 0
                                                        ? 'bg-blue-500 text-white'
                                                        : darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                                                }`}
                                                onClick={() => handleOpen({ type: 'web' })}
                                            >
                                                <FaGlobe className={`text-xl ${selectedIndex === 0 ? 'text-white' : 'text-blue-500'}`} />
                                                <span className="text-lg">Search "{search}" on the web</span>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className={`py-8 text-center ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                        <FaSearch className="text-4xl mx-auto mb-3 opacity-50" />
                                        <p>No results found</p>
                                    </div>
                                )
                            ) : (
                                renderSuggestions()
                            )}
                        </div>

                        {/* 底部提示 */}
                        <div className={`px-4 py-2 text-xs border-t flex items-center justify-between ${
                            darkMode ? 'border-gray-700 text-gray-500' : 'border-gray-200 text-gray-400'
                        }`}>
                            <span>⌘K to toggle</span>
                            <span>↑↓ to navigate • ↵ to select</span>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default Spotlight
