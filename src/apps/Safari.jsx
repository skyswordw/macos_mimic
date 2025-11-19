import React, { useState } from 'react'
import { FaArrowLeft, FaArrowRight, FaRedo, FaLock } from 'react-icons/fa'

const Safari = () => {
    const [url, setUrl] = useState('https://www.google.com')

    return (
        <div className="w-full h-full flex flex-col bg-white">
            {/* Toolbar */}
            <div className="h-12 bg-gray-100 border-b border-gray-200 flex items-center px-4 gap-4">
                <div className="flex gap-4 text-gray-500">
                    <FaArrowLeft className="cursor-pointer hover:text-gray-800" />
                    <FaArrowRight className="cursor-pointer hover:text-gray-800" />
                </div>

                <div className="flex-1 flex justify-center">
                    <div className="w-96 h-8 bg-gray-200 rounded-md flex items-center px-3 gap-2 text-sm">
                        <FaLock className="text-xs text-gray-500" />
                        <input
                            type="text"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            className="bg-transparent border-none outline-none flex-1 text-center"
                        />
                        <FaRedo className="text-xs text-gray-500 cursor-pointer" />
                    </div>
                </div>

                <div className="w-10"></div>
            </div>

            {/* Content */}
            <div className="flex-1 bg-white flex items-center justify-center text-gray-400">
                <iframe
                    src="https://www.wikipedia.org/"
                    className="w-full h-full border-none"
                    title="Browser"
                />
            </div>
        </div>
    )
}

export default Safari
