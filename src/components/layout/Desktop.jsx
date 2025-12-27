import React, { useState, useEffect } from 'react'
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
import AppSwitcher from '../system/AppSwitcher'
import DesktopIcon from './DesktopIcon'
import LockScreen from '../system/LockScreen'
import ScreenSaver from '../system/ScreenSaver'
import Siri from '../system/Siri'
import PowerMenu from '../system/PowerMenu'
import EmojiPicker from '../system/EmojiPicker'

const Desktop = () => {
    const {
        wallpaper, desktopIcons, darkMode,
        isLockScreenOpen, setLockScreen,
        isScreenSaverOpen, setScreenSaver,
        isSiriOpen, setSiri,
        isPowerMenuOpen, setPowerMenu,
        isEmojiPickerOpen, setEmojiPicker, emojiPickerPosition
    } = useStore()

    const handlePowerAction = (action) => {
        switch(action) {
            case 'lock':
                setLockScreen(true)
                break
            case 'sleep':
                setScreenSaver(true)
                break
            case 'logout':
            case 'restart':
            case 'shutdown':
                // Simulate shutdown/restart with lock screen
                setLockScreen(true)
                break
        }
    }

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
            <AppSwitcher />

            {/* System Overlays */}
            {isLockScreenOpen && <LockScreen onUnlock={() => setLockScreen(false)} />}
            {isScreenSaverOpen && <ScreenSaver onDismiss={() => setScreenSaver(false)} />}
            <Siri isOpen={isSiriOpen} onClose={() => setSiri(false)} />
            <PowerMenu isOpen={isPowerMenuOpen} onClose={() => setPowerMenu(false)} onAction={handlePowerAction} />
            <EmojiPicker
                isOpen={isEmojiPickerOpen}
                onClose={() => setEmojiPicker(false)}
                position={emojiPickerPosition}
                onSelect={(emoji) => {
                    navigator.clipboard.writeText(emoji)
                    setEmojiPicker(false)
                }}
            />
        </div>
    )
}

export default Desktop
