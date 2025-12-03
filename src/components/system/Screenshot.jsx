import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaCamera, FaVideo, FaTimes, FaCog } from 'react-icons/fa'
import { useStore } from '../../store/useStore'
import { soundEffects } from '../../utils/soundEffects'
import html2canvas from 'html2canvas'

const Screenshot = () => {
    const { darkMode, addNotification } = useStore()
    const [isCapturing, setIsCapturing] = useState(false)
    const [captureMode, setCaptureMode] = useState(null) // 'full', 'selection', 'menu'
    const [selectionStart, setSelectionStart] = useState(null)
    const [selectionEnd, setSelectionEnd] = useState(null)
    const [isDragging, setIsDragging] = useState(false)
    const canvasRef = useRef(null)

    // Listen for screenshot shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
            const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0
            const modKey = isMac ? e.metaKey : e.ctrlKey

            // Cmd+Shift+3 - Full screenshot
            if (modKey && e.shiftKey && e.key === '3') {
                e.preventDefault()
                captureFullScreen()
            }

            // Cmd+Shift+4 - Selection screenshot
            if (modKey && e.shiftKey && e.key === '4') {
                e.preventDefault()
                startSelectionCapture()
            }

            // Cmd+Shift+5 - Screenshot menu
            if (modKey && e.shiftKey && e.key === '5') {
                e.preventDefault()
                setCaptureMode('menu')
            }

            // Escape to cancel
            if (e.key === 'Escape' && (isCapturing || captureMode)) {
                cancelCapture()
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [isCapturing, captureMode])

    const captureFullScreen = async () => {
        setIsCapturing(true)
        try {
            // Capture the entire desktop
            const desktopElement = document.querySelector('.relative.w-full.h-full')
            if (!desktopElement) throw new Error('Desktop element not found')

            const canvas = await html2canvas(desktopElement, {
                useCORS: true,
                allowTaint: true,
                backgroundColor: null,
                scale: 1
            })

            downloadScreenshot(canvas, 'screenshot-full')
            soundEffects.screenshot()

            addNotification({
                title: 'Screenshot Captured',
                message: 'Full screen screenshot saved',
                type: 'success'
            })
        } catch (error) {
            console.error('Screenshot failed:', error)
            addNotification({
                title: 'Screenshot Failed',
                message: 'Unable to capture screenshot',
                type: 'error'
            })
        } finally {
            setIsCapturing(false)
        }
    }

    const startSelectionCapture = () => {
        setCaptureMode('selection')
        setSelectionStart(null)
        setSelectionEnd(null)
        setIsDragging(false)
    }

    const handleMouseDown = (e) => {
        if (captureMode !== 'selection') return
        setIsDragging(true)
        setSelectionStart({ x: e.clientX, y: e.clientY })
        setSelectionEnd({ x: e.clientX, y: e.clientY })
    }

    const handleMouseMove = (e) => {
        if (!isDragging || captureMode !== 'selection') return
        setSelectionEnd({ x: e.clientX, y: e.clientY })
    }

    const handleMouseUp = async (e) => {
        if (!isDragging || captureMode !== 'selection') return
        setIsDragging(false)

        const width = Math.abs(selectionEnd.x - selectionStart.x)
        const height = Math.abs(selectionEnd.y - selectionStart.y)

        // Minimum size check
        if (width < 10 || height < 10) {
            cancelCapture()
            return
        }

        setIsCapturing(true)

        try {
            const desktopElement = document.querySelector('.relative.w-full.h-full')
            if (!desktopElement) throw new Error('Desktop element not found')

            const canvas = await html2canvas(desktopElement, {
                useCORS: true,
                allowTaint: true,
                backgroundColor: null,
                scale: 1
            })

            // Crop the canvas to selection
            const cropCanvas = document.createElement('canvas')
            const ctx = cropCanvas.getContext('2d')

            const x = Math.min(selectionStart.x, selectionEnd.x)
            const y = Math.min(selectionStart.y, selectionEnd.y)

            cropCanvas.width = width
            cropCanvas.height = height

            ctx.drawImage(canvas, x, y, width, height, 0, 0, width, height)

            downloadScreenshot(cropCanvas, 'screenshot-selection')
            soundEffects.screenshot()

            addNotification({
                title: 'Screenshot Captured',
                message: 'Selection screenshot saved',
                type: 'success'
            })
        } catch (error) {
            console.error('Screenshot failed:', error)
            addNotification({
                title: 'Screenshot Failed',
                message: 'Unable to capture screenshot',
                type: 'error'
            })
        } finally {
            setIsCapturing(false)
            setCaptureMode(null)
            setSelectionStart(null)
            setSelectionEnd(null)
        }
    }

    const downloadScreenshot = (canvas, filename) => {
        canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `${filename}-${Date.now()}.png`
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            URL.revokeObjectURL(url)
        }, 'image/png')
    }

    const cancelCapture = () => {
        setCaptureMode(null)
        setSelectionStart(null)
        setSelectionEnd(null)
        setIsDragging(false)
        setIsCapturing(false)
    }

    const getSelectionStyle = () => {
        if (!selectionStart || !selectionEnd) return {}

        const x = Math.min(selectionStart.x, selectionEnd.x)
        const y = Math.min(selectionStart.y, selectionEnd.y)
        const width = Math.abs(selectionEnd.x - selectionStart.x)
        const height = Math.abs(selectionEnd.y - selectionStart.y)

        return { left: x, top: y, width, height }
    }

    return (
        <>
            {/* Selection Mode Overlay */}
            <AnimatePresence>
                {captureMode === 'selection' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[9999] cursor-crosshair"
                        style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                    >
                        {/* Instructions */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-center pointer-events-none">
                            {!isDragging && (
                                <div className="bg-black/50 backdrop-blur-sm px-6 py-4 rounded-xl">
                                    <p className="text-lg font-medium mb-2">Select Area to Capture</p>
                                    <p className="text-sm text-gray-300">Click and drag to select</p>
                                    <p className="text-xs text-gray-400 mt-2">Press ESC to cancel</p>
                                </div>
                            )}
                        </div>

                        {/* Selection Rectangle */}
                        {isDragging && selectionStart && selectionEnd && (
                            <div
                                className="absolute border-2 border-blue-500 bg-blue-500/10"
                                style={getSelectionStyle()}
                            >
                                {/* Selection info */}
                                <div className="absolute -bottom-8 left-0 bg-black/70 text-white text-xs px-2 py-1 rounded">
                                    {Math.abs(selectionEnd.x - selectionStart.x)} × {Math.abs(selectionEnd.y - selectionStart.y)}
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Screenshot Menu */}
            <AnimatePresence>
                {captureMode === 'menu' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50"
                        onClick={cancelCapture}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className={`rounded-2xl shadow-2xl p-6 min-w-[400px] ${
                                darkMode ? 'bg-gray-800' : 'bg-white'
                            }`}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                    Screenshot Options
                                </h2>
                                <button
                                    onClick={cancelCapture}
                                    className={`p-2 rounded-lg transition-colors ${
                                        darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
                                    }`}
                                >
                                    <FaTimes />
                                </button>
                            </div>

                            <div className="space-y-3">
                                <button
                                    onClick={() => {
                                        cancelCapture()
                                        captureFullScreen()
                                    }}
                                    className={`w-full flex items-center gap-4 p-4 rounded-xl transition-colors ${
                                        darkMode
                                            ? 'hover:bg-gray-700 text-gray-200'
                                            : 'hover:bg-gray-50 text-gray-800 border border-gray-200'
                                    }`}
                                >
                                    <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center">
                                        <FaCamera className="text-white text-xl" />
                                    </div>
                                    <div className="text-left flex-1">
                                        <div className="font-medium">Capture Entire Screen</div>
                                        <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                            Cmd + Shift + 3
                                        </div>
                                    </div>
                                </button>

                                <button
                                    onClick={() => {
                                        cancelCapture()
                                        startSelectionCapture()
                                    }}
                                    className={`w-full flex items-center gap-4 p-4 rounded-xl transition-colors ${
                                        darkMode
                                            ? 'hover:bg-gray-700 text-gray-200'
                                            : 'hover:bg-gray-50 text-gray-800 border border-gray-200'
                                    }`}
                                >
                                    <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                                        <FaCamera className="text-white text-xl" />
                                    </div>
                                    <div className="text-left flex-1">
                                        <div className="font-medium">Capture Selected Portion</div>
                                        <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                            Cmd + Shift + 4
                                        </div>
                                    </div>
                                </button>

                                <button
                                    disabled
                                    className={`w-full flex items-center gap-4 p-4 rounded-xl opacity-50 cursor-not-allowed ${
                                        darkMode
                                            ? 'bg-gray-700/50 text-gray-400'
                                            : 'bg-gray-50 text-gray-500 border border-gray-200'
                                    }`}
                                >
                                    <div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center">
                                        <FaVideo className="text-white text-xl" />
                                    </div>
                                    <div className="text-left flex-1">
                                        <div className="font-medium">Record Screen</div>
                                        <div className="text-sm">Coming Soon</div>
                                    </div>
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Capturing Indicator */}
            <AnimatePresence>
                {isCapturing && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 pointer-events-none"
                    >
                        <div className="bg-white dark:bg-gray-800 rounded-full px-6 py-3 shadow-2xl flex items-center gap-3">
                            <div className="w-5 h-5 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
                            <span className={darkMode ? 'text-white' : 'text-gray-900'}>Capturing...</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}

export default Screenshot
