import React from 'react'
import { useStore } from '../store/useStore'

const wallpapers = [
    'https://4kwallpapers.com/images/wallpapers/macos-monterey-stock-purple-dark-mode-layers-5k-4480x2520-5888.jpg',
    'https://4kwallpapers.com/images/wallpapers/macos-big-sur-apple-layers-fluidic-colorful-wwdc-20-5k-6016x3384-1455.jpg',
    'https://images.unsplash.com/photo-1477346611705-65d1883cee1e?auto=format&fit=crop&w=1920&q=80',
    'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=1920&q=80'
]

const Settings = () => {
    const { setWallpaper, wallpaper } = useStore()

    return (
        <div className="w-full h-full bg-[#f5f5f7] flex text-sm">
            {/* Sidebar */}
            <div className="w-48 bg-white/50 backdrop-blur-xl border-r border-gray-200 p-4 flex flex-col gap-1">
                <div className="flex items-center gap-2 p-2 rounded-md bg-blue-500 text-white cursor-pointer">
                    <span>Wallpaper</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-md hover:bg-black/5 cursor-pointer text-gray-700">
                    <span>Display</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-md hover:bg-black/5 cursor-pointer text-gray-700">
                    <span>General</span>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-8 overflow-y-auto">
                <h2 className="text-xl font-bold mb-6 text-gray-800">Wallpaper</h2>
                <div className="grid grid-cols-2 gap-4">
                    {wallpapers.map((wp, i) => (
                        <div
                            key={i}
                            className={`aspect-video rounded-lg overflow-hidden cursor-pointer border-4 transition-all ${wallpaper === wp ? 'border-blue-500' : 'border-transparent hover:border-gray-300'}`}
                            onClick={() => setWallpaper(wp)}
                        >
                            <img src={wp} alt={`Wallpaper ${i}`} className="w-full h-full object-cover" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Settings
