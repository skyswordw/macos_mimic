import React, { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaPlay, FaPause, FaStepForward, FaStepBackward, FaRandom, FaRedo, FaVolumeUp, FaVolumeMute, FaHeart, FaRegHeart, FaSearch, FaList, FaMusic, FaHome, FaCompactDisc, FaUser, FaSlidersH, FaWaveSquare } from 'react-icons/fa'
import { useStore } from '../store/useStore'

// Load liked songs from localStorage
const loadLikedSongs = () => {
    try {
        const saved = localStorage.getItem('music-liked-songs')
        if (saved) return JSON.parse(saved)
    } catch (e) {
        console.error('Failed to load liked songs:', e)
    }
    return [2, 4, 6] // Default liked song IDs
}

// Load music settings from localStorage
const loadMusicSettings = () => {
    try {
        const saved = localStorage.getItem('music-settings')
        if (saved) return JSON.parse(saved)
    } catch (e) {
        console.error('Failed to load music settings:', e)
    }
    return { volume: 75, shuffle: false, repeat: false }
}

// Audio synthesis engine for generating music with visualization support
class MusicSynthesizer {
    constructor() {
        this.audioContext = null
        this.masterGain = null
        this.analyser = null
        this.eqFilters = []
        this.isInitialized = false
        this.currentNotes = []
        this.sequencer = null
        this.isPlaying = false
        this.currentStep = 0
        this.bpm = 120
        this.frequencyData = new Uint8Array(64)
        this.eqSettings = [0, 0, 0, 0, 0, 0, 0, 0] // 8-band EQ
    }

    init() {
        if (this.isInitialized) return
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)()

