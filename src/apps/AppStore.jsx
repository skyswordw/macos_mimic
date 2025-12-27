import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useStore } from '../store/useStore'
import { FaSearch, FaApple, FaGamepad, FaBriefcase, FaPalette, FaBook, FaMusic, FaFilm, FaStar, FaDownload, FaCheck, FaChevronRight, FaTrophy, FaFire, FaCrown } from 'react-icons/fa'

const categories = [
    { id: 'discover', label: 'Discover', icon: FaApple },
    { id: 'arcade', label: 'Arcade', icon: FaGamepad },
    { id: 'create', label: 'Create', icon: FaPalette },
    { id: 'work', label: 'Work', icon: FaBriefcase },
    { id: 'play', label: 'Play', icon: FaMusic },
    { id: 'develop', label: 'Develop', icon: FaBook },
]

const featuredApps = [
    { id: 1, name: 'Photoshop', developer: 'Adobe Inc.', icon: '🎨', rating: 4.7, size: '2.1 GB', price: 'Free', category: 'create', featured: true, description: 'The industry standard for digital imaging' },
    { id: 2, name: 'Slack', developer: 'Slack Technologies', icon: '💬', rating: 4.5, size: '145 MB', price: 'Free', category: 'work', featured: true, description: 'Business communication for teams' },
    { id: 3, name: 'Final Cut Pro', developer: 'Apple', icon: '🎬', rating: 4.8, size: '3.2 GB', price: '$299.99', category: 'create', featured: true, description: 'Professional video editing' },
    { id: 4, name: 'Xcode', developer: 'Apple', icon: '🔨', rating: 4.2, size: '12 GB', price: 'Free', category: 'develop', featured: false, description: 'Build apps for Apple platforms' },
    { id: 5, name: 'Spotify', developer: 'Spotify AB', icon: '🎵', rating: 4.6, size: '200 MB', price: 'Free', category: 'play', featured: true, description: 'Music for everyone' },
    { id: 6, name: 'Minecraft', developer: 'Mojang', icon: '⛏️', rating: 4.7, size: '1.5 GB', price: '$26.99', category: 'arcade', featured: true, description: 'Build anything you can imagine' },
    { id: 7, name: 'Notion', developer: 'Notion Labs', icon: '📝', rating: 4.8, size: '180 MB', price: 'Free', category: 'work', featured: false, description: 'All-in-one workspace' },
    { id: 8, name: 'Figma', developer: 'Figma Inc.', icon: '🎯', rating: 4.9, size: '250 MB', price: 'Free', category: 'create', featured: true, description: 'Collaborative design tool' },
    { id: 9, name: 'Discord', developer: 'Discord Inc.', icon: '🎮', rating: 4.5, size: '180 MB', price: 'Free', category: 'play', featured: false, description: 'Chat for communities and friends' },
    { id: 10, name: 'Logic Pro', developer: 'Apple', icon: '🎹', rating: 4.7, size: '1.8 GB', price: '$199.99', category: 'create', featured: false, description: 'Professional music production' },
]

