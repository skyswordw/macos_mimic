import React, { useEffect, useState } from 'react'
import { useStore } from '../../store/useStore'

const HotCorners = () => {
    const {
        hotCorners,
        toggleLaunchpad,
        toggleMissionControl,
        toggleNotificationCenter,
        setCurrentDesktop,
        desktops
    } = useStore()

    const [activeCorner, setActiveCorner] = useState(null)
    const [triggerTimeout, setTriggerTimeout] = useState(null)

    useEffect(() => {
        const handleMouseMove = (e) => {
            const { clientX, clientY, target } = e
            const { innerWidth, innerHeight } = window

            // Corner detection zones (10px threshold)
            const threshold = 10
            let corner = null

            if (clientX <= threshold && clientY <= threshold) {
                corner = 'topLeft'
            } else if (clientX >= innerWidth - threshold && clientY <= threshold) {
                corner = 'topRight'
            } else if (clientX <= threshold && clientY >= innerHeight - threshold) {
                corner = 'bottomLeft'
            } else if (clientX >= innerWidth - threshold && clientY >= innerHeight - threshold) {
                corner = 'bottomRight'
            }

            if (corner) {
                setActiveCorner(corner)

                // Only trigger after hovering for 500ms
                if (triggerTimeout) clearTimeout(triggerTimeout)

                const timeout = setTimeout(() => {
                    const action = hotCorners[corner]
                    if (action && action !== 'none') {
                        executeCornerAction(action)
                    }
                }, 500)

                setTriggerTimeout(timeout)
            } else {
                setActiveCorner(null)
                if (triggerTimeout) {
                    clearTimeout(triggerTimeout)
                    setTriggerTimeout(null)
                }
            }
        }

        window.addEventListener('mousemove', handleMouseMove)

        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
            if (triggerTimeout) clearTimeout(triggerTimeout)
        }
    }, [hotCorners, triggerTimeout])

    const executeCornerAction = (action) => {
        switch (action) {
            case 'mission-control':
                toggleMissionControl()
                break
            case 'desktop':
                // Minimize all windows (show desktop)
                // In a real implementation, this would minimize all windows
                console.log('Show Desktop')
                break
            case 'launchpad':
                toggleLaunchpad()
                break
            case 'notification-center':
                toggleNotificationCenter()
                break
            case 'lock-screen':
                console.log('Lock Screen')
                break
            default:
                break
        }

        // Clear the active corner after action
        setActiveCorner(null)
        if (triggerTimeout) {
            clearTimeout(triggerTimeout)
            setTriggerTimeout(null)
        }
    }

    // Visual indicators for active hot corners (only show when hovering)
    const renderCornerIndicator = (position) => {
        const isActive = activeCorner === position
        const action = hotCorners[position]

        if (!isActive || action === 'none') return null

        const positionClasses = {
            topLeft: 'top-0 left-0',
            topRight: 'top-0 right-0',
            bottomLeft: 'bottom-0 left-0',
            bottomRight: 'bottom-0 right-0'
        }

        const actionLabels = {
            'mission-control': 'Mission Control',
            'desktop': 'Show Desktop',
            'launchpad': 'Launchpad',
            'notification-center': 'Notifications',
            'lock-screen': 'Lock Screen'
        }

        return (
            <div
                className={`fixed ${positionClasses[position]} w-20 h-20 pointer-events-none z-[9999]`}
            >
                <div className="relative w-full h-full">
                    <div className="absolute inset-0 bg-blue-500/20 rounded-lg backdrop-blur-sm" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-xs text-white bg-blue-600/80 px-2 py-1 rounded shadow-lg whitespace-nowrap">
                            {actionLabels[action]}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <>
            {renderCornerIndicator('topLeft')}
            {renderCornerIndicator('topRight')}
            {renderCornerIndicator('bottomLeft')}
            {renderCornerIndicator('bottomRight')}
        </>
    )
}

export default HotCorners
