import React, { useState, useEffect } from 'react'
import { FaApple, FaWifi, FaBatteryFull, FaSearch, FaToggleOn, FaTh, FaThLarge } from 'react-icons/fa'
import { format } from 'date-fns'
import { useStore } from '../../store/useStore'

// 菜单项配置（包含快捷键）
const menuItem = (label, shortcut = null, action = null) => ({ label, shortcut, action })

// 不同应用的菜单配置
const appMenus = {
    'Finder': [
        { label: 'File', items: [
            menuItem('New Folder', '⇧⌘N'),
            menuItem('New Window', '⌘N'),
            'separator',
            menuItem('Get Info', '⌘I'),
            menuItem('Rename'),
            'separator',
            menuItem('Move to Trash', '⌘⌫')
        ]},
        { label: 'Edit', items: [
            menuItem('Undo', '⌘Z'),
            menuItem('Redo', '⇧⌘Z'),
            'separator',
            menuItem('Cut', '⌘X'),
            menuItem('Copy', '⌘C'),
            menuItem('Paste', '⌘V'),
            menuItem('Select All', '⌘A')
        ]},
        { label: 'View', items: [
            menuItem('as Icons', '⌘1'),
            menuItem('as List', '⌘2'),
            menuItem('as Columns', '⌘3'),
            'separator',
            menuItem('Show Preview', '⇧⌘P'),
            menuItem('Show Path Bar'),
            menuItem('Show Status Bar')
        ]},
        { label: 'Go', items: [
            menuItem('Back', '⌘['),
            menuItem('Forward', '⌘]'),
            'separator',
            menuItem('Desktop', '⇧⌘D'),
            menuItem('Documents', '⇧⌘O'),
            menuItem('Downloads', '⌥⌘L'),
            menuItem('Applications', '⇧⌘A')
        ]},
        { label: 'Window', items: [
            menuItem('Minimize', '⌘M'),
            menuItem('Zoom'),
            'separator',
            menuItem('Bring All to Front')
        ]},
        { label: 'Help', items: [
            menuItem('Finder Help', '⌘?')
        ]}
    ],
    'Safari': [
        { label: 'File', items: [
            menuItem('New Tab', '⌘T'),
            menuItem('New Window', '⌘N'),
            menuItem('New Private Window', '⇧⌘N'),
            'separator',
            menuItem('Open Location...', '⌘L'),
            menuItem('Close Tab', '⌘W'),
            menuItem('Close Window', '⇧⌘W')
        ]},
        { label: 'Edit', items: [
            menuItem('Undo', '⌘Z'),
            menuItem('Redo', '⇧⌘Z'),
            'separator',
            menuItem('Cut', '⌘X'),
            menuItem('Copy', '⌘C'),
            menuItem('Paste', '⌘V'),
            'separator',
            menuItem('Find...', '⌘F')
        ]},
        { label: 'View', items: [
            menuItem('Show Toolbar'),
            menuItem('Show Tab Bar'),
            menuItem('Show Bookmarks Bar', '⇧⌘B'),
            'separator',
            menuItem('Reload Page', '⌘R'),
            'separator',
            menuItem('Enter Full Screen', '⌃⌘F')
        ]},
        { label: 'History', items: [
            menuItem('Show All History', '⌘Y'),
            'separator',
            menuItem('Back', '⌘['),
            menuItem('Forward', '⌘]'),
            'separator',
            menuItem('Clear History...')
        ]},
        { label: 'Bookmarks', items: [
            menuItem('Show Bookmarks', '⌥⌘B'),
            menuItem('Add Bookmark...', '⌘D'),
            'separator',
            menuItem('Edit Bookmarks')
        ]},
        { label: 'Window', items: [
            menuItem('Minimize', '⌘M'),
            menuItem('Zoom')
        ]},
        { label: 'Help', items: [
            menuItem('Safari Help', '⌘?')
        ]}
    ],
    'Notes': [
        { label: 'File', items: [
            menuItem('New Note', '⌘N'),
            menuItem('New Folder', '⇧⌘N'),
            'separator',
            menuItem('Close', '⌘W')
        ]},
        { label: 'Edit', items: [
            menuItem('Undo', '⌘Z'),
            menuItem('Redo', '⇧⌘Z'),
            'separator',
            menuItem('Cut', '⌘X'),
            menuItem('Copy', '⌘C'),
            menuItem('Paste', '⌘V'),
            menuItem('Delete'),
            'separator',
            menuItem('Select All', '⌘A'),
            menuItem('Find', '⌘F')
        ]},
        { label: 'Format', items: [
            menuItem('Bold', '⌘B'),
            menuItem('Italic', '⌘I'),
            menuItem('Underline', '⌘U'),
            'separator',
            menuItem('Checklist', '⇧⌘L'),
            menuItem('Bulleted List'),
            menuItem('Numbered List')
        ]},
        { label: 'View', items: [
            menuItem('as Gallery'),
            menuItem('as List'),
            'separator',
            menuItem('Show Folders'),
            menuItem('Show Note Count')
        ]},
        { label: 'Window', items: [
            menuItem('Minimize', '⌘M'),
            menuItem('Zoom')
        ]},
        { label: 'Help', items: [
            menuItem('Notes Help', '⌘?')
        ]}
    ],
    'VS Code': [
        { label: 'File', items: [
            menuItem('New File', '⌘N'),
            menuItem('New Window', '⇧⌘N'),
            'separator',
            menuItem('Open...', '⌘O'),
            menuItem('Open Folder...'),
            'separator',
            menuItem('Save', '⌘S'),
            menuItem('Save As...', '⇧⌘S'),
            'separator',
            menuItem('Close', '⌘W')
        ]},
        { label: 'Edit', items: [
            menuItem('Undo', '⌘Z'),
            menuItem('Redo', '⇧⌘Z'),
            'separator',
            menuItem('Cut', '⌘X'),
            menuItem('Copy', '⌘C'),
            menuItem('Paste', '⌘V'),
            'separator',
            menuItem('Find', '⌘F'),
            menuItem('Replace', '⌥⌘F')
        ]},
        { label: 'Selection', items: [
            menuItem('Select All', '⌘A'),
            menuItem('Expand Selection', '⇧⌘→'),
            'separator',
            menuItem('Add Cursor Above', '⌥⌘↑'),
            menuItem('Add Cursor Below', '⌥⌘↓')
        ]},
        { label: 'View', items: [
            menuItem('Command Palette...', '⇧⌘P'),
            'separator',
            menuItem('Explorer', '⇧⌘E'),
            menuItem('Search', '⇧⌘F'),
            menuItem('Source Control', '⌃⇧G'),
            'separator',
            menuItem('Terminal', '⌃`')
        ]},
        { label: 'Go', items: [
            menuItem('Go to File...', '⌘P'),
            menuItem('Go to Line...', '⌃G'),
            menuItem('Go to Definition', 'F12'),
            'separator',
            menuItem('Back', '⌃-'),
            menuItem('Forward', '⌃⇧-')
        ]},
        { label: 'Run', items: [
            menuItem('Start Debugging', 'F5'),
            menuItem('Run Without Debugging', '⌃F5'),
            'separator',
            menuItem('Stop Debugging', '⇧F5')
        ]},
        { label: 'Help', items: [
            menuItem('Documentation'),
            menuItem('Release Notes'),
            'separator',
            menuItem('About')
        ]}
    ],
    'Terminal': [
        { label: 'Shell', items: [
            menuItem('New Tab', '⌘T'),
            menuItem('New Window', '⌘N'),
            'separator',
            menuItem('Close Tab', '⌘W'),
            menuItem('Close Window', '⇧⌘W')
        ]},
        { label: 'Edit', items: [
            menuItem('Copy', '⌘C'),
            menuItem('Paste', '⌘V'),
            menuItem('Clear to Start', '⌃U'),
            menuItem('Clear Screen', '⌘K'),
            'separator',
            menuItem('Select All', '⌘A')
        ]},
        { label: 'View', items: [
            menuItem('Show Tab Bar'),
            'separator',
            menuItem('Bigger', '⌘+'),
            menuItem('Smaller', '⌘-'),
            menuItem('Default Size', '⌘0')
        ]},
        { label: 'Window', items: [
            menuItem('Minimize', '⌘M'),
            menuItem('Zoom'),
            'separator',
            menuItem('Bring All to Front')
        ]},
        { label: 'Help', items: [
            menuItem('Terminal Help', '⌘?')
        ]}
    ],
    'Calendar': [
        { label: 'File', items: [
            menuItem('New Event', '⌘N'),
            menuItem('New Calendar'),
            'separator',
            menuItem('Import...'),
            menuItem('Export...'),
            'separator',
            menuItem('Close', '⌘W')
        ]},
        { label: 'Edit', items: [
            menuItem('Undo', '⌘Z'),
            'separator',
            menuItem('Cut', '⌘X'),
            menuItem('Copy', '⌘C'),
            menuItem('Paste', '⌘V'),
            menuItem('Delete')
        ]},
        { label: 'View', items: [
            menuItem('by Day', '⌘1'),
            menuItem('by Week', '⌘2'),
            menuItem('by Month', '⌘3'),
            menuItem('by Year', '⌘4'),
            'separator',
            menuItem('Go to Today', '⌘T'),
            menuItem('Show Calendar List', '⌥⌘S')
        ]},
        { label: 'Window', items: [
            menuItem('Minimize', '⌘M'),
            menuItem('Zoom')
        ]},
        { label: 'Help', items: [
            menuItem('Calendar Help', '⌘?')
        ]}
    ],
    'default': [
        { label: 'File', items: [
            menuItem('New', '⌘N'),
            menuItem('Open...', '⌘O'),
            menuItem('Save', '⌘S'),
            'separator',
            menuItem('Close', '⌘W')
        ]},
        { label: 'Edit', items: [
            menuItem('Undo', '⌘Z'),
            menuItem('Redo', '⇧⌘Z'),
            'separator',
            menuItem('Cut', '⌘X'),
            menuItem('Copy', '⌘C'),
            menuItem('Paste', '⌘V')
        ]},
        { label: 'View', items: [
            menuItem('Show Toolbar')
        ]},
        { label: 'Window', items: [
            menuItem('Minimize', '⌘M'),
            menuItem('Zoom')
        ]},
        { label: 'Help', items: [
            menuItem('Help', '⌘?')
        ]}
    ]
}

