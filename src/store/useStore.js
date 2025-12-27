import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { soundEffects } from '../utils/soundEffects'

// 从 localStorage 获取保存的设置
const getPersistedSettings = () => {
    try {
        const saved = localStorage.getItem('macos-settings')
        return saved ? JSON.parse(saved) : {}
    } catch {
        return {}
    }
}

const persistedSettings = getPersistedSettings()

export const useStore = create(
    persist(
        (set, get) => ({
    windows: persistedSettings.windows || [], // { id, title, component, isOpen, isMinimised, isMaximized, zIndex, position, size, desktop }
    activeWindowId: null,
    activeApp: null, // 当前活动的应用名称（用于MenuBar）
    zIndexCounter: 10,
    wallpaper: persistedSettings.wallpaper || 'https://4kwallpapers.com/images/wallpapers/macos-monterey-stock-purple-dark-mode-layers-5k-4480x2520-5888.jpg',
    isLogin: false,
    isLaunchpadOpen: false,
    isSpotlightOpen: false,
    isNotificationCenterOpen: false,
    isMissionControlOpen: false,
    showWidgets: false,
    isLockScreenOpen: false,
    isScreenSaverOpen: false,
    isSiriOpen: false,
    isPowerMenuOpen: false,
    isEmojiPickerOpen: false,
    emojiPickerPosition: { x: 100, y: 100 },
    brightness: persistedSettings.brightness ?? 100,
    darkMode: persistedSettings.darkMode ?? false,
    soundEnabled: persistedSettings.soundEnabled ?? true,
    soundVolume: persistedSettings.soundVolume ?? 0.3,
    desktopIcons: [
        { id: 'hd', label: 'Macintosh HD', icon: 'hdd', position: { x: 20, y: 20 }, action: { type: 'app', value: 'finder' } },
        { id: 'applications', label: 'Applications', icon: 'folder', position: { x: 20, y: 120 }, action: { type: 'app', value: 'finder' } },
        { id: 'documents', label: 'Documents', icon: 'folder', position: { x: 20, y: 220 }, action: { type: 'app', value: 'finder' } },
        { id: 'readme', label: 'Readme.txt', icon: 'file', position: { x: 20, y: 320 }, action: { type: 'app', value: 'notes' } }
    ],
    trashItems: [], // 回收站内容

    // Notification system
    notifications: persistedSettings.notifications || [],

    // 最近应用（最多保存5个）
    recentApps: persistedSettings.recentApps || [],

    // 热区配置
    hotCorners: persistedSettings.hotCorners || {
        topLeft: 'none',       // 'none' | 'mission-control' | 'desktop' | 'launchpad' | 'notification-center' | 'lock-screen'
        topRight: 'notification-center',
        bottomLeft: 'none',
        bottomRight: 'desktop'
    },

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
    toggleWidgets: () => set((state) => {
        if (state.soundEnabled && !state.showWidgets) {
            soundEffects.click()
        }
        return { showWidgets: !state.showWidgets }
    }),
    toggleLockScreen: () => set((state) => ({ isLockScreenOpen: !state.isLockScreenOpen })),
    setLockScreen: (value) => set({ isLockScreenOpen: value }),
    toggleScreenSaver: () => set((state) => ({ isScreenSaverOpen: !state.isScreenSaverOpen })),
    setScreenSaver: (value) => set({ isScreenSaverOpen: value }),
    toggleSiri: () => set((state) => {
        if (state.soundEnabled && !state.isSiriOpen) {
            soundEffects.click()
        }
        return { isSiriOpen: !state.isSiriOpen }
    }),
    setSiri: (value) => set({ isSiriOpen: value }),
    togglePowerMenu: () => set((state) => ({ isPowerMenuOpen: !state.isPowerMenuOpen })),
    setPowerMenu: (value) => set({ isPowerMenuOpen: value }),
    toggleEmojiPicker: (position) => set((state) => ({
        isEmojiPickerOpen: !state.isEmojiPickerOpen,
        emojiPickerPosition: position || state.emojiPickerPosition
    })),
    setEmojiPicker: (value, position) => set((state) => ({
        isEmojiPickerOpen: value,
        emojiPickerPosition: position || state.emojiPickerPosition
    })),
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

        // Exclude system apps from recent apps
        const systemApps = ['launchpad', 'spotlight', 'notification-center', 'mission-control']
        const shouldAddToRecent = !systemApps.includes(id)

        // Update recent apps (keep max 5, most recent first)
        const updatedRecent = shouldAddToRecent
            ? [
                { id, title },
                ...state.recentApps.filter(app => app.id !== id)
            ].slice(0, 5)
            : state.recentApps

        const existingWindow = state.windows.find(w => w.id === id);
        if (existingWindow) {
            return {
                windows: state.windows.map(w => w.id === id ? { ...w, isOpen: true, isMinimised: false, zIndex: state.zIndexCounter + 1, desktop: state.currentDesktop } : w),
                activeWindowId: id,
                activeApp: title,
                zIndexCounter: state.zIndexCounter + 1,
                recentApps: updatedRecent
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
            activeApp: title,
            zIndexCounter: state.zIndexCounter + 1,
            recentApps: updatedRecent
        };
    }),

    closeWindow: (id) => set((state) => {
        if (state.soundEnabled) {
            soundEffects.windowClose()
        }
        const isClosingActiveWindow = state.activeWindowId === id
        return {
            windows: state.windows.map(w => w.id === id ? { ...w, isOpen: false } : w),
            activeWindowId: isClosingActiveWindow ? null : state.activeWindowId,
            activeApp: isClosingActiveWindow ? 'Finder' : state.activeApp
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

    focusWindow: (id) => set((state) => {
        const window = state.windows.find(w => w.id === id)
        return {
            windows: state.windows.map(w => w.id === id ? { ...w, zIndex: state.zIndexCounter + 1, isMinimised: false } : w),
            activeWindowId: id,
            activeApp: window ? window.title : null,
            zIndexCounter: state.zIndexCounter + 1
        }
    }),

    updateWindowPosition: (id, position) => set((state) => ({
        windows: state.windows.map(w => w.id === id ? { ...w, position } : w)
    })),

    updateWindowSize: (id, size) => set((state) => ({
        windows: state.windows.map(w => w.id === id ? { ...w, size } : w)
    })),

    updateIconPosition: (id, position) => set((state) => ({
        desktopIcons: state.desktopIcons.map(icon => icon.id === id ? { ...icon, position } : icon)
    })),

    // Auto-arrange desktop icons
    autoArrangeIcons: () => set((state) => {
        const gridSize = 100 // pixels between icons
        const startX = 20
        const startY = 20
        const maxRows = Math.floor((window.innerHeight - 200) / gridSize)

        const arranged = state.desktopIcons.map((icon, index) => {
            const col = Math.floor(index / maxRows)
            const row = index % maxRows
            return {
                ...icon,
                position: {
                    x: startX + col * gridSize,
                    y: startY + row * gridSize
                }
            }
        })

        return { desktopIcons: arranged }
    }),

    // Trash 操作
    moveToTrash: (item) => set((state) => ({
        trashItems: [...state.trashItems, { ...item, deletedAt: new Date().toISOString() }]
    })),

    restoreFromTrash: (id) => set((state) => ({
        trashItems: state.trashItems.filter(item => item.id !== id)
    })),

    emptyTrash: () => {
        soundEffects.emptyTrash()
        return set({ trashItems: [] })
    },

    deleteFromTrash: (id) => set((state) => ({
        trashItems: state.trashItems.filter(item => item.id !== id)
    })),

    // Notification actions
    addNotification: (notification) => set((state) => {
        if (state.soundEnabled) {
            soundEffects.notification()
        }
        const newNotification = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            read: false,
            ...notification
        }
        return {
            notifications: [newNotification, ...state.notifications].slice(0, 50) // Keep max 50 notifications
        }
    }),

    dismissNotification: (id) => set((state) => ({
        notifications: state.notifications.filter(n => n.id !== id)
    })),

    markNotificationRead: (id) => set((state) => ({
        notifications: state.notifications.map(n =>
            n.id === id ? { ...n, read: true } : n
        )
    })),

    markAllNotificationsRead: () => set((state) => ({
        notifications: state.notifications.map(n => ({ ...n, read: true }))
    })),

    clearAllNotifications: () => set({ notifications: [] }),

    // Hot Corners actions
    setHotCornerAction: (corner, action) => set((state) => ({
        hotCorners: {
            ...state.hotCorners,
            [corner]: action
        }
    })),
}),
        {
            name: 'macos-settings',
            partialize: (state) => ({
                darkMode: state.darkMode,
                brightness: state.brightness,
                wallpaper: state.wallpaper,
                soundEnabled: state.soundEnabled,
                soundVolume: state.soundVolume,
                trashItems: state.trashItems,
                notifications: state.notifications,
                recentApps: state.recentApps,
                hotCorners: state.hotCorners,
                // Save window positions and sizes (but not open/minimized state)
                windows: state.windows.map(w => ({
                    id: w.id,
                    title: w.title,
                    component: w.component,
                    position: w.position,
                    size: w.size,
                    desktop: w.desktop || 1,
                    // Don't save: isOpen, isMinimised, isMaximized, zIndex
                })),
            }),
        }
    )
)
