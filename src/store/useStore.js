import { create } from 'zustand'
import { soundEffects } from '../utils/soundEffects'

export const useStore = create((set) => ({
    windows: [], // { id, title, component, isOpen, isMinimised, isMaximized, zIndex, position, size, desktop }
    activeWindowId: null,
    zIndexCounter: 10,
    wallpaper: 'https://4kwallpapers.com/images/wallpapers/macos-monterey-stock-purple-dark-mode-layers-5k-4480x2520-5888.jpg',
    isLogin: false,
    isLaunchpadOpen: false,
    isSpotlightOpen: false,
    isNotificationCenterOpen: false,
    isMissionControlOpen: false,
    brightness: 100,
    darkMode: false,
    soundEnabled: true,
    soundVolume: 0.3,
    desktopIcons: [
        { id: 'hd', label: 'Macintosh HD', icon: 'hdd', position: { x: 20, y: 20 } },
        { id: 'readme', label: 'Readme.txt', icon: 'file', position: { x: 20, y: 120 } }
    ],

    // 多桌面相关状态
    desktops: [1],
    currentDesktop: 1,

    setLogin: (status) => set({ isLogin: status }),
    toggleLaunchpad: () => set((state) => {
        const newState = !state.isLaunchpadOpen
        if (state.soundEnabled) {
            newState ? soundEffects.launchpadOpen() : soundEffects.launchpadClose()
        }
        return { isLaunchpadOpen: newState }
    }),
    toggleSpotlight: () => set((state) => {
        const newState = !state.isSpotlightOpen
        if (state.soundEnabled && newState) {
            soundEffects.spotlightOpen()
        }
        return { isSpotlightOpen: newState }
    }),
    toggleNotificationCenter: () => set((state) => {
        if (state.soundEnabled && !state.isNotificationCenterOpen) {
            soundEffects.notification()
        }
        return { isNotificationCenterOpen: !state.isNotificationCenterOpen }
    }),
    toggleMissionControl: () => set((state) => {
        if (state.soundEnabled && !state.isMissionControlOpen) {
            soundEffects.click()
        }
        return { isMissionControlOpen: !state.isMissionControlOpen }
    }),
    setBrightness: (val) => set({ brightness: val }),
    setWallpaper: (url) => set({ wallpaper: url }),
    toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
    setDarkMode: (value) => set({ darkMode: value }),
    toggleSoundEffects: () => set((state) => {
        soundEffects.toggle()
        return { soundEnabled: !state.soundEnabled }
    }),
    setSoundVolume: (volume) => set(() => {
        soundEffects.setVolume(volume)
        return { soundVolume: volume }
    }),

    // 多桌面管理方法
    setCurrentDesktop: (desktopId) => set((state) => {
        if (state.soundEnabled) {
            soundEffects.desktopSwitch()
        }
        return { currentDesktop: desktopId }
    }),
    addDesktop: (desktopId) => set((state) => ({
        desktops: [...state.desktops, desktopId]
    })),
    removeDesktop: (desktopId) => set((state) => ({
        desktops: state.desktops.filter(d => d !== desktopId),
        currentDesktop: state.currentDesktop === desktopId ? state.desktops[0] : state.currentDesktop,
        windows: state.windows.map(w =>
            w.desktop === desktopId ? { ...w, desktop: state.desktops[0] } : w
        )
    })),
    moveWindowToDesktop: (windowId, desktopId) => set((state) => ({
        windows: state.windows.map(w =>
            w.id === windowId ? { ...w, desktop: desktopId } : w
        )
    })),

    openWindow: (id, title, component) => set((state) => {
        if (state.soundEnabled) {
            soundEffects.windowOpen()
        }
        const existingWindow = state.windows.find(w => w.id === id);
        if (existingWindow) {
            return {
                windows: state.windows.map(w => w.id === id ? { ...w, isOpen: true, isMinimised: false, zIndex: state.zIndexCounter + 1, desktop: state.currentDesktop } : w),
                activeWindowId: id,
                zIndexCounter: state.zIndexCounter + 1
            };
        }
        // 移动端适配的窗口尺寸和位置
        const isMobile = window.innerWidth < 768
        const defaultWidth = isMobile ? Math.min(window.innerWidth - 20, 400) : 800
        const defaultHeight = isMobile ? Math.min(window.innerHeight - 100, 500) : 600
        const xPos = isMobile ? 10 : 100 + (state.windows.length * 20)
        const yPos = isMobile ? 40 : 50 + (state.windows.length * 20)

        return {
            windows: [...state.windows, {
                id,
                title,
                component,
                isOpen: true,
                isMinimised: false,
                isMaximized: false,
                zIndex: state.zIndexCounter + 1,
                position: { x: xPos, y: yPos },
                size: { width: defaultWidth, height: defaultHeight },
                desktop: state.currentDesktop
            }],
            activeWindowId: id,
            zIndexCounter: state.zIndexCounter + 1
        };
    }),

    closeWindow: (id) => set((state) => {
        if (state.soundEnabled) {
            soundEffects.windowClose()
        }
        return {
            windows: state.windows.map(w => w.id === id ? { ...w, isOpen: false } : w),
            activeWindowId: null
        }
    }),

    minimizeWindow: (id) => set((state) => {
        if (state.soundEnabled) {
            soundEffects.windowMinimize()
        }
        return {
            windows: state.windows.map(w => w.id === id ? { ...w, isMinimised: true } : w),
            activeWindowId: null
        }
    }),

    maximizeWindow: (id) => set((state) => {
        if (state.soundEnabled) {
            soundEffects.windowMaximize()
        }
        return {
            windows: state.windows.map(w => w.id === id ? { ...w, isMaximized: !w.isMaximized } : w),
            activeWindowId: id,
            zIndexCounter: state.zIndexCounter + 1
        }
    }),

    focusWindow: (id) => set((state) => ({
        windows: state.windows.map(w => w.id === id ? { ...w, zIndex: state.zIndexCounter + 1, isMinimised: false } : w),
        activeWindowId: id,
        zIndexCounter: state.zIndexCounter + 1
    })),

    updateWindowPosition: (id, position) => set((state) => ({
        windows: state.windows.map(w => w.id === id ? { ...w, position } : w)
    })),

    updateWindowSize: (id, size) => set((state) => ({
        windows: state.windows.map(w => w.id === id ? { ...w, size } : w)
    })),

    updateIconPosition: (id, position) => set((state) => ({
        desktopIcons: state.desktopIcons.map(icon => icon.id === id ? { ...icon, position } : icon)
    })),
}))
