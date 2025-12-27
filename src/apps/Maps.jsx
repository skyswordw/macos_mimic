import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useStore } from '../store/useStore'
import { FaSearch, FaMapMarkerAlt, FaDirections, FaLayerGroup, FaLocationArrow, FaCar, FaWalking, FaBus, FaBicycle, FaStar, FaTimes, FaPlus, FaMinus, FaCompass } from 'react-icons/fa'

const Maps = () => {
    const { darkMode } = useStore()
    const [searchQuery, setSearchQuery] = useState('')
    const [showDirections, setShowDirections] = useState(false)
    const [mapStyle, setMapStyle] = useState('standard')
    const [zoom, setZoom] = useState(12)
    const [center, setCenter] = useState({ lat: 37.7749, lng: -122.4194 })
    const [selectedPlace, setSelectedPlace] = useState(null)
    const [transportMode, setTransportMode] = useState('driving')
    const [fromLocation, setFromLocation] = useState('')
    const [toLocation, setToLocation] = useState('')

    const places = [
        { id: 1, name: 'Golden Gate Bridge', type: 'Landmark', lat: 37.8199, lng: -122.4783, rating: 4.8 },
        { id: 2, name: 'Alcatraz Island', type: 'Historic Site', lat: 37.8267, lng: -122.4233, rating: 4.7 },
        { id: 3, name: 'Fisherman\'s Wharf', type: 'Tourist Attraction', lat: 37.8080, lng: -122.4177, rating: 4.5 },
        { id: 4, name: 'Chinatown', type: 'Neighborhood', lat: 37.7941, lng: -122.4078, rating: 4.4 },
        { id: 5, name: 'Union Square', type: 'Shopping', lat: 37.7879, lng: -122.4074, rating: 4.3 },
    ]

    const recentSearches = ['Coffee shops nearby', 'Gas stations', 'Restaurants', 'Hotels']
    const favorites = [{ name: 'Home', address: '123 Main St' }, { name: 'Work', address: '456 Market St' }]

    const filteredPlaces = places.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))

    const handlePlaceClick = (place) => {
        setSelectedPlace(place)
        setCenter({ lat: place.lat, lng: place.lng })
        setZoom(15)
    }

    return (
        <div className={`h-full flex ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
            {/* Sidebar */}
            <div className={`w-80 flex flex-col border-r ${darkMode ? 'border-gray-700 bg-gray-800/90' : 'border-gray-200 bg-white/95'}`}>
                {/* Search */}
                <div className="p-4 space-y-3">
                    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                        <FaSearch className="text-gray-500" />
                        <input type="text" placeholder="Search Maps" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                            className={`bg-transparent flex-1 outline-none ${darkMode ? 'placeholder-gray-400' : 'placeholder-gray-500'}`} />
                        {searchQuery && <button onClick={() => setSearchQuery('')} className="text-gray-400"><FaTimes /></button>}
                    </div>

                    <button onClick={() => setShowDirections(!showDirections)}
                        className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg ${showDirections ? 'bg-blue-500 text-white' : darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                        <FaDirections /> Directions
                    </button>
                </div>

                {/* Directions Panel */}
                {showDirections && (
                    <div className={`px-4 pb-4 space-y-3 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                        <div className="flex gap-2">
                            {[{ icon: FaCar, mode: 'driving' }, { icon: FaWalking, mode: 'walking' }, { icon: FaBus, mode: 'transit' }, { icon: FaBicycle, mode: 'cycling' }].map(({ icon: Icon, mode }) => (
                                <button key={mode} onClick={() => setTransportMode(mode)}
                                    className={`flex-1 py-2 rounded-lg flex items-center justify-center ${transportMode === mode ? 'bg-blue-500 text-white' : darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                                    <Icon />
                                </button>
                            ))}
                        </div>
                        <input type="text" placeholder="From" value={fromLocation} onChange={e => setFromLocation(e.target.value)}
                            className={`w-full px-3 py-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`} />
                        <input type="text" placeholder="To" value={toLocation} onChange={e => setToLocation(e.target.value)}
                            className={`w-full px-3 py-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`} />
                        <button className="w-full py-2 bg-blue-500 text-white rounded-lg">Get Directions</button>
                    </div>
                )}

                {/* Content */}
                <div className="flex-1 overflow-auto">
                    {searchQuery ? (
                        <div className="p-2">
                            <div className="text-xs text-gray-500 px-2 py-1">RESULTS</div>
                            {filteredPlaces.map(place => (
                                <button key={place.id} onClick={() => handlePlaceClick(place)}
                                    className={`w-full p-3 rounded-lg text-left flex items-start gap-3 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                                    <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white"><FaMapMarkerAlt /></div>
                                    <div>
                                        <div className="font-medium">{place.name}</div>
                                        <div className="text-sm text-gray-500">{place.type}</div>
                                        <div className="text-sm text-yellow-500 flex items-center gap-1"><FaStar /> {place.rating}</div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="p-2">
                            <div className="text-xs text-gray-500 px-2 py-1">FAVORITES</div>
                            {favorites.map((fav, i) => (
                                <button key={i} className={`w-full p-3 rounded-lg text-left flex items-center gap-3 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white"><FaStar /></div>
                                    <div><div className="font-medium">{fav.name}</div><div className="text-sm text-gray-500">{fav.address}</div></div>
                                </button>
                            ))}

                            <div className="text-xs text-gray-500 px-2 py-1 mt-4">RECENT</div>
                            {recentSearches.map((search, i) => (
                                <button key={i} onClick={() => setSearchQuery(search)}
                                    className={`w-full p-3 rounded-lg text-left flex items-center gap-3 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                                    <FaSearch className="text-gray-400" /><span>{search}</span>
                                </button>
                            ))}

                            <div className="text-xs text-gray-500 px-2 py-1 mt-4">EXPLORE</div>
                            {places.slice(0, 3).map(place => (
                                <button key={place.id} onClick={() => handlePlaceClick(place)}
                                    className={`w-full p-3 rounded-lg text-left flex items-start gap-3 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-400 to-pink-500" />
                                    <div><div className="font-medium">{place.name}</div><div className="text-sm text-gray-500">{place.type}</div></div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Map Area */}
            <div className="flex-1 relative">
                {/* Simulated Map */}
                <div className={`absolute inset-0 ${mapStyle === 'satellite' ? 'bg-gray-800' : darkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
                    {/* Grid lines */}
                    <svg className="absolute inset-0 w-full h-full opacity-20">
                        {Array.from({ length: 20 }).map((_, i) => (
                            <React.Fragment key={i}>
                                <line x1={`${i * 5}%`} y1="0" x2={`${i * 5}%`} y2="100%" stroke={darkMode ? 'white' : 'gray'} strokeWidth="0.5" />
                                <line x1="0" y1={`${i * 5}%`} x2="100%" y2={`${i * 5}%`} stroke={darkMode ? 'white' : 'gray'} strokeWidth="0.5" />
                            </React.Fragment>
                        ))}
                    </svg>

                    {/* Map markers */}
                    {places.map(place => (
                        <motion.div key={place.id} initial={{ scale: 0 }} animate={{ scale: 1 }}
                            onClick={() => handlePlaceClick(place)}
                            className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-full"
                            style={{ left: `${30 + (place.lng + 122.5) * 50}%`, top: `${70 - (place.lat - 37.7) * 200}%` }}>
                            <div className={`relative ${selectedPlace?.id === place.id ? 'z-10' : ''}`}>
                                <FaMapMarkerAlt className={`text-3xl ${selectedPlace?.id === place.id ? 'text-blue-500' : 'text-red-500'}`} />
                                {selectedPlace?.id === place.id && (
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                        className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 rounded-lg whitespace-nowrap ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                                        <div className="font-semibold">{place.name}</div>
                                        <div className="text-xs text-gray-500">{place.type}</div>
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>
                    ))}

                    {/* San Francisco label */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                        <div className={`text-2xl font-bold ${mapStyle === 'satellite' ? 'text-white' : darkMode ? 'text-gray-300' : 'text-gray-600'}`}>San Francisco</div>
                        <div className={`text-sm ${mapStyle === 'satellite' ? 'text-gray-300' : 'text-gray-500'}`}>California, USA</div>
                    </div>
                </div>

                {/* Map Controls */}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                    <div className={`rounded-lg overflow-hidden shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                        <button onClick={() => setZoom(z => Math.min(z + 1, 20))} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700"><FaPlus /></button>
                        <div className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`} />
                        <button onClick={() => setZoom(z => Math.max(z - 1, 1))} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700"><FaMinus /></button>
                    </div>

                    <button className={`p-3 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}><FaCompass className="text-red-500" /></button>

                    <div className={`rounded-lg overflow-hidden shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                        <button onClick={() => setMapStyle('standard')} className={`p-2 text-xs ${mapStyle === 'standard' ? 'bg-blue-500 text-white' : ''}`}>Map</button>
                        <button onClick={() => setMapStyle('satellite')} className={`p-2 text-xs ${mapStyle === 'satellite' ? 'bg-blue-500 text-white' : ''}`}>Satellite</button>
                    </div>
                </div>

                {/* Location Button */}
                <button className={`absolute bottom-6 right-4 p-3 rounded-full shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    <FaLocationArrow className="text-blue-500" />
                </button>

                {/* Selected Place Card */}
                {selectedPlace && (
                    <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                        className={`absolute bottom-6 left-4 right-20 p-4 rounded-xl shadow-xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-lg font-bold">{selectedPlace.name}</h3>
                                <div className="text-sm text-gray-500">{selectedPlace.type}</div>
                                <div className="flex items-center gap-1 text-yellow-500 mt-1"><FaStar /> {selectedPlace.rating}</div>
                            </div>
                            <button onClick={() => setSelectedPlace(null)} className="text-gray-400"><FaTimes /></button>
                        </div>
                        <div className="flex gap-2 mt-3">
                            <button className="flex-1 py-2 bg-blue-500 text-white rounded-lg flex items-center justify-center gap-2"><FaDirections /> Directions</button>
                            <button className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}><FaStar /></button>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    )
}

export default Maps
