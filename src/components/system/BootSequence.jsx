import React, { useState, useEffect } from 'react'
import { FaApple, FaArrowRight } from 'react-icons/fa'
import { useStore } from '../../store/useStore'

const BootSequence = () => {
    const { setLogin } = useStore()
    const [booted, setBooted] = useState(false)
    const [progress, setProgress] = useState(0)
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(timer)
                    setTimeout(() => setBooted(true), 500)
                    return 100
                }
                return prev + 1
            })
        }, 30)
        return () => clearInterval(timer)
    }, [])

    const handleLogin = () => {
        setLoading(true)
        setTimeout(() => {
            setLogin(true)
        }, 1500)
    }

    if (!booted) {
        return (
            <div className="w-full h-full bg-black flex flex-col items-center justify-center text-white">
                <FaApple className="text-8xl mb-16" />
                <div className="w-64 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-white rounded-full transition-all duration-100 ease-linear"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>
        )
    }

    return (
        <div className="w-full h-full bg-cover bg-center flex flex-col items-center justify-center relative"
            style={{ backgroundImage: "url('https://4kwallpapers.com/images/wallpapers/macos-monterey-stock-purple-dark-mode-layers-5k-4480x2520-5888.jpg')" }}>
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />

            <div className="z-10 flex flex-col items-center gap-4 animate-fadeIn">
                <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-4xl shadow-2xl overflow-hidden">
                    <img src="https://github.com/shadcn.png" alt="User" className="w-full h-full" />
                </div>
                <div className="text-white font-bold text-xl drop-shadow-md">User</div>

                <div className="relative group">
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                        placeholder="Enter Password"
                        className="bg-white/20 backdrop-blur-md border border-white/30 rounded-full px-4 py-1 text-white placeholder-gray-300 outline-none w-48 text-center text-sm transition-all focus:w-52 focus:bg-white/30"
                        disabled={loading}
                    />
                    {password && !loading && (
                        <div
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-white/80 cursor-pointer hover:text-white"
                            onClick={handleLogin}
                        >
                            <FaArrowRight className="text-xs" />
                        </div>
                    )}
                    {loading && (
                        <div className="absolute right-2 top-1/2 -translate-y-1/2">
                            <div className="w-3 h-3 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                        </div>
                    )}
                </div>

                <div className="mt-8 flex flex-col items-center gap-1 text-white/80 text-xs">
                    <p>Click Enter to login</p>
                </div>
            </div>
        </div>
    )
}

export default BootSequence
