# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

macOS simulation web application built with React, Vite, Tailwind CSS, and Framer Motion. Deployed at https://macos-mimic.vercel.app/

## Essential Commands

```bash
# Development
npm run dev          # Start development server (http://localhost:5173)
npm run build        # Build for production
npm run preview      # Preview production build locally
npm run lint         # Run ESLint checks
```

## Core Architecture

### State Management (Zustand)

Central store at `src/store/useStore.js` manages:
- **Windows**: Array of window objects with `{id, title, component, isOpen, isMinimised, isMaximized, zIndex, position, size, desktop}`
- **System State**: `isLogin`, `isLaunchpadOpen`, `isSpotlightOpen`, `isNotificationCenterOpen`, `isMissionControlOpen`
- **UI State**: `wallpaper`, `brightness`, `darkMode`, `desktopIcons[]`
- **Audio State**: `soundEnabled`, `soundVolume`
- **Multi-Desktop**: `desktops[]`, `currentDesktop`
- **Window Focus**: `activeWindowId`, `zIndexCounter` for layering

Key store actions:
- `openWindow(id, title, component)` - Opens or focuses window (with sound effects)
- `closeWindow(id)`, `minimizeWindow(id)`, `maximizeWindow(id)`, `focusWindow(id)` (all with sound effects)
- `updateWindowPosition(id, position)`, `updateWindowSize(id, size)`
- System toggles: `toggleLaunchpad()`, `toggleSpotlight()`, `toggleNotificationCenter()`, `toggleMissionControl()`
- Theme: `toggleDarkMode()`, `setDarkMode(value)`
- Sound: `toggleSoundEffects()`, `setSoundVolume(volume)`
- Multi-desktop: `setCurrentDesktop(id)`, `addDesktop(id)`, `removeDesktop(id)`, `moveWindowToDesktop(windowId, desktopId)`

### Application Flow

1. **Entry**: `BootSequence` → Login screen → Desktop
2. **Desktop Layer Stack** (bottom to top):
   - Desktop background with icons
   - WindowManager (renders all open windows)
   - MenuBar (fixed top)
   - Dock (fixed bottom)
   - System overlays (Launchpad, Spotlight, NotificationCenter)

### Window System

- **Window Component** (`src/components/window/Window.jsx`): Draggable (react-draggable) and resizable (react-resizable) containers
- **WindowManager** (`src/components/window/WindowManager.jsx`): Maps window IDs to app components
- **App Registration**: Apps are imported in WindowManager and mapped by ID

### App Structure

Each app in `src/apps/` follows this pattern:
```jsx
const AppName = () => {
  // Local state for app-specific data
  // Return JSX with app UI
}
```

Apps receive no props - they're self-contained components rendered inside Window containers.

### Design System

- **Glassmorphism**: `bg-white/20 backdrop-blur-md` pattern throughout
- **Custom Tailwind Colors**:
  - `mac-bg`: '#f5f5f7'
  - `mac-window`: 'rgba(255, 255, 255, 0.85)'
  - `mac-dock`: 'rgba(255, 255, 255, 0.2)'
- **Animations**: Framer Motion for dock magnification, window transitions, system panels

### Key Component Relationships

```
App.jsx
  └── Desktop.jsx
      ├── MenuBar.jsx (system controls, clock, menus)
      ├── DesktopIcon.jsx (draggable icons)
      ├── WindowManager.jsx
      │   └── Window.jsx (wraps each app)
      │       └── [App Components] (Finder, Safari, etc.)
      ├── Dock.jsx (app launcher with magnification)
      ├── Launchpad.jsx (full-screen app grid)
      ├── Spotlight.jsx (Cmd+K search)
      ├── NotificationCenter.jsx (slide-in panel)
      └── ContextMenu.jsx (right-click menu)
```

## Adding New Applications

1. Create component in `src/apps/YourApp.jsx`
2. Import in `src/components/window/WindowManager.jsx`
3. Add to component mapping:
   ```jsx
   const components = {
     'your-app': YourApp,
     // ...
   }
   ```
4. Add dock icon in `src/components/dock/Dock.jsx`:
   ```jsx
   apps array: { id: 'your-app', name: 'Your App', icon: IconComponent }
   ```
5. Add to Launchpad in `src/components/system/Launchpad.jsx`
6. Add to Spotlight search in `src/components/system/Spotlight.jsx`

## Data Persistence

- **Notes App**: Uses localStorage with key 'notes-data'
- **Desktop Icons**: Positions stored in Zustand store (not persisted)
- **Window State**: Ephemeral, resets on page reload

## Development Patterns

- **Window Opening**: Always use `openWindow(id, title, component)` from store
- **Draggable Elements**: Use react-draggable with bounds="parent"
- **Glassmorphic UI**: Combine `bg-white/[opacity]` with `backdrop-blur-[size]`
- **Responsive Animations**: Use Framer Motion's spring animations
- **Icon System**: React Icons library (FaIcon, FiIcon patterns)
- **Responsive Design**: Tailwind breakpoints `sm:` (640px), `md:` (768px), `lg:` (1024px)

## New Features (2024)

### 1. Dark Mode Support
- **Location**: Global state in `src/store/useStore.js`
- **Toggle**: Settings app → Appearance → Dark Mode switch
- **Implementation**: All components support dark mode with conditional Tailwind classes
- **Components Updated**:
  - Desktop overlay (darker in dark mode)
  - MenuBar, Dock, Window components
  - Launchpad, Spotlight, NotificationCenter, MissionControl
  - All apps respect dark mode state

### 2. System Sound Effects
- **Location**: `src/utils/soundEffects.js`
- **Technology**: Web Audio API for generated sound effects
- **Sound Events**:
  - Window open/close/minimize/maximize
  - Launchpad open/close
  - Spotlight open
  - Notification alerts
  - Desktop switching
  - Error feedback
- **Controls**: Settings app → Sound
  - Toggle sound effects on/off
  - Volume slider (0-100%)
- **Integration**: Sounds trigger automatically via store actions

### 3. Multi-Desktop (Mission Control)
- **Trigger**: F3 key or Mission Control icon in MenuBar
- **Features**:
  - Create unlimited virtual desktops
  - Drag windows between desktops
  - Delete desktops (windows move to Desktop 1)
  - Visual desktop thumbnails
  - Window previews per desktop
- **State**: Windows track desktop ID; filtering by `currentDesktop`

### 4. Mobile Responsive Design
- **Breakpoints**:
  - Mobile: < 640px
  - Tablet: 640px - 768px
  - Desktop: > 768px
- **Optimizations**:
  - **MenuBar**: Smaller height, condensed spacing, hidden menu items on mobile
  - **Dock**: Smaller icons (32px → 56px on mobile), touch-friendly spacing
  - **Launchpad**: Responsive grid (3 cols mobile, 5 tablet, 7 desktop)
  - **Spotlight**: Full-width on mobile with padding
  - **Windows**: Auto-sized for screen (max-width - 20px on mobile)
  - **Mission Control**: Horizontal scroll on mobile, smaller thumbnails
  - **NotificationCenter**: Full-width on mobile
- **Touch Support**: Added touch event handlers to Dock magnification

## Performance Considerations

- **Window Animations**: Disabled during drag operations to maintain 60fps
- **Sound Effects**: Initialized lazily on first user interaction
- **Mobile Detection**: Checked at runtime with `window.innerWidth < 768`
- **HMR**: Hot module replacement works for all components