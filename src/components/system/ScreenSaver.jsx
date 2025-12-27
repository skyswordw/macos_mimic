import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useStore } from '../../store/useStore'

const ScreenSaver = ({ onDismiss }) => {
    const { darkMode } = useStore()
    const [currentTime, setCurrentTime] = useState(new Date())
    const [position, setPosition] = useState({ x: 50, y: 50 })
    const [velocity, setVelocity] = useState({ x: 0.5, y: 0.3 })
    const [saverType, setSaverType] = useState('clock') // 'clock', 'particles', 'matrix'
    const canvasRef = useRef(null)

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000)
        return () => clearInterval(timer)
    }, [])

    // Bouncing clock position
    useEffect(() => {
        if (saverType !== 'clock') return
        const interval = setInterval(() => {
            setPosition(prev => {
                let newX = prev.x + velocity.x
                let newY = prev.y + velocity.y
                let newVelX = velocity.x
                let newVelY = velocity.y

                if (newX <= 10 || newX >= 90) newVelX = -velocity.x
                if (newY <= 10 || newY >= 90) newVelY = -velocity.y

                setVelocity({ x: newVelX, y: newVelY })
                return { x: Math.max(10, Math.min(90, newX)), y: Math.max(10, Math.min(90, newY)) }
            })
        }, 50)
        return () => clearInterval(interval)
    }, [saverType, velocity])

    // Matrix effect
    useEffect(() => {
        if (saverType !== 'matrix' || !canvasRef.current) return
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight

        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()'.split('')
        const fontSize = 14
        const columns = canvas.width / fontSize
        const drops = Array(Math.floor(columns)).fill(1)

        const draw = () => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
            ctx.fillRect(0, 0, canvas.width, canvas.height)
            ctx.fillStyle = '#0f0'
            ctx.font = `${fontSize}px monospace`

            for (let i = 0; i < drops.length; i++) {
                const char = chars[Math.floor(Math.random() * chars.length)]
                ctx.fillText(char, i * fontSize, drops[i] * fontSize)
                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0
                }
                drops[i]++
            }
        }

        const interval = setInterval(draw, 50)
        return () => clearInterval(interval)
    }, [saverType])

    // Particles effect
    useEffect(() => {
        if (saverType !== 'particles' || !canvasRef.current) return
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight

        const particles = Array.from({ length: 100 }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            size: Math.random() * 3 + 1,
            hue: Math.random() * 360
        }))

        const draw = () => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            particles.forEach(p => {
                p.x += p.vx
                p.y += p.vy
                if (p.x < 0 || p.x > canvas.width) p.vx *= -1
                if (p.y < 0 || p.y > canvas.height) p.vy *= -1
                p.hue = (p.hue + 0.5) % 360

                ctx.beginPath()
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
                ctx.fillStyle = `hsla(${p.hue}, 100%, 50%, 0.8)`
                ctx.fill()
            })

            // Draw connections
            particles.forEach((p1, i) => {
                particles.slice(i + 1).forEach(p2 => {
                    const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y)
                    if (dist < 100) {
                        ctx.beginPath()
                        ctx.moveTo(p1.x, p1.y)
                        ctx.lineTo(p2.x, p2.y)
                        ctx.strokeStyle = `rgba(255, 255, 255, ${1 - dist / 100})`
                        ctx.stroke()
                    }
                })
            })
        }

        const interval = setInterval(draw, 30)
        return () => clearInterval(interval)
    }, [saverType])

    const formatTime = (date) => {
        return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
    }

    const handleClick = () => {
        onDismiss()
    }

    const handleKeyDown = (e) => {
        onDismiss()
    }

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [])

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black cursor-none"
            onClick={handleClick}
        >
            {/* Screensaver type selector (bottom) */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 opacity-0 hover:opacity-100 transition-opacity z-10">
                {['clock', 'particles', 'matrix'].map(type => (
                    <button
                        key={type}
                        onClick={(e) => { e.stopPropagation(); setSaverType(type) }}
                        className={`px-3 py-1 rounded-full text-xs capitalize ${saverType === type ? 'bg-white text-black' : 'bg-white/20 text-white'}`}
                    >
                        {type}
                    </button>
                ))}
            </div>

            {saverType === 'clock' && (
                <motion.div
                    className="absolute text-white"
                    style={{ left: `${position.x}%`, top: `${position.y}%`, transform: 'translate(-50%, -50%)' }}
                >
                    <div className="text-8xl font-light">{formatTime(currentTime)}</div>
                    <div className="text-2xl text-center opacity-60 mt-2">
                        {currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                    </div>
                </motion.div>
            )}

            {(saverType === 'particles' || saverType === 'matrix') && (
                <canvas ref={canvasRef} className="absolute inset-0" />
            )}

            <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 text-white/30 text-sm">
                Click or press any key to exit
            </div>
        </motion.div>
    )
}

export default ScreenSaver
