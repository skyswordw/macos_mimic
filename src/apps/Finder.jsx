import React, { useState, useRef, useEffect } from 'react'
import { FaFolder, FaDesktop, FaDownload, FaRegFileImage, FaRegFileCode, FaRegFile, FaCloud, FaHome, FaPlus, FaTrash, FaEdit, FaCopy, FaPaste, FaCut, FaArrowLeft, FaArrowRight, FaSearch, FaFilePdf, FaFileVideo, FaFileAudio, FaFileArchive, FaEye, FaColumns } from 'react-icons/fa'
import { useStore } from '../store/useStore'
import QuickLook from '../components/system/QuickLook'

const Finder = () => {
    const { darkMode } = useStore()
    // 文件系统数据结构
    const [fileSystem, setFileSystem] = useState({
        '/Desktop': [
            { id: 1, name: 'Projects', type: 'folder', size: '-', modified: '2025-11-24', icon: FaFolder },
            { id: 2, name: 'Screenshot.png', type: 'image', size: '2.3 MB', modified: '2025-11-23', icon: FaRegFileImage },
            { id: 3, name: 'presentation.pdf', type: 'pdf', size: '5.1 MB', modified: '2025-11-22', icon: FaFilePdf },
        ],
        '/Documents': [
            { id: 4, name: 'Work', type: 'folder', size: '-', modified: '2025-11-24', icon: FaFolder },
            { id: 5, name: 'Personal', type: 'folder', size: '-', modified: '2025-11-23', icon: FaFolder },
            { id: 6, name: 'readme.txt', type: 'text', size: '12 KB', modified: '2025-11-20', icon: FaRegFile },
            { id: 7, name: 'budget.xlsx', type: 'file', size: '134 KB', modified: '2025-11-19', icon: FaRegFile },
        ],
        '/Downloads': [
            { id: 8, name: 'installer.dmg', type: 'archive', size: '125 MB', modified: '2025-11-24', icon: FaFileArchive },
            { id: 9, name: 'music.mp3', type: 'audio', size: '3.5 MB', modified: '2025-11-23', icon: FaFileAudio },
            { id: 10, name: 'video.mp4', type: 'video', size: '235 MB', modified: '2025-11-22', icon: FaFileVideo },
        ],
        '/iCloud Drive': [
            { id: 11, name: 'Photos', type: 'folder', size: '-', modified: '2025-11-24', icon: FaFolder },
            { id: 12, name: 'Backup', type: 'folder', size: '-', modified: '2025-11-23', icon: FaFolder },
        ]
    })

    const [currentPath, setCurrentPath] = useState('/Desktop')
    const [selectedItems, setSelectedItems] = useState([])
    const [clipboard, setClipboard] = useState(null) // { action: 'copy'|'cut', items: [], sourcePath: string }
    const [renamingId, setRenamingId] = useState(null)
    const [newName, setNewName] = useState('')
    const [contextMenu, setContextMenu] = useState(null)
    const [viewMode, setViewMode] = useState('grid') // grid, list, columns
    const [searchTerm, setSearchTerm] = useState('')
    const [navigationHistory, setNavigationHistory] = useState(['/Desktop'])
    const [historyIndex, setHistoryIndex] = useState(0)
    const [quickLookOpen, setQuickLookOpen] = useState(false)
    const [quickLookIndex, setQuickLookIndex] = useState(0)
    const [showPreviewPanel, setShowPreviewPanel] = useState(false)

    const renameInputRef = useRef(null)
    const { moveToTrash } = useStore()

    // 获取当前目录的文件
    const currentFiles = fileSystem[currentPath] || []
    const filteredFiles = currentFiles.filter(file =>
        file.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    // 导航到指定路径
    const navigateTo = (path) => {
        if (path !== currentPath) {
            const newHistory = [...navigationHistory.slice(0, historyIndex + 1), path]
            setNavigationHistory(newHistory)
            setHistoryIndex(newHistory.length - 1)
            setCurrentPath(path)
            setSelectedItems([])
        }
    }

    // 后退
    const goBack = () => {
        if (historyIndex > 0) {
            setHistoryIndex(historyIndex - 1)
            setCurrentPath(navigationHistory[historyIndex - 1])
            setSelectedItems([])
        }
    }

    // 前进
    const goForward = () => {
        if (historyIndex < navigationHistory.length - 1) {
            setHistoryIndex(historyIndex + 1)
            setCurrentPath(navigationHistory[historyIndex + 1])
            setSelectedItems([])
        }
    }

    // 创建新文件夹
    const createNewFolder = () => {
        const newFolder = {
            id: Date.now(),
            name: `New Folder ${currentFiles.filter(f => f.name.startsWith('New Folder')).length + 1}`,
            type: 'folder',
            size: '-',
            modified: new Date().toISOString().split('T')[0],
            icon: FaFolder
        }
        setFileSystem({
            ...fileSystem,
            [currentPath]: [...currentFiles, newFolder]
        })
        // 自动进入重命名模式
        setTimeout(() => {
            setRenamingId(newFolder.id)
            setNewName(newFolder.name)
        }, 100)
    }

    // 删除选中的项目（移动到回收站）
    const deleteSelectedItems = () => {
        if (selectedItems.length === 0) return

        const itemsToDelete = currentFiles.filter(f => selectedItems.includes(f.id))

        // 移动到系统回收站
        itemsToDelete.forEach(item => {
            moveToTrash({
                id: item.id,
                name: item.name,
                type: item.type,
                size: item.size,
                path: currentPath
            })
        })

        // 从当前目录移除
        setFileSystem({
            ...fileSystem,
            [currentPath]: currentFiles.filter(file => !selectedItems.includes(file.id))
        })
        setSelectedItems([])
    }

    // 重命名项目
    const handleRename = (id) => {
        const item = currentFiles.find(f => f.id === id)
        if (item) {
            setRenamingId(id)
            setNewName(item.name)
        }
    }

    const saveRename = () => {
        if (newName.trim()) {
            setFileSystem({
                ...fileSystem,
                [currentPath]: currentFiles.map(file =>
                    file.id === renamingId ? { ...file, name: newName.trim() } : file
                )
            })
        }
        setRenamingId(null)
        setNewName('')
    }

    // 复制项目
    const copyItems = () => {
        const itemsToCopy = currentFiles.filter(f => selectedItems.includes(f.id))
        setClipboard({ action: 'copy', items: itemsToCopy, sourcePath: currentPath })
    }

    // 剪切项目
    const cutItems = () => {
        const itemsToCut = currentFiles.filter(f => selectedItems.includes(f.id))
        setClipboard({ action: 'cut', items: itemsToCut, sourcePath: currentPath })
    }

    // 粘贴项目
    const pasteItems = () => {
        if (!clipboard) return

        if (clipboard.action === 'copy') {
            // 复制：创建新副本
            const newItems = clipboard.items.map((item, index) => ({
                ...item,
                id: Date.now() + index,
                name: `${item.name} copy`
            }))
            setFileSystem({
                ...fileSystem,
                [currentPath]: [...currentFiles, ...newItems]
            })
        } else if (clipboard.action === 'cut') {
            // 剪切：移动项目
            if (clipboard.sourcePath === currentPath) {
                // 在同一目录中，不做任何操作
                return
            }

            // 从源路径移除项目
            const newFileSystem = { ...fileSystem }
            const sourceFiles = newFileSystem[clipboard.sourcePath] || []
            newFileSystem[clipboard.sourcePath] = sourceFiles.filter(f =>
                !clipboard.items.find(item => item.id === f.id)
            )

            // 添加到当前路径
            newFileSystem[currentPath] = [...currentFiles, ...clipboard.items]
            setFileSystem(newFileSystem)

            // 清空剪贴板
            setClipboard(null)
        }
    }

    // 选择项目
    const handleItemClick = (id, event) => {
        if (event.metaKey || event.ctrlKey) {
            // 多选
            setSelectedItems(prev =>
                prev.includes(id)
                    ? prev.filter(i => i !== id)
                    : [...prev, id]
            )
        } else {
            // 单选
            setSelectedItems([id])
        }
    }

    // 双击打开文件夹或文件
    const handleItemDoubleClick = (item) => {
        if (item.type === 'folder') {
            const newPath = `${currentPath}/${item.name}`
            if (!fileSystem[newPath]) {
                // 如果文件夹还没有内容，初始化为空数组
                setFileSystem({
                    ...fileSystem,
                    [newPath]: []
                })
            }
            navigateTo(newPath)
        } else {
            // 打开文件 - 使用 Quick Look 预览
            const fileIndex = filteredFiles.findIndex(f => f.id === item.id)
            if (fileIndex !== -1) {
                setQuickLookIndex(fileIndex)
                setQuickLookOpen(true)
            }
        }
    }

    // 右键菜单
    const handleContextMenu = (event, id = null) => {
        event.preventDefault()
        if (id && !selectedItems.includes(id)) {
            setSelectedItems([id])
        }
        setContextMenu({
            x: event.clientX,
            y: event.clientY,
            itemId: id
        })
    }

    // 关闭右键菜单
    useEffect(() => {
        const closeContextMenu = () => setContextMenu(null)
        window.addEventListener('click', closeContextMenu)
        return () => window.removeEventListener('click', closeContextMenu)
    }, [])

    // 自动聚焦重命名输入框
    useEffect(() => {
        if (renamingId && renameInputRef.current) {
            renameInputRef.current.focus()
            renameInputRef.current.select()
        }
    }, [renamingId])

    // 键盘快捷键
    useEffect(() => {
        const handleKeyDown = (e) => {
            // 如果正在重命名，不处理快捷键
            if (renamingId) return

            // 如果 Quick Look 打开，不处理 Finder 快捷键
            if (quickLookOpen) return

            // Space - Quick Look
            if (e.key === ' ' && selectedItems.length > 0) {
                e.preventDefault()
                const selectedFile = currentFiles.find(f => f.id === selectedItems[0])
                if (selectedFile) {
                    const fileIndex = filteredFiles.findIndex(f => f.id === selectedFile.id)
                    setQuickLookIndex(fileIndex)
                    setQuickLookOpen(true)
                }
            }

            // Cmd+C 或 Ctrl+C - 复制
            if ((e.metaKey || e.ctrlKey) && e.key === 'c' && selectedItems.length > 0) {
                e.preventDefault()
                copyItems()
            }

            // Cmd+X 或 Ctrl+X - 剪切
            if ((e.metaKey || e.ctrlKey) && e.key === 'x' && selectedItems.length > 0) {
                e.preventDefault()
                cutItems()
            }

            // Cmd+V 或 Ctrl+V - 粘贴
            if ((e.metaKey || e.ctrlKey) && e.key === 'v' && clipboard) {
                e.preventDefault()
                pasteItems()
            }

            // Delete 或 Backspace - 删除
            if ((e.key === 'Delete' || e.key === 'Backspace') && selectedItems.length > 0) {
                e.preventDefault()
                deleteSelectedItems()
            }

            // Cmd+A 或 Ctrl+A - 全选
            if ((e.metaKey || e.ctrlKey) && e.key === 'a') {
                e.preventDefault()
                setSelectedItems(currentFiles.map(f => f.id))
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [selectedItems, clipboard, renamingId, currentFiles, quickLookOpen, filteredFiles])

    return (
        <div className={`w-full h-full flex flex-col text-sm transition-colors duration-300 ${
            darkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'
        }`}>
            {/* 工具栏 */}
            <div className={`h-12 border-b flex items-center px-4 gap-2 transition-colors duration-300 ${
                darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
            }`}>
                <button
                    onClick={goBack}
                    disabled={historyIndex === 0}
                    className={`p-1.5 rounded transition-colors ${
                        historyIndex === 0
                            ? 'opacity-50 cursor-not-allowed'
                            : darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                    }`}
                >
                    <FaArrowLeft />
                </button>
                <button
                    onClick={goForward}
                    disabled={historyIndex === navigationHistory.length - 1}
                    className={`p-1.5 rounded transition-colors ${
                        historyIndex === navigationHistory.length - 1
                            ? 'opacity-50 cursor-not-allowed'
                            : darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                    }`}
                >
                    <FaArrowRight />
                </button>

                <div className="flex-1 mx-4">
                    <div className="relative">
                        <FaSearch className={`absolute left-3 top-1/2 -translate-y-1/2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                        <input
                            type="text"
                            placeholder="Search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={`w-full pl-9 pr-3 py-1.5 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                                darkMode
                                    ? 'bg-gray-700 text-white placeholder-gray-400'
                                    : 'bg-gray-100 text-gray-900 placeholder-gray-500'
                            }`}
                        />
                    </div>
                </div>

                <button
                    onClick={createNewFolder}
                    className={`p-1.5 rounded transition-colors ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
                    title="New Folder"
                >
                    <FaPlus />
                </button>
                <button
                    onClick={() => {
                        if (selectedItems.length > 0) {
                            const selectedFile = currentFiles.find(f => f.id === selectedItems[0])
                            if (selectedFile) {
                                const fileIndex = filteredFiles.findIndex(f => f.id === selectedFile.id)
                                setQuickLookIndex(fileIndex)
                                setQuickLookOpen(true)
                            }
                        }
                    }}
                    disabled={selectedItems.length === 0}
                    className={`p-1.5 rounded transition-colors ${
                        selectedItems.length === 0
                            ? 'opacity-50 cursor-not-allowed'
                            : darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                    }`}
                    title="Quick Look (Space)"
                >
                    <FaEye />
                </button>
                <button
                    onClick={deleteSelectedItems}
                    disabled={selectedItems.length === 0}
                    className={`p-1.5 rounded transition-colors ${
                        selectedItems.length === 0
                            ? 'opacity-50 cursor-not-allowed'
                            : darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                    }`}
                    title="Delete"
                >
                    <FaTrash />
                </button>
                <div className={`w-[1px] h-5 mx-1 ${darkMode ? 'bg-gray-600' : 'bg-gray-300'}`} />
                <button
                    onClick={() => setShowPreviewPanel(!showPreviewPanel)}
                    className={`p-1.5 rounded transition-colors ${
                        showPreviewPanel
                            ? darkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
                            : darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                    }`}
                    title="Toggle Preview Panel"
                >
                    <FaColumns />
                </button>
            </div>

            <div className="flex-1 flex">
                {/* 侧边栏 */}
                <div className={`w-48 backdrop-blur-md p-4 flex flex-col gap-2 border-r transition-colors duration-300 ${
                    darkMode
                        ? 'bg-gray-800/80 border-gray-700'
                        : 'bg-gray-100/80 border-gray-200'
                }`}>
                    <div className={`text-xs font-bold mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Favorites</div>
                    <div
                        onClick={() => navigateTo('/Desktop')}
                        className={`flex items-center gap-2 p-1 rounded cursor-pointer transition-colors ${
                            currentPath === '/Desktop'
                                ? darkMode ? 'bg-blue-600' : 'bg-blue-100'
                                : darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                        }`}
                    >
                        <FaDesktop className="text-blue-500" /> Desktop
                    </div>
                    <div
                        onClick={() => navigateTo('/Documents')}
                        className={`flex items-center gap-2 p-1 rounded cursor-pointer transition-colors ${
                            currentPath === '/Documents'
                                ? darkMode ? 'bg-blue-600' : 'bg-blue-100'
                                : darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                        }`}
                    >
                        <FaFolder className="text-blue-500" /> Documents
                    </div>
                    <div
                        onClick={() => navigateTo('/Downloads')}
                        className={`flex items-center gap-2 p-1 rounded cursor-pointer transition-colors ${
                            currentPath === '/Downloads'
                                ? darkMode ? 'bg-blue-600' : 'bg-blue-100'
                                : darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                        }`}
                    >
                        <FaDownload className="text-blue-500" /> Downloads
                    </div>

                    <div className={`text-xs font-bold mt-4 mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>iCloud</div>
                    <div
                        onClick={() => navigateTo('/iCloud Drive')}
                        className={`flex items-center gap-2 p-1 rounded cursor-pointer transition-colors ${
                            currentPath === '/iCloud Drive'
                                ? darkMode ? 'bg-blue-600' : 'bg-blue-100'
                                : darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                        }`}
                    >
                        <FaCloud className="text-blue-500" /> iCloud Drive
                    </div>
                </div>

                {/* 内容区域容器 */}
                <div className="flex-1 flex">
                    {/* 主内容区域 */}
                    <div
                        className={`${showPreviewPanel ? 'flex-1' : 'w-full'} p-4 overflow-auto transition-all duration-300`}
                        onContextMenu={(e) => handleContextMenu(e)}
                    >
                    {/* 面包屑导航 */}
                    <div className={`mb-4 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        <span className="flex items-center gap-1">
                            <FaHome className={darkMode ? 'text-gray-500' : 'text-gray-400'} />
                            {currentPath.split('/').filter(Boolean).map((part, index, array) => (
                                <React.Fragment key={index}>
                                    <span>/</span>
                                    <span className={index === array.length - 1 ? (darkMode ? 'text-gray-200 font-medium' : 'text-gray-700 font-medium') : ''}>
                                        {part}
                                    </span>
                                </React.Fragment>
                            ))}
                        </span>
                    </div>

                    {/* 文件列表 */}
                    <div className="grid grid-cols-4 gap-4">
                        {filteredFiles.map(file => {
                            const Icon = file.icon
                            const isSelected = selectedItems.includes(file.id)
                            const isRenaming = renamingId === file.id
                            const isCut = clipboard?.action === 'cut' && clipboard.items.some(item => item.id === file.id)

                            return (
                                <div
                                    key={file.id}
                                    onClick={(e) => handleItemClick(file.id, e)}
                                    onDoubleClick={() => handleItemDoubleClick(file)}
                                    onContextMenu={(e) => handleContextMenu(e, file.id)}
                                    className={`
                                        flex flex-col items-center gap-2 p-3 rounded-lg cursor-pointer transition-all
                                        ${isSelected
                                            ? darkMode ? 'bg-blue-600 ring-2 ring-blue-500' : 'bg-blue-100 ring-2 ring-blue-400'
                                            : darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50'
                                        }
                                        ${isCut ? 'opacity-50' : ''}
                                    `}
                                >
                                    <Icon className={`text-5xl ${file.type === 'folder' ? 'text-blue-400' : 'text-gray-400'} ${isCut ? 'opacity-60' : ''}`} />
                                    {isRenaming ? (
                                        <input
                                            ref={renameInputRef}
                                            type="text"
                                            value={newName}
                                            onChange={(e) => setNewName(e.target.value)}
                                            onBlur={saveRename}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') saveRename()
                                                if (e.key === 'Escape') {
                                                    setRenamingId(null)
                                                    setNewName('')
                                                }
                                            }}
                                            className="px-1 py-0.5 text-center bg-white border border-blue-400 rounded outline-none"
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    ) : (
                                        <span className="text-xs text-center break-all">{file.name}</span>
                                    )}
                                </div>
                            )
                        })}
                    </div>

                    {/* 空文件夹提示 */}
                    {filteredFiles.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                            <FaFolder className="text-6xl mb-4" />
                            <p>This folder is empty</p>
                            {searchTerm && <p className="text-sm mt-2">No items match your search</p>}
                        </div>
                    )}
                    </div>

                    {/* 预览面板 */}
                    {showPreviewPanel && (
                        <div className={`w-72 border-l p-4 overflow-auto transition-all duration-300 ${
                            darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50/50 border-gray-200'
                        }`}>
                            {selectedItems.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center">
                                    <FaFolder className={`text-5xl mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-300'}`} />
                                    <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                        Select an item to see its preview
                                    </p>
                                </div>
                            ) : selectedItems.length === 1 ? (
                                (() => {
                                    const selectedFile = currentFiles.find(f => f.id === selectedItems[0])
                                    if (!selectedFile) return null
                                    const Icon = selectedFile.icon

                                    return (
                                        <div className="flex flex-col items-center">
                                            {/* 预览缩略图 */}
                                            <div className={`w-32 h-32 rounded-xl flex items-center justify-center mb-4 ${
                                                darkMode ? 'bg-gray-700' : 'bg-gray-200'
                                            }`}>
                                                {selectedFile.type === 'image' ? (
                                                    <img
                                                        src={`https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200`}
                                                        alt={selectedFile.name}
                                                        className="w-full h-full object-cover rounded-xl"
                                                    />
                                                ) : (
                                                    <Icon className={`text-6xl ${
                                                        selectedFile.type === 'folder' ? 'text-blue-400' : 'text-gray-400'
                                                    }`} />
                                                )}
                                            </div>

                                            {/* 文件名 */}
                                            <h3 className={`text-sm font-semibold text-center mb-4 ${
                                                darkMode ? 'text-white' : 'text-gray-800'
                                            }`}>
                                                {selectedFile.name}
                                            </h3>

                                            {/* 文件详情 */}
                                            <div className={`w-full space-y-3 text-xs ${
                                                darkMode ? 'text-gray-400' : 'text-gray-600'
                                            }`}>
                                                <div className="flex justify-between">
                                                    <span className="opacity-70">Kind</span>
                                                    <span className="font-medium capitalize">{selectedFile.type}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="opacity-70">Size</span>
                                                    <span className="font-medium">{selectedFile.size || '--'}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="opacity-70">Modified</span>
                                                    <span className="font-medium">{selectedFile.modified}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="opacity-70">Location</span>
                                                    <span className="font-medium truncate max-w-[120px]">{currentPath}</span>
                                                </div>
                                            </div>

                                            {/* 快速操作 */}
                                            <div className="w-full mt-6 space-y-2">
                                                <button
                                                    onClick={() => {
                                                        const fileIndex = filteredFiles.findIndex(f => f.id === selectedFile.id)
                                                        setQuickLookIndex(fileIndex)
                                                        setQuickLookOpen(true)
                                                    }}
                                                    className={`w-full py-2 px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-colors ${
                                                        darkMode
                                                            ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                                                            : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                                                    }`}
                                                >
                                                    <FaEye /> Quick Look
                                                </button>
                                                {selectedFile.type === 'folder' && (
                                                    <button
                                                        onClick={() => handleItemDoubleClick(selectedFile)}
                                                        className={`w-full py-2 px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-colors ${
                                                            darkMode
                                                                ? 'bg-blue-600 hover:bg-blue-500 text-white'
                                                                : 'bg-blue-500 hover:bg-blue-600 text-white'
                                                        }`}
                                                    >
                                                        <FaFolder /> Open
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    )
                                })()
                            ) : (
                                <div className="flex flex-col items-center">
                                    {/* 多选状态 */}
                                    <div className={`w-32 h-32 rounded-xl flex items-center justify-center mb-4 ${
                                        darkMode ? 'bg-gray-700' : 'bg-gray-200'
                                    }`}>
                                        <div className="relative">
                                            <FaRegFile className="text-5xl text-gray-400" />
                                            <div className={`absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                                darkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
                                            }`}>
                                                {selectedItems.length}
                                            </div>
                                        </div>
                                    </div>

                                    <h3 className={`text-sm font-semibold text-center mb-4 ${
                                        darkMode ? 'text-white' : 'text-gray-800'
                                    }`}>
                                        {selectedItems.length} items selected
                                    </h3>

                                    <div className={`w-full space-y-3 text-xs ${
                                        darkMode ? 'text-gray-400' : 'text-gray-600'
                                    }`}>
                                        <div className="flex justify-between">
                                            <span className="opacity-70">Folders</span>
                                            <span className="font-medium">
                                                {currentFiles.filter(f => selectedItems.includes(f.id) && f.type === 'folder').length}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="opacity-70">Files</span>
                                            <span className="font-medium">
                                                {currentFiles.filter(f => selectedItems.includes(f.id) && f.type !== 'folder').length}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* 状态栏 */}
            <div className={`h-8 border-t flex items-center justify-between px-4 text-xs transition-colors duration-300 ${
                darkMode ? 'bg-gray-800 border-gray-700 text-gray-400' : 'bg-gray-50 border-gray-200 text-gray-600'
            }`}>
                <div className="flex items-center gap-4">
                    <span>{filteredFiles.length} items</span>
                    {selectedItems.length > 0 && (
                        <span className={darkMode ? 'text-blue-400' : 'text-blue-600'}>
                            {selectedItems.length} selected
                        </span>
                    )}
                </div>
                {clipboard && (
                    <div className={`flex items-center gap-2 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                        {clipboard.action === 'copy' ? <FaCopy className="text-xs" /> : <FaCut className="text-xs" />}
                        <span>{clipboard.items.length} item{clipboard.items.length > 1 ? 's' : ''} {clipboard.action === 'copy' ? 'copied' : 'cut'}</span>
                    </div>
                )}
            </div>

            {/* 右键菜单 */}
            {contextMenu && (
                <div
                    className={`fixed rounded-lg shadow-2xl py-1 z-50 min-w-[180px] border transition-colors ${
                        darkMode
                            ? 'bg-gray-800 border-gray-600'
                            : 'bg-white border-gray-200'
                    }`}
                    style={{ left: contextMenu.x, top: contextMenu.y }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {contextMenu.itemId ? (
                        <>
                            <button
                                onClick={() => {
                                    handleRename(contextMenu.itemId)
                                    setContextMenu(null)
                                }}
                                className="w-full px-4 py-1.5 text-left hover:bg-blue-500 hover:text-white flex items-center gap-2 transition-colors"
                            >
                                <FaEdit className="text-sm" /> Rename
                            </button>
                            <div className={`border-t my-1 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`} />
                            <button
                                onClick={() => {
                                    copyItems()
                                    setContextMenu(null)
                                }}
                                className="w-full px-4 py-1.5 text-left hover:bg-blue-500 hover:text-white flex items-center gap-2 transition-colors"
                            >
                                <FaCopy className="text-sm" /> Copy
                            </button>
                            <button
                                onClick={() => {
                                    cutItems()
                                    setContextMenu(null)
                                }}
                                className="w-full px-4 py-1.5 text-left hover:bg-blue-500 hover:text-white flex items-center gap-2 transition-colors"
                            >
                                <FaCut className="text-sm" /> Cut
                            </button>
                            <button
                                onClick={() => {
                                    pasteItems()
                                    setContextMenu(null)
                                }}
                                disabled={!clipboard}
                                className={`w-full px-4 py-1.5 text-left flex items-center gap-2 transition-colors ${
                                    clipboard
                                        ? 'hover:bg-blue-500 hover:text-white'
                                        : 'opacity-50 cursor-not-allowed'
                                }`}
                            >
                                <FaPaste className="text-sm" /> Paste
                            </button>
                            <div className={`border-t my-1 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`} />
                            <button
                                onClick={() => {
                                    deleteSelectedItems()
                                    setContextMenu(null)
                                }}
                                className="w-full px-4 py-1.5 text-left hover:bg-blue-500 hover:text-white flex items-center gap-2 text-red-500 hover:text-white transition-colors"
                            >
                                <FaTrash className="text-sm" /> Move to Trash
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => {
                                    createNewFolder()
                                    setContextMenu(null)
                                }}
                                className="w-full px-4 py-1.5 text-left hover:bg-blue-500 hover:text-white flex items-center gap-2 transition-colors"
                            >
                                <FaPlus className="text-sm" /> New Folder
                            </button>
                            <button
                                onClick={() => {
                                    pasteItems()
                                    setContextMenu(null)
                                }}
                                disabled={!clipboard}
                                className={`w-full px-4 py-1.5 text-left flex items-center gap-2 transition-colors ${
                                    clipboard
                                        ? 'hover:bg-blue-500 hover:text-white'
                                        : 'opacity-50 cursor-not-allowed'
                                }`}
                            >
                                <FaPaste className="text-sm" /> Paste
                            </button>
                        </>
                    )}
                </div>
            )}

            {/* Quick Look */}
            <QuickLook
                isOpen={quickLookOpen}
                onClose={() => setQuickLookOpen(false)}
                file={filteredFiles[quickLookIndex]}
                allFiles={filteredFiles}
                currentIndex={quickLookIndex}
                onNavigate={(index) => setQuickLookIndex(index)}
            />
        </div>
    )
}

export default Finder
