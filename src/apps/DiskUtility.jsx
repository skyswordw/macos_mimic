import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useStore } from '../store/useStore'
import { FaHdd, FaUsb, FaCompactDisc, FaPlus, FaMinus, FaEraser, FaShieldAlt, FaInfoCircle, FaSync, FaExclamationTriangle, FaCheckCircle, FaDatabase } from 'react-icons/fa'

const disks = [
    { id: 1, name: 'Macintosh HD', type: 'internal', size: '500 GB', used: 245.8, total: 500, format: 'APFS', encrypted: true, icon: FaHdd },
    { id: 2, name: 'Macintosh HD - Data', type: 'internal', size: '500 GB', used: 312.4, total: 500, format: 'APFS', encrypted: true, icon: FaDatabase, parent: 1 },
    { id: 3, name: 'External SSD', type: 'external', size: '1 TB', used: 567.2, total: 1000, format: 'APFS', encrypted: false, icon: FaUsb },
    { id: 4, name: 'USB Flash Drive', type: 'external', size: '32 GB', used: 18.5, total: 32, format: 'ExFAT', encrypted: false, icon: FaUsb },
    { id: 5, name: 'macOS Installer', type: 'image', size: '14 GB', used: 14, total: 14, format: 'APFS', encrypted: false, icon: FaCompactDisc },
]

