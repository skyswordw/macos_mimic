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
    const { setWallpaper, wallpaper, brightness, setBrightness, darkMode, setDarkMode, soundEnabled, soundVolume, toggleSoundEffects, setSoundVolume, hotCorners, setHotCornerAction } = useStore()
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
        { id: 'hotcorners', label: 'Hot Corners', icon: FaDesktop },
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

            case 'general':
                return (
                    <div>
                        <h2 className="text-xl font-bold mb-6 text-gray-800">General</h2>
                        <div className="bg-white rounded-lg p-6 shadow-sm space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Default web browser</label>
                                <select className="w-full p-2 border rounded">
                                    <option>Safari</option>
                                    <option>Chrome</option>
                                    <option>Firefox</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Default email reader</label>
                                <select className="w-full p-2 border rounded">
                                    <option>Mail</option>
                                    <option>Gmail</option>
                                    <option>Outlook</option>
                                </select>
                            </div>
                            <div className="border-t pt-4">
                                <label className="flex items-center justify-between">
                                    <span>Ask to keep changes when closing documents</span>
                                    <input type="checkbox" defaultChecked className="rounded" />
                                </label>
                            </div>
                            <div>
                                <label className="flex items-center justify-between">
                                    <span>Close windows when quitting an application</span>
                                    <input type="checkbox" className="rounded" />
                                </label>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Recent items</label>
                                <select className="w-full p-2 border rounded">
                                    <option>5</option>
                                    <option>10</option>
                                    <option>15</option>
                                    <option>20</option>
                                    <option>None</option>
                                </select>
                            </div>
                        </div>
                    </div>
                )

            case 'language':
                return (
                    <div>
                        <h2 className="text-xl font-bold mb-6 text-gray-800">Language & Region</h2>
                        <div className="bg-white rounded-lg p-6 shadow-sm space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Preferred Languages</label>
                                <div className="space-y-2">
                                    <div className="p-3 bg-gray-50 rounded flex items-center justify-between">
                                        <span>English (US)</span>
                                        <span className="text-xs text-blue-500">Primary</span>
                                    </div>
                                    <div className="p-3 bg-gray-50 rounded flex items-center justify-between">
                                        <span>Chinese (Simplified)</span>
                                        <span className="text-xs text-gray-500">Secondary</span>
                                    </div>
                                </div>
                            </div>
                            <div className="border-t pt-4">
                                <label className="block text-sm font-medium mb-2">Region</label>
                                <select className="w-full p-2 border rounded">
                                    <option>United States</option>
                                    <option>China</option>
                                    <option>United Kingdom</option>
                                    <option>Japan</option>
                                    <option>Germany</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Calendar</label>
                                <select className="w-full p-2 border rounded">
                                    <option>Gregorian</option>
                                    <option>Chinese</option>
                                    <option>Japanese</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Temperature</label>
                                <select className="w-full p-2 border rounded">
                                    <option>Fahrenheit</option>
                                    <option>Celsius</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">First day of week</label>
                                <select className="w-full p-2 border rounded">
                                    <option>Sunday</option>
                                    <option>Monday</option>
                                </select>
                            </div>
                        </div>
                    </div>
                )

            case 'keyboard':
                return (
                    <div>
                        <h2 className="text-xl font-bold mb-6 text-gray-800">Keyboard</h2>
                        <div className="bg-white rounded-lg p-6 shadow-sm space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Key Repeat Rate</label>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    defaultValue="50"
                                    className="w-full"
                                />
                                <div className="flex justify-between text-xs text-gray-500 mt-1">
                                    <span>Slow</span>
                                    <span>Fast</span>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Delay Until Repeat</label>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    defaultValue="50"
                                    className="w-full"
                                />
                                <div className="flex justify-between text-xs text-gray-500 mt-1">
                                    <span>Long</span>
                                    <span>Short</span>
                                </div>
                            </div>
                            <div className="border-t pt-4 space-y-3">
                                <label className="flex items-center justify-between">
                                    <span>Adjust keyboard brightness in low light</span>
                                    <input type="checkbox" defaultChecked className="rounded" />
                                </label>
                                <label className="flex items-center justify-between">
                                    <span>Turn keyboard backlight off after inactivity</span>
                                    <input type="checkbox" defaultChecked className="rounded" />
                                </label>
                                <label className="flex items-center justify-between">
                                    <span>Use F1, F2, etc. as standard function keys</span>
                                    <input type="checkbox" className="rounded" />
                                </label>
                            </div>
                            <div className="border-t pt-4">
                                <h3 className="text-sm font-medium mb-3">Keyboard Shortcuts</h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between p-2 bg-gray-50 rounded">
                                        <span>Spotlight</span>
                                        <span className="text-gray-500">Cmd + Space</span>
                                    </div>
                                    <div className="flex justify-between p-2 bg-gray-50 rounded">
                                        <span>Launchpad</span>
                                        <span className="text-gray-500">F4</span>
                                    </div>
                                    <div className="flex justify-between p-2 bg-gray-50 rounded">
                                        <span>Mission Control</span>
                                        <span className="text-gray-500">F3</span>
                                    </div>
                                    <div className="flex justify-between p-2 bg-gray-50 rounded">
                                        <span>Close Window</span>
                                        <span className="text-gray-500">Cmd + W</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )

            case 'trackpad':
                return (
                    <div>
                        <h2 className="text-xl font-bold mb-6 text-gray-800">Trackpad & Mouse</h2>
                        <div className="bg-white rounded-lg p-6 shadow-sm space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Tracking Speed</label>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={settings.trackpadSpeed}
                                    onChange={(e) => updateSetting('trackpadSpeed', parseInt(e.target.value))}
                                    className="w-full"
                                />
                                <div className="flex justify-between text-xs text-gray-500 mt-1">
                                    <span>Slow</span>
                                    <span>Fast</span>
                                </div>
                            </div>
                            <div className="border-t pt-4 space-y-3">
                                <label className="flex items-center justify-between">
                                    <span>Tap to click</span>
                                    <input
                                        type="checkbox"
                                        checked={settings.clickToTap}
                                        onChange={(e) => updateSetting('clickToTap', e.target.checked)}
                                        className="rounded"
                                    />
                                </label>
                                <label className="flex items-center justify-between">
                                    <span>Natural scrolling</span>
                                    <input
                                        type="checkbox"
                                        checked={settings.scrollDirection === 'natural'}
                                        onChange={(e) => updateSetting('scrollDirection', e.target.checked ? 'natural' : 'standard')}
                                        className="rounded"
                                    />
                                </label>
                                <label className="flex items-center justify-between">
                                    <span>Force Click and haptic feedback</span>
                                    <input type="checkbox" defaultChecked className="rounded" />
                                </label>
                            </div>
                            <div className="border-t pt-4">
                                <h3 className="text-sm font-medium mb-3">Gestures</h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between p-2 bg-gray-50 rounded">
                                        <span>Scroll</span>
                                        <span className="text-gray-500">Two fingers</span>
                                    </div>
                                    <div className="flex justify-between p-2 bg-gray-50 rounded">
                                        <span>Zoom</span>
                                        <span className="text-gray-500">Pinch</span>
                                    </div>
                                    <div className="flex justify-between p-2 bg-gray-50 rounded">
                                        <span>Smart Zoom</span>
                                        <span className="text-gray-500">Double tap</span>
                                    </div>
                                    <div className="flex justify-between p-2 bg-gray-50 rounded">
                                        <span>Mission Control</span>
                                        <span className="text-gray-500">Swipe up with three fingers</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )

            case 'printers':
                return (
                    <div>
                        <h2 className="text-xl font-bold mb-6 text-gray-800">Printers & Scanners</h2>
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <div className="text-center py-8">
                                <FaPrint className="text-5xl text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-500 mb-4">No printers are available.</p>
                                <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
                                    Add Printer
                                </button>
                            </div>
                            <div className="border-t pt-4 mt-4">
                                <h3 className="text-sm font-medium mb-3">Print Queue</h3>
                                <p className="text-sm text-gray-500">No print jobs in queue</p>
                            </div>
                        </div>
                    </div>
                )

            case 'users':
                return (
                    <div>
                        <h2 className="text-xl font-bold mb-6 text-gray-800">Users & Groups</h2>
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                                    <FaUserCircle className="text-4xl text-white" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-lg">Guest User</h3>
                                    <p className="text-sm text-gray-500">Admin</p>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="p-3 bg-gray-50 rounded flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                                            <span className="text-white text-sm">G</span>
                                        </div>
                                        <span>Guest User</span>
                                    </div>
                                    <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">Admin</span>
                                </div>
                            </div>
                            <div className="border-t pt-4 mt-4">
                                <label className="flex items-center justify-between">
                                    <span>Allow guests to log in to this computer</span>
                                    <input type="checkbox" className="rounded" />
                                </label>
                            </div>
                            <div className="mt-4">
                                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors">
                                    Add User...
                                </button>
                            </div>
                        </div>
                    </div>
                )

            case 'advanced':
                return (
                    <div>
                        <h2 className="text-xl font-bold mb-6 text-gray-800">Advanced</h2>
                        <div className="bg-white rounded-lg p-6 shadow-sm space-y-4">
                            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <p className="text-sm text-yellow-800">
                                    These settings are for advanced users. Changes may affect system performance and stability.
                                </p>
                            </div>
                            <div className="border-t pt-4 space-y-3">
                                <label className="flex items-center justify-between">
                                    <span>Show developer menu in menu bar</span>
                                    <input type="checkbox" className="rounded" />
                                </label>
                                <label className="flex items-center justify-between">
                                    <span>Enable accessibility features</span>
                                    <input type="checkbox" defaultChecked className="rounded" />
                                </label>
                                <label className="flex items-center justify-between">
                                    <span>Reduce motion</span>
                                    <input type="checkbox" className="rounded" />
                                </label>
                                <label className="flex items-center justify-between">
                                    <span>Reduce transparency</span>
                                    <input type="checkbox" className="rounded" />
                                </label>
                            </div>
                            <div className="border-t pt-4">
                                <h3 className="text-sm font-medium mb-3">System Information</h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">macOS Version</span>
                                        <span>Sonoma 14.0</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Processor</span>
                                        <span>Apple M2</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Memory</span>
                                        <span>16 GB</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Storage</span>
                                        <span>256 GB (128 GB available)</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )

            case 'datetime':
                return (
                    <div>
                        <h2 className="text-xl font-bold mb-6 text-gray-800">Date & Time</h2>
                        <div className="bg-white rounded-lg p-6 shadow-sm space-y-4">
                            <div className="text-center mb-6">
                                <div className="text-4xl font-light mb-2">
                                    {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                </div>
                                <div className="text-gray-500">
                                    {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                </div>
                            </div>
                            <div className="border-t pt-4">
                                <label className="flex items-center justify-between mb-4">
                                    <span>Set date and time automatically</span>
                                    <input type="checkbox" defaultChecked className="rounded" />
                                </label>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Time Zone</label>
                                    <select
                                        className="w-full p-2 border rounded"
                                        value={settings.timezone}
                                        onChange={(e) => updateSetting('timezone', e.target.value)}
                                    >
                                        <option>Pacific Time</option>
                                        <option>Mountain Time</option>
                                        <option>Central Time</option>
                                        <option>Eastern Time</option>
                                        <option>UTC</option>
                                        <option>China Standard Time</option>
                                        <option>Japan Standard Time</option>
                                    </select>
                                </div>
                            </div>
                            <div className="border-t pt-4 space-y-3">
                                <label className="flex items-center justify-between">
                                    <span>24-hour time</span>
                                    <input type="checkbox" className="rounded" />
                                </label>
                                <label className="flex items-center justify-between">
                                    <span>Show date in menu bar</span>
                                    <input type="checkbox" defaultChecked className="rounded" />
                                </label>
                                <label className="flex items-center justify-between">
                                    <span>Show day of the week</span>
                                    <input type="checkbox" defaultChecked className="rounded" />
                                </label>
                            </div>
                        </div>
                    </div>
                )

            case 'hotcorners':
                const cornerActions = [
                    { value: 'none', label: '-' },
                    { value: 'mission-control', label: 'Mission Control' },
                    { value: 'desktop', label: 'Show Desktop' },
                    { value: 'launchpad', label: 'Launchpad' },
                    { value: 'notification-center', label: 'Notification Center' },
                    { value: 'lock-screen', label: 'Lock Screen' }
                ]

                return (
                    <div>
                        <h2 className="text-xl font-bold mb-6 text-gray-800">Hot Corners</h2>
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <p className="text-gray-600 mb-6">
                                Move your cursor to a corner of the screen to quickly access features.
                            </p>

                            {/* Visual corner diagram */}
                            <div className="relative w-full aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-6 border border-gray-300">
                                {/* Top Left */}
                                <div className="absolute top-0 left-0 p-3">
                                    <select
                                        value={hotCorners.topLeft}
                                        onChange={(e) => setHotCornerAction('topLeft', e.target.value)}
                                        className="px-3 py-1.5 text-sm border rounded shadow-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        {cornerActions.map(action => (
                                            <option key={action.value} value={action.value}>{action.label}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Top Right */}
                                <div className="absolute top-0 right-0 p-3">
                                    <select
                                        value={hotCorners.topRight}
                                        onChange={(e) => setHotCornerAction('topRight', e.target.value)}
                                        className="px-3 py-1.5 text-sm border rounded shadow-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        {cornerActions.map(action => (
                                            <option key={action.value} value={action.value}>{action.label}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Bottom Left */}
                                <div className="absolute bottom-0 left-0 p-3">
                                    <select
                                        value={hotCorners.bottomLeft}
                                        onChange={(e) => setHotCornerAction('bottomLeft', e.target.value)}
                                        className="px-3 py-1.5 text-sm border rounded shadow-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        {cornerActions.map(action => (
                                            <option key={action.value} value={action.value}>{action.label}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Bottom Right */}
                                <div className="absolute bottom-0 right-0 p-3">
                                    <select
                                        value={hotCorners.bottomRight}
                                        onChange={(e) => setHotCornerAction('bottomRight', e.target.value)}
                                        className="px-3 py-1.5 text-sm border rounded shadow-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        {cornerActions.map(action => (
                                            <option key={action.value} value={action.value}>{action.label}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Center text */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center text-gray-500">
                                        <p className="text-sm font-medium">Screen Preview</p>
                                        <p className="text-xs">Configure actions for each corner</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
                                <p className="font-medium mb-1">💡 Tip</p>
                                <p>Hover your mouse in a corner for 0.5 seconds to trigger the assigned action.</p>
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
