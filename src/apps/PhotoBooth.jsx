import React, { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../store/useStore'
import { FaCamera, FaVideo, FaStop, FaImages, FaTrash, FaDownload, FaShare, FaMagic, FaTimes, FaRedo, FaExpand } from 'react-icons/fa'

const filters = [
    { id: 'none', name: 'Normal', css: '' },
    { id: 'sepia', name: 'Sepia', css: 'sepia(100%)' },
    { id: 'grayscale', name: 'B&W', css: 'grayscale(100%)' },
    { id: 'contrast', name: 'Contrast', css: 'contrast(150%)' },
    { id: 'brightness', name: 'Bright', css: 'brightness(130%)' },
    { id: 'invert', name: 'Invert', css: 'invert(100%)' },
    { id: 'blur', name: 'Blur', css: 'blur(2px)' },
    { id: 'saturate', name: 'Vivid', css: 'saturate(200%)' },
    { id: 'hue-rotate', name: 'Hue', css: 'hue-rotate(90deg)' },
    { id: 'vintage', name: 'Vintage', css: 'sepia(50%) contrast(90%) brightness(90%)' },
    { id: 'cool', name: 'Cool', css: 'hue-rotate(180deg) saturate(80%)' },
    { id: 'warm', name: 'Warm', css: 'sepia(30%) saturate(140%)' },
]

const effects = [
    { id: 'none', name: 'None', transform: '' },
    { id: 'mirror', name: 'Mirror', transform: 'scaleX(-1)' },
    { id: 'flip', name: 'Flip', transform: 'scaleY(-1)' },
    { id: 'stretch', name: 'Stretch', transform: 'scaleX(1.5)' },
    { id: 'squeeze', name: 'Squeeze', transform: 'scaleY(1.5) scaleX(0.7)' },
    { id: 'bulge', name: 'Bulge', transform: 'scale(1.2)' },
    { id: 'twirl', name: 'Twirl', transform: 'rotate(5deg)' },
]

const PhotoBooth = () => {
    const { darkMode, addNotification } = useStore()
    const [hasCamera, setHasCamera] = useState(false)
    const [stream, setStream] = useState(null)
    const [photos, setPhotos] = useState([])
    const [selectedFilter, setSelectedFilter] = useState(filters[0])
    const [selectedEffect, setSelectedEffect] = useState(effects[0])
    const [isRecording, setIsRecording] = useState(false)
    const [countdown, setCountdown] = useState(0)
    const [showGallery, setShowGallery] = useState(false)
    const [selectedPhoto, setSelectedPhoto] = useState(null)
    const [flashEffect, setFlashEffect] = useState(false)
    const videoRef = useRef(null)
    const canvasRef = useRef(null)

    useEffect(() => {
        startCamera()
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop())
            }
        }
    }, [])

    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { width: 640, height: 480, facingMode: 'user' }
            })
            setStream(mediaStream)
            setHasCamera(true)
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream
            }
        } catch (err) {
            console.log('Camera not available')
            setHasCamera(false)
        }
    }

    const takePhoto = useCallback(() => {
        setCountdown(3)
        const countdownInterval = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(countdownInterval)
                    capturePhoto()
                    return 0
                }
                return prev - 1
            })
        }, 1000)
    }, [selectedFilter, selectedEffect])

    const capturePhoto = () => {
        setFlashEffect(true)
        setTimeout(() => setFlashEffect(false), 200)

        const video = videoRef.current
        const canvas = canvasRef.current
        if (!video || !canvas) return

        const ctx = canvas.getContext('2d')
        canvas.width = video.videoWidth || 640
        canvas.height = video.videoHeight || 480

        ctx.save()
        if (selectedEffect.transform.includes('scaleX(-1)')) {
            ctx.scale(-1, 1)
            ctx.translate(-canvas.width, 0)
        }
        ctx.filter = selectedFilter.css || 'none'
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
        ctx.restore()

        const dataUrl = canvas.toDataURL('image/png')
        const newPhoto = {
            id: Date.now(),
            src: dataUrl,
            filter: selectedFilter.name,
            effect: selectedEffect.name,
            timestamp: new Date().toLocaleString()
        }
        setPhotos(prev => [newPhoto, ...prev])
        addNotification({ title: 'Photo Booth', message: 'Photo captured!', app: 'Photo Booth' })
    }

    const deletePhoto = (id) => {
        setPhotos(prev => prev.filter(p => p.id !== id))
        if (selectedPhoto?.id === id) setSelectedPhoto(null)
    }

    const downloadPhoto = (photo) => {
        const link = document.createElement('a')
        link.href = photo.src
        link.download = `photo-booth-${photo.id}.png`
        link.click()
    }

    return (
        <div className={`h-full flex flex-col ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
            {/* Toolbar */}
            <div className={`flex items-center justify-between p-2 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex gap-2">
                    <button onClick={() => setShowGallery(false)}
                        className={`px-3 py-1.5 rounded-lg flex items-center gap-2 ${!showGallery ? 'bg-red-500 text-white' : ''}`}>
                        <FaCamera /> Camera
                    </button>
                    <button onClick={() => setShowGallery(true)}
                        className={`px-3 py-1.5 rounded-lg flex items-center gap-2 ${showGallery ? 'bg-red-500 text-white' : ''}`}>
                        <FaImages /> Gallery ({photos.length})
                    </button>
                </div>
                <div className="flex gap-2">
                    <button className={`px-3 py-1.5 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                        <FaMagic /> Effects
                    </button>
                </div>
            </div>

            {!showGallery ? (
                <div className="flex-1 flex">
                    {/* Camera View */}
                    <div className="flex-1 relative bg-black flex items-center justify-center">
                        {hasCamera ? (
                            <>
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    playsInline
                                    muted
                                    className="max-w-full max-h-full"
                                    style={{
                                        filter: selectedFilter.css,
                                        transform: selectedEffect.transform
                                    }}
                                />
                                <canvas ref={canvasRef} className="hidden" />

                                {/* Countdown */}
                                <AnimatePresence>
                                    {countdown > 0 && (
                                        <motion.div
                                            initial={{ scale: 2, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            exit={{ scale: 0, opacity: 0 }}
                                            className="absolute inset-0 flex items-center justify-center bg-black/50"
                                        >
                                            <span className="text-9xl font-bold text-white">{countdown}</span>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Flash Effect */}
                                <AnimatePresence>
                                    {flashEffect && (
                                        <motion.div
                                            initial={{ opacity: 1 }}
                                            animate={{ opacity: 0 }}
                                            className="absolute inset-0 bg-white"
                                        />
                                    )}
                                </AnimatePresence>

                                {/* Capture Button */}
                                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={takePhoto}
                                        disabled={countdown > 0}
                                        className="w-16 h-16 rounded-full bg-red-500 border-4 border-white shadow-lg flex items-center justify-center"
                                    >
                                        <FaCamera className="text-2xl text-white" />
                                    </motion.button>
                                </div>
                            </>
                        ) : (
                            <div className="text-center text-gray-500">
                                <FaCamera className="text-6xl mx-auto mb-4 opacity-20" />
                                <p>Camera not available</p>
                                <p className="text-sm mt-2">Please allow camera access</p>
                            </div>
                        )}

                        {/* Recent Photos Strip */}
                        {photos.length > 0 && (
                            <div className="absolute bottom-6 right-6 flex gap-2">
                                {photos.slice(0, 4).map(photo => (
                                    <motion.img
                                        key={photo.id}
                                        src={photo.src}
                                        onClick={() => { setSelectedPhoto(photo); setShowGallery(true) }}
                                        className="w-16 h-16 rounded-lg object-cover cursor-pointer border-2 border-white shadow-lg"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Filters Sidebar */}
                    <div className={`w-32 border-l overflow-auto ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
                        <div className="p-2 text-xs font-semibold text-gray-500">FILTERS</div>
                        <div className="space-y-1 p-1">
                            {filters.map(filter => (
                                <button
                                    key={filter.id}
                                    onClick={() => setSelectedFilter(filter)}
                                    className={`w-full p-2 rounded text-xs text-left ${
                                        selectedFilter.id === filter.id
                                            ? 'bg-red-500 text-white'
                                            : darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                                    }`}
                                >
                                    {filter.name}
                                </button>
                            ))}
                        </div>

                        <div className="p-2 text-xs font-semibold text-gray-500 mt-4">EFFECTS</div>
                        <div className="space-y-1 p-1">
                            {effects.map(effect => (
                                <button
                                    key={effect.id}
                                    onClick={() => setSelectedEffect(effect)}
                                    className={`w-full p-2 rounded text-xs text-left ${
                                        selectedEffect.id === effect.id
                                            ? 'bg-red-500 text-white'
                                            : darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                                    }`}
                                >
                                    {effect.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                /* Gallery View */
                <div className="flex-1 overflow-auto p-4">
                    {selectedPhoto ? (
                        <div className="h-full flex flex-col">
                            <div className="flex items-center justify-between mb-4">
                                <button onClick={() => setSelectedPhoto(null)} className="flex items-center gap-2 text-red-500">
                                    <FaTimes /> Back to Gallery
                                </button>
                                <div className="flex gap-2">
                                    <button onClick={() => downloadPhoto(selectedPhoto)} className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                                        <FaDownload />
                                    </button>
                                    <button onClick={() => deletePhoto(selectedPhoto.id)} className="p-2 rounded-lg bg-red-500 text-white">
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>
                            <div className="flex-1 flex items-center justify-center bg-black rounded-xl overflow-hidden">
                                <img src={selectedPhoto.src} alt="Selected" className="max-w-full max-h-full object-contain" />
                            </div>
                            <div className="mt-4 text-center text-sm text-gray-500">
                                {selectedPhoto.timestamp} • {selectedPhoto.filter} • {selectedPhoto.effect}
                            </div>
                        </div>
                    ) : (
                        <div>
                            <h2 className="text-xl font-bold mb-4">Photo Gallery</h2>
                            {photos.length > 0 ? (
                                <div className="grid grid-cols-4 gap-4">
                                    {photos.map(photo => (
                                        <motion.div
                                            key={photo.id}
                                            whileHover={{ scale: 1.02 }}
                                            className="relative group cursor-pointer"
                                            onClick={() => setSelectedPhoto(photo)}
                                        >
                                            <img src={photo.src} alt="Photo" className="w-full aspect-square object-cover rounded-xl" />
                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 rounded-xl flex items-center justify-center gap-2 transition-opacity">
                                                <button onClick={(e) => { e.stopPropagation(); downloadPhoto(photo) }} className="p-2 bg-white rounded-full text-gray-900">
                                                    <FaDownload />
                                                </button>
                                                <button onClick={(e) => { e.stopPropagation(); deletePhoto(photo.id) }} className="p-2 bg-red-500 rounded-full text-white">
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 text-gray-500">
                                    <FaImages className="text-5xl mx-auto mb-3 opacity-20" />
                                    <p>No photos yet</p>
                                    <p className="text-sm">Take some photos to see them here!</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default PhotoBooth
