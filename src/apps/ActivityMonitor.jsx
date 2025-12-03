import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaMicrochip, FaMemory, FaHdd, FaNetworkWired } from 'react-icons/fa'
import { useStore } from '../store/useStore'

const ActivityMonitor = () => {
    const { darkMode } = useStore()
    const [activeTab, setActiveTab] = useState('cpu')
    const [processes, setProcesses] = useState([])
    const [cpuHistory, setCpuHistory] = useState(new Array(60).fill(0))
    const [memoryHistory, setMemoryHistory] = useState(new Array(60).fill(0))
    const [systemStats, setSystemStats] = useState({
        cpu: { user: 0, system: 0, idle: 100 },
        memory: { used: 0, free: 16384, total: 16384 },
        disk: { used: 256000, free: 744000, total: 1000000 },
        network: { sent: 0, received: 0 }
    })

    // 生成模拟进程数据
    const generateProcesses = () => {
        const processNames = [
            'Finder', 'Safari', 'Mail', 'Music', 'Photos', 'Messages',
            'Terminal', 'WindowServer', 'kernel_task', 'launchd',
            'SystemUIServer', 'Dock', 'Spotlight', 'Activity Monitor',
            'Chrome Helper', 'node', 'VSCode', 'Safari Web Content'
        ]

        return processNames.map((name, index) => ({
            pid: 100 + index * 10,
            name,
            user: 'guest',
            cpu: Math.random() * (name.includes('kernel') ? 30 : 10),
            memory: Math.random() * 500 + 50,
            threads: Math.floor(Math.random() * 20) + 1,
            time: `${Math.floor(Math.random() * 60)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`
        })).sort((a, b) => b.cpu - a.cpu)
    }

    // 更新系统统计
    useEffect(() => {
        const interval = setInterval(() => {
            // 更新CPU统计
            const userCpu = Math.random() * 30 + 10
            const systemCpu = Math.random() * 15 + 5
            const idleCpu = 100 - userCpu - systemCpu

            setCpuHistory(prev => [...prev.slice(1), userCpu + systemCpu])

            // 更新内存统计
            const usedMemory = Math.random() * 8000 + 4000
            setMemoryHistory(prev => [...prev.slice(1), (usedMemory / 16384) * 100])

            // 更新所有统计
            setSystemStats({
                cpu: { user: userCpu, system: systemCpu, idle: idleCpu },
                memory: { used: usedMemory, free: 16384 - usedMemory, total: 16384 },
                disk: {
                    used: 256000 + Math.random() * 10000,
                    free: 744000 - Math.random() * 10000,
                    total: 1000000
                },
                network: {
                    sent: Math.random() * 1000,
                    received: Math.random() * 5000
                }
            })

            // 更新进程列表
            setProcesses(generateProcesses())
        }, 2000)

        // 初始化
        setProcesses(generateProcesses())

        return () => clearInterval(interval)
    }, [])

    const formatBytes = (bytes) => {
        if (bytes < 1024) return `${bytes.toFixed(0)} MB`
        return `${(bytes / 1024).toFixed(2)} GB`
    }

    const formatNumber = (num) => {
        return num.toFixed(1)
    }

    const tabs = [
        { id: 'cpu', label: 'CPU', icon: FaMicrochip },
        { id: 'memory', label: 'Memory', icon: FaMemory },
        { id: 'disk', label: 'Disk', icon: FaHdd },
        { id: 'network', label: 'Network', icon: FaNetworkWired }
    ]

    return (
        <div className={`w-full h-full flex flex-col transition-colors duration-300 ${
            darkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'
        }`}>
            {/* Tab Bar */}
            <div className={`flex border-b transition-colors duration-300 ${
                darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
            }`}>
                {tabs.map(tab => {
                    const Icon = tab.icon
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 transition-colors relative ${
                                activeTab === tab.id
                                    ? darkMode ? 'text-blue-400' : 'text-blue-500'
                                    : darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            <Icon className="text-lg" />
                            <span className="font-medium text-sm">{tab.label}</span>
                            {activeTab === tab.id && (
                                <motion.div
                                    layoutId="activeTab"
                                    className={`absolute bottom-0 left-0 right-0 h-0.5 ${
                                        darkMode ? 'bg-blue-400' : 'bg-blue-500'
                                    }`}
                                />
                            )}
                        </button>
                    )
                })}
            </div>

            <div className="flex-1 overflow-hidden flex flex-col">
                {/* CPU Tab */}
                {activeTab === 'cpu' && (
                    <div className="flex-1 flex flex-col p-4 gap-4 overflow-y-auto">
                        {/* CPU Graph */}
                        <div className={`rounded-lg p-4 border transition-colors ${
                            darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'
                        }`}>
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="font-semibold">CPU Usage</h3>
                                <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                                    {formatNumber(systemStats.cpu.user + systemStats.cpu.system)}%
                                </span>
                            </div>
                            <div className="h-24 flex items-end gap-0.5">
                                {cpuHistory.map((value, i) => (
                                    <div
                                        key={i}
                                        className="flex-1 bg-blue-500 rounded-t"
                                        style={{ height: `${value}%` }}
                                    />
                                ))}
                            </div>
                            <div className="grid grid-cols-3 gap-2 mt-4 text-sm">
                                <div>
                                    <div className={darkMode ? 'text-gray-400' : 'text-gray-600'}>User</div>
                                    <div className="font-semibold">{formatNumber(systemStats.cpu.user)}%</div>
                                </div>
                                <div>
                                    <div className={darkMode ? 'text-gray-400' : 'text-gray-600'}>System</div>
                                    <div className="font-semibold">{formatNumber(systemStats.cpu.system)}%</div>
                                </div>
                                <div>
                                    <div className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Idle</div>
                                    <div className="font-semibold">{formatNumber(systemStats.cpu.idle)}%</div>
                                </div>
                            </div>
                        </div>

                        {/* Process List */}
                        <div className={`rounded-lg border overflow-hidden transition-colors ${
                            darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'
                        }`}>
                            <div className={`px-4 py-2 font-semibold border-b ${
                                darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-200'
                            }`}>
                                <div className="grid grid-cols-6 gap-2 text-xs">
                                    <div>PID</div>
                                    <div className="col-span-2">Process Name</div>
                                    <div className="text-right">CPU%</div>
                                    <div className="text-right">Memory</div>
                                    <div className="text-right">Threads</div>
                                </div>
                            </div>
                            <div className="max-h-64 overflow-y-auto">
                                {processes.map(proc => (
                                    <div
                                        key={proc.pid}
                                        className={`px-4 py-2 border-b transition-colors ${
                                            darkMode
                                                ? 'border-gray-700 hover:bg-gray-700/50'
                                                : 'border-gray-100 hover:bg-gray-100'
                                        }`}
                                    >
                                        <div className="grid grid-cols-6 gap-2 text-sm">
                                            <div className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{proc.pid}</div>
                                            <div className="col-span-2 truncate">{proc.name}</div>
                                            <div className="text-right">{formatNumber(proc.cpu)}%</div>
                                            <div className="text-right">{formatNumber(proc.memory)} MB</div>
                                            <div className="text-right">{proc.threads}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Memory Tab */}
                {activeTab === 'memory' && (
                    <div className="flex-1 flex flex-col p-4 gap-4 overflow-y-auto">
                        <div className={`rounded-lg p-4 border ${
                            darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'
                        }`}>
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="font-semibold">Memory Pressure</h3>
                                <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                                    {formatBytes(systemStats.memory.used)} / {formatBytes(systemStats.memory.total)}
                                </span>
                            </div>
                            <div className="h-24 flex items-end gap-0.5">
                                {memoryHistory.map((value, i) => (
                                    <div
                                        key={i}
                                        className="flex-1 bg-green-500 rounded-t"
                                        style={{ height: `${value}%` }}
                                    />
                                ))}
                            </div>
                            <div className="grid grid-cols-2 gap-4 mt-4">
                                <div>
                                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Used Memory</div>
                                    <div className="text-2xl font-bold">{formatBytes(systemStats.memory.used)}</div>
                                </div>
                                <div>
                                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Free Memory</div>
                                    <div className="text-2xl font-bold">{formatBytes(systemStats.memory.free)}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Disk Tab */}
                {activeTab === 'disk' && (
                    <div className="flex-1 flex flex-col p-4 gap-4 overflow-y-auto">
                        <div className={`rounded-lg p-4 border ${
                            darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'
                        }`}>
                            <h3 className="font-semibold mb-4">Disk Usage</h3>
                            <div className="mb-4">
                                <div className="flex justify-between mb-2 text-sm">
                                    <span>Macintosh HD</span>
                                    <span>{formatBytes(systemStats.disk.used)} / {formatBytes(systemStats.disk.total)}</span>
                                </div>
                                <div className={`h-4 rounded-full overflow-hidden ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                                    <div
                                        className="h-full bg-blue-500"
                                        style={{ width: `${(systemStats.disk.used / systemStats.disk.total) * 100}%` }}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Used</div>
                                    <div className="text-xl font-bold">{formatBytes(systemStats.disk.used)}</div>
                                </div>
                                <div>
                                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Available</div>
                                    <div className="text-xl font-bold">{formatBytes(systemStats.disk.free)}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Network Tab */}
                {activeTab === 'network' && (
                    <div className="flex-1 flex flex-col p-4 gap-4 overflow-y-auto">
                        <div className={`rounded-lg p-4 border ${
                            darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'
                        }`}>
                            <h3 className="font-semibold mb-4">Network Activity</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Sent</span>
                                    </div>
                                    <div className="text-2xl font-bold">{formatNumber(systemStats.network.sent)} KB/s</div>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Received</span>
                                    </div>
                                    <div className="text-2xl font-bold">{formatNumber(systemStats.network.received)} KB/s</div>
                                </div>
                            </div>
                            <div className={`mt-6 p-3 rounded ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                                <div className="text-xs font-mono space-y-1">
                                    <div>Interface: en0 (Wi-Fi)</div>
                                    <div>IP: 192.168.1.100</div>
                                    <div>Status: Connected</div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ActivityMonitor
