import React, { useState, useEffect, useRef } from 'react'
import { FaFolder, FaFolderOpen, FaFile, FaJs, FaReact, FaCss3, FaHtml5, FaMarkdown, FaChevronRight, FaChevronDown, FaTimes, FaSearch, FaCog, FaCode, FaTerminal, FaGitAlt, FaBug, FaPuzzlePiece, FaUser, FaEllipsisH, FaSave, FaPlus, FaCopy, FaCheck } from 'react-icons/fa'
import { useStore } from '../store/useStore'

const defaultFiles = {
    'src': {
        type: 'folder',
        children: {
            'App.jsx': {
                type: 'file',
                language: 'jsx',
                content: `import React from 'react'
import { useState } from 'react'

function App() {
    const [count, setCount] = useState(0)

    return (
        <div className="app">
            <h1>Hello macOS!</h1>
            <button onClick={() => setCount(c => c + 1)}>
                Count: {count}
            </button>
        </div>
    )
}

export default App`
            },
            'index.js': {
                type: 'file',
                language: 'js',
                content: `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles.css'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
)`
            },
            'styles.css': {
                type: 'file',
                language: 'css',
                content: `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

.app {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
}

h1 {
    font-size: 3rem;
    margin-bottom: 2rem;
}

button {
    padding: 1rem 2rem;
    font-size: 1.2rem;
    border: none;
    border-radius: 8px;
    background: white;
    color: #667eea;
    cursor: pointer;
    transition: transform 0.2s;
}

button:hover {
    transform: scale(1.05);
}`
            },
            'components': {
                type: 'folder',
                children: {
                    'Header.jsx': {
                        type: 'file',
                        language: 'jsx',
                        content: `import React from 'react'

const Header = ({ title }) => {
    return (
        <header className="header">
            <nav>
                <a href="/">Home</a>
                <a href="/about">About</a>
                <a href="/contact">Contact</a>
            </nav>
            <h1>{title}</h1>
        </header>
    )
}

export default Header`
                    },
                    'Button.jsx': {
                        type: 'file',
                        language: 'jsx',
                        content: `import React from 'react'

const Button = ({ children, onClick, variant = 'primary' }) => {
    const variants = {
        primary: 'bg-blue-500 hover:bg-blue-600',
        secondary: 'bg-gray-500 hover:bg-gray-600',
        danger: 'bg-red-500 hover:bg-red-600'
    }

    return (
        <button
            className={\`px-4 py-2 rounded text-white \${variants[variant]}\`}
            onClick={onClick}
        >
            {children}
        </button>
    )
}

export default Button`
                    }
                }
            }
        }
    },
    'package.json': {
        type: 'file',
        language: 'json',
        content: `{
    "name": "my-react-app",
    "version": "1.0.0",
    "scripts": {
        "dev": "vite",
        "build": "vite build",
        "preview": "vite preview"
    },
    "dependencies": {
        "react": "^18.2.0",
        "react-dom": "^18.2.0"
    },
    "devDependencies": {
        "vite": "^5.0.0"
    }
}`
    },
    'README.md': {
        type: 'file',
        language: 'md',
        content: `# My React App

A simple React application built with Vite.

## Getting Started

\`\`\`bash
npm install
npm run dev
\`\`\`

## Features

- ⚡️ Fast HMR with Vite
- 🎨 Styled with CSS
- 📦 Easy to deploy

## License

MIT`
    }
}

const getFileIcon = (name, language) => {
    if (language === 'jsx') return <FaReact className="text-cyan-400" />
    if (language === 'js') return <FaJs className="text-yellow-400" />
    if (language === 'css') return <FaCss3 className="text-blue-400" />
    if (language === 'html') return <FaHtml5 className="text-orange-500" />
    if (language === 'md') return <FaMarkdown className="text-white" />
    if (language === 'json') return <FaCode className="text-yellow-300" />
    return <FaFile className="text-gray-400" />
}

