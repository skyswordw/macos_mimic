import React, { useState } from 'react'
import { useStore } from '../../store/useStore'
import { FaSearch, FaFolderOpen, FaSafari, FaTerminal, FaCalculator, FaRegStickyNote, FaCog, FaTrash, FaCode } from 'react-icons/fa'

const apps = [
    { id: 'finder', title: 'Finder', icon: FaFolderOpen, color: 'text-blue-500' },
    { id: 'safari', title: 'Safari', icon: FaSafari, color: 'text-blue-400' },
    { id: 'vscode', title: 'VS Code', icon: FaCode, color: 'text-blue-600' },
    { id: 'terminal', title: 'Terminal', icon: FaTerminal, color: 'text-gray-700' },
    { id: 'calculator', title: 'Calculator', icon: FaCalculator, color: 'text-gray-600' },
    { id: 'notes', title: 'Notes', icon: FaRegStickyNote, color: 'text-yellow-500' },
    { id: 'settings', title: 'Settings', icon: FaCog, color: 'text-gray-500' },
]

const Launchpad = () => {
    const { isLaunchpadOpen, toggleLaunchpad, openWindow } = useStore()
    const [search, setSearch] = useState('')

    if (!isLaunchpadOpen) return null

    const filteredApps = apps.filter(app => app.title.toLowerCase().includes(search.toLowerCase()))

    const handleAppClick = (app) => {
        openWindow(app.id, app.title, app.id)
        toggleLaunchpad()
    }

    return (
        <div
            className="absolute inset-0 z-40 bg-white/20 backdrop-blur-2xl flex flex-col items-center pt-20 animate-fadeIn"
            onClick={toggleLaunchpad}
        >
            <div
                className="w-96 h-10 bg-gray-200/50 rounded-lg flex items-center px-3 gap-2 mb-16 border border-white/20"
                onClick={(e) => e.stopPropagation()}
            >
                <FaSearch className="text-gray-500" />
                <input
                    type="text"
                    placeholder="Search"
                    className="bg-transparent border-none outline-none flex-1 text-white placeholder-gray-500"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    autoFocus
                />
            </div>

            <div
                className="grid grid-cols-7 gap-12 max-w-5xl"
                onClick={(e) => e.stopPropagation()}
            >
                {filteredApps.map(app => (
                    <div
                        key={app.id}
                        className="flex flex-col items-center gap-4 group cursor-pointer"
                        onClick={() => handleAppClick(app)}
                    >
                        <div className="w-24 h-24 rounded-[2rem] bg-white/90 shadow-xl flex items-center justify-center text-5xl transition-transform group-hover:scale-110">
                            <app.icon className={app.color} />
                        </div>
                        <span className="text-white font-medium text-sm drop-shadow-md">{app.title}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Launchpad
