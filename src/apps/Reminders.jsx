import React, { useState, useEffect } from 'react'
import { useStore } from '../store/useStore'
import {
    FaPlus, FaCheck, FaCircle, FaRegCircle, FaStar, FaRegStar,
    FaCalendarAlt, FaFlag, FaList, FaTasks, FaClock, FaTrash,
    FaChevronRight, FaTag
} from 'react-icons/fa'

const Reminders = () => {
    const { darkMode, addNotification } = useStore()

    // Load reminders from localStorage
    const loadReminders = () => {
        try {
            const saved = localStorage.getItem('reminders-data')
            if (saved) {
                return JSON.parse(saved)
            }
        } catch (e) {
            console.error('Failed to load reminders:', e)
        }
        // Default reminders
        return [
            {
                id: 1,
                title: 'Review project proposal',
                notes: 'Check the budget section and timeline',
                list: 'work',
                dueDate: new Date().toISOString().split('T')[0],
                dueTime: '14:00',
                flagged: true,
                completed: false,
                priority: 'high'
            },
            {
                id: 2,
                title: 'Buy groceries',
                notes: 'Milk, eggs, bread, vegetables',
                list: 'shopping',
                dueDate: new Date().toISOString().split('T')[0],
                dueTime: null,
                flagged: false,
                completed: false,
                priority: 'medium'
            },
            {
                id: 3,
                title: 'Call dentist',
                notes: 'Schedule annual checkup',
                list: 'personal',
                dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
                dueTime: '10:00',
                flagged: false,
                completed: false,
                priority: 'low'
            },
            {
                id: 4,
                title: 'Finish presentation slides',
                notes: 'Add charts and final review',
                list: 'work',
                dueDate: new Date(Date.now() + 172800000).toISOString().split('T')[0],
                dueTime: '09:00',
                flagged: true,
                completed: false,
                priority: 'high'
            },
            {
                id: 5,
                title: 'Exercise',
                notes: '30 minutes cardio',
                list: 'personal',
                dueDate: new Date().toISOString().split('T')[0],
                dueTime: '18:00',
                flagged: false,
                completed: true,
                priority: 'medium'
            },
            {
                id: 6,
                title: 'Read book',
                notes: 'Chapter 5-7',
                list: 'personal',
                dueDate: null,
                dueTime: null,
                flagged: false,
                completed: false,
                priority: 'low'
            }
        ]
    }

    const [lists, setLists] = useState([
        { id: 'today', name: 'Today', icon: FaCalendarAlt, color: 'text-blue-500', smart: true },
        { id: 'scheduled', name: 'Scheduled', icon: FaClock, color: 'text-red-500', smart: true },
        { id: 'flagged', name: 'Flagged', icon: FaFlag, color: 'text-orange-500', smart: true },
        { id: 'all', name: 'All', icon: FaTasks, color: 'text-gray-500', smart: true },
        { id: 'personal', name: 'Personal', icon: FaList, color: 'text-blue-500', smart: false },
        { id: 'work', name: 'Work', icon: FaList, color: 'text-orange-500', smart: false },
        { id: 'shopping', name: 'Shopping', icon: FaList, color: 'text-green-500', smart: false }
    ])

    const [reminders, setReminders] = useState(loadReminders)

    // Save reminders to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('reminders-data', JSON.stringify(reminders))
    }, [reminders])

    const [selectedList, setSelectedList] = useState('today')
    const [selectedReminder, setSelectedReminder] = useState(null)
    const [newReminderTitle, setNewReminderTitle] = useState('')
    const [showNewReminder, setShowNewReminder] = useState(false)

    const today = new Date().toISOString().split('T')[0]

    const getFilteredReminders = () => {
        switch (selectedList) {
            case 'today':
                return reminders.filter(r => r.dueDate === today && !r.completed)
            case 'scheduled':
                return reminders.filter(r => r.dueDate && !r.completed)
            case 'flagged':
                return reminders.filter(r => r.flagged && !r.completed)
            case 'all':
                return reminders.filter(r => !r.completed)
            default:
                return reminders.filter(r => r.list === selectedList)
        }
    }

    const toggleComplete = (id) => {
        setReminders(prev => prev.map(r =>
            r.id === id ? { ...r, completed: !r.completed } : r
        ))
        const reminder = reminders.find(r => r.id === id)
        if (reminder && !reminder.completed) {
            addNotification({
                title: 'Reminder Completed',
                message: reminder.title,
                app: 'Reminder'
            })
        }
    }

    const toggleFlag = (id) => {
        setReminders(prev => prev.map(r =>
            r.id === id ? { ...r, flagged: !r.flagged } : r
        ))
    }

    const deleteReminder = (id) => {
        setReminders(prev => prev.filter(r => r.id !== id))
        if (selectedReminder?.id === id) {
            setSelectedReminder(null)
        }
    }

    const addReminder = () => {
        if (newReminderTitle.trim()) {
            const targetList = ['today', 'scheduled', 'flagged', 'all'].includes(selectedList)
                ? 'personal'
                : selectedList

            const newReminder = {
                id: Date.now(),
                title: newReminderTitle,
                notes: '',
                list: targetList,
                dueDate: selectedList === 'today' ? today : null,
                dueTime: null,
                flagged: selectedList === 'flagged',
                completed: false,
                priority: 'medium'
            }
            setReminders(prev => [...prev, newReminder])
            setNewReminderTitle('')
            setShowNewReminder(false)
        }
    }

    const updateReminder = (id, updates) => {
        setReminders(prev => prev.map(r =>
            r.id === id ? { ...r, ...updates } : r
        ))
        if (selectedReminder?.id === id) {
            setSelectedReminder({ ...selectedReminder, ...updates })
        }
    }

    const getListCount = (listId) => {
        switch (listId) {
            case 'today':
                return reminders.filter(r => r.dueDate === today && !r.completed).length
            case 'scheduled':
                return reminders.filter(r => r.dueDate && !r.completed).length
            case 'flagged':
                return reminders.filter(r => r.flagged && !r.completed).length
            case 'all':
                return reminders.filter(r => !r.completed).length
            default:
                return reminders.filter(r => r.list === listId && !r.completed).length
        }
    }

    const filteredReminders = getFilteredReminders()
    const currentList = lists.find(l => l.id === selectedList)

    const priorityColors = {
        high: 'text-red-500',
        medium: 'text-orange-500',
        low: 'text-blue-500'
    }

    return (
        <div className={`w-full h-full flex ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
            {/* Sidebar */}
            <div className={`w-64 border-r flex flex-col ${
                darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
            }`}>
                {/* Smart lists */}
                <div className="p-4">
                    <div className="grid grid-cols-2 gap-2">
                        {lists.filter(l => l.smart).map(list => (
                            <div
                                key={list.id}
                                onClick={() => {
                                    setSelectedList(list.id)
                                    setSelectedReminder(null)
                                }}
                                className={`p-3 rounded-xl cursor-pointer transition-all ${
                                    selectedList === list.id
                                        ? darkMode ? 'bg-gray-700' : 'bg-gray-200'
                                        : darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-50 hover:bg-gray-100'
                                }`}
                            >
                                <div className={`text-2xl mb-1 ${list.color}`}>
                                    <list.icon />
                                </div>
                                <div className="text-xs text-gray-500">{list.name}</div>
                                <div className="text-xl font-semibold">{getListCount(list.id)}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* My Lists */}
                <div className={`px-4 py-2 text-sm font-semibold ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                    My Lists
                </div>
                <div className="flex-1 overflow-y-auto px-2">
                    {lists.filter(l => !l.smart).map(list => (
                        <div
                            key={list.id}
                            onClick={() => {
                                setSelectedList(list.id)
                                setSelectedReminder(null)
                            }}
                            className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer mb-1 ${
                                selectedList === list.id
                                    ? darkMode ? 'bg-gray-700' : 'bg-gray-200'
                                    : darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                            }`}
                        >
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                list.color.replace('text-', 'bg-').replace('500', '100')
                            }`}>
                                <list.icon className={`text-xs ${list.color}`} />
                            </div>
                            <span className="flex-1">{list.name}</span>
                            <span className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                {getListCount(list.id)}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Add list button */}
                <div className={`p-3 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <button className={`flex items-center gap-2 text-sm ${
                        darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
                    }`}>
                        <FaPlus />
                        <span>Add List</span>
                    </button>
                </div>
            </div>

            {/* Main content */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <div className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between">
                        <h1 className={`text-2xl font-bold ${currentList?.color || ''}`}>
                            {currentList?.name || 'Reminders'}
                        </h1>
                        <button
                            onClick={() => setShowNewReminder(true)}
                            className="flex items-center gap-2 px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
                        >
                            <FaPlus />
                            <span>New Reminder</span>
                        </button>
                    </div>
                </div>

                {/* Reminders list */}
                <div className="flex-1 overflow-y-auto">
                    {showNewReminder && (
                        <div className={`flex items-center gap-3 p-3 border-b ${
                            darkMode ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-blue-50'
                        }`}>
                            <FaRegCircle className="text-gray-400" />
                            <input
                                type="text"
                                placeholder="New reminder"
                                value={newReminderTitle}
                                onChange={(e) => setNewReminderTitle(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && addReminder()}
                                onBlur={() => {
                                    if (!newReminderTitle.trim()) setShowNewReminder(false)
                                }}
                                autoFocus
                                className={`flex-1 bg-transparent focus:outline-none ${
                                    darkMode ? 'text-white' : 'text-gray-900'
                                }`}
                            />
                            <button
                                onClick={addReminder}
                                className="text-blue-500 hover:text-blue-600 text-sm"
                            >
                                Add
                            </button>
                        </div>
                    )}

                    {filteredReminders.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400">
                            <FaTasks className="text-5xl mb-3" />
                            <p>No reminders</p>
                        </div>
                    ) : (
                        filteredReminders.map(reminder => (
                            <div
                                key={reminder.id}
                                onClick={() => setSelectedReminder(reminder)}
                                className={`flex items-start gap-3 p-3 border-b cursor-pointer ${
                                    darkMode ? 'border-gray-700' : 'border-gray-100'
                                } ${
                                    selectedReminder?.id === reminder.id
                                        ? darkMode ? 'bg-gray-800' : 'bg-blue-50'
                                        : darkMode ? 'hover:bg-gray-800/50' : 'hover:bg-gray-50'
                                }`}
                            >
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        toggleComplete(reminder.id)
                                    }}
                                    className={`mt-0.5 ${
                                        reminder.completed ? 'text-blue-500' : priorityColors[reminder.priority]
                                    }`}
                                >
                                    {reminder.completed ? <FaCheck /> : <FaRegCircle />}
                                </button>
                                <div className="flex-1 min-w-0">
                                    <div className={`${reminder.completed ? 'line-through text-gray-500' : ''}`}>
                                        {reminder.title}
                                    </div>
                                    {reminder.notes && (
                                        <div className={`text-sm truncate ${
                                            darkMode ? 'text-gray-500' : 'text-gray-400'
                                        }`}>
                                            {reminder.notes}
                                        </div>
                                    )}
                                    {reminder.dueDate && (
                                        <div className={`flex items-center gap-1 text-xs mt-1 ${
                                            reminder.dueDate === today ? 'text-blue-500' : 'text-gray-500'
                                        }`}>
                                            <FaCalendarAlt />
                                            <span>
                                                {reminder.dueDate === today ? 'Today' : reminder.dueDate}
                                                {reminder.dueTime && ` at ${reminder.dueTime}`}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        toggleFlag(reminder.id)
                                    }}
                                    className={reminder.flagged ? 'text-orange-500' : 'text-gray-400'}
                                >
                                    {reminder.flagged ? <FaFlag /> : <FaRegStar />}
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Detail panel */}
            {selectedReminder && (
                <div className={`w-80 border-l flex flex-col ${
                    darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
                }`}>
                    <div className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                        <div className="flex justify-between items-start">
                            <h3 className="font-semibold">Details</h3>
                            <button
                                onClick={() => deleteReminder(selectedReminder.id)}
                                className="text-red-500 hover:text-red-600"
                            >
                                <FaTrash />
                            </button>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {/* Title */}
                        <div>
                            <label className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                Title
                            </label>
                            <input
                                type="text"
                                value={selectedReminder.title}
                                onChange={(e) => updateReminder(selectedReminder.id, { title: e.target.value })}
                                className={`w-full mt-1 p-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    darkMode
                                        ? 'bg-gray-700 border-gray-600 text-white'
                                        : 'bg-gray-50 border-gray-200'
                                }`}
                            />
                        </div>

                        {/* Notes */}
                        <div>
                            <label className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                Notes
                            </label>
                            <textarea
                                value={selectedReminder.notes}
                                onChange={(e) => updateReminder(selectedReminder.id, { notes: e.target.value })}
                                rows={3}
                                className={`w-full mt-1 p-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                                    darkMode
                                        ? 'bg-gray-700 border-gray-600 text-white'
                                        : 'bg-gray-50 border-gray-200'
                                }`}
                            />
                        </div>

                        {/* Due date */}
                        <div>
                            <label className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                Due Date
                            </label>
                            <input
                                type="date"
                                value={selectedReminder.dueDate || ''}
                                onChange={(e) => updateReminder(selectedReminder.id, { dueDate: e.target.value })}
                                className={`w-full mt-1 p-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    darkMode
                                        ? 'bg-gray-700 border-gray-600 text-white'
                                        : 'bg-gray-50 border-gray-200'
                                }`}
                            />
                        </div>

                        {/* Due time */}
                        <div>
                            <label className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                Time
                            </label>
                            <input
                                type="time"
                                value={selectedReminder.dueTime || ''}
                                onChange={(e) => updateReminder(selectedReminder.id, { dueTime: e.target.value })}
                                className={`w-full mt-1 p-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    darkMode
                                        ? 'bg-gray-700 border-gray-600 text-white'
                                        : 'bg-gray-50 border-gray-200'
                                }`}
                            />
                        </div>

                        {/* Priority */}
                        <div>
                            <label className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                Priority
                            </label>
                            <select
                                value={selectedReminder.priority}
                                onChange={(e) => updateReminder(selectedReminder.id, { priority: e.target.value })}
                                className={`w-full mt-1 p-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    darkMode
                                        ? 'bg-gray-700 border-gray-600 text-white'
                                        : 'bg-gray-50 border-gray-200'
                                }`}
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>

                        {/* List */}
                        <div>
                            <label className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                List
                            </label>
                            <select
                                value={selectedReminder.list}
                                onChange={(e) => updateReminder(selectedReminder.id, { list: e.target.value })}
                                className={`w-full mt-1 p-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    darkMode
                                        ? 'bg-gray-700 border-gray-600 text-white'
                                        : 'bg-gray-50 border-gray-200'
                                }`}
                            >
                                {lists.filter(l => !l.smart).map(list => (
                                    <option key={list.id} value={list.id}>{list.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Reminders