const MenuBar = () => {
    const [time, setTime] = useState(new Date())
    const { toggleSpotlight, toggleNotificationCenter, toggleMissionControl, toggleWidgets, currentDesktop, desktops, darkMode, activeApp } = useStore()
    const [activeMenu, setActiveMenu] = useState(null)
    const [activeSubMenu, setActiveSubMenu] = useState(null)
    const [showControlCenter, setShowControlCenter] = useState(false)

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000)
        return () => clearInterval(timer)
    }, [])

    const toggleMenu = (menu) => {
        setActiveMenu(activeMenu === menu ? null : menu)
    }

    const toggleControlCenter = () => setShowControlCenter(!showControlCenter)

    useEffect(() => {
        const handleClickOutside = () => {
            setActiveMenu(null)
            setActiveSubMenu(null)
            setShowControlCenter(false)
        }
        window.addEventListener('click', handleClickOutside)
        return () => window.removeEventListener('click', handleClickOutside)
    }, [])

    // 获取当前应用的菜单，如果没有则使用默认菜单
    const currentAppName = activeApp || 'Finder'
    const currentMenus = appMenus[currentAppName] || appMenus['default']

    return (
        <div className={`w-full h-7 sm:h-8 backdrop-blur-md flex items-center justify-between px-2 sm:px-4 text-xs sm:text-sm select-none z-50 shadow-sm relative transition-colors duration-500 ${
            darkMode ? 'bg-black/40 text-white' : 'bg-white/30 text-white'
        }`}>
            <div className="flex items-center gap-2 sm:gap-4 h-full" onClick={(e) => e.stopPropagation()}>
                <div className="relative">
                    <FaApple
                        className="text-lg cursor-pointer hover:text-gray-200"
                        onClick={() => toggleMenu('apple')}
                    />
                    {activeMenu === 'apple' && (
                        <div className="absolute top-8 left-0 w-48 bg-gray-100/90 backdrop-blur-xl rounded-lg shadow-xl text-black py-1 border border-gray-200">
                            <div className="px-4 py-1 hover:bg-blue-500 hover:text-white cursor-pointer">About This Mac</div>
                            <div className="h-[1px] bg-gray-300 my-1" />
                            <div className="px-4 py-1 hover:bg-blue-500 hover:text-white cursor-pointer">System Settings...</div>
                            <div className="px-4 py-1 hover:bg-blue-500 hover:text-white cursor-pointer">App Store...</div>
                            <div className="h-[1px] bg-gray-300 my-1" />
                            <div className="px-4 py-1 hover:bg-blue-500 hover:text-white cursor-pointer">Sleep</div>
                            <div className="px-4 py-1 hover:bg-blue-500 hover:text-white cursor-pointer">Restart...</div>
                            <div className="px-4 py-1 hover:bg-blue-500 hover:text-white cursor-pointer">Shut Down...</div>
                            <div className="h-[1px] bg-gray-300 my-1" />
                            <div className="px-4 py-1 hover:bg-blue-500 hover:text-white cursor-pointer">Lock Screen</div>
                        </div>
                    )}
                </div>

                <span className="font-bold cursor-pointer">{currentAppName}</span>
                {currentMenus.map((menu, index) => (
                    <div key={index} className="relative hidden sm:block">
                        <span
                            className="cursor-pointer hover:text-gray-200 transition-colors"
                            onClick={() => toggleMenu(index)}
                        >
                            {menu.label}
                        </span>
                        {activeMenu === index && (
                            <div className={`absolute top-8 left-0 min-w-[200px] backdrop-blur-xl rounded-lg shadow-xl py-1 border z-50 transition-colors duration-300 ${
                                darkMode
                                    ? 'bg-gray-800/95 border-gray-600/50 text-white'
                                    : 'bg-gray-100/95 border-gray-200/50 text-black'
                            }`}>
                                {menu.items.map((item, itemIndex) => (
                                    item === 'separator' ? (
                                        <div key={itemIndex} className={`h-[1px] my-1 mx-2 ${darkMode ? 'bg-gray-600' : 'bg-gray-300'}`} />
                                    ) : (
                                        <div
                                            key={itemIndex}
                                            className="px-4 py-1.5 hover:bg-blue-500 hover:text-white cursor-pointer transition-colors flex items-center justify-between gap-6"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                if (item.action) item.action()
                                                setActiveMenu(null)
                                            }}
                                        >
                                            <span>{item.label}</span>
                                            {item.shortcut && (
                                                <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                    {item.shortcut}
                                                </span>
                                            )}
                                        </div>
                                    )
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="flex items-center gap-1 sm:gap-4 text-xs sm:text-sm font-medium" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center gap-1 sm:gap-2">
                    <span className="hidden sm:inline text-xs bg-white/20 px-2 py-0.5 rounded">Desktop {currentDesktop}</span>
                    <FaTh
                        className="text-sm cursor-pointer hover:text-gray-200"
                        onClick={toggleMissionControl}
                        title="Mission Control"
                    />
                    <FaThLarge
                        className="text-sm cursor-pointer hover:text-gray-200"
                        onClick={toggleWidgets}
                        title="Widgets"
                    />
                    <FaBatteryFull className="text-lg" />
                    <FaWifi className="text-lg" />
                    <FaSearch className="text-sm cursor-pointer" onClick={toggleSpotlight} />
                    <div className="relative control-center-container">
                        <FaToggleOn
                            className={`text-xl cursor-pointer ${showControlCenter ? 'text-white' : 'text-gray-200'}`}
                            onClick={toggleControlCenter}
                        />
                        {showControlCenter && (
                            <div className="absolute top-8 right-0 w-80 bg-gray-100/90 backdrop-blur-xl rounded-2xl shadow-xl text-black p-4 border border-gray-200 flex flex-col gap-4">
                                <div className="flex gap-4">
                                    <div className="flex-1 bg-white/50 rounded-xl p-3 flex flex-col gap-2">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white"><FaWifi /></div>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-xs">Wi-Fi</span>
                                                <span className="text-[10px] text-gray-500">Home Network</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white"><FaToggleOn /></div>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-xs">Bluetooth</span>
                                                <span className="text-[10px] text-gray-500">On</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex-1 bg-white/50 rounded-xl p-3">
                                        <div className="text-xs font-bold mb-2">Display</div>
                                        <input type="range" className="w-full accent-blue-500" />
                                        <div className="text-xs font-bold mt-4 mb-2">Sound</div>
                                        <input type="range" className="w-full accent-blue-500" />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <span
                        className="font-medium min-w-[80px] text-right cursor-pointer hover:bg-white/20 px-2 py-0.5 rounded transition-colors select-none"
                        onClick={toggleNotificationCenter}
                    >
                        {format(time, 'EEE MMM d h:mm aa')}
                    </span>
                </div>
            </div>
        </div>
    )
}

export default MenuBar
