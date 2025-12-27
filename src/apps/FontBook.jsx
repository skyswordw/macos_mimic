import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useStore } from '../store/useStore'
import { FaSearch, FaPlus, FaTrash, FaCheck, FaFont, FaInfo, FaDownload, FaStar, FaEye, FaList, FaThLarge } from 'react-icons/fa'

const fonts = [
    { id: 1, name: 'San Francisco', family: 'System', styles: ['Regular', 'Bold', 'Light', 'Medium', 'Semibold'], installed: true, system: true },
    { id: 2, name: 'Helvetica Neue', family: 'Sans Serif', styles: ['Regular', 'Bold', 'Light', 'Italic', 'Bold Italic'], installed: true, system: true },
    { id: 3, name: 'Arial', family: 'Sans Serif', styles: ['Regular', 'Bold', 'Italic', 'Bold Italic'], installed: true, system: true },
    { id: 4, name: 'Times New Roman', family: 'Serif', styles: ['Regular', 'Bold', 'Italic', 'Bold Italic'], installed: true, system: true },
    { id: 5, name: 'Georgia', family: 'Serif', styles: ['Regular', 'Bold', 'Italic', 'Bold Italic'], installed: true, system: true },
    { id: 6, name: 'Courier New', family: 'Monospace', styles: ['Regular', 'Bold'], installed: true, system: true },
    { id: 7, name: 'Monaco', family: 'Monospace', styles: ['Regular'], installed: true, system: true },
    { id: 8, name: 'Menlo', family: 'Monospace', styles: ['Regular', 'Bold', 'Italic', 'Bold Italic'], installed: true, system: true },
    { id: 9, name: 'Avenir', family: 'Sans Serif', styles: ['Light', 'Book', 'Roman', 'Medium', 'Heavy', 'Black'], installed: true, system: false },
    { id: 10, name: 'Futura', family: 'Sans Serif', styles: ['Medium', 'Bold', 'Condensed Medium', 'Condensed ExtraBold'], installed: true, system: false },
    { id: 11, name: 'Palatino', family: 'Serif', styles: ['Roman', 'Italic', 'Bold', 'Bold Italic'], installed: true, system: false },
    { id: 12, name: 'Didot', family: 'Serif', styles: ['Regular', 'Italic', 'Bold'], installed: true, system: false },
]

const collections = [
    { id: 'all', name: 'All Fonts', count: fonts.length },
    { id: 'system', name: 'System', count: fonts.filter(f => f.system).length },
    { id: 'user', name: 'User', count: fonts.filter(f => !f.system).length },
    { id: 'favorites', name: 'Favorites', count: 0 },
    { id: 'recently', name: 'Recently Added', count: 2 },
]

