import React, { useState, useRef, useEffect } from 'react'

const Terminal = () => {
    // 模拟文件系统
    const [fileSystem, setFileSystem] = useState({
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
                                'Public': { type: 'directory', children: {} },
                                '.bashrc': { type: 'file', content: '# Bash configuration\nexport PATH="/usr/local/bin:$PATH"' },
                                '.zshrc': { type: 'file', content: '# Zsh configuration\nexport ZSH="$HOME/.oh-my-zsh"' }
                            }
                        }
                    }
                },
                'etc': {
                    type: 'directory',
                    children: {
                        'hosts': { type: 'file', content: '127.0.0.1 localhost\n255.255.255.255 broadcasthost\n::1 localhost' },
                        'passwd': { type: 'file', content: 'root:*:0:0:System Administrator:/var/root:/bin/sh\nguest:*:501:20:Guest User:/Users/guest:/bin/zsh' }
                    }
                },
                'var': {
                    type: 'directory',
                    children: {
                        'log': {
                            type: 'directory',
                            children: {
                                'system.log': { type: 'file', content: 'Dec 12 10:00:00 MacBook kernel[0]: System started\nDec 12 10:00:01 MacBook kernel[0]: Network initialized' }
                            }
                        }
                    }
                },
                'tmp': { type: 'directory', children: {} }
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
    pwd            - Print working directory
    mkdir <name>   - Create directory
    touch <file>   - Create empty file
    rm <file>      - Remove file or directory
    cp <src> <dst> - Copy file
    mv <src> <dst> - Move/rename file
    cat <file>     - Display file contents
    head <file>    - Show first lines of file
    tail <file>    - Show last lines of file
    grep <pat> <f> - Search in file
    find <path>    - Find files recursively
    tree [path]    - Display directory tree
    wc <file>      - Count lines, words, chars

  System:
    clear          - Clear terminal
    date           - Display current date
    cal            - Show calendar
    whoami         - Display current user
    id             - Display user/group IDs
    groups         - Show user groups
    uname [-a]     - Display system info
    sw_vers        - Show macOS version
    hostname       - Display hostname
    uptime         - Display system uptime
    env            - Display environment variables
    which <cmd>    - Show command location
    df             - Show disk usage
    du [path]      - Directory space usage

  Process:
    ps             - List processes
    top            - Display system resources
    kill <pid>     - Terminate process

  Network:
    ping <host>    - Ping a host
    ifconfig       - Network configuration
    curl <url>     - Fetch URL content
    networksetup   - Network settings
    scutil         - Network config utility

  Development:
    git [cmd]      - Git version control
    node [-v]      - Node.js runtime
    npm [cmd]      - Node package manager
    python [-V]    - Python interpreter
    brew [cmd]     - Homebrew package manager
    xcode-select   - Developer tools

  macOS Utilities:
    open <file>    - Open file/app
    say <text>     - Text to speech
    pbcopy         - Copy to clipboard
    pbpaste        - Paste from clipboard
    screencapture  - Take screenshot
    caffeinate     - Prevent sleep
    defaults       - Read/write prefs
    diskutil       - Disk utility
    system_profiler - System info

  Other:
    echo <text>    - Display text
    history        - Show command history
    man <cmd>      - Manual for command
    exit           - Exit terminal`

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

            case 'grep': {
                if (args.length < 2) {
                    return 'usage: grep pattern file'
                }
                const pattern = args[0]
                const grepPath = resolvePath(args[1])
                const grepNode = getNode(grepPath)
                if (!grepNode) {
                    return `grep: ${args[1]}: No such file or directory`
                }
                if (grepNode.type === 'directory') {
                    return `grep: ${args[1]}: Is a directory`
                }
                const lines = (grepNode.content || '').split('\n')
                const matches = lines.filter(line => line.toLowerCase().includes(pattern.toLowerCase()))
                return matches.length > 0 ? matches.join('\n') : ''
            }

            case 'head': {
                if (args.length === 0) {
                    return 'head: missing file operand'
                }
                const headPath = resolvePath(args[args.length - 1])
                const headNode = getNode(headPath)
                if (!headNode) {
                    return `head: ${args[args.length - 1]}: No such file or directory`
                }
                if (headNode.type === 'directory') {
                    return `head: ${args[args.length - 1]}: Is a directory`
                }
                const numLines = args.includes('-n') ? parseInt(args[args.indexOf('-n') + 1]) || 10 : 10
                const headLines = (headNode.content || '').split('\n').slice(0, numLines)
                return headLines.join('\n')
            }

            case 'tail': {
                if (args.length === 0) {
                    return 'tail: missing file operand'
                }
                const tailPath = resolvePath(args[args.length - 1])
                const tailNode = getNode(tailPath)
                if (!tailNode) {
                    return `tail: ${args[args.length - 1]}: No such file or directory`
                }
                if (tailNode.type === 'directory') {
                    return `tail: ${args[args.length - 1]}: Is a directory`
                }
                const tailNumLines = args.includes('-n') ? parseInt(args[args.indexOf('-n') + 1]) || 10 : 10
                const allLines = (tailNode.content || '').split('\n')
                const tailLines = allLines.slice(-tailNumLines)
                return tailLines.join('\n')
            }

            case 'wc': {
                if (args.length === 0) {
                    return 'wc: missing file operand'
                }
                const wcPath = resolvePath(args[args.length - 1])
                const wcNode = getNode(wcPath)
                if (!wcNode) {
                    return `wc: ${args[args.length - 1]}: No such file or directory`
                }
                if (wcNode.type === 'directory') {
                    return `wc: ${args[args.length - 1]}: Is a directory`
                }
                const content = wcNode.content || ''
                const lineCount = content.split('\n').length
                const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0
                const charCount = content.length
                return `       ${lineCount}       ${wordCount}     ${charCount} ${args[args.length - 1]}`
            }

            case 'find': {
                if (args.length === 0) {
                    return 'find: missing path'
                }
                const findPath = args[0] === '.' ? currentPath : resolvePath(args[0])
                const findNode = getNode(findPath)
                if (!findNode) {
                    return `find: ${args[0]}: No such file or directory`
                }

                const results = []
                const traverse = (node, path) => {
                    results.push(path)
                    if (node.children) {
                        Object.entries(node.children).forEach(([name, child]) => {
                            traverse(child, `${path}/${name}`)
                        })
                    }
                }
                traverse(findNode, findPath === '/' ? '' : findPath)
                return results.join('\n')
            }

            case 'tree': {
                const treePath = args.length > 0 ? resolvePath(args[0]) : currentPath
                const treeNode = getNode(treePath)
                if (!treeNode) {
                    return `tree: ${args[0] || treePath}: No such file or directory`
                }
                if (treeNode.type === 'file') {
                    return treePath.split('/').pop()
                }

                const buildTree = (node, prefix = '', isLast = true) => {
                    let result = []
                    const children = Object.entries(node.children || {})
                    children.forEach(([name, child], index) => {
                        const isLastChild = index === children.length - 1
                        const connector = isLastChild ? '└── ' : '├── '
                        const childPrefix = isLastChild ? '    ' : '│   '
                        const color = child.type === 'directory' ? '\x1b[34m' : ''
                        const reset = child.type === 'directory' ? '\x1b[0m' : ''
                        result.push(`${prefix}${connector}${color}${name}${reset}`)
                        if (child.type === 'directory') {
                            result = result.concat(buildTree(child, prefix + childPrefix, isLastChild))
                        }
                    })
                    return result
                }

                const treeRoot = treePath.split('/').pop() || '/'
                return `\x1b[34m${treeRoot}\x1b[0m\n` + buildTree(treeNode).join('\n')
            }

            case 'cp': {
                if (args.length < 2) {
                    return 'usage: cp source destination'
                }
                return `cp: '${args[0]}' -> '${args[1]}' (copied - simulation only)`
            }

            case 'mv': {
                if (args.length < 2) {
                    return 'usage: mv source destination'
                }
                return `mv: '${args[0]}' -> '${args[1]}' (moved - simulation only)`
            }

            case 'chmod': {
                if (args.length < 2) {
                    return 'usage: chmod mode file'
                }
                return `chmod: mode of '${args[1]}' changed to ${args[0]} (simulation only)`
            }

            case 'chown': {
                if (args.length < 2) {
                    return 'usage: chown owner file'
                }
                return `chown: changed ownership of '${args[1]}' to ${args[0]} (simulation only)`
            }

            case 'df':
                return `Filesystem     512-blocks      Used Available Capacity  Mounted on
/dev/disk1s1   976490576 234567890 741922686    24%    /
devfs                693       693         0   100%    /dev
/dev/disk1s2   976490576  12345678 964144898     2%    /System/Volumes/Data`

            case 'du': {
                const duPath = args.length > 0 ? resolvePath(args[args.length - 1]) : currentPath
                const duNode = getNode(duPath)
                if (!duNode) {
                    return `du: ${args[args.length - 1] || duPath}: No such file or directory`
                }
                const size = Math.floor(Math.random() * 1000) + 100
                return `${size}\t${duPath}`
            }

            case 'cal': {
                const now = new Date()
                const month = now.toLocaleString('default', { month: 'long' })
                const year = now.getFullYear()
                return `     ${month} ${year}
Su Mo Tu We Th Fr Sa
       1  2  3  4  5
 6  7  8  9 10 11 12
13 14 15 16 17 18 19
20 21 22 23 24 25 26
27 28 29 30 31`
            }

            case 'id':
                return 'uid=501(guest) gid=20(staff) groups=20(staff),12(everyone),61(localaccounts)'

            case 'groups':
                return 'staff everyone localaccounts'

            case 'sw_vers':
                return `ProductName:    macOS
ProductVersion: 14.0
BuildVersion:   23A344`

            case 'system_profiler':
                return `Hardware Overview:

  Model Name: MacBook Pro
  Model Identifier: MacBookPro18,3
  Chip: Apple M1 Pro
  Total Number of Cores: 10 (8 performance and 2 efficiency)
  Memory: 16 GB
  System Firmware Version: 8419.41.10
  OS Loader Version: 8419.41.10`

            case 'diskutil':
                return `+-- Container disk1
|   +-- APFS Container Scheme -
|   |   +-- disk1s1 - Macintosh HD
|   |   +-- disk1s2 - Data
|   |   +-- disk1s3 - Preboot
|   |   +-- disk1s5 - Recovery`

            case 'launchctl':
                return `launchctl: operation requires root privileges (simulation)`

            case 'networksetup':
                return `Hardware Port: Wi-Fi
Device: en0
Ethernet Address: a4:83:e7:xx:xx:xx

Hardware Port: Thunderbolt Bridge
Device: bridge0`

            case 'scutil':
                return `PrimaryInterface : en0
Router : 192.168.1.1`

            case 'say': {
                if (args.length === 0) {
                    return ''
                }
                return `🔊 "${args.join(' ')}" (speech simulation)`
            }

            case 'open': {
                if (args.length === 0) {
                    return 'usage: open file'
                }
                return `Opening ${args[0]}... (simulation)`
            }

            case 'screencapture':
                return 'screencapture: screen captured to desktop (simulation)'

            case 'caffeinate':
                return 'caffeinate: preventing sleep... Press Ctrl+C to stop (simulation)'

            case 'pbcopy':
                return '(text copied to clipboard)'

            case 'pbpaste':
                return '(clipboard contents)'

            case 'defaults':
                return 'defaults: preferences updated (simulation)'

            case 'xcode-select':
                return '/Applications/Xcode.app/Contents/Developer'

            case 'brew':
                return `Homebrew 4.1.0
Usage: brew [command] [options]
Commands: install, uninstall, update, upgrade, list, search, info`

            case 'npm':
                return `npm 10.2.0
Usage: npm [command]
Commands: install, uninstall, update, list, run, init, publish`

            case 'node':
                if (args.includes('-v') || args.includes('--version')) {
                    return 'v20.10.0'
                }
                return 'Welcome to Node.js v20.10.0.\nType ".help" for more information.'

            case 'python':
            case 'python3':
                if (args.includes('-V') || args.includes('--version')) {
                    return 'Python 3.11.4'
                }
                return `Python 3.11.4 (main, Jun  8 2023, 12:11:35)
[Clang 14.0.3 (clang-1403.0.22.14.1)] on darwin
Type "help", "copyright", "credits" or "license" for more information.
>>>`

            case 'git':
                if (args.length === 0 || args[0] === '--version') {
                    return 'git version 2.42.0'
                }
                if (args[0] === 'status') {
                    return `On branch main
Your branch is up to date with 'origin/main'.

nothing to commit, working tree clean`
                }
                if (args[0] === 'log') {
                    return `commit abc123def456 (HEAD -> main)
Author: Guest <guest@macbook.local>
Date:   ${new Date().toDateString()}

    Latest commit message`
                }
                return `git: '${args[0]}' is not a git command.`

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
                                'cp', 'mv', 'head', 'tail', 'grep', 'find', 'tree', 'wc',
                                'echo', 'date', 'cal', 'whoami', 'id', 'groups', 'uname',
                                'sw_vers', 'hostname', 'uptime', 'env', 'which', 'df', 'du',
                                'ps', 'top', 'kill', 'ping', 'ifconfig', 'curl', 'networksetup', 'scutil',
                                'git', 'node', 'npm', 'python', 'python3', 'brew', 'xcode-select',
                                'open', 'say', 'pbcopy', 'pbpaste', 'screencapture', 'caffeinate',
                                'defaults', 'diskutil', 'system_profiler', 'launchctl', 'chmod', 'chown',
                                'history', 'man', 'exit']

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