const DiskUtility = () => {
    const { darkMode, addNotification } = useStore()
    const [selectedDisk, setSelectedDisk] = useState(disks[0])
    const [isRunning, setIsRunning] = useState(false)
    const [lastAction, setLastAction] = useState(null)
    const [showInfo, setShowInfo] = useState(false)

    const runFirstAid = () => {
        setIsRunning(true)
        setLastAction('firstAid')
        addNotification({ title: 'Disk Utility', message: `Running First Aid on ${selectedDisk.name}...`, app: 'Disk Utility' })
        setTimeout(() => {
            setIsRunning(false)
            addNotification({ title: 'Disk Utility', message: `First Aid completed successfully on ${selectedDisk.name}`, app: 'Disk Utility' })
        }, 3000)
    }

    const runErase = () => {
        if (selectedDisk.type === 'internal' && selectedDisk.id <= 2) {
            addNotification({ title: 'Disk Utility', message: 'Cannot erase the startup disk', app: 'Disk Utility' })
            return
        }
        setIsRunning(true)
        setLastAction('erase')
        setTimeout(() => {
            setIsRunning(false)
            addNotification({ title: 'Disk Utility', message: `${selectedDisk.name} has been erased`, app: 'Disk Utility' })
        }, 2000)
    }

    const getUsageColor = (used, total) => {
        const percent = (used / total) * 100
        if (percent > 90) return 'bg-red-500'
        if (percent > 70) return 'bg-yellow-500'
        return 'bg-blue-500'
    }

    return (
        <div className={`h-full flex ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
            {/* Sidebar */}
            <div className={`w-64 border-r flex flex-col ${darkMode ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-white'}`}>
                <div className={`p-3 border-b text-xs font-semibold text-gray-500 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    INTERNAL
                </div>
                {disks.filter(d => d.type === 'internal').map(disk => (
                    <button key={disk.id} onClick={() => setSelectedDisk(disk)}
                        className={`px-3 py-2 flex items-center gap-2 text-left ${disk.parent ? 'pl-8' : ''} ${selectedDisk.id === disk.id ? (darkMode ? 'bg-blue-600' : 'bg-blue-500 text-white') : (darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100')}`}>
                        <disk.icon className="text-gray-400" />
                        <div>
                            <div className="text-sm font-medium">{disk.name}</div>
                            <div className="text-xs opacity-60">{disk.size}</div>
                        </div>
                    </button>
                ))}

                <div className={`p-3 border-b border-t text-xs font-semibold text-gray-500 mt-2 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    EXTERNAL
                </div>
                {disks.filter(d => d.type === 'external').map(disk => (
                    <button key={disk.id} onClick={() => setSelectedDisk(disk)}
                        className={`px-3 py-2 flex items-center gap-2 text-left ${selectedDisk.id === disk.id ? (darkMode ? 'bg-blue-600' : 'bg-blue-500 text-white') : (darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100')}`}>
                        <disk.icon className="text-gray-400" />
                        <div>
                            <div className="text-sm font-medium">{disk.name}</div>
                            <div className="text-xs opacity-60">{disk.size}</div>
                        </div>
                    </button>
                ))}

                <div className={`p-3 border-b border-t text-xs font-semibold text-gray-500 mt-2 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    DISK IMAGES
                </div>
                {disks.filter(d => d.type === 'image').map(disk => (
                    <button key={disk.id} onClick={() => setSelectedDisk(disk)}
                        className={`px-3 py-2 flex items-center gap-2 text-left ${selectedDisk.id === disk.id ? (darkMode ? 'bg-blue-600' : 'bg-blue-500 text-white') : (darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100')}`}>
                        <disk.icon className="text-gray-400" />
                        <div>
                            <div className="text-sm font-medium">{disk.name}</div>
                            <div className="text-xs opacity-60">{disk.size}</div>
                        </div>
                    </button>
                ))}
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Toolbar */}
                <div className={`flex items-center gap-2 p-2 border-b ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'}`}>
                    <button onClick={runFirstAid} disabled={isRunning}
                        className={`px-3 py-1.5 rounded flex items-center gap-2 text-sm ${isRunning ? 'opacity-50' : ''} ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-100 border'}`}>
                        <FaShieldAlt className="text-green-500" /> First Aid
                    </button>
                    <button className={`px-3 py-1.5 rounded flex items-center gap-2 text-sm ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-100 border'}`}>
                        <FaPlus className="text-blue-500" /> Partition
                    </button>
                    <button onClick={runErase} disabled={isRunning || (selectedDisk.type === 'internal' && selectedDisk.id <= 2)}
                        className={`px-3 py-1.5 rounded flex items-center gap-2 text-sm ${isRunning || (selectedDisk.type === 'internal' && selectedDisk.id <= 2) ? 'opacity-50' : ''} ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-100 border'}`}>
                        <FaEraser className="text-red-500" /> Erase
                    </button>
                    <button className={`px-3 py-1.5 rounded flex items-center gap-2 text-sm ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-100 border'}`}>
                        <FaSync className="text-blue-500" /> Restore
                    </button>
                    <div className="flex-1" />
                    <button onClick={() => setShowInfo(!showInfo)}
                        className={`px-3 py-1.5 rounded flex items-center gap-2 text-sm ${showInfo ? 'bg-blue-500 text-white' : (darkMode ? 'bg-gray-700' : 'bg-white border')}`}>
                        <FaInfoCircle /> Info
                    </button>
                </div>

                {/* Disk View */}
                <div className="flex-1 p-6 overflow-auto">
                    {isRunning ? (
                        <div className="flex flex-col items-center justify-center h-full">
                            <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                                className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mb-4" />
                            <div className="text-lg font-medium">
                                {lastAction === 'firstAid' ? 'Running First Aid...' : 'Erasing Disk...'}
                            </div>
                            <div className="text-sm text-gray-500 mt-1">This may take a few moments</div>
                        </div>
                    ) : (
                        <div className="max-w-3xl mx-auto">
                            {/* Disk Header */}
                            <div className="flex items-center gap-4 mb-6">
                                <div className={`w-20 h-20 rounded-xl flex items-center justify-center ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                                    <selectedDisk.icon className="text-4xl text-gray-400" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold">{selectedDisk.name}</h1>
                                    <div className="text-gray-500">{selectedDisk.format} • {selectedDisk.size}</div>
                                    <div className="flex items-center gap-2 mt-1">
                                        {selectedDisk.encrypted && (
                                            <span className="px-2 py-0.5 bg-green-500/20 text-green-500 rounded text-xs flex items-center gap-1">
                                                <FaShieldAlt /> Encrypted
                                            </span>
                                        )}
                                        <span className="px-2 py-0.5 bg-blue-500/20 text-blue-500 rounded text-xs">
                                            {selectedDisk.type}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Usage Bar */}
                            <div className={`p-4 rounded-xl mb-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                                <div className="flex justify-between text-sm mb-2">
                                    <span>{selectedDisk.used.toFixed(1)} GB used</span>
                                    <span>{(selectedDisk.total - selectedDisk.used).toFixed(1)} GB free</span>
                                </div>
                                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                                    <motion.div initial={{ width: 0 }} animate={{ width: `${(selectedDisk.used / selectedDisk.total) * 100}%` }}
                                        transition={{ duration: 0.5 }}
                                        className={`h-full ${getUsageColor(selectedDisk.used, selectedDisk.total)}`} />
                                </div>
                                <div className="flex justify-between text-xs text-gray-500 mt-2">
                                    <span>{((selectedDisk.used / selectedDisk.total) * 100).toFixed(1)}% used</span>
                                    <span>{selectedDisk.total} GB total</span>
                                </div>
                            </div>

                            {/* Info Panel */}
                            {showInfo && (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                    className={`p-4 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                                    <h3 className="font-semibold mb-3">Disk Information</h3>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        {[{ label: 'Name', value: selectedDisk.name },
                                          { label: 'Type', value: selectedDisk.type.charAt(0).toUpperCase() + selectedDisk.type.slice(1) },
                                          { label: 'Format', value: selectedDisk.format },
                                          { label: 'Capacity', value: selectedDisk.size },
                                          { label: 'Used', value: `${selectedDisk.used.toFixed(1)} GB` },
                                          { label: 'Available', value: `${(selectedDisk.total - selectedDisk.used).toFixed(1)} GB` },
                                          { label: 'Encrypted', value: selectedDisk.encrypted ? 'Yes' : 'No' },
                                          { label: 'Mount Point', value: selectedDisk.type === 'internal' ? '/' : '/Volumes/' + selectedDisk.name.replace(/ /g, '') }].map((info, i) => (
                                            <div key={i} className={`flex justify-between py-2 ${i > 0 ? 'border-t ' + (darkMode ? 'border-gray-700' : 'border-gray-100') : ''}`}>
                                                <span className="text-gray-500">{info.label}</span>
                                                <span className="font-medium">{info.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {/* Status */}
                            <div className={`mt-4 p-4 rounded-xl flex items-center gap-3 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                                <FaCheckCircle className="text-green-500 text-xl" />
                                <div>
                                    <div className="font-medium">Disk is healthy</div>
                                    <div className="text-sm text-gray-500">Last verified: Today at {new Date().toLocaleTimeString()}</div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default DiskUtility
