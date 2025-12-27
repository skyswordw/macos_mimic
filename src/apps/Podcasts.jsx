import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../store/useStore'
import { FaPlay, FaPause, FaStepForward, FaStepBackward, FaSearch, FaPlus, FaEllipsisH, FaDownload, FaShare, FaStar, FaList, FaThLarge, FaClock, FaVolumeUp, FaForward, FaBackward, FaHeart, FaRss } from 'react-icons/fa'

const samplePodcasts = [
    { id: 1, title: 'Tech Today', author: 'Tech Media', cover: '🎙️', color: 'from-purple-500 to-pink-500', episodes: 156, subscribed: true },
    { id: 2, title: 'The Daily', author: 'The New York Times', cover: '📰', color: 'from-blue-500 to-cyan-500', episodes: 1250, subscribed: true },
    { id: 3, title: 'Science Weekly', author: 'Nature Podcast', cover: '🔬', color: 'from-green-500 to-teal-500', episodes: 89, subscribed: false },
    { id: 4, title: 'History Hour', author: 'BBC World Service', cover: '📜', color: 'from-amber-500 to-orange-500', episodes: 234, subscribed: true },
    { id: 5, title: 'Comedy Central', author: 'Laugh Factory', cover: '😂', color: 'from-red-500 to-pink-500', episodes: 67, subscribed: false },
]

const sampleEpisodes = [
    { id: 1, podcastId: 1, title: 'The Future of AI in 2025', duration: '45:32', date: '2024-01-15', description: 'Exploring the latest developments in artificial intelligence...', played: false, downloaded: true },
    { id: 2, podcastId: 1, title: 'Apple Vision Pro Review', duration: '38:15', date: '2024-01-12', description: 'Our comprehensive review of Apples new headset...', played: true, downloaded: true },
    { id: 3, podcastId: 2, title: 'Breaking News Analysis', duration: '25:00', date: '2024-01-15', description: 'Daily news roundup and analysis...', played: false, downloaded: false },
    { id: 4, podcastId: 4, title: 'Ancient Rome: The Fall', duration: '52:18', date: '2024-01-14', description: 'The final chapter of the Roman Empire...', played: false, downloaded: true },
]

