import React, { useState, useEffect } from 'react'
import { FaApple, FaWifi, FaBatteryFull, FaSearch, FaToggleOn, FaTh } from 'react-icons/fa'
import { format } from 'date-fns'
import { useStore } from '../../store/useStore'

const MenuBar = () => {
    const [time, setTime] = useState(new Date())
    const { toggleSpotlight, toggleNotificationCenter, toggleMissionControl, currentDesktop, desktops, darkMode } = useStore()
    const [activeMenu, setActiveMenu] = useState(null)
    const [showControlCenter, setShowControlCenter] = useState(false)

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000)
        return () => clearInterval(timer)
    }, [])

    const toggleMenu = (menu) => {
        setActiveMenu(activeMenu === menu ? null : menu)
    }

    const toggleControlCenter = () => setShowControlCenter(!showControlCenter)

    useEffect(() => {
        const handleClickOutside = () => {
            setActiveMenu(null)
            setShowControlCenter(false)
        }
        window.addEventListener('click', handleClickOutside)
        return () => window.removeEventListener('click', handleClickOutside)
    }, [])

    return (
        <div className={`w-full h-7 sm:h-8 backdrop-blur-md flex items-center justify-between px-2 sm:px-4 text-xs sm:text-sm select-none z-50 shadow-sm relative transition-colors duration-500 ${
            darkMode ? 'bg-black/40 text-white' : 'bg-white/30 text-white'
        }`}>
            <div className="flex items-center gap-2 sm:gap-4 h-full" onClick={(e) => e.stopPropagation()}>
                <div className="relative">
                    <FaApple
                        className="text-lg cursor-pointer hover:text-gray-200"
                        onClick={() => toggleMenu('apple')}
                    />
                    {activeMenu === 'apple' && (
                        <div className="absolute top-8 left-0 w-48 bg-gray-100/90 backdrop-blur-xl rounded-lg shadow-xl text-black py-1 border border-gray-200">
                            <div className="px-4 py-1 hover:bg-blue-500 hover:text-white cursor-pointer">About This Mac</div>
                            <div className="h-[1px] bg-gray-300 my-1" />
                            <div className="px-4 py-1 hover:bg-blue-500 hover:text-white cursor-pointer">System Settings...</div>
                            <div className="px-4 py-1 hover:bg-blue-500 hover:text-white cursor-pointer">App Store...</div>
                            <div className="h-[1px] bg-gray-300 my-1" />
                            <div className="px-4 py-1 hover:bg-blue-500 hover:text-white cursor-pointer">Sleep</div>
                            <div className="px-4 py-1 hover:bg-blue-500 hover:text-white cursor-pointer">Restart...</div>
                            <div className="px-4 py-1 hover:bg-blue-500 hover:text-white cursor-pointer">Shut Down...</div>
                            <div className="h-[1px] bg-gray-300 my-1" />
                            <div className="px-4 py-1 hover:bg-blue-500 hover:text-white cursor-pointer">Lock Screen</div>
                        </div>
                    )}
                </div>

                <span className="font-bold cursor-pointer">Finder</span>
                <span className="cursor-pointer hidden sm:block hover:text-gray-200">File</span>
                <span className="cursor-pointer hidden sm:block hover:text-gray-200">Edit</span>
                <span className="cursor-pointer hidden sm:block hover:text-gray-200">View</span>
                <span className="cursor-pointer hidden sm:block hover:text-gray-200">Go</span>
                <span className="cursor-pointer hidden sm:block hover:text-gray-200">Window</span>
                <span className="cursor-pointer hidden sm:block hover:text-gray-200">Help</span>
            </div>

            <div className="flex items-center gap-1 sm:gap-4 text-xs sm:text-sm font-medium" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center gap-1 sm:gap-2">
                    <span className="hidden sm:inline text-xs bg-white/20 px-2 py-0.5 rounded">Desktop {currentDesktop}</span>
                    <FaTh
                        className="text-sm cursor-pointer hover:text-gray-200"
                        onClick={toggleMissionControl}
                        title="Mission Control"
                    />
                    <FaBatteryFull className="text-lg" />
                    <FaWifi className="text-lg" />
                    <FaSearch className="text-sm cursor-pointer" onClick={toggleSpotlight} />
                    <div className="relative control-center-container">
                        <FaToggleOn
                            className={`text-xl cursor-pointer ${showControlCenter ? 'text-white' : 'text-gray-200'}`}
                            onClick={toggleControlCenter}
                        />
                        {showControlCenter && (
                            <div className="absolute top-8 right-0 w-80 bg-gray-100/90 backdrop-blur-xl rounded-2xl shadow-xl text-black p-4 border border-gray-200 flex flex-col gap-4">
                                <div className="flex gap-4">
                                    <div className="flex-1 bg-white/50 rounded-xl p-3 flex flex-col gap-2">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white"><FaWifi /></div>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-xs">Wi-Fi</span>
                                                <span className="text-[10px] text-gray-500">Home Network</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white"><FaToggleOn /></div>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-xs">Bluetooth</span>
                                                <span className="text-[10px] text-gray-500">On</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex-1 bg-white/50 rounded-xl p-3">
                                        <div className="text-xs font-bold mb-2">Display</div>
                                        <input type="range" className="w-full accent-blue-500" />
                                        <div className="text-xs font-bold mt-4 mb-2">Sound</div>
                                        <input type="range" className="w-full accent-blue-500" />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <span
                        className="font-medium min-w-[80px] text-right cursor-pointer hover:bg-white/20 px-2 py-0.5 rounded transition-colors select-none"
                        onClick={toggleNotificationCenter}
                    >
                        {format(time, 'EEE MMM d h:mm aa')}
                    </span>
                </div>
            </div>
        </div>
    )
}

export default MenuBar
