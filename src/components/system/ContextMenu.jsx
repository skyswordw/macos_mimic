import React, { useEffect, useState } from 'react'
import { useStore } from '../../store/useStore'
import { FaCopy, FaPaste, FaCut, FaTrash, FaEdit, FaInfo, FaFolder, FaFileAlt, FaRedo } from 'react-icons/fa'

const ContextMenu = () => {
    const { setWallpaper, autoArrangeIcons, darkMode, openWindow } = useStore()
    const [visible, setVisible] = useState(false)
    const [position, setPosition] = useState({ x: 0, y: 0 })
    const [contextType, setContextType] = useState('desktop') // desktop, icon, window, dock, file
    const [targetElement, setTargetElement] = useState(null)

    useEffect(() => {
        const handleContextMenu = (e) => {
            e.preventDefault()

            // Detect context type based on target element
            const target = e.target
            let type = 'desktop'
            let element = null

            // Check if clicking on a desktop icon
            if (target.closest('[data-desktop-icon]')) {
                type = 'icon'
                element = target.closest('[data-desktop-icon]')
            }
            // Check if clicking on a dock icon
            else if (target.closest('[data-dock-id]')) {
                type = 'dock'
                element = target.closest('[data-dock-id]')
            }
            // Check if clicking on a window
            else if (target.closest('[data-window-id]')) {
                type = 'window'
                element = target.closest('[data-window-id]')
            }
            // Check if clicking on a file in Finder
            else if (target.closest('[data-file-item]')) {
                type = 'file'
                element = target.closest('[data-file-item]')
            }

            setContextType(type)
            setTargetElement(element)
            setVisible(true)
            setPosition({ x: e.clientX, y: e.clientY })
        }

        const handleClick = () => setVisible(false)

        window.addEventListener('contextmenu', handleContextMenu)
        window.addEventListener('click', handleClick)

        return () => {
            window.removeEventListener('contextmenu', handleContextMenu)
            window.removeEventListener('click', handleClick)
        }
    }, [])

    if (!visible) return null

    // Get menu items based on context type
    const getMenuItems = () => {
        switch (contextType) {
            case 'icon':
                return [
                    { label: 'Open', icon: FaFolder, action: () => {
                        const iconId = targetElement?.dataset.desktopIcon
                        if (iconId) {
                            // Open the corresponding app
                            openWindow(iconId, iconId, iconId)
                        }
                        setVisible(false)
                    }},
                    { label: 'Get Info', icon: FaInfo, action: () => console.log('Get Info') },
                    { type: 'separator' },
                    { label: 'Rename', icon: FaEdit, action: () => console.log('Rename') },
                    { label: 'Duplicate', icon: FaCopy, action: () => console.log('Duplicate') },
                    { type: 'separator' },
                    { label: 'Move to Trash', icon: FaTrash, action: () => console.log('Move to Trash') },
                ]

            case 'dock':
                const appId = targetElement?.dataset.dockId
                return [
                    { label: 'Open', action: () => {
                        if (appId && appId !== 'launchpad') {
                            openWindow(appId, appId, appId)
                        }
                        setVisible(false)
                    }},
                    { label: 'Options', hasSubmenu: true },
                    { type: 'separator' },
                    { label: 'Show in Finder', action: () => {
                        openWindow('finder', 'Finder', 'finder')
                        setVisible(false)
                    }},
                    { label: 'Quit', action: () => console.log('Quit') },
                ]

            case 'file':
                return [
                    { label: 'Open', icon: FaFileAlt, action: () => console.log('Open') },
                    { label: 'Open With', hasSubmenu: true },
                    { type: 'separator' },
                    { label: 'Cut', icon: FaCut, action: () => console.log('Cut') },
                    { label: 'Copy', icon: FaCopy, action: () => console.log('Copy') },
                    { label: 'Paste', icon: FaPaste, action: () => console.log('Paste') },
                    { type: 'separator' },
                    { label: 'Rename', icon: FaEdit, action: () => console.log('Rename') },
                    { label: 'Get Info', icon: FaInfo, action: () => console.log('Get Info') },
                    { type: 'separator' },
                    { label: 'Move to Trash', icon: FaTrash, action: () => console.log('Move to Trash') },
                ]

            case 'window':
                return [
                    { label: 'Minimize', action: () => console.log('Minimize') },
                    { label: 'Zoom', action: () => console.log('Zoom') },
                    { type: 'separator' },
                    { label: 'Close Window', action: () => console.log('Close Window') },
                ]

            case 'desktop':
            default:
                return [
                    { label: 'New Folder', icon: FaFolder, action: () => {
                        openWindow('finder', 'Finder', 'finder')
                        setVisible(false)
                    }},
                    { label: 'Get Info', icon: FaInfo, action: () => console.log('Get Info') },
                    { type: 'separator' },
                    { label: 'Change Wallpaper...', action: () => {
                        openWindow('settings', 'System Settings', 'settings')
                        setVisible(false)
                    }},
                    { type: 'separator' },
                    { label: 'Auto-Arrange Icons', action: () => {
                        autoArrangeIcons()
                        setVisible(false)
                    }},
                    { label: 'Sort By', hasSubmenu: true },
                    { label: 'Clean Up', action: () => {
                        autoArrangeIcons()
                        setVisible(false)
                    }},
                    { type: 'separator' },
                    { label: 'Show View Options', action: () => console.log('Show View Options') },
                ]
        }
    }

    const menuItems = getMenuItems()

    return (
        <div
            className={`fixed z-50 w-56 backdrop-blur-xl border rounded-lg shadow-xl py-1 text-sm select-none transition-colors duration-300 ${
                darkMode
                    ? 'bg-gray-800/90 border-gray-600/50 text-white'
                    : 'bg-gray-100/90 border-gray-200/50 text-black'
            }`}
            style={{ top: position.y, left: position.x }}
        >
            {menuItems.map((item, index) => (
                item.type === 'separator' ? (
                    <div key={index} className={`h-[1px] my-1 mx-3 ${darkMode ? 'bg-gray-600' : 'bg-gray-300'}`} />
                ) : (
                    <div
                        key={index}
                        className={`px-4 py-2 hover:bg-blue-500 hover:text-white cursor-pointer flex items-center gap-3 group transition-colors ${
                            item.hasSubmenu ? 'pr-2' : ''
                        }`}
                        onClick={item.action}
                    >
                        {item.icon && (
                            <item.icon className="w-3.5 h-3.5 flex-shrink-0" />
                        )}
                        <span className="flex-1">{item.label}</span>
                        {item.hasSubmenu && (
                            <span className={`ml-2 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} group-hover:text-white`}>▶</span>
                        )}
                    </div>
                )
            ))}
        </div>
    )
}

export default ContextMenu
