import React from 'react'
import MenuBar from './MenuBar'
import Dock from '../dock/Dock'
import WindowManager from '../window/WindowManager'

import { useStore } from '../../store/useStore'
import useKeyboardShortcuts from '../../hooks/useKeyboardShortcuts'

import Launchpad from '../system/Launchpad'
import Spotlight from '../system/Spotlight'
import ContextMenu from '../system/ContextMenu'
import NotificationCenter from '../system/NotificationCenter'
import MissionControl from '../system/MissionControl'
import Screenshot from '../system/Screenshot'
import HotCorners from '../system/HotCorners'
import Widgets from '../system/Widgets'
import DesktopIcon from './DesktopIcon'

const Desktop = () => {
    const { wallpaper, desktopIcons, darkMode } = useStore()

    // 注册全局键盘快捷键
    useKeyboardShortcuts()

    return (
        <div
            className="relative w-full h-full bg-cover bg-center overflow-hidden transition-all duration-500"
            style={{ backgroundImage: `url('${wallpaper}')` }}
        >
            {/* Overlay to darken background - more dark in dark mode */}
            <div className={`absolute inset-0 pointer-events-none transition-all duration-500 ${darkMode ? 'bg-black/40' : 'bg-black/10'}`} />

            <MenuBar />

            <div className="relative w-full h-full pt-7 sm:pt-8 pb-14 sm:pb-20">
                {desktopIcons.map(icon => (
                    <DesktopIcon key={icon.id} icon={icon} />
                ))}
                <WindowManager />
            </div>

            <Launchpad />
            <Spotlight />
            <NotificationCenter />
            <MissionControl />
            <Widgets />
            <Screenshot />
            <HotCorners />
            <ContextMenu />
            <Dock />
        </div>
    )
}

export default Desktop
