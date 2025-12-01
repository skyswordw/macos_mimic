import React, { useState, useEffect, useRef } from 'react'
import { useStore } from '../../store/useStore'
import { FaSearch, FaFolderOpen, FaSafari, FaTerminal, FaCalculator, FaRegStickyNote, FaCog, FaCode, FaMusic, FaComments, FaImage, FaCalendarAlt } from 'react-icons/fa'

const apps = [
    { id: 'finder', title: 'Finder', icon: FaFolderOpen, color: 'text-blue-500' },
    { id: 'safari', title: 'Safari', icon: FaSafari, color: 'text-blue-400' },
    { id: 'messages', title: 'Messages', icon: FaComments, color: 'text-green-500' },
    { id: 'music', title: 'Music', icon: FaMusic, color: 'text-red-500' },
    { id: 'photos', title: 'Photos', icon: FaImage, color: 'text-pink-500' },
    { id: 'calendar', title: 'Calendar', icon: FaCalendarAlt, color: 'text-red-500' },
    { id: 'vscode', title: 'VS Code', icon: FaCode, color: 'text-blue-600' },
    { id: 'terminal', title: 'Terminal', icon: FaTerminal, color: 'text-gray-700' },
    { id: 'calculator', title: 'Calculator', icon: FaCalculator, color: 'text-gray-600' },
    { id: 'notes', title: 'Notes', icon: FaRegStickyNote, color: 'text-yellow-500' },
    { id: 'settings', title: 'Settings', icon: FaCog, color: 'text-gray-500' },
]

const Spotlight = () => {
    const { isSpotlightOpen, toggleSpotlight, openWindow, darkMode } = useStore()
    const [search, setSearch] = useState('')
    const inputRef = useRef(null)

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
            setTimeout(() => inputRef.current?.focus(), 10)
        }
    }, [isSpotlightOpen])

    if (!isSpotlightOpen) return null

    const filteredApps = search ? apps.filter(app => app.title.toLowerCase().includes(search.toLowerCase())) : []

    const handleOpen = (app) => {
        openWindow(app.id, app.title, app.id)
        toggleSpotlight()
    }

    return (
        <div className="absolute inset-0 z-50 flex justify-center pt-16 sm:pt-32 px-4" onClick={toggleSpotlight}>
            <div
                className={`w-full max-w-[600px] backdrop-blur-xl rounded-xl shadow-2xl overflow-hidden border flex flex-col transition-colors duration-500 ${
                    darkMode
                        ? 'bg-gray-800/90 border-gray-600/50'
                        : 'bg-white/80 border-white/40'
                }`}
                onClick={(e) => e.stopPropagation()}
            >
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
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && filteredApps.length > 0) {
                                handleOpen(filteredApps[0])
                            }
                        }}
                    />
                </div>

                {filteredApps.length > 0 && (
                    <div className="py-2">
                        <div className={`px-4 py-1 text-xs font-bold transition-colors duration-500 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Top Hit</div>
                        {filteredApps.map((app, i) => (
                            <div
                                key={app.id}
                                className={`px-4 py-2 flex items-center gap-3 cursor-pointer transition-colors duration-300 ${
                                    i === 0
                                        ? 'bg-blue-500 text-white'
                                        : darkMode
                                            ? 'hover:bg-gray-700'
                                            : 'hover:bg-gray-200'
                                }`}
                                onClick={() => handleOpen(app)}
                            >
                                <app.icon className={`text-xl ${i === 0 ? 'text-white' : app.color}`} />
                                <span className="text-lg">{app.title}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Spotlight
