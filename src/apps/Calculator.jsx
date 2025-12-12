import React, { useState, useEffect, useCallback } from 'react'
import { useStore } from '../store/useStore'

const Calculator = () => {
    const { darkMode } = useStore()
    const [display, setDisplay] = useState('0')
    const [prev, setPrev] = useState(null)
    const [op, setOp] = useState(null)
    const [newNum, setNewNum] = useState(true)
    const [memory, setMemory] = useState(0)
    const [isScientific, setIsScientific] = useState(false)
    const [isRadian, setIsRadian] = useState(true)
    const [history, setHistory] = useState([])

    // Format number for display
    const formatDisplay = (num) => {
        if (num === 'Error') return 'Error'
        const n = parseFloat(num)
        if (isNaN(n)) return '0'
        if (Math.abs(n) > 999999999999) {
            return n.toExponential(6)
        }
        // Limit decimal places to avoid floating point display issues
        const str = n.toString()
        if (str.includes('.') && str.split('.')[1]?.length > 10) {
            return parseFloat(n.toFixed(10)).toString()
        }
        return str
    }

    const handleNum = useCallback((num) => {
        if (display === 'Error') {
            setDisplay(num.toString())
            setNewNum(false)
            return
        }
        if (num === '.' && display.includes('.') && !newNum) return
        if (newNum) {
            setDisplay(num === '.' ? '0.' : num.toString())
            setNewNum(false)
        } else {
            if (display.length >= 15) return // Limit input length
            setDisplay(display === '0' && num !== '.' ? num.toString() : display + num)
        }
    }, [display, newNum])

    const handleOp = useCallback((operator) => {
        if (display === 'Error') return
        setOp(operator)
        setPrev(parseFloat(display))
        setNewNum(true)
    }, [display])

    const calculate = useCallback(() => {
        if (op && prev !== null && display !== 'Error') {
            const current = parseFloat(display)
            let result = 0
            try {
                switch (op) {
                    case '+': result = prev + current; break
                    case '-': result = prev - current; break
                    case '×': result = prev * current; break
                    case '÷':
                        if (current === 0) {
                            setDisplay('Error')
                            setPrev(null)
                            setOp(null)
                            setNewNum(true)
                            return
                        }
                        result = prev / current
                        break
                    case 'pow': result = Math.pow(prev, current); break
                    case 'yroot': result = Math.pow(prev, 1 / current); break
                    default: result = current
                }
                // Add to history
                setHistory(h => [...h.slice(-9), `${prev} ${op} ${current} = ${result}`])
                setDisplay(formatDisplay(result))
            } catch {
                setDisplay('Error')
            }
            setPrev(null)
            setOp(null)
            setNewNum(true)
        }
    }, [op, prev, display])

    const clear = useCallback(() => {
        setDisplay('0')
        setPrev(null)
        setOp(null)
        setNewNum(true)
    }, [])

    const clearEntry = useCallback(() => {
        setDisplay('0')
        setNewNum(true)
    }, [])

    // Scientific functions
    const scientificOp = useCallback((func) => {
        if (display === 'Error') return
        const n = parseFloat(display)
        let result
        try {
            switch (func) {
                case 'sin':
                    result = isRadian ? Math.sin(n) : Math.sin(n * Math.PI / 180)
                    break
                case 'cos':
                    result = isRadian ? Math.cos(n) : Math.cos(n * Math.PI / 180)
                    break
                case 'tan':
                    result = isRadian ? Math.tan(n) : Math.tan(n * Math.PI / 180)
                    break
                case 'asin':
                    result = isRadian ? Math.asin(n) : Math.asin(n) * 180 / Math.PI
                    break
                case 'acos':
                    result = isRadian ? Math.acos(n) : Math.acos(n) * 180 / Math.PI
                    break
                case 'atan':
                    result = isRadian ? Math.atan(n) : Math.atan(n) * 180 / Math.PI
                    break
                case 'sqrt': result = Math.sqrt(n); break
                case 'cbrt': result = Math.cbrt(n); break
                case 'square': result = n * n; break
                case 'cube': result = n * n * n; break
                case 'inv': result = 1 / n; break
                case 'log': result = Math.log10(n); break
                case 'ln': result = Math.log(n); break
                case 'exp': result = Math.exp(n); break
                case 'pow10': result = Math.pow(10, n); break
                case 'pow2': result = Math.pow(2, n); break
                case 'fact':
                    if (n < 0 || n > 170 || !Number.isInteger(n)) {
                        setDisplay('Error')
                        setNewNum(true)
                        return
                    }
                    result = 1
                    for (let i = 2; i <= n; i++) result *= i
                    break
                case 'abs': result = Math.abs(n); break
                case 'floor': result = Math.floor(n); break
                case 'ceil': result = Math.ceil(n); break
                case 'round': result = Math.round(n); break
                case 'sinh': result = Math.sinh(n); break
                case 'cosh': result = Math.cosh(n); break
                case 'tanh': result = Math.tanh(n); break
                default: return
            }
            if (isNaN(result) || !isFinite(result)) {
                setDisplay('Error')
            } else {
                setDisplay(formatDisplay(result))
            }
            setNewNum(true)
        } catch {
            setDisplay('Error')
            setNewNum(true)
        }
    }, [display, isRadian])

    const insertConstant = useCallback((constant) => {
        let value
        switch (constant) {
            case 'pi': value = Math.PI; break
            case 'e': value = Math.E; break
            case 'rand': value = Math.random(); break
            default: return
        }
        setDisplay(formatDisplay(value))
        setNewNum(true)
    }, [])

    // Memory functions
    const memoryAdd = useCallback(() => {
        if (display !== 'Error') {
            setMemory(m => m + parseFloat(display))
        }
    }, [display])

    const memorySubtract = useCallback(() => {
        if (display !== 'Error') {
            setMemory(m => m - parseFloat(display))
        }
    }, [display])

    const memoryRecall = useCallback(() => {
        setDisplay(formatDisplay(memory))
        setNewNum(true)
    }, [memory])

    const memoryClear = useCallback(() => {
        setMemory(0)
    }, [])

    // Keyboard support
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Don't capture if typing in another input
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return

            e.preventDefault()
            const key = e.key

            if (key >= '0' && key <= '9') {
                handleNum(parseInt(key))
            } else if (key === '.') {
                handleNum('.')
            } else if (key === '+') {
                handleOp('+')
            } else if (key === '-') {
                handleOp('-')
            } else if (key === '*') {
                handleOp('×')
            } else if (key === '/') {
                handleOp('÷')
            } else if (key === 'Enter' || key === '=') {
                calculate()
            } else if (key === 'Escape' || key === 'c' || key === 'C') {
                clear()
            } else if (key === 'Backspace') {
                if (display !== 'Error' && display.length > 1 && !newNum) {
                    setDisplay(display.slice(0, -1))
                } else {
                    setDisplay('0')
                    setNewNum(true)
                }
            } else if (key === '%') {
                if (display !== 'Error') {
                    setDisplay(formatDisplay(parseFloat(display) / 100))
                    setNewNum(true)
                }
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [handleNum, handleOp, calculate, clear, display, newNum])

    const btnClass = "h-11 rounded-full flex items-center justify-center text-lg font-medium transition-all active:scale-95 select-none"
    const grayBtn = `${btnClass} bg-gray-300 text-black hover:bg-gray-200`
    const orangeBtn = `${btnClass} bg-orange-500 text-white hover:bg-orange-400`
    const darkBtn = `${btnClass} ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-700 hover:bg-gray-600'} text-white`
    const scientificBtn = `${btnClass} bg-gray-600 text-white hover:bg-gray-500 text-sm`
    const activeOp = `${btnClass} bg-white text-orange-500`

    return (
        <div className={`w-full h-full flex flex-col ${darkMode ? 'bg-gray-900' : 'bg-gray-900'}`}>
            {/* Mode toggle */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-gray-700">
                <button
                    onClick={() => setIsScientific(!isScientific)}
                    className={`px-3 py-1 text-xs rounded-full transition-colors ${
                        isScientific
                            ? 'bg-orange-500 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                >
                    {isScientific ? 'Scientific' : 'Basic'}
                </button>
                {isScientific && (
                    <button
                        onClick={() => setIsRadian(!isRadian)}
                        className="px-3 py-1 text-xs rounded-full bg-gray-700 text-gray-300 hover:bg-gray-600"
                    >
                        {isRadian ? 'RAD' : 'DEG'}
                    </button>
                )}
                {memory !== 0 && (
                    <span className="text-xs text-gray-400">M: {formatDisplay(memory)}</span>
                )}
            </div>

            {/* Display */}
            <div className="flex-1 flex flex-col items-end justify-end px-4 pb-2 min-h-[80px]">
                {op && prev !== null && (
                    <div className="text-gray-500 text-sm mb-1">
                        {formatDisplay(prev)} {op}
                    </div>
                )}
                <div className="text-white text-4xl font-light truncate w-full text-right">
                    {display}
                </div>
            </div>

            {/* Scientific buttons */}
            {isScientific && (
                <div className="grid grid-cols-5 gap-1 px-2 pb-2">
                    <button className={scientificBtn} onClick={() => scientificOp('sin')}>sin</button>
                    <button className={scientificBtn} onClick={() => scientificOp('cos')}>cos</button>
                    <button className={scientificBtn} onClick={() => scientificOp('tan')}>tan</button>
                    <button className={scientificBtn} onClick={() => scientificOp('log')}>log</button>
                    <button className={scientificBtn} onClick={() => scientificOp('ln')}>ln</button>

                    <button className={scientificBtn} onClick={() => scientificOp('asin')}>sin⁻¹</button>
                    <button className={scientificBtn} onClick={() => scientificOp('acos')}>cos⁻¹</button>
                    <button className={scientificBtn} onClick={() => scientificOp('atan')}>tan⁻¹</button>
                    <button className={scientificBtn} onClick={() => scientificOp('exp')}>eˣ</button>
                    <button className={scientificBtn} onClick={() => scientificOp('pow10')}>10ˣ</button>

                    <button className={scientificBtn} onClick={() => scientificOp('sqrt')}>√</button>
                    <button className={scientificBtn} onClick={() => scientificOp('cbrt')}>∛</button>
                    <button className={scientificBtn} onClick={() => handleOp('pow')}>xʸ</button>
                    <button className={scientificBtn} onClick={() => handleOp('yroot')}>ʸ√x</button>
                    <button className={scientificBtn} onClick={() => scientificOp('inv')}>1/x</button>

                    <button className={scientificBtn} onClick={() => scientificOp('square')}>x²</button>
                    <button className={scientificBtn} onClick={() => scientificOp('cube')}>x³</button>
                    <button className={scientificBtn} onClick={() => scientificOp('fact')}>x!</button>
                    <button className={scientificBtn} onClick={() => insertConstant('pi')}>π</button>
                    <button className={scientificBtn} onClick={() => insertConstant('e')}>e</button>

                    <button className={scientificBtn} onClick={() => scientificOp('sinh')}>sinh</button>
                    <button className={scientificBtn} onClick={() => scientificOp('cosh')}>cosh</button>
                    <button className={scientificBtn} onClick={() => scientificOp('tanh')}>tanh</button>
                    <button className={scientificBtn} onClick={() => scientificOp('abs')}>|x|</button>
                    <button className={scientificBtn} onClick={() => insertConstant('rand')}>Rand</button>
                </div>
            )}

            {/* Memory buttons */}
            <div className="grid grid-cols-4 gap-2 px-3 pb-2">
                <button
                    className={`${btnClass} text-sm ${memory !== 0 ? 'bg-gray-600 text-white' : 'bg-gray-800 text-gray-500'}`}
                    onClick={memoryClear}
                >
                    MC
                </button>
                <button className={`${btnClass} text-sm bg-gray-800 text-gray-300 hover:bg-gray-700`} onClick={memoryRecall}>MR</button>
                <button className={`${btnClass} text-sm bg-gray-800 text-gray-300 hover:bg-gray-700`} onClick={memorySubtract}>M-</button>
                <button className={`${btnClass} text-sm bg-gray-800 text-gray-300 hover:bg-gray-700`} onClick={memoryAdd}>M+</button>
            </div>

            {/* Main buttons */}
            <div className="grid grid-cols-4 gap-2 p-3 pt-0">
                <button className={grayBtn} onClick={clear}>AC</button>
                <button className={grayBtn} onClick={() => {
                    if (display !== 'Error') {
                        setDisplay(formatDisplay(parseFloat(display) * -1))
                    }
                }}>+/-</button>
                <button className={grayBtn} onClick={() => {
                    if (display !== 'Error') {
                        setDisplay(formatDisplay(parseFloat(display) / 100))
                        setNewNum(true)
                    }
                }}>%</button>
                <button className={op === '÷' && newNum ? activeOp : orangeBtn} onClick={() => handleOp('÷')}>÷</button>

                {[7, 8, 9].map(n => (
                    <button key={n} className={darkBtn} onClick={() => handleNum(n)}>{n}</button>
                ))}
                <button className={op === '×' && newNum ? activeOp : orangeBtn} onClick={() => handleOp('×')}>×</button>

                {[4, 5, 6].map(n => (
                    <button key={n} className={darkBtn} onClick={() => handleNum(n)}>{n}</button>
                ))}
                <button className={op === '-' && newNum ? activeOp : orangeBtn} onClick={() => handleOp('-')}>-</button>

                {[1, 2, 3].map(n => (
                    <button key={n} className={darkBtn} onClick={() => handleNum(n)}>{n}</button>
                ))}
                <button className={op === '+' && newNum ? activeOp : orangeBtn} onClick={() => handleOp('+')}>+</button>

                <button className={`${darkBtn} col-span-2 rounded-full pl-6 justify-start`} onClick={() => handleNum(0)}>0</button>
                <button className={darkBtn} onClick={() => handleNum('.')}>.</button>
                <button className={orangeBtn} onClick={calculate}>=</button>
            </div>

            {/* Keyboard hint */}
            <div className="text-center text-gray-600 text-xs pb-2">
                Use keyboard: 0-9, +-*/=, Enter, Esc
            </div>
        </div>
    )
}

export default Calculator
