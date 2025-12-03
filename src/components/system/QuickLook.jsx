import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaTimes, FaExpand, FaCompress, FaShareAlt, FaChevronLeft, FaChevronRight, FaFilePdf, FaFileImage, FaFileVideo, FaFileAudio, FaFileAlt, FaFolder, FaFileCode } from 'react-icons/fa'
import { useStore } from '../../store/useStore'

// Sample images for preview
const sampleImages = [
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800',
    'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800',
]

const QuickLook = ({ isOpen, onClose, file, allFiles = [], currentIndex = 0, onNavigate }) => {
    const { darkMode } = useStore()
    const [isFullscreen, setIsFullscreen] = React.useState(false)

    useEffect(() => {
        const handleKeyPress = (e) => {
            if (!isOpen) return

            if (e.key === ' ' || e.key === 'Escape') {
                e.preventDefault()
                onClose()
            } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
                e.preventDefault()
                onNavigate(currentIndex - 1)
            } else if (e.key === 'ArrowRight' && currentIndex < allFiles.length - 1) {
                e.preventDefault()
                onNavigate(currentIndex + 1)
            } else if (e.key === 'f') {
                e.preventDefault()
                setIsFullscreen(!isFullscreen)
            }
        }

        window.addEventListener('keydown', handleKeyPress)
        return () => window.removeEventListener('keydown', handleKeyPress)
    }, [isOpen, isFullscreen, currentIndex, allFiles.length, onNavigate, onClose])

    if (!file) return null

    const getFilePreview = () => {
        const fileType = file.type

        switch (fileType) {
            case 'image':
                return (
                    <div className="flex items-center justify-center h-full p-8">
                        <img
                            src={sampleImages[file.id % 3]}
                            alt={file.name}
                            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                        />
                    </div>
                )

            case 'pdf':
                return (
                    <div className={`flex flex-col items-center justify-center h-full ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        <FaFilePdf className="w-32 h-32 mb-6 text-red-500" />
                        <h3 className="text-2xl font-semibold mb-2">{file.name}</h3>
                        <p className="text-sm opacity-70">PDF Document</p>
                        <p className="text-xs opacity-50 mt-2">{file.size}</p>
                    </div>
                )

            case 'video':
                return (
                    <div className={`flex flex-col items-center justify-center h-full ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        <FaFileVideo className="w-32 h-32 mb-6 text-purple-500" />
                        <h3 className="text-2xl font-semibold mb-2">{file.name}</h3>
                        <p className="text-sm opacity-70">Video File</p>
                        <p className="text-xs opacity-50 mt-2">{file.size}</p>
                        <div className={`mt-6 w-96 h-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-300'}`}>
                            <div className="w-1/3 h-full bg-purple-500 rounded-full"></div>
                        </div>
                    </div>
                )

            case 'audio':
                return (
                    <div className={`flex flex-col items-center justify-center h-full ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        <FaFileAudio className="w-32 h-32 mb-6 text-pink-500" />
                        <h3 className="text-2xl font-semibold mb-2">{file.name}</h3>
                        <p className="text-sm opacity-70">Audio File</p>
                        <p className="text-xs opacity-50 mt-2">{file.size}</p>
                        <div className="mt-6 flex items-center gap-2">
                            {[...Array(20)].map((_, i) => (
                                <div
                                    key={i}
                                    className="w-1 bg-pink-500 rounded-full"
                                    style={{ height: `${Math.random() * 40 + 10}px` }}
                                ></div>
                            ))}
                        </div>
                    </div>
                )

            case 'text':
            case 'document':
                return (
                    <div className={`p-12 h-full overflow-auto ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        <div className={`max-w-3xl mx-auto p-8 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                            <h1 className="text-3xl font-bold mb-6">{file.name}</h1>
                            <p className="text-sm opacity-70 mb-8">Sample document content</p>
                            <div className="space-y-4">
                                <p>This is a preview of the document. In a real implementation, the actual file content would be displayed here.</p>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                                <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                            </div>
                        </div>
                    </div>
                )

            case 'folder':
                return (
                    <div className={`flex flex-col items-center justify-center h-full ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        <FaFolder className="w-32 h-32 mb-6 text-blue-500" />
                        <h3 className="text-2xl font-semibold mb-2">{file.name}</h3>
                        <p className="text-sm opacity-70">Folder</p>
                        <p className="text-xs opacity-50 mt-2">Contains multiple items</p>
                    </div>
                )

            case 'code':
                return (
                    <div className={`p-12 h-full overflow-auto ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        <div className={`max-w-4xl mx-auto p-6 rounded-lg shadow-lg font-mono text-sm ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
                            <div className="flex items-center gap-2 mb-4">
                                <FaFileCode className="text-blue-500" />
                                <span className="font-semibold">{file.name}</span>
                            </div>
                            <pre className={`${darkMode ? 'text-green-400' : 'text-green-700'}`}>
{`// Sample code preview
function example() {
    const message = "Hello, World!";
    console.log(message);
    return true;
}`}
                            </pre>
                        </div>
                    </div>
                )

            default:
                return (
                    <div className={`flex flex-col items-center justify-center h-full ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        <FaFileAlt className="w-32 h-32 mb-6 text-gray-500" />
                        <h3 className="text-2xl font-semibold mb-2">{file.name}</h3>
                        <p className="text-sm opacity-70">File</p>
                        <p className="text-xs opacity-50 mt-2">{file.size}</p>
                    </div>
                )
        }
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className={`relative ${
                            isFullscreen ? 'w-full h-full' : 'w-[90vw] h-[90vh] max-w-6xl rounded-2xl'
                        } ${darkMode ? 'bg-gray-900' : 'bg-white'} shadow-2xl overflow-hidden`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className={`absolute top-0 left-0 right-0 z-10 h-14 flex items-center justify-between px-4 backdrop-blur-md ${
                            darkMode ? 'bg-gray-900/80 border-b border-gray-700' : 'bg-white/80 border-b border-gray-200'
                        }`}>
                            <div className="flex items-center gap-3">
                                {allFiles.length > 1 && (
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => currentIndex > 0 && onNavigate(currentIndex - 1)}
                                            disabled={currentIndex === 0}
                                            className={`p-2 rounded-lg transition-colors ${
                                                currentIndex === 0
                                                    ? 'opacity-30 cursor-not-allowed'
                                                    : darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                                            }`}
                                        >
                                            <FaChevronLeft className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => currentIndex < allFiles.length - 1 && onNavigate(currentIndex + 1)}
                                            disabled={currentIndex === allFiles.length - 1}
                                            className={`p-2 rounded-lg transition-colors ${
                                                currentIndex === allFiles.length - 1
                                                    ? 'opacity-30 cursor-not-allowed'
                                                    : darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                                            }`}
                                        >
                                            <FaChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                                <h2 className={`text-lg font-semibold truncate max-w-md ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                    {file.name}
                                </h2>
                                {allFiles.length > 1 && (
                                    <span className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                        {currentIndex + 1} of {allFiles.length}
                                    </span>
                                )}
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setIsFullscreen(!isFullscreen)}
                                    className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
                                    title={isFullscreen ? 'Exit Fullscreen (F)' : 'Fullscreen (F)'}
                                >
                                    {isFullscreen ? <FaCompress className="w-4 h-4" /> : <FaExpand className="w-4 h-4" />}
                                </button>
                                <button
                                    className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
                                    title="Share"
                                >
                                    <FaShareAlt className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={onClose}
                                    className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
                                    title="Close (Space or Esc)"
                                >
                                    <FaTimes className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="h-full pt-14">
                            {getFilePreview()}
                        </div>

                        {/* Footer hint */}
                        <div className={`absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full text-xs backdrop-blur-md ${
                            darkMode ? 'bg-gray-800/80 text-gray-400' : 'bg-white/80 text-gray-600'
                        }`}>
                            Press <kbd className="px-2 py-0.5 rounded bg-gray-700 text-white mx-1">Space</kbd> or
                            <kbd className="px-2 py-0.5 rounded bg-gray-700 text-white mx-1">Esc</kbd> to close
                            {allFiles.length > 1 && (
                                <>
                                    {' • '}
                                    <kbd className="px-2 py-0.5 rounded bg-gray-700 text-white mx-1">←</kbd>
                                    <kbd className="px-2 py-0.5 rounded bg-gray-700 text-white mx-1">→</kbd> to navigate
                                </>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default QuickLook
