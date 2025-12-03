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

    // 启动音效 (Boot chime - macOS风格)
    startup() {
        if (!this.enabled) return
        this.init()
        const now = this.audioContext.currentTime

        // F#maj7 和弦 - macOS启动音
        const frequencies = [369.99, 466.16, 554.37, 698.46] // F#, A#, C#, F#
        frequencies.forEach((freq, i) => {
            const oscillator = this.audioContext.createOscillator()
            const gainNode = this.audioContext.createGain()

            oscillator.connect(gainNode)
            gainNode.connect(this.audioContext.destination)

            oscillator.type = 'sine'
            oscillator.frequency.value = freq

            gainNode.gain.setValueAtTime(0, now)
            gainNode.gain.linearRampToValueAtTime(0.15 * this.volume, now + 0.1)
            gainNode.gain.setValueAtTime(0.15 * this.volume, now + 0.8)
            gainNode.gain.exponentialRampToValueAtTime(0.001, now + 1.5)

            oscillator.start(now)
            oscillator.stop(now + 1.5)
        })
    }

    // 清空回收站音效
    emptyTrash() {
        if (!this.enabled) return
        this.init()
        const now = this.audioContext.currentTime

        // 碎纸声 - 使用噪音和滤波器
        const bufferSize = this.audioContext.sampleRate * 0.5
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate)
        const data = buffer.getChannelData(0)

        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3))
        }

        const noise = this.audioContext.createBufferSource()
        const filter = this.audioContext.createBiquadFilter()
        const gainNode = this.audioContext.createGain()

        noise.buffer = buffer
        filter.type = 'highpass'
        filter.frequency.value = 2000

        noise.connect(filter)
        filter.connect(gainNode)
        gainNode.connect(this.audioContext.destination)

        gainNode.gain.setValueAtTime(0.3 * this.volume, now)
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.5)

        noise.start(now)
    }

    // 截图音效 (相机快门声)
    screenshot() {
        if (!this.enabled) return
        this.init()
        const now = this.audioContext.currentTime

        // 快门机械声
        const bufferSize = this.audioContext.sampleRate * 0.15
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate)
        const data = buffer.getChannelData(0)

        for (let i = 0; i < bufferSize; i++) {
            const t = i / this.audioContext.sampleRate
            data[i] = (Math.random() * 2 - 1) * Math.exp(-t * 30)
        }

        const noise = this.audioContext.createBufferSource()
        const filter = this.audioContext.createBiquadFilter()
        const gainNode = this.audioContext.createGain()

        noise.buffer = buffer
        filter.type = 'bandpass'
        filter.frequency.value = 3000
        filter.Q.value = 1

        noise.connect(filter)
        filter.connect(gainNode)
        gainNode.connect(this.audioContext.destination)

        gainNode.gain.setValueAtTime(0.4 * this.volume, now)

        noise.start(now)
    }

    // 按键音效
    keyPress() {
        if (!this.enabled) return
        this.play(1200, 0.03, 'square', 0.05 * this.volume)
    }

    // Whoosh 音效 (用于动画过渡)
    whoosh() {
        if (!this.enabled) return
        this.init()
        const now = this.audioContext.currentTime

        const bufferSize = this.audioContext.sampleRate * 0.2
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate)
        const data = buffer.getChannelData(0)

        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.sin(Math.PI * i / bufferSize)
        }

        const noise = this.audioContext.createBufferSource()
        const filter = this.audioContext.createBiquadFilter()
        const gainNode = this.audioContext.createGain()

        noise.buffer = buffer
        filter.type = 'lowpass'
        filter.frequency.setValueAtTime(500, now)
        filter.frequency.exponentialRampToValueAtTime(2000, now + 0.1)
        filter.frequency.exponentialRampToValueAtTime(500, now + 0.2)

        noise.connect(filter)
        filter.connect(gainNode)
        gainNode.connect(this.audioContext.destination)

        gainNode.gain.setValueAtTime(0.15 * this.volume, now)
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.2)

        noise.start(now)
    }

    // 成功/完成音效
    success() {
        if (!this.enabled) return
        this.init()
        const now = this.audioContext.currentTime

        // 上升的两个音符
        const frequencies = [523.25, 783.99] // C5, G5
        frequencies.forEach((freq, i) => {
            const oscillator = this.audioContext.createOscillator()
            const gainNode = this.audioContext.createGain()

            oscillator.connect(gainNode)
            gainNode.connect(this.audioContext.destination)

            oscillator.type = 'sine'
            oscillator.frequency.value = freq

            gainNode.gain.setValueAtTime(0.2 * this.volume, now + i * 0.08)
            gainNode.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.2)

            oscillator.start(now + i * 0.08)
            oscillator.stop(now + i * 0.08 + 0.2)
        })
    }

    // 拖放音效
    drop() {
        if (!this.enabled) return
        this.init()
        const now = this.audioContext.currentTime

        const oscillator = this.audioContext.createOscillator()
        const gainNode = this.audioContext.createGain()

        oscillator.connect(gainNode)
        gainNode.connect(this.audioContext.destination)

        oscillator.type = 'sine'
        oscillator.frequency.setValueAtTime(600, now)
        oscillator.frequency.exponentialRampToValueAtTime(400, now + 0.1)

        gainNode.gain.setValueAtTime(0.2 * this.volume, now)
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.1)

        oscillator.start(now)
        oscillator.stop(now + 0.1)
    }

    // 登录音效
    login() {
        if (!this.enabled) return
        this.init()
        const now = this.audioContext.currentTime

        // 欢迎和弦
        const frequencies = [392, 493.88, 587.33, 783.99] // G4, B4, D5, G5
        frequencies.forEach((freq, i) => {
            const oscillator = this.audioContext.createOscillator()
            const gainNode = this.audioContext.createGain()

            oscillator.connect(gainNode)
            gainNode.connect(this.audioContext.destination)

            oscillator.type = 'sine'
            oscillator.frequency.value = freq

            gainNode.gain.setValueAtTime(0, now + i * 0.05)
            gainNode.gain.linearRampToValueAtTime(0.12 * this.volume, now + i * 0.05 + 0.05)
            gainNode.gain.exponentialRampToValueAtTime(0.001, now + i * 0.05 + 0.4)

            oscillator.start(now + i * 0.05)
            oscillator.stop(now + i * 0.05 + 0.4)
        })
    }

    // 弹出/Pop音效
    pop() {
        if (!this.enabled) return
        this.init()
        const now = this.audioContext.currentTime

        const oscillator = this.audioContext.createOscillator()
        const gainNode = this.audioContext.createGain()

        oscillator.connect(gainNode)
        gainNode.connect(this.audioContext.destination)

        oscillator.type = 'sine'
        oscillator.frequency.setValueAtTime(400, now)
        oscillator.frequency.exponentialRampToValueAtTime(600, now + 0.05)

        gainNode.gain.setValueAtTime(0.25 * this.volume, now)
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.08)

        oscillator.start(now)
        oscillator.stop(now + 0.08)
    }

    // 提醒/警告音效
    alert() {
        if (!this.enabled) return
        this.init()
        const now = this.audioContext.currentTime

        // 三次重复的提示音
        for (let j = 0; j < 3; j++) {
            const oscillator = this.audioContext.createOscillator()
            const gainNode = this.audioContext.createGain()

            oscillator.connect(gainNode)
            gainNode.connect(this.audioContext.destination)

            oscillator.type = 'sine'
            oscillator.frequency.value = 880

            gainNode.gain.setValueAtTime(0.2 * this.volume, now + j * 0.15)
            gainNode.gain.exponentialRampToValueAtTime(0.001, now + j * 0.15 + 0.1)

            oscillator.start(now + j * 0.15)
            oscillator.stop(now + j * 0.15 + 0.1)
        }
    }

    // 锁屏音效
    lock() {
        if (!this.enabled) return
        this.init()
        const now = this.audioContext.currentTime

        const oscillator = this.audioContext.createOscillator()
        const gainNode = this.audioContext.createGain()

        oscillator.connect(gainNode)
        gainNode.connect(this.audioContext.destination)

        oscillator.type = 'triangle'
        oscillator.frequency.setValueAtTime(500, now)
        oscillator.frequency.exponentialRampToValueAtTime(300, now + 0.15)

        gainNode.gain.setValueAtTime(0.2 * this.volume, now)
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.15)

        oscillator.start(now)
        oscillator.stop(now + 0.15)
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
