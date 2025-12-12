import React, { useState, useRef, useEffect } from 'react'
import { useStore } from '../store/useStore'
import {
    FaBold, FaItalic, FaUnderline, FaStrikethrough,
    FaAlignLeft, FaAlignCenter, FaAlignRight, FaAlignJustify,
    FaListUl, FaListOl, FaUndo, FaRedo, FaPrint, FaFont,
    FaPlus, FaFileAlt, FaSave, FaFolderOpen
} from 'react-icons/fa'

const TextEdit = () => {
    const { darkMode } = useStore()
    const editorRef = useRef(null)
    const [documents, setDocuments] = useState([
        { id: 1, name: 'Untitled', content: '', active: true }
    ])
    const [activeDocId, setActiveDocId] = useState(1)
    const [fontSize, setFontSize] = useState(16)
    const [fontFamily, setFontFamily] = useState('system-ui')
    const [showFontMenu, setShowFontMenu] = useState(false)
    const [wordCount, setWordCount] = useState(0)
    const [charCount, setCharCount] = useState(0)

    const activeDoc = documents.find(d => d.id === activeDocId)

    const fonts = [
        { name: 'System', value: 'system-ui' },
        { name: 'Helvetica', value: 'Helvetica, Arial, sans-serif' },
        { name: 'Times', value: 'Times New Roman, serif' },
        { name: 'Georgia', value: 'Georgia, serif' },
        { name: 'Courier', value: 'Courier New, monospace' },
        { name: 'Monaco', value: 'Monaco, monospace' },
        { name: 'Comic Sans', value: 'Comic Sans MS, cursive' }
    ]

    const fontSizes = [9, 10, 11, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 72]

    // Execute formatting command
    const execCommand = (command, value = null) => {
        document.execCommand(command, false, value)
        editorRef.current?.focus()
    }

    // Update word and character count
    const updateCounts = () => {
        if (editorRef.current) {
            const text = editorRef.current.innerText || ''
            setCharCount(text.length)
            setWordCount(text.trim() ? text.trim().split(/\s+/).length : 0)
        }
    }

    // Handle content change
    const handleInput = () => {
        updateCounts()
        if (editorRef.current && activeDoc) {
            setDocuments(docs => docs.map(d =>
                d.id === activeDocId
                    ? { ...d, content: editorRef.current.innerHTML }
                    : d
            ))
        }
    }

    // Create new document
    const createNewDocument = () => {
        const newId = Math.max(...documents.map(d => d.id)) + 1
        const newDoc = {
            id: newId,
            name: `Untitled ${newId}`,
            content: '',
            active: true
        }
        setDocuments([...documents, newDoc])
        setActiveDocId(newId)
    }

    // Close document
    const closeDocument = (id) => {
        if (documents.length === 1) return
        const newDocs = documents.filter(d => d.id !== id)
        setDocuments(newDocs)
        if (activeDocId === id) {
            setActiveDocId(newDocs[0].id)
        }
    }

    // Switch document
    const switchDocument = (id) => {
        setActiveDocId(id)
    }

    // Load content when switching documents
    useEffect(() => {
        if (editorRef.current && activeDoc) {
            editorRef.current.innerHTML = activeDoc.content
            updateCounts()
        }
    }, [activeDocId])

    // Apply font changes
    useEffect(() => {
        if (editorRef.current) {
            editorRef.current.style.fontFamily = fontFamily
            editorRef.current.style.fontSize = `${fontSize}px`
        }
    }, [fontFamily, fontSize])

    // Toolbar button component
    const ToolbarButton = ({ icon: Icon, onClick, active, title }) => (
        <button
            onClick={onClick}
            title={title}
            className={`p-1.5 rounded transition-colors ${
                active
                    ? darkMode ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600'
                    : darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-200 text-gray-700'
            }`}
        >
            <Icon className="w-4 h-4" />
        </button>
    )

    // Separator component
    const Separator = () => (
        <div className={`w-px h-6 mx-1 ${darkMode ? 'bg-gray-600' : 'bg-gray-300'}`} />
    )

    return (
        <div className={`w-full h-full flex flex-col ${
            darkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'
        }`}>
            {/* Document Tabs */}
            <div className={`flex items-center border-b overflow-x-auto ${
                darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-200'
            }`}>
                {documents.map(doc => (
                    <div
                        key={doc.id}
                        onClick={() => switchDocument(doc.id)}
                        className={`flex items-center gap-2 px-4 py-2 cursor-pointer border-r transition-colors ${
                            doc.id === activeDocId
                                ? darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
                                : darkMode ? 'bg-gray-800 border-gray-700 hover:bg-gray-700' : 'bg-gray-100 border-gray-200 hover:bg-gray-50'
                        }`}
                    >
                        <FaFileAlt className={`w-3 h-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        <span className="text-sm whitespace-nowrap">{doc.name}</span>
                        {documents.length > 1 && (
                            <button
                                onClick={(e) => { e.stopPropagation(); closeDocument(doc.id) }}
                                className={`w-4 h-4 rounded-full flex items-center justify-center text-xs transition-colors ${
                                    darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-300'
                                }`}
                            >
                                ×
                            </button>
                        )}
                    </div>
                ))}
                <button
                    onClick={createNewDocument}
                    className={`p-2 transition-colors ${
                        darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-200 text-gray-500'
                    }`}
                    title="New Document"
                >
                    <FaPlus className="w-3 h-3" />
                </button>
            </div>

            {/* Toolbar */}
            <div className={`flex items-center gap-1 px-3 py-2 border-b flex-wrap ${
                darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
            }`}>
                {/* Undo/Redo */}
                <ToolbarButton icon={FaUndo} onClick={() => execCommand('undo')} title="Undo" />
                <ToolbarButton icon={FaRedo} onClick={() => execCommand('redo')} title="Redo" />

                <Separator />

                {/* Font Family */}
                <div className="relative">
                    <button
                        onClick={() => setShowFontMenu(!showFontMenu)}
                        className={`flex items-center gap-1 px-2 py-1 rounded text-sm min-w-[100px] ${
                            darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white border border-gray-300 hover:bg-gray-50'
                        }`}
                    >
                        <FaFont className="w-3 h-3" />
                        <span className="truncate">{fonts.find(f => f.value === fontFamily)?.name || 'System'}</span>
                    </button>
                    {showFontMenu && (
                        <div className={`absolute top-full left-0 mt-1 w-40 rounded-lg shadow-lg z-50 py-1 ${
                            darkMode ? 'bg-gray-700' : 'bg-white border border-gray-200'
                        }`}>
                            {fonts.map(font => (
                                <button
                                    key={font.value}
                                    onClick={() => { setFontFamily(font.value); setShowFontMenu(false) }}
                                    className={`w-full text-left px-3 py-1.5 text-sm transition-colors ${
                                        fontFamily === font.value
                                            ? darkMode ? 'bg-blue-600' : 'bg-blue-100'
                                            : darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'
                                    }`}
                                    style={{ fontFamily: font.value }}
                                >
                                    {font.name}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Font Size */}
                <select
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    className={`px-2 py-1 rounded text-sm ${
                        darkMode ? 'bg-gray-700 text-white' : 'bg-white border border-gray-300'
                    }`}
                >
                    {fontSizes.map(size => (
                        <option key={size} value={size}>{size}</option>
                    ))}
                </select>

                <Separator />

                {/* Text Formatting */}
                <ToolbarButton icon={FaBold} onClick={() => execCommand('bold')} title="Bold (⌘B)" />
                <ToolbarButton icon={FaItalic} onClick={() => execCommand('italic')} title="Italic (⌘I)" />
                <ToolbarButton icon={FaUnderline} onClick={() => execCommand('underline')} title="Underline (⌘U)" />
                <ToolbarButton icon={FaStrikethrough} onClick={() => execCommand('strikeThrough')} title="Strikethrough" />

                <Separator />

                {/* Alignment */}
                <ToolbarButton icon={FaAlignLeft} onClick={() => execCommand('justifyLeft')} title="Align Left" />
                <ToolbarButton icon={FaAlignCenter} onClick={() => execCommand('justifyCenter')} title="Center" />
                <ToolbarButton icon={FaAlignRight} onClick={() => execCommand('justifyRight')} title="Align Right" />
                <ToolbarButton icon={FaAlignJustify} onClick={() => execCommand('justifyFull')} title="Justify" />

                <Separator />

                {/* Lists */}
                <ToolbarButton icon={FaListUl} onClick={() => execCommand('insertUnorderedList')} title="Bullet List" />
                <ToolbarButton icon={FaListOl} onClick={() => execCommand('insertOrderedList')} title="Numbered List" />

                <Separator />

                {/* Color Pickers */}
                <div className="flex items-center gap-1">
                    <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Text:</span>
                    <input
                        type="color"
                        defaultValue="#000000"
                        onChange={(e) => execCommand('foreColor', e.target.value)}
                        className="w-6 h-6 rounded cursor-pointer"
                        title="Text Color"
                    />
                </div>
                <div className="flex items-center gap-1">
                    <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>BG:</span>
                    <input
                        type="color"
                        defaultValue="#ffffff"
                        onChange={(e) => execCommand('hiliteColor', e.target.value)}
                        className="w-6 h-6 rounded cursor-pointer"
                        title="Background Color"
                    />
                </div>
            </div>

            {/* Editor Area */}
            <div className="flex-1 overflow-auto p-4">
                <div
                    ref={editorRef}
                    contentEditable
                    onInput={handleInput}
                    className={`min-h-full p-4 rounded-lg outline-none ${
                        darkMode
                            ? 'bg-gray-800 text-gray-100 focus:ring-2 focus:ring-blue-500'
                            : 'bg-white text-gray-900 shadow-inner border border-gray-200 focus:ring-2 focus:ring-blue-400'
                    }`}
                    style={{
                        fontFamily: fontFamily,
                        fontSize: `${fontSize}px`,
                        lineHeight: 1.6
                    }}
                    suppressContentEditableWarning
                />
            </div>

            {/* Status Bar */}
            <div className={`flex items-center justify-between px-4 py-1 text-xs border-t ${
                darkMode ? 'bg-gray-800 border-gray-700 text-gray-400' : 'bg-gray-50 border-gray-200 text-gray-500'
            }`}>
                <div className="flex items-center gap-4">
                    <span>Words: {wordCount}</span>
                    <span>Characters: {charCount}</span>
                </div>
                <div className="flex items-center gap-2">
                    <span>{fonts.find(f => f.value === fontFamily)?.name}</span>
                    <span>{fontSize}px</span>
                </div>
            </div>
        </div>
    )
}

export default TextEdit