const syntaxHighlight = (code, language) => {
    if (!code) return []

    const lines = code.split('\n')

    const keywords = ['import', 'export', 'from', 'const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'class', 'extends', 'new', 'this', 'default', 'async', 'await', 'try', 'catch', 'throw']
    const jsxKeywords = ['React', 'useState', 'useEffect', 'useRef', 'useContext', 'useMemo', 'useCallback']

    return lines.map((line, index) => {
        let highlighted = line
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')

        // Strings
        highlighted = highlighted.replace(/(["'`])(?:(?=(\\?))\2.)*?\1/g, '<span class="text-green-400">$&</span>')

        // Comments
        highlighted = highlighted.replace(/(\/\/.*$)/gm, '<span class="text-gray-500">$&</span>')
        highlighted = highlighted.replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="text-gray-500">$&</span>')

        // Keywords
        keywords.forEach(kw => {
            const regex = new RegExp(`\\b(${kw})\\b`, 'g')
            highlighted = highlighted.replace(regex, '<span class="text-purple-400">$1</span>')
        })

        // JSX/React keywords
        jsxKeywords.forEach(kw => {
            const regex = new RegExp(`\\b(${kw})\\b`, 'g')
            highlighted = highlighted.replace(regex, '<span class="text-cyan-400">$1</span>')
        })

        // Numbers
        highlighted = highlighted.replace(/\b(\d+)\b/g, '<span class="text-orange-400">$1</span>')

        // JSX tags
        highlighted = highlighted.replace(/(&lt;\/?)([\w]+)/g, '$1<span class="text-red-400">$2</span>')

        // CSS properties
        if (language === 'css') {
            highlighted = highlighted.replace(/([a-z-]+)(?=:)/g, '<span class="text-cyan-400">$1</span>')
        }

        return {
            number: index + 1,
            content: highlighted
        }
    })
}

const FileTreeItem = ({ name, item, path, level, expandedFolders, toggleFolder, openFile, activeFile }) => {
    const fullPath = path ? `${path}/${name}` : name
    const isExpanded = expandedFolders.includes(fullPath)
    const isActive = activeFile === fullPath

    if (item.type === 'folder') {
        return (
            <div>
                <div
                    className={`flex items-center gap-1 py-0.5 px-2 cursor-pointer hover:bg-white/10 ${isExpanded ? 'text-white' : 'text-gray-400'}`}
                    style={{ paddingLeft: `${level * 12 + 8}px` }}
                    onClick={() => toggleFolder(fullPath)}
                >
                    {isExpanded ? <FaChevronDown className="w-2.5 h-2.5" /> : <FaChevronRight className="w-2.5 h-2.5" />}
                    {isExpanded ? <FaFolderOpen className="w-3.5 h-3.5 text-yellow-400" /> : <FaFolder className="w-3.5 h-3.5 text-yellow-400" />}
                    <span className="text-sm">{name}</span>
                </div>
                {isExpanded && item.children && (
                    <div>
                        {Object.entries(item.children).map(([childName, childItem]) => (
                            <FileTreeItem
                                key={childName}
                                name={childName}
                                item={childItem}
                                path={fullPath}
                                level={level + 1}
                                expandedFolders={expandedFolders}
                                toggleFolder={toggleFolder}
                                openFile={openFile}
                                activeFile={activeFile}
                            />
                        ))}
                    </div>
                )}
            </div>
        )
    }

    return (
        <div
            className={`flex items-center gap-2 py-0.5 px-2 cursor-pointer ${isActive ? 'bg-blue-600/50 text-white' : 'text-gray-400 hover:bg-white/10'}`}
            style={{ paddingLeft: `${level * 12 + 20}px` }}
            onClick={() => openFile(fullPath, item)}
        >
            {getFileIcon(name, item.language)}
            <span className="text-sm">{name}</span>
        </div>
    )
}

const VSCode = () => {
    const { darkMode } = useStore()
    const [files] = useState(defaultFiles)
    const [expandedFolders, setExpandedFolders] = useState(['src', 'src/components'])
    const [openTabs, setOpenTabs] = useState([])
    const [activeTab, setActiveTab] = useState(null)
    const [sidebarWidth, setSidebarWidth] = useState(200)
    const [showSidebar, setShowSidebar] = useState(true)
    const [editedContent, setEditedContent] = useState({})
    const [saved, setSaved] = useState(false)
    const editorRef = useRef(null)

    const toggleFolder = (path) => {
        setExpandedFolders(prev =>
            prev.includes(path)
                ? prev.filter(p => p !== path)
                : [...prev, path]
        )
    }

    const openFile = (path, item) => {
        if (!openTabs.find(t => t.path === path)) {
            setOpenTabs(prev => [...prev, { path, name: path.split('/').pop(), item }])
        }
        setActiveTab(path)
    }

    const closeTab = (path, e) => {
        e?.stopPropagation()
        const newTabs = openTabs.filter(t => t.path !== path)
        setOpenTabs(newTabs)
        if (activeTab === path) {
            setActiveTab(newTabs.length > 0 ? newTabs[newTabs.length - 1].path : null)
        }
    }

    const getActiveFile = () => {
        const tab = openTabs.find(t => t.path === activeTab)
        return tab?.item
    }

    const activeFile = getActiveFile()
    const content = editedContent[activeTab] ?? activeFile?.content ?? ''
    const highlightedLines = syntaxHighlight(content, activeFile?.language)

    const handleContentChange = (e) => {
        setEditedContent(prev => ({
            ...prev,
            [activeTab]: e.target.value
        }))
        setSaved(false)
    }

    const handleSave = () => {
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
    }

    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 's') {
                e.preventDefault()
                handleSave()
            }
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [])

    return (
        <div className="w-full h-full flex bg-[#1e1e1e] text-white overflow-hidden">
            {/* Activity Bar */}
            <div className="w-12 bg-[#333333] flex flex-col items-center py-2 gap-4">
                <button className={`p-2 rounded ${showSidebar ? 'bg-white/10' : ''}`} onClick={() => setShowSidebar(!showSidebar)}>
                    <FaFile className="w-5 h-5 text-gray-400 hover:text-white" />
                </button>
                <button className="p-2">
                    <FaSearch className="w-5 h-5 text-gray-400 hover:text-white" />
                </button>
                <button className="p-2">
                    <FaGitAlt className="w-5 h-5 text-gray-400 hover:text-white" />
                </button>
                <button className="p-2">
                    <FaBug className="w-5 h-5 text-gray-400 hover:text-white" />
                </button>
                <button className="p-2">
                    <FaPuzzlePiece className="w-5 h-5 text-gray-400 hover:text-white" />
                </button>
                <div className="flex-1" />
                <button className="p-2">
                    <FaUser className="w-5 h-5 text-gray-400 hover:text-white" />
                </button>
                <button className="p-2">
                    <FaCog className="w-5 h-5 text-gray-400 hover:text-white" />
                </button>
            </div>

            {/* Sidebar */}
            {showSidebar && (
                <div className="bg-[#252526] flex flex-col" style={{ width: sidebarWidth }}>
                    <div className="h-8 flex items-center px-4 text-xs text-gray-400 uppercase tracking-wider">
                        Explorer
                    </div>
                    <div className="flex-1 overflow-auto">
                        <div className="py-1">
                            <div className="flex items-center gap-1 px-2 py-1 text-xs text-gray-400 uppercase tracking-wider">
                                <FaChevronDown className="w-2.5 h-2.5" />
                                my-react-app
                            </div>
                            {Object.entries(files).map(([name, item]) => (
                                <FileTreeItem
                                    key={name}
                                    name={name}
                                    item={item}
                                    path=""
                                    level={0}
                                    expandedFolders={expandedFolders}
                                    toggleFolder={toggleFolder}
                                    openFile={openFile}
                                    activeFile={activeTab}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Main Editor Area */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Tabs */}
                <div className="h-9 bg-[#252526] flex items-center overflow-x-auto">
                    {openTabs.map(tab => (
                        <div
                            key={tab.path}
                            onClick={() => setActiveTab(tab.path)}
                            className={`flex items-center gap-2 px-3 h-full cursor-pointer border-t-2 min-w-0 ${
                                activeTab === tab.path
                                    ? 'bg-[#1e1e1e] border-blue-500 text-white'
                                    : 'border-transparent text-gray-400 hover:bg-[#2d2d2d]'
                            }`}
                        >
                            {getFileIcon(tab.name, tab.item?.language)}
                            <span className="text-sm truncate">{tab.name}</span>
                            {editedContent[tab.path] !== undefined && editedContent[tab.path] !== tab.item?.content && (
                                <span className="w-2 h-2 rounded-full bg-white" />
                            )}
                            <FaTimes
                                className="w-3 h-3 opacity-0 hover:opacity-100 ml-1"
                                onClick={(e) => closeTab(tab.path, e)}
                            />
                        </div>
                    ))}
                </div>

                {/* Editor */}
                <div className="flex-1 overflow-auto relative" ref={editorRef}>
                    {activeFile ? (
                        <div className="flex min-h-full">
                            {/* Line Numbers */}
                            <div className="bg-[#1e1e1e] text-gray-500 text-right pr-4 pl-4 py-2 select-none text-sm font-mono leading-6 sticky left-0">
                                {highlightedLines.map(line => (
                                    <div key={line.number}>{line.number}</div>
                                ))}
                            </div>

                            {/* Code Area */}
                            <div className="flex-1 relative">
                                <textarea
                                    className="absolute inset-0 w-full h-full bg-transparent text-transparent caret-white outline-none resize-none py-2 pr-4 font-mono text-sm leading-6 z-10"
                                    value={content}
                                    onChange={handleContentChange}
                                    spellCheck={false}
                                />
                                <pre className="py-2 pr-4 font-mono text-sm leading-6 text-gray-300 whitespace-pre overflow-x-auto">
                                    {highlightedLines.map(line => (
                                        <div key={line.number} dangerouslySetInnerHTML={{ __html: line.content || ' ' }} />
                                    ))}
                                </pre>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-500 p-8">
                            <FaCode className="w-16 h-16 mb-4 opacity-20" />
                            <h2 className="text-xl mb-2">Welcome to VS Code</h2>
                            <p className="text-sm text-center max-w-md">
                                Open a file from the explorer to start editing
                            </p>
                            <div className="mt-8 flex flex-col gap-2 text-sm">
                                <div className="flex items-center gap-2">
                                    <kbd className="px-2 py-1 bg-[#333] rounded text-xs">Cmd+S</kbd>
                                    <span>Save file</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <kbd className="px-2 py-1 bg-[#333] rounded text-xs">Cmd+P</kbd>
                                    <span>Quick open</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Status Bar */}
                <div className="h-6 bg-[#007acc] flex items-center px-3 text-xs text-white">
                    <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                            <FaGitAlt className="w-3 h-3" />
                            main
                        </span>
                        {saved && (
                            <span className="flex items-center gap-1 text-green-300">
                                <FaCheck className="w-3 h-3" />
                                Saved
                            </span>
                        )}
                    </div>
                    <div className="flex-1" />
                    <div className="flex items-center gap-4">
                        {activeFile && (
                            <>
                                <span>Ln {highlightedLines.length}, Col 1</span>
                                <span>Spaces: 4</span>
                                <span>UTF-8</span>
                                <span>{activeFile.language?.toUpperCase() || 'Plain Text'}</span>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default VSCode