        // Create analyser for visualization
        this.analyser = this.audioContext.createAnalyser()
        this.analyser.fftSize = 128
        this.analyser.smoothingTimeConstant = 0.8
        this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount)

        // Create master gain
        this.masterGain = this.audioContext.createGain()
        this.masterGain.gain.value = 0.3

        // Create 8-band EQ
        const frequencies = [60, 170, 310, 600, 1000, 3000, 6000, 12000]
        let previousNode = this.masterGain

        frequencies.forEach((freq, i) => {
            const filter = this.audioContext.createBiquadFilter()
            filter.type = 'peaking'
            filter.frequency.value = freq
            filter.Q.value = 1
            filter.gain.value = this.eqSettings[i]
            previousNode.connect(filter)
            previousNode = filter
            this.eqFilters.push(filter)
        })

        // Connect last filter to analyser, then to destination
        previousNode.connect(this.analyser)
        this.analyser.connect(this.audioContext.destination)

        this.isInitialized = true
    }

    setVolume(volume) {
        if (this.masterGain) {
            this.masterGain.gain.value = volume * 0.5
        }
    }

    setEQ(band, gain) {
        if (this.eqFilters[band]) {
            this.eqSettings[band] = gain
            this.eqFilters[band].gain.value = gain
        }
    }

    getFrequencyData() {
        if (this.analyser) {
            this.analyser.getByteFrequencyData(this.frequencyData)
        }
        return this.frequencyData
    }

    // Musical note frequencies
    getNoteFrequency(note, octave = 4) {
        const notes = { 'C': 0, 'C#': 1, 'D': 2, 'D#': 3, 'E': 4, 'F': 5, 'F#': 6, 'G': 7, 'G#': 8, 'A': 9, 'A#': 10, 'B': 11 }
        const semitone = notes[note] + (octave - 4) * 12
        return 440 * Math.pow(2, (semitone - 9) / 12)
    }

    playNote(frequency, duration = 0.5, type = 'sine', delay = 0) {
        if (!this.isInitialized) this.init()

        const osc = this.audioContext.createOscillator()
        const gainNode = this.audioContext.createGain()

        osc.type = type
        osc.frequency.value = frequency
        osc.connect(gainNode)
        gainNode.connect(this.masterGain)

        const now = this.audioContext.currentTime + delay
        gainNode.gain.setValueAtTime(0.3, now)
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration)

        osc.start(now)
        osc.stop(now + duration)

        return osc
    }

    // Different song patterns
    getSongPattern(songId) {
        const patterns = {
            1: { // Blinding Lights - synth pop pattern
                bpm: 171,
                type: 'sawtooth',
                notes: [
                    ['F#', 4], ['A', 4], ['B', 4], ['F#', 5],
                    ['E', 5], ['D', 5], ['B', 4], ['A', 4],
                    ['F#', 4], ['A', 4], ['B', 4], ['D', 5],
                    ['C#', 5], ['B', 4], ['A', 4], ['F#', 4]
                ]
            },
            2: { // Levitating - disco pop
                bpm: 103,
                type: 'square',
                notes: [
                    ['G', 4], ['B', 4], ['D', 5], ['G', 5],
                    ['F#', 5], ['D', 5], ['B', 4], ['G', 4],
                    ['A', 4], ['C', 5], ['E', 5], ['A', 5],
                    ['G', 5], ['E', 5], ['C', 5], ['A', 4]
                ]
            },
            3: { // Heat Waves - dreamy
                bpm: 80,
                type: 'sine',
                notes: [
                    ['D', 4], ['F#', 4], ['A', 4], ['D', 5],
                    ['C#', 5], ['A', 4], ['F#', 4], ['D', 4],
                    ['E', 4], ['G', 4], ['B', 4], ['E', 5],
                    ['D', 5], ['B', 4], ['G', 4], ['E', 4]
                ]
            },
            4: { // Stay - upbeat
                bpm: 170,
                type: 'triangle',
                notes: [
                    ['C', 5], ['E', 5], ['G', 5], ['C', 6],
                    ['B', 5], ['G', 5], ['E', 5], ['C', 5],
                    ['D', 5], ['F', 5], ['A', 5], ['D', 6],
                    ['C', 6], ['A', 5], ['F', 5], ['D', 5]
                ]
            },
            5: { // Good 4 U - rock
                bpm: 166,
                type: 'sawtooth',
                notes: [
                    ['A', 4], ['C', 5], ['E', 5], ['A', 5],
                    ['G', 5], ['E', 5], ['C', 5], ['A', 4],
                    ['B', 4], ['D', 5], ['F#', 5], ['B', 5],
                    ['A', 5], ['F#', 5], ['D', 5], ['B', 4]
                ]
            },
            6: { // Shivers - dance pop
                bpm: 141,
                type: 'square',
                notes: [
                    ['E', 4], ['G#', 4], ['B', 4], ['E', 5],
                    ['D#', 5], ['B', 4], ['G#', 4], ['E', 4],
                    ['F#', 4], ['A', 4], ['C#', 5], ['F#', 5],
                    ['E', 5], ['C#', 5], ['A', 4], ['F#', 4]
                ]
            },
            7: { // Industry Baby - brass-like
                bpm: 150,
                type: 'sawtooth',
                notes: [
                    ['G', 4], ['B', 4], ['D', 5], ['G', 5],
                    ['F', 5], ['D', 5], ['B', 4], ['G', 4],
                    ['A', 4], ['C', 5], ['E', 5], ['A', 5],
                    ['G', 5], ['E', 5], ['C', 5], ['A', 4]
                ]
            },
            8: { // Bad Habits - synth
                bpm: 126,
                type: 'sine',
                notes: [
                    ['B', 4], ['D', 5], ['F#', 5], ['B', 5],
                    ['A', 5], ['F#', 5], ['D', 5], ['B', 4],
                    ['C#', 5], ['E', 5], ['G#', 5], ['C#', 6],
                    ['B', 5], ['G#', 5], ['E', 5], ['C#', 5]
                ]
            }
        }
        return patterns[songId] || patterns[1]
    }

    playSong(songId) {
        if (!this.isInitialized) this.init()
        this.stop()

        const pattern = this.getSongPattern(songId)
        this.bpm = pattern.bpm
        this.isPlaying = true
        this.currentStep = 0

        const stepDuration = 60 / this.bpm / 2

        const playStep = () => {
            if (!this.isPlaying) return

            const [note, octave] = pattern.notes[this.currentStep % pattern.notes.length]
            const freq = this.getNoteFrequency(note, octave)
            this.playNote(freq, stepDuration * 0.8, pattern.type)

            // Add bass note
            const bassFreq = this.getNoteFrequency(note, octave - 2)
            this.playNote(bassFreq, stepDuration * 0.8, 'sine')

            this.currentStep++
            this.sequencer = setTimeout(playStep, stepDuration * 1000)
        }

        playStep()
    }

    stop() {
        this.isPlaying = false
        if (this.sequencer) {
            clearTimeout(this.sequencer)
            this.sequencer = null
        }
    }

    resume() {
        if (this.currentSongId) {
            this.playSong(this.currentSongId)
        }
    }
}

