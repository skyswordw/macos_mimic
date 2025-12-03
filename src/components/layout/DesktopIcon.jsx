import React, { useRef } from 'react'
import Draggable from 'react-draggable'
import { useStore } from '../../store/useStore'
import { FaHdd, FaFileAlt, FaFolder } from 'react-icons/fa'

const DesktopIcon = ({ icon }) => {
    const { updateIconPosition, openWindow } = useStore()
    const nodeRef = useRef(null)

    const handleStop = (e, data) => {
        updateIconPosition(icon.id, { x: data.x, y: data.y })
    }

    const handleDoubleClick = () => {
        if (icon.action && icon.action.type === 'app') {
            // 根据应用类型，使用合适的标题
            const appTitles = {
                'finder': 'Finder',
                'notes': icon.label || 'Notes',
                'safari': 'Safari',
                'terminal': 'Terminal',
                'settings': 'System Settings'
            }
            const title = appTitles[icon.action.value] || icon.label
            openWindow(icon.action.value, title, icon.action.value)
        }
    }

    // 根据图标类型选择合适的图标组件和颜色
    const getIconConfig = () => {
        switch (icon.icon) {
            case 'hdd':
                return { Component: FaHdd, color: 'text-gray-300' }
            case 'folder':
                return { Component: FaFolder, color: 'text-blue-400' }
            case 'file':
                return { Component: FaFileAlt, color: 'text-white' }
            default:
                return { Component: FaFileAlt, color: 'text-white' }
        }
    }

    const { Component: IconComponent, color } = getIconConfig()

    return (
        <Draggable
            nodeRef={nodeRef}
            position={icon.position}
            onStop={handleStop}
            bounds="parent"
        >
            <div
                ref={nodeRef}
                data-desktop-icon={icon.action?.value || icon.id}
                className="absolute flex flex-col items-center gap-1 w-24 cursor-pointer group"
                onDoubleClick={handleDoubleClick}
            >
                <div className={`w-16 h-16 rounded-lg flex items-center justify-center shadow-sm transition-all ${
                    icon.icon === 'hdd'
                        ? 'bg-transparent group-hover:bg-white/10'
                        : icon.icon === 'folder'
                            ? 'bg-blue-500/20 group-hover:bg-blue-500/30'
                            : 'bg-white/10 group-hover:bg-white/20'
                } border border-transparent group-hover:border-white/30`}>
                    <IconComponent className={`text-4xl ${color} drop-shadow-lg transition-transform group-hover:scale-110`} />
                </div>
                <span className="text-white text-xs font-medium drop-shadow-md bg-blue-600/0 px-2 py-0.5 rounded group-hover:bg-blue-600/80 transition-colors text-center leading-tight">
                    {icon.label}
                </span>
            </div>
        </Draggable>
    )
}

export default DesktopIcon
