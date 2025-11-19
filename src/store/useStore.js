import { create } from 'zustand'

export const useStore = create((set) => ({
    windows: [], // { id, title, component, isOpen, isMinimised, isMaximized, zIndex, position, size }
    activeWindowId: null,
    zIndexCounter: 10,

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
}))