const synthesizer = new MusicSynthesizer()

// Default songs data
const defaultSongs = [
    {
        id: 1,
        title: 'Blinding Lights',
        artist: 'The Weeknd',
        album: 'After Hours',
        duration: '3:20',
        durationSec: 200,
        cover: 'https://picsum.photos/seed/1/200'
    },
    {
        id: 2,
        title: 'Levitating',
        artist: 'Dua Lipa',
        album: 'Future Nostalgia',
        duration: '3:23',
        durationSec: 203,
        cover: 'https://picsum.photos/seed/2/200'
    },
    {
        id: 3,
        title: 'Heat Waves',
        artist: 'Glass Animals',
        album: 'Dreamland',
        duration: '3:58',
        durationSec: 238,
        cover: 'https://picsum.photos/seed/3/200'
    },
    {
        id: 4,
        title: 'Stay',
        artist: 'The Kid LAROI, Justin Bieber',
        album: 'Stay',
        duration: '2:21',
        durationSec: 141,
        cover: 'https://picsum.photos/seed/4/200'
    },
    {
        id: 5,
        title: 'Good 4 U',
        artist: 'Olivia Rodrigo',
        album: 'SOUR',
        duration: '2:58',
        durationSec: 178,
        cover: 'https://picsum.photos/seed/5/200'
    },
    {
        id: 6,
        title: 'Shivers',
        artist: 'Ed Sheeran',
        album: '=',
        duration: '3:27',
        durationSec: 207,
        cover: 'https://picsum.photos/seed/6/200'
    },
    {
        id: 7,
        title: 'Industry Baby',
        artist: 'Lil Nas X, Jack Harlow',
        album: 'MONTERO',
        duration: '3:32',
        durationSec: 212,
        cover: 'https://picsum.photos/seed/7/200'
    },
    {
        id: 8,
        title: 'Bad Habits',
        artist: 'Ed Sheeran',
        album: '=',
        duration: '3:50',
        durationSec: 230,
        cover: 'https://picsum.photos/seed/8/200'
    }
]

