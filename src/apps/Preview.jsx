import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    FaSearchPlus, FaSearchMinus, FaExpand, FaCompress, FaRedoAlt, FaUndoAlt,
    FaChevronLeft, FaChevronRight, FaPlay, FaPause, FaInfo, FaTh, FaList,
    FaPen, FaHighlighter, FaSquare, FaCircle, FaArrowRight, FaUndo, FaTrash,
    FaCrop, FaAdjust, FaTimes, FaDownload, FaShareAlt
} from 'react-icons/fa'
import { useStore } from '../store/useStore'

// Sample gallery images
const sampleImages = [
    {
        id: 1,
        name: 'Mountain Landscape.jpg',
        url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop',
        width: 1200,
        height: 800,
        type: 'JPEG',
        size: '2.4 MB',
        date: '2024-03-15'
    },
    {
        id: 2,
        name: 'Ocean Sunset.jpg',
        url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&h=800&fit=crop',
        width: 1200,
        height: 800,
        type: 'JPEG',
        size: '1.8 MB',
        date: '2024-03-14'
    },
    {
        id: 3,
        name: 'Forest Path.jpg',
        url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=800&fit=crop',
        width: 1200,
        height: 800,
        type: 'JPEG',
        size: '2.1 MB',
        date: '2024-03-13'
    },
    {
        id: 4,
        name: 'City Night.jpg',
        url: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=1200&h=800&fit=crop',
        width: 1200,
        height: 800,
        type: 'JPEG',
        size: '3.2 MB',
        date: '2024-03-12'
    },
    {
        id: 5,
        name: 'Desert Dunes.jpg',
        url: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=1200&h=800&fit=crop',
        width: 1200,
        height: 800,
        type: 'JPEG',
        size: '1.5 MB',
        date: '2024-03-11'
    },
    {
        id: 6,
        name: 'Northern Lights.jpg',
        url: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1200&h=800&fit=crop',
        width: 1200,
        height: 800,
        type: 'JPEG',
        size: '2.8 MB',
        date: '2024-03-10'
    }
]

