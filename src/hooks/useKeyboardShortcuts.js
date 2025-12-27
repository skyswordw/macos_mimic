import { useEffect } from 'react'
import { useStore } from '../store/useStore'

export const useKeyboardShortcuts = () => {
    const {
        toggleSpotlight,
        toggleLaunchpad,
        toggleMissionControl,
        toggleNotificationCenter,
        toggleSiri,
        lockScreen,
        togglePowerMenu,
        activeWindowId,
        closeWindow,
        minimizeWindow,
        maximizeWindow,
        openWindow,
        windows,
        focusWindow,
        toggleDarkMode,
    } = useStore()

    useEffect(() => {
        const handleKeyDown = (e) => {
            const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0
            const modKey = isMac ? e.metaKey : e.ctrlKey

            // Spotlight: Cmd+K or Cmd+Space
            if (modKey && (e.key === 'k' || e.key === ' ')) {
                e.preventDefault()
                toggleSpotlight()
                return
            }

            // Siri: Cmd+S (when holding)
            if (modKey && e.key === 's' && !e.shiftKey && !isInputFocused()) {
                e.preventDefault()
                toggleSiri()
                return
            }

            // Lock Screen: Ctrl+Cmd+Q (macOS standard)
            if (e.ctrlKey && modKey && e.key === 'q') {
                e.preventDefault()
                lockScreen()
                return
            }

            // Lock Screen alternative: Cmd+L (when no input focused)
            if (modKey && e.key === 'l' && !isInputFocused()) {
                e.preventDefault()
                lockScreen()
                return
            }

            // Power Menu: Ctrl+Eject or Power button simulation (Cmd+Shift+P)
            if (modKey && e.shiftKey && e.key === 'p') {
                e.preventDefault()
                togglePowerMenu()
                return
            }

            // Launchpad: F4
            if (e.key === 'F4') {
                e.preventDefault()
                toggleLaunchpad()
                return
            }

            // Mission Control: F3 or Ctrl+Up
            if (e.key === 'F3' || (e.ctrlKey && e.key === 'ArrowUp')) {
                e.preventDefault()
                toggleMissionControl()
                return
            }

            // Notification Center: Cmd+N (when no input focused)
            if (modKey && e.key === 'n' && !isInputFocused()) {
                e.preventDefault()
                toggleNotificationCenter()
                return
            }

            // Toggle Dark Mode: Cmd+Shift+D
            if (modKey && e.shiftKey && e.key === 'd') {
                e.preventDefault()
                toggleDarkMode()
                return
            }

            // Close window: Cmd+W
            if (modKey && e.key === 'w' && activeWindowId) {
                e.preventDefault()
                closeWindow(activeWindowId)
                return
            }

            // Quit app (close all windows of active app): Cmd+Q
            if (modKey && e.key === 'q' && !e.ctrlKey && activeWindowId) {
                e.preventDefault()
                // Close the active window (simplified quit)
                closeWindow(activeWindowId)
                return
            }

            // Minimize window: Cmd+M
            if (modKey && e.key === 'm' && activeWindowId && !e.shiftKey) {
                e.preventDefault()
                minimizeWindow(activeWindowId)
                return
            }

            // Toggle fullscreen: Cmd+Ctrl+F or F11
            if ((modKey && e.ctrlKey && e.key === 'f') || e.key === 'F11') {
                e.preventDefault()
                if (activeWindowId) {
                    maximizeWindow(activeWindowId)
                }
                return
            }

            // Quick app launchers: Cmd+Shift+[Key]
            if (modKey && e.shiftKey) {
                switch (e.key.toLowerCase()) {
                    case 'f':
                        e.preventDefault()
                        openWindow('finder', 'Finder', 'finder')
                        break
                    case 's':
                        e.preventDefault()
                        openWindow('safari', 'Safari', 'safari')
                        break
                    case 't':
                        e.preventDefault()
                        openWindow('terminal', 'Terminal', 'terminal')
                        break
                    case 'c':
                        e.preventDefault()
                        openWindow('calculator', 'Calculator', 'calculator')
                        break
                    case 'n':
                        e.preventDefault()
                        openWindow('notes', 'Notes', 'notes')
                        break
                    case 'o':
                        e.preventDefault()
                        openWindow('photos', 'Photos', 'photos')
                        break
                    case 'm':
                        e.preventDefault()
                        openWindow('mail', 'Mail', 'mail')
                        break
                    case 'w':
                        e.preventDefault()
                        openWindow('weather', 'Weather', 'weather')
                        break
                    case 'r':
                        e.preventDefault()
                        openWindow('reminders', 'Reminders', 'reminders')
                        break
                    case 'v':
                        e.preventDefault()
                        openWindow('vscode', 'VS Code', 'vscode')
                        break
                    case 'u':
                        e.preventDefault()
                        openWindow('music', 'Music', 'music')
                        break
                    case 'a':
                        e.preventDefault()
                        openWindow('appstore', 'App Store', 'appstore')
                        break
                    case 'i':
                        e.preventDefault()
                        openWindow('settings', 'Settings', 'settings')
                        break
                    case 'e':
                        e.preventDefault()
                        openWindow('textedit', 'TextEdit', 'textedit')
                        break
                }
                return
            }

            // Cycle through windows: Cmd+` or Cmd+Tab (simplified)
            if (modKey && e.key === '`') {
                e.preventDefault()
                const openWindows = windows.filter(w => w.isOpen && !w.isMinimised)
                if (openWindows.length > 1) {
                    const currentIndex = openWindows.findIndex(w => w.id === activeWindowId)
                    const nextIndex = (currentIndex + 1) % openWindows.length
                    focusWindow(openWindows[nextIndex].id)
                }
                return
            }

            // Hide all windows: Cmd+H (simplified - just minimize active)
            if (modKey && e.key === 'h' && !e.shiftKey) {
                e.preventDefault()
                if (activeWindowId) {
                    minimizeWindow(activeWindowId)
                }
                return
            }

            // Screenshot: Cmd+Shift+3 or Cmd+Shift+4 (trigger screenshot mode)
            if (modKey && e.shiftKey && (e.key === '3' || e.key === '4')) {
                e.preventDefault()
                // Screenshot functionality is handled by Screenshot component
                useStore.getState().addNotification({
                    title: 'Screenshot',
                    message: 'Screenshot taken!',
                    app: 'System'
                })
                return
            }
        }

        const isInputFocused = () => {
            const activeElement = document.activeElement
            return activeElement && (
                activeElement.tagName === 'INPUT' ||
                activeElement.tagName === 'TEXTAREA' ||
                activeElement.isContentEditable
            )
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [
        toggleSpotlight,
        toggleLaunchpad,
        toggleMissionControl,
        toggleNotificationCenter,
        toggleSiri,
        lockScreen,
        togglePowerMenu,
        activeWindowId,
        closeWindow,
        minimizeWindow,
        maximizeWindow,
        openWindow,
        windows,
        focusWindow,
        toggleDarkMode,
    ])
}

export default useKeyboardShortcuts
