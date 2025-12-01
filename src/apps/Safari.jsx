import React, { useState, useRef, useEffect } from 'react'
import { FaArrowLeft, FaArrowRight, FaRedo, FaLock, FaPlus, FaStar, FaRegStar, FaTimes, FaHome, FaSearch, FaBookmark, FaHistory, FaGlobe } from 'react-icons/fa'
import { useStore } from '../store/useStore'

const defaultBookmarks = [
    { id: 1, title: 'Wikipedia', url: 'https://www.wikipedia.org/', icon: '📚' },
    { id: 2, title: 'GitHub', url: 'https://github.com/', icon: '🐙' },
    { id: 3, title: 'Stack Overflow', url: 'https://stackoverflow.com/', icon: '💡' },
    { id: 4, title: 'MDN Web Docs', url: 'https://developer.mozilla.org/', icon: '📖' },
    { id: 5, title: 'React', url: 'https://react.dev/', icon: '⚛️' },
    { id: 6, title: 'Tailwind CSS', url: 'https://tailwindcss.com/', icon: '🎨' },
]

const quickLinks = [
    { title: 'Wikipedia', url: 'https://www.wikipedia.org/', color: 'bg-gray-100' },
    { title: 'GitHub', url: 'https://github.com/', color: 'bg-gray-800' },
    { title: 'YouTube', url: 'https://www.youtube.com/', color: 'bg-red-500' },
    { title: 'Twitter', url: 'https://twitter.com/', color: 'bg-blue-400' },
    { title: 'Reddit', url: 'https://www.reddit.com/', color: 'bg-orange-500' },
    { title: 'Hacker News', url: 'https://news.ycombinator.com/', color: 'bg-orange-600' },
]

