import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../store/useStore'
import { FaMicrophone, FaStop, FaPlay, FaPause, FaTrash, FaEdit, FaCheck, FaShare, FaEllipsisH, FaClock, FaWaveSquare } from 'react-icons/fa'

const VoiceMemos = () => {
    const { darkMode, addNotification } = useStore()
    const [isRecording, setIsRecording] = useState(false)
    const [isPaused, setIsPaused] = useState(false)
    const [recordings, setRecordings] = useState([
        { id: 1, name: 'Meeting Notes', duration: 185, date: '2024-01-15 10:30 AM', data: null },
        { id: 2, name: 'Voice Memo 2', duration: 45, date: '2024-01-14 3:45 PM', data: null },
        { id: 3, name: 'Idea for project', duration: 62, date: '2024-01-13 9:00 AM', data: null },
    ])
    const [selectedRecording, setSelectedRecording] = useState(null)
    const [playingId, setPlayingId] = useState(null)
    const [currentTime, setCurrentTime] = useState(0)
    const [recordingTime, setRecordingTime] = useState(0)
    const [editingId, setEditingId] = useState(null)
    const [editName, setEditName] = useState('')
    const [waveformData, setWaveformData] = useState([])

    const timerRef = useRef(null)
    const playTimerRef = useRef(null)

    useEffect(() => {
        // Generate random waveform for visualization
        const generateWaveform = () => {
            const bars = 50
            return Array.from({ length: bars }, () => Math.random() * 0.8 + 0.2)
        }
        setWaveformData(generateWaveform())
    }, [isRecording])

    useEffect(() => {
        if (isRecording && !isPaused) {
            timerRef.current = setInterval(() => {
                setRecordingTime(prev => prev + 1)
                // Animate waveform
                setWaveformData(prev => prev.map(() => Math.random() * 0.8 + 0.2))
            }, 1000)
        } else {
            clearInterval(timerRef.current)
        }
        return () => clearInterval(timerRef.current)
    }, [isRecording, isPaused])

    useEffect(() => {
        if (playingId) {
            const recording = recordings.find(r => r.id === playingId)
            if (recording) {
                playTimerRef.current = setInterval(() => {
                    setCurrentTime(prev => {
                        if (prev >= recording.duration) {
                            clearInterval(playTimerRef.current)
                            setPlayingId(null)
                            return 0
                        }
                        return prev + 1
                    })
                }, 1000)
            }
        } else {
            clearInterval(playTimerRef.current)
        }
        return () => clearInterval(playTimerRef.current)
    }, [playingId, recordings])

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    const formatDuration = (seconds) => {
        if (seconds < 60) return `${seconds}s`
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`
    }

    const startRecording = () => {
        setIsRecording(true)
        setRecordingTime(0)
        setIsPaused(false)
    }

    const pauseRecording = () => {
        setIsPaused(!isPaused)
    }

    const stopRecording = () => {
        if (recordingTime < 1) {
            setIsRecording(false)
            return
        }

        const newRecording = {
            id: Date.now(),
            name: `Voice Memo ${recordings.length + 1}`,
            duration: recordingTime,
            date: new Date().toLocaleString(),
            data: null
        }
        setRecordings(prev => [newRecording, ...prev])
        setIsRecording(false)
        setRecordingTime(0)
        addNotification({ title: 'Voice Memos', message: 'Recording saved!', app: 'Voice Memos' })
    }

    const togglePlay = (recording) => {
        if (playingId === recording.id) {
            setPlayingId(null)
            setCurrentTime(0)
        } else {
            setPlayingId(recording.id)
            setCurrentTime(0)
        }
    }

    const deleteRecording = (id) => {
        setRecordings(prev => prev.filter(r => r.id !== id))
        if (selectedRecording?.id === id) setSelectedRecording(null)
        if (playingId === id) setPlayingId(null)
    }

    const startEdit = (recording) => {
        setEditingId(recording.id)
        setEditName(recording.name)
    }

    const saveEdit = () => {
        setRecordings(prev => prev.map(r =>
            r.id === editingId ? { ...r, name: editName } : r
        ))
        setEditingId(null)
    }

    return (
        <div className={`h-full flex ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
            {/* Sidebar - Recordings List */}
            <div className={`w-80 border-r flex flex-col ${darkMode ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-white'}`}>
                <div className="p-4 border-b border-gray-700/50">
                    <h2 className="font-semibold">All Recordings</h2>
                    <p className="text-sm text-gray-500">{recordings.length} recordings</p>
                </div>

                <div className="flex-1 overflow-auto">
                    {recordings.map(recording => (
                        <motion.div
                            key={recording.id}
                            whileHover={{ backgroundColor: darkMode ? 'rgba(55,65,81,0.5)' : 'rgba(243,244,246,1)' }}
                            onClick={() => setSelectedRecording(recording)}
                            className={`p-4 cursor-pointer border-b ${darkMode ? 'border-gray-700/50' : 'border-gray-100'} ${
                                selectedRecording?.id === recording.id ? (darkMode ? 'bg-gray-700' : 'bg-blue-50') : ''
                            }`}
                        >
                            <div className="flex items-center justify-between">
                                {editingId === recording.id ? (
                                    <div className="flex items-center gap-2 flex-1">
                                        <input
                                            type="text"
                                            value={editName}
                                            onChange={e => setEditName(e.target.value)}
                                            className={`flex-1 px-2 py-1 rounded ${darkMode ? 'bg-gray-600' : 'bg-white border'}`}
                                            onClick={e => e.stopPropagation()}
                                            autoFocus
                                        />
                                        <button onClick={(e) => { e.stopPropagation(); saveEdit() }} className="text-green-500">
                                            <FaCheck />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex-1">
                                        <div className="font-medium">{recording.name}</div>
                                        <div className="text-sm text-gray-500 flex items-center gap-2">
                                            <span>{recording.date.split(' ')[0]}</span>
                                            <span>•</span>
                                            <span>{formatDuration(recording.duration)}</span>
                                        </div>
                                    </div>
                                )}
                                {playingId === recording.id && (
                                    <motion.div
                                        animate={{ scale: [1, 1.2, 1] }}
                                        transition={{ duration: 1, repeat: Infinity }}
                                        className="w-3 h-3 rounded-full bg-red-500"
                                    />
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {isRecording ? (
                    /* Recording View */
                    <div className="flex-1 flex flex-col items-center justify-center p-8">
                        <motion.div
                            animate={{ scale: isPaused ? 1 : [1, 1.05, 1] }}
                            transition={{ duration: 1, repeat: Infinity }}
                            className="w-32 h-32 rounded-full bg-red-500 flex items-center justify-center mb-8 shadow-lg"
                        >
                            <FaMicrophone className="text-5xl text-white" />
                        </motion.div>

                        <div className="text-5xl font-light mb-8 font-mono">
                            {formatTime(recordingTime)}
                        </div>

                        {/* Waveform Visualization */}
                        <div className="flex items-center justify-center gap-1 h-20 mb-8">
                            {waveformData.map((height, i) => (
                                <motion.div
                                    key={i}
                                    animate={{ height: isPaused ? 4 : height * 80 }}
                                    className="w-1 bg-red-500 rounded-full"
                                    style={{ height: height * 80 }}
                                />
                            ))}
                        </div>

                        <div className="flex items-center gap-6">
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={pauseRecording}
                                className={`w-14 h-14 rounded-full flex items-center justify-center ${
                                    isPaused ? 'bg-green-500' : darkMode ? 'bg-gray-700' : 'bg-gray-200'
                                }`}
                            >
                                {isPaused ? <FaPlay className="text-white" /> : <FaPause />}
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={stopRecording}
                                className="w-20 h-20 rounded-full bg-red-500 flex items-center justify-center shadow-lg"
                            >
                                <FaStop className="text-2xl text-white" />
                            </motion.button>
                        </div>

                        <p className="mt-8 text-gray-500">
                            {isPaused ? 'Recording paused' : 'Recording...'}
                        </p>
                    </div>
                ) : selectedRecording ? (
                    /* Playback View */
                    <div className="flex-1 flex flex-col p-8">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h1 className="text-2xl font-bold">{selectedRecording.name}</h1>
                                <p className="text-gray-500">{selectedRecording.date}</p>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => startEdit(selectedRecording)}
                                    className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                                    <FaEdit />
                                </button>
                                <button className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                                    <FaShare />
                                </button>
                                <button onClick={() => deleteRecording(selectedRecording.id)}
                                    className="p-2 rounded-lg bg-red-500 text-white">
                                    <FaTrash />
                                </button>
                            </div>
                        </div>

                        {/* Waveform Display */}
                        <div className={`flex-1 flex items-center justify-center rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                            <div className="flex items-center gap-1 h-32">
                                {Array.from({ length: 60 }).map((_, i) => {
                                    const progress = (currentTime / selectedRecording.duration) * 60
                                    const height = Math.sin(i * 0.3) * 0.5 + 0.5
                                    return (
                                        <div
                                            key={i}
                                            className={`w-1.5 rounded-full transition-colors ${
                                                i < progress ? 'bg-red-500' : darkMode ? 'bg-gray-600' : 'bg-gray-300'
                                            }`}
                                            style={{ height: `${height * 100 + 20}%` }}
                                        />
                                    )
                                })}
                            </div>
                        </div>

                        {/* Playback Controls */}
                        <div className="mt-8 flex flex-col items-center">
                            <div className="flex items-center gap-2 w-full max-w-md mb-4">
                                <span className="text-sm text-gray-500 w-12">{formatTime(currentTime)}</span>
                                <div className="flex-1 h-1 bg-gray-600 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-red-500 transition-all"
                                        style={{ width: `${(currentTime / selectedRecording.duration) * 100}%` }}
                                    />
                                </div>
                                <span className="text-sm text-gray-500 w-12 text-right">{formatTime(selectedRecording.duration)}</span>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => togglePlay(selectedRecording)}
                                className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center shadow-lg"
                            >
                                {playingId === selectedRecording.id ? (
                                    <FaPause className="text-2xl text-white" />
                                ) : (
                                    <FaPlay className="text-2xl text-white ml-1" />
                                )}
                            </motion.button>
                        </div>
                    </div>
                ) : (
                    /* Empty State / Record Button */
                    <div className="flex-1 flex flex-col items-center justify-center p-8">
                        <div className={`w-40 h-40 rounded-full flex items-center justify-center mb-8 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                            <FaWaveSquare className="text-6xl text-gray-400" />
                        </div>
                        <h2 className="text-xl font-semibold mb-2">Ready to Record</h2>
                        <p className="text-gray-500 mb-8">Tap the button below to start recording</p>

                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={startRecording}
                            className="w-20 h-20 rounded-full bg-red-500 flex items-center justify-center shadow-lg"
                        >
                            <FaMicrophone className="text-3xl text-white" />
                        </motion.button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default VoiceMemos
