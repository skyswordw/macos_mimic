import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../../store/useStore'
import { format, addDays, startOfWeek, isSameDay } from 'date-fns'
import {
    FaClock, FaCalendarAlt, FaBatteryFull, FaBatteryThreeQuarters,
    FaBatteryHalf, FaBatteryQuarter, FaCloudSun, FaSun, FaMoon,
    FaCloud, FaCloudRain, FaTimes, FaMusic, FaPlay, FaPause,
    FaStepForward, FaStepBackward, FaRegStickyNote
} from 'react-icons/fa'

// Clock Widget
const ClockWidget = ({ darkMode }) => {
    const [time, setTime] = useState(new Date())

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000)
        return () => clearInterval(timer)
    }, [])

    return (
        <div className={`p-4 rounded-2xl backdrop-blur-xl border transition-colors ${
            darkMode
                ? 'bg-gray-800/60 border-gray-700/50 text-white'
                : 'bg-white/60 border-gray-200/50 text-gray-800'
        }`}>
            <div className="flex items-center gap-2 mb-2">
                <FaClock className="text-orange-500" />
                <span className="text-xs font-medium opacity-70">Clock</span>
            </div>
            <div className="text-4xl font-light tracking-tight">
                {format(time, 'h:mm')}
                <span className="text-lg ml-1">{format(time, 'ss')}</span>
            </div>
            <div className="text-sm opacity-70 mt-1">
                {format(time, 'EEEE, MMMM d')}
            </div>
        </div>
    )
}

// Calendar Widget
const CalendarWidget = ({ darkMode }) => {
    const [currentDate] = useState(new Date())
    const weekStart = startOfWeek(currentDate)
    const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
    const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

    return (
        <div className={`p-4 rounded-2xl backdrop-blur-xl border transition-colors ${
            darkMode
                ? 'bg-gray-800/60 border-gray-700/50 text-white'
                : 'bg-white/60 border-gray-200/50 text-gray-800'
        }`}>
            <div className="flex items-center gap-2 mb-3">
                <FaCalendarAlt className="text-red-500" />
                <span className="text-xs font-medium opacity-70">Calendar</span>
            </div>
            <div className="text-xl font-semibold mb-3">
                {format(currentDate, 'MMMM yyyy')}
            </div>
            <div className="grid grid-cols-7 gap-1 text-center">
                {days.map((day, i) => (
                    <div key={i} className="text-xs opacity-50 py-1">{day}</div>
                ))}
                {weekDays.map((day, i) => (
                    <div
                        key={i}
                        className={`text-sm py-1 rounded-full ${
                            isSameDay(day, currentDate)
                                ? 'bg-red-500 text-white'
                                : ''
                        }`}
                    >
                        {format(day, 'd')}
                    </div>
                ))}
            </div>
        </div>
    )
}

// Weather Widget
const WeatherWidget = ({ darkMode }) => {
    const [weather] = useState({
        temp: 22,
        condition: 'Partly Cloudy',
        high: 25,
        low: 18,
        location: 'San Francisco'
    })

    const getWeatherIcon = () => {
        const hour = new Date().getHours()
        if (hour >= 6 && hour < 18) {
            return weather.condition.includes('Cloud') ? FaCloudSun : FaSun
        }
        return FaMoon
    }
    const WeatherIcon = getWeatherIcon()

    return (
        <div className={`p-4 rounded-2xl backdrop-blur-xl border transition-colors ${
            darkMode
                ? 'bg-gradient-to-br from-blue-900/60 to-purple-900/60 border-gray-700/50 text-white'
                : 'bg-gradient-to-br from-blue-400/60 to-cyan-400/60 border-gray-200/50 text-white'
        }`}>
            <div className="flex justify-between items-start">
                <div>
                    <div className="text-sm opacity-80">{weather.location}</div>
                    <div className="text-5xl font-light mt-1">{weather.temp}°</div>
                    <div className="text-sm mt-1">{weather.condition}</div>
                </div>
                <WeatherIcon className="text-4xl opacity-80" />
            </div>
            <div className="flex gap-4 mt-3 text-sm">
                <span>H: {weather.high}°</span>
                <span>L: {weather.low}°</span>
            </div>
        </div>
    )
}