const FontBook = () => {
    const { darkMode } = useStore()
    const [selectedCollection, setSelectedCollection] = useState('all')
    const [selectedFont, setSelectedFont] = useState(fonts[0])
    const [searchQuery, setSearchQuery] = useState('')
    const [previewText, setPreviewText] = useState('The quick brown fox jumps over the lazy dog.')
    const [previewSize, setPreviewSize] = useState(24)
    const [viewMode, setViewMode] = useState('list')
    const [favorites, setFavorites] = useState([])

    const filteredFonts = fonts.filter(font => {
        if (searchQuery && !font.name.toLowerCase().includes(searchQuery.toLowerCase())) return false
        if (selectedCollection === 'system') return font.system
        if (selectedCollection === 'user') return !font.system
        if (selectedCollection === 'favorites') return favorites.includes(font.id)
        return true
    })

    const toggleFavorite = (id) => {
        setFavorites(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
    }

    return (
        <div className={`h-full flex ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
            {/* Sidebar - Collections */}
            <div className={`w-48 border-r flex flex-col ${darkMode ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-white'}`}>
                <div className="p-2 text-xs font-semibold text-gray-500 uppercase">Collections</div>
                {collections.map(col => (
                    <button key={col.id} onClick={() => setSelectedCollection(col.id)}
                        className={`px-3 py-1.5 text-left text-sm flex justify-between ${
                            selectedCollection === col.id
                                ? (darkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white')
                                : (darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100')
                        }`}>
                        <span>{col.name}</span>
                        <span className="opacity-60">{col.id === 'favorites' ? favorites.length : col.count}</span>
                    </button>
                ))}

                <div className={`mt-auto p-2 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <button className="w-full py-1.5 text-sm flex items-center justify-center gap-1 text-blue-500">
                        <FaPlus /> Add Collection
                    </button>
                </div>
            </div>

            {/* Font List */}
            <div className={`w-64 border-r flex flex-col ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="p-2 flex gap-2">
                    <div className={`flex-1 flex items-center gap-1 px-2 py-1 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                        <FaSearch className="text-gray-400 text-xs" />
                        <input type="text" placeholder="Search" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                            className="bg-transparent flex-1 outline-none text-sm" />
                    </div>
                    <button onClick={() => setViewMode(v => v === 'list' ? 'grid' : 'list')}
                        className={`p-1.5 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                        {viewMode === 'list' ? <FaThLarge className="text-xs" /> : <FaList className="text-xs" />}
                    </button>
                </div>

                <div className="flex-1 overflow-auto">
                    {filteredFonts.map(font => (
                        <button key={font.id} onClick={() => setSelectedFont(font)}
                            className={`w-full px-3 py-2 text-left flex items-center justify-between ${
                                selectedFont?.id === font.id
                                    ? (darkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white')
                                    : (darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100')
                            }`}>
                            <div>
                                <div className="font-medium" style={{ fontFamily: font.name }}>{font.name}</div>
                                <div className="text-xs opacity-60">{font.styles.length} styles</div>
                            </div>
                            {favorites.includes(font.id) && <FaStar className="text-yellow-500 text-xs" />}
                        </button>
                    ))}
                </div>

                <div className={`p-2 border-t text-xs text-center text-gray-500 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    {filteredFonts.length} fonts
                </div>
            </div>

            {/* Preview */}
            <div className="flex-1 flex flex-col">
                {selectedFont ? (
                    <>
                        {/* Toolbar */}
                        <div className={`flex items-center gap-2 p-2 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                            <button onClick={() => toggleFavorite(selectedFont.id)}
                                className={`p-1.5 rounded ${favorites.includes(selectedFont.id) ? 'text-yellow-500' : 'text-gray-400'}`}>
                                <FaStar />
                            </button>
                            <button className="p-1.5 rounded text-gray-400"><FaInfo /></button>
                            <div className="flex-1" />
                            <span className="text-sm text-gray-500">Size:</span>
                            <input type="range" min="12" max="72" value={previewSize}
                                onChange={e => setPreviewSize(Number(e.target.value))} className="w-24" />
                            <span className="text-sm w-8">{previewSize}</span>
                        </div>

                        {/* Font Info */}
                        <div className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                            <h2 className="text-2xl font-bold" style={{ fontFamily: selectedFont.name }}>{selectedFont.name}</h2>
                            <div className="flex gap-4 mt-2 text-sm text-gray-500">
                                <span>Family: {selectedFont.family}</span>
                                <span>Styles: {selectedFont.styles.length}</span>
                                <span>{selectedFont.system ? 'System Font' : 'User Font'}</span>
                            </div>
                        </div>

                        {/* Preview Text */}
                        <div className="flex-1 overflow-auto p-4">
                            <div className="mb-4">
                                <input type="text" value={previewText} onChange={e => setPreviewText(e.target.value)}
                                    placeholder="Type preview text..."
                                    className={`w-full px-3 py-2 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white border'}`} />
                            </div>

                            {/* All Styles Preview */}
                            <div className="space-y-6">
                                {selectedFont.styles.map(style => (
                                    <div key={style} className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                                        <div className="text-xs text-gray-500 mb-2">{selectedFont.name} {style}</div>
                                        <div style={{
                                            fontFamily: selectedFont.name,
                                            fontSize: `${previewSize}px`,
                                            fontWeight: style.includes('Bold') ? 'bold' : style.includes('Light') ? 300 : style.includes('Medium') ? 500 : 'normal',
                                            fontStyle: style.includes('Italic') ? 'italic' : 'normal'
                                        }}>
                                            {previewText}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Character Set */}
                            <div className={`mt-6 p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                                <div className="text-sm font-semibold mb-3">Character Set</div>
                                <div className="grid grid-cols-16 gap-1 text-center" style={{ fontFamily: selectedFont.name }}>
                                    {'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'.split('').map((char, i) => (
                                        <span key={i} className={`p-1 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>{char}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-500">
                        <div className="text-center">
                            <FaFont className="text-5xl mx-auto mb-3 opacity-20" />
                            <p>Select a font to preview</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default FontBook
