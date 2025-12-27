import React, { createContext, useContext, useState, useCallback } from 'react'

const DragDropContext = createContext(null)

export const DragDropProvider = ({ children }) => {
    const [dragData, setDragData] = useState(null)
    const [isDragging, setIsDragging] = useState(false)
    const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 })
    const [dropTargets, setDropTargets] = useState([])

    const startDrag = useCallback((data, position) => {
        setDragData(data)
        setIsDragging(true)
        setDragPosition(position)
    }, [])

    const updateDragPosition = useCallback((position) => {
        setDragPosition(position)
    }, [])

    const endDrag = useCallback(() => {
        setDragData(null)
        setIsDragging(false)
        setDropTargets([])
    }, [])

    const registerDropTarget = useCallback((id, bounds, onDrop, accepts) => {
        setDropTargets(prev => {
            const existing = prev.find(t => t.id === id)
            if (existing) {
                return prev.map(t => t.id === id ? { id, bounds, onDrop, accepts } : t)
            }
            return [...prev, { id, bounds, onDrop, accepts }]
        })
    }, [])

    const unregisterDropTarget = useCallback((id) => {
        setDropTargets(prev => prev.filter(t => t.id !== id))
    }, [])

    const getActiveDropTarget = useCallback(() => {
        if (!isDragging || !dragData) return null

        for (const target of dropTargets) {
            const { bounds, accepts } = target
            if (
                dragPosition.x >= bounds.left &&
                dragPosition.x <= bounds.right &&
                dragPosition.y >= bounds.top &&
                dragPosition.y <= bounds.bottom
            ) {
                if (!accepts || accepts.includes(dragData.type)) {
                    return target
                }
            }
        }
        return null
    }, [isDragging, dragData, dragPosition, dropTargets])

    const executeDrop = useCallback(() => {
        const target = getActiveDropTarget()
        if (target && dragData) {
            target.onDrop(dragData)
        }
        endDrag()
    }, [getActiveDropTarget, dragData, endDrag])

    return (
        <DragDropContext.Provider value={{
            dragData,
            isDragging,
            dragPosition,
            startDrag,
            updateDragPosition,
            endDrag,
            registerDropTarget,
            unregisterDropTarget,
            getActiveDropTarget,
            executeDrop
        }}>
            {children}
            {/* Global drag overlay */}
            {isDragging && dragData && (
                <div
                    className="fixed pointer-events-none z-[9999]"
                    style={{
                        left: dragPosition.x - 30,
                        top: dragPosition.y - 30,
                    }}
                >
                    <div className="w-16 h-16 bg-blue-500/30 backdrop-blur-md rounded-xl border-2 border-blue-400 flex items-center justify-center shadow-2xl">
                        <div className="text-white text-xs text-center px-1 truncate max-w-14">
                            {dragData.name || dragData.type}
                        </div>
                    </div>
                </div>
            )}
        </DragDropContext.Provider>
    )
}

export const useDragDrop = () => {
    const context = useContext(DragDropContext)
    if (!context) {
        throw new Error('useDragDrop must be used within a DragDropProvider')
    }
    return context
}

// Hook for making an element draggable
export const useDraggable = (data) => {
    const { startDrag, updateDragPosition, executeDrop, isDragging, dragData } = useDragDrop()

    const handleMouseDown = useCallback((e) => {
        e.preventDefault()
        const position = { x: e.clientX, y: e.clientY }
        startDrag(data, position)

        const handleMouseMove = (e) => {
            updateDragPosition({ x: e.clientX, y: e.clientY })
        }

        const handleMouseUp = () => {
            executeDrop()
            document.removeEventListener('mousemove', handleMouseMove)
            document.removeEventListener('mouseup', handleMouseUp)
        }

        document.addEventListener('mousemove', handleMouseMove)
        document.addEventListener('mouseup', handleMouseUp)
    }, [data, startDrag, updateDragPosition, executeDrop])

    const isBeingDragged = isDragging && dragData?.id === data.id

    return {
        dragHandlers: {
            onMouseDown: handleMouseDown,
        },
        isBeingDragged,
    }
}

// Hook for making an element a drop target
export const useDropTarget = (id, onDrop, accepts = null) => {
    const { registerDropTarget, unregisterDropTarget, getActiveDropTarget, isDragging } = useDragDrop()
    const ref = React.useRef(null)

    React.useEffect(() => {
        if (ref.current) {
            const updateBounds = () => {
                const rect = ref.current.getBoundingClientRect()
                registerDropTarget(id, rect, onDrop, accepts)
            }
            updateBounds()
            window.addEventListener('resize', updateBounds)
            return () => {
                unregisterDropTarget(id)
                window.removeEventListener('resize', updateBounds)
            }
        }
    }, [id, onDrop, accepts, registerDropTarget, unregisterDropTarget])

    const activeTarget = getActiveDropTarget()
    const isOver = isDragging && activeTarget?.id === id

    return {
        ref,
        isOver,
    }
}

export default DragDropContext
