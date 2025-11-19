import React, { useRef } from 'react'
import Draggable from 'react-draggable'
import { useStore } from '../../store/useStore'
import { FaHdd, FaFileAlt } from 'react-icons/fa'

const DesktopIcon = ({ icon }) => {
    const { updateIconPosition, openWindow } = useStore()
    const nodeRef = useRef(null)

    const handleStop = (e, data) => {
        updateIconPosition(icon.id, { x: data.x, y: data.y })
    }

    const handleDoubleClick = () => {
        if (icon.id === 'hd') {
            openWindow('finder', 'Finder', 'finder')
        } else if (icon.id === 'readme') {
            // For now, open a simple alert or maybe a text viewer if we had one.
            // Let's open Notes as a proxy for now, or just do nothing/log.
            // Actually, let's open a specific window for Readme if we can, 
            // but for now let's just open Notes with a title.
            openWindow('notes', 'Readme.txt', 'notes')
        }
    }

    const IconComponent = icon.icon === 'hdd' ? FaHdd : FaFileAlt
    const color = icon.icon === 'hdd' ? 'text-gray-300' : 'text-white'

    return (
        <Draggable
            nodeRef={nodeRef}
            position={icon.position}
            onStop={handleStop}
            bounds="parent"
        >
            <div
                ref={nodeRef}
                className="absolute flex flex-col items-center gap-1 w-24 cursor-pointer group"
                onDoubleClick={handleDoubleClick}
            >
                <div className={`w-16 h-16 rounded-lg ${icon.icon === 'hdd' ? '' : 'bg-white/10'} flex items-center justify-center shadow-sm group-hover:bg-white/20 transition-colors border border-transparent group-hover:border-white/20`}>
                    <IconComponent className={`text-4xl ${color} drop-shadow-lg`} />
                </div>
                <span className="text-white text-xs font-medium drop-shadow-md bg-blue-600/0 px-2 py-0.5 rounded group-hover:bg-blue-600/80 transition-colors text-center leading-tight">
                    {icon.label}
                </span>
            </div>
        </Draggable>
    )
}

export default DesktopIcon
