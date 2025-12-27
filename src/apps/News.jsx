import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useStore } from '../store/useStore'
import { FaNewspaper, FaHeart, FaShare, FaBookmark, FaSearch, FaChevronRight, FaPlus, FaStar, FaGlobe, FaFootballBall, FaLaptop, FaFilm, FaChartLine, FaMedkit } from 'react-icons/fa'

const categories = [
    { id: 'top', label: 'Top Stories', icon: FaNewspaper },
    { id: 'foryou', label: 'For You', icon: FaStar },
    { id: 'world', label: 'World', icon: FaGlobe },
    { id: 'tech', label: 'Technology', icon: FaLaptop },
    { id: 'sports', label: 'Sports', icon: FaFootballBall },
    { id: 'entertainment', label: 'Entertainment', icon: FaFilm },
    { id: 'business', label: 'Business', icon: FaChartLine },
    { id: 'health', label: 'Health', icon: FaMedkit },
]

const articles = [
    { id: 1, title: 'Tech Giants Report Strong Q4 Earnings', source: 'TechNews', category: 'tech', time: '2h ago', image: '💻', featured: true, summary: 'Major technology companies exceeded Wall Street expectations with robust quarterly results driven by AI investments.' },
    { id: 2, title: 'Climate Summit Reaches Historic Agreement', source: 'World Report', category: 'world', time: '4h ago', image: '🌍', featured: true, summary: 'World leaders announce breakthrough deal on carbon emissions after marathon negotiations.' },
    { id: 3, title: 'Championship Finals Set for This Weekend', source: 'Sports Daily', category: 'sports', time: '1h ago', image: '🏆', featured: false, summary: 'Top teams advance to finals in thrilling semifinal matchups.' },
    { id: 4, title: 'New Streaming Platform Launches Globally', source: 'Entertainment Weekly', category: 'entertainment', time: '3h ago', image: '🎬', featured: false, summary: 'Major studio unveils streaming service with exclusive content library.' },
    { id: 5, title: 'Stock Markets Hit All-Time Highs', source: 'Financial Times', category: 'business', time: '5h ago', image: '📈', featured: true, summary: 'Investors cheer as major indices reach record levels amid economic optimism.' },
    { id: 6, title: 'Breakthrough in Cancer Research Announced', source: 'Health Journal', category: 'health', time: '6h ago', image: '🔬', featured: false, summary: 'Scientists discover promising new treatment approach for aggressive cancers.' },
    { id: 7, title: 'AI Revolution Transforms Industries', source: 'Tech Today', category: 'tech', time: '1h ago', image: '🤖', featured: false, summary: 'Artificial intelligence adoption accelerates across sectors from healthcare to finance.' },
    { id: 8, title: 'International Trade Deal Signed', source: 'Global News', category: 'world', time: '8h ago', image: '🤝', featured: false, summary: 'Nations agree on new framework for cross-border commerce and tariff reductions.' },
]

