import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { FaSearchPlus, FaSearchMinus, FaExpand, FaCompress, FaRedoAlt, FaUndoAlt } from 'react-icons/fa'
import { useStore } from '../store/useStore'

const Preview = () => {
    const { darkMode } = useStore()
    const [zoomLevel, setZoomLevel] = useState(100)
    const [rotation, setRotation] = useState(0)
    const [fitToWindow, setFitToWindow] = useState(true)

    // Sample image - using a placeholder
    const sampleImage = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop'

    const handleZoomIn = () => {
        setFitToWindow(false)
        setZoomLevel(prev => Math.min(prev + 25, 400))
    }

    const handleZoomOut = () => {
        setFitToWindow(false)
        setZoomLevel(prev => Math.max(prev - 25, 25))
    }

    const handleFitToWindow = () => {
        setFitToWindow(true)
        setZoomLevel(100)
    }

    const handleActualSize = () => {
        setFitToWindow(false)
        setZoomLevel(100)
    }

    const handleRotateLeft = () => {
        setRotation(prev => (prev - 90) % 360)
    }

    const handleRotateRight = () => {
        setRotation(prev => (prev + 90) % 360)
    }

    return (
        <div className={`w-full h-full flex flex-col transition-colors duration-300 ${
            darkMode ? 'bg-gray-900' : 'bg-gray-100'
        }`}>
            {/* Toolbar */}
            <div className={`h-12 flex items-center justify-between px-4 border-b transition-colors duration-300 ${
                darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
            }`}>
                {/* Left side - Zoom controls */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleZoomOut}
                        disabled={zoomLevel <= 25}
                        className={`p-2 rounded hover:bg-opacity-10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
                            darkMode ? 'hover:bg-white' : 'hover:bg-black'
                        }`}
                        title="Zoom Out"
                    >
                        <FaSearchMinus className={darkMode ? 'text-gray-300' : 'text-gray-700'} />
                    </button>

                    <span className={`text-sm font-medium min-w-[60px] text-center ${
                        darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                        {zoomLevel}%
                    </span>

                    <button
                        onClick={handleZoomIn}
                        disabled={zoomLevel >= 400}
                        className={`p-2 rounded hover:bg-opacity-10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
                            darkMode ? 'hover:bg-white' : 'hover:bg-black'
                        }`}
                        title="Zoom In"
                    >
                        <FaSearchPlus className={darkMode ? 'text-gray-300' : 'text-gray-700'} />
                    </button>

                    <div className={`w-px h-6 mx-2 ${darkMode ? 'bg-gray-600' : 'bg-gray-300'}`} />

                    <button
                        onClick={handleFitToWindow}
                        className={`px-3 py-1 rounded text-sm transition-colors ${
                            fitToWindow
                                ? darkMode
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-blue-500 text-white'
                                : darkMode
                                    ? 'hover:bg-white/10 text-gray-300'
                                    : 'hover:bg-black/10 text-gray-700'
                        }`}
                        title="Fit to Window"
                    >
                        <FaCompress className="inline mr-1" />
                        Fit
                    </button>

                    <button
                        onClick={handleActualSize}
                        className={`px-3 py-1 rounded text-sm transition-colors ${
                            !fitToWindow && zoomLevel === 100
                                ? darkMode
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-blue-500 text-white'
                                : darkMode
                                    ? 'hover:bg-white/10 text-gray-300'
                                    : 'hover:bg-black/10 text-gray-700'
                        }`}
                        title="Actual Size"
                    >
                        <FaExpand className="inline mr-1" />
                        100%
                    </button>
                </div>

                {/* Right side - Rotation controls */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleRotateLeft}
                        className={`p-2 rounded hover:bg-opacity-10 transition-colors ${
                            darkMode ? 'hover:bg-white' : 'hover:bg-black'
                        }`}
                        title="Rotate Left"
                    >
                        <FaUndoAlt className={darkMode ? 'text-gray-300' : 'text-gray-700'} />
                    </button>

                    <button
                        onClick={handleRotateRight}
                        className={`p-2 rounded hover:bg-opacity-10 transition-colors ${
                            darkMode ? 'hover:bg-white' : 'hover:bg-black'
                        }`}
                        title="Rotate Right"
                    >
                        <FaRedoAlt className={darkMode ? 'text-gray-300' : 'text-gray-700'} />
                    </button>
                </div>
            </div>

            {/* Image viewer */}
            <div className={`flex-1 overflow-hidden flex items-center justify-center p-4 transition-colors duration-300 ${
                darkMode ? 'bg-gray-900' : 'bg-gray-200'
            }`}>
                <motion.div
                    className="relative"
                    animate={{
                        scale: fitToWindow ? 1 : zoomLevel / 100,
                        rotate: rotation
                    }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    style={{
                        maxWidth: fitToWindow ? '100%' : 'none',
                        maxHeight: fitToWindow ? '100%' : 'none'
                    }}
                >
                    <img
                        src={sampleImage}
                        alt="Preview"
                        className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                        style={{
                            width: fitToWindow ? 'auto' : 'auto',
                            height: fitToWindow ? 'auto' : 'auto'
                        }}
                    />
                </motion.div>
            </div>

            {/* Bottom info bar */}
            <div className={`h-8 flex items-center justify-between px-4 text-xs border-t transition-colors duration-300 ${
                darkMode
                    ? 'bg-gray-800 border-gray-700 text-gray-400'
                    : 'bg-gray-50 border-gray-200 text-gray-600'
            }`}>
                <span>Sample Image.jpg</span>
                <span>1200 x 800 pixels</span>
                <span>JPEG</span>
            </div>
        </div>
    )
}

export default Preview
