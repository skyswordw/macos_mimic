import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../../store/useStore'
import { FaSearch, FaClock, FaSmile, FaDog, FaHamburger, FaFutbol, FaCar, FaLightbulb, FaHeart, FaFlag } from 'react-icons/fa'

const emojiData = {
    'Smileys': ['😀', '😃', '😄', '😁', '😅', '😂', '🤣', '😊', '😇', '🙂', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥', '😌', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮', '🤧', '🥵', '🥶', '🥴', '😵', '🤯', '🤠', '🥳', '😎', '🤓', '🧐'],
    'Animals': ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🐤', '🦆', '🦅', '🦉', '🦇', '🐺', '🐗', '🐴', '🦄', '🐝', '🐛', '🦋', '🐌', '🐞', '🐜', '🦟', '🦗', '🕷️', '🦂', '🐢', '🐍', '🦎', '🦖', '🦕', '🐙', '🦑', '🦐', '🦞', '🦀', '🐡', '🐠', '🐟'],
    'Food': ['🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑', '🥦', '🥬', '🥒', '🌶️', '🫑', '🌽', '🥕', '🧄', '🧅', '🥔', '🍠', '🥐', '🥯', '🍞', '🥖', '🥨', '🧀', '🥚', '🍳', '🧈', '🥞', '🧇', '🥓', '🥩', '🍗', '🍖', '🦴', '🌭', '🍔', '🍟', '🍕', '🫓', '🥪', '🥙', '🧆', '🌮', '🌯', '🫔', '🥗', '🥘', '🫕'],
    'Activities': ['⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱', '🪀', '🏓', '🏸', '🏒', '🏑', '🥍', '🏏', '🪃', '🥅', '⛳', '🪁', '🏹', '🎣', '🤿', '🥊', '🥋', '🎽', '🛹', '🛼', '🛷', '⛸️', '🥌', '🎿', '⛷️', '🏂', '🪂', '🏋️', '🤼', '🤸', '⛹️', '🤺', '🤾', '🏌️', '🏇', '⛸️', '🏄', '🏊', '🤽', '🚣', '🧗', '🚵', '🚴'],
    'Travel': ['🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒', '🚐', '🛻', '🚚', '🚛', '🚜', '🏍️', '🛵', '🚲', '🛴', '🛹', '🚁', '🛸', '✈️', '🛩️', '🛫', '🛬', '🪂', '💺', '🚀', '🛰️', '🚢', '⛵', '🚤', '🛥️', '🛳️', '⛴️', '🚂', '🚃', '🚄', '🚅', '🚆', '🚇', '🚈', '🚉', '🚊', '🚝', '🚞', '🚋', '🚃', '🚎', '🚌'],
    'Objects': ['💡', '🔦', '🏮', '📱', '📲', '💻', '🖥️', '🖨️', '⌨️', '🖱️', '🖲️', '💽', '💾', '💿', '📀', '📼', '📷', '📸', '📹', '🎥', '📽️', '🎞️', '📞', '☎️', '📟', '📠', '📺', '📻', '🎙️', '🎚️', '🎛️', '⏱️', '⏲️', '⏰', '🕰️', '⌛', '⏳', '📡', '🔋', '🔌', '💳', '💰', '💎', '⚖️', '🔧', '🔨', '⚒️', '🛠️', '⛏️', '🔩', '⚙️'],
    'Symbols': ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '✨', '⭐', '🌟', '💫', '⚡', '🔥', '💥', '🎉', '🎊', '✅', '❌', '⭕', '❗', '❓', '💯', '🔴', '🟠', '🟡', '🟢', '🔵', '🟣', '⚫', '⚪', '🟤', '🔶', '🔷', '🔸', '🔹', '🔺', '🔻', '💠', '🔘'],
    'Flags': ['🏳️', '🏴', '🏁', '🚩', '🏳️‍🌈', '🏳️‍⚧️', '🇺🇸', '🇬🇧', '🇨🇦', '🇦🇺', '🇫🇷', '🇩🇪', '🇯🇵', '🇰🇷', '🇨🇳', '🇮🇳', '🇧🇷', '🇲🇽', '🇮🇹', '🇪🇸', '🇷🇺', '🇳🇱', '🇧🇪', '🇨🇭', '🇦🇹', '🇸🇪', '🇳🇴', '🇩🇰', '🇫🇮', '🇵🇱', '🇹🇷', '🇬🇷', '🇵🇹', '🇮🇪', '🇿🇦', '🇪🇬', '🇳🇬', '🇰🇪', '🇦🇪', '🇸🇦', '🇮🇱', '🇸🇬', '🇹🇭', '🇻🇳', '🇵🇭', '🇮🇩', '🇲🇾', '🇳🇿', '🇦🇷', '🇨🇱'],
}

