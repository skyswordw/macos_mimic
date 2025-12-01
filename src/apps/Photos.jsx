import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaImage, FaTimes, FaChevronLeft, FaChevronRight, FaHeart, FaRegHeart, FaTrash, FaDownload, FaShareAlt, FaSearch, FaTh, FaThLarge, FaExpand, FaCompress, FaPlay, FaInfo, FaCalendar, FaMapMarkerAlt, FaStar } from 'react-icons/fa'
import { useStore } from '../store/useStore'

const samplePhotos = [
    { id: 1, url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', title: 'Mountain View', date: '2024-03-15', location: 'Swiss Alps', favorite: true },
    { id: 2, url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800', title: 'Ocean Sunset', date: '2024-03-14', location: 'Malibu Beach', favorite: false },
    { id: 3, url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800', title: 'Forest Path', date: '2024-03-13', location: 'Black Forest', favorite: true },
    { id: 4, url: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=800', title: 'Lake Reflection', date: '2024-03-12', location: 'Lake Tahoe', favorite: false },
    { id: 5, url: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800', title: 'Green Valley', date: '2024-03-11', location: 'New Zealand', favorite: false },
    { id: 6, url: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800', title: 'Coastal Cliffs', date: '2024-03-10', location: 'Ireland', favorite: true },
    { id: 7, url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800', title: 'River Bend', date: '2024-03-09', location: 'Norway', favorite: false },
    { id: 8, url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800', title: 'Misty Mountains', date: '2024-03-08', location: 'Colorado', favorite: false },
    { id: 9, url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800', title: 'Sunlit Forest', date: '2024-03-07', location: 'Germany', favorite: true },
    { id: 10, url: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800', title: 'Desert Dunes', date: '2024-03-06', location: 'Sahara', favorite: false },
    { id: 11, url: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=800', title: 'Waterfall', date: '2024-03-05', location: 'Iceland', favorite: true },
    { id: 12, url: 'https://images.unsplash.com/photo-1505144808419-1957a94ca61e?w=800', title: 'Tropical Beach', date: '2024-03-04', location: 'Bali', favorite: false },
]

const albums = [
    { id: 'all', name: 'All Photos', icon: FaImage, count: samplePhotos.length },
    { id: 'favorites', name: 'Favorites', icon: FaHeart, count: samplePhotos.filter(p => p.favorite).length },
    { id: 'recent', name: 'Recent', icon: FaCalendar, count: 6 },
]

const Photos = () => {
    const { darkMode } = useStore()
    const [photos, setPhotos] = useState(samplePhotos)
    const [selectedPhoto, setSelectedPhoto] = useState(null)
    const [currentIndex, setCurrentIndex] = useState(0)
    const [viewMode, setViewMode] = useState('grid') // grid, large
    const [selectedAlbum, setSelectedAlbum] = useState('all')
    const [searchQuery, setSearchQuery] = useState('')
    const [showInfo, setShowInfo] = useState(false)
    const [isFullscreen, setIsFullscreen] = useState(false)

    const filteredPhotos = photos.filter(photo => {
        const matchesSearch = photo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             photo.location.toLowerCase().includes(searchQuery.toLowerCase())

        if (selectedAlbum === 'favorites') {
            return matchesSearch && photo.favorite
        }
        if (selectedAlbum === 'recent') {
            return matchesSearch && photos.indexOf(photo) < 6
        }
        return matchesSearch
    })

    const toggleFavorite = (id, e) => {
        e?.stopPropagation()
        setPhotos(photos.map(p =>
            p.id === id ? { ...p, favorite: !p.favorite } : p
        ))
    }

    const openPhoto = (photo, index) => {
        setSelectedPhoto(photo)
        setCurrentIndex(index)
    }

    const closeViewer = () => {
        setSelectedPhoto(null)
        setShowInfo(false)
    }

    const nextPhoto = () => {
        const newIndex = (currentIndex + 1) % filteredPhotos.length
        setCurrentIndex(newIndex)
        setSelectedPhoto(filteredPhotos[newIndex])
    }

    const prevPhoto = () => {
        const newIndex = (currentIndex - 1 + filteredPhotos.length) % filteredPhotos.length
        setCurrentIndex(newIndex)
        setSelectedPhoto(filteredPhotos[newIndex])
    }

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!selectedPhoto) return
            if (e.key === 'ArrowRight') nextPhoto()
            if (e.key === 'ArrowLeft') prevPhoto()
            if (e.key === 'Escape') closeViewer()
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [selectedPhoto, currentIndex, filteredPhotos])

    return (
        <div className={`w-full h-full flex ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
            {/* Sidebar */}
            <div className={`w-48 flex-shrink-0 border-r ${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-100 border-gray-200'}`}>
                <div className="p-4">
                    <h2 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        Photos
                    </h2>
                    <nav className="space-y-1">
                        {albums.map(album => (
                            <button
                                key={album.id}
                                onClick={() => setSelectedAlbum(album.id)}
                                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                                    selectedAlbum === album.id
                                        ? darkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
                                        : darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                <album.icon className="w-4 h-4" />
                                <span className="flex-1 text-sm">{album.name}</span>
                                <span className={`text-xs ${selectedAlbum === album.id ? 'text-white/70' : 'text-gray-500'}`}>
                                    {album.id === 'all' ? photos.length :
                                     album.id === 'favorites' ? photos.filter(p => p.favorite).length :
                                     6}
                                </span>
                            </button>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Toolbar */}
                <div className={`h-12 flex items-center justify-between px-4 border-b ${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'}`}>
                    <div className="flex items-center gap-2">
                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                            <FaSearch className={`w-3.5 h-3.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                            <input
                                type="text"
                                placeholder="Search photos..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className={`bg-transparent outline-none text-sm w-40 ${darkMode ? 'text-white placeholder-gray-500' : 'text-gray-800 placeholder-gray-400'}`}
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {filteredPhotos.length} photos
                        </span>
                        <div className={`flex rounded-lg overflow-hidden ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 ${viewMode === 'grid' ? 'bg-blue-500 text-white' : darkMode ? 'text-gray-400' : 'text-gray-600'}`}
                            >
                                <FaTh className="w-3.5 h-3.5" />
                            </button>
                            <button
                                onClick={() => setViewMode('large')}
                                className={`p-2 ${viewMode === 'large' ? 'bg-blue-500 text-white' : darkMode ? 'text-gray-400' : 'text-gray-600'}`}
                            >
                                <FaThLarge className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Photo Grid */}
                <div className="flex-1 overflow-auto p-4">
                    <div className={`grid gap-2 ${viewMode === 'grid' ? 'grid-cols-4 sm:grid-cols-5 md:grid-cols-6' : 'grid-cols-2 sm:grid-cols-3'}`}>
                        {filteredPhotos.map((photo, index) => (
                            <motion.div
                                key={photo.id}
                                layoutId={`photo-${photo.id}`}
                                className={`relative group cursor-pointer rounded-lg overflow-hidden ${viewMode === 'large' ? 'aspect-[4/3]' : 'aspect-square'}`}
                                onClick={() => openPhoto(photo, index)}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <img
                                    src={photo.url}
                                    alt={photo.title}
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />

                                {/* Favorite indicator */}
                                <button
                                    onClick={(e) => toggleFavorite(photo.id, e)}
                                    className="absolute top-2 right-2 p-1.5 rounded-full bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    {photo.favorite ? (
                                        <FaHeart className="w-3.5 h-3.5 text-red-500" />
                                    ) : (
                                        <FaRegHeart className="w-3.5 h-3.5 text-white" />
                                    )}
                                </button>

                                {/* Title on hover */}
                                {viewMode === 'large' && (
                                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                        <p className="text-white text-sm font-medium truncate">{photo.title}</p>
                                        <p className="text-white/70 text-xs">{photo.location}</p>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>

                    {filteredPhotos.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                            <FaImage className={`w-16 h-16 mb-4 ${darkMode ? 'text-gray-700' : 'text-gray-300'}`} />
                            <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>No photos found</p>
                            <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                Try adjusting your search or filter
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Photo Viewer */}
            <AnimatePresence>
                {selectedPhoto && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-50 flex flex-col bg-black"
                    >
                        {/* Viewer Header */}
                        <div className="h-12 flex items-center justify-between px-4 bg-black/80">
                            <button
                                onClick={closeViewer}
                                className="p-2 rounded-lg hover:bg-white/10 text-white"
                            >
                                <FaTimes className="w-5 h-5" />
                            </button>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => toggleFavorite(selectedPhoto.id)}
                                    className="p-2 rounded-lg hover:bg-white/10 text-white"
                                >
                                    {selectedPhoto.favorite ? (
                                        <FaHeart className="w-5 h-5 text-red-500" />
                                    ) : (
                                        <FaRegHeart className="w-5 h-5" />
                                    )}
                                </button>
                                <button
                                    onClick={() => setShowInfo(!showInfo)}
                                    className={`p-2 rounded-lg hover:bg-white/10 ${showInfo ? 'bg-white/20' : ''} text-white`}
                                >
                                    <FaInfo className="w-5 h-5" />
                                </button>
                                <button className="p-2 rounded-lg hover:bg-white/10 text-white">
                                    <FaShareAlt className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Image Area */}
                        <div className="flex-1 relative flex items-center justify-center">
                            <motion.img
                                key={selectedPhoto.id}
                                src={selectedPhoto.url}
                                alt={selectedPhoto.title}
                                className="max-w-full max-h-full object-contain"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.2 }}
                            />

                            {/* Navigation */}
                            <button
                                onClick={prevPhoto}
                                className="absolute left-4 p-3 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors"
                            >
                                <FaChevronLeft className="w-6 h-6" />
                            </button>
                            <button
                                onClick={nextPhoto}
                                className="absolute right-4 p-3 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors"
                            >
                                <FaChevronRight className="w-6 h-6" />
                            </button>

                            {/* Info Panel */}
                            <AnimatePresence>
                                {showInfo && (
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        className="absolute right-4 top-4 w-64 bg-black/80 rounded-xl p-4 backdrop-blur-sm"
                                    >
                                        <h3 className="text-white font-semibold mb-3">{selectedPhoto.title}</h3>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex items-center gap-2 text-gray-300">
                                                <FaCalendar className="w-4 h-4" />
                                                <span>{selectedPhoto.date}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-300">
                                                <FaMapMarkerAlt className="w-4 h-4" />
                                                <span>{selectedPhoto.location}</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Thumbnail Strip */}
                        <div className="h-20 bg-black/80 flex items-center justify-center gap-2 px-4 overflow-x-auto">
                            {filteredPhotos.map((photo, index) => (
                                <button
                                    key={photo.id}
                                    onClick={() => {
                                        setSelectedPhoto(photo)
                                        setCurrentIndex(index)
                                    }}
                                    className={`flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                                        photo.id === selectedPhoto.id
                                            ? 'border-white scale-105'
                                            : 'border-transparent opacity-60 hover:opacity-100'
                                    }`}
                                >
                                    <img
                                        src={photo.url}
                                        alt={photo.title}
                                        className="w-full h-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default Photos
