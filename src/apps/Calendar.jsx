import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaChevronLeft, FaChevronRight, FaPlus, FaTimes, FaClock, FaMapMarkerAlt, FaCalendarAlt, FaCircle } from 'react-icons/fa'
import { useStore } from '../store/useStore'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

const eventColors = [
    { name: 'red', bg: 'bg-red-500', text: 'text-red-500', light: 'bg-red-100' },
    { name: 'blue', bg: 'bg-blue-500', text: 'text-blue-500', light: 'bg-blue-100' },
    { name: 'green', bg: 'bg-green-500', text: 'text-green-500', light: 'bg-green-100' },
    { name: 'purple', bg: 'bg-purple-500', text: 'text-purple-500', light: 'bg-purple-100' },
    { name: 'orange', bg: 'bg-orange-500', text: 'text-orange-500', light: 'bg-orange-100' },
]

const defaultEvents = [
    { id: 1, title: 'Team Meeting', date: new Date().toISOString().split('T')[0], time: '10:00', duration: 60, color: 'blue', location: 'Conference Room A' },
    { id: 2, title: 'Lunch with Sarah', date: new Date().toISOString().split('T')[0], time: '12:30', duration: 90, color: 'green', location: 'Cafe Milano' },
    { id: 3, title: 'Project Review', date: new Date(Date.now() + 86400000).toISOString().split('T')[0], time: '14:00', duration: 60, color: 'purple', location: 'Online' },
    { id: 4, title: 'Dentist Appointment', date: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0], time: '09:00', duration: 45, color: 'red', location: 'Downtown Clinic' },
    { id: 5, title: 'Birthday Party', date: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0], time: '18:00', duration: 180, color: 'orange', location: "John's House" },
]