const categoryIcons = {
    'Smileys': FaSmile,
    'Animals': FaDog,
    'Food': FaHamburger,
    'Activities': FaFutbol,
    'Travel': FaCar,
    'Objects': FaLightbulb,
    'Symbols': FaHeart,
    'Flags': FaFlag,
}

const EmojiPicker = ({ isOpen, onClose, onSelect, position = { x: 100, y: 100 } }) => {
    const { darkMode } = useStore()
    const [searchQuery, setSearchQuery] = useState('')
    const [activeCategory, setActiveCategory] = useState('Smileys')
    const [recentEmojis, setRecentEmojis] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('recent-emojis') || '[]')
        } catch {
            return []
        }
    })
    const inputRef = useRef(null)

    useEffect(() => {
        if (isOpen) {
            setSearchQuery('')
            setTimeout(() => inputRef.current?.focus(), 100)
        }
    }, [isOpen])

    const handleEmojiClick = (emoji) => {
        // Add to recent
        const newRecent = [emoji, ...recentEmojis.filter(e => e !== emoji)].slice(0, 20)
        setRecentEmojis(newRecent)
        localStorage.setItem('recent-emojis', JSON.stringify(newRecent))

        if (onSelect) {
            onSelect(emoji)
        }
    }

    const filteredEmojis = searchQuery
        ? Object.values(emojiData).flat().filter(emoji => emoji.includes(searchQuery))
        : null

    if (!isOpen) return null

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                style={{ left: position.x, top: position.y }}
                className={`fixed z-[80] w-80 rounded-xl overflow-hidden shadow-2xl ${
                    darkMode ? 'bg-gray-800' : 'bg-white'
                } border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
            >
                {/* Header */}
                <div className={`p-2 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                        <FaSearch className="text-gray-400 text-sm" />
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="Search emoji"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className={`bg-transparent flex-1 outline-none text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}
                        />
                    </div>
                </div>

                {/* Category tabs */}
                <div className={`flex gap-1 p-1 border-b overflow-x-auto ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    {recentEmojis.length > 0 && (
                        <button
                            onClick={() => setActiveCategory('Recent')}
                            className={`p-2 rounded-lg ${activeCategory === 'Recent' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                        >
                            <FaClock className="text-sm" />
                        </button>
                    )}
                    {Object.keys(emojiData).map(category => {
                        const Icon = categoryIcons[category]
                        return (
                            <button
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                className={`p-2 rounded-lg ${activeCategory === category ? 'bg-blue-500 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                            >
                                <Icon className="text-sm" />
                            </button>
                        )
                    })}
                </div>

                {/* Emoji grid */}
                <div className="h-64 overflow-auto p-2">
                    {searchQuery ? (
                        <div>
                            <div className="text-xs text-gray-500 mb-2">Search Results</div>
                            <div className="grid grid-cols-8 gap-1">
                                {filteredEmojis?.length > 0 ? (
                                    filteredEmojis.map((emoji, i) => (
                                        <button
                                            key={i}
                                            onClick={() => handleEmojiClick(emoji)}
                                            className="text-2xl p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                                        >
                                            {emoji}
                                        </button>
                                    ))
                                ) : (
                                    <div className="col-span-8 text-center text-gray-500 py-4">No emoji found</div>
                                )}
                            </div>
                        </div>
                    ) : activeCategory === 'Recent' ? (
                        <div>
                            <div className="text-xs text-gray-500 mb-2">Recently Used</div>
                            <div className="grid grid-cols-8 gap-1">
                                {recentEmojis.map((emoji, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handleEmojiClick(emoji)}
                                        className="text-2xl p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                                    >
                                        {emoji}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div>
                            <div className="text-xs text-gray-500 mb-2">{activeCategory}</div>
                            <div className="grid grid-cols-8 gap-1">
                                {emojiData[activeCategory]?.map((emoji, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handleEmojiClick(emoji)}
                                        className="text-2xl p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                                    >
                                        {emoji}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className={`px-3 py-2 border-t text-xs text-gray-500 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    Press Escape to close • Click emoji to copy
                </div>
            </motion.div>
        </AnimatePresence>
    )
}

export default EmojiPicker
