import { useEffect } from 'react'
import { useStore } from '../store/useStore'

export const useKeyboardShortcuts = () => {
    const {
        toggleSpotlight,
        toggleLaunchpad,
        toggleMissionControl,
        toggleNotificationCenter,
        activeWindowId,
        closeWindow,
        minimizeWindow,
        maximizeWindow,
        openWindow,
        windows,
        focusWindow,
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

            // Close window: Cmd+W
            if (modKey && e.key === 'w' && activeWindowId) {
                e.preventDefault()
                closeWindow(activeWindowId)
                return
            }

            // Minimize window: Cmd+M
            if (modKey && e.key === 'm' && activeWindowId) {
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

            // Quick app launchers
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
                    case 'p':
                        e.preventDefault()
                        openWindow('photos', 'Photos', 'photos')
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
        activeWindowId,
        closeWindow,
        minimizeWindow,
        maximizeWindow,
        openWindow,
        windows,
        focusWindow,
    ])
}

export default useKeyboardShortcuts
