import React from 'react'
import MenuBar from './MenuBar'
import Dock from '../dock/Dock'
import WindowManager from '../window/WindowManager'

import { useStore } from '../../store/useStore'

import Launchpad from '../system/Launchpad'
import Spotlight from '../system/Spotlight'
import ContextMenu from '../system/ContextMenu'
import NotificationCenter from '../system/NotificationCenter'
import DesktopIcon from './DesktopIcon'

const Desktop = () => {
    const { wallpaper, desktopIcons } = useStore()

    return (
        <div
            className="relative w-full h-full bg-cover bg-center overflow-hidden transition-all duration-500"
            style={{ backgroundImage: `url('${wallpaper}')` }}
        >
            {/* Overlay to darken background slightly if needed */}
            <div className="absolute inset-0 bg-black/10 pointer-events-none" />

            <MenuBar />

            <div className="relative w-full h-full pt-8 pb-20">
                {desktopIcons.map(icon => (
                    <DesktopIcon key={icon.id} icon={icon} />
                ))}
                <WindowManager />
            </div>

            <Launchpad />
            <Spotlight />
            <NotificationCenter />
            <ContextMenu />
            <Dock />
        </div>
    )
}

export default Desktop
