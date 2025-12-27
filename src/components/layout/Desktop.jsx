import React, { useEffect, useRef, useCallback } from 'react'
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
import PowerMenu from '../system/PowerMenu'
import ScreenSaver from '../system/ScreenSaver'
import Siri from '../system/Siri'

const Desktop = () => {
    const {
        wallpaper, desktopIcons, darkMode,
        isLockScreenOpen, unlockScreen,
        isPowerMenuOpen, closePowerMenu, lockScreen, setLogin,
        isScreenSaverActive, deactivateScreenSaver,
        isSiriOpen, closeSiri,
        screenSaverTimeout
    } = useStore()

    const lastActivityRef = useRef(Date.now())
    const screenSaverTimerRef = useRef(null)

    // 注册全局键盘快捷键
    useKeyboardShortcuts()

    // Handle power menu actions
    const handlePowerAction = useCallback((action) => {
        switch (action) {
            case 'lock':
                lockScreen()
                break
            case 'sleep':
                // Show screensaver as "sleep" mode
                useStore.getState().activateScreenSaver()
                break
            case 'restart':
            case 'shutdown':
                // Show boot sequence by logging out
                setLogin(false)
                break
            case 'logout':
                setLogin(false)
                break
            default:
                break
        }
    }, [lockScreen, setLogin])

    // Screen saver idle detection
    useEffect(() => {
        const resetTimer = () => {
            lastActivityRef.current = Date.now()
            if (isScreenSaverActive) {
                deactivateScreenSaver()
            }
        }

        const checkIdle = () => {
            const idleTime = (Date.now() - lastActivityRef.current) / 1000 / 60 // in minutes
            if (idleTime >= screenSaverTimeout && !isScreenSaverActive && !isLockScreenOpen) {
                useStore.getState().activateScreenSaver()
            }
        }

        // Add activity listeners
        window.addEventListener('mousemove', resetTimer)
        window.addEventListener('keydown', resetTimer)
        window.addEventListener('mousedown', resetTimer)
        window.addEventListener('touchstart', resetTimer)

        // Check for idle every 30 seconds
        screenSaverTimerRef.current = setInterval(checkIdle, 30000)

        return () => {
            window.removeEventListener('mousemove', resetTimer)
            window.removeEventListener('keydown', resetTimer)
            window.removeEventListener('mousedown', resetTimer)
            window.removeEventListener('touchstart', resetTimer)
            if (screenSaverTimerRef.current) {
                clearInterval(screenSaverTimerRef.current)
            }
        }
    }, [screenSaverTimeout, isScreenSaverActive, isLockScreenOpen, deactivateScreenSaver])

    // Handle screen saver click to show lock screen
    const handleScreenSaverDismiss = useCallback(() => {
        deactivateScreenSaver()
        lockScreen()
    }, [deactivateScreenSaver, lockScreen])

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

            {/* Siri */}
            {isSiriOpen && <Siri onClose={closeSiri} />}

            {/* Power Menu */}
            <PowerMenu
                isOpen={isPowerMenuOpen}
                onClose={closePowerMenu}
                onAction={handlePowerAction}
            />

            {/* Screen Saver */}
            {isScreenSaverActive && (
                <ScreenSaver onDismiss={handleScreenSaverDismiss} />
            )}

            {/* Lock Screen */}
            {isLockScreenOpen && (
                <LockScreen onUnlock={unlockScreen} />
            )}
        </div>
    )
}

export default Desktop
