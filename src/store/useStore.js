import { create } from 'zustand'

export const useStore = create((set) => ({
    windows: [], // { id, title, component, isOpen, isMinimised, isMaximized, zIndex, position, size }
    activeWindowId: null,
    zIndexCounter: 10,
    wallpaper: 'https://4kwallpapers.com/images/wallpapers/macos-monterey-stock-purple-dark-mode-layers-5k-4480x2520-5888.jpg',
    isLogin: false,
    isLaunchpadOpen: false,
    isSpotlightOpen: false,
    isNotificationCenterOpen: false,
    brightness: 100,
    desktopIcons: [
        { id: 'hd', label: 'Macintosh HD', icon: 'hdd', position: { x: 20, y: 20 } },
        { id: 'readme', label: 'Readme.txt', icon: 'file', position: { x: 20, y: 120 } }
    ],

    setLogin: (status) => set({ isLogin: status }),
    toggleLaunchpad: () => set((state) => ({ isLaunchpadOpen: !state.isLaunchpadOpen })),
    toggleSpotlight: () => set((state) => ({ isSpotlightOpen: !state.isSpotlightOpen })),
    toggleNotificationCenter: () => set((state) => ({ isNotificationCenterOpen: !state.isNotificationCenterOpen })),
    setBrightness: (val) => set({ brightness: val }),
    setWallpaper: (url) => set({ wallpaper: url }),

    openWindow: (id, title, component) => set((state) => {
        const existingWindow = state.windows.find(w => w.id === id);
        if (existingWindow) {
            return {
                windows: state.windows.map(w => w.id === id ? { ...w, isOpen: true, isMinimised: false, zIndex: state.zIndexCounter + 1 } : w),
                activeWindowId: id,
                zIndexCounter: state.zIndexCounter + 1
            };
        }
        return {
            windows: [...state.windows, {
                id,
                title,
                component,
                isOpen: true,
                isMinimised: false,
                isMaximized: false,
                zIndex: state.zIndexCounter + 1,
                position: { x: 100 + (state.windows.length * 20), y: 50 + (state.windows.length * 20) },
                size: { width: 800, height: 600 }
            }],
            activeWindowId: id,
            zIndexCounter: state.zIndexCounter + 1
        };
    }),

    closeWindow: (id) => set((state) => ({
        windows: state.windows.map(w => w.id === id ? { ...w, isOpen: false } : w),
        activeWindowId: null // Logic to focus next window could be added here
    })),

    minimizeWindow: (id) => set((state) => ({
        windows: state.windows.map(w => w.id === id ? { ...w, isMinimised: true } : w),
        activeWindowId: null
    })),

    maximizeWindow: (id) => set((state) => ({
        windows: state.windows.map(w => w.id === id ? { ...w, isMaximized: !w.isMaximized } : w),
        activeWindowId: id,
        zIndexCounter: state.zIndexCounter + 1
    })),

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
