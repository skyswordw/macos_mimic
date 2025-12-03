import React, { useRef, useState, useCallback, useEffect } from 'react'
import Draggable from 'react-draggable'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../../store/useStore'
import { FaTimes, FaMinus, FaExpand } from 'react-icons/fa'

const MIN_WIDTH = 300
const MIN_HEIGHT = 200
const SNAP_THRESHOLD = 20 // pixels from edge to trigger snap

// Snap zone types
const SNAP_ZONES = {
    LEFT: 'left',
    RIGHT: 'right',
    TOP: 'top',
    TOP_LEFT: 'top-left',
    TOP_RIGHT: 'top-right',
    BOTTOM_LEFT: 'bottom-left',
    BOTTOM_RIGHT: 'bottom-right',
    MAXIMIZE: 'maximize'
}

const Window = ({ window, children }) => {
    const { closeWindow, minimizeWindow, maximizeWindow, focusWindow, updateWindowPosition, updateWindowSize, darkMode } = useStore()
    const nodeRef = useRef(null)
    const [isMinimizing, setIsMinimizing] = useState(false)
    const [isClosing, setIsClosing] = useState(false)
    const [isRestoring, setIsRestoring] = useState(false)
    const [dockIconPosition, setDockIconPosition] = useState(null)
    const [isResizing, setIsResizing] = useState(false)
    const [isDragging, setIsDragging] = useState(false)
    const [snapZone, setSnapZone] = useState(null)
    const [preSnapState, setPreSnapState] = useState(null)
    const [isSnapped, setIsSnapped] = useState(false)
    const resizeRef = useRef({ startX: 0, startY: 0, startWidth: 0, startHeight: 0, startPosX: 0, startPosY: 0, direction: '' })

    // Detect snap zone based on mouse position
    const detectSnapZone = useCallback((mouseX, mouseY) => {
        const screenWidth = globalThis.innerWidth
        const screenHeight = globalThis.innerHeight
        const menuBarHeight = 28
        const dockHeight = 80

        const effectiveTop = menuBarHeight
        const effectiveBottom = screenHeight - dockHeight

        // Check corners first (20x20 pixel zones)
        const cornerSize = 40

        // Top-left corner
        if (mouseX < cornerSize && mouseY < effectiveTop + cornerSize) {
            return SNAP_ZONES.TOP_LEFT
        }
        // Top-right corner
        if (mouseX > screenWidth - cornerSize && mouseY < effectiveTop + cornerSize) {
            return SNAP_ZONES.TOP_RIGHT
        }
        // Bottom-left corner
        if (mouseX < cornerSize && mouseY > effectiveBottom - cornerSize) {
            return SNAP_ZONES.BOTTOM_LEFT
        }
        // Bottom-right corner
        if (mouseX > screenWidth - cornerSize && mouseY > effectiveBottom - cornerSize) {
            return SNAP_ZONES.BOTTOM_RIGHT
        }

        // Check edges
        // Top edge - maximize
        if (mouseY < effectiveTop + SNAP_THRESHOLD) {
            return SNAP_ZONES.MAXIMIZE
        }
        // Left edge
        if (mouseX < SNAP_THRESHOLD) {
            return SNAP_ZONES.LEFT
        }
        // Right edge
        if (mouseX > screenWidth - SNAP_THRESHOLD) {
            return SNAP_ZONES.RIGHT
        }

        return null
    }, [])

    // Get snap dimensions
    const getSnapDimensions = useCallback((zone) => {
        const screenWidth = globalThis.innerWidth
        const screenHeight = globalThis.innerHeight
        const menuBarHeight = 28
        const dockHeight = 80
        const effectiveHeight = screenHeight - menuBarHeight - dockHeight

        switch (zone) {
            case SNAP_ZONES.LEFT:
                return { x: 0, y: menuBarHeight, width: screenWidth / 2, height: effectiveHeight }
            case SNAP_ZONES.RIGHT:
                return { x: screenWidth / 2, y: menuBarHeight, width: screenWidth / 2, height: effectiveHeight }
            case SNAP_ZONES.TOP:
                return { x: 0, y: menuBarHeight, width: screenWidth, height: effectiveHeight / 2 }
            case SNAP_ZONES.TOP_LEFT:
                return { x: 0, y: menuBarHeight, width: screenWidth / 2, height: effectiveHeight / 2 }
            case SNAP_ZONES.TOP_RIGHT:
                return { x: screenWidth / 2, y: menuBarHeight, width: screenWidth / 2, height: effectiveHeight / 2 }
            case SNAP_ZONES.BOTTOM_LEFT:
                return { x: 0, y: menuBarHeight + effectiveHeight / 2, width: screenWidth / 2, height: effectiveHeight / 2 }
            case SNAP_ZONES.BOTTOM_RIGHT:
                return { x: screenWidth / 2, y: menuBarHeight + effectiveHeight / 2, width: screenWidth / 2, height: effectiveHeight / 2 }
            case SNAP_ZONES.MAXIMIZE:
                return { x: 0, y: menuBarHeight, width: screenWidth, height: effectiveHeight }
            default:
                return null
        }
    }, [])

    const handleDragStart = useCallback(() => {
        setIsDragging(true)
        // Save current state if not already snapped
        if (!isSnapped) {
            setPreSnapState({
                position: { ...window.position },
                size: { ...window.size }
            })
        }
    }, [isSnapped, window.position, window.size])

    const handleDrag = useCallback((e, data) => {
        updateWindowPosition(window.id, { x: data.x, y: data.y })

        // Detect snap zone during drag
        const zone = detectSnapZone(e.clientX, e.clientY)
        setSnapZone(zone)
    }, [window.id, updateWindowPosition, detectSnapZone])

    const handleDragStop = useCallback((e, data) => {
        setIsDragging(false)

        if (snapZone) {
            const snapDims = getSnapDimensions(snapZone)
            if (snapDims) {
                updateWindowPosition(window.id, { x: snapDims.x, y: snapDims.y })
                updateWindowSize(window.id, { width: snapDims.width, height: snapDims.height })
                setIsSnapped(true)
            }
        } else {
            // If unsnapping, restore original size
            if (isSnapped && preSnapState) {
                updateWindowSize(window.id, preSnapState.size)
                setIsSnapped(false)
            }
        }

        setSnapZone(null)
    }, [snapZone, getSnapDimensions, window.id, updateWindowPosition, updateWindowSize, isSnapped, preSnapState])

    const handleMinimize = () => {
        const dockIcon = document.querySelector(`[data-dock-id="${window.id}"]`)
        if (dockIcon) {
            const rect = dockIcon.getBoundingClientRect()
            setDockIconPosition({
                x: rect.left + rect.width / 2,
                y: rect.top + rect.height / 2
            })
        } else {
            // Fallback: aim for center bottom of screen (dock area)
            setDockIconPosition({
                x: globalThis.innerWidth / 2,
                y: globalThis.innerHeight - 40
            })
        }

        setIsMinimizing(true)
        setTimeout(() => {
            minimizeWindow(window.id)
            setIsMinimizing(false)
            setDockIconPosition(null)
        }, 500)
    }

    const handleClose = () => {
        setIsClosing(true)
        setTimeout(() => {
            closeWindow(window.id)
            setIsClosing(false)
        }, 300)
    }

    const handleResizeStart = useCallback((e, direction) => {
        e.preventDefault()
        e.stopPropagation()
        setIsResizing(true)

        resizeRef.current = {
            startX: e.clientX,
            startY: e.clientY,
            startWidth: window.size.width,
            startHeight: window.size.height,
            startPosX: window.position.x,
            startPosY: window.position.y,
            direction
        }

        const handleMouseMove = (moveEvent) => {
            const { startX, startY, startWidth, startHeight, startPosX, startPosY, direction } = resizeRef.current
            const deltaX = moveEvent.clientX - startX
            const deltaY = moveEvent.clientY - startY

            let newWidth = startWidth
            let newHeight = startHeight
            let newPosX = startPosX
            let newPosY = startPosY

            // Handle horizontal resizing
            if (direction.includes('e')) {
                newWidth = Math.max(MIN_WIDTH, startWidth + deltaX)
            }
            if (direction.includes('w')) {
                const widthDelta = Math.min(deltaX, startWidth - MIN_WIDTH)
                newWidth = startWidth - widthDelta
                newPosX = startPosX + widthDelta
            }

            // Handle vertical resizing
            if (direction.includes('s')) {
                newHeight = Math.max(MIN_HEIGHT, startHeight + deltaY)
            }
            if (direction.includes('n')) {
                const heightDelta = Math.min(deltaY, startHeight - MIN_HEIGHT)
                newHeight = startHeight - heightDelta
                newPosY = startPosY + heightDelta
            }

            updateWindowSize(window.id, { width: newWidth, height: newHeight })
            if (newPosX !== startPosX || newPosY !== startPosY) {
                updateWindowPosition(window.id, { x: newPosX, y: newPosY })
            }
        }

        const handleMouseUp = () => {
            setIsResizing(false)
            document.removeEventListener('mousemove', handleMouseMove)
            document.removeEventListener('mouseup', handleMouseUp)
        }

        document.addEventListener('mousemove', handleMouseMove)
        document.addEventListener('mouseup', handleMouseUp)
    }, [window.id, window.size, window.position, updateWindowSize, updateWindowPosition])

    if (window.isMinimised && !isMinimizing && !isRestoring) return null
    if (!window.isOpen && !isClosing) return null

    // Calculate genie effect parameters
    const genieTargetX = dockIconPosition ? dockIconPosition.x - window.position.x - window.size.width / 2 : 0
    const genieTargetY = dockIconPosition ? dockIconPosition.y - window.position.y - window.size.height / 2 : globalThis.innerHeight - window.position.y

    const windowVariants = {
        initial: {
            scale: 0.8,
            opacity: 0,
            y: 20,
            filter: "blur(10px)",
            transformOrigin: "center center"
        },
        animate: {
            scale: 1,
            opacity: 1,
            filter: "blur(0px)",
            scaleX: 1,
            scaleY: 1,
            transformOrigin: "center center",
            transition: {
                type: "spring",
                damping: 25,
                stiffness: 400,
                duration: 0.35,
                filter: { duration: 0.2 }
            }
        },
        minimize: {
            scale: 0.15,
            scaleX: 0.3,
            opacity: 0,
            x: genieTargetX,
            y: genieTargetY,
            filter: "blur(8px)",
            transformOrigin: "bottom center",
            transition: {
                type: "tween",
                ease: [0.4, 0, 0.2, 1],
                duration: 0.5,
                x: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
                y: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
                scale: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
                scaleX: { duration: 0.35, ease: [0.4, 0, 0.2, 1] },
                opacity: { duration: 0.4, ease: "easeOut" },
                filter: { duration: 0.3 }
            }
        },
        close: {
            scale: 0.85,
            opacity: 0,
            filter: "blur(6px)",
            transition: {
                type: "tween",
                ease: [0.4, 0, 1, 1],
                duration: 0.25,
                opacity: { duration: 0.2 }
            }
        }
    }

    // Determine current animation state
    const getAnimationState = () => {
        if (isClosing) return "close"
        if (isMinimizing) return "minimize"
        return "animate"
    }

    const ResizeHandle = ({ direction, className, cursor }) => (
        <div
            className={`absolute ${className} z-50 ${isResizing ? '' : 'hover:bg-blue-500/20'}`}
            style={{ cursor }}
            onMouseDown={(e) => handleResizeStart(e, direction)}
        />
    )

    // Snap zone preview component
    const SnapZonePreview = () => {
        if (!isDragging || !snapZone) return null

        const dims = getSnapDimensions(snapZone)
        if (!dims) return null

        return (
            <motion.div
                className="fixed pointer-events-none z-[9999]"
                style={{
                    left: dims.x,
                    top: dims.y,
                    width: dims.width,
                    height: dims.height
                }}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.15 }}
            >
                <div className={`w-full h-full rounded-lg border-2 border-dashed ${
                    darkMode
                        ? 'bg-blue-500/20 border-blue-400/60'
                        : 'bg-blue-500/20 border-blue-500/60'
                }`} />
            </motion.div>
        )
    }

    return (
        <>
            {/* Snap zone preview - rendered outside the draggable */}
            <AnimatePresence>
                <SnapZonePreview />
            </AnimatePresence>

            <Draggable
                handle=".window-header"
                position={window.isMaximized ? { x: 0, y: 0 } : window.position}
                onStart={handleDragStart}
                onDrag={handleDrag}
                onStop={handleDragStop}
                nodeRef={nodeRef}
                disabled={window.isMaximized || isMinimizing || isResizing}
            >
            <motion.div
                ref={nodeRef}
                className={`absolute flex flex-col backdrop-blur-xl rounded-xl border overflow-hidden transition-all duration-500 ${
                    darkMode
                        ? 'bg-gray-800/90 border-gray-600/50'
                        : 'bg-mac-window border-white/20'
                } ${window.isMaximized ? 'w-full h-full !top-0 !left-0 !transform-none rounded-none' : ''}`}
                style={{
                    width: window.isMaximized ? '100%' : window.size.width,
                    height: window.isMaximized ? '100%' : window.size.height,
                    zIndex: window.zIndex,
                    boxShadow: darkMode
                        ? '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.05)'
                        : '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 10px 25px -5px rgba(0, 0, 0, 0.1)'
                }}
                onMouseDown={() => focusWindow(window.id)}
                initial="initial"
                animate={getAnimationState()}
                variants={windowVariants}
            >
                {/* Window Header */}
                <div
                    className={`window-header h-10 border-b flex items-center px-4 justify-between cursor-default select-none transition-colors duration-500 ${
                        darkMode
                            ? 'bg-gray-700/50 border-gray-600/50'
                            : 'bg-gray-200/50 border-gray-300/50'
                    }`}
                    onDoubleClick={() => maximizeWindow(window.id)}
                >
                    <div className="flex gap-2 group">
                        <div
                            onClick={(e) => { e.stopPropagation(); handleClose() }}
                            className="w-3 h-3 rounded-full bg-red-500 flex items-center justify-center cursor-pointer hover:bg-red-600"
                        >
                            <FaTimes className="text-[8px] text-black/50 opacity-0 group-hover:opacity-100" />
                        </div>
                        <div
                            onClick={(e) => { e.stopPropagation(); handleMinimize() }}
                            className="w-3 h-3 rounded-full bg-yellow-500 flex items-center justify-center cursor-pointer hover:bg-yellow-600"
                        >
                            <FaMinus className="text-[8px] text-black/50 opacity-0 group-hover:opacity-100" />
                        </div>
                        <div
                            onClick={(e) => { e.stopPropagation(); maximizeWindow(window.id) }}
                            className="w-3 h-3 rounded-full bg-green-500 flex items-center justify-center cursor-pointer hover:bg-green-600"
                        >
                            <FaExpand className="text-[8px] text-black/50 opacity-0 group-hover:opacity-100" />
                        </div>
                    </div>
                    <div className={`text-sm font-medium transition-colors duration-500 ${darkMode ? 'text-gray-200' : 'text-gray-600'}`}>
                        {window.title}
                    </div>
                    <div className="w-14"></div>
                </div>

                {/* Window Content */}
                <div className={`flex-1 overflow-hidden relative transition-colors duration-500 ${darkMode ? 'bg-gray-800/50' : 'bg-white/50'}`}>
                    <div className="h-full w-full overflow-auto">
                        {children}
                    </div>
                </div>

                {/* Resize Handles (only if not maximized) */}
                {!window.isMaximized && (
                    <>
                        {/* Edge handles */}
                        <ResizeHandle direction="n" className="top-0 left-2 right-2 h-1" cursor="ns-resize" />
                        <ResizeHandle direction="s" className="bottom-0 left-2 right-2 h-1" cursor="ns-resize" />
                        <ResizeHandle direction="w" className="left-0 top-2 bottom-2 w-1" cursor="ew-resize" />
                        <ResizeHandle direction="e" className="right-0 top-2 bottom-2 w-1" cursor="ew-resize" />

                        {/* Corner handles */}
                        <ResizeHandle direction="nw" className="top-0 left-0 w-3 h-3" cursor="nwse-resize" />
                        <ResizeHandle direction="ne" className="top-0 right-0 w-3 h-3" cursor="nesw-resize" />
                        <ResizeHandle direction="sw" className="bottom-0 left-0 w-3 h-3" cursor="nesw-resize" />
                        <ResizeHandle direction="se" className="bottom-0 right-0 w-3 h-3" cursor="nwse-resize" />
                    </>
                )}
            </motion.div>
        </Draggable>
        </>
    )
}

export default Window
