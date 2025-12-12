import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../../store/useStore'
import {
    FaWifi, FaBluetooth, FaPlane, FaMoon, FaSun,
    FaVolumeUp, FaVolumeMute, FaBroadcastTower,
    FaKeyboard, FaMobileAlt, FaDesktop, FaMusic,
    FaPlay, FaPause, FaStepForward, FaStepBackward,
    FaLock, FaBatteryFull, FaBatteryThreeQuarters, FaBatteryHalf
} from 'react-icons/fa'
import { IoIosBluetooth } from 'react-icons/io'
import { MdScreenShare, MdCastConnected, MdBrightness6 } from 'react-icons/md'
import { HiOutlineSun } from 'react-icons/hi'

const ControlCenter = ({ isOpen, onClose }) => {
    const {
        darkMode, toggleDarkMode,
        brightness, setBrightness,
        soundEnabled, toggleSoundEffects,
        soundVolume, setSoundVolume
    } = useStore()

    const [wifiEnabled, setWifiEnabled] = useState(true)
    const [bluetoothEnabled, setBluetoothEnabled] = useState(true)
    const [airdropEnabled, setAirdropEnabled] = useState(false)
    const [focusMode, setFocusMode] = useState(false)
    const [isPlaying, setIsPlaying] = useState(false)

    // Control tile component
    const ControlTile = ({ icon: Icon, label, sublabel, active, onClick, large = false }) => (
        <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className={`${large ? 'col-span-2' : ''} rounded-2xl p-3 cursor-pointer transition-all duration-200 ${
                active
                    ? 'bg-blue-500 text-white'
                    : darkMode
                        ? 'bg-gray-700/80 text-white hover:bg-gray-600/80'
                        : 'bg-white/80 text-gray-800 hover:bg-white/90'
            }`}
        >
            <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    active ? 'bg-white/20' : darkMode ? 'bg-gray-600' : 'bg-gray-200'
                }`}>
                    <Icon className={`text-lg ${active ? 'text-white' : darkMode ? 'text-blue-400' : 'text-blue-500'}`} />
                </div>
                <div className="flex flex-col">
                    <span className="text-sm font-medium">{label}</span>
                    {sublabel && <span className={`text-xs ${active ? 'text-white/70' : 'text-gray-500'}`}>{sublabel}</span>}
                </div>
            </div>
        </motion.div>
    )

    // Slider component
    const Slider = ({ icon: Icon, value, onChange, min = 0, max = 100 }) => (
        <div className={`flex items-center gap-3 rounded-2xl p-3 ${
            darkMode ? 'bg-gray-700/80' : 'bg-white/80'
        }`}>
            <Icon className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            <input
                type="range"
                min={min}
                max={max}
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                className="flex-1 h-2 rounded-full appearance-none cursor-pointer accent-blue-500"
                style={{
                    background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${value}%, ${darkMode ? '#4b5563' : '#e5e7eb'} ${value}%, ${darkMode ? '#4b5563' : '#e5e7eb'} 100%)`
                }}
            />
        </div>
    )

    if (!isOpen) return null

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className={`absolute top-10 right-2 w-80 rounded-2xl shadow-2xl overflow-hidden z-[9999] ${
                    darkMode ? 'bg-gray-800/95' : 'bg-gray-100/95'
                } backdrop-blur-xl border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-3 space-y-3">
                    {/* Connectivity Section */}
                    <div className="grid grid-cols-2 gap-2">
                        <ControlTile
                            icon={FaWifi}
                            label="Wi-Fi"
                            sublabel={wifiEnabled ? "Home Network" : "Off"}
                            active={wifiEnabled}
                            onClick={() => setWifiEnabled(!wifiEnabled)}
                        />
                        <ControlTile
                            icon={IoIosBluetooth}
                            label="Bluetooth"
                            sublabel={bluetoothEnabled ? "On" : "Off"}
                            active={bluetoothEnabled}
                            onClick={() => setBluetoothEnabled(!bluetoothEnabled)}
                        />
                        <ControlTile
                            icon={FaBroadcastTower}
                            label="AirDrop"
                            sublabel={airdropEnabled ? "Everyone" : "Off"}
                            active={airdropEnabled}
                            onClick={() => setAirdropEnabled(!airdropEnabled)}
                        />
                        <ControlTile
                            icon={FaMoon}
                            label="Focus"
                            sublabel={focusMode ? "On" : "Off"}
                            active={focusMode}
                            onClick={() => setFocusMode(!focusMode)}
                        />
                    </div>

                    {/* Display & Sound */}
                    <div className="space-y-2">
                        <Slider
                            icon={MdBrightness6}
                            value={brightness}
                            onChange={setBrightness}
                        />
                        <Slider
                            icon={soundEnabled ? FaVolumeUp : FaVolumeMute}
                            value={soundVolume * 100}
                            onChange={(v) => setSoundVolume(v / 100)}
                        />
                    </div>

                    {/* Quick Toggles */}
                    <div className="grid grid-cols-4 gap-2">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={toggleDarkMode}
                            className={`aspect-square rounded-xl flex flex-col items-center justify-center gap-1 ${
                                darkMode
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-white/80 text-gray-700'
                            }`}
                            title="Dark Mode"
                        >
                            {darkMode ? <FaMoon className="text-lg" /> : <FaSun className="text-lg" />}
                            <span className="text-[10px]">Dark</span>
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={toggleSoundEffects}
                            className={`aspect-square rounded-xl flex flex-col items-center justify-center gap-1 ${
                                soundEnabled
                                    ? 'bg-blue-500 text-white'
                                    : darkMode ? 'bg-gray-700 text-gray-400' : 'bg-white/80 text-gray-700'
                            }`}
                            title="Sound"
                        >
                            {soundEnabled ? <FaVolumeUp className="text-lg" /> : <FaVolumeMute className="text-lg" />}
                            <span className="text-[10px]">Sound</span>
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`aspect-square rounded-xl flex flex-col items-center justify-center gap-1 ${
                                darkMode ? 'bg-gray-700 text-gray-400' : 'bg-white/80 text-gray-700'
                            }`}
                            title="Screen Mirroring"
                        >
                            <MdScreenShare className="text-lg" />
                            <span className="text-[10px]">Mirror</span>
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`aspect-square rounded-xl flex flex-col items-center justify-center gap-1 ${
                                darkMode ? 'bg-gray-700 text-gray-400' : 'bg-white/80 text-gray-700'
                            }`}
                            title="Lock Screen"
                        >
                            <FaLock className="text-lg" />
                            <span className="text-[10px]">Lock</span>
                        </motion.button>
                    </div>

                    {/* Now Playing */}
                    <div className={`rounded-2xl p-3 ${darkMode ? 'bg-gray-700/80' : 'bg-white/80'}`}>
                        <div className="flex items-center gap-3">
                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                                darkMode ? 'bg-gradient-to-br from-pink-500 to-purple-600' : 'bg-gradient-to-br from-pink-400 to-purple-500'
                            }`}>
                                <FaMusic className="text-white text-lg" />
                            </div>
                            <div className="flex-1">
                                <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                    Not Playing
                                </div>
                                <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                    Music
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}>
                                    <FaStepBackward className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
                                </button>
                                <button
                                    onClick={() => setIsPlaying(!isPlaying)}
                                    className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
                                >
                                    {isPlaying ? (
                                        <FaPause className={darkMode ? 'text-white' : 'text-gray-700'} />
                                    ) : (
                                        <FaPlay className={darkMode ? 'text-white' : 'text-gray-700'} />
                                    )}
                                </button>
                                <button className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}>
                                    <FaStepForward className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Battery & User */}
                    <div className={`flex items-center justify-between px-3 py-2 rounded-xl ${
                        darkMode ? 'bg-gray-700/50' : 'bg-white/50'
                    }`}>
                        <div className="flex items-center gap-2">
                            <FaBatteryThreeQuarters className="text-green-500 text-lg" />
                            <span className={`text-sm ${darkMode ? 'text-white' : 'text-gray-700'}`}>78%</span>
                        </div>
                        <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            Fully charged by 3:45 PM
                        </div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    )
}

export default ControlCenter
