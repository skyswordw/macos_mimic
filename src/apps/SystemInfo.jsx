import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useStore } from '../store/useStore'
import { FaApple, FaMemory, FaMicrochip, FaHdd, FaNetworkWired, FaBluetooth, FaUsb, FaDesktop, FaBatteryFull, FaPrint, FaCamera, FaWifi, FaTv, FaCode } from 'react-icons/fa'

const categories = [
    { id: 'overview', label: 'Overview', icon: FaApple },
    { id: 'hardware', label: 'Hardware', icon: FaMicrochip },
    { id: 'memory', label: 'Memory', icon: FaMemory },
    { id: 'storage', label: 'Storage', icon: FaHdd },
    { id: 'display', label: 'Displays', icon: FaTv },
    { id: 'network', label: 'Network', icon: FaNetworkWired },
    { id: 'bluetooth', label: 'Bluetooth', icon: FaBluetooth },
    { id: 'usb', label: 'USB', icon: FaUsb },
    { id: 'power', label: 'Power', icon: FaBatteryFull },
    { id: 'printers', label: 'Printers', icon: FaPrint },
    { id: 'camera', label: 'Camera', icon: FaCamera },
    { id: 'software', label: 'Software', icon: FaCode },
]

const systemInfo = {
    overview: {
        'macOS': 'Sonoma 14.2.1',
        'Model Name': 'MacBook Pro',
        'Model Identifier': 'MacBookPro18,3',
        'Chip': 'Apple M1 Pro',
        'Total Number of Cores': '10 (8 performance and 2 efficiency)',
        'Memory': '16 GB',
        'System Firmware Version': '10151.61.4',
        'OS Loader Version': '10151.61.4',
        'Serial Number': 'XXXXXXXXXXXX',
        'Hardware UUID': 'XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX',
        'Activation Lock Status': 'Enabled',
    },
    hardware: {
        'Model Name': 'MacBook Pro',
        'Model Identifier': 'MacBookPro18,3',
        'Model Number': 'MKGR3LL/A',
        'Chip': 'Apple M1 Pro',
        'Total Number of Cores': '10',
        'Performance Cores': '8',
        'Efficiency Cores': '2',
        'GPU Cores': '16',
        'Neural Engine Cores': '16',
        'Memory': '16 GB',
        'System Firmware Version': '10151.61.4',
        'SMC Version': 'N/A',
        'Provisioning UDID': 'XXXXXXXX-XXXXXXXXXXXXXXXX',
    },
    memory: {
        'Memory': '16 GB',
        'Type': 'LPDDR5',
        'Manufacturer': 'Apple',
        'Memory Slots': 'Built-in',
        'Upgradeable': 'No',
        'ECC': 'No',
    },
    storage: {
        'Macintosh HD': {
            'Capacity': '500 GB',
            'Available': '187.4 GB',
            'Mount Point': '/',
            'File System': 'APFS',
            'Encrypted': 'Yes (FileVault)',
            'Device': 'disk3s1s1',
        },
        'Container disk3': {
            'Capacity': '494.38 GB',
            'Type': 'Apple APFS Container',
            'Physical Store': 'disk0s2',
        },
    },
    display: {
        'Built-in Retina Display': {
            'Display Type': 'Built-in Liquid Retina XDR Display',
            'Resolution': '3456 x 2234',
            'Retina': 'Yes',
            'Pixel Depth': '32-Bit Color (ARGB8888)',
            'Main Display': 'Yes',
            'Mirror': 'Off',
            'Online': 'Yes',
            'Refresh Rate': '120 Hz (ProMotion)',
            'Connection Type': 'Internal',
        },
    },
    network: {
        'Wi-Fi': {
            'Type': 'Wi-Fi',
            'Hardware': 'Wi-Fi',
            'BSD Device Name': 'en0',
            'IPv4 Addresses': '192.168.1.100',
            'IPv6 Addresses': 'fe80::1',
            'Status': 'Connected',
            'Current Network': 'Home_Network',
        },
        'Ethernet': {
            'Type': 'Ethernet',
            'Hardware': 'Ethernet',
            'Status': 'Not Connected',
        },
    },
    bluetooth: {
        'General': {
            'Bluetooth Version': '5.0',
            'Handoff Supported': 'Yes',
            'Instant Hotspot Supported': 'Yes',
            'Manufacturer': 'Broadcom',
            'Transport': 'UART',
            'Chipset': 'BCM4387',
        },
        'Connected Devices': {
            'Magic Keyboard': 'Connected',
            'Magic Trackpad': 'Connected',
            'AirPods Pro': 'Not Connected',
        },
    },
    usb: {
        'USB 3.1 Bus': {
            'Host Controller Driver': 'AppleT8103USBXHCI',
            'PCI Vendor ID': '0x106b',
            'USB Hub': 'Yes',
        },
        'Connected Devices': {
            'External SSD': 'USB 3.1 Gen 2',
            'USB Flash Drive': 'USB 3.0',
        },
    },
    power: {
        'Battery Information': {
            'Full Charge Capacity': '5103 mAh',
            'State of Charge': '89%',
            'Charging': 'No',
            'Cycle Count': '127',
            'Condition': 'Normal',
            'Maximum Capacity': '97%',
        },
        'System Power Settings': {
            'AC Power': 'Display sleep: 10 min',
            'Battery Power': 'Display sleep: 2 min',
            'Power Nap': 'Enabled',
        },
    },
    printers: {
        'Available Printers': 'None',
        'Default Printer': 'Not Set',
    },
    camera: {
        'FaceTime HD Camera': {
            'Model ID': 'FaceTime HD Camera (Built-in)',
            'Unique ID': '0x1234567890',
        },
    },
    software: {
        'System Software Overview': {
            'System Version': 'macOS 14.2.1 (23C71)',
            'Kernel Version': 'Darwin 23.2.0',
            'Boot Volume': 'Macintosh HD',
            'Boot Mode': 'Normal',
            'Computer Name': 'User\'s MacBook Pro',
            'User Name': 'User',
            'Secure Virtual Memory': 'Enabled',
            'System Integrity Protection': 'Enabled',
            'Time since boot': '3 days, 5:23',
        },
    },
}

