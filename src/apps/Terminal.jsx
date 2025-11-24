import React, { useState, useRef, useEffect } from 'react'

const Terminal = () => {
    // 模拟文件系统
    const [fileSystem] = useState({
        '/': {
            type: 'directory',
            children: {
                'Users': {
                    type: 'directory',
                    children: {
                        'guest': {
                            type: 'directory',
                            children: {
                                'Desktop': {
                                    type: 'directory',
                                    children: {
                                        'project.txt': { type: 'file', content: 'My awesome project' },
                                        'notes.md': { type: 'file', content: '# Notes\n\nImportant notes here' }
                                    }
                                },
                                'Documents': {
                                    type: 'directory',
                                    children: {
                                        'resume.pdf': { type: 'file', content: '[PDF content]' },
                                        'work': { type: 'directory', children: {} }
                                    }
                                },
                                'Downloads': {
                                    type: 'directory',
                                    children: {
                                        'app.dmg': { type: 'file', content: '[Application installer]' }
                                    }
                                },
                                'Music': { type: 'directory', children: {} },
                                'Pictures': { type: 'directory', children: {} },
                                'Public': { type: 'directory', children: {} }
                            }
                        }
                    }
                }
            }
        }
    })

    const [currentPath, setCurrentPath] = useState('/Users/guest')
    const [history, setHistory] = useState([
        { type: 'output', content: 'Last login: ' + new Date().toLocaleString() },
        { type: 'output', content: 'Welcome to macOS Mimic Terminal v2.0' },
        { type: 'output', content: 'Type "help" for available commands.' }
    ])
    const [input, setInput] = useState('')
    const [commandHistory, setCommandHistory] = useState([])
    const [historyIndex, setHistoryIndex] = useState(-1)
    const [tabCompletions, setTabCompletions] = useState([])
    const [tabIndex, setTabIndex] = useState(0)
    const [environment] = useState({
        USER: 'guest',
        HOME: '/Users/guest',
        SHELL: '/bin/zsh',
        PATH: '/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin'
    })

    const inputRef = useRef(null)
    const bottomRef = useRef(null)

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
        inputRef.current?.focus()
    }, [history])

    // 获取当前目录的文件系统节点
    const getNode = (path) => {
        const parts = path.split('/').filter(Boolean)
        let node = fileSystem['/']

        for (const part of parts) {
            if (node.children && node.children[part]) {
                node = node.children[part]
            } else {
                return null
            }
        }
        return node
    }

    // 解析路径
    const resolvePath = (path) => {
        if (path.startsWith('/')) {
            return path
        } else if (path === '~') {
            return environment.HOME
        } else if (path.startsWith('~/')) {
            return environment.HOME + path.slice(1)
        } else if (path === '..') {
            const parts = currentPath.split('/').filter(Boolean)
            parts.pop()
            return '/' + parts.join('/')
        } else if (path === '.') {
            return currentPath
        } else {
            return currentPath === '/' ? '/' + path : currentPath + '/' + path
        }
    }

    // 命令处理器
    const executeCommand = (cmdLine) => {
        const parts = cmdLine.trim().split(' ')
        const cmd = parts[0]
        const args = parts.slice(1)

        switch (cmd) {
            case '':
                return ''

            case 'help':
                return `Available commands:
  File System:
    ls [path]      - List directory contents
    cd [path]      - Change directory
    pwd           - Print working directory
    mkdir <name>  - Create directory
    touch <file>  - Create empty file
    rm <file>     - Remove file or directory
    cat <file>    - Display file contents
    echo <text>   - Display text

  System:
    clear         - Clear terminal
    date          - Display current date
    whoami        - Display current user
    uname [-a]    - Display system information
    hostname      - Display hostname
    uptime        - Display system uptime
    env           - Display environment variables
    which <cmd>   - Show command location

  Process:
    ps            - List processes
    top           - Display system resources
    kill <pid>    - Terminate process

  Network:
    ping <host>   - Ping a host
    ifconfig      - Display network configuration
    curl <url>    - Fetch URL content

  Other:
    history       - Show command history
    man <cmd>     - Display manual for command
    exit          - Exit terminal`

            case 'clear':
                setHistory([])
                return null

            case 'pwd':
                return currentPath

            case 'cd':
                if (args.length === 0) {
                    setCurrentPath(environment.HOME)
                    return ''
                }
                const newPath = resolvePath(args[0])
                const node = getNode(newPath)
                if (node && node.type === 'directory') {
                    setCurrentPath(newPath)
                    return ''
                } else {
                    return `cd: ${args[0]}: No such file or directory`
                }

            case 'ls':
                const targetPath = args.length > 0 ? resolvePath(args[0]) : currentPath
                const targetNode = getNode(targetPath)
                if (!targetNode) {
                    return `ls: ${args[0]}: No such file or directory`
                }
                if (targetNode.type === 'file') {
                    return args.length > 0 ? args[0] : targetPath.split('/').pop()
                }
                const items = Object.keys(targetNode.children || {})
                if (items.length === 0) {
                    return ''
                }
                // Color code directories and files
                return items.map(item => {
                    const itemNode = targetNode.children[item]
                    if (itemNode.type === 'directory') {
                        return `\x1b[34m${item}\x1b[0m`  // Blue for directories
                    }
                    return item
                }).join('  ')

            case 'mkdir':
                if (args.length === 0) {
                    return 'mkdir: missing operand'
                }
                return `mkdir: ${args[0]} (directory created - simulation only)`

            case 'touch':
                if (args.length === 0) {
                    return 'touch: missing file operand'
                }
                return `touch: ${args[0]} (file created - simulation only)`

            case 'rm':
                if (args.length === 0) {
                    return 'rm: missing operand'
                }
                return `rm: ${args[0]} (removed - simulation only)`

            case 'cat':
                if (args.length === 0) {
                    return 'cat: missing file operand'
                }
                const filePath = resolvePath(args[0])
                const fileNode = getNode(filePath)
                if (!fileNode) {
                    return `cat: ${args[0]}: No such file or directory`
                }
                if (fileNode.type === 'directory') {
                    return `cat: ${args[0]}: Is a directory`
                }
                return fileNode.content || '(empty file)'

            case 'echo':
                return args.join(' ')

            case 'date':
                return new Date().toString()

            case 'whoami':
                return environment.USER

            case 'uname':
                if (args.includes('-a')) {
                    return 'Darwin MacBook-Pro.local 21.6.0 Darwin Kernel Version 21.6.0 x86_64'
                }
                return 'Darwin'

            case 'hostname':
                return 'MacBook-Pro.local'

            case 'uptime':
                const uptime = Math.floor(Math.random() * 24)
                return `${new Date().toLocaleTimeString()} up ${uptime}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}, 1 user, load averages: 1.42 1.38 1.44`

            case 'env':
                return Object.entries(environment).map(([key, value]) => `${key}=${value}`).join('\n')

            case 'which':
                if (args.length === 0) {
                    return 'which: missing argument'
                }
                const commands = ['ls', 'cd', 'pwd', 'mkdir', 'rm', 'cat', 'echo', 'clear']
                if (commands.includes(args[0])) {
                    return `/usr/bin/${args[0]}`
                }
                return `${args[0]} not found`

            case 'ps':
                return `  PID TTY          TIME CMD
  501 ttys000    0:00.03 -zsh
  612 ttys000    0:00.01 node
  723 ttys000    0:00.00 ps`

            case 'top':
                return `Processes: 412 total, 3 running, 409 sleeping
Load Avg: 1.42, 1.38, 1.44
CPU usage: 12.3% user, 8.7% sys, 79.0% idle
Memory: 16G used, 2G free`

            case 'kill':
                if (args.length === 0) {
                    return 'kill: missing process id'
                }
                return `kill: ${args[0]} terminated (simulation)`

            case 'ping':
                if (args.length === 0) {
                    return 'ping: missing host'
                }
                return `PING ${args[0]}: 64 bytes from ${args[0]}: icmp_seq=0 ttl=64 time=0.089 ms`

            case 'ifconfig':
                return `en0: flags=8863 mtu 1500
    inet 192.168.1.100 netmask 0xffffff00 broadcast 192.168.1.255`

            case 'curl':
                if (args.length === 0) {
                    return 'curl: missing URL'
                }
                return `curl: ${args[0]} (simulated response - 200 OK)`

            case 'history':
                return commandHistory.map((cmd, i) => `  ${i + 1}  ${cmd}`).join('\n')

            case 'man':
                if (args.length === 0) {
                    return 'What manual page do you want?'
                }
                return `${args[0].toUpperCase()}(1)    User Commands    ${args[0].toUpperCase()}(1)

NAME
    ${args[0]} - ${args[0]} command

SYNOPSIS
    ${args[0]} [options] [arguments]

DESCRIPTION
    This is the manual page for ${args[0]} command.
    (Full documentation would appear here)

SEE ALSO
    man(1), help(1)`

            case 'exit':
                return 'logout\n[Process completed]'

            default:
                // 检查是否是变量赋值
                if (cmd.includes('=')) {
                    const [key, value] = cmd.split('=')
                    return `${key}=${value} (variable set - simulation only)`
                }
                return `zsh: command not found: ${cmd}`
        }
    }

    const handleKeyDown = (e) => {
        // 命令历史导航
        if (e.key === 'ArrowUp') {
            e.preventDefault()
            if (commandHistory.length > 0 && historyIndex < commandHistory.length - 1) {
                const newIndex = historyIndex + 1
                setHistoryIndex(newIndex)
                setInput(commandHistory[commandHistory.length - 1 - newIndex])
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault()
            if (historyIndex > 0) {
                const newIndex = historyIndex - 1
                setHistoryIndex(newIndex)
                setInput(commandHistory[commandHistory.length - 1 - newIndex])
            } else if (historyIndex === 0) {
                setHistoryIndex(-1)
                setInput('')
            }
        } else if (e.key === 'Tab') {
            // Tab 自动补全
            e.preventDefault()
            if (input.trim()) {
                const parts = input.split(' ')
                const lastPart = parts[parts.length - 1]
                const commands = ['help', 'clear', 'ls', 'cd', 'pwd', 'mkdir', 'touch', 'rm', 'cat',
                                'echo', 'date', 'whoami', 'uname', 'hostname', 'uptime', 'env',
                                'which', 'ps', 'top', 'kill', 'ping', 'ifconfig', 'curl', 'history',
                                'man', 'exit']

                // 如果是第一个词，补全命令
                if (parts.length === 1) {
                    const matches = commands.filter(cmd => cmd.startsWith(lastPart))
                    if (matches.length === 1) {
                        setInput(matches[0])
                    } else if (matches.length > 1) {
                        if (tabCompletions.length === 0) {
                            setTabCompletions(matches)
                            setTabIndex(0)
                        } else {
                            const nextIndex = (tabIndex + 1) % matches.length
                            setTabIndex(nextIndex)
                            setInput(matches[nextIndex])
                        }
                    }
                } else {
                    // 补全文件路径
                    const currentNode = getNode(currentPath)
                    if (currentNode && currentNode.children) {
                        const matches = Object.keys(currentNode.children).filter(name =>
                            name.startsWith(lastPart)
                        )
                        if (matches.length === 1) {
                            parts[parts.length - 1] = matches[0]
                            setInput(parts.join(' '))
                        }
                    }
                }
            }
        } else if (e.key === 'Enter') {
            const cmd = input.trim()
            const newHistory = [...history, { type: 'input', content: cmd }]

            if (cmd) {
                setCommandHistory([...commandHistory, cmd])
                const output = executeCommand(cmd)
                if (output !== null && output !== '') {
                    newHistory.push({ type: 'output', content: output })
                }
            }

            setHistory(newHistory)
            setInput('')
            setHistoryIndex(-1)
            setTabCompletions([])
            setTabIndex(0)
        } else if (e.ctrlKey && e.key === 'c') {
            // Ctrl+C 中断
            e.preventDefault()
            const newHistory = [...history, { type: 'input', content: input + '^C' }]
            setHistory(newHistory)
            setInput('')
        } else if (e.ctrlKey && e.key === 'l') {
            // Ctrl+L 清屏
            e.preventDefault()
            setHistory([])
        } else {
            // 重置 tab 补全状态
            if (e.key !== 'Tab') {
                setTabCompletions([])
                setTabIndex(0)
            }
        }
    }

    // 获取提示符
    const getPrompt = () => {
        const pathDisplay = currentPath === environment.HOME ? '~' :
                          currentPath.startsWith(environment.HOME) ?
                          '~' + currentPath.slice(environment.HOME.length) :
                          currentPath
        return `${environment.USER}@MacBook-Pro ${pathDisplay} %`
    }

    // 处理输出中的颜色代码
    const renderOutput = (content) => {
        // 简单的 ANSI 颜色代码处理
        if (content.includes('\x1b[')) {
            const parts = content.split(/(\x1b\[\d+m[^\x1b]*\x1b\[0m)/)
            return parts.map((part, i) => {
                if (part.includes('\x1b[34m')) {
                    // 蓝色（目录）
                    const text = part.replace(/\x1b\[\d+m/g, '').replace(/\x1b\[0m/g, '')
                    return <span key={i} className="text-blue-400">{text}</span>
                }
                return part
            })
        }
        return content
    }

    return (
        <div
            className="w-full h-full bg-[#1e1e1e] text-white p-3 font-mono text-sm overflow-y-auto"
            onClick={() => inputRef.current?.focus()}
        >
            <style jsx>{`
                @keyframes blink {
                    0%, 50% { opacity: 1; }
                    51%, 100% { opacity: 0; }
                }
                .cursor::after {
                    content: '█';
                    animation: blink 1s infinite;
                    color: #10b981;
                }
            `}</style>

            {history.map((item, i) => (
                <div key={i} className={`${item.type === 'input' ? 'mt-1' : 'text-gray-300'} whitespace-pre-wrap`}>
                    {item.type === 'input' && (
                        <span className="text-green-400 mr-2">
                            {getPrompt()}
                        </span>
                    )}
                    {renderOutput(item.content)}
                </div>
            ))}

            <div className="flex mt-1 items-center">
                <span className="text-green-400 mr-2">{getPrompt()}</span>
                <div className="flex-1 relative">
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="w-full bg-transparent outline-none border-none"
                        autoFocus
                        spellCheck={false}
                    />
                    <span className="cursor absolute" style={{ left: `${input.length}ch` }}></span>
                </div>
            </div>

            {/* Tab 补全提示 */}
            {tabCompletions.length > 1 && (
                <div className="text-gray-400 text-xs mt-1">
                    {tabCompletions.join('  ')}
                </div>
            )}

            <div ref={bottomRef} />
        </div>
    )
}

export default Terminal