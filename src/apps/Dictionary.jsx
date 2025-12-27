import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useStore } from '../store/useStore'
import { FaSearch, FaBook, FaVolumeUp, FaBookmark, FaRegBookmark, FaHistory, FaGlobe, FaQuoteLeft } from 'react-icons/fa'

const dictionaryData = {
    'hello': {
        word: 'hello',
        phonetic: '/həˈloʊ/',
        partOfSpeech: 'exclamation, noun',
        definitions: [
            { type: 'exclamation', meaning: 'Used as a greeting or to begin a phone conversation.', example: '"Hello there, Katie!"' },
            { type: 'noun', meaning: 'An utterance of "hello"; a greeting.', example: 'She was getting polite hellos from everyone.' }
        ],
        synonyms: ['hi', 'hey', 'greetings', 'salutations', 'howdy'],
        origin: 'Early 19th century: variant of earlier hollo; related to holla.',
        translations: { spanish: 'hola', french: 'bonjour', german: 'hallo', japanese: 'こんにちは', chinese: '你好' }
    },
    'computer': {
        word: 'computer',
        phonetic: '/kəmˈpjuːtər/',
        partOfSpeech: 'noun',
        definitions: [
            { type: 'noun', meaning: 'An electronic device for storing and processing data, typically in binary form, according to instructions given to it in a variable program.', example: 'The first electronic computers were developed in the mid-20th century.' },
            { type: 'noun', meaning: 'A person who makes calculations, especially with a calculating machine.', example: 'The term originally referred to human computers.' }
        ],
        synonyms: ['PC', 'laptop', 'desktop', 'workstation', 'mainframe', 'processor'],
        origin: 'Early 17th century (in the sense of a person who makes calculations): from compute + -er.',
        translations: { spanish: 'computadora', french: 'ordinateur', german: 'Computer', japanese: 'コンピュータ', chinese: '电脑' }
    },
    'apple': {
        word: 'apple',
        phonetic: '/ˈæp.əl/',
        partOfSpeech: 'noun',
        definitions: [
            { type: 'noun', meaning: 'The round fruit of a tree of the rose family, which typically has thin green or red skin and crisp flesh.', example: 'She picked a ripe apple from the tree.' },
            { type: 'noun', meaning: 'The tree bearing apples, with hard pale timber that is used in carpentry and to smoke food.', example: 'An orchard of apple trees.' }
        ],
        synonyms: ['fruit', 'pome'],
        origin: 'Old English æppel, of Germanic origin; related to Dutch appel and German Apfel.',
        translations: { spanish: 'manzana', french: 'pomme', german: 'Apfel', japanese: 'りんご', chinese: '苹果' }
    },
    'software': {
        word: 'software',
        phonetic: '/ˈsɒftweə/',
        partOfSpeech: 'noun',
        definitions: [
            { type: 'noun', meaning: 'The programs and other operating information used by a computer.', example: 'The company develops educational software.' },
        ],
        synonyms: ['programs', 'applications', 'apps', 'system'],
        origin: '1960s: from soft + ware, by analogy with hardware.',
        translations: { spanish: 'software', french: 'logiciel', german: 'Software', japanese: 'ソフトウェア', chinese: '软件' }
    },
    'design': {
        word: 'design',
        phonetic: '/dɪˈzaɪn/',
        partOfSpeech: 'noun, verb',
        definitions: [
            { type: 'noun', meaning: 'A plan or drawing produced to show the look and function or workings of something before it is made.', example: 'He has just unveiled his design for the new museum.' },
            { type: 'verb', meaning: 'Decide upon the look and functioning of (a building, garment, or other object), by making a detailed drawing of it.', example: 'A number of architectural students were asked to design a new building.' }
        ],
        synonyms: ['plan', 'blueprint', 'drawing', 'sketch', 'outline', 'draft', 'create', 'devise'],
        origin: 'Late Middle English (as a verb in the sense mark out, designate): from Latin designare to mark out, choose, from de- out + signare to mark (from signum a mark).',
        translations: { spanish: 'diseño', french: 'design', german: 'Design', japanese: 'デザイン', chinese: '设计' }
    },
}

