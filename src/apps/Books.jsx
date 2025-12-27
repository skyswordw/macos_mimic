import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../store/useStore'
import { FaBook, FaHeadphones, FaSearch, FaBookmark, FaList, FaThLarge, FaChevronLeft, FaChevronRight, FaFont, FaSun, FaMoon, FaEllipsisH, FaStar, FaHeart, FaShare, FaTimes, FaPlus } from 'react-icons/fa'

const sampleBooks = [
    { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', cover: '📕', progress: 45, pages: 180, category: 'Classics', rating: 4.5 },
    { id: 2, title: '1984', author: 'George Orwell', cover: '📘', progress: 72, pages: 328, category: 'Fiction', rating: 4.8 },
    { id: 3, title: 'To Kill a Mockingbird', author: 'Harper Lee', cover: '📗', progress: 0, pages: 281, category: 'Classics', rating: 4.7 },
    { id: 4, title: 'Pride and Prejudice', author: 'Jane Austen', cover: '📙', progress: 100, pages: 432, category: 'Romance', rating: 4.6 },
    { id: 5, title: 'The Catcher in the Rye', author: 'J.D. Salinger', cover: '📕', progress: 23, pages: 277, category: 'Fiction', rating: 4.2 },
    { id: 6, title: 'Brave New World', author: 'Aldous Huxley', cover: '📘', progress: 0, pages: 311, category: 'Sci-Fi', rating: 4.4 },
]

const sampleContent = `Chapter 1

In my younger and more vulnerable years my father gave me some advice that I've been turning over in my mind ever since.

"Whenever you feel like criticizing anyone," he told me, "just remember that all the people in this world haven't had the advantages that you've had."

He didn't say any more, but we've always been unusually communicative in a reserved way, and I understood that he meant a great deal more than that. In consequence, I'm inclined to reserve all judgments, a habit that has opened up many curious natures to me and also made me the victim of not a few veteran bores.

The abnormal mind is quick to detect and attach itself to this quality when it appears in a normal person, and so it came about that in college I was unjustly accused of being a politician, because I was privy to the secret griefs of wild, unknown men. Most of the confidences were unsought — frequently I have feigned sleep, preoccupation, or a hostile levity when I realized by some unmistakable sign that an intimate revelation was quivering on the horizon; for the intimate revelations of young men, or at least the terms in which they express them, are usually plagiaristic and marred by obvious suppressions.`

const Books = () => {
    const { darkMode } = useStore()
    const [activeTab, setActiveTab] = useState('library')
    const [viewMode, setViewMode] = useState('grid')
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedBook, setSelectedBook] = useState(null)
    const [isReading, setIsReading] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [fontSize, setFontSize] = useState(16)
    const [readerTheme, setReaderTheme] = useState('light')
    const [showSettings, setShowSettings] = useState(false)

    const tabs = [
        { id: 'library', label: 'Library', icon: FaBook },
        { id: 'store', label: 'Book Store', icon: FaPlus },
        { id: 'audiobooks', label: 'Audiobooks', icon: FaHeadphones },
    ]

    const filteredBooks = sampleBooks.filter(book =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const readingBooks = sampleBooks.filter(b => b.progress > 0 && b.progress < 100)
    const wantToRead = sampleBooks.filter(b => b.progress === 0)
    const finished = sampleBooks.filter(b => b.progress === 100)

    if (isReading && selectedBook) {
        const bgColor = readerTheme === 'light' ? 'bg-amber-50' : readerTheme === 'sepia' ? 'bg-amber-100' : 'bg-gray-900'
        const textColor = readerTheme === 'dark' ? 'text-gray-200' : 'text-gray-800'

        return (
            <div className={`h-full flex flex-col ${bgColor} ${textColor}`}>
                {/* Reader Header */}
                <div className={`flex items-center justify-between px-4 py-2 border-b ${readerTheme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white/50'}`}>
                    <button onClick={() => setIsReading(false)} className="flex items-center gap-2 text-blue-500">
                        <FaChevronLeft /> Library
                    </button>
                    <div className="text-sm font-medium">{selectedBook.title}</div>
                    <button onClick={() => setShowSettings(!showSettings)} className="p-2">
                        <FaFont />
                    </button>
                </div>

                {/* Settings Panel */}
                <AnimatePresence>
                    {showSettings && (
                        <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
                            className={`overflow-hidden border-b ${readerTheme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
                            <div className="p-4 space-y-4">
                                <div>
                                    <div className="text-sm text-gray-500 mb-2">Font Size</div>
                                    <div className="flex items-center gap-4">
                                        <button onClick={() => setFontSize(f => Math.max(12, f - 2))} className="text-xl">A-</button>
                                        <input type="range" min="12" max="24" value={fontSize} onChange={e => setFontSize(Number(e.target.value))} className="flex-1" />
                                        <button onClick={() => setFontSize(f => Math.min(24, f + 2))} className="text-2xl">A+</button>
                                    </div>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-500 mb-2">Theme</div>
                                    <div className="flex gap-2">
                                        {[{ id: 'light', bg: 'bg-amber-50', icon: FaSun }, { id: 'sepia', bg: 'bg-amber-100' }, { id: 'dark', bg: 'bg-gray-900', icon: FaMoon }].map(theme => (
                                            <button key={theme.id} onClick={() => setReaderTheme(theme.id)}
                                                className={`w-10 h-10 rounded-full ${theme.bg} border-2 ${readerTheme === theme.id ? 'border-blue-500' : 'border-gray-300'}`} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Content */}
                <div className="flex-1 overflow-auto px-8 py-6">
                    <div className="max-w-2xl mx-auto leading-relaxed whitespace-pre-line" style={{ fontSize: `${fontSize}px` }}>
                        {sampleContent}
                    </div>
                </div>

                {/* Footer */}
                <div className={`flex items-center justify-between px-4 py-2 border-t ${readerTheme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                    <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} className="p-2"><FaChevronLeft /></button>
                    <div className="text-sm text-gray-500">Page {currentPage} of {selectedBook.pages}</div>
                    <button onClick={() => setCurrentPage(p => Math.min(selectedBook.pages, p + 1))} className="p-2"><FaChevronRight /></button>
                </div>
            </div>
        )
    }

    return (
        <div className={`h-full flex flex-col ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
            {/* Header */}
            <div className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-2xl font-bold">Books</h1>
                    <div className="flex items-center gap-2">
                        <button onClick={() => setViewMode('grid')} className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-500 text-white' : ''}`}><FaThLarge /></button>
                        <button onClick={() => setViewMode('list')} className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-500 text-white' : ''}`}><FaList /></button>
                    </div>
                </div>
                <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
                    <FaSearch className="text-gray-500" />
                    <input type="text" placeholder="Search books" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                        className="bg-transparent flex-1 outline-none" />
                </div>
                <div className="flex gap-2 mt-4">
                    {tabs.map(tab => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-1.5 rounded-full text-sm flex items-center gap-1.5 ${activeTab === tab.id ? 'bg-orange-500 text-white' : darkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
                            <tab.icon /> {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto p-4">
                {activeTab === 'library' && (
                    <div className="space-y-6">
                        {/* Reading Now */}
                        {readingBooks.length > 0 && (
                            <div>
                                <h2 className="text-lg font-semibold mb-3">Reading Now</h2>
                                <div className={viewMode === 'grid' ? 'grid grid-cols-4 gap-4' : 'space-y-2'}>
                                    {readingBooks.map(book => (
                                        <motion.div key={book.id} whileHover={{ scale: 1.02 }}
                                            onClick={() => { setSelectedBook(book); setIsReading(true) }}
                                            className={`cursor-pointer ${viewMode === 'grid' ? '' : `flex items-center gap-4 p-3 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}`}>
                                            {viewMode === 'grid' ? (
                                                <div className="text-center">
                                                    <div className="text-6xl mb-2">{book.cover}</div>
                                                    <div className="font-medium text-sm truncate">{book.title}</div>
                                                    <div className="text-xs text-gray-500">{book.author}</div>
                                                    <div className="mt-2 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                                        <div className="h-full bg-orange-500" style={{ width: `${book.progress}%` }} />
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="text-4xl">{book.cover}</div>
                                                    <div className="flex-1">
                                                        <div className="font-medium">{book.title}</div>
                                                        <div className="text-sm text-gray-500">{book.author}</div>
                                                        <div className="mt-1 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden w-32">
                                                            <div className="h-full bg-orange-500" style={{ width: `${book.progress}%` }} />
                                                        </div>
                                                    </div>
                                                    <div className="text-sm text-gray-500">{book.progress}%</div>
                                                </>
                                            )}
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Want to Read */}
                        {wantToRead.length > 0 && (
                            <div>
                                <h2 className="text-lg font-semibold mb-3">Want to Read</h2>
                                <div className={viewMode === 'grid' ? 'grid grid-cols-4 gap-4' : 'space-y-2'}>
                                    {wantToRead.map(book => (
                                        <motion.div key={book.id} whileHover={{ scale: 1.02 }}
                                            onClick={() => { setSelectedBook(book); setIsReading(true) }}
                                            className={`cursor-pointer ${viewMode === 'grid' ? 'text-center' : `flex items-center gap-4 p-3 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}`}>
                                            <div className={viewMode === 'grid' ? 'text-6xl mb-2' : 'text-4xl'}>{book.cover}</div>
                                            <div className={viewMode === 'grid' ? '' : 'flex-1'}>
                                                <div className="font-medium text-sm">{book.title}</div>
                                                <div className="text-xs text-gray-500">{book.author}</div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Finished */}
                        {finished.length > 0 && (
                            <div>
                                <h2 className="text-lg font-semibold mb-3">Finished</h2>
                                <div className={viewMode === 'grid' ? 'grid grid-cols-4 gap-4' : 'space-y-2'}>
                                    {finished.map(book => (
                                        <motion.div key={book.id} whileHover={{ scale: 1.02 }}
                                            onClick={() => { setSelectedBook(book); setIsReading(true) }}
                                            className={`cursor-pointer ${viewMode === 'grid' ? 'text-center opacity-75' : `flex items-center gap-4 p-3 rounded-lg opacity-75 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}`}>
                                            <div className={viewMode === 'grid' ? 'text-6xl mb-2' : 'text-4xl'}>{book.cover}</div>
                                            <div className={viewMode === 'grid' ? '' : 'flex-1'}>
                                                <div className="font-medium text-sm">{book.title}</div>
                                                <div className="text-xs text-gray-500">{book.author}</div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'store' && (
                    <div className="space-y-6">
                        <div className="text-center py-8">
                            <div className="text-6xl mb-4">📚</div>
                            <h2 className="text-xl font-bold mb-2">Book Store</h2>
                            <p className="text-gray-500">Browse and discover new books</p>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            {sampleBooks.map(book => (
                                <div key={book.id} className={`p-4 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                                    <div className="text-5xl text-center mb-3">{book.cover}</div>
                                    <div className="font-medium text-sm">{book.title}</div>
                                    <div className="text-xs text-gray-500 mb-2">{book.author}</div>
                                    <div className="flex items-center gap-1 text-yellow-500 text-sm">
                                        <FaStar /> {book.rating}
                                    </div>
                                    <button className="w-full mt-3 py-1.5 bg-blue-500 text-white rounded-lg text-sm">Get</button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'audiobooks' && (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">🎧</div>
                        <h2 className="text-xl font-bold mb-2">Audiobooks</h2>
                        <p className="text-gray-500">Listen to your favorite books</p>
                        <button className="mt-4 px-6 py-2 bg-orange-500 text-white rounded-full">Browse Audiobooks</button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Books