const Preview = () => {
    const { darkMode } = useStore()
    const [currentIndex, setCurrentIndex] = useState(0)
    const [zoomLevel, setZoomLevel] = useState(100)
    const [rotation, setRotation] = useState(0)
    const [fitToWindow, setFitToWindow] = useState(true)
    const [showSidebar, setShowSidebar] = useState(true)
    const [showInfo, setShowInfo] = useState(false)
    const [isSlideshow, setIsSlideshow] = useState(false)
    const [showMarkup, setShowMarkup] = useState(false)
    const [markupTool, setMarkupTool] = useState(null)
    const [annotations, setAnnotations] = useState({})
    const slideshowRef = useRef(null)

    const currentImage = sampleImages[currentIndex]

    // Slideshow effect
    useEffect(() => {
        if (isSlideshow) {
            slideshowRef.current = setInterval(() => {
                setCurrentIndex(prev => (prev + 1) % sampleImages.length)
            }, 3000)
        } else {
            clearInterval(slideshowRef.current)
        }
        return () => clearInterval(slideshowRef.current)
    }, [isSlideshow])

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            switch (e.key) {
                case 'ArrowLeft':
                    goToPrevious()
                    break
                case 'ArrowRight':
                    goToNext()
                    break
                case ' ':
                    e.preventDefault()
                    setIsSlideshow(prev => !prev)
                    break
                case 'Escape':
                    setIsSlideshow(false)
                    break
                case '+':
                case '=':
                    handleZoomIn()
                    break
                case '-':
                    handleZoomOut()
                    break
                case '0':
                    handleActualSize()
                    break
                default:
                    break
            }
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [])

    const goToPrevious = () => {
        setCurrentIndex(prev => (prev - 1 + sampleImages.length) % sampleImages.length)
        setRotation(0)
    }

    const goToNext = () => {
        setCurrentIndex(prev => (prev + 1) % sampleImages.length)
        setRotation(0)
    }

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

    const ToolbarButton = ({ icon: Icon, onClick, active, disabled, title }) => (
        <button
            onClick={onClick}
            disabled={disabled}
            title={title}
            className={`p-2 rounded transition-colors ${
                disabled ? 'opacity-30 cursor-not-allowed' :
                active
                    ? darkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
                    : darkMode
                        ? 'hover:bg-white/10 text-gray-300'
                        : 'hover:bg-black/10 text-gray-700'
            }`}
        >
            <Icon className="w-4 h-4" />
        </button>
    )

    const Separator = () => (
        <div className={`w-px h-6 mx-1 ${darkMode ? 'bg-gray-600' : 'bg-gray-300'}`} />
    )

    return (
        <div className={`w-full h-full flex flex-col transition-colors duration-300 ${
            darkMode ? 'bg-gray-900' : 'bg-gray-100'
        }`}>
            {/* Toolbar */}
            <div className={`h-12 flex items-center justify-between px-3 border-b transition-colors duration-300 ${
                darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
            }`}>
                {/* Left side - Navigation & Zoom controls */}
                <div className="flex items-center gap-1">
                    <ToolbarButton
                        icon={FaTh}
                        onClick={() => setShowSidebar(!showSidebar)}
                        active={showSidebar}
                        title="Toggle Sidebar"
                    />

                    <Separator />

                    <ToolbarButton
                        icon={FaChevronLeft}
                        onClick={goToPrevious}
                        title="Previous (←)"
                    />
                    <span className={`text-sm px-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {currentIndex + 1} / {sampleImages.length}
                    </span>
                    <ToolbarButton
                        icon={FaChevronRight}
                        onClick={goToNext}
                        title="Next (→)"
                    />

                    <Separator />

                    <ToolbarButton
                        icon={FaSearchMinus}
                        onClick={handleZoomOut}
                        disabled={zoomLevel <= 25}
                        title="Zoom Out (-)"
                    />
                    <span className={`text-sm font-medium min-w-[50px] text-center ${
                        darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                        {zoomLevel}%
                    </span>
                    <ToolbarButton
                        icon={FaSearchPlus}
                        onClick={handleZoomIn}
                        disabled={zoomLevel >= 400}
                        title="Zoom In (+)"
                    />

                    <ToolbarButton
                        icon={FaCompress}
                        onClick={handleFitToWindow}
                        active={fitToWindow}
                        title="Fit to Window"
                    />
                    <ToolbarButton
                        icon={FaExpand}
                        onClick={handleActualSize}
                        active={!fitToWindow && zoomLevel === 100}
                        title="Actual Size (0)"
                    />
                </div>

                {/* Right side - Tools */}
                <div className="flex items-center gap-1">
                    <ToolbarButton
                        icon={isSlideshow ? FaPause : FaPlay}
                        onClick={() => setIsSlideshow(!isSlideshow)}
                        active={isSlideshow}
                        title="Slideshow (Space)"
                    />

                    <Separator />

                    <ToolbarButton
                        icon={FaUndoAlt}
                        onClick={handleRotateLeft}
                        title="Rotate Left"
                    />
                    <ToolbarButton
                        icon={FaRedoAlt}
                        onClick={handleRotateRight}
                        title="Rotate Right"
                    />

                    <Separator />

                    <ToolbarButton
                        icon={FaPen}
                        onClick={() => setShowMarkup(!showMarkup)}
                        active={showMarkup}
                        title="Markup Tools"
                    />
                    <ToolbarButton
                        icon={FaInfo}
                        onClick={() => setShowInfo(!showInfo)}
                        active={showInfo}
                        title="Info"
                    />
                </div>
            </div>

            {/* Markup toolbar */}
            <AnimatePresence>
                {showMarkup && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className={`flex items-center gap-2 px-4 py-2 border-b overflow-hidden ${
                            darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-200'
                        }`}
                    >
                        <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Tools:</span>
                        <ToolbarButton
                            icon={FaPen}
                            onClick={() => setMarkupTool('pen')}
                            active={markupTool === 'pen'}
                            title="Pen"
                        />
                        <ToolbarButton
                            icon={FaHighlighter}
                            onClick={() => setMarkupTool('highlighter')}
                            active={markupTool === 'highlighter'}
                            title="Highlighter"
                        />
                        <ToolbarButton
                            icon={FaSquare}
                            onClick={() => setMarkupTool('rectangle')}
                            active={markupTool === 'rectangle'}
                            title="Rectangle"
                        />
                        <ToolbarButton
                            icon={FaCircle}
                            onClick={() => setMarkupTool('ellipse')}
                            active={markupTool === 'ellipse'}
                            title="Ellipse"
                        />
                        <ToolbarButton
                            icon={FaArrowRight}
                            onClick={() => setMarkupTool('arrow')}
                            active={markupTool === 'arrow'}
                            title="Arrow"
                        />

                        <Separator />

                        <input
                            type="color"
                            defaultValue="#ff0000"
                            className="w-6 h-6 rounded cursor-pointer"
                            title="Color"
                        />

                        <Separator />

                        <ToolbarButton
                            icon={FaUndo}
                            onClick={() => {}}
                            title="Undo"
                        />
                        <ToolbarButton
                            icon={FaTrash}
                            onClick={() => setAnnotations({})}
                            title="Clear All"
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex-1 flex overflow-hidden">
                {/* Thumbnail sidebar */}
                <AnimatePresence>
                    {showSidebar && (
                        <motion.div
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: 120, opacity: 1 }}
                            exit={{ width: 0, opacity: 0 }}
                            className={`border-r overflow-y-auto ${
                                darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
                            }`}
                        >
                            <div className="p-2 space-y-2">
                                {sampleImages.map((image, index) => (
                                    <button
                                        key={image.id}
                                        onClick={() => {
                                            setCurrentIndex(index)
                                            setRotation(0)
                                        }}
                                        className={`w-full aspect-video rounded overflow-hidden border-2 transition-all ${
                                            index === currentIndex
                                                ? 'border-blue-500 shadow-lg'
                                                : darkMode
                                                    ? 'border-transparent hover:border-gray-600'
                                                    : 'border-transparent hover:border-gray-300'
                                        }`}
                                    >
                                        <img
                                            src={image.url}
                                            alt={image.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Main image viewer */}
                <div className={`flex-1 overflow-hidden flex items-center justify-center p-4 relative ${
                    darkMode ? 'bg-gray-900' : 'bg-gray-200'
                }`}>
                    {/* Navigation arrows (visible on hover) */}
                    <button
                        onClick={goToPrevious}
                        className={`absolute left-4 p-3 rounded-full transition-all opacity-0 hover:opacity-100 focus:opacity-100 z-10 ${
                            darkMode ? 'bg-black/50 text-white hover:bg-black/70' : 'bg-white/50 text-gray-800 hover:bg-white/70'
                        }`}
                    >
                        <FaChevronLeft className="w-5 h-5" />
                    </button>

                    <button
                        onClick={goToNext}
                        className={`absolute right-4 p-3 rounded-full transition-all opacity-0 hover:opacity-100 focus:opacity-100 z-10 ${
                            darkMode ? 'bg-black/50 text-white hover:bg-black/70' : 'bg-white/50 text-gray-800 hover:bg-white/70'
                        }`}
                    >
                        <FaChevronRight className="w-5 h-5" />
                    </button>

                    {/* Image */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentImage.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{
                                opacity: 1,
                                scale: fitToWindow ? 1 : zoomLevel / 100,
                                rotate: rotation
                            }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.3, ease: 'easeOut' }}
                            className="relative"
                            style={{
                                maxWidth: fitToWindow ? '100%' : 'none',
                                maxHeight: fitToWindow ? '100%' : 'none'
                            }}
                        >
                            <img
                                src={currentImage.url}
                                alt={currentImage.name}
                                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                                draggable={false}
                            />
                        </motion.div>
                    </AnimatePresence>

                    {/* Slideshow indicator */}
                    {isSlideshow && (
                        <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full ${
                            darkMode ? 'bg-black/70 text-white' : 'bg-white/70 text-gray-800'
                        }`}>
                            <FaPlay className="inline mr-2" />
                            Slideshow - Press Space to stop
                        </div>
                    )}
                </div>

                {/* Info panel */}
                <AnimatePresence>
                    {showInfo && (
                        <motion.div
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: 220, opacity: 1 }}
                            exit={{ width: 0, opacity: 0 }}
                            className={`border-l overflow-y-auto ${
                                darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
                            }`}
                        >
                            <div className="p-4">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                        Info
                                    </h3>
                                    <button
                                        onClick={() => setShowInfo(false)}
                                        className={`p-1 rounded ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
                                    >
                                        <FaTimes className={`w-3 h-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                                    </button>
                                </div>

                                {/* Preview thumbnail */}
                                <div className="mb-4 rounded overflow-hidden">
                                    <img
                                        src={currentImage.url}
                                        alt={currentImage.name}
                                        className="w-full h-auto"
                                    />
                                </div>

                                {/* Info items */}
                                <div className="space-y-3">
                                    <InfoItem label="Name" value={currentImage.name} darkMode={darkMode} />
                                    <InfoItem label="Dimensions" value={`${currentImage.width} × ${currentImage.height}`} darkMode={darkMode} />
                                    <InfoItem label="Type" value={currentImage.type} darkMode={darkMode} />
                                    <InfoItem label="Size" value={currentImage.size} darkMode={darkMode} />
                                    <InfoItem label="Date" value={currentImage.date} darkMode={darkMode} />
                                    <InfoItem label="Rotation" value={`${rotation}°`} darkMode={darkMode} />
                                </div>

                                {/* Actions */}
                                <div className="mt-6 space-y-2">
                                    <button className={`w-full flex items-center gap-2 px-3 py-2 rounded text-sm transition-colors ${
                                        darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                                    }`}>
                                        <FaDownload className="w-4 h-4" />
                                        Export
                                    </button>
                                    <button className={`w-full flex items-center gap-2 px-3 py-2 rounded text-sm transition-colors ${
                                        darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                                    }`}>
                                        <FaShareAlt className="w-4 h-4" />
                                        Share
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Bottom info bar */}
            <div className={`h-7 flex items-center justify-between px-4 text-xs border-t transition-colors duration-300 ${
                darkMode
                    ? 'bg-gray-800 border-gray-700 text-gray-400'
                    : 'bg-gray-50 border-gray-200 text-gray-600'
            }`}>
                <span className="truncate max-w-[200px]">{currentImage.name}</span>
                <span>{currentImage.width} × {currentImage.height}</span>
                <span>{currentImage.type} • {currentImage.size}</span>
            </div>
        </div>
    )
}

// Info item component
const InfoItem = ({ label, value, darkMode }) => (
    <div>
        <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{label}</div>
        <div className={`text-sm ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{value}</div>
    </div>
)

export default Preview
