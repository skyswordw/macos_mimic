# macOS Simulation Walkthrough

I have successfully built a realistic macOS simulation using React, Tailwind CSS, and Framer Motion.

## Features Implemented

### 1. Desktop Environment
- **Background**: High-quality macOS Monterey wallpaper.
- **Menu Bar**: Functional clock, battery, and wifi indicators.
- **Dock**: Animated dock with magnification effect on hover.

### 2. Window Management
- **Draggable**: Windows can be moved around the desktop.
- **Resizable**: Windows can be resized from the bottom-right corner.
- **Controls**: Minimize, Maximize, and Close buttons work as expected.
- **Z-Index**: Clicking a window brings it to the front.
- **Minimization**: Windows animate to/from the dock (logic implemented, animation is instant for now).

### 3. Applications
- **Finder**: Mock file system interface.
- **Safari**: Browser simulation with address bar and iframe.
- **Calculator**: Fully functional calculator with macOS styling.
- **VS Code**: Placeholder in Dock.

## How to Run

1. Open the terminal.
2. Run `npm run dev`.
3. Open the provided localhost URL in your browser.

## Verification Results
- **Build**: Passed.
- **Lint**: Passed (CSS lints are false positives).
- **Functionality**: Verified core interactions (Drag, Resize, Open/Close apps).
