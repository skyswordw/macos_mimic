import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../store/useStore'
import { FaVideo, FaVideoSlash, FaMicrophone, FaMicrophoneSlash, FaPhoneSlash, FaUserPlus, FaExpand, FaCompress, FaVolumeUp, FaEllipsisH, FaSearch, FaPhone, FaClock, FaUser, FaTimes, FaCamera, FaStar, FaChevronDown } from 'react-icons/fa'

const FaceTime = () => {
    const { darkMode, addNotification } = useStore()
    const [activeTab, setActiveTab] = useState('all')
    const [inCall, setInCall] = useState(false)
    const [callWith, setCallWith] = useState(null)
    const [videoEnabled, setVideoEnabled] = useState(true)
    const [audioEnabled, setAudioEnabled] = useState(true)
    const [isFullscreen, setIsFullscreen] = useState(false)
    const [callDuration, setCallDuration] = useState(0)
    const [showNewCall, setShowNewCall] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const videoRef = useRef(null)
    const callTimerRef = useRef(null)

    const contacts = [
        { id: 1, name: 'John Doe', email: 'john@example.com', favorite: true, avatar: '👨' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', favorite: true, avatar: '👩' },
        { id: 3, name: 'Bob Johnson', email: 'bob@example.com', favorite: false, avatar: '👨‍🦰' },
        { id: 4, name: 'Alice Brown', email: 'alice@example.com', favorite: false, avatar: '👩‍🦱' },
        { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', favorite: true, avatar: '🧑' },
    ]

    const recentCalls = [
        { id: 1, contact: contacts[0], type: 'video', direction: 'outgoing', time: 'Today, 10:30 AM', duration: '5:23', missed: false },
        { id: 2, contact: contacts[1], type: 'audio', direction: 'incoming', time: 'Today, 9:15 AM', duration: '12:45', missed: false },
        { id: 3, contact: contacts[2], type: 'video', direction: 'incoming', time: 'Yesterday', duration: null, missed: true },
        { id: 4, contact: contacts[3], type: 'video', direction: 'outgoing', time: 'Yesterday', duration: '3:12', missed: false },
    ]

    useEffect(() => {
        if (inCall) {
            callTimerRef.current = setInterval(() => setCallDuration(d => d + 1), 1000)
        } else {
            clearInterval(callTimerRef.current)
            setCallDuration(0)
        }
        return () => clearInterval(callTimerRef.current)
    }, [inCall])

    const formatDuration = (seconds) => {
        const m = Math.floor(seconds / 60)
        const s = seconds % 60
        return `${m}:${s.toString().padStart(2, '0')}`
    }

    const startCall = (contact, type = 'video') => {
        setCallWith(contact)
        setInCall(true)
        setVideoEnabled(type === 'video')
        setShowNewCall(false)
        addNotification({ title: 'FaceTime', message: `Calling ${contact.name}...`, app: 'FaceTime' })
    }

    const endCall = () => {
        setInCall(false)
        setCallWith(null)
        setVideoEnabled(true)
        setAudioEnabled(true)
    }

    const filteredContacts = contacts.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.email.toLowerCase().includes(searchQuery.toLowerCase()))

    if (inCall) {
        return (
            <div className="h-full bg-black relative overflow-hidden">
                {/* Remote Video (simulated) */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                    {videoEnabled ? (
                        <div className="text-9xl">{callWith?.avatar}</div>
                    ) : (
                        <div className="text-center">
                            <div className="text-6xl mb-4">{callWith?.avatar}</div>
                            <div className="text-white text-xl">{callWith?.name}</div>
                        </div>
                    )}
                </div>

                {/* Self View */}
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-4 right-4 w-32 h-48 bg-gray-700 rounded-lg overflow-hidden shadow-xl">
                    {videoEnabled ? (
                        <div className="w-full h-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                            <FaCamera className="text-white text-3xl opacity-50" />
                        </div>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <FaVideoSlash className="text-white text-3xl" />
                        </div>
                    )}
                </motion.div>

                {/* Call Info */}
                <div className="absolute top-4 left-4 text-white">
                    <div className="text-lg font-semibold">{callWith?.name}</div>
                    <div className="text-sm text-gray-300">{formatDuration(callDuration)}</div>
                </div>

                {/* Controls */}
                <motion.div initial={{ y: 100 }} animate={{ y: 0 }} className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-4">
                    <button onClick={() => setAudioEnabled(!audioEnabled)}
                        className={`w-14 h-14 rounded-full flex items-center justify-center ${audioEnabled ? 'bg-gray-700' : 'bg-red-500'}`}>
                        {audioEnabled ? <FaMicrophone className="text-white text-xl" /> : <FaMicrophoneSlash className="text-white text-xl" />}
                    </button>
                    <button onClick={() => setVideoEnabled(!videoEnabled)}
                        className={`w-14 h-14 rounded-full flex items-center justify-center ${videoEnabled ? 'bg-gray-700' : 'bg-red-500'}`}>
                        {videoEnabled ? <FaVideo className="text-white text-xl" /> : <FaVideoSlash className="text-white text-xl" />}
                    </button>
                    <button onClick={endCall} className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center">
                        <FaPhoneSlash className="text-white text-2xl" />
                    </button>
                    <button className="w-14 h-14 rounded-full bg-gray-700 flex items-center justify-center">
                        <FaVolumeUp className="text-white text-xl" />
                    </button>
                    <button onClick={() => setIsFullscreen(!isFullscreen)} className="w-14 h-14 rounded-full bg-gray-700 flex items-center justify-center">
                        {isFullscreen ? <FaCompress className="text-white text-xl" /> : <FaExpand className="text-white text-xl" />}
                    </button>
                </motion.div>
            </div>
        )
    }

    return (
        <div className={`h-full flex flex-col ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
            {/* Header */}
            <div className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-2xl font-bold">FaceTime</h1>
                    <button onClick={() => setShowNewCall(true)} className="p-2 bg-green-500 text-white rounded-full">
                        <FaVideo />
                    </button>
                </div>
                <div className="flex gap-2">
                    {['all', 'missed'].map(tab => (
                        <button key={tab} onClick={() => setActiveTab(tab)}
                            className={`px-4 py-1.5 rounded-full text-sm capitalize ${activeTab === tab ? 'bg-green-500 text-white' : darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Recent Calls */}
            <div className="flex-1 overflow-auto">
                <div className="p-2">
                    {recentCalls.filter(c => activeTab === 'all' || c.missed).map(call => (
                        <motion.div key={call.id} whileHover={{ backgroundColor: darkMode ? 'rgba(55,65,81,0.5)' : 'rgba(243,244,246,1)' }}
                            className="p-3 rounded-lg flex items-center justify-between cursor-pointer"
                            onClick={() => startCall(call.contact, call.type)}>
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-2xl">
                                    {call.contact.avatar}
                                </div>
                                <div>
                                    <div className={`font-medium ${call.missed ? 'text-red-500' : ''}`}>{call.contact.name}</div>
                                    <div className="text-sm text-gray-500 flex items-center gap-1">
                                        {call.type === 'video' ? <FaVideo /> : <FaPhone />}
                                        <span>{call.direction === 'incoming' ? 'Incoming' : 'Outgoing'}</span>
                                        {call.duration && <span>• {call.duration}</span>}
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-sm text-gray-500">{call.time}</div>
                                <button className="text-green-500 mt-1">
                                    {call.type === 'video' ? <FaVideo /> : <FaPhone />}
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Favorites */}
                <div className="px-4 py-2">
                    <div className="text-sm font-semibold text-gray-500 mb-2">FAVORITES</div>
                    <div className="grid grid-cols-3 gap-3">
                        {contacts.filter(c => c.favorite).map(contact => (
                            <button key={contact.id} onClick={() => startCall(contact)}
                                className={`p-4 rounded-xl text-center ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'}`}>
                                <div className="text-3xl mb-2">{contact.avatar}</div>
                                <div className="font-medium text-sm truncate">{contact.name}</div>
                                <div className="flex justify-center gap-2 mt-2">
                                    <button className="p-2 bg-green-500 text-white rounded-full text-xs"><FaVideo /></button>
                                    <button className="p-2 bg-green-500 text-white rounded-full text-xs"><FaPhone /></button>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* New Call Modal */}
            <AnimatePresence>
                {showNewCall && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/50 flex items-end justify-center z-50" onClick={() => setShowNewCall(false)}>
                        <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
                            className={`w-full max-h-[80%] rounded-t-2xl p-4 ${darkMode ? 'bg-gray-800' : 'bg-white'}`} onClick={e => e.stopPropagation()}>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold">New FaceTime</h2>
                                <button onClick={() => setShowNewCall(false)}><FaTimes /></button>
                            </div>
                            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg mb-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                                <FaSearch className="text-gray-500" />
                                <input type="text" placeholder="Search contacts" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                                    className="bg-transparent flex-1 outline-none" />
                            </div>
                            <div className="space-y-2 max-h-60 overflow-auto">
                                {filteredContacts.map(contact => (
                                    <button key={contact.id} onClick={() => startCall(contact)}
                                        className={`w-full p-3 rounded-lg flex items-center gap-3 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                                        <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-xl">{contact.avatar}</div>
                                        <div className="flex-1 text-left">
                                            <div className="font-medium">{contact.name}</div>
                                            <div className="text-sm text-gray-500">{contact.email}</div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="p-2 bg-green-500 text-white rounded-full"><FaVideo /></button>
                                            <button onClick={(e) => { e.stopPropagation(); startCall(contact, 'audio') }} className="p-2 bg-green-500 text-white rounded-full"><FaPhone /></button>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default FaceTime
