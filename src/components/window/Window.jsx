import React, { useRef, useEffect, useState } from 'react'
import Draggable from 'react-draggable'
import { ResizableBox } from 'react-resizable'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../../store/useStore'
import { FaTimes, FaMinus, FaExpand } from 'react-icons/fa'
// import 'react-resizable/css/styles.css'

const Window = ({ window, children }) => {
    const { closeWindow, minimizeWindow, maximizeWindow, focusWindow, updateWindowPosition, updateWindowSize, darkMode } = useStore()
    const nodeRef = useRef(null)
    const [isMinimizing, setIsMinimizing] = useState(false)
    const [dockIconPosition, setDockIconPosition] = useState(null)

    const handleDrag = (e, data) => {
        updateWindowPosition(window.id, { x: data.x, y: data.y })
    }

    const handleResize = (e, { size }) => {
        updateWindowSize(window.id, { width: size.width, height: size.height })
    }

    const handleMinimize = () => {
        // 获取对应 Dock 图标的位置
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
        }, 400) // 动画持续时间
    }

    if (window.isMinimised && !isMinimizing) return null

    // 动画变体
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

    return (
        <Draggable
            handle=".window-header"
            position={window.isMaximized ? { x: 0, y: 0 } : window.position}
            onStop={handleDrag}
            nodeRef={nodeRef}
            disabled={window.isMaximized || isMinimizing}
        >
            <motion.div
                ref={nodeRef}
                className={`absolute flex flex-col backdrop-blur-xl rounded-xl shadow-2xl border overflow-hidden transition-all duration-500 ${
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
                    <div className={`text-sm font-medium transition-colors duration-500 ${darkMode ? 'text-gray-200' : 'text-gray-600'}`}>{window.title}</div>
                    <div className="w-14"></div> {/* Spacer for centering title */}
                </div>

                {/* Window Content */}
                <div className={`flex-1 overflow-auto relative transition-colors duration-500 ${darkMode ? 'bg-gray-800/50' : 'bg-white/50'}`}>
                    {/* Resizable Handle (only if not maximized) */}
                    {!window.isMaximized && (
                        <ResizableBox
                            width={window.size.width}
                            height={window.size.height}
                            minConstraints={[300, 200]}
                            maxConstraints={[1920, 1080]}
                            onResize={handleResize}
                            draggableOpts={{ enableUserSelectHack: false }}
                            className="absolute inset-0 pointer-events-none"
                            handle={<span className="react-resizable-handle react-resizable-handle-se cursor-se-resize absolute bottom-0 right-0 w-4 h-4 pointer-events-auto" />}
                        >
                            <div />
                        </ResizableBox>
                    )}

                    <div className="h-full w-full">
                        {children}
                    </div>
                </div>
            </motion.div>
        </Draggable>
    )
}

export default Window
