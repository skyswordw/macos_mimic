import React, { useState, useEffect } from 'react'
import { FaApple, FaWifi, FaBatteryFull, FaSearch, FaToggleOn } from 'react-icons/fa'
import { format } from 'date-fns'

const MenuBar = () => {
    const [time, setTime] = useState(new Date())

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000)
        return () => clearInterval(timer)
    }, [])

    return (
        <div className="w-full h-8 bg-mac-window/30 backdrop-blur-md flex items-center justify-between px-4 text-white text-sm select-none z-50 shadow-sm">
            <div className="flex items-center gap-4">
                <FaApple className="text-lg cursor-pointer hover:text-gray-200" />
                <span className="font-bold cursor-pointer">Finder</span>
                <span className="cursor-pointer hidden sm:block">File</span>
                <span className="cursor-pointer hidden sm:block">Edit</span>
                <span className="cursor-pointer hidden sm:block">View</span>
                <span className="cursor-pointer hidden sm:block">Go</span>
                <span className="cursor-pointer hidden sm:block">Window</span>
                <span className="cursor-pointer hidden sm:block">Help</span>
            </div>

            <div className="flex items-center gap-4">
                <FaBatteryFull className="text-lg" />
                <FaWifi className="text-lg" />
                <FaSearch className="text-lg cursor-pointer" />
                <FaToggleOn className="text-xl cursor-pointer" />
                <span className="font-medium min-w-[80px] text-right">
                    {format(time, 'EEE MMM d h:mm aa')}
                </span>
            </div>
        </div>
    )
}

export default MenuBar