// Battery Widget
const BatteryWidget = ({ darkMode }) => {
    const [battery, setBattery] = useState({ level: 85, charging: false })

    useEffect(() => {
        // Simulate battery level
        const interval = setInterval(() => {
            setBattery(prev => ({
                ...prev,
                level: Math.max(10, prev.level - Math.random() * 0.5)
            }))
        }, 30000)
        return () => clearInterval(interval)
    }, [])

    const getBatteryIcon = () => {
        if (battery.level > 75) return FaBatteryFull
        if (battery.level > 50) return FaBatteryThreeQuarters
        if (battery.level > 25) return FaBatteryHalf
        return FaBatteryQuarter
    }
    const BatteryIcon = getBatteryIcon()
    const batteryColor = battery.level > 20 ? 'text-green-500' : 'text-red-500'

    return (
        <div className={`p-4 rounded-2xl backdrop-blur-xl border transition-colors ${
            darkMode
                ? 'bg-gray-800/60 border-gray-700/50 text-white'
                : 'bg-white/60 border-gray-200/50 text-gray-800'
        }`}>
            <div className="flex items-center gap-2 mb-2">
                <BatteryIcon className={batteryColor} />
                <span className="text-xs font-medium opacity-70">Battery</span>
            </div>
            <div className="text-3xl font-light">
                {Math.round(battery.level)}%
            </div>
            <div className="mt-2 h-2 bg-gray-300 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                    className={`h-full transition-all duration-300 ${
                        battery.level > 20 ? 'bg-green-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${battery.level}%` }}
                />
            </div>
            <div className="text-xs opacity-70 mt-2">
                {battery.charging ? 'Charging' : 'On Battery'}
            </div>
        </div>
    )
}

// Music Widget
const MusicWidget = ({ darkMode }) => {
    const [isPlaying, setIsPlaying] = useState(false)
    const [track] = useState({
        title: 'Blinding Lights',
        artist: 'The Weeknd',
        album: 'After Hours',
        progress: 65
    })

    return (
        <div className={`p-4 rounded-2xl backdrop-blur-xl border transition-colors ${
            darkMode
                ? 'bg-gradient-to-br from-pink-900/60 to-red-900/60 border-gray-700/50 text-white'
                : 'bg-gradient-to-br from-pink-400/60 to-red-400/60 border-gray-200/50 text-white'
        }`}>
            <div className="flex items-center gap-2 mb-3">
                <FaMusic className="text-white" />
                <span className="text-xs font-medium opacity-80">Now Playing</span>
            </div>
            <div className="font-semibold truncate">{track.title}</div>
            <div className="text-sm opacity-80 truncate">{track.artist}</div>
            <div className="mt-3 h-1 bg-white/30 rounded-full overflow-hidden">
                <div
                    className="h-full bg-white transition-all duration-300"
                    style={{ width: `${track.progress}%` }}
                />
            </div>
            <div className="flex justify-center items-center gap-6 mt-3">
                <FaStepBackward className="cursor-pointer opacity-80 hover:opacity-100" />
                <div
                    className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center cursor-pointer hover:bg-white/30"
                    onClick={() => setIsPlaying(!isPlaying)}
                >
                    {isPlaying ? <FaPause /> : <FaPlay className="ml-1" />}
                </div>
                <FaStepForward className="cursor-pointer opacity-80 hover:opacity-100" />
            </div>
        </div>
    )
}

// Quick Notes Widget
const NotesWidget = ({ darkMode }) => {
    const [notes] = useState([
        { id: 1, content: 'Remember to review PR #42', time: '2h ago' },
        { id: 2, content: 'Meeting with design team at 3pm', time: '5h ago' },
        { id: 3, content: 'Update documentation', time: '1d ago' }
    ])

    return (
        <div className={`p-4 rounded-2xl backdrop-blur-xl border transition-colors ${
            darkMode
                ? 'bg-yellow-900/40 border-gray-700/50 text-white'
                : 'bg-yellow-100/60 border-yellow-200/50 text-gray-800'
        }`}>
            <div className="flex items-center gap-2 mb-3">
                <FaRegStickyNote className="text-yellow-500" />
                <span className="text-xs font-medium opacity-70">Quick Notes</span>
            </div>
            <div className="space-y-2">
                {notes.slice(0, 3).map(note => (
                    <div key={note.id} className="text-sm">
                        <div className="truncate">{note.content}</div>
                        <div className="text-xs opacity-50">{note.time}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}

// Main Widgets Panel
const Widgets = () => {
    const { darkMode, showWidgets, toggleWidgets } = useStore()

    return (
        <AnimatePresence>
            {showWidgets && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className="fixed inset-0 z-40"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={toggleWidgets}
                    />

                    {/* Widgets Panel */}
                    <motion.div
                        className={`fixed right-0 top-8 bottom-20 w-80 z-50 overflow-y-auto p-4 space-y-4 ${
                            darkMode ? 'bg-black/20' : 'bg-white/10'
                        }`}
                        initial={{ x: '100%', opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: '100%', opacity: 0 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                Widgets
                            </h2>
                            <button
                                onClick={toggleWidgets}
                                className={`p-2 rounded-full transition-colors ${
                                    darkMode
                                        ? 'hover:bg-white/10 text-white'
                                        : 'hover:bg-black/10 text-gray-800'
                                }`}
                            >
                                <FaTimes />
                            </button>
                        </div>

                        <ClockWidget darkMode={darkMode} />
                        <WeatherWidget darkMode={darkMode} />
                        <CalendarWidget darkMode={darkMode} />
                        <BatteryWidget darkMode={darkMode} />
                        <MusicWidget darkMode={darkMode} />
                        <NotesWidget darkMode={darkMode} />
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}

export default Widgets
