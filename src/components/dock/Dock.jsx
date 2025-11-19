import React from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useStore } from '../../store/useStore'
import { FaFolderOpen, FaSafari, FaTerminal, FaCalculator, FaRegStickyNote, FaCog, FaTrash, FaCode, FaRocket } from 'react-icons/fa'

const apps = [
    { id: 'launchpad', title: 'Launchpad', icon: FaRocket, color: 'text-gray-500' },
    { id: 'finder', title: 'Finder', icon: FaFolderOpen, color: 'text-blue-500' },
    { id: 'safari', title: 'Safari', icon: FaSafari, color: 'text-blue-400' },
    { id: 'vscode', title: 'VS Code', icon: FaCode, color: 'text-blue-600' },
    { id: 'terminal', title: 'Terminal', icon: FaTerminal, color: 'text-gray-700' },
    { id: 'calculator', title: 'Calculator', icon: FaCalculator, color: 'text-gray-600' },
    { id: 'notes', title: 'Notes', icon: FaRegStickyNote, color: 'text-yellow-500' },
    { id: 'settings', title: 'Settings', icon: FaCog, color: 'text-gray-500' },
    { id: 'trash', title: 'Trash', icon: FaTrash, color: 'text-gray-400' },
]

const DockItem = ({ mouseX, app }) => {
    const { openWindow, windows, toggleLaunchpad } = useStore()

    let ref = React.useRef(null)
    let distance = useTransform(mouseX, (val) => {
        let bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 }
        return val - bounds.x - bounds.width / 2
    })

    let widthSync = useTransform(distance, [-150, 0, 150], [40, 80, 40])
    let width = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 12 })

    const isOpen = windows.find(w => w.id === app.id && w.isOpen)

    const handleClick = () => {
        if (app.id === 'launchpad') {
            toggleLaunchpad()
        } else {
            openWindow(app.id, app.title, app.id)
        }
    }

    return (
        <div className="flex flex-col items-center gap-1">
            <motion.div
                ref={ref}
                style={{ width }}
                className="aspect-square rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg flex items-center justify-center cursor-pointer hover:bg-white/20 transition-colors relative"
                onClick={handleClick}
            >
                <app.icon className={`w-3/5 h-3/5 ${app.color}`} />
            </motion.div>
            <div className={`w-1 h-1 rounded-full bg-white ${isOpen ? 'opacity-100' : 'opacity-0'}`} />
        </div>
    )
}

const Dock = () => {
    let mouseX = useMotionValue(Infinity)

    return (
        <div
            className="fixed bottom-4 left-1/2 -translate-x-1/2 h-16 px-4 bg-white/20 backdrop-blur-xl border border-white/20 rounded-2xl flex items-end gap-4 pb-2 z-50"
            onMouseMove={(e) => mouseX.set(e.pageX)}
            onMouseLeave={() => mouseX.set(Infinity)}
        >
            {apps.map((app) => (
                <DockItem key={app.id} mouseX={mouseX} app={app} />
            ))}
        </div>
    )
}

export default Dock
