import React, { useState } from 'react'

const Calculator = () => {
    const [display, setDisplay] = useState('0')
    const [prev, setPrev] = useState(null)
    const [op, setOp] = useState(null)
    const [newNum, setNewNum] = useState(true)

    const handleNum = (num) => {
        if (newNum) {
            setDisplay(num.toString())
            setNewNum(false)
        } else {
            setDisplay(display === '0' ? num.toString() : display + num)
        }
    }

    const handleOp = (operator) => {
        setOp(operator)
        setPrev(parseFloat(display))
        setNewNum(true)
    }

    const calculate = () => {
        if (op && prev !== null) {
            const current = parseFloat(display)
            let result = 0
            switch (op) {
                case '+': result = prev + current; break;
                case '-': result = prev - current; break;
                case '×': result = prev * current; break;
                case '÷': result = prev / current; break;
            }
            setDisplay(result.toString())
            setPrev(null)
            setOp(null)
            setNewNum(true)
        }
    }

    const clear = () => {
        setDisplay('0')
        setPrev(null)
        setOp(null)
        setNewNum(true)
    }

    const btnClass = "h-12 w-12 rounded-full flex items-center justify-center text-xl font-medium transition active:scale-95"
    const grayBtn = `${btnClass} bg-gray-300 text-black hover:bg-gray-200`
    const orangeBtn = `${btnClass} bg-orange-400 text-white hover:bg-orange-300`
    const darkBtn = `${btnClass} bg-gray-700 text-white hover:bg-gray-600`

    return (
        <div className="w-full h-full bg-gray-900 p-4 flex flex-col">
            <div className="flex-1 flex items-end justify-end text-white text-5xl font-light mb-4 px-2 truncate">
                {display}
            </div>

            <div className="grid grid-cols-4 gap-3">
                <button className={grayBtn} onClick={clear}>AC</button>
                <button className={grayBtn} onClick={() => setDisplay(parseFloat(display) * -1)}>+/-</button>
                <button className={grayBtn} onClick={() => setDisplay(parseFloat(display) / 100)}>%</button>
                <button className={orangeBtn} onClick={() => handleOp('÷')}>÷</button>

                {[7, 8, 9].map(n => <button key={n} className={darkBtn} onClick={() => handleNum(n)}>{n}</button>)}
                <button className={orangeBtn} onClick={() => handleOp('×')}>×</button>

                {[4, 5, 6].map(n => <button key={n} className={darkBtn} onClick={() => handleNum(n)}>{n}</button>)}
                <button className={orangeBtn} onClick={() => handleOp('-')}>-</button>

                {[1, 2, 3].map(n => <button key={n} className={darkBtn} onClick={() => handleNum(n)}>{n}</button>)}
                <button className={orangeBtn} onClick={() => handleOp('+')}>+</button>

                <button className={`${darkBtn} col-span-2 w-auto rounded-full pl-6 justify-start`} onClick={() => handleNum(0)}>0</button>
                <button className={darkBtn} onClick={() => handleNum('.')}>.</button>
                <button className={orangeBtn} onClick={calculate}>=</button>
            </div>
        </div>
    )
}

export default Calculator