const AppStore = () => {
    const { darkMode, addNotification, openWindow } = useStore()
    const [activeCategory, setActiveCategory] = useState('discover')
    const [searchQuery, setSearchQuery] = useState('')
    const [installedApps, setInstalledApps] = useState([4, 7])
    const [downloadingApps, setDownloadingApps] = useState([])
    const [selectedApp, setSelectedApp] = useState(null)

    const filteredApps = featuredApps.filter(app => {
        if (searchQuery) {
            return app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                   app.developer.toLowerCase().includes(searchQuery.toLowerCase())
        }
        if (activeCategory === 'discover') return true
        return app.category === activeCategory
    })

    const installApp = (app) => {
        if (installedApps.includes(app.id) || downloadingApps.includes(app.id)) return

        setDownloadingApps(prev => [...prev, app.id])
        addNotification({ title: 'App Store', message: `Downloading ${app.name}...`, app: 'App Store' })

        setTimeout(() => {
            setDownloadingApps(prev => prev.filter(id => id !== app.id))
            setInstalledApps(prev => [...prev, app.id])
            addNotification({ title: 'App Store', message: `${app.name} installed successfully!`, app: 'App Store' })
        }, 2000)
    }

    const getButtonState = (app) => {
        if (installedApps.includes(app.id)) return 'installed'
        if (downloadingApps.includes(app.id)) return 'downloading'
        return 'get'
    }

    const topCharts = featuredApps.slice().sort((a, b) => b.rating - a.rating).slice(0, 5)

    return (
        <div className={`h-full flex ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
            {/* Sidebar */}
            <div className={`w-56 border-r flex flex-col ${darkMode ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-white'}`}>
                <div className="p-4">
                    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                        <FaSearch className="text-gray-400" />
                        <input type="text" placeholder="Search" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                            className="bg-transparent flex-1 outline-none text-sm" />
                    </div>
                </div>

                <div className="flex-1">
                    {categories.map(cat => (
                        <button key={cat.id} onClick={() => { setActiveCategory(cat.id); setSearchQuery('') }}
                            className={`w-full px-4 py-2.5 flex items-center gap-3 text-left ${
                                activeCategory === cat.id
                                    ? (darkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white')
                                    : (darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100')
                            }`}>
                            <cat.icon className={activeCategory === cat.id ? 'text-white' : 'text-blue-500'} />
                            <span>{cat.label}</span>
                        </button>
                    ))}
                </div>

                <div className={`p-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="text-xs text-gray-500 mb-2">ACCOUNT</div>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs">U</div>
                        <span className="text-sm">user@example.com</span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto">
                {selectedApp ? (
                    /* App Detail View */
                    <div className="p-6">
                        <button onClick={() => setSelectedApp(null)} className="text-blue-500 mb-4">← Back</button>

                        <div className="flex items-start gap-6 mb-8">
                            <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center text-6xl shadow-xl">
                                {selectedApp.icon}
                            </div>
                            <div className="flex-1">
                                <h1 className="text-3xl font-bold mb-1">{selectedApp.name}</h1>
                                <p className="text-blue-500 mb-2">{selectedApp.developer}</p>
                                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                                    <span className="flex items-center gap-1"><FaStar className="text-yellow-500" /> {selectedApp.rating}</span>
                                    <span>{selectedApp.size}</span>
                                    <span>{categories.find(c => c.id === selectedApp.category)?.label}</span>
                                </div>
                                <button
                                    onClick={() => installApp(selectedApp)}
                                    disabled={getButtonState(selectedApp) !== 'get'}
                                    className={`px-6 py-2 rounded-full font-medium ${
                                        getButtonState(selectedApp) === 'installed'
                                            ? 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                                            : getButtonState(selectedApp) === 'downloading'
                                            ? 'bg-gray-200 dark:bg-gray-700'
                                            : 'bg-blue-500 text-white hover:bg-blue-600'
                                    }`}
                                >
                                    {getButtonState(selectedApp) === 'installed' ? (
                                        <span className="flex items-center gap-1"><FaCheck /> Open</span>
                                    ) : getButtonState(selectedApp) === 'downloading' ? (
                                        <motion.span animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 1, repeat: Infinity }}>
                                            Installing...
                                        </motion.span>
                                    ) : (
                                        selectedApp.price === 'Free' ? 'Get' : selectedApp.price
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className={`p-6 rounded-2xl mb-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                            <h3 className="font-semibold mb-2">Description</h3>
                            <p className="text-gray-500">{selectedApp.description}</p>
                        </div>

                        <div className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                            <h3 className="font-semibold mb-4">Information</h3>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div><span className="text-gray-500">Developer</span><div className="font-medium">{selectedApp.developer}</div></div>
                                <div><span className="text-gray-500">Size</span><div className="font-medium">{selectedApp.size}</div></div>
                                <div><span className="text-gray-500">Category</span><div className="font-medium">{categories.find(c => c.id === selectedApp.category)?.label}</div></div>
                                <div><span className="text-gray-500">Price</span><div className="font-medium">{selectedApp.price}</div></div>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Browse View */
                    <div className="p-6">
                        {activeCategory === 'discover' && !searchQuery && (
                            <>
                                {/* Featured Banner */}
                                <div className="mb-8">
                                    <div className="relative h-64 rounded-2xl overflow-hidden bg-gradient-to-r from-purple-600 to-blue-500 p-8 flex items-center">
                                        <div className="flex-1 text-white">
                                            <div className="text-sm font-medium opacity-80 mb-2 flex items-center gap-2"><FaFire /> FEATURED</div>
                                            <h2 className="text-4xl font-bold mb-2">Discover New Apps</h2>
                                            <p className="opacity-80">Explore the best apps curated just for you</p>
                                        </div>
                                        <div className="text-9xl">🚀</div>
                                    </div>
                                </div>

                                {/* Top Charts */}
                                <div className="mb-8">
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="text-xl font-bold flex items-center gap-2"><FaTrophy className="text-yellow-500" /> Top Charts</h2>
                                        <button className="text-blue-500 text-sm flex items-center gap-1">See All <FaChevronRight /></button>
                                    </div>
                                    <div className="grid grid-cols-1 gap-2">
                                        {topCharts.map((app, index) => (
                                            <motion.div key={app.id} whileHover={{ scale: 1.01 }}
                                                onClick={() => setSelectedApp(app)}
                                                className={`p-3 rounded-xl flex items-center gap-4 cursor-pointer ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'}`}>
                                                <div className="w-8 text-center font-bold text-gray-400">{index + 1}</div>
                                                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center text-2xl">
                                                    {app.icon}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="font-semibold">{app.name}</div>
                                                    <div className="text-sm text-gray-500">{app.developer}</div>
                                                </div>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); installApp(app) }}
                                                    className={`px-4 py-1.5 rounded-full text-sm font-medium ${
                                                        getButtonState(app) === 'installed' ? 'bg-gray-200 dark:bg-gray-700' : 'bg-blue-500 text-white'
                                                    }`}
                                                >
                                                    {getButtonState(app) === 'installed' ? 'Open' : getButtonState(app) === 'downloading' ? '...' : 'Get'}
                                                </button>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}

                        {/* App Grid */}
                        <div>
                            <h2 className="text-xl font-bold mb-4">
                                {searchQuery ? 'Search Results' : activeCategory === 'discover' ? 'All Apps' : categories.find(c => c.id === activeCategory)?.label}
                            </h2>
                            <div className="grid grid-cols-2 gap-4">
                                {filteredApps.map(app => (
                                    <motion.div key={app.id} whileHover={{ scale: 1.02 }}
                                        onClick={() => setSelectedApp(app)}
                                        className={`p-4 rounded-2xl cursor-pointer ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                                        <div className="flex items-start gap-4">
                                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center text-3xl">
                                                {app.icon}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="font-semibold truncate">{app.name}</div>
                                                <div className="text-sm text-gray-500 truncate">{app.developer}</div>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-xs text-yellow-500 flex items-center gap-0.5"><FaStar /> {app.rating}</span>
                                                    <span className="text-xs text-gray-400">{app.size}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); installApp(app) }}
                                            className={`w-full mt-3 py-1.5 rounded-full text-sm font-medium ${
                                                getButtonState(app) === 'installed' ? 'bg-gray-200 dark:bg-gray-700' : 'bg-blue-500 text-white'
                                            }`}
                                        >
                                            {getButtonState(app) === 'installed' ? 'Open' : getButtonState(app) === 'downloading' ? 'Installing...' : app.price === 'Free' ? 'Get' : app.price}
                                        </button>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default AppStore
