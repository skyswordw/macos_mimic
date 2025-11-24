import React, { useState } from 'react'
import { useStore } from '../store/useStore'
import { FaPaintBrush, FaDesktop, FaCog, FaVolumeUp, FaBell, FaWifi, FaLock, FaGlobe, FaKeyboard, FaMouse, FaPrint, FaUserCircle, FaShieldAlt, FaBatteryFull, FaClock } from 'react-icons/fa'

const wallpapers = [
    'https://4kwallpapers.com/images/wallpapers/macos-monterey-stock-purple-dark-mode-layers-5k-4480x2520-5888.jpg',
    'https://4kwallpapers.com/images/wallpapers/macos-big-sur-apple-layers-fluidic-colorful-wwdc-20-5k-6016x3384-1455.jpg',
    'https://images.unsplash.com/photo-1477346611705-65d1883cee1e?auto=format&fit=crop&w=1920&q=80',
    'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=1920&q=80',
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1920&q=80',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1920&q=80'
]

const Settings = () => {
    const { setWallpaper, wallpaper, brightness, setBrightness, darkMode, setDarkMode, soundEnabled, soundVolume, toggleSoundEffects, setSoundVolume } = useStore()
    const [currentSection, setCurrentSection] = useState('appearance')
    const [settings, setSettings] = useState({
        autoHideDock: false,
        magnification: true,
        notificationsEnabled: true,
        wifiEnabled: true,
        bluetoothEnabled: true,
        autoLock: '5 minutes',
        language: 'English',
        timezone: 'Pacific Time',
        keyRepeat: 'normal',
        trackpadSpeed: 50,
        mouseSpeed: 50,
        scrollDirection: 'natural',
        clickToTap: true,
        fileVaultEnabled: false,
        firewallEnabled: true,
        energySaver: false,
        showBatteryPercentage: true
    })

    const sidebarItems = [
        { id: 'appearance', label: 'Appearance', icon: FaPaintBrush },
        { id: 'display', label: 'Display', icon: FaDesktop },
        { id: 'general', label: 'General', icon: FaCog },
        { id: 'sound', label: 'Sound', icon: FaVolumeUp },
        { id: 'notifications', label: 'Notifications', icon: FaBell },
        { id: 'network', label: 'Network', icon: FaWifi },
        { id: 'security', label: 'Security & Privacy', icon: FaLock },
        { id: 'language', label: 'Language & Region', icon: FaGlobe },
        { id: 'keyboard', label: 'Keyboard', icon: FaKeyboard },
        { id: 'trackpad', label: 'Trackpad & Mouse', icon: FaMouse },
        { id: 'printers', label: 'Printers & Scanners', icon: FaPrint },
        { id: 'users', label: 'Users & Groups', icon: FaUserCircle },
        { id: 'advanced', label: 'Advanced', icon: FaShieldAlt },
        { id: 'battery', label: 'Battery', icon: FaBatteryFull },
        { id: 'datetime', label: 'Date & Time', icon: FaClock }
    ]

    const updateSetting = (key, value) => {
        setSettings(prev => ({ ...prev, [key]: value }))
    }

    const renderContent = () => {
        switch (currentSection) {
            case 'appearance':
                return (
                    <div>
                        <h2 className="text-xl font-bold mb-6 text-gray-800">Appearance</h2>

                        {/* Dark Mode */}
                        <div className="mb-8">
                            <h3 className="text-lg font-medium mb-4">Theme</h3>
                            <div className="bg-white rounded-lg p-4 shadow-sm">
                                <label className="flex items-center justify-between cursor-pointer">
                                    <span>Dark Mode</span>
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            className="sr-only"
                                            checked={darkMode}
                                            onChange={(e) => setDarkMode(e.target.checked)}
                                        />
                                        <div className={`block w-14 h-8 rounded-full transition-colors ${darkMode ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                                        <div className={`absolute left-1 top-1 w-6 h-6 rounded-full bg-white transition-transform ${darkMode ? 'translate-x-6' : ''}`}></div>
                                    </div>
                                </label>
                                <p className="text-xs text-gray-500 mt-2">
                                    Toggle between light and dark appearance for the entire system
                                </p>
                            </div>
                        </div>

                        {/* Wallpaper */}
                        <div>
                            <h3 className="text-lg font-medium mb-4">Desktop Wallpaper</h3>
                            <div className="grid grid-cols-3 gap-4">
                                {wallpapers.map((wp, i) => (
                                    <div
                                        key={i}
                                        className={`aspect-video rounded-lg overflow-hidden cursor-pointer border-4 transition-all ${wallpaper === wp ? 'border-blue-500 shadow-lg' : 'border-transparent hover:border-gray-300'}`}
                                        onClick={() => setWallpaper(wp)}
                                    >
                                        <img src={wp} alt={`Wallpaper ${i}`} className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Dock Settings */}
                        <div className="mt-8">
                            <h3 className="text-lg font-medium mb-4">Dock</h3>
                            <div className="bg-white rounded-lg p-4 shadow-sm space-y-3">
                                <label className="flex items-center justify-between cursor-pointer">
                                    <span>Magnification</span>
                                    <input
                                        type="checkbox"
                                        checked={settings.magnification}
                                        onChange={(e) => updateSetting('magnification', e.target.checked)}
                                        className="rounded"
                                    />
                                </label>
                                <label className="flex items-center justify-between cursor-pointer">
                                    <span>Automatically hide and show the Dock</span>
                                    <input
                                        type="checkbox"
                                        checked={settings.autoHideDock}
                                        onChange={(e) => updateSetting('autoHideDock', e.target.checked)}
                                        className="rounded"
                                    />
                                </label>
                            </div>
                        </div>
                    </div>
                )

            case 'display':
                return (
                    <div>
                        <h2 className="text-xl font-bold mb-6 text-gray-800">Display</h2>
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <div className="mb-6">
                                <label className="block text-sm font-medium mb-2">Brightness</label>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={brightness}
                                    onChange={(e) => setBrightness(parseInt(e.target.value))}
                                    className="w-full"
                                />
                                <div className="flex justify-between text-xs text-gray-500 mt-1">
                                    <span>0%</span>
                                    <span>{brightness}%</span>
                                    <span>100%</span>
                                </div>
                            </div>
                            <div className="border-t pt-4">
                                <p className="text-sm text-gray-600">Display: Built-in Retina Display</p>
                                <p className="text-sm text-gray-600">Resolution: 2880 x 1800</p>
                                <p className="text-sm text-gray-600">Color Profile: Display P3</p>
                            </div>
                        </div>
                    </div>
                )

            case 'sound':
                return (
                    <div>
                        <h2 className="text-xl font-bold mb-6 text-gray-800">Sound</h2>
                        <div className="bg-white rounded-lg p-6 shadow-sm space-y-6">
                            {/* Sound Effects Toggle */}
                            <div>
                                <label className="flex items-center justify-between cursor-pointer">
                                    <div>
                                        <span className="text-sm font-medium">System Sound Effects</span>
                                        <p className="text-xs text-gray-500 mt-1">Play sound effects for system actions like opening windows, minimizing, and notifications</p>
                                    </div>
                                    <div className="relative inline-block">
                                        <input
                                            type="checkbox"
                                            checked={soundEnabled}
                                            onChange={toggleSoundEffects}
                                            className="sr-only peer"
                                        />
                                        <div className={`block w-14 h-8 rounded-full transition-colors ${soundEnabled ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                                        <div className={`absolute left-1 top-1 w-6 h-6 rounded-full bg-white transition-transform ${soundEnabled ? 'translate-x-6' : ''}`}></div>
                                    </div>
                                </label>
                            </div>

                            {/* Volume Control */}
                            <div className={soundEnabled ? '' : 'opacity-50 pointer-events-none'}>
                                <label className="block text-sm font-medium mb-3">Sound Effects Volume</label>
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.01"
                                    value={soundVolume}
                                    onChange={(e) => setSoundVolume(parseFloat(e.target.value))}
                                    className="w-full accent-blue-500"
                                    disabled={!soundEnabled}
                                />
                                <div className="flex justify-between text-xs text-gray-500 mt-2">
                                    <span>Quiet</span>
                                    <span>{Math.round(soundVolume * 100)}%</span>
                                    <span>Loud</span>
                                </div>
                            </div>
                            <div className="border-t pt-4">
                                <p className="text-sm font-medium mb-2">Output Device</p>
                                <select className="w-full p-2 border rounded">
                                    <option>Built-in Speakers</option>
                                    <option>Headphones</option>
                                    <option>External Speakers</option>
                                </select>
                            </div>
                        </div>
                    </div>
                )

            case 'notifications':
                return (
                    <div>
                        <h2 className="text-xl font-bold mb-6 text-gray-800">Notifications</h2>
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <label className="flex items-center justify-between mb-4">
                                <span>Allow Notifications</span>
                                <input
                                    type="checkbox"
                                    checked={settings.notificationsEnabled}
                                    onChange={(e) => updateSetting('notificationsEnabled', e.target.checked)}
                                    className="rounded"
                                />
                            </label>
                            <div className="space-y-3">
                                <div className="p-3 bg-gray-50 rounded flex items-center justify-between">
                                    <span>Messages</span>
                                    <span className="text-sm text-blue-500">Banners</span>
                                </div>
                                <div className="p-3 bg-gray-50 rounded flex items-center justify-between">
                                    <span>Music</span>
                                    <span className="text-sm text-blue-500">Alerts</span>
                                </div>
                                <div className="p-3 bg-gray-50 rounded flex items-center justify-between">
                                    <span>Safari</span>
                                    <span className="text-sm text-blue-500">Banners</span>
                                </div>
                                <div className="p-3 bg-gray-50 rounded flex items-center justify-between">
                                    <span>Terminal</span>
                                    <span className="text-sm text-gray-500">None</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )

            case 'network':
                return (
                    <div>
                        <h2 className="text-xl font-bold mb-6 text-gray-800">Network</h2>
                        <div className="bg-white rounded-lg p-6 shadow-sm space-y-4">
                            <div>
                                <label className="flex items-center justify-between">
                                    <span className="font-medium">Wi-Fi</span>
                                    <input
                                        type="checkbox"
                                        checked={settings.wifiEnabled}
                                        onChange={(e) => updateSetting('wifiEnabled', e.target.checked)}
                                        className="rounded"
                                    />
                                </label>
                                {settings.wifiEnabled && (
                                    <div className="mt-3 p-3 bg-gray-50 rounded">
                                        <p className="text-sm">Connected to: Home Network</p>
                                        <p className="text-xs text-gray-500">Signal: Excellent</p>
                                    </div>
                                )}
                            </div>
                            <div className="border-t pt-4">
                                <label className="flex items-center justify-between">
                                    <span className="font-medium">Bluetooth</span>
                                    <input
                                        type="checkbox"
                                        checked={settings.bluetoothEnabled}
                                        onChange={(e) => updateSetting('bluetoothEnabled', e.target.checked)}
                                        className="rounded"
                                    />
                                </label>
                            </div>
                        </div>
                    </div>
                )

            case 'security':
                return (
                    <div>
                        <h2 className="text-xl font-bold mb-6 text-gray-800">Security & Privacy</h2>
                        <div className="bg-white rounded-lg p-6 shadow-sm space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Require password after sleep</label>
                                <select
                                    className="w-full p-2 border rounded"
                                    value={settings.autoLock}
                                    onChange={(e) => updateSetting('autoLock', e.target.value)}
                                >
                                    <option>Immediately</option>
                                    <option>5 minutes</option>
                                    <option>15 minutes</option>
                                    <option>1 hour</option>
                                    <option>Never</option>
                                </select>
                            </div>
                            <div className="border-t pt-4">
                                <label className="flex items-center justify-between mb-3">
                                    <span>FileVault</span>
                                    <input
                                        type="checkbox"
                                        checked={settings.fileVaultEnabled}
                                        onChange={(e) => updateSetting('fileVaultEnabled', e.target.checked)}
                                        className="rounded"
                                    />
                                </label>
                                <label className="flex items-center justify-between">
                                    <span>Firewall</span>
                                    <input
                                        type="checkbox"
                                        checked={settings.firewallEnabled}
                                        onChange={(e) => updateSetting('firewallEnabled', e.target.checked)}
                                        className="rounded"
                                    />
                                </label>
                            </div>
                        </div>
                    </div>
                )

            case 'battery':
                return (
                    <div>
                        <h2 className="text-xl font-bold mb-6 text-gray-800">Battery</h2>
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <div className="mb-6">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-2xl font-bold">85%</span>
                                    <FaBatteryFull className="text-3xl text-green-500" />
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                                    <div className="bg-green-500 h-4 rounded-full" style={{ width: '85%' }}></div>
                                </div>
                                <p className="text-sm text-gray-600">Power Source: Battery</p>
                                <p className="text-sm text-gray-600">Time Remaining: 4:30</p>
                            </div>
                            <div className="border-t pt-4 space-y-3">
                                <label className="flex items-center justify-between">
                                    <span>Show battery percentage</span>
                                    <input
                                        type="checkbox"
                                        checked={settings.showBatteryPercentage}
                                        onChange={(e) => updateSetting('showBatteryPercentage', e.target.checked)}
                                        className="rounded"
                                    />
                                </label>
                                <label className="flex items-center justify-between">
                                    <span>Low Power Mode</span>
                                    <input
                                        type="checkbox"
                                        checked={settings.energySaver}
                                        onChange={(e) => updateSetting('energySaver', e.target.checked)}
                                        className="rounded"
                                    />
                                </label>
                            </div>
                        </div>
                    </div>
                )

            default:
                return (
                    <div>
                        <h2 className="text-xl font-bold mb-6 text-gray-800">{sidebarItems.find(item => item.id === currentSection)?.label}</h2>
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <p className="text-gray-600">This section is under development.</p>
                        </div>
                    </div>
                )
        }
    }

    return (
        <div className="w-full h-full bg-[#f5f5f7] flex text-sm">
            {/* Sidebar */}
            <div className="w-56 bg-white/50 backdrop-blur-xl border-r border-gray-200 p-4 overflow-y-auto">
                <div className="space-y-1">
                    {sidebarItems.map(item => (
                        <div
                            key={item.id}
                            onClick={() => setCurrentSection(item.id)}
                            className={`flex items-center gap-3 p-2 rounded-md cursor-pointer transition-colors ${
                                currentSection === item.id
                                    ? 'bg-blue-500 text-white'
                                    : 'hover:bg-gray-100 text-gray-700'
                            }`}
                        >
                            <item.icon className="text-lg" />
                            <span className="text-sm">{item.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-8 overflow-y-auto">
                {renderContent()}
            </div>
        </div>
    )
}

export default Settings
