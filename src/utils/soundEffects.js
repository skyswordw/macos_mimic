// Web Audio API 音效系统
class SoundEffects {
    constructor() {
        this.audioContext = null
        this.enabled = true
        this.volume = 0.3
    }

    // 初始化音频上下文
    init() {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)()
        }
    }

    // 播放音效
    play(frequency, duration, type = 'sine', volume = this.volume) {
        if (!this.enabled) return

        this.init()

        const oscillator = this.audioContext.createOscillator()
        const gainNode = this.audioContext.createGain()

        oscillator.connect(gainNode)
        gainNode.connect(this.audioContext.destination)

        oscillator.type = type
        oscillator.frequency.value = frequency

        gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration)

        oscillator.start(this.audioContext.currentTime)
        oscillator.stop(this.audioContext.currentTime + duration)
    }

    // 点击音效
    click() {
        this.play(800, 0.05, 'sine', 0.1)
    }

    // 窗口打开音效
    windowOpen() {
        this.init()
        const now = this.audioContext.currentTime

        // 上升音调
        const oscillator = this.audioContext.createOscillator()
        const gainNode = this.audioContext.createGain()

        oscillator.connect(gainNode)
        gainNode.connect(this.audioContext.destination)

        oscillator.type = 'sine'
        oscillator.frequency.setValueAtTime(400, now)
        oscillator.frequency.exponentialRampToValueAtTime(800, now + 0.15)

        gainNode.gain.setValueAtTime(0.15, now)
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.15)

        oscillator.start(now)
        oscillator.stop(now + 0.15)
    }

    // 窗口关闭音效
    windowClose() {
        this.init()
        const now = this.audioContext.currentTime

        // 下降音调
        const oscillator = this.audioContext.createOscillator()
        const gainNode = this.audioContext.createGain()

        oscillator.connect(gainNode)
        gainNode.connect(this.audioContext.destination)

        oscillator.type = 'sine'
        oscillator.frequency.setValueAtTime(800, now)
        oscillator.frequency.exponentialRampToValueAtTime(400, now + 0.15)

        gainNode.gain.setValueAtTime(0.15, now)
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.15)

        oscillator.start(now)
        oscillator.stop(now + 0.15)
    }

    // 窗口最小化音效
    windowMinimize() {
        this.init()
        const now = this.audioContext.currentTime

        // 快速下降音调
        const oscillator = this.audioContext.createOscillator()
        const gainNode = this.audioContext.createGain()

        oscillator.connect(gainNode)
        gainNode.connect(this.audioContext.destination)

        oscillator.type = 'triangle'
        oscillator.frequency.setValueAtTime(1000, now)
        oscillator.frequency.exponentialRampToValueAtTime(200, now + 0.2)

        gainNode.gain.setValueAtTime(0.2, now)
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2)

        oscillator.start(now)
        oscillator.stop(now + 0.2)
    }

    // 窗口最大化音效
    windowMaximize() {
        this.init()
        const now = this.audioContext.currentTime

        // 双音效
        for (let i = 0; i < 2; i++) {
            const oscillator = this.audioContext.createOscillator()
            const gainNode = this.audioContext.createGain()

            oscillator.connect(gainNode)
            gainNode.connect(this.audioContext.destination)

            oscillator.type = 'sine'
            oscillator.frequency.value = 600 + (i * 200)

            gainNode.gain.setValueAtTime(0.1, now)
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1)

            oscillator.start(now)
            oscillator.stop(now + 0.1)
        }
    }

    // Launchpad 打开音效
    launchpadOpen() {
        this.init()
        const now = this.audioContext.currentTime

        // 和弦音效
        const frequencies = [523.25, 659.25, 783.99] // C, E, G
        frequencies.forEach((freq, i) => {
            const oscillator = this.audioContext.createOscillator()
            const gainNode = this.audioContext.createGain()

            oscillator.connect(gainNode)
            gainNode.connect(this.audioContext.destination)

            oscillator.type = 'sine'
            oscillator.frequency.value = freq

            gainNode.gain.setValueAtTime(0, now + i * 0.02)
            gainNode.gain.linearRampToValueAtTime(0.08, now + i * 0.02 + 0.01)
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + i * 0.02 + 0.15)

            oscillator.start(now + i * 0.02)
            oscillator.stop(now + i * 0.02 + 0.15)
        })
    }

    // Launchpad 关闭音效
    launchpadClose() {
        this.play(600, 0.1, 'sine', 0.1)
    }

    // Spotlight 打开音效
    spotlightOpen() {
        this.init()
        const now = this.audioContext.currentTime

        const oscillator = this.audioContext.createOscillator()
        const gainNode = this.audioContext.createGain()

        oscillator.connect(gainNode)
        gainNode.connect(this.audioContext.destination)

        oscillator.type = 'sine'
        oscillator.frequency.setValueAtTime(1200, now)
        oscillator.frequency.exponentialRampToValueAtTime(1800, now + 0.08)

        gainNode.gain.setValueAtTime(0.12, now)
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.08)

        oscillator.start(now)
        oscillator.stop(now + 0.08)
    }

    // 通知音效
    notification() {
        this.init()
        const now = this.audioContext.currentTime

        // 两个快速音符
        const frequencies = [1046.5, 1318.5] // C6, E6
        frequencies.forEach((freq, i) => {
            const oscillator = this.audioContext.createOscillator()
            const gainNode = this.audioContext.createGain()

            oscillator.connect(gainNode)
            gainNode.connect(this.audioContext.destination)

            oscillator.type = 'sine'
            oscillator.frequency.value = freq

            gainNode.gain.setValueAtTime(0.15, now + i * 0.1)
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + i * 0.1 + 0.15)

            oscillator.start(now + i * 0.1)
            oscillator.stop(now + i * 0.1 + 0.15)
        })
    }

    // 桌面切换音效
    desktopSwitch() {
        this.play(700, 0.08, 'triangle', 0.12)
    }

    // 错误音效
    error() {
        this.init()
        const now = this.audioContext.currentTime

        const oscillator = this.audioContext.createOscillator()
        const gainNode = this.audioContext.createGain()

        oscillator.connect(gainNode)
        gainNode.connect(this.audioContext.destination)

        oscillator.type = 'sawtooth'
        oscillator.frequency.value = 200

        gainNode.gain.setValueAtTime(0.2, now)
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3)

        oscillator.start(now)
        oscillator.stop(now + 0.3)
    }

    // 启用/禁用音效
    toggle() {
        this.enabled = !this.enabled
    }

    // 设置音量
    setVolume(vol) {
        this.volume = Math.max(0, Math.min(1, vol))
    }
}

// 导出单例
export const soundEffects = new SoundEffects()
