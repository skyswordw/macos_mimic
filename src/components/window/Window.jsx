import React, { useRef } from 'react'
import Draggable from 'react-draggable'
import { ResizableBox } from 'react-resizable'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../../store/useStore'
import { FaTimes, FaMinus, FaExpand } from 'react-icons/fa'
// import 'react-resizable/css/styles.css'

const Window = ({ window, children }) => {
    const { closeWindow, minimizeWindow, maximizeWindow, focusWindow, updateWindowPosition, updateWindowSize } = useStore()
    const nodeRef = useRef(null)

    const handleDrag = (e, data) => {
        updateWindowPosition(window.id, { x: data.x, y: data.y })
    }

    const handleResize = (e, { size }) => {
        updateWindowSize(window.id, { width: size.width, height: size.height })
    }

    if (window.isMinimised) return null

    return (
        <Draggable
            handle=".window-header"
            defaultPosition={window.position}
            position={window.isMaximized ? { x: 0, y: 0 } : window.position}
            onStop={handleDrag}
            nodeRef={nodeRef}
            disabled={window.isMaximized}
        >
            <div
                ref={nodeRef}
                className={`absolute flex flex-col bg-mac-window backdrop-blur-xl rounded-xl shadow-2xl border border-white/20 overflow-hidden transition-shadow duration-200 ${window.isMaximized ? 'w-full h-full !top-0 !left-0 !transform-none rounded-none' : ''}`}
                style={{
                    width: window.isMaximized ? '100%' : window.size.width,
                    height: window.isMaximized ? '100%' : window.size.height,
                    zIndex: window.zIndex
                }}
                onMouseDown={() => focusWindow(window.id)}
            >
                {/* Window Header */}
                <div className="window-header h-10 bg-gray-200/50 border-b border-gray-300/50 flex items-center px-4 justify-between cursor-default select-none">
                    <div className="flex gap-2 group">
                        <div
                            onClick={(e) => { e.stopPropagation(); closeWindow(window.id) }}
                            className="w-3 h-3 rounded-full bg-red-500 flex items-center justify-center cursor-pointer hover:bg-red-600"
                        >
                            <FaTimes className="text-[8px] text-black/50 opacity-0 group-hover:opacity-100" />
                        </div>
                        <div
                            onClick={(e) => { e.stopPropagation(); minimizeWindow(window.id) }}
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
                    <div className="text-sm font-medium text-gray-600">{window.title}</div>
                    <div className="w-14"></div> {/* Spacer for centering title */}
                </div>

                {/* Window Content */}
                <div className="flex-1 overflow-auto relative bg-white/50">
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
            </div>
        </Draggable>
    )
}

export default Window