const Calendar = () => {
    const { darkMode } = useStore()
    const [currentDate, setCurrentDate] = useState(new Date())
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [events, setEvents] = useState(() => {
        const saved = localStorage.getItem('calendar-events')
        return saved ? JSON.parse(saved) : defaultEvents
    })
    const [showEventModal, setShowEventModal] = useState(false)
    const [editingEvent, setEditingEvent] = useState(null)
    const [newEvent, setNewEvent] = useState({
        title: '',
        date: '',
        time: '09:00',
        duration: 60,
        color: 'blue',
        location: ''
    })

    useEffect(() => {
        localStorage.setItem('calendar-events', JSON.stringify(events))
    }, [events])

    const getDaysInMonth = (date) => {
        const year = date.getFullYear()
        const month = date.getMonth()
        const firstDay = new Date(year, month, 1)
        const lastDay = new Date(year, month + 1, 0)
        const daysInMonth = lastDay.getDate()
        const startingDay = firstDay.getDay()

        const days = []
        // Previous month days
        const prevMonth = new Date(year, month, 0)
        for (let i = startingDay - 1; i >= 0; i--) {
            days.push({
                date: new Date(year, month - 1, prevMonth.getDate() - i),
                isCurrentMonth: false
            })
        }
        // Current month days
        for (let i = 1; i <= daysInMonth; i++) {
            days.push({
                date: new Date(year, month, i),
                isCurrentMonth: true
            })
        }
        // Next month days
        const remaining = 42 - days.length
        for (let i = 1; i <= remaining; i++) {
            days.push({
                date: new Date(year, month + 1, i),
                isCurrentMonth: false
            })
        }
        return days
    }

    const formatDateKey = (date) => {
        return date.toISOString().split('T')[0]
    }

    const getEventsForDate = (date) => {
        const dateKey = formatDateKey(date)
        return events.filter(e => e.date === dateKey)
    }

    const navigateMonth = (direction) => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1))
    }

    const goToToday = () => {
        const today = new Date()
        setCurrentDate(today)
        setSelectedDate(today)
    }

    const isToday = (date) => {
        const today = new Date()
        return date.toDateString() === today.toDateString()
    }

    const isSelected = (date) => {
        return date.toDateString() === selectedDate.toDateString()
    }

    const openNewEventModal = (date) => {
        setNewEvent({
            title: '',
            date: formatDateKey(date || selectedDate),
            time: '09:00',
            duration: 60,
            color: 'blue',
            location: ''
        })
        setEditingEvent(null)
        setShowEventModal(true)
    }

    const openEditEventModal = (event) => {
        setNewEvent({ ...event })
        setEditingEvent(event)
        setShowEventModal(true)
    }

    const saveEvent = () => {
        if (!newEvent.title.trim()) return

        if (editingEvent) {
            setEvents(events.map(e => e.id === editingEvent.id ? { ...newEvent, id: editingEvent.id } : e))
        } else {
            setEvents([...events, { ...newEvent, id: Date.now() }])
        }
        setShowEventModal(false)
    }

    const deleteEvent = (id) => {
        setEvents(events.filter(e => e.id !== id))
        setShowEventModal(false)
    }

    const days = getDaysInMonth(currentDate)
    const selectedDateEvents = getEventsForDate(selectedDate)

    return (
        <div className={`w-full h-full flex ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
            {/* Sidebar - Selected Day Events */}
            <div className={`w-64 flex-shrink-0 border-r flex flex-col ${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                <div className="p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}">
                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {DAYS[selectedDate.getDay()]}
                    </div>
                    <div className={`text-4xl font-light ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        {selectedDate.getDate()}
                    </div>
                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {MONTHS[selectedDate.getMonth()]} {selectedDate.getFullYear()}
                    </div>
                </div>

                <div className="flex-1 overflow-auto p-4">
                    {selectedDateEvents.length > 0 ? (
                        <div className="space-y-3">
                            {selectedDateEvents.map(event => {
                                const color = eventColors.find(c => c.name === event.color) || eventColors[0]
                                return (
                                    <motion.div
                                        key={event.id}
                                        layoutId={`event-${event.id}`}
                                        className={`p-3 rounded-lg cursor-pointer ${darkMode ? 'bg-gray-700/50 hover:bg-gray-700' : 'bg-white hover:bg-gray-50 shadow-sm'}`}
                                        onClick={() => openEditEventModal(event)}
                                    >
                                        <div className="flex items-start gap-2">
                                            <div className={`w-1 h-full min-h-[40px] rounded-full ${color.bg}`} />
                                            <div className="flex-1 min-w-0">
                                                <p className={`font-medium truncate ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                                    {event.title}
                                                </p>
                                                <div className={`flex items-center gap-1 text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                    <FaClock className="w-3 h-3" />
                                                    <span>{event.time}</span>
                                                    <span>({event.duration} min)</span>
                                                </div>
                                                {event.location && (
                                                    <div className={`flex items-center gap-1 text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                        <FaMapMarkerAlt className="w-3 h-3" />
                                                        <span className="truncate">{event.location}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                )
                            })}
                        </div>
                    ) : (
                        <div className={`text-center py-8 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                            <FaCalendarAlt className="w-12 h-12 mx-auto mb-3 opacity-30" />
                            <p className="text-sm">No events</p>
                        </div>
                    )}
                </div>

                <div className="p-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}">
                    <button
                        onClick={() => openNewEventModal()}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                    >
                        <FaPlus className="w-4 h-4" />
                        <span>New Event</span>
                    </button>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <div className={`h-14 flex items-center justify-between px-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex items-center gap-4">
                        <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                            {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
                        </h2>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => navigateMonth(-1)}
                                className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'}`}
                            >
                                <FaChevronLeft className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => navigateMonth(1)}
                                className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'}`}
                            >
                                <FaChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                    <button
                        onClick={goToToday}
                        className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
                    >
                        Today
                    </button>
                </div>

                {/* Days Header */}
                <div className="grid grid-cols-7 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}">
                    {DAYS.map(day => (
                        <div
                            key={day}
                            className={`py-2 text-center text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
                        >
                            {day}
                        </div>
                    ))}
                </div>

                {/* Calendar Grid */}
                <div className="flex-1 grid grid-cols-7 grid-rows-6">
                    {days.map((day, index) => {
                        const dayEvents = getEventsForDate(day.date)
                        return (
                            <div
                                key={index}
                                onClick={() => setSelectedDate(day.date)}
                                onDoubleClick={() => openNewEventModal(day.date)}
                                className={`border-r border-b p-1 cursor-pointer transition-colors min-h-[80px] ${
                                    darkMode ? 'border-gray-700' : 'border-gray-100'
                                } ${
                                    isSelected(day.date)
                                        ? darkMode ? 'bg-blue-900/30' : 'bg-blue-50'
                                        : darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50'
                                } ${
                                    !day.isCurrentMonth && (darkMode ? 'bg-gray-800/50' : 'bg-gray-50/50')
                                }`}
                            >
                                <div className={`flex items-center justify-center w-7 h-7 rounded-full mb-1 ${
                                    isToday(day.date)
                                        ? 'bg-blue-500 text-white'
                                        : day.isCurrentMonth
                                            ? darkMode ? 'text-white' : 'text-gray-800'
                                            : darkMode ? 'text-gray-600' : 'text-gray-400'
                                }`}>
                                    <span className="text-sm">{day.date.getDate()}</span>
                                </div>
                                <div className="space-y-0.5">
                                    {dayEvents.slice(0, 3).map(event => {
                                        const color = eventColors.find(c => c.name === event.color) || eventColors[0]
                                        return (
                                            <div
                                                key={event.id}
                                                className={`text-xs px-1 py-0.5 rounded truncate ${color.bg} text-white`}
                                            >
                                                {event.title}
                                            </div>
                                        )
                                    })}
                                    {dayEvents.length > 3 && (
                                        <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                            +{dayEvents.length - 3} more
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Event Modal */}
            <AnimatePresence>
                {showEventModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-50 flex items-center justify-center bg-black/50"
                        onClick={() => setShowEventModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className={`w-96 rounded-xl shadow-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
                            onClick={e => e.stopPropagation()}
                        >
                            <div className={`flex items-center justify-between p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                                <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                    {editingEvent ? 'Edit Event' : 'New Event'}
                                </h3>
                                <button
                                    onClick={() => setShowEventModal(false)}
                                    className={`p-1 rounded-lg ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}
                                >
                                    <FaTimes className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="p-4 space-y-4">
                                <div>
                                    <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Title
                                    </label>
                                    <input
                                        type="text"
                                        value={newEvent.title}
                                        onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                                        placeholder="Event title"
                                        className={`w-full px-3 py-2 rounded-lg border outline-none transition-colors ${
                                            darkMode
                                                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500'
                                                : 'bg-white border-gray-300 text-gray-800 placeholder-gray-400 focus:border-blue-500'
                                        }`}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                            Date
                                        </label>
                                        <input
                                            type="date"
                                            value={newEvent.date}
                                            onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                                            className={`w-full px-3 py-2 rounded-lg border outline-none ${
                                                darkMode
                                                    ? 'bg-gray-700 border-gray-600 text-white'
                                                    : 'bg-white border-gray-300 text-gray-800'
                                            }`}
                                        />
                                    </div>
                                    <div>
                                        <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                            Time
                                        </label>
                                        <input
                                            type="time"
                                            value={newEvent.time}
                                            onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                                            className={`w-full px-3 py-2 rounded-lg border outline-none ${
                                                darkMode
                                                    ? 'bg-gray-700 border-gray-600 text-white'
                                                    : 'bg-white border-gray-300 text-gray-800'
                                            }`}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Duration (minutes)
                                    </label>
                                    <select
                                        value={newEvent.duration}
                                        onChange={(e) => setNewEvent({ ...newEvent, duration: parseInt(e.target.value) })}
                                        className={`w-full px-3 py-2 rounded-lg border outline-none ${
                                            darkMode
                                                ? 'bg-gray-700 border-gray-600 text-white'
                                                : 'bg-white border-gray-300 text-gray-800'
                                        }`}
                                    >
                                        <option value={15}>15 minutes</option>
                                        <option value={30}>30 minutes</option>
                                        <option value={45}>45 minutes</option>
                                        <option value={60}>1 hour</option>
                                        <option value={90}>1.5 hours</option>
                                        <option value={120}>2 hours</option>
                                        <option value={180}>3 hours</option>
                                    </select>
                                </div>

                                <div>
                                    <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Location
                                    </label>
                                    <input
                                        type="text"
                                        value={newEvent.location}
                                        onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                                        placeholder="Add location"
                                        className={`w-full px-3 py-2 rounded-lg border outline-none ${
                                            darkMode
                                                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                                : 'bg-white border-gray-300 text-gray-800 placeholder-gray-400'
                                        }`}
                                    />
                                </div>

                                <div>
                                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Color
                                    </label>
                                    <div className="flex gap-2">
                                        {eventColors.map(color => (
                                            <button
                                                key={color.name}
                                                onClick={() => setNewEvent({ ...newEvent, color: color.name })}
                                                className={`w-8 h-8 rounded-full ${color.bg} flex items-center justify-center ${
                                                    newEvent.color === color.name ? 'ring-2 ring-offset-2 ring-blue-500' : ''
                                                }`}
                                            >
                                                {newEvent.color === color.name && (
                                                    <FaCircle className="w-2 h-2 text-white" />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className={`flex items-center justify-between p-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                                {editingEvent ? (
                                    <button
                                        onClick={() => deleteEvent(editingEvent.id)}
                                        className="px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        Delete
                                    </button>
                                ) : (
                                    <div />
                                )}
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setShowEventModal(false)}
                                        className={`px-4 py-2 rounded-lg transition-colors ${
                                            darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
                                        }`}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={saveEvent}
                                        disabled={!newEvent.title.trim()}
                                        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded-lg transition-colors"
                                    >
                                        {editingEvent ? 'Save' : 'Create'}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default Calendar
