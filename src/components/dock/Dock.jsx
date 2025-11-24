import React from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useStore } from '../../store/useStore'
import { FaFolderOpen, FaSafari, FaTerminal, FaCalculator, FaRegStickyNote, FaCog, FaTrash, FaCode, FaRocket, FaMusic, FaComments } from 'react-icons/fa'

const apps = [
    { id: 'launchpad', title: 'Launchpad', icon: FaRocket, color: 'text-gray-500' },
    { id: 'finder', title: 'Finder', icon: FaFolderOpen, color: 'text-blue-500' },
    { id: 'safari', title: 'Safari', icon: FaSafari, color: 'text-blue-400' },
    { id: 'messages', title: 'Messages', icon: FaComments, color: 'text-green-500' },
    { id: 'music', title: 'Music', icon: FaMusic, color: 'text-red-500' },
    { id: 'vscode', title: 'VS Code', icon: FaCode, color: 'text-blue-600' },
    { id: 'terminal', title: 'Terminal', icon: FaTerminal, color: 'text-gray-700' },
    { id: 'calculator', title: 'Calculator', icon: FaCalculator, color: 'text-gray-600' },
    { id: 'notes', title: 'Notes', icon: FaRegStickyNote, color: 'text-yellow-500' },
    { id: 'settings', title: 'Settings', icon: FaCog, color: 'text-gray-500' },
    { id: 'trash', title: 'Trash', icon: FaTrash, color: 'text-gray-400' },
]

const DockItem = ({ mouseX, app }) => {
    const { openWindow, windows, toggleLaunchpad, focusWindow, darkMode } = useStore()

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
        <div className="flex flex-col items-center gap-1">
            <motion.div
                ref={ref}
                data-dock-id={app.id}
                style={{ width }}
                className={`aspect-square rounded-xl backdrop-blur-md border shadow-lg flex items-center justify-center cursor-pointer transition-colors relative ${
                    darkMode
                        ? 'bg-white/5 border-white/30 hover:bg-white/15'
                        : 'bg-white/10 border-white/20 hover:bg-white/20'
                }`}
                onClick={handleClick}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
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
                className={`w-1 h-1 rounded-full bg-white`}
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
    const { darkMode } = useStore()

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
            {apps.map((app) => (
                <DockItem key={app.id} mouseX={mouseX} app={app} />
            ))}
        </div>
    )
}

export default Dock
