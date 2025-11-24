import React, { useState, useRef, useEffect } from 'react'
import { FaFolder, FaDesktop, FaDownload, FaRegFileImage, FaRegFileCode, FaRegFile, FaCloud, FaHome, FaPlus, FaTrash, FaEdit, FaCopy, FaPaste, FaArrowLeft, FaArrowRight, FaSearch, FaFilePdf, FaFileVideo, FaFileAudio, FaFileArchive } from 'react-icons/fa'

const Finder = () => {
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
    const [clipboard, setClipboard] = useState(null)
    const [renamingId, setRenamingId] = useState(null)
    const [newName, setNewName] = useState('')
    const [contextMenu, setContextMenu] = useState(null)
    const [viewMode, setViewMode] = useState('grid') // grid, list, columns
    const [searchTerm, setSearchTerm] = useState('')
    const [navigationHistory, setNavigationHistory] = useState(['/Desktop'])
    const [historyIndex, setHistoryIndex] = useState(0)

    const renameInputRef = useRef(null)

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

    // 删除选中的项目
    const deleteSelectedItems = () => {
        if (selectedItems.length === 0) return

        const confirmed = window.confirm(`Delete ${selectedItems.length} item(s)?`)
        if (confirmed) {
            setFileSystem({
                ...fileSystem,
                [currentPath]: currentFiles.filter(file => !selectedItems.includes(file.id))
            })
            setSelectedItems([])
        }
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
        setClipboard({ action: 'copy', items: itemsToCopy })
    }

    // 粘贴项目
    const pasteItems = () => {
        if (!clipboard) return

        if (clipboard.action === 'copy') {
            const newItems = clipboard.items.map(item => ({
                ...item,
                id: Date.now() + Math.random(),
                name: `${item.name} copy`
            }))
            setFileSystem({
                ...fileSystem,
                [currentPath]: [...currentFiles, ...newItems]
            })
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

    // 双击打开文件夹
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

    return (
        <div className="w-full h-full bg-white flex flex-col text-sm">
            {/* 工具栏 */}
            <div className="h-12 bg-gray-50 border-b border-gray-200 flex items-center px-4 gap-2">
                <button
                    onClick={goBack}
                    disabled={historyIndex === 0}
                    className={`p-1.5 rounded hover:bg-gray-200 ${historyIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    <FaArrowLeft />
                </button>
                <button
                    onClick={goForward}
                    disabled={historyIndex === navigationHistory.length - 1}
                    className={`p-1.5 rounded hover:bg-gray-200 ${historyIndex === navigationHistory.length - 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    <FaArrowRight />
                </button>

                <div className="flex-1 mx-4">
                    <div className="relative">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-3 py-1.5 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                <button
                    onClick={createNewFolder}
                    className="p-1.5 rounded hover:bg-gray-200"
                    title="New Folder"
                >
                    <FaPlus />
                </button>
                <button
                    onClick={deleteSelectedItems}
                    disabled={selectedItems.length === 0}
                    className={`p-1.5 rounded hover:bg-gray-200 ${selectedItems.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    title="Delete"
                >
                    <FaTrash />
                </button>
            </div>

            <div className="flex-1 flex">
                {/* 侧边栏 */}
                <div className="w-48 bg-gray-100/80 backdrop-blur-md p-4 flex flex-col gap-2 border-r border-gray-200">
                    <div className="text-xs font-bold text-gray-400 mb-1">Favorites</div>
                    <div
                        onClick={() => navigateTo('/Desktop')}
                        className={`flex items-center gap-2 p-1 rounded hover:bg-gray-200 cursor-pointer ${currentPath === '/Desktop' ? 'bg-blue-100' : ''}`}
                    >
                        <FaDesktop className="text-blue-500" /> Desktop
                    </div>
                    <div
                        onClick={() => navigateTo('/Documents')}
                        className={`flex items-center gap-2 p-1 rounded hover:bg-gray-200 cursor-pointer ${currentPath === '/Documents' ? 'bg-blue-100' : ''}`}
                    >
                        <FaFolder className="text-blue-500" /> Documents
                    </div>
                    <div
                        onClick={() => navigateTo('/Downloads')}
                        className={`flex items-center gap-2 p-1 rounded hover:bg-gray-200 cursor-pointer ${currentPath === '/Downloads' ? 'bg-blue-100' : ''}`}
                    >
                        <FaDownload className="text-blue-500" /> Downloads
                    </div>

                    <div className="text-xs font-bold text-gray-400 mt-4 mb-1">iCloud</div>
                    <div
                        onClick={() => navigateTo('/iCloud Drive')}
                        className={`flex items-center gap-2 p-1 rounded hover:bg-gray-200 cursor-pointer ${currentPath === '/iCloud Drive' ? 'bg-blue-100' : ''}`}
                    >
                        <FaCloud className="text-blue-500" /> iCloud Drive
                    </div>
                </div>

                {/* 内容区域 */}
                <div
                    className="flex-1 p-4 overflow-auto"
                    onContextMenu={(e) => handleContextMenu(e)}
                >
                    {/* 面包屑导航 */}
                    <div className="mb-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                            <FaHome className="text-gray-400" />
                            {currentPath.split('/').filter(Boolean).map((part, index, array) => (
                                <React.Fragment key={index}>
                                    <span>/</span>
                                    <span className={index === array.length - 1 ? 'text-gray-700 font-medium' : ''}>
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

                            return (
                                <div
                                    key={file.id}
                                    onClick={(e) => handleItemClick(file.id, e)}
                                    onDoubleClick={() => handleItemDoubleClick(file)}
                                    onContextMenu={(e) => handleContextMenu(e, file.id)}
                                    className={`
                                        flex flex-col items-center gap-2 p-3 rounded-lg cursor-pointer
                                        ${isSelected ? 'bg-blue-100 ring-2 ring-blue-400' : 'hover:bg-gray-50'}
                                    `}
                                >
                                    <Icon className={`text-5xl ${file.type === 'folder' ? 'text-blue-400' : 'text-gray-400'}`} />
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
            </div>

            {/* 右键菜单 */}
            {contextMenu && (
                <div
                    className="fixed bg-white rounded-lg shadow-2xl py-1 z-50 min-w-[180px] border border-gray-200"
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
                                className="w-full px-4 py-1.5 text-left hover:bg-blue-500 hover:text-white flex items-center gap-2"
                            >
                                <FaEdit className="text-sm" /> Rename
                            </button>
                            <button
                                onClick={() => {
                                    copyItems()
                                    setContextMenu(null)
                                }}
                                className="w-full px-4 py-1.5 text-left hover:bg-blue-500 hover:text-white flex items-center gap-2"
                            >
                                <FaCopy className="text-sm" /> Copy
                            </button>
                            <div className="border-t border-gray-200 my-1" />
                            <button
                                onClick={() => {
                                    deleteSelectedItems()
                                    setContextMenu(null)
                                }}
                                className="w-full px-4 py-1.5 text-left hover:bg-blue-500 hover:text-white flex items-center gap-2 text-red-500 hover:text-white"
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
                                className="w-full px-4 py-1.5 text-left hover:bg-blue-500 hover:text-white flex items-center gap-2"
                            >
                                <FaPlus className="text-sm" /> New Folder
                            </button>
                            <button
                                onClick={() => {
                                    pasteItems()
                                    setContextMenu(null)
                                }}
                                disabled={!clipboard}
                                className={`w-full px-4 py-1.5 text-left flex items-center gap-2 ${
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
        </div>
    )
}

export default Finder
