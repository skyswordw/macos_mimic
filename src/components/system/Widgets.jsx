import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../../store/useStore'
import { format, addDays, startOfWeek, isSameDay, addHours } from 'date-fns'
import {
    FaClock, FaCalendarAlt, FaBatteryFull, FaBatteryThreeQuarters,
    FaBatteryHalf, FaBatteryQuarter, FaCloudSun, FaSun, FaMoon,
    FaCloud, FaCloudRain, FaTimes, FaMusic, FaPlay, FaPause,
    FaStepForward, FaStepBackward, FaRegStickyNote, FaChartLine,
    FaBolt, FaPlus, FaGripVertical, FaTasks, FaDesktop, FaCheck,
    FaLightbulb, FaHeart, FaRunning, FaSnowflake, FaThermometerHalf
} from 'react-icons/fa'

// Clock Widget
const ClockWidget = ({ darkMode, size = 'medium' }) => {
    const [time, setTime] = useState(new Date())

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000)
        return () => clearInterval(timer)
    }, [])

    if (size === 'small') {
        return (
            <WidgetContainer darkMode={darkMode} size="small">
                <div className="flex items-center gap-2">
                    <FaClock className="text-orange-500" />
                    <span className="text-2xl font-light">{format(time, 'h:mm')}</span>
                    <span className="text-sm opacity-50">{format(time, 'a')}</span>
                </div>
            </WidgetContainer>
        )
    }

    return (
        <WidgetContainer darkMode={darkMode} size={size}>
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
            {size === 'large' && (
                <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
                    {['Tokyo', 'London', 'New York'].map((city, i) => (
                        <div key={city} className="p-2 rounded-lg bg-black/10 dark:bg-white/10">
                            <div className="opacity-70">{city}</div>
                            <div className="font-medium">{format(addHours(time, [14, 5, 0][i]), 'h:mm a')}</div>
                        </div>
                    ))}
                </div>
            )}
        </WidgetContainer>
    )
}

// Calendar Widget
const CalendarWidget = ({ darkMode, size = 'medium' }) => {
    const [currentDate] = useState(new Date())
    const weekStart = startOfWeek(currentDate)
    const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
    const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))
    const events = [
        { time: '9:00 AM', title: 'Team standup', color: 'bg-blue-500' },
        { time: '2:00 PM', title: 'Design review', color: 'bg-purple-500' },
        { time: '4:30 PM', title: 'Client call', color: 'bg-green-500' },
    ]

    return (
        <WidgetContainer darkMode={darkMode} size={size}>
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
            {size === 'large' && (
                <div className="mt-4 space-y-2">
                    <div className="text-xs font-medium opacity-70">Today's Events</div>
                    {events.map((event, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm">
                            <div className={`w-2 h-2 rounded-full ${event.color}`} />
                            <span className="opacity-70">{event.time}</span>
                            <span className="flex-1 truncate">{event.title}</span>
                        </div>
                    ))}
                </div>
            )}
        </WidgetContainer>
    )
}

