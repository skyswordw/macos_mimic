import React, { useRef, useState, useCallback } from 'react'
import Draggable from 'react-draggable'
import { motion } from 'framer-motion'
import { useStore } from '../../store/useStore'
import { FaTimes, FaMinus, FaExpand } from 'react-icons/fa'

const MIN_WIDTH = 300
const MIN_HEIGHT = 200

const Window = ({ window, children }) => {
    const { closeWindow, minimizeWindow, maximizeWindow, focusWindow, updateWindowPosition, updateWindowSize, darkMode } = useStore()
    const nodeRef = useRef(null)
    const [isMinimizing, setIsMinimizing] = useState(false)
    const [dockIconPosition, setDockIconPosition] = useState(null)
    const [isResizing, setIsResizing] = useState(false)
    const resizeRef = useRef({ startX: 0, startY: 0, startWidth: 0, startHeight: 0, startPosX: 0, startPosY: 0, direction: '' })

    const handleDrag = (e, data) => {
        updateWindowPosition(window.id, { x: data.x, y: data.y })
    }

    const handleMinimize = () => {
        const dockIcon = document.querySelector(`[data-dock-id="${window.id}"]`)
        if (dockIcon) {
            const rect = dockIcon.getBoundingClientRect()
            setDockIconPosition({
                x: rect.left + rect.width / 2,
                y: rect.top + rect.height / 2
            })
        }

        setIsMinimizing(true)
        setTimeout(() => {
            minimizeWindow(window.id)
            setIsMinimizing(false)
        }, 400)
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

    if (window.isMinimised && !isMinimizing) return null

    const windowVariants = {
        initial: {
            scale: 0.5,
            opacity: 0,
            y: 50
        },
        animate: {
            scale: 1,
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                damping: 25,
                stiffness: 500,
                duration: 0.3
            }
        },
        minimize: dockIconPosition ? {
            scale: 0,
            opacity: 0,
            x: dockIconPosition.x - window.position.x - window.size.width / 2,
            y: dockIconPosition.y - window.position.y - window.size.height / 2,
            transition: {
                type: "spring",
                damping: 20,
                stiffness: 300,
                duration: 0.4
            }
        } : {
            scale: 0.8,
            opacity: 0,
            y: 100,
            transition: {
                duration: 0.3
            }
        }
    }

    const ResizeHandle = ({ direction, className, cursor }) => (
        <div
            className={`absolute ${className} z-50 ${isResizing ? '' : 'hover:bg-blue-500/20'}`}
            style={{ cursor }}
            onMouseDown={(e) => handleResizeStart(e, direction)}
        />
    )

    return (
        <Draggable
            handle=".window-header"
            position={window.isMaximized ? { x: 0, y: 0 } : window.position}
            onStop={handleDrag}
            nodeRef={nodeRef}
            disabled={window.isMaximized || isMinimizing || isResizing}
        >
            <motion.div
                ref={nodeRef}
                className={`absolute flex flex-col backdrop-blur-xl rounded-xl shadow-2xl border overflow-hidden transition-colors duration-500 ${
                    darkMode
                        ? 'bg-gray-800/90 border-gray-600/50'
                        : 'bg-mac-window border-white/20'
                } ${window.isMaximized ? 'w-full h-full !top-0 !left-0 !transform-none rounded-none' : ''}`}
                style={{
                    width: window.isMaximized ? '100%' : window.size.width,
                    height: window.isMaximized ? '100%' : window.size.height,
                    zIndex: window.zIndex
                }}
                onMouseDown={() => focusWindow(window.id)}
                initial={false}
                animate={isMinimizing ? "minimize" : undefined}
                variants={isMinimizing ? windowVariants : undefined}
            >
                {/* Window Header */}
                <div className={`window-header h-10 border-b flex items-center px-4 justify-between cursor-default select-none transition-colors duration-500 ${
                    darkMode
                        ? 'bg-gray-700/50 border-gray-600/50'
                        : 'bg-gray-200/50 border-gray-300/50'
                }`}>
                    <div className="flex gap-2 group">
                        <div
                            onClick={(e) => { e.stopPropagation(); closeWindow(window.id) }}
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
    )
}

export default Window