const Safari = () => {
    const { darkMode } = useStore()
    const [tabs, setTabs] = useState([
        { id: 1, title: 'New Tab', url: '', isLoading: false }
    ])
    const [activeTabId, setActiveTabId] = useState(1)
    const [inputUrl, setInputUrl] = useState('')
    const [history, setHistory] = useState([])
    const [historyIndex, setHistoryIndex] = useState(-1)
    const [bookmarks, setBookmarks] = useState(() => {
        const saved = localStorage.getItem('safari-bookmarks')
        return saved ? JSON.parse(saved) : defaultBookmarks
    })
    const [showBookmarks, setShowBookmarks] = useState(false)
    const [isSearchFocused, setIsSearchFocused] = useState(false)
    const iframeRef = useRef(null)
    const inputRef = useRef(null)

    const activeTab = tabs.find(t => t.id === activeTabId)

    useEffect(() => {
        localStorage.setItem('safari-bookmarks', JSON.stringify(bookmarks))
    }, [bookmarks])

    const isValidUrl = (string) => {
        try {
            new URL(string)
            return true
        } catch (_) {
            return false
        }
    }

    const formatUrl = (input) => {
        if (!input) return ''
        if (isValidUrl(input)) return input
        if (input.includes('.') && !input.includes(' ')) {
            return `https://${input}`
        }
        return `https://www.google.com/search?igu=1&q=${encodeURIComponent(input)}`
    }

    const navigate = (url) => {
        const formattedUrl = formatUrl(url)
        setTabs(tabs.map(t =>
            t.id === activeTabId
                ? { ...t, url: formattedUrl, title: getDomainFromUrl(formattedUrl) || 'Loading...', isLoading: true }
                : t
        ))
        setInputUrl(formattedUrl)
        setHistory(prev => [...prev.slice(0, historyIndex + 1), formattedUrl])
        setHistoryIndex(prev => prev + 1)
    }

    const getDomainFromUrl = (url) => {
        try {
            const domain = new URL(url).hostname
            return domain.replace('www.', '')
        } catch {
            return url
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        navigate(inputUrl)
    }

    const goBack = () => {
        if (historyIndex > 0) {
            setHistoryIndex(prev => prev - 1)
            const prevUrl = history[historyIndex - 1]
            setTabs(tabs.map(t =>
                t.id === activeTabId ? { ...t, url: prevUrl, title: getDomainFromUrl(prevUrl) } : t
            ))
            setInputUrl(prevUrl)
        }
    }

    const goForward = () => {
        if (historyIndex < history.length - 1) {
            setHistoryIndex(prev => prev + 1)
            const nextUrl = history[historyIndex + 1]
            setTabs(tabs.map(t =>
                t.id === activeTabId ? { ...t, url: nextUrl, title: getDomainFromUrl(nextUrl) } : t
            ))
            setInputUrl(nextUrl)
        }
    }

    const refresh = () => {
        if (iframeRef.current && activeTab?.url) {
            setTabs(tabs.map(t =>
                t.id === activeTabId ? { ...t, isLoading: true } : t
            ))
            iframeRef.current.src = activeTab.url
        }
    }

    const addTab = () => {
        const newTab = {
            id: Date.now(),
            title: 'New Tab',
            url: '',
            isLoading: false
        }
        setTabs([...tabs, newTab])
        setActiveTabId(newTab.id)
        setInputUrl('')
    }

    const closeTab = (tabId, e) => {
        e.stopPropagation()
        if (tabs.length === 1) {
            setTabs([{ id: Date.now(), title: 'New Tab', url: '', isLoading: false }])
            setActiveTabId(tabs[0].id)
            setInputUrl('')
            return
        }
        const newTabs = tabs.filter(t => t.id !== tabId)
        setTabs(newTabs)
        if (activeTabId === tabId) {
            setActiveTabId(newTabs[newTabs.length - 1].id)
        }
    }

    const isBookmarked = activeTab?.url && bookmarks.some(b => b.url === activeTab.url)

    const toggleBookmark = () => {
        if (!activeTab?.url) return
        if (isBookmarked) {
            setBookmarks(bookmarks.filter(b => b.url !== activeTab.url))
        } else {
            setBookmarks([...bookmarks, {
                id: Date.now(),
                title: activeTab.title || getDomainFromUrl(activeTab.url),
                url: activeTab.url,
                icon: '🌐'
            }])
        }
    }

    const handleIframeLoad = () => {
        setTabs(tabs.map(t =>
            t.id === activeTabId ? { ...t, isLoading: false } : t
        ))
    }

    const goHome = () => {
        setTabs(tabs.map(t =>
            t.id === activeTabId ? { ...t, url: '', title: 'New Tab' } : t
        ))
        setInputUrl('')
    }

    return (
        <div className={`w-full h-full flex flex-col ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
            {/* Tab Bar */}
            <div className={`h-9 flex items-center px-2 gap-1 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-200'} border-b`}>
                <div className="flex-1 flex items-center gap-1 overflow-x-auto scrollbar-hide">
                    {tabs.map(tab => (
                        <div
                            key={tab.id}
                            onClick={() => {
                                setActiveTabId(tab.id)
                                setInputUrl(tab.url)
                            }}
                            className={`group flex items-center gap-2 px-3 py-1.5 rounded-md text-xs cursor-pointer max-w-[180px] min-w-[100px] transition-colors ${
                                tab.id === activeTabId
                                    ? darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-800 shadow-sm'
                                    : darkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            {tab.isLoading ? (
                                <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <FaGlobe className="w-3 h-3 flex-shrink-0" />
                            )}
                            <span className="truncate flex-1">{tab.title}</span>
                            <FaTimes
                                className="w-3 h-3 opacity-0 group-hover:opacity-100 hover:text-red-500 transition-opacity"
                                onClick={(e) => closeTab(tab.id, e)}
                            />
                        </div>
                    ))}
                </div>
                <button
                    onClick={addTab}
                    className={`p-1.5 rounded-md transition-colors ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-200 text-gray-600'}`}
                >
                    <FaPlus className="w-3 h-3" />
                </button>
            </div>

            {/* Toolbar */}
            <div className={`h-11 flex items-center px-3 gap-3 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'} border-b`}>
                <div className="flex gap-2">
                    <button
                        onClick={goBack}
                        disabled={historyIndex <= 0}
                        className={`p-1.5 rounded-md transition-colors ${
                            historyIndex > 0
                                ? darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-200'
                                : darkMode ? 'text-gray-600' : 'text-gray-300'
                        }`}
                    >
                        <FaArrowLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                        onClick={goForward}
                        disabled={historyIndex >= history.length - 1}
                        className={`p-1.5 rounded-md transition-colors ${
                            historyIndex < history.length - 1
                                ? darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-200'
                                : darkMode ? 'text-gray-600' : 'text-gray-300'
                        }`}
                    >
                        <FaArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                        onClick={refresh}
                        className={`p-1.5 rounded-md transition-colors ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-200'}`}
                    >
                        <FaRedo className={`w-3.5 h-3.5 ${activeTab?.isLoading ? 'animate-spin' : ''}`} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 max-w-2xl mx-auto">
                    <div className={`flex items-center px-3 py-1.5 rounded-lg transition-all ${
                        isSearchFocused
                            ? darkMode ? 'bg-gray-700 ring-2 ring-blue-500' : 'bg-white ring-2 ring-blue-500 shadow-sm'
                            : darkMode ? 'bg-gray-700' : 'bg-gray-200'
                    }`}>
                        {activeTab?.url ? (
                            <FaLock className={`w-3 h-3 mr-2 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
                        ) : (
                            <FaSearch className={`w-3 h-3 mr-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                        )}
                        <input
                            ref={inputRef}
                            type="text"
                            value={inputUrl}
                            onChange={(e) => setInputUrl(e.target.value)}
                            onFocus={() => setIsSearchFocused(true)}
                            onBlur={() => setIsSearchFocused(false)}
                            placeholder="Search or enter website name"
                            className={`flex-1 bg-transparent outline-none text-sm ${darkMode ? 'text-white placeholder-gray-500' : 'text-gray-800 placeholder-gray-400'}`}
                        />
                    </div>
                </form>

                <div className="flex gap-2">
                    <button
                        onClick={goHome}
                        className={`p-1.5 rounded-md transition-colors ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-200'}`}
                    >
                        <FaHome className="w-3.5 h-3.5" />
                    </button>
                    <button
                        onClick={toggleBookmark}
                        className={`p-1.5 rounded-md transition-colors ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-200'}`}
                    >
                        {isBookmarked ? (
                            <FaStar className="w-3.5 h-3.5 text-yellow-500" />
                        ) : (
                            <FaRegStar className="w-3.5 h-3.5" />
                        )}
                    </button>
                    <button
                        onClick={() => setShowBookmarks(!showBookmarks)}
                        className={`p-1.5 rounded-md transition-colors ${
                            showBookmarks
                                ? 'bg-blue-500 text-white'
                                : darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        <FaBookmark className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>

            {/* Bookmarks Bar */}
            {showBookmarks && (
                <div className={`h-8 flex items-center px-3 gap-2 overflow-x-auto ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'} border-b`}>
                    {bookmarks.map(bookmark => (
                        <button
                            key={bookmark.id}
                            onClick={() => navigate(bookmark.url)}
                            className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs whitespace-nowrap transition-colors ${
                                darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-200 text-gray-600'
                            }`}
                        >
                            <span>{bookmark.icon}</span>
                            <span>{bookmark.title}</span>
                        </button>
                    ))}
                </div>
            )}

            {/* Content */}
            <div className="flex-1 relative">
                {activeTab?.url ? (
                    <iframe
                        ref={iframeRef}
                        src={activeTab.url}
                        className="w-full h-full border-none"
                        title="Browser"
                        onLoad={handleIframeLoad}
                        sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                    />
                ) : (
                    <div className={`w-full h-full flex flex-col items-center justify-center p-8 ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-b from-gray-50 to-gray-100'}`}>
                        <div className="text-center mb-8">
                            <h1 className={`text-2xl font-light mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                Start Page
                            </h1>
                            <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                                Search the web or visit your favorite sites
                            </p>
                        </div>

                        {/* Search Box */}
                        <form onSubmit={handleSubmit} className="w-full max-w-md mb-10">
                            <div className={`flex items-center px-4 py-3 rounded-xl shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                                <FaSearch className={`w-4 h-4 mr-3 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                                <input
                                    type="text"
                                    value={inputUrl}
                                    onChange={(e) => setInputUrl(e.target.value)}
                                    placeholder="Search or enter website name"
                                    className={`flex-1 bg-transparent outline-none ${darkMode ? 'text-white placeholder-gray-500' : 'text-gray-800 placeholder-gray-400'}`}
                                    autoFocus
                                />
                            </div>
                        </form>

                        {/* Quick Links */}
                        <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 max-w-2xl">
                            {quickLinks.map((link, index) => (
                                <button
                                    key={index}
                                    onClick={() => navigate(link.url)}
                                    className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-white/50 dark:hover:bg-gray-800 transition-colors"
                                >
                                    <div className={`w-12 h-12 rounded-xl ${link.color} flex items-center justify-center shadow-md`}>
                                        <span className="text-white text-lg font-bold">
                                            {link.title.charAt(0)}
                                        </span>
                                    </div>
                                    <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                        {link.title}
                                    </span>
                                </button>
                            ))}
                        </div>

                        {/* Bookmarks Section */}
                        {bookmarks.length > 0 && (
                            <div className="mt-10 w-full max-w-2xl">
                                <h2 className={`text-sm font-medium mb-4 flex items-center gap-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    <FaBookmark className="w-3 h-3" />
                                    Bookmarks
                                </h2>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    {bookmarks.slice(0, 8).map(bookmark => (
                                        <button
                                            key={bookmark.id}
                                            onClick={() => navigate(bookmark.url)}
                                            className={`flex items-center gap-2 p-3 rounded-lg text-left transition-colors ${
                                                darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50 shadow-sm'
                                            }`}
                                        >
                                            <span className="text-lg">{bookmark.icon}</span>
                                            <span className={`text-sm truncate ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                                {bookmark.title}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Safari
