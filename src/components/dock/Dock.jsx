import React from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useStore } from '../../store/useStore'
import { FaFolderOpen, FaSafari, FaTerminal, FaCalculator, FaRegStickyNote, FaCog, FaTrash, FaCode, FaRocket, FaMusic, FaComments, FaImage, FaCalendarAlt, FaCloudSun, FaEnvelope, FaTasks, FaChartArea, FaFileImage } from 'react-icons/fa'

const apps = [
    { id: 'launchpad', title: 'Launchpad', icon: FaRocket, color: 'text-gray-500' },
    { id: 'finder', title: 'Finder', icon: FaFolderOpen, color: 'text-blue-500' },
    { id: 'safari', title: 'Safari', icon: FaSafari, color: 'text-blue-400' },
    { id: 'mail', title: 'Mail', icon: FaEnvelope, color: 'text-blue-500' },
    { id: 'messages', title: 'Messages', icon: FaComments, color: 'text-green-500' },
    { id: 'music', title: 'Music', icon: FaMusic, color: 'text-red-500' },
    { id: 'photos', title: 'Photos', icon: FaImage, color: 'text-pink-500' },
    { id: 'preview', title: 'Preview', icon: FaFileImage, color: 'text-orange-400' },
    { id: 'calendar', title: 'Calendar', icon: FaCalendarAlt, color: 'text-red-500' },
    { id: 'reminders', title: 'Reminders', icon: FaTasks, color: 'text-orange-500' },
    { id: 'weather', title: 'Weather', icon: FaCloudSun, color: 'text-cyan-500' },
    { id: 'vscode', title: 'VS Code', icon: FaCode, color: 'text-blue-600' },
    { id: 'terminal', title: 'Terminal', icon: FaTerminal, color: 'text-gray-700' },
    { id: 'activity-monitor', title: 'Activity Monitor', icon: FaChartArea, color: 'text-purple-500' },
    { id: 'calculator', title: 'Calculator', icon: FaCalculator, color: 'text-gray-600' },
    { id: 'notes', title: 'Notes', icon: FaRegStickyNote, color: 'text-yellow-500' },
    { id: 'settings', title: 'Settings', icon: FaCog, color: 'text-gray-500' },
    { id: 'trash', title: 'Trash', icon: FaTrash, color: 'text-gray-400' },
]

const DockItem = ({ mouseX, app }) => {
    const { openWindow, windows, toggleLaunchpad, focusWindow, darkMode } = useStore()
    const [showTooltip, setShowTooltip] = React.useState(false)
    const [isBouncing, setIsBouncing] = React.useState(false)

    let ref = React.useRef(null)
    let distance = useTransform(mouseX, (val) => {
        let bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 }
        return val - bounds.x - bounds.width / 2
    })

    // 在移动端使用更小的尺寸
    const isMobile = window.innerWidth < 768
    let widthSync = useTransform(distance, [-150, 0, 150], isMobile ? [32, 56, 32] : [40, 80, 40])
    let width = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 12 })

    const windowState = windows.find(w => w.id === app.id)
    const isOpen = windowState && windowState.isOpen
    const isMinimized = windowState && windowState.isMinimised

    const handleClick = () => {
        setIsBouncing(true)
        setTimeout(() => setIsBouncing(false), 600)

        if (app.id === 'launchpad') {
            toggleLaunchpad()
        } else if (isMinimized) {
            // 如果窗口是最小化状态，恢复它
            focusWindow(app.id)
        } else if (isOpen) {
            // 如果窗口已打开，聚焦它
            focusWindow(app.id)
        } else {
            // 打开新窗口
            openWindow(app.id, app.title, app.id)
        }
    }

    return (
        <div className="flex flex-col items-center gap-1 relative">
            {/* Tooltip */}
            <AnimatePresence>
                {showTooltip && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className={`absolute -top-10 px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap shadow-lg ${
                            darkMode
                                ? 'bg-gray-800/95 text-white border border-gray-600/50'
                                : 'bg-gray-900/90 text-white'
                        }`}
                        style={{ backdropFilter: 'blur(8px)' }}
                    >
                        {app.title}
                    </motion.div>
                )}
            </AnimatePresence>
            <motion.div
                ref={ref}
                data-dock-id={app.id}
                style={{ width }}
                className={`aspect-square rounded-xl backdrop-blur-md border shadow-lg flex items-center justify-center cursor-pointer transition-all relative ${
                    darkMode
                        ? 'bg-white/5 border-white/30 hover:bg-white/15 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]'
                        : 'bg-white/10 border-white/20 hover:bg-white/20 hover:shadow-[0_0_20px_rgba(0,0,0,0.15)]'
                }`}
                onClick={handleClick}
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                animate={isBouncing ? {
                    y: [0, -20, 0, -10, 0],
                    transition: {
                        duration: 0.6,
                        times: [0, 0.25, 0.5, 0.75, 1],
                        ease: "easeInOut"
                    }
                } : {}}
            >
                <app.icon className={`w-3/5 h-3/5 ${app.color}`} />
                {/* 最小化指示器 - 半透明覆盖层 */}
                {isMinimized && (
                    <motion.div
                        className="absolute inset-0 bg-black/20 rounded-xl"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                    />
                )}
            </motion.div>
            {/* 运行指示器 */}
            <motion.div
                className={`w-1 h-1 rounded-full ${darkMode ? 'bg-white' : 'bg-gray-700'}`}
                initial={false}
                animate={{
                    opacity: isOpen ? 1 : 0,
                    scale: isMinimized ? [1, 1.5, 1] : 1
                }}
                transition={{
                    opacity: { duration: 0.2 },
                    scale: {
                        duration: 1,
                        repeat: isMinimized ? Infinity : 0,
                        repeatType: "loop"
                    }
                }}
            />
        </div>
    )
}

