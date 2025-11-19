import React from 'react'
import MenuBar from './MenuBar'
import Dock from '../dock/Dock'
import WindowManager from '../window/WindowManager'

const Desktop = () => {
    return (
        <div
            className="relative w-full h-full bg-cover bg-center overflow-hidden"
            style={{ backgroundImage: "url('https://4kwallpapers.com/images/wallpapers/macos-monterey-stock-purple-dark-mode-layers-5k-4480x2520-5888.jpg')" }}
        >
            {/* Overlay to darken background slightly if needed */}
            <div className="absolute inset-0 bg-black/10 pointer-events-none" />

            <MenuBar />

            <div className="relative w-full h-full pt-8 pb-20">
                <WindowManager />
            </div>

            <Dock />
        </div>
    )
}

export default Desktop
