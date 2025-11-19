import React, { useEffect, useState } from 'react'
import { useStore } from '../../store/useStore'

const ContextMenu = () => {
    const { setWallpaper } = useStore()
    const [visible, setVisible] = useState(false)
    const [position, setPosition] = useState({ x: 0, y: 0 })

    useEffect(() => {
        const handleContextMenu = (e) => {
            e.preventDefault()
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

    const menuItems = [
        { label: 'New Folder', action: () => console.log('New Folder') },
        { label: 'Get Info', action: () => console.log('Get Info') },
        { label: 'Change Wallpaper', action: () => setWallpaper('https://images.unsplash.com/photo-1477346611705-65d1883cee1e?auto=format&fit=crop&w=1920&q=80') },
        { type: 'separator' },
        { label: 'Sort By', hasSubmenu: true },
        { label: 'Clean Up', action: () => console.log('Clean Up') },
        { label: 'Clean Up By', hasSubmenu: true },
        { label: 'Show View Options', action: () => console.log('Show View Options') },
    ]

    return (
        <div
            className="fixed z-50 w-56 bg-gray-100/90 backdrop-blur-xl border border-gray-200/50 rounded-lg shadow-xl py-1 text-sm text-black select-none"
            style={{ top: position.y, left: position.x }}
        >
            {menuItems.map((item, index) => (
                item.type === 'separator' ? (
                    <div key={index} className="h-[1px] bg-gray-300 my-1 mx-3" />
                ) : (
                    <div
                        key={index}
                        className="px-4 py-1 hover:bg-blue-500 hover:text-white cursor-pointer flex justify-between items-center group"
                        onClick={item.action}
                    >
                        <span>{item.label}</span>
                        {item.hasSubmenu && <span className="text-gray-500 group-hover:text-white">▶</span>}
                    </div>
                )
            ))}
        </div>
    )
}

export default ContextMenu
