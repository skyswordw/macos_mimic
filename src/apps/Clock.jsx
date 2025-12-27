import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../store/useStore'
import { FaStopwatch, FaHourglass, FaBell, FaPlus, FaPlay, FaPause, FaUndo, FaTrash, FaFlag, FaGlobeAmericas } from 'react-icons/fa'

const Clock = () => {
    const { darkMode, addNotification } = useStore()
    const [activeTab, setActiveTab] = useState('world')
    const [currentTime, setCurrentTime] = useState(new Date())
    const [worldClocks, setWorldClocks] = useState([
        { id: 1, city: 'San Francisco', timezone: 'America/Los_Angeles' },
        { id: 2, city: 'New York', timezone: 'America/New_York' },
        { id: 3, city: 'London', timezone: 'Europe/London' },
        { id: 4, city: 'Tokyo', timezone: 'Asia/Tokyo' },
    ])
    const [alarms, setAlarms] = useState([
        { id: 1, time: '07:00', label: 'Wake up', enabled: true, days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] },
    ])
    const [stopwatchTime, setStopwatchTime] = useState(0)
    const [stopwatchRunning, setStopwatchRunning] = useState(false)
    const [laps, setLaps] = useState([])
    const [timerTime, setTimerTime] = useState(0)
    const [timerRunning, setTimerRunning] = useState(false)
    const [timerInput, setTimerInput] = useState({ hours: 0, minutes: 5, seconds: 0 })
    const stopwatchRef = useRef(null)
    const timerRef = useRef(null)

    const tabs = [
        { id: 'world', icon: FaGlobeAmericas, label: 'World Clock' },
        { id: 'alarm', icon: FaBell, label: 'Alarm' },
        { id: 'stopwatch', icon: FaStopwatch, label: 'Stopwatch' },
        { id: 'timer', icon: FaHourglass, label: 'Timer' },
    ]

    useEffect(() => {
        const interval = setInterval(() => setCurrentTime(new Date()), 1000)
        return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        if (stopwatchRunning) {
            stopwatchRef.current = setInterval(() => setStopwatchTime(prev => prev + 10), 10)
        } else {
            clearInterval(stopwatchRef.current)
        }
        return () => clearInterval(stopwatchRef.current)
    }, [stopwatchRunning])

    useEffect(() => {
        if (timerRunning && timerTime > 0) {
            timerRef.current = setInterval(() => {
                setTimerTime(prev => {
                    if (prev <= 1000) {
                        setTimerRunning(false)
                        addNotification({ title: 'Timer', message: 'Timer finished!', app: 'Clock' })
                        return 0
                    }
                    return prev - 1000
                })
            }, 1000)
        } else {
            clearInterval(timerRef.current)
        }
        return () => clearInterval(timerRef.current)
    }, [timerRunning, timerTime, addNotification])

    const formatTime = (date, timezone) => date.toLocaleTimeString('en-US', { timeZone: timezone, hour: '2-digit', minute: '2-digit', second: '2-digit' })
    const formatStopwatch = (ms) => {
        const m = Math.floor(ms / 60000), s = Math.floor((ms % 60000) / 1000), cs = Math.floor((ms % 1000) / 10)
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}.${cs.toString().padStart(2, '0')}`
    }
    const formatTimer = (ms) => {
        const h = Math.floor(ms / 3600000), m = Math.floor((ms % 3600000) / 60000), s = Math.floor((ms % 60000) / 1000)
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
    }

    return (
        <div className={`h-full flex flex-col ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
            <div className={`flex border-b ${darkMode ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-white/50'}`}>
                {tabs.map(tab => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 py-3 px-4 flex flex-col items-center gap-1 transition-colors ${activeTab === tab.id ? (darkMode ? 'text-orange-400 bg-gray-700/50' : 'text-orange-500 bg-orange-50') : (darkMode ? 'text-gray-400' : 'text-gray-500')}`}>
                        <tab.icon className="text-lg" /><span className="text-xs">{tab.label}</span>
                    </button>
                ))}
            </div>
            <div className="flex-1 overflow-auto p-4">
                <AnimatePresence mode="wait">
                    {activeTab === 'world' && (
                        <motion.div key="world" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                            {worldClocks.map(clock => (
                                <div key={clock.id} className={`p-4 rounded-xl flex justify-between items-center ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                                    <div><div className="text-sm text-gray-500">{clock.city}</div><div className="text-2xl font-light">{formatTime(currentTime, clock.timezone)}</div></div>
                                    <button onClick={() => setWorldClocks(prev => prev.filter(c => c.id !== clock.id))} className="p-2 text-gray-400 hover:text-red-500"><FaTrash /></button>
                                </div>
                            ))}
                        </motion.div>
                    )}
                    {activeTab === 'alarm' && (
                        <motion.div key="alarm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                            {alarms.map(alarm => (
                                <div key={alarm.id} className={`p-4 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                                    <div className="flex justify-between items-center">
                                        <div><div className="text-3xl font-light">{alarm.time}</div><div className="text-sm text-gray-500">{alarm.label}</div></div>
                                        <button onClick={() => setAlarms(prev => prev.map(a => a.id === alarm.id ? { ...a, enabled: !a.enabled } : a))}
                                            className={`w-12 h-7 rounded-full transition-colors ${alarm.enabled ? 'bg-green-500' : darkMode ? 'bg-gray-600' : 'bg-gray-300'}`}>
                                            <motion.div className="w-5 h-5 bg-white rounded-full shadow" animate={{ x: alarm.enabled ? 26 : 2 }} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            <button className={`w-full p-4 rounded-xl border-2 border-dashed flex items-center justify-center gap-2 ${darkMode ? 'border-gray-700 text-gray-400' : 'border-gray-300 text-gray-500'}`}><FaPlus />Add Alarm</button>
                        </motion.div>
                    )}
                    {activeTab === 'stopwatch' && (
                        <motion.div key="stopwatch" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center">
                            <div className="text-6xl font-light my-8 font-mono">{formatStopwatch(stopwatchTime)}</div>
                            <div className="flex gap-4 mb-6">
                                <button onClick={stopwatchRunning ? () => setLaps(prev => [{ id: prev.length + 1, time: stopwatchTime, diff: prev.length > 0 ? stopwatchTime - prev[0].time : stopwatchTime }, ...prev]) : () => { setStopwatchTime(0); setLaps([]) }}
                                    className={`w-20 h-20 rounded-full flex items-center justify-center text-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>{stopwatchRunning ? <FaFlag /> : <FaUndo />}</button>
                                <button onClick={() => setStopwatchRunning(!stopwatchRunning)} className={`w-20 h-20 rounded-full flex items-center justify-center text-xl text-white ${stopwatchRunning ? 'bg-red-500' : 'bg-green-500'}`}>{stopwatchRunning ? <FaPause /> : <FaPlay />}</button>
                            </div>
                            {laps.length > 0 && <div className={`w-full max-h-48 overflow-auto rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>{laps.map((lap, i) => <div key={lap.id} className={`px-4 py-3 flex justify-between border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}><span className="text-gray-500">Lap {laps.length - i}</span><span className="font-mono">{formatStopwatch(lap.diff)}</span></div>)}</div>}
                        </motion.div>
                    )}
                    {activeTab === 'timer' && (
                        <motion.div key="timer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center">
                            {timerTime > 0 || timerRunning ? (
                                <><div className="text-6xl font-light my-8 font-mono">{formatTimer(timerTime)}</div>
                                <div className="flex gap-4">
                                    <button onClick={() => { setTimerTime(0); setTimerRunning(false) }} className={`w-20 h-20 rounded-full flex items-center justify-center text-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}><FaUndo /></button>
                                    <button onClick={() => setTimerRunning(!timerRunning)} className={`w-20 h-20 rounded-full flex items-center justify-center text-xl text-white ${timerRunning ? 'bg-red-500' : 'bg-green-500'}`}>{timerRunning ? <FaPause /> : <FaPlay />}</button>
                                </div></>
                            ) : (
                                <><div className="flex items-center gap-2 my-8">
                                    {['hours', 'minutes', 'seconds'].map((unit, i) => (<React.Fragment key={unit}>{i > 0 && <span className="text-4xl">:</span>}<div className="text-center"><input type="number" min="0" max={unit === 'hours' ? 23 : 59} value={timerInput[unit]} onChange={e => setTimerInput(prev => ({ ...prev, [unit]: parseInt(e.target.value) || 0 }))} className={`w-20 text-4xl text-center rounded-lg p-2 ${darkMode ? 'bg-gray-800' : 'bg-white'}`} /><div className="text-xs text-gray-500 mt-1">{unit}</div></div></React.Fragment>))}
                                </div>
                                <button onClick={() => { setTimerTime((timerInput.hours * 3600 + timerInput.minutes * 60 + timerInput.seconds) * 1000); setTimerRunning(true) }} className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center text-xl text-white"><FaPlay /></button>
                                <div className="flex gap-3 mt-6">{[1, 5, 10, 15, 30].map(m => <button key={m} onClick={() => { setTimerTime(m * 60000); setTimerRunning(true) }} className={`px-4 py-2 rounded-full text-sm ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>{m}m</button>)}</div></>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}

export default Clock