const Music = () => {
    const { addNotification } = useStore()

    // Load saved liked songs
    const likedSongIds = loadLikedSongs()
    const savedSettings = loadMusicSettings()

    const [songs, setSongs] = useState(() =>
        defaultSongs.map(song => ({
            ...song,
            liked: likedSongIds.includes(song.id)
        }))
    )

    const [playlists] = useState([
        { id: 1, name: 'Liked Songs', count: 42, icon: FaHeart, color: 'text-red-500' },
        { id: 2, name: 'Recently Played', count: 20, icon: FaMusic, color: 'text-blue-500' },
        { id: 3, name: 'Chill Vibes', count: 35, icon: FaCompactDisc, color: 'text-purple-500' },
        { id: 4, name: 'Workout Mix', count: 18, icon: FaList, color: 'text-green-500' }
    ])

    const [currentSong, setCurrentSong] = useState(songs[0])
    const [isPlaying, setIsPlaying] = useState(false)
    const [currentTime, setCurrentTime] = useState(0)
    const [volume, setVolume] = useState(savedSettings.volume)
    const [isMuted, setIsMuted] = useState(false)
    const [shuffle, setShuffle] = useState(savedSettings.shuffle)
    const [repeat, setRepeat] = useState(savedSettings.repeat)
    const [searchTerm, setSearchTerm] = useState('')
    const [currentView, setCurrentView] = useState('library')
    const [likedSongs, setLikedSongs] = useState(songs.filter(s => s.liked))
    const [showEqualizer, setShowEqualizer] = useState(false)
    const [showVisualizer, setShowVisualizer] = useState(false)
    const [visualizerData, setVisualizerData] = useState(new Array(32).fill(0))
    const [eqBands, setEqBands] = useState([0, 0, 0, 0, 0, 0, 0, 0])
    const [visualizerStyle, setVisualizerStyle] = useState('bars') // 'bars', 'wave', 'circle'
    const visualizerRef = useRef(null)

    const progressInterval = useRef(null)

    // Save liked songs to localStorage
    useEffect(() => {
        const likedIds = songs.filter(s => s.liked).map(s => s.id)
        localStorage.setItem('music-liked-songs', JSON.stringify(likedIds))
    }, [songs])

    // Save music settings to localStorage
    useEffect(() => {
        localStorage.setItem('music-settings', JSON.stringify({ volume, shuffle, repeat }))
    }, [volume, shuffle, repeat])

    // Update volume when changed
    useEffect(() => {
        synthesizer.setVolume(isMuted ? 0 : volume / 100)
    }, [volume, isMuted])

    // Play/pause toggle with actual audio
    const togglePlayPause = useCallback(() => {
        if (isPlaying) {
            synthesizer.stop()
            setIsPlaying(false)
        } else {
            synthesizer.playSong(currentSong.id)
            setIsPlaying(true)
        }
    }, [isPlaying, currentSong.id])

    // Play specific song with actual audio
    const playSong = useCallback((song) => {
        setCurrentSong(song)
        setIsPlaying(true)
        setCurrentTime(0)
        synthesizer.playSong(song.id)
    }, [])

    // Next song
    const nextSong = useCallback(() => {
        const currentIndex = songs.findIndex(s => s.id === currentSong.id)
        const nextIndex = shuffle
            ? Math.floor(Math.random() * songs.length)
            : (currentIndex + 1) % songs.length
        const nextSongObj = songs[nextIndex]
        setCurrentSong(nextSongObj)
        setCurrentTime(0)
        if (isPlaying) {
            synthesizer.playSong(nextSongObj.id)
        }
    }, [songs, currentSong.id, shuffle, isPlaying])

    // Previous song
    const prevSong = useCallback(() => {
        const currentIndex = songs.findIndex(s => s.id === currentSong.id)
        const prevIndex = shuffle
            ? Math.floor(Math.random() * songs.length)
            : (currentIndex - 1 + songs.length) % songs.length
        const prevSongObj = songs[prevIndex]
        setCurrentSong(prevSongObj)
        setCurrentTime(0)
        if (isPlaying) {
            synthesizer.playSong(prevSongObj.id)
        }
    }, [songs, currentSong.id, shuffle, isPlaying])

    // Toggle like status
    const toggleLike = useCallback((songId) => {
        setSongs(prevSongs => {
            const updated = prevSongs.map(s =>
                s.id === songId ? { ...s, liked: !s.liked } : s
            )
            setLikedSongs(updated.filter(s => s.liked))
            return updated
        })
    }, [])

    // Toggle mute
    const toggleMute = useCallback(() => {
        setIsMuted(prev => !prev)
    }, [])

    // Progress tracking
    useEffect(() => {
        if (isPlaying) {
            progressInterval.current = setInterval(() => {
                setCurrentTime(prev => {
                    const duration = currentSong.durationSec
                    if (prev >= duration) {
                        if (repeat) {
                            return 0
                        } else {
                            nextSong()
                            return 0
                        }
                    }
                    return prev + 1
                })
            }, 1000)
        } else {
            clearInterval(progressInterval.current)
        }

        return () => clearInterval(progressInterval.current)
    }, [isPlaying, currentSong.durationSec, repeat, nextSong])

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            synthesizer.stop()
        }
    }, [])

    // Visualizer animation loop
    useEffect(() => {
        let animationFrame
        const updateVisualizer = () => {
            if (isPlaying) {
                const data = synthesizer.getFrequencyData()
                // Sample 32 bars from frequency data
                const sampledData = []
                for (let i = 0; i < 32; i++) {
                    const index = Math.floor(i * data.length / 32)
                    sampledData.push(data[index] || 0)
                }
                setVisualizerData(sampledData)
            }
            animationFrame = requestAnimationFrame(updateVisualizer)
        }
        if (showVisualizer && isPlaying) {
            updateVisualizer()
        }
        return () => cancelAnimationFrame(animationFrame)
    }, [showVisualizer, isPlaying])

    // Update EQ when band changes
    const handleEQChange = (band, value) => {
        const newBands = [...eqBands]
        newBands[band] = value
        setEqBands(newBands)
        synthesizer.setEQ(band, value)
    }

    // EQ presets
    const eqPresets = {
        flat: [0, 0, 0, 0, 0, 0, 0, 0],
        bass: [8, 6, 4, 0, 0, 0, 0, 0],
        treble: [0, 0, 0, 0, 2, 4, 6, 8],
        vocal: [-2, 0, 2, 4, 4, 2, 0, -2],
        rock: [5, 4, 0, -2, 0, 2, 4, 5],
        electronic: [6, 4, 0, 2, 4, 6, 4, 2],
        acoustic: [3, 2, 0, 1, 2, 3, 4, 3],
    }

    const applyEQPreset = (presetName) => {
        const preset = eqPresets[presetName]
        if (preset) {
            setEqBands(preset)
            preset.forEach((value, i) => synthesizer.setEQ(i, value))
        }
    }

    // Keyboard shortcuts for media controls
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Only handle if not typing in search
            if (e.target.tagName === 'INPUT') return

            switch (e.key) {
                case ' ':
                    e.preventDefault()
                    togglePlayPause()
                    break
                case 'ArrowRight':
                    if (e.metaKey || e.ctrlKey) {
                        e.preventDefault()
                        nextSong()
                    }
                    break
                case 'ArrowLeft':
                    if (e.metaKey || e.ctrlKey) {
                        e.preventDefault()
                        prevSong()
                    }
                    break
                case 'ArrowUp':
                    if (e.metaKey || e.ctrlKey) {
                        e.preventDefault()
                        setVolume(prev => Math.min(100, prev + 10))
                    }
                    break
                case 'ArrowDown':
                    if (e.metaKey || e.ctrlKey) {
                        e.preventDefault()
                        setVolume(prev => Math.max(0, prev - 10))
                    }
                    break
                case 'm':
                    if (e.metaKey || e.ctrlKey) {
                        e.preventDefault()
                        toggleMute()
                    }
                    break
                case 's':
                    if (e.metaKey || e.ctrlKey) {
                        e.preventDefault()
                        setShuffle(prev => !prev)
                    }
                    break
                case 'r':
                    if (e.metaKey || e.ctrlKey) {
                        e.preventDefault()
                        setRepeat(prev => !prev)
                    }
                    break
                default:
                    break
            }
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [togglePlayPause, nextSong, prevSong, toggleMute])

    // 格式化时间
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    // 过滤歌曲
    const filteredSongs = songs.filter(song =>
        song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        song.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
        song.album.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="w-full h-full flex flex-col bg-gradient-to-br from-gray-900 to-black text-white">
            {/* 顶部导航栏 */}
            <div className="h-16 bg-black/30 backdrop-blur-md border-b border-white/10 flex items-center px-6 gap-4">
                <div className="flex gap-2">
                    <button
                        onClick={() => setCurrentView('library')}
                        className={`px-4 py-2 rounded-full ${currentView === 'library' ? 'bg-white/20' : 'hover:bg-white/10'}`}
                    >
                        Library
                    </button>
                    <button
                        onClick={() => setCurrentView('playlist')}
                        className={`px-4 py-2 rounded-full ${currentView === 'playlist' ? 'bg-white/20' : 'hover:bg-white/10'}`}
                    >
                        Playlists
                    </button>
                    <button
                        onClick={() => setCurrentView('nowplaying')}
                        className={`px-4 py-2 rounded-full ${currentView === 'nowplaying' ? 'bg-white/20' : 'hover:bg-white/10'}`}
                    >
                        Now Playing
                    </button>
                    <button
                        onClick={() => setShowVisualizer(!showVisualizer)}
                        className={`px-4 py-2 rounded-full flex items-center gap-2 ${showVisualizer ? 'bg-purple-500' : 'hover:bg-white/10'}`}
                    >
                        <FaWaveSquare /> Visualizer
                    </button>
                    <button
                        onClick={() => setShowEqualizer(!showEqualizer)}
                        className={`px-4 py-2 rounded-full flex items-center gap-2 ${showEqualizer ? 'bg-green-500' : 'hover:bg-white/10'}`}
                    >
                        <FaSlidersH /> EQ
                    </button>
                </div>

                <div className="flex-1 max-w-md">
                    <div className="relative">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search songs, artists, albums..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-white/10 rounded-full focus:outline-none focus:bg-white/20 placeholder-gray-400"
                        />
                    </div>
                </div>
            </div>

            {/* 主内容区 */}
            <div className="flex-1 flex overflow-hidden">
                {/* 侧边栏 */}
                <div className="w-64 bg-black/20 backdrop-blur-md border-r border-white/10 p-4">
                    <div className="space-y-2">
                        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                            Browse
                        </div>
                        <button className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-white/10">
                            <FaHome className="text-lg" />
                            <span>Home</span>
                        </button>
                        <button className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-white/10">
                            <FaCompactDisc className="text-lg" />
                            <span>Browse</span>
                        </button>
                        <button className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-white/10">
                            <FaUser className="text-lg" />
                            <span>For You</span>
                        </button>
                    </div>

                    <div className="mt-8 space-y-2">
                        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                            Playlists
                        </div>
                        {playlists.map(playlist => (
                            <button
                                key={playlist.id}
                                className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-white/10"
                            >
                                <playlist.icon className={`text-lg ${playlist.color}`} />
                                <div className="flex-1 text-left">
                                    <div className="text-sm">{playlist.name}</div>
                                    <div className="text-xs text-gray-400">{playlist.count} songs</div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* 内容区域 */}
                <div className="flex-1 overflow-auto p-6">
                    {currentView === 'library' && (
                        <div>
                            <h2 className="text-2xl font-bold mb-6">Your Library</h2>
                            <div className="space-y-2">
                                {filteredSongs.map(song => (
                                    <div
                                        key={song.id}
                                        onClick={() => playSong(song)}
                                        className={`flex items-center gap-4 p-3 rounded-lg hover:bg-white/10 cursor-pointer ${
                                            currentSong.id === song.id ? 'bg-white/20' : ''
                                        }`}
                                    >
                                        <img
                                            src={song.cover}
                                            alt={song.title}
                                            className="w-12 h-12 rounded-md object-cover"
                                        />
                                        <div className="flex-1">
                                            <div className="font-medium">{song.title}</div>
                                            <div className="text-sm text-gray-400">{song.artist}</div>
                                        </div>
                                        <div className="text-sm text-gray-400">{song.album}</div>
                                        <div className="text-sm text-gray-400">{song.duration}</div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                toggleLike(song.id)
                                            }}
                                            className="p-2 hover:bg-white/10 rounded-full"
                                        >
                                            {song.liked ? (
                                                <FaHeart className="text-red-500" />
                                            ) : (
                                                <FaRegHeart className="text-gray-400 hover:text-white" />
                                            )}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {currentView === 'playlist' && (
                        <div>
                            <h2 className="text-2xl font-bold mb-6">Your Playlists</h2>
                            <div className="grid grid-cols-2 gap-4">
                                {playlists.map(playlist => (
                                    <div
                                        key={playlist.id}
                                        className="bg-white/10 rounded-lg p-6 hover:bg-white/20 cursor-pointer transition-colors"
                                    >
                                        <div className={`text-4xl mb-4 ${playlist.color}`}>
                                            <playlist.icon />
                                        </div>
                                        <div className="text-xl font-bold">{playlist.name}</div>
                                        <div className="text-gray-400">{playlist.count} songs</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {currentView === 'nowplaying' && (
                        <div className="flex flex-col items-center justify-center h-full">
                            <img
                                src={currentSong.cover}
                                alt={currentSong.title}
                                className="w-64 h-64 rounded-xl shadow-2xl mb-8 object-cover"
                            />
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-bold mb-2">{currentSong.title}</h2>
                                <p className="text-xl text-gray-400">{currentSong.artist}</p>
                                <p className="text-gray-500">{currentSong.album}</p>
                            </div>
                        </div>
                    )}

                    {/* Visualizer Overlay */}
                    <AnimatePresence>
                        {showVisualizer && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                className="absolute inset-0 bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center p-8"
                            >
                                <div className="mb-6 flex gap-4">
                                    {['bars', 'wave', 'circle'].map(style => (
                                        <button
                                            key={style}
                                            onClick={() => setVisualizerStyle(style)}
                                            className={`px-4 py-2 rounded-full capitalize ${
                                                visualizerStyle === style ? 'bg-purple-500' : 'bg-white/10'
                                            }`}
                                        >
                                            {style}
                                        </button>
                                    ))}
                                </div>

                                {visualizerStyle === 'bars' && (
                                    <div className="flex items-end justify-center gap-1 h-64 w-full max-w-2xl">
                                        {visualizerData.map((value, i) => (
                                            <motion.div
                                                key={i}
                                                className="w-4 rounded-t-full"
                                                style={{
                                                    background: `linear-gradient(to top, #8b5cf6, #ec4899)`,
                                                    height: `${Math.max(4, (value / 255) * 256)}px`,
                                                }}
                                                animate={{
                                                    height: `${Math.max(4, (value / 255) * 256)}px`,
                                                }}
                                                transition={{ duration: 0.05 }}
                                            />
                                        ))}
                                    </div>
                                )}

                                {visualizerStyle === 'wave' && (
                                    <svg className="w-full max-w-2xl h-64" viewBox="0 0 320 128">
                                        <defs>
                                            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                                <stop offset="0%" stopColor="#8b5cf6" />
                                                <stop offset="50%" stopColor="#ec4899" />
                                                <stop offset="100%" stopColor="#8b5cf6" />
                                            </linearGradient>
                                        </defs>
                                        <motion.path
                                            d={`M 0 64 ${visualizerData.map((v, i) =>
                                                `L ${i * 10} ${64 - (v / 255) * 60}`
                                            ).join(' ')} L 320 64`}
                                            fill="none"
                                            stroke="url(#waveGradient)"
                                            strokeWidth="3"
                                        />
                                        <motion.path
                                            d={`M 0 64 ${visualizerData.map((v, i) =>
                                                `L ${i * 10} ${64 + (v / 255) * 60}`
                                            ).join(' ')} L 320 64`}
                                            fill="none"
                                            stroke="url(#waveGradient)"
                                            strokeWidth="3"
                                            opacity="0.5"
                                        />
                                    </svg>
                                )}

                                {visualizerStyle === 'circle' && (
                                    <div className="relative w-64 h-64">
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <img
                                                src={currentSong.cover}
                                                alt=""
                                                className={`w-32 h-32 rounded-full object-cover ${isPlaying ? 'animate-spin' : ''}`}
                                                style={{ animationDuration: '4s' }}
                                            />
                                        </div>
                                        {visualizerData.slice(0, 24).map((value, i) => {
                                            const angle = (i / 24) * 360
                                            const radius = 80 + (value / 255) * 50
                                            return (
                                                <motion.div
                                                    key={i}
                                                    className="absolute w-2 h-2 rounded-full"
                                                    style={{
                                                        background: `hsl(${280 + i * 3}, 80%, 60%)`,
                                                        left: '50%',
                                                        top: '50%',
                                                        transform: `rotate(${angle}deg) translateY(-${radius}px)`,
                                                    }}
                                                />
                                            )
                                        })}
                                    </div>
                                )}

                                <div className="mt-8 text-center">
                                    <h2 className="text-2xl font-bold">{currentSong.title}</h2>
                                    <p className="text-gray-400">{currentSong.artist}</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Equalizer Panel */}
                    <AnimatePresence>
                        {showEqualizer && (
                            <motion.div
                                initial={{ opacity: 0, x: 100 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 100 }}
                                className="absolute right-0 top-0 bottom-0 w-80 bg-black/95 backdrop-blur-xl border-l border-white/10 p-6"
                            >
                                <h3 className="text-xl font-bold mb-6">Equalizer</h3>

                                {/* Presets */}
                                <div className="mb-6">
                                    <div className="text-xs text-gray-400 uppercase mb-2">Presets</div>
                                    <div className="flex flex-wrap gap-2">
                                        {Object.keys(eqPresets).map(preset => (
                                            <button
                                                key={preset}
                                                onClick={() => applyEQPreset(preset)}
                                                className="px-3 py-1 rounded-full text-sm bg-white/10 hover:bg-white/20 capitalize"
                                            >
                                                {preset}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* EQ Sliders */}
                                <div className="flex justify-between items-end h-48 mb-4">
                                    {['60', '170', '310', '600', '1k', '3k', '6k', '12k'].map((label, i) => (
                                        <div key={i} className="flex flex-col items-center gap-2">
                                            <div className="h-36 w-6 relative bg-white/10 rounded-full overflow-hidden">
                                                <div
                                                    className="absolute bottom-1/2 left-0 right-0 bg-green-500 transition-all"
                                                    style={{
                                                        height: `${Math.abs(eqBands[i]) * 4}%`,
                                                        transform: eqBands[i] >= 0 ? 'translateY(0)' : 'translateY(100%)',
                                                        bottom: eqBands[i] >= 0 ? '50%' : 'auto',
                                                        top: eqBands[i] < 0 ? '50%' : 'auto',
                                                    }}
                                                />
                                                <input
                                                    type="range"
                                                    min="-12"
                                                    max="12"
                                                    value={eqBands[i]}
                                                    onChange={(e) => handleEQChange(i, parseInt(e.target.value))}
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                    style={{ writingMode: 'bt-lr', transform: 'rotate(-90deg)' }}
                                                />
                                                <div
                                                    className="absolute left-1/2 w-4 h-4 -ml-2 bg-white rounded-full shadow"
                                                    style={{
                                                        top: `${50 - (eqBands[i] / 12) * 45}%`,
                                                    }}
                                                />
                                            </div>
                                            <span className="text-xs text-gray-400">{label}</span>
                                            <span className="text-xs">{eqBands[i] > 0 ? '+' : ''}{eqBands[i]}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="text-center text-xs text-gray-500 mt-4">
                                    Hz
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* 播放控制栏 */}
            <div className="h-24 bg-black/40 backdrop-blur-xl border-t border-white/10 px-6 flex items-center gap-6">
                {/* 当前播放信息 */}
                <div className="flex items-center gap-3 w-64">
                    <img
                        src={currentSong.cover}
                        alt={currentSong.title}
                        className="w-14 h-14 rounded-md object-cover"
                    />
                    <div>
                        <div className="font-medium">{currentSong.title}</div>
                        <div className="text-sm text-gray-400">{currentSong.artist}</div>
                    </div>
                    <button
                        onClick={() => toggleLike(currentSong.id)}
                        className="p-2 hover:bg-white/10 rounded-full"
                    >
                        {currentSong.liked ? (
                            <FaHeart className="text-red-500" />
                        ) : (
                            <FaRegHeart className="text-gray-400 hover:text-white" />
                        )}
                    </button>
                </div>

                {/* 播放控制 */}
                <div className="flex-1 flex flex-col items-center gap-2">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setShuffle(!shuffle)}
                            className={`p-2 rounded-full hover:bg-white/10 ${shuffle ? 'text-green-500' : 'text-gray-400'}`}
                        >
                            <FaRandom />
                        </button>
                        <button
                            onClick={prevSong}
                            className="p-2 rounded-full hover:bg-white/10"
                        >
                            <FaStepBackward className="text-xl" />
                        </button>
                        <button
                            onClick={togglePlayPause}
                            className="p-3 bg-white text-black rounded-full hover:scale-105 transition-transform"
                        >
                            {isPlaying ? <FaPause className="text-xl" /> : <FaPlay className="text-xl ml-0.5" />}
                        </button>
                        <button
                            onClick={nextSong}
                            className="p-2 rounded-full hover:bg-white/10"
                        >
                            <FaStepForward className="text-xl" />
                        </button>
                        <button
                            onClick={() => setRepeat(!repeat)}
                            className={`p-2 rounded-full hover:bg-white/10 ${repeat ? 'text-green-500' : 'text-gray-400'}`}
                        >
                            <FaRedo />
                        </button>
                    </div>

                    {/* Progress bar */}
                    <div className="flex items-center gap-2 w-full max-w-md">
                        <span className="text-xs text-gray-400 w-10 text-right">{formatTime(currentTime)}</span>
                        <div className="flex-1 relative group">
                            <div className="h-1 bg-gray-600 rounded-full">
                                <div
                                    className="h-1 bg-white rounded-full transition-all"
                                    style={{ width: `${(currentTime / currentSong.durationSec) * 100}%` }}
                                />
                            </div>
                            <input
                                type="range"
                                min="0"
                                max={currentSong.durationSec}
                                value={currentTime}
                                onChange={(e) => setCurrentTime(parseInt(e.target.value))}
                                className="absolute inset-0 w-full opacity-0 cursor-pointer"
                            />
                        </div>
                        <span className="text-xs text-gray-400 w-10">{formatTime(currentSong.durationSec)}</span>
                    </div>
                </div>

                {/* Volume control */}
                <div className="flex items-center gap-2 w-36">
                    <button
                        onClick={toggleMute}
                        className="p-1 hover:bg-white/10 rounded-full transition-colors"
                    >
                        {isMuted || volume === 0 ? (
                            <FaVolumeMute className="text-gray-400" />
                        ) : (
                            <FaVolumeUp className="text-gray-400" />
                        )}
                    </button>
                    <div className="flex-1 relative group">
                        <div className="h-1 bg-gray-600 rounded-full">
                            <div
                                className="h-1 bg-white rounded-full transition-all"
                                style={{ width: `${isMuted ? 0 : volume}%` }}
                            />
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={isMuted ? 0 : volume}
                            onChange={(e) => {
                                setVolume(parseInt(e.target.value))
                                if (isMuted) setIsMuted(false)
                            }}
                            className="absolute inset-0 w-full opacity-0 cursor-pointer"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Music