const Podcasts = () => {
    const { darkMode } = useStore()
    const [activeTab, setActiveTab] = useState('listen')
    const [selectedPodcast, setSelectedPodcast] = useState(null)
    const [currentEpisode, setCurrentEpisode] = useState(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [progress, setProgress] = useState(0)
    const [searchQuery, setSearchQuery] = useState('')
    const [playbackSpeed, setPlaybackSpeed] = useState(1)
    const progressRef = useRef(null)

    const tabs = [
        { id: 'listen', label: 'Listen Now' },
        { id: 'library', label: 'Library' },
        { id: 'browse', label: 'Browse' },
        { id: 'search', label: 'Search' },
    ]

    useEffect(() => {
        if (isPlaying && currentEpisode) {
            progressRef.current = setInterval(() => {
                setProgress(p => p >= 100 ? 0 : p + 0.1)
            }, 100)
        } else {
            clearInterval(progressRef.current)
        }
        return () => clearInterval(progressRef.current)
    }, [isPlaying, currentEpisode])

    const playEpisode = (episode) => {
        setCurrentEpisode(episode)
        setIsPlaying(true)
        setProgress(0)
    }

    const subscribedPodcasts = samplePodcasts.filter(p => p.subscribed)
    const recentEpisodes = sampleEpisodes.filter(e => !e.played).slice(0, 5)

    return (
        <div className={`h-full flex flex-col ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
            {/* Header */}
            <div className={`px-4 py-3 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex gap-2">
                    {tabs.map(tab => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-1.5 rounded-full text-sm ${activeTab === tab.id ? 'bg-purple-500 text-white' : darkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto p-4">
                {activeTab === 'listen' && (
                    <div className="space-y-6">
                        {/* Up Next */}
                        <div>
                            <h2 className="text-xl font-bold mb-3">Up Next</h2>
                            <div className="space-y-2">
                                {recentEpisodes.map(episode => {
                                    const podcast = samplePodcasts.find(p => p.id === episode.podcastId)
                                    return (
                                        <motion.div key={episode.id} whileHover={{ scale: 1.01 }}
                                            onClick={() => playEpisode(episode)}
                                            className={`p-3 rounded-xl flex items-center gap-3 cursor-pointer ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-100'}`}>
                                            <div className={`w-14 h-14 rounded-lg bg-gradient-to-br ${podcast?.color} flex items-center justify-center text-2xl`}>
                                                {podcast?.cover}
                                            </div>
                                            <div className="flex-1">
                                                <div className="font-medium">{episode.title}</div>
                                                <div className="text-sm text-gray-500">{podcast?.title} • {episode.duration}</div>
                                            </div>
                                            <button onClick={(e) => { e.stopPropagation(); playEpisode(episode) }} className="w-10 h-10 rounded-full bg-purple-500 text-white flex items-center justify-center">
                                                {currentEpisode?.id === episode.id && isPlaying ? <FaPause /> : <FaPlay className="ml-0.5" />}
                                            </button>
                                        </motion.div>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Recently Played */}
                        <div>
                            <h2 className="text-xl font-bold mb-3">Your Shows</h2>
                            <div className="grid grid-cols-4 gap-4">
                                {subscribedPodcasts.map(podcast => (
                                    <motion.div key={podcast.id} whileHover={{ scale: 1.05 }}
                                        onClick={() => setSelectedPodcast(podcast)}
                                        className="cursor-pointer">
                                        <div className={`aspect-square rounded-xl bg-gradient-to-br ${podcast.color} flex items-center justify-center text-4xl shadow-lg`}>
                                            {podcast.cover}
                                        </div>
                                        <div className="mt-2 font-medium text-sm truncate">{podcast.title}</div>
                                        <div className="text-xs text-gray-500">{podcast.author}</div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'library' && (
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold">Library</h2>
                        <div className={`rounded-xl overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                            {[{ icon: FaClock, label: 'Recently Played', count: 12 },
                              { icon: FaDownload, label: 'Downloaded', count: 8 },
                              { icon: FaStar, label: 'Saved Episodes', count: 5 },
                              { icon: FaRss, label: 'Subscriptions', count: subscribedPodcasts.length }].map((item, i) => (
                                <button key={i} className={`w-full px-4 py-3 flex items-center gap-4 ${i > 0 ? (darkMode ? 'border-t border-gray-700' : 'border-t border-gray-100') : ''} hover:bg-gray-100 dark:hover:bg-gray-700`}>
                                    <item.icon className="text-purple-500" />
                                    <span className="flex-1 text-left">{item.label}</span>
                                    <span className="text-gray-500">{item.count}</span>
                                </button>
                            ))}
                        </div>

                        <h3 className="text-lg font-semibold mt-6">Shows</h3>
                        <div className="space-y-2">
                            {subscribedPodcasts.map(podcast => (
                                <div key={podcast.id} className={`p-3 rounded-xl flex items-center gap-3 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${podcast.color} flex items-center justify-center text-3xl`}>
                                        {podcast.cover}
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-medium">{podcast.title}</div>
                                        <div className="text-sm text-gray-500">{podcast.author}</div>
                                        <div className="text-xs text-purple-500">{podcast.episodes} episodes</div>
                                    </div>
                                    <button className="p-2"><FaEllipsisH /></button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'browse' && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold">Top Charts</h2>
                        <div className="grid grid-cols-3 gap-4">
                            {samplePodcasts.map((podcast, i) => (
                                <motion.div key={podcast.id} whileHover={{ scale: 1.03 }} className="cursor-pointer">
                                    <div className="relative">
                                        <div className={`aspect-square rounded-xl bg-gradient-to-br ${podcast.color} flex items-center justify-center text-5xl shadow-lg`}>
                                            {podcast.cover}
                                        </div>
                                        <div className="absolute -left-2 -top-2 w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold">
                                            {i + 1}
                                        </div>
                                    </div>
                                    <div className="mt-2 font-medium truncate">{podcast.title}</div>
                                    <div className="text-sm text-gray-500">{podcast.author}</div>
                                </motion.div>
                            ))}
                        </div>

                        <h2 className="text-xl font-bold mt-8">Categories</h2>
                        <div className="grid grid-cols-2 gap-3">
                            {['Technology', 'News', 'Comedy', 'History', 'Science', 'Business', 'Sports', 'Music'].map((cat, i) => (
                                <button key={i} className={`p-4 rounded-xl text-left font-medium ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-100'}`}>
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'search' && (
                    <div className="space-y-4">
                        <div className={`flex items-center gap-2 px-4 py-3 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                            <FaSearch className="text-gray-400" />
                            <input type="text" placeholder="Search podcasts, episodes..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                                className="bg-transparent flex-1 outline-none" autoFocus />
                        </div>

                        {searchQuery ? (
                            <div className="space-y-2">
                                {samplePodcasts.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase())).map(podcast => (
                                    <div key={podcast.id} className={`p-3 rounded-xl flex items-center gap-3 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                                        <div className={`w-14 h-14 rounded-lg bg-gradient-to-br ${podcast.color} flex items-center justify-center text-2xl`}>
                                            {podcast.cover}
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-medium">{podcast.title}</div>
                                            <div className="text-sm text-gray-500">{podcast.author}</div>
                                        </div>
                                        <button className="px-4 py-1.5 bg-purple-500 text-white rounded-full text-sm">
                                            {podcast.subscribed ? 'Subscribed' : 'Subscribe'}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 text-gray-500">
                                <FaSearch className="text-4xl mx-auto mb-3 opacity-20" />
                                <p>Search for podcasts and episodes</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Player */}
            {currentEpisode && (
                <motion.div initial={{ y: 100 }} animate={{ y: 0 }}
                    className={`border-t px-4 py-3 ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
                    <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${samplePodcasts.find(p => p.id === currentEpisode.podcastId)?.color} flex items-center justify-center text-xl`}>
                            {samplePodcasts.find(p => p.id === currentEpisode.podcastId)?.cover}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="font-medium truncate">{currentEpisode.title}</div>
                            <div className="text-xs text-gray-500">{samplePodcasts.find(p => p.id === currentEpisode.podcastId)?.title}</div>
                            <div className="mt-1 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div className="h-full bg-purple-500 transition-all" style={{ width: `${progress}%` }} />
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="p-2"><FaBackward /></button>
                            <button onClick={() => setIsPlaying(!isPlaying)} className="w-12 h-12 rounded-full bg-purple-500 text-white flex items-center justify-center">
                                {isPlaying ? <FaPause /> : <FaPlay className="ml-0.5" />}
                            </button>
                            <button className="p-2"><FaForward /></button>
                            <button onClick={() => setPlaybackSpeed(s => s >= 2 ? 0.5 : s + 0.5)} className={`px-2 py-1 rounded text-xs ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                                {playbackSpeed}x
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    )
}

export default Podcasts