const News = () => {
    const { darkMode } = useStore()
    const [activeCategory, setActiveCategory] = useState('top')
    const [searchQuery, setSearchQuery] = useState('')
    const [savedArticles, setSavedArticles] = useState([])
    const [selectedArticle, setSelectedArticle] = useState(null)

    const filteredArticles = articles.filter(a => {
        if (searchQuery) return a.title.toLowerCase().includes(searchQuery.toLowerCase())
        if (activeCategory === 'top') return true
        if (activeCategory === 'foryou') return a.featured
        return a.category === activeCategory
    })

    const toggleSave = (id) => {
        setSavedArticles(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
    }

    if (selectedArticle) {
        return (
            <div className={`h-full flex flex-col ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
                <div className={`p-4 border-b flex items-center gap-4 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <button onClick={() => setSelectedArticle(null)} className="text-red-500 font-medium">Back</button>
                    <div className="flex-1" />
                    <button onClick={() => toggleSave(selectedArticle.id)} className={savedArticles.includes(selectedArticle.id) ? 'text-red-500' : 'text-gray-400'}>
                        <FaBookmark />
                    </button>
                    <button className="text-gray-400"><FaShare /></button>
                </div>
                <div className="flex-1 overflow-auto p-6 max-w-3xl mx-auto">
                    <div className="text-6xl mb-6">{selectedArticle.image}</div>
                    <h1 className="text-3xl font-bold mb-4">{selectedArticle.title}</h1>
                    <div className="flex items-center gap-3 text-sm text-gray-500 mb-6">
                        <span className="font-medium text-red-500">{selectedArticle.source}</span>
                        <span>•</span>
                        <span>{selectedArticle.time}</span>
                    </div>
                    <p className="text-lg leading-relaxed mb-6">{selectedArticle.summary}</p>
                    <p className={`leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    </p>
                    <p className={`leading-relaxed mt-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className={`h-full flex ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
            {/* Sidebar */}
            <div className={`w-64 border-r flex flex-col ${darkMode ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-white'}`}>
                <div className="p-4">
                    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                        <FaSearch className="text-gray-400" />
                        <input type="text" placeholder="Search News" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                            className="bg-transparent flex-1 outline-none text-sm" />
                    </div>
                </div>

                <div className="flex-1 overflow-auto">
                    {categories.map(cat => (
                        <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
                            className={`w-full px-4 py-2.5 flex items-center gap-3 text-left ${
                                activeCategory === cat.id
                                    ? (darkMode ? 'bg-red-600 text-white' : 'bg-red-500 text-white')
                                    : (darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100')
                            }`}>
                            <cat.icon className={activeCategory === cat.id ? 'text-white' : 'text-red-500'} />
                            <span>{cat.label}</span>
                        </button>
                    ))}
                </div>

                <div className={`p-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <button className="w-full py-2 flex items-center justify-center gap-2 text-red-500 font-medium">
                        <FaPlus /> Follow Channels
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto p-6">
                <h1 className="text-2xl font-bold mb-6">{categories.find(c => c.id === activeCategory)?.label}</h1>

                {/* Featured Articles */}
                {activeCategory === 'top' && (
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        {filteredArticles.filter(a => a.featured).slice(0, 2).map(article => (
                            <motion.div key={article.id} whileHover={{ scale: 1.02 }}
                                onClick={() => setSelectedArticle(article)}
                                className={`p-6 rounded-2xl cursor-pointer ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
                                <div className="text-5xl mb-4">{article.image}</div>
                                <div className="text-xs text-red-500 font-medium mb-2">{article.source}</div>
                                <h2 className="text-xl font-bold mb-2">{article.title}</h2>
                                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{article.summary}</p>
                                <div className="flex items-center justify-between mt-4">
                                    <span className="text-xs text-gray-500">{article.time}</span>
                                    <div className="flex gap-2">
                                        <button onClick={(e) => { e.stopPropagation(); toggleSave(article.id) }}
                                            className={savedArticles.includes(article.id) ? 'text-red-500' : 'text-gray-400'}>
                                            <FaBookmark />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Article List */}
                <div className="space-y-3">
                    {filteredArticles.filter(a => activeCategory !== 'top' || !a.featured).map(article => (
                        <motion.div key={article.id} whileHover={{ backgroundColor: darkMode ? 'rgba(55,65,81,0.5)' : 'rgba(243,244,246,1)' }}
                            onClick={() => setSelectedArticle(article)}
                            className={`p-4 rounded-xl cursor-pointer flex items-start gap-4 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                            <div className="text-4xl">{article.image}</div>
                            <div className="flex-1">
                                <div className="text-xs text-red-500 font-medium mb-1">{article.source}</div>
                                <h3 className="font-semibold mb-1">{article.title}</h3>
                                <p className={`text-sm line-clamp-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{article.summary}</p>
                                <div className="flex items-center gap-4 mt-2">
                                    <span className="text-xs text-gray-500">{article.time}</span>
                                </div>
                            </div>
                            <button onClick={(e) => { e.stopPropagation(); toggleSave(article.id) }}
                                className={`mt-2 ${savedArticles.includes(article.id) ? 'text-red-500' : 'text-gray-400'}`}>
                                <FaBookmark />
                            </button>
                        </motion.div>
                    ))}
                </div>

                {filteredArticles.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        <FaNewspaper className="text-4xl mx-auto mb-3 opacity-20" />
                        <p>No articles found</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default News