const SystemInfo = () => {
    const { darkMode } = useStore()
    const [selectedCategory, setSelectedCategory] = useState('overview')
    const [cpuUsage, setCpuUsage] = useState(23)
    const [memoryUsage, setMemoryUsage] = useState(67)

    useEffect(() => {
        const interval = setInterval(() => {
            setCpuUsage(Math.floor(Math.random() * 40) + 10)
            setMemoryUsage(Math.floor(Math.random() * 30) + 50)
        }, 2000)
        return () => clearInterval(interval)
    }, [])

    const renderValue = (value) => {
        if (typeof value === 'object') {
            return (
                <div className="ml-4 mt-2 space-y-1">
                    {Object.entries(value).map(([k, v]) => (
                        <div key={k} className="flex justify-between py-1">
                            <span className="text-gray-500">{k}:</span>
                            <span className="font-medium">{v}</span>
                        </div>
                    ))}
                </div>
            )
        }
        return value
    }

    return (
        <div className={`h-full flex ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
            {/* Sidebar */}
            <div className={`w-56 border-r flex flex-col ${darkMode ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-white'}`}>
                <div className="flex-1 overflow-auto py-2">
                    {categories.map(cat => (
                        <button key={cat.id} onClick={() => setSelectedCategory(cat.id)}
                            className={`w-full px-4 py-2 flex items-center gap-3 text-left text-sm ${selectedCategory === cat.id ? (darkMode ? 'bg-blue-600' : 'bg-blue-500 text-white') : (darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100')}`}>
                            <cat.icon className={selectedCategory === cat.id ? '' : 'text-gray-400'} />
                            {cat.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto p-6">
                <div className="max-w-3xl mx-auto">
                    <div className="flex items-center gap-3 mb-6">
                        {React.createElement(categories.find(c => c.id === selectedCategory)?.icon || FaApple, { className: 'text-2xl text-blue-500' })}
                        <h1 className="text-2xl font-bold">{categories.find(c => c.id === selectedCategory)?.label}</h1>
                    </div>

                    {selectedCategory === 'overview' && (
                        <div className="space-y-6">
                            {/* Mac Icon */}
                            <div className="flex items-center gap-6 mb-8">
                                <div className={`w-24 h-24 rounded-xl flex items-center justify-center text-5xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                                    <FaDesktop className="text-gray-400" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold">MacBook Pro</h2>
                                    <div className="text-gray-500">14-inch, 2021</div>
                                    <div className="text-sm text-gray-400">macOS Sonoma 14.2.1</div>
                                </div>
                            </div>

                            {/* Live Stats */}
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-gray-500">CPU</span>
                                        <span className="font-bold">{cpuUsage}%</span>
                                    </div>
                                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                        <motion.div animate={{ width: `${cpuUsage}%` }} className="h-full bg-blue-500" />
                                    </div>
                                </div>
                                <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-gray-500">Memory</span>
                                        <span className="font-bold">{memoryUsage}%</span>
                                    </div>
                                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                        <motion.div animate={{ width: `${memoryUsage}%` }} className="h-full bg-green-500" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Info Table */}
                    <div className={`rounded-xl overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                        {Object.entries(systemInfo[selectedCategory] || {}).map(([key, value], i) => (
                            <div key={key} className={`px-4 py-3 ${i > 0 ? `border-t ${darkMode ? 'border-gray-700' : 'border-gray-100'}` : ''}`}>
                                {typeof value === 'object' ? (
                                    <div>
                                        <div className="font-semibold text-blue-500 mb-2">{key}</div>
                                        {renderValue(value)}
                                    </div>
                                ) : (
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">{key}</span>
                                        <span className="font-medium">{value}</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SystemInfo