const Dock = () => {
    let mouseX = useMotionValue(Infinity)
    const { darkMode, recentApps } = useStore()

    // Split apps into fixed apps and trash
    const fixedApps = apps.filter(app => app.id !== 'trash')
    const trashApp = apps.find(app => app.id === 'trash')

    // Get app config for recent apps
    const getRecentAppConfig = (recentApp) => {
        const appConfig = apps.find(app => app.id === recentApp.id)
        if (appConfig) {
            return appConfig
        }
        // Fallback for apps not in the main dock
        return {
            id: recentApp.id,
            title: recentApp.title,
            icon: FaFolderOpen,
            color: 'text-gray-500'
        }
    }

    return (
        <div
            className={`fixed bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 h-12 sm:h-16 px-2 sm:px-4 backdrop-blur-xl border rounded-xl sm:rounded-2xl flex items-end gap-2 sm:gap-4 pb-1 sm:pb-2 z-50 transition-colors duration-500 ${
                darkMode ? 'bg-black/40 border-white/30' : 'bg-white/20 border-white/20'
            }`}
            onMouseMove={(e) => mouseX.set(e.pageX)}
            onMouseLeave={() => mouseX.set(Infinity)}
            onTouchMove={(e) => {
                if (e.touches[0]) {
                    mouseX.set(e.touches[0].pageX)
                }
            }}
            onTouchEnd={() => mouseX.set(Infinity)}
        >
            {/* Fixed dock apps */}
            {fixedApps.map((app) => (
                <DockItem key={app.id} mouseX={mouseX} app={app} />
            ))}

            {/* Separator before recent apps (if any) */}
            {recentApps.length > 0 && (
                <div className={`w-[1px] h-8 sm:h-10 mb-1 ${darkMode ? 'bg-white/20' : 'bg-gray-700/30'}`} />
            )}

            {/* Recent apps */}
            {recentApps.map((recentApp) => {
                // Don't show recent app if it's already in the fixed dock
                if (fixedApps.some(app => app.id === recentApp.id)) {
                    return null
                }
                const appConfig = getRecentAppConfig(recentApp)
                return <DockItem key={`recent-${recentApp.id}`} mouseX={mouseX} app={appConfig} />
            })}

            {/* Separator before trash */}
            {trashApp && (
                <div className={`w-[1px] h-8 sm:h-10 mb-1 ${darkMode ? 'bg-white/20' : 'bg-gray-700/30'}`} />
            )}

            {/* Trash */}
            {trashApp && <DockItem key={trashApp.id} mouseX={mouseX} app={trashApp} />}
        </div>
    )
}

export default Dock
