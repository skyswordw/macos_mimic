import React, { useState, useRef, useEffect } from 'react'

const Terminal = () => {
    const [history, setHistory] = useState([
        { type: 'output', content: 'Last login: ' + new Date().toString() },
        { type: 'output', content: 'Welcome to macOS Mimic Terminal.' }
    ])
    const [input, setInput] = useState('')
    const inputRef = useRef(null)
    const bottomRef = useRef(null)

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
        inputRef.current?.focus()
    }, [history])

    const handleCommand = (e) => {
        if (e.key === 'Enter') {
            const cmd = input.trim()
            const newHistory = [...history, { type: 'input', content: cmd }]

            let output = ''
            switch (cmd.toLowerCase()) {
                case 'help':
                    output = 'Available commands: help, clear, ls, date, echo [text], whoami'
                    break
                case 'clear':
                    setHistory([])
                    setInput('')
                    return
                case 'ls':
                    output = 'Desktop  Documents  Downloads  Music  Pictures  Public'
                    break
                case 'date':
                    output = new Date().toString()
                    break
                case 'whoami':
                    output = 'guest'
                    break
                default:
                    if (cmd.startsWith('echo ')) {
                        output = cmd.slice(5)
                    } else if (cmd !== '') {
                        output = `zsh: command not found: ${cmd}`
                    }
            }

            if (output) {
                newHistory.push({ type: 'output', content: output })
            }

            setHistory(newHistory)
            setInput('')
        }
    }

    return (
        <div
            className="w-full h-full bg-[#1e1e1e] text-white p-2 font-mono text-sm overflow-y-auto"
            onClick={() => inputRef.current?.focus()}
        >
            {history.map((item, i) => (
                <div key={i} className={`${item.type === 'input' ? 'mt-2' : 'text-gray-300'}`}>
                    {item.type === 'input' && <span className="text-green-400 mr-2">➜  ~</span>}
                    {item.content}
                </div>
            ))}

            <div className="flex mt-2">
                <span className="text-green-400 mr-2">➜  ~</span>
                <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleCommand}
                    className="flex-1 bg-transparent outline-none border-none"
                    autoFocus
                />
            </div>
            <div ref={bottomRef} />
        </div>
    )
}

export default Terminal