// Weather Widget
const WeatherWidget = ({ darkMode, size = 'medium' }) => {
    const [weather] = useState({
        temp: 22,
        condition: 'Partly Cloudy',
        high: 25,
        low: 18,
        location: 'San Francisco',
        humidity: 65,
        wind: 12,
        forecast: [
            { day: 'Tue', temp: 24, icon: FaSun },
            { day: 'Wed', temp: 22, icon: FaCloudSun },
            { day: 'Thu', temp: 19, icon: FaCloudRain },
            { day: 'Fri', temp: 21, icon: FaCloud },
            { day: 'Sat', temp: 23, icon: FaSun },
        ]
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
        <WidgetContainer darkMode={darkMode} size={size} gradient="from-blue-500 to-cyan-500">
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
            {size === 'large' && (
                <>
                    <div className="flex gap-4 mt-4 text-xs">
                        <div className="flex items-center gap-1">
                            <FaThermometerHalf /> {weather.humidity}%
                        </div>
                        <div className="flex items-center gap-1">
                            <FaSnowflake /> {weather.wind} km/h
                        </div>
                    </div>
                    <div className="flex justify-between mt-4 pt-4 border-t border-white/20">
                        {weather.forecast.map((day, i) => (
                            <div key={i} className="text-center">
                                <div className="text-xs opacity-70">{day.day}</div>
                                <day.icon className="my-1 mx-auto" />
                                <div className="text-sm">{day.temp}°</div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </WidgetContainer>
    )
}

// Battery Widget
const BatteryWidget = ({ darkMode, size = 'small' }) => {
    const [battery, setBattery] = useState({ level: 85, charging: false })

    useEffect(() => {
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
        <WidgetContainer darkMode={darkMode} size={size}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <BatteryIcon className={batteryColor} />
                    <span className="text-xs font-medium opacity-70">Battery</span>
                </div>
                <div className="text-2xl font-light">
                    {Math.round(battery.level)}%
                </div>
            </div>
            {size !== 'small' && (
                <>
                    <div className="mt-3 h-2 bg-gray-300 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                            className={`h-full transition-all duration-300 ${
                                battery.level > 20 ? 'bg-green-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${battery.level}%` }}
                        />
                    </div>
                    <div className="text-xs opacity-70 mt-2">
                        {battery.charging ? '⚡ Charging' : 'On Battery'}
                    </div>
                </>
            )}
        </WidgetContainer>
    )
}

// Music Widget
const MusicWidget = ({ darkMode, size = 'medium' }) => {
    const [isPlaying, setIsPlaying] = useState(false)
    const [progress, setProgress] = useState(65)
    const [track] = useState({
        title: 'Blinding Lights',
        artist: 'The Weeknd',
        album: 'After Hours'
    })

    useEffect(() => {
        if (isPlaying) {
            const interval = setInterval(() => {
                setProgress(p => p >= 100 ? 0 : p + 1)
            }, 1000)
            return () => clearInterval(interval)
        }
    }, [isPlaying])

    return (
        <WidgetContainer darkMode={darkMode} size={size} gradient="from-pink-500 to-red-500">
            <div className="flex items-center gap-2 mb-3">
                <FaMusic className="text-white" />
                <span className="text-xs font-medium opacity-80">Now Playing</span>
            </div>
            <div className="font-semibold truncate">{track.title}</div>
            <div className="text-sm opacity-80 truncate">{track.artist}</div>
            <div className="mt-3 h-1 bg-white/30 rounded-full overflow-hidden">
                <motion.div
                    className="h-full bg-white"
                    animate={{ width: `${progress}%` }}
                />
            </div>
            <div className="flex justify-center items-center gap-6 mt-3">
                <FaStepBackward className="cursor-pointer opacity-80 hover:opacity-100" />
                <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center cursor-pointer hover:bg-white/30"
                    onClick={() => setIsPlaying(!isPlaying)}
                >
                    {isPlaying ? <FaPause /> : <FaPlay className="ml-1" />}
                </motion.div>
                <FaStepForward className="cursor-pointer opacity-80 hover:opacity-100" />
            </div>
        </WidgetContainer>
    )
}

// Quick Notes Widget
const NotesWidget = ({ darkMode, size = 'medium' }) => {
    const [notes] = useState([
        { id: 1, content: 'Remember to review PR #42', time: '2h ago' },
        { id: 2, content: 'Meeting with design team at 3pm', time: '5h ago' },
        { id: 3, content: 'Update documentation', time: '1d ago' }
    ])

    return (
        <WidgetContainer darkMode={darkMode} size={size} bg="bg-yellow-100/60 dark:bg-yellow-900/40">
            <div className="flex items-center gap-2 mb-3">
                <FaRegStickyNote className="text-yellow-500" />
                <span className="text-xs font-medium opacity-70">Quick Notes</span>
            </div>
            <div className="space-y-2">
                {notes.slice(0, size === 'large' ? 5 : 3).map(note => (
                    <div key={note.id} className="text-sm">
                        <div className="truncate">{note.content}</div>
                        <div className="text-xs opacity-50">{note.time}</div>
                    </div>
                ))}
            </div>
        </WidgetContainer>
    )
}

// Stocks Widget
const StocksWidget = ({ darkMode, size = 'medium' }) => {
    const [stocks] = useState([
        { symbol: 'AAPL', name: 'Apple', price: 189.95, change: 2.34, positive: true },
        { symbol: 'GOOGL', name: 'Google', price: 141.80, change: -0.87, positive: false },
        { symbol: 'MSFT', name: 'Microsoft', price: 378.91, change: 4.21, positive: true },
        { symbol: 'AMZN', name: 'Amazon', price: 178.25, change: 1.56, positive: true },
    ])

    return (
        <WidgetContainer darkMode={darkMode} size={size}>
            <div className="flex items-center gap-2 mb-3">
                <FaChartLine className="text-green-500" />
                <span className="text-xs font-medium opacity-70">Stocks</span>
            </div>
            <div className="space-y-2">
                {stocks.slice(0, size === 'large' ? 4 : 2).map(stock => (
                    <div key={stock.symbol} className="flex justify-between items-center">
                        <div>
                            <div className="font-medium text-sm">{stock.symbol}</div>
                            <div className="text-xs opacity-50">{stock.name}</div>
                        </div>
                        <div className="text-right">
                            <div className="text-sm">${stock.price}</div>
                            <div className={`text-xs ${stock.positive ? 'text-green-500' : 'text-red-500'}`}>
                                {stock.positive ? '+' : ''}{stock.change}%
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </WidgetContainer>
    )
}

// Reminders Widget
const RemindersWidget = ({ darkMode, size = 'medium' }) => {
    const [reminders, setReminders] = useState([
        { id: 1, text: 'Call mom', done: false },
        { id: 2, text: 'Buy groceries', done: true },
        { id: 3, text: 'Review presentation', done: false },
        { id: 4, text: 'Schedule dentist', done: false },
    ])

    const toggleReminder = (id) => {
        setReminders(prev => prev.map(r =>
            r.id === id ? { ...r, done: !r.done } : r
        ))
    }

    return (
        <WidgetContainer darkMode={darkMode} size={size}>
            <div className="flex items-center gap-2 mb-3">
                <FaTasks className="text-blue-500" />
                <span className="text-xs font-medium opacity-70">Reminders</span>
            </div>
            <div className="space-y-2">
                {reminders.slice(0, size === 'large' ? 4 : 3).map(reminder => (
                    <motion.div
                        key={reminder.id}
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => toggleReminder(reminder.id)}
                        whileTap={{ scale: 0.98 }}
                    >
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            reminder.done
                                ? 'bg-blue-500 border-blue-500'
                                : 'border-gray-400'
                        }`}>
                            {reminder.done && <FaCheck className="text-white text-xs" />}
                        </div>
                        <span className={`text-sm ${reminder.done ? 'line-through opacity-50' : ''}`}>
                            {reminder.text}
                        </span>
                    </motion.div>
                ))}
            </div>
        </WidgetContainer>
    )
}

// Screen Time Widget
const ScreenTimeWidget = ({ darkMode, size = 'medium' }) => {
    const [time] = useState({
        total: '4h 23m',
        apps: [
            { name: 'Safari', time: '1h 45m', percent: 40 },
            { name: 'VS Code', time: '1h 12m', percent: 28 },
            { name: 'Messages', time: '45m', percent: 17 },
            { name: 'Music', time: '41m', percent: 15 },
        ]
    })

    return (
        <WidgetContainer darkMode={darkMode} size={size}>
            <div className="flex items-center gap-2 mb-3">
                <FaDesktop className="text-purple-500" />
                <span className="text-xs font-medium opacity-70">Screen Time</span>
            </div>
            <div className="text-2xl font-light">{time.total}</div>
            <div className="text-xs opacity-50 mb-3">Today</div>
            {size !== 'small' && (
                <div className="space-y-2">
                    {time.apps.slice(0, size === 'large' ? 4 : 2).map((app, i) => (
                        <div key={i}>
                            <div className="flex justify-between text-xs mb-1">
                                <span>{app.name}</span>
                                <span className="opacity-70">{app.time}</span>
                            </div>
                            <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-purple-500"
                                    style={{ width: `${app.percent}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </WidgetContainer>
    )
}

// Tips Widget
const TipsWidget = ({ darkMode }) => {
    const tips = [
        'Press Cmd+Space to open Spotlight search',
        'Use three-finger swipe to switch desktops',
        'Hold Option key for advanced menu options',
        'Press Cmd+Shift+5 for screenshot options',
    ]
    const [currentTip, setCurrentTip] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTip(t => (t + 1) % tips.length)
        }, 5000)
        return () => clearInterval(interval)
    }, [])

    return (
        <WidgetContainer darkMode={darkMode} size="small">
            <div className="flex items-center gap-2">
                <FaLightbulb className="text-yellow-500" />
                <AnimatePresence mode="wait">
                    <motion.span
                        key={currentTip}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-sm"
                    >
                        {tips[currentTip]}
                    </motion.span>
                </AnimatePresence>
            </div>
        </WidgetContainer>
    )
}

// Activity Widget
const ActivityWidget = ({ darkMode, size = 'medium' }) => {
    const [activity] = useState({
        move: { current: 320, goal: 400 },
        exercise: { current: 22, goal: 30 },
        stand: { current: 8, goal: 12 },
    })

    const Ring = ({ value, max, color, size: ringSize }) => {
        const percent = (value / max) * 100
        const circumference = 2 * Math.PI * (ringSize / 2 - 4)
        return (
            <svg width={ringSize} height={ringSize} className="transform -rotate-90">
                <circle
                    cx={ringSize / 2}
                    cy={ringSize / 2}
                    r={ringSize / 2 - 4}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="6"
                    className="text-gray-300 dark:text-gray-600"
                />
                <circle
                    cx={ringSize / 2}
                    cy={ringSize / 2}
                    r={ringSize / 2 - 4}
                    fill="none"
                    stroke={color}
                    strokeWidth="6"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference * (1 - percent / 100)}
                    strokeLinecap="round"
                />
            </svg>
        )
    }

    return (
        <WidgetContainer darkMode={darkMode} size={size}>
            <div className="flex items-center gap-2 mb-3">
                <FaHeart className="text-red-500" />
                <span className="text-xs font-medium opacity-70">Activity</span>
            </div>
            <div className="flex justify-center relative" style={{ height: 80 }}>
                <div className="absolute" style={{ top: 0 }}>
                    <Ring value={activity.move.current} max={activity.move.goal} color="#ef4444" size={80} />
                </div>
                <div className="absolute" style={{ top: 10 }}>
                    <Ring value={activity.exercise.current} max={activity.exercise.goal} color="#22c55e" size={60} />
                </div>
                <div className="absolute" style={{ top: 20 }}>
                    <Ring value={activity.stand.current} max={activity.stand.goal} color="#3b82f6" size={40} />
                </div>
            </div>
            {size !== 'small' && (
                <div className="flex justify-around text-xs mt-3">
                    <div className="text-center">
                        <div className="text-red-500 font-medium">{activity.move.current}</div>
                        <div className="opacity-50">MOVE</div>
                    </div>
                    <div className="text-center">
                        <div className="text-green-500 font-medium">{activity.exercise.current}</div>
                        <div className="opacity-50">EXERCISE</div>
                    </div>
                    <div className="text-center">
                        <div className="text-blue-500 font-medium">{activity.stand.current}</div>
                        <div className="opacity-50">STAND</div>
                    </div>
                </div>
            )}
        </WidgetContainer>
    )
}

// Widget Container Component
const WidgetContainer = ({ children, darkMode, size = 'medium', gradient, bg }) => {
    const sizeClasses = {
        small: 'p-3',
        medium: 'p-4',
        large: 'p-4'
    }

    const bgClass = gradient
        ? `bg-gradient-to-br ${gradient} text-white`
        : bg || (darkMode ? 'bg-gray-800/60 text-white' : 'bg-white/60 text-gray-800')

    return (
        <motion.div
            className={`rounded-2xl backdrop-blur-xl border transition-colors ${sizeClasses[size]} ${bgClass} ${
                darkMode ? 'border-gray-700/50' : 'border-gray-200/50'
            }`}
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        >
            {children}
        </motion.div>
    )
}

// Available widgets for the gallery
const availableWidgets = [
    { id: 'clock', name: 'Clock', component: ClockWidget, icon: FaClock },
    { id: 'calendar', name: 'Calendar', component: CalendarWidget, icon: FaCalendarAlt },
    { id: 'weather', name: 'Weather', component: WeatherWidget, icon: FaCloudSun },
    { id: 'battery', name: 'Battery', component: BatteryWidget, icon: FaBatteryFull },
    { id: 'music', name: 'Music', component: MusicWidget, icon: FaMusic },
    { id: 'notes', name: 'Notes', component: NotesWidget, icon: FaRegStickyNote },
    { id: 'stocks', name: 'Stocks', component: StocksWidget, icon: FaChartLine },
    { id: 'reminders', name: 'Reminders', component: RemindersWidget, icon: FaTasks },
    { id: 'screentime', name: 'Screen Time', component: ScreenTimeWidget, icon: FaDesktop },
    { id: 'tips', name: 'Tips', component: TipsWidget, icon: FaLightbulb },
    { id: 'activity', name: 'Activity', component: ActivityWidget, icon: FaHeart },
]

// Main Widgets Panel
const Widgets = () => {
    const { darkMode, showWidgets, toggleWidgets } = useStore()
    const [activeWidgets, setActiveWidgets] = useState([
        { id: 'clock', size: 'medium' },
        { id: 'weather', size: 'large' },
        { id: 'calendar', size: 'medium' },
        { id: 'activity', size: 'medium' },
        { id: 'music', size: 'medium' },
        { id: 'reminders', size: 'medium' },
    ])
    const [showGallery, setShowGallery] = useState(false)

    const toggleWidget = (widgetId) => {
        const exists = activeWidgets.find(w => w.id === widgetId)
        if (exists) {
            setActiveWidgets(prev => prev.filter(w => w.id !== widgetId))
        } else {
            setActiveWidgets(prev => [...prev, { id: widgetId, size: 'medium' }])
        }
    }

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
                        className={`fixed right-0 top-8 bottom-20 w-96 z-50 overflow-y-auto p-4 space-y-4 ${
                            darkMode ? 'bg-black/30 backdrop-blur-xl' : 'bg-white/30 backdrop-blur-xl'
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
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setShowGallery(!showGallery)}
                                    className={`p-2 rounded-full transition-colors ${
                                        darkMode
                                            ? 'hover:bg-white/10 text-white'
                                            : 'hover:bg-black/10 text-gray-800'
                                    }`}
                                >
                                    <FaPlus />
                                </button>
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
                        </div>

                        {/* Widget Gallery */}
                        <AnimatePresence>
                            {showGallery && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden mb-4"
                                >
                                    <div className={`p-4 rounded-2xl ${darkMode ? 'bg-gray-800/60' : 'bg-white/60'}`}>
                                        <h3 className="text-sm font-medium mb-3 opacity-70">Add Widgets</h3>
                                        <div className="grid grid-cols-4 gap-2">
                                            {availableWidgets.map(widget => {
                                                const isActive = activeWidgets.some(w => w.id === widget.id)
                                                return (
                                                    <button
                                                        key={widget.id}
                                                        onClick={() => toggleWidget(widget.id)}
                                                        className={`p-3 rounded-xl flex flex-col items-center gap-1 transition-colors ${
                                                            isActive
                                                                ? 'bg-blue-500 text-white'
                                                                : darkMode
                                                                ? 'bg-gray-700 hover:bg-gray-600'
                                                                : 'bg-gray-100 hover:bg-gray-200'
                                                        }`}
                                                    >
                                                        <widget.icon className="text-lg" />
                                                        <span className="text-xs">{widget.name}</span>
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Active Widgets */}
                        {activeWidgets.map(({ id, size }) => {
                            const widget = availableWidgets.find(w => w.id === id)
                            if (!widget) return null
                            const WidgetComponent = widget.component
                            return (
                                <WidgetComponent key={id} darkMode={darkMode} size={size} />
                            )
                        })}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}

export default Widgets