const Dictionary = () => {
    const { darkMode } = useStore()
    const [searchQuery, setSearchQuery] = useState('')
    const [currentWord, setCurrentWord] = useState(null)
    const [searchHistory, setSearchHistory] = useState(['hello', 'computer', 'apple'])
    const [bookmarks, setBookmarks] = useState(['design'])
    const [activeTab, setActiveTab] = useState('dictionary')

    const searchWord = (word) => {
        const lowerWord = word.toLowerCase().trim()
        if (dictionaryData[lowerWord]) {
            setCurrentWord(dictionaryData[lowerWord])
            if (!searchHistory.includes(lowerWord)) {
                setSearchHistory(prev => [lowerWord, ...prev].slice(0, 10))
            }
        } else {
            setCurrentWord({ notFound: true, word: lowerWord })
        }
        setSearchQuery('')
    }

    const handleSearch = (e) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            searchWord(searchQuery)
        }
    }

    const toggleBookmark = (word) => {
        setBookmarks(prev =>
            prev.includes(word) ? prev.filter(w => w !== word) : [...prev, word]
        )
    }

    const speakWord = (word) => {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(word)
            utterance.lang = 'en-US'
            speechSynthesis.speak(utterance)
        }
    }

    return (
        <div className={`h-full flex ${darkMode ? 'bg-gray-900 text-white' : 'bg-amber-50 text-gray-900'}`}>
            {/* Sidebar */}
            <div className={`w-64 border-r flex flex-col ${darkMode ? 'border-gray-700 bg-gray-800/50' : 'border-amber-200 bg-white'}`}>
                <div className="p-4">
                    <form onSubmit={handleSearch}>
                        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-amber-100'}`}>
                            <FaSearch className="text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search dictionary..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="bg-transparent flex-1 outline-none"
                            />
                        </div>
                    </form>
                </div>

                <div className="flex border-b ${darkMode ? 'border-gray-700' : 'border-amber-200'}">
                    {[{ id: 'dictionary', icon: FaBook, label: 'All' }, { id: 'history', icon: FaHistory, label: 'History' }, { id: 'bookmarks', icon: FaBookmark, label: 'Saved' }].map(tab => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 py-2 text-xs flex flex-col items-center gap-1 ${
                                activeTab === tab.id ? 'text-amber-600 border-b-2 border-amber-600' : 'text-gray-500'
                            }`}>
                            <tab.icon />
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="flex-1 overflow-auto">
                    {activeTab === 'dictionary' && (
                        <div className="p-2">
                            <div className="text-xs text-gray-500 px-2 py-1">SUGGESTED WORDS</div>
                            {Object.keys(dictionaryData).map(word => (
                                <button key={word} onClick={() => searchWord(word)}
                                    className={`w-full px-3 py-2 text-left rounded-lg capitalize ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-amber-100'}`}>
                                    {word}
                                </button>
                            ))}
                        </div>
                    )}

                    {activeTab === 'history' && (
                        <div className="p-2">
                            <div className="text-xs text-gray-500 px-2 py-1">RECENT SEARCHES</div>
                            {searchHistory.map(word => (
                                <button key={word} onClick={() => searchWord(word)}
                                    className={`w-full px-3 py-2 text-left rounded-lg capitalize flex items-center gap-2 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-amber-100'}`}>
                                    <FaHistory className="text-gray-400 text-xs" />
                                    {word}
                                </button>
                            ))}
                        </div>
                    )}

                    {activeTab === 'bookmarks' && (
                        <div className="p-2">
                            <div className="text-xs text-gray-500 px-2 py-1">SAVED WORDS</div>
                            {bookmarks.length > 0 ? bookmarks.map(word => (
                                <button key={word} onClick={() => searchWord(word)}
                                    className={`w-full px-3 py-2 text-left rounded-lg capitalize flex items-center gap-2 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-amber-100'}`}>
                                    <FaBookmark className="text-amber-500 text-xs" />
                                    {word}
                                </button>
                            )) : (
                                <div className="text-center py-8 text-gray-500 text-sm">No saved words</div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto p-8">
                {currentWord ? (
                    currentWord.notFound ? (
                        <div className="text-center py-20">
                            <FaBook className="text-6xl mx-auto mb-4 text-gray-300" />
                            <h2 className="text-2xl font-bold mb-2">Word not found</h2>
                            <p className="text-gray-500">No definitions found for "{currentWord.word}"</p>
                        </div>
                    ) : (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                            {/* Word Header */}
                            <div className="flex items-start justify-between mb-8">
                                <div>
                                    <h1 className="text-5xl font-bold capitalize mb-2">{currentWord.word}</h1>
                                    <div className="flex items-center gap-4 text-gray-500">
                                        <span className="text-lg">{currentWord.phonetic}</span>
                                        <button onClick={() => speakWord(currentWord.word)} className="p-2 rounded-full hover:bg-amber-200 dark:hover:bg-gray-700">
                                            <FaVolumeUp />
                                        </button>
                                        <span className="italic">{currentWord.partOfSpeech}</span>
                                    </div>
                                </div>
                                <button onClick={() => toggleBookmark(currentWord.word)}
                                    className={`p-3 rounded-full ${bookmarks.includes(currentWord.word) ? 'text-amber-500' : 'text-gray-400'}`}>
                                    {bookmarks.includes(currentWord.word) ? <FaBookmark className="text-xl" /> : <FaRegBookmark className="text-xl" />}
                                </button>
                            </div>

                            {/* Definitions */}
                            <div className={`rounded-2xl p-6 mb-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                                <h3 className="font-semibold mb-4 text-amber-600">Definitions</h3>
                                <div className="space-y-4">
                                    {currentWord.definitions.map((def, i) => (
                                        <div key={i} className="flex gap-4">
                                            <div className="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900 text-amber-600 flex items-center justify-center text-sm font-bold">
                                                {i + 1}
                                            </div>
                                            <div>
                                                <span className="text-xs text-gray-500 italic">{def.type}</span>
                                                <p className="mb-1">{def.meaning}</p>
                                                {def.example && (
                                                    <p className="text-gray-500 italic flex items-center gap-2">
                                                        <FaQuoteLeft className="text-xs" />
                                                        {def.example}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Synonyms */}
                            {currentWord.synonyms && (
                                <div className={`rounded-2xl p-6 mb-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                                    <h3 className="font-semibold mb-3 text-amber-600">Synonyms</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {currentWord.synonyms.map(syn => (
                                            <button key={syn} onClick={() => dictionaryData[syn] && searchWord(syn)}
                                                className={`px-3 py-1 rounded-full text-sm ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-amber-100 hover:bg-amber-200'}`}>
                                                {syn}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Origin */}
                            {currentWord.origin && (
                                <div className={`rounded-2xl p-6 mb-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                                    <h3 className="font-semibold mb-2 text-amber-600">Origin</h3>
                                    <p className="text-gray-500">{currentWord.origin}</p>
                                </div>
                            )}

                            {/* Translations */}
                            {currentWord.translations && (
                                <div className={`rounded-2xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                                    <h3 className="font-semibold mb-3 text-amber-600 flex items-center gap-2"><FaGlobe /> Translations</h3>
                                    <div className="grid grid-cols-3 gap-3">
                                        {Object.entries(currentWord.translations).map(([lang, trans]) => (
                                            <div key={lang} className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-amber-50'}`}>
                                                <div className="text-xs text-gray-500 capitalize">{lang}</div>
                                                <div className="font-medium">{trans}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center">
                        <FaBook className="text-8xl mb-6 text-amber-200 dark:text-gray-700" />
                        <h2 className="text-2xl font-bold mb-2">Dictionary</h2>
                        <p className="text-gray-500 max-w-md">
                            Search for a word to see its definition, pronunciation, synonyms, and more.
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Dictionary
