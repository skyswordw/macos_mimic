import React from 'react'
import { FaFolder, FaDesktop, FaDownload, FaRegFileImage, FaRegFileCode } from 'react-icons/fa'

const Finder = () => {
    return (
        <div className="w-full h-full bg-white flex text-sm">
            {/* Sidebar */}
            <div className="w-48 bg-gray-100/80 backdrop-blur-md p-4 flex flex-col gap-2 border-r border-gray-200">
                <div className="text-xs font-bold text-gray-400 mb-1">Favorites</div>
                <div className="flex items-center gap-2 p-1 rounded hover:bg-gray-200 cursor-pointer">
                    <FaDesktop className="text-blue-500" /> Desktop
                </div>
                <div className="flex items-center gap-2 p-1 rounded hover:bg-gray-200 cursor-pointer">
                    <FaFolder className="text-blue-500" /> Documents
                </div>
                <div className="flex items-center gap-2 p-1 rounded hover:bg-gray-200 cursor-pointer">
                    <FaDownload className="text-blue-500" /> Downloads
                </div>

                <div className="text-xs font-bold text-gray-400 mt-4 mb-1">iCloud</div>
                <div className="flex items-center gap-2 p-1 rounded hover:bg-gray-200 cursor-pointer">
                    <FaFolder className="text-blue-500" /> iCloud Drive
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-4">
                <div className="grid grid-cols-4 gap-4">
                    <div className="flex flex-col items-center gap-2 p-2 hover:bg-blue-50 rounded cursor-pointer">
                        <FaFolder className="text-5xl text-blue-400" />
                        <span>Project</span>
                    </div>
                    <div className="flex flex-col items-center gap-2 p-2 hover:bg-blue-50 rounded cursor-pointer">
                        <FaRegFileImage className="text-5xl text-purple-400" />
                        <span>image.png</span>
                    </div>
                    <div className="flex flex-col items-center gap-2 p-2 hover:bg-blue-50 rounded cursor-pointer">
                        <FaRegFileCode className="text-5xl text-yellow-400" />
                        <span>script.js</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Finder
