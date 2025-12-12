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

    // Dark mode style helpers
    const headingClass = darkMode ? 'text-white' : 'text-gray-800'
    const subheadingClass = darkMode ? 'text-gray-300' : 'text-gray-700'
    const textClass = darkMode ? 'text-gray-400' : 'text-gray-600'
    const mutedClass = darkMode ? 'text-gray-500' : 'text-gray-500'
    const cardClass = darkMode ? 'bg-gray-800 shadow-lg' : 'bg-white shadow-sm'
    const itemClass = darkMode ? 'bg-gray-700' : 'bg-gray-50'
    const borderClass = darkMode ? 'border-gray-700' : 'border-gray-200'
    const inputClass = darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'

    const renderContent = () => {
        switch (currentSection) {
            case 'appearance':
                return (
                    <div>
                        <h2 className={`text-xl font-bold mb-6 ${headingClass}`}>Appearance</h2>

                        {/* Dark Mode */}
                        <div className="mb-8">
                            <h3 className={`text-lg font-medium mb-4 ${subheadingClass}`}>Theme</h3>
                            <div className={`rounded-lg p-4 ${cardClass}`}>
                                <label className="flex items-center justify-between cursor-pointer">
                                    <span className={subheadingClass}>Dark Mode</span>
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
                                <p className={`text-xs mt-2 ${mutedClass}`}>
                                    Toggle between light and dark appearance for the entire system
                                </p>
                            </div>
                        </div>

                        {/* Wallpaper */}
                        <div>
                            <h3 className={`text-lg font-medium mb-4 ${subheadingClass}`}>Desktop Wallpaper</h3>
                            <div className="grid grid-cols-3 gap-4">
                                {wallpapers.map((wp, i) => (
                                    <div
                                        key={i}
                                        className={`aspect-video rounded-lg overflow-hidden cursor-pointer border-4 transition-all ${wallpaper === wp ? 'border-blue-500 shadow-lg' : darkMode ? 'border-transparent hover:border-gray-600' : 'border-transparent hover:border-gray-300'}`}
                                        onClick={() => setWallpaper(wp)}
                                    >
                                        <img src={wp} alt={`Wallpaper ${i}`} className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Dock Settings */}
                        <div className="mt-8">
                            <h3 className={`text-lg font-medium mb-4 ${subheadingClass}`}>Dock</h3>
                            <div className={`rounded-lg p-4 space-y-3 ${cardClass}`}>
                                <label className="flex items-center justify-between cursor-pointer">
                                    <span className={subheadingClass}>Magnification</span>
                                    <input
                                        type="checkbox"
                                        checked={settings.magnification}
                                        onChange={(e) => updateSetting('magnification', e.target.checked)}
                                        className="rounded"
                                    />
                                </label>
                                <label className="flex items-center justify-between cursor-pointer">
                                    <span className={subheadingClass}>Automatically hide and show the Dock</span>
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
                        <h2 className={`text-xl font-bold mb-6 ${headingClass}`}>Display</h2>
                        <div className={`rounded-lg p-6 ${cardClass}`}>
                            <div className="mb-6">
                                <label className={`block text-sm font-medium mb-2 ${subheadingClass}`}>Brightness</label>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={brightness}
                                    onChange={(e) => setBrightness(parseInt(e.target.value))}
                                    className="w-full"
                                />
                                <div className={`flex justify-between text-xs mt-1 ${mutedClass}`}>
                                    <span>0%</span>
                                    <span>{brightness}%</span>
                                    <span>100%</span>
                                </div>
                            </div>
                            <div className={`border-t pt-4 ${borderClass}`}>
                                <p className={`text-sm ${textClass}`}>Display: Built-in Retina Display</p>
                                <p className={`text-sm ${textClass}`}>Resolution: 2880 x 1800</p>
                                <p className={`text-sm ${textClass}`}>Color Profile: Display P3</p>
                            </div>
                        </div>
                    </div>
                )

            case 'sound':
                return (
                    <div>
                        <h2 className={`text-xl font-bold mb-6 ${headingClass}`}>Sound</h2>
                        <div className={`rounded-lg p-6 space-y-6 ${cardClass}`}>
                            {/* Sound Effects Toggle */}
                            <div>
                                <label className="flex items-center justify-between cursor-pointer">
                                    <div>
                                        <span className={`text-sm font-medium ${subheadingClass}`}>System Sound Effects</span>
                                        <p className={`text-xs mt-1 ${mutedClass}`}>Play sound effects for system actions like opening windows, minimizing, and notifications</p>
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
                                <label className={`block text-sm font-medium mb-3 ${subheadingClass}`}>Sound Effects Volume</label>
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
                                <div className={`flex justify-between text-xs mt-2 ${mutedClass}`}>
                                    <span>Quiet</span>
                                    <span>{Math.round(soundVolume * 100)}%</span>
                                    <span>Loud</span>
                                </div>
                            </div>
                            <div className={`border-t pt-4 ${borderClass}`}>
                                <p className={`text-sm font-medium mb-2 ${subheadingClass}`}>Output Device</p>
                                <select className={`w-full p-2 border rounded ${inputClass}`}>
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
                        <h2 className={`text-xl font-bold mb-6 ${headingClass}`}>Notifications</h2>
                        <div className={`rounded-lg p-6 ${cardClass}`}>
                            <label className="flex items-center justify-between mb-4">
                                <span className={subheadingClass}>Allow Notifications</span>
                                <input
                                    type="checkbox"
                                    checked={settings.notificationsEnabled}
                                    onChange={(e) => updateSetting('notificationsEnabled', e.target.checked)}
                                    className="rounded"
                                />
                            </label>
                            <div className="space-y-3">
                                <div className={`p-3 rounded flex items-center justify-between ${itemClass}`}>
                                    <span className={subheadingClass}>Messages</span>
                                    <span className="text-sm text-blue-500">Banners</span>
                                </div>
                                <div className={`p-3 rounded flex items-center justify-between ${itemClass}`}>
                                    <span className={subheadingClass}>Music</span>
                                    <span className="text-sm text-blue-500">Alerts</span>
                                </div>
                                <div className={`p-3 rounded flex items-center justify-between ${itemClass}`}>
                                    <span className={subheadingClass}>Safari</span>
                                    <span className="text-sm text-blue-500">Banners</span>
                                </div>
                                <div className={`p-3 rounded flex items-center justify-between ${itemClass}`}>
                                    <span className={subheadingClass}>Terminal</span>
                                    <span className={`text-sm ${mutedClass}`}>None</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )

            case 'network':
                return (
                    <div>
                        <h2 className={`text-xl font-bold mb-6 ${headingClass}`}>Network</h2>
                        <div className={`rounded-lg p-6 space-y-4 ${cardClass}`}>
                            <div>
                                <label className="flex items-center justify-between">
                                    <span className={`font-medium ${subheadingClass}`}>Wi-Fi</span>
                                    <input
                                        type="checkbox"
                                        checked={settings.wifiEnabled}
                                        onChange={(e) => updateSetting('wifiEnabled', e.target.checked)}
                                        className="rounded"
                                    />
                                </label>
                                {settings.wifiEnabled && (
                                    <div className={`mt-3 p-3 rounded ${itemClass}`}>
                                        <p className={`text-sm ${subheadingClass}`}>Connected to: Home Network</p>
                                        <p className={`text-xs ${mutedClass}`}>Signal: Excellent</p>
                                    </div>
                                )}
                            </div>
                            <div className={`border-t pt-4 ${borderClass}`}>
                                <label className="flex items-center justify-between">
                                    <span className={`font-medium ${subheadingClass}`}>Bluetooth</span>
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
                        <h2 className={`text-xl font-bold mb-6 ${headingClass}`}>Security & Privacy</h2>
                        <div className={`rounded-lg p-6 space-y-4 ${cardClass}`}>
                            <div>
                                <label className={`block text-sm font-medium mb-2 ${subheadingClass}`}>Require password after sleep</label>
                                <select
                                    className={`w-full p-2 border rounded ${inputClass}`}
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
                            <div className={`border-t pt-4 ${borderClass}`}>
                                <label className="flex items-center justify-between mb-3">
                                    <span className={subheadingClass}>FileVault</span>
                                    <input
                                        type="checkbox"
                                        checked={settings.fileVaultEnabled}
                                        onChange={(e) => updateSetting('fileVaultEnabled', e.target.checked)}
                                        className="rounded"
                                    />
                                </label>
                                <label className="flex items-center justify-between">
                                    <span className={subheadingClass}>Firewall</span>
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
                        <h2 className={`text-xl font-bold mb-6 ${headingClass}`}>Battery</h2>
                        <div className={`rounded-lg p-6 ${cardClass}`}>
                            <div className="mb-6">
                                <div className="flex items-center justify-between mb-4">
                                    <span className={`text-2xl font-bold ${headingClass}`}>85%</span>
                                    <FaBatteryFull className="text-3xl text-green-500" />
                                </div>
                                <div className={`w-full rounded-full h-4 mb-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                                    <div className="bg-green-500 h-4 rounded-full" style={{ width: '85%' }}></div>
                                </div>
                                <p className={`text-sm ${textClass}`}>Power Source: Battery</p>
                                <p className={`text-sm ${textClass}`}>Time Remaining: 4:30</p>
                            </div>
                            <div className={`border-t pt-4 space-y-3 ${borderClass}`}>
                                <label className="flex items-center justify-between">
                                    <span className={subheadingClass}>Show battery percentage</span>
                                    <input
                                        type="checkbox"
                                        checked={settings.showBatteryPercentage}
                                        onChange={(e) => updateSetting('showBatteryPercentage', e.target.checked)}
                                        className="rounded"
                                    />
                                </label>
                                <label className="flex items-center justify-between">
                                    <span className={subheadingClass}>Low Power Mode</span>
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
                        <h2 className={`text-xl font-bold mb-6 ${headingClass}`}>General</h2>
                        <div className={`rounded-lg p-6 space-y-4 ${cardClass}`}>
                            <div>
                                <label className={`block text-sm font-medium mb-2 ${subheadingClass}`}>Default web browser</label>
                                <select className={`w-full p-2 border rounded ${inputClass}`}>
                                    <option>Safari</option>
                                    <option>Chrome</option>
                                    <option>Firefox</option>
                                </select>
                            </div>
                            <div>
                                <label className={`block text-sm font-medium mb-2 ${subheadingClass}`}>Default email reader</label>
                                <select className={`w-full p-2 border rounded ${inputClass}`}>
                                    <option>Mail</option>
                                    <option>Gmail</option>
                                    <option>Outlook</option>
                                </select>
                            </div>
                            <div className={`border-t pt-4 ${borderClass}`}>
                                <label className="flex items-center justify-between">
                                    <span className={subheadingClass}>Ask to keep changes when closing documents</span>
                                    <input type="checkbox" defaultChecked className="rounded" />
                                </label>
                            </div>
                            <div>
                                <label className="flex items-center justify-between">
                                    <span className={subheadingClass}>Close windows when quitting an application</span>
                                    <input type="checkbox" className="rounded" />
                                </label>
                            </div>
                            <div>
                                <label className={`block text-sm font-medium mb-2 ${subheadingClass}`}>Recent items</label>
                                <select className={`w-full p-2 border rounded ${inputClass}`}>
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
                        <h2 className={`text-xl font-bold mb-6 ${headingClass}`}>Language & Region</h2>
                        <div className={`rounded-lg p-6 space-y-4 ${cardClass}`}>
                            <div>
                                <label className={`block text-sm font-medium mb-2 ${subheadingClass}`}>Preferred Languages</label>
                                <div className="space-y-2">
                                    <div className={`p-3 rounded flex items-center justify-between ${itemClass}`}>
                                        <span className={subheadingClass}>English (US)</span>
                                        <span className="text-xs text-blue-500">Primary</span>
                                    </div>
                                    <div className={`p-3 rounded flex items-center justify-between ${itemClass}`}>
                                        <span className={subheadingClass}>Chinese (Simplified)</span>
                                        <span className={`text-xs ${mutedClass}`}>Secondary</span>
                                    </div>
                                </div>
                            </div>
                            <div className={`border-t pt-4 ${borderClass}`}>
                                <label className={`block text-sm font-medium mb-2 ${subheadingClass}`}>Region</label>
                                <select className={`w-full p-2 border rounded ${inputClass}`}>
                                    <option>United States</option>
                                    <option>China</option>
                                    <option>United Kingdom</option>
                                    <option>Japan</option>
                                    <option>Germany</option>
                                </select>
                            </div>
                            <div>
                                <label className={`block text-sm font-medium mb-2 ${subheadingClass}`}>Calendar</label>
                                <select className={`w-full p-2 border rounded ${inputClass}`}>
                                    <option>Gregorian</option>
                                    <option>Chinese</option>
                                    <option>Japanese</option>
                                </select>
                            </div>
                            <div>
                                <label className={`block text-sm font-medium mb-2 ${subheadingClass}`}>Temperature</label>
                                <select className={`w-full p-2 border rounded ${inputClass}`}>
                                    <option>Fahrenheit</option>
                                    <option>Celsius</option>
                                </select>
                            </div>
                            <div>
                                <label className={`block text-sm font-medium mb-2 ${subheadingClass}`}>First day of week</label>
                                <select className={`w-full p-2 border rounded ${inputClass}`}>
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
                        <h2 className={`text-xl font-bold mb-6 ${headingClass}`}>Keyboard</h2>
                        <div className={`rounded-lg p-6 space-y-4 ${cardClass}`}>
                            <div>
                                <label className={`block text-sm font-medium mb-2 ${subheadingClass}`}>Key Repeat Rate</label>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    defaultValue="50"
                                    className="w-full"
                                />
                                <div className={`flex justify-between text-xs mt-1 ${mutedClass}`}>
                                    <span>Slow</span>
                                    <span>Fast</span>
                                </div>
                            </div>
                            <div>
                                <label className={`block text-sm font-medium mb-2 ${subheadingClass}`}>Delay Until Repeat</label>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    defaultValue="50"
                                    className="w-full"
                                />
                                <div className={`flex justify-between text-xs mt-1 ${mutedClass}`}>
                                    <span>Long</span>
                                    <span>Short</span>
                                </div>
                            </div>
                            <div className={`border-t pt-4 space-y-3 ${borderClass}`}>
                                <label className="flex items-center justify-between">
                                    <span className={subheadingClass}>Adjust keyboard brightness in low light</span>
                                    <input type="checkbox" defaultChecked className="rounded" />
                                </label>
                                <label className="flex items-center justify-between">
                                    <span className={subheadingClass}>Turn keyboard backlight off after inactivity</span>
                                    <input type="checkbox" defaultChecked className="rounded" />
                                </label>
                                <label className="flex items-center justify-between">
                                    <span className={subheadingClass}>Use F1, F2, etc. as standard function keys</span>
                                    <input type="checkbox" className="rounded" />
                                </label>
                            </div>
                            <div className={`border-t pt-4 ${borderClass}`}>
                                <h3 className={`text-sm font-medium mb-3 ${subheadingClass}`}>Keyboard Shortcuts</h3>
                                <div className="space-y-2 text-sm">
                                    <div className={`flex justify-between p-2 rounded ${itemClass}`}>
                                        <span className={subheadingClass}>Spotlight</span>
                                        <span className={mutedClass}>Cmd + Space</span>
                                    </div>
                                    <div className={`flex justify-between p-2 rounded ${itemClass}`}>
                                        <span className={subheadingClass}>Launchpad</span>
                                        <span className={mutedClass}>F4</span>
                                    </div>
                                    <div className={`flex justify-between p-2 rounded ${itemClass}`}>
                                        <span className={subheadingClass}>Mission Control</span>
                                        <span className={mutedClass}>F3</span>
                                    </div>
                                    <div className={`flex justify-between p-2 rounded ${itemClass}`}>
                                        <span className={subheadingClass}>Close Window</span>
                                        <span className={mutedClass}>Cmd + W</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )

            case 'trackpad':
                return (
                    <div>
                        <h2 className={`text-xl font-bold mb-6 ${headingClass}`}>Trackpad & Mouse</h2>
                        <div className={`rounded-lg p-6 space-y-4 ${cardClass}`}>
                            <div>
                                <label className={`block text-sm font-medium mb-2 ${subheadingClass}`}>Tracking Speed</label>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={settings.trackpadSpeed}
                                    onChange={(e) => updateSetting('trackpadSpeed', parseInt(e.target.value))}
                                    className="w-full"
                                />
                                <div className={`flex justify-between text-xs mt-1 ${mutedClass}`}>
                                    <span>Slow</span>
                                    <span>Fast</span>
                                </div>
                            </div>
                            <div className={`border-t pt-4 space-y-3 ${borderClass}`}>
                                <label className="flex items-center justify-between">
                                    <span className={subheadingClass}>Tap to click</span>
                                    <input
                                        type="checkbox"
                                        checked={settings.clickToTap}
                                        onChange={(e) => updateSetting('clickToTap', e.target.checked)}
                                        className="rounded"
                                    />
                                </label>
                                <label className="flex items-center justify-between">
                                    <span className={subheadingClass}>Natural scrolling</span>
                                    <input
                                        type="checkbox"
                                        checked={settings.scrollDirection === 'natural'}
                                        onChange={(e) => updateSetting('scrollDirection', e.target.checked ? 'natural' : 'standard')}
                                        className="rounded"
                                    />
                                </label>
                                <label className="flex items-center justify-between">
                                    <span className={subheadingClass}>Force Click and haptic feedback</span>
                                    <input type="checkbox" defaultChecked className="rounded" />
                                </label>
                            </div>
                            <div className={`border-t pt-4 ${borderClass}`}>
                                <h3 className={`text-sm font-medium mb-3 ${subheadingClass}`}>Gestures</h3>
                                <div className="space-y-2 text-sm">
                                    <div className={`flex justify-between p-2 rounded ${itemClass}`}>
                                        <span className={subheadingClass}>Scroll</span>
                                        <span className={mutedClass}>Two fingers</span>
                                    </div>
                                    <div className={`flex justify-between p-2 rounded ${itemClass}`}>
                                        <span className={subheadingClass}>Zoom</span>
                                        <span className={mutedClass}>Pinch</span>
                                    </div>
                                    <div className={`flex justify-between p-2 rounded ${itemClass}`}>
                                        <span className={subheadingClass}>Smart Zoom</span>
                                        <span className={mutedClass}>Double tap</span>
                                    </div>
                                    <div className={`flex justify-between p-2 rounded ${itemClass}`}>
                                        <span className={subheadingClass}>Mission Control</span>
                                        <span className={mutedClass}>Swipe up with three fingers</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )

            case 'printers':
                return (
                    <div>
                        <h2 className={`text-xl font-bold mb-6 ${headingClass}`}>Printers & Scanners</h2>
                        <div className={`rounded-lg p-6 ${cardClass}`}>
                            <div className="text-center py-8">
                                <FaPrint className={`text-5xl mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-300'}`} />
                                <p className={`mb-4 ${mutedClass}`}>No printers are available.</p>
                                <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
                                    Add Printer
                                </button>
                            </div>
                            <div className={`border-t pt-4 mt-4 ${borderClass}`}>
                                <h3 className={`text-sm font-medium mb-3 ${subheadingClass}`}>Print Queue</h3>
                                <p className={`text-sm ${mutedClass}`}>No print jobs in queue</p>
                            </div>
                        </div>
                    </div>
                )

            case 'users':
                return (
                    <div>
                        <h2 className={`text-xl font-bold mb-6 ${headingClass}`}>Users & Groups</h2>
                        <div className={`rounded-lg p-6 ${cardClass}`}>
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                                    <FaUserCircle className="text-4xl text-white" />
                                </div>
                                <div>
                                    <h3 className={`font-medium text-lg ${headingClass}`}>Guest User</h3>
                                    <p className={`text-sm ${mutedClass}`}>Admin</p>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className={`p-3 rounded flex items-center justify-between ${itemClass}`}>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                                            <span className="text-white text-sm">G</span>
                                        </div>
                                        <span className={subheadingClass}>Guest User</span>
                                    </div>
                                    <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">Admin</span>
                                </div>
                            </div>
                            <div className={`border-t pt-4 mt-4 ${borderClass}`}>
                                <label className="flex items-center justify-between">
                                    <span className={subheadingClass}>Allow guests to log in to this computer</span>
                                    <input type="checkbox" className="rounded" />
                                </label>
                            </div>
                            <div className="mt-4">
                                <button className={`px-4 py-2 rounded transition-colors ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                                    Add User...
                                </button>
                            </div>
                        </div>
                    </div>
                )

            case 'advanced':
                return (
                    <div>
                        <h2 className={`text-xl font-bold mb-6 ${headingClass}`}>Advanced</h2>
                        <div className={`rounded-lg p-6 space-y-4 ${cardClass}`}>
                            <div className={`p-4 rounded-lg ${darkMode ? 'bg-yellow-900/30 border border-yellow-700' : 'bg-yellow-50 border border-yellow-200'}`}>
                                <p className={`text-sm ${darkMode ? 'text-yellow-200' : 'text-yellow-800'}`}>
                                    These settings are for advanced users. Changes may affect system performance and stability.
                                </p>
                            </div>
                            <div className={`border-t pt-4 space-y-3 ${borderClass}`}>
                                <label className="flex items-center justify-between">
                                    <span className={subheadingClass}>Show developer menu in menu bar</span>
                                    <input type="checkbox" className="rounded" />
                                </label>
                                <label className="flex items-center justify-between">
                                    <span className={subheadingClass}>Enable accessibility features</span>
                                    <input type="checkbox" defaultChecked className="rounded" />
                                </label>
                                <label className="flex items-center justify-between">
                                    <span className={subheadingClass}>Reduce motion</span>
                                    <input type="checkbox" className="rounded" />
                                </label>
                                <label className="flex items-center justify-between">
                                    <span className={subheadingClass}>Reduce transparency</span>
                                    <input type="checkbox" className="rounded" />
                                </label>
                            </div>
                            <div className={`border-t pt-4 ${borderClass}`}>
                                <h3 className={`text-sm font-medium mb-3 ${subheadingClass}`}>System Information</h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className={mutedClass}>macOS Version</span>
                                        <span className={subheadingClass}>Sonoma 14.0</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className={mutedClass}>Processor</span>
                                        <span className={subheadingClass}>Apple M2</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className={mutedClass}>Memory</span>
                                        <span className={subheadingClass}>16 GB</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className={mutedClass}>Storage</span>
                                        <span className={subheadingClass}>256 GB (128 GB available)</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )

            case 'datetime':
                return (
                    <div>
                        <h2 className={`text-xl font-bold mb-6 ${headingClass}`}>Date & Time</h2>
                        <div className={`rounded-lg p-6 space-y-4 ${cardClass}`}>
                            <div className="text-center mb-6">
                                <div className={`text-4xl font-light mb-2 ${headingClass}`}>
                                    {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                </div>
                                <div className={mutedClass}>
                                    {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                </div>
                            </div>
                            <div className={`border-t pt-4 ${borderClass}`}>
                                <label className="flex items-center justify-between mb-4">
                                    <span className={subheadingClass}>Set date and time automatically</span>
                                    <input type="checkbox" defaultChecked className="rounded" />
                                </label>
                                <div>
                                    <label className={`block text-sm font-medium mb-2 ${subheadingClass}`}>Time Zone</label>
                                    <select
                                        className={`w-full p-2 border rounded ${inputClass}`}
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
                            <div className={`border-t pt-4 space-y-3 ${borderClass}`}>
                                <label className="flex items-center justify-between">
                                    <span className={subheadingClass}>24-hour time</span>
                                    <input type="checkbox" className="rounded" />
                                </label>
                                <label className="flex items-center justify-between">
                                    <span className={subheadingClass}>Show date in menu bar</span>
                                    <input type="checkbox" defaultChecked className="rounded" />
                                </label>
                                <label className="flex items-center justify-between">
                                    <span className={subheadingClass}>Show day of the week</span>
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
                        <h2 className={`text-xl font-bold mb-6 ${headingClass}`}>Hot Corners</h2>
                        <div className={`rounded-lg p-6 ${cardClass}`}>
                            <p className={`mb-6 ${textClass}`}>
                                Move your cursor to a corner of the screen to quickly access features.
                            </p>

                            {/* Visual corner diagram */}
                            <div className={`relative w-full aspect-video rounded-lg mb-6 border ${darkMode ? 'bg-gradient-to-br from-gray-700 to-gray-800 border-gray-600' : 'bg-gradient-to-br from-gray-100 to-gray-200 border-gray-300'}`}>
                                {/* Top Left */}
                                <div className="absolute top-0 left-0 p-3">
                                    <select
                                        value={hotCorners.topLeft}
                                        onChange={(e) => setHotCornerAction('topLeft', e.target.value)}
                                        className={`px-3 py-1.5 text-sm border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputClass}`}
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
                                        className={`px-3 py-1.5 text-sm border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputClass}`}
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
                                        className={`px-3 py-1.5 text-sm border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputClass}`}
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
                                        className={`px-3 py-1.5 text-sm border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputClass}`}
                                    >
                                        {cornerActions.map(action => (
                                            <option key={action.value} value={action.value}>{action.label}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Center text */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className={`text-center ${mutedClass}`}>
                                        <p className="text-sm font-medium">Screen Preview</p>
                                        <p className="text-xs">Configure actions for each corner</p>
                                    </div>
                                </div>
                            </div>

                            <div className={`rounded-lg p-4 text-sm ${darkMode ? 'bg-blue-900/30 border border-blue-700 text-blue-200' : 'bg-blue-50 border border-blue-200 text-blue-800'}`}>
                                <p className="font-medium mb-1">Tip</p>
                                <p>Hover your mouse in a corner for 0.5 seconds to trigger the assigned action.</p>
                            </div>
                        </div>
                    </div>
                )

            default:
                return (
                    <div>
                        <h2 className={`text-xl font-bold mb-6 ${headingClass}`}>{sidebarItems.find(item => item.id === currentSection)?.label}</h2>
                        <div className={`rounded-lg p-6 ${cardClass}`}>
                            <p className={textClass}>This section is under development.</p>
                        </div>
                    </div>
                )
        }
    }

    return (
        <div className={`w-full h-full flex text-sm transition-colors duration-300 ${
            darkMode ? 'bg-gray-900' : 'bg-[#f5f5f7]'
        }`}>
            {/* Sidebar */}
            <div className={`w-56 backdrop-blur-xl border-r p-4 overflow-y-auto transition-colors duration-300 ${
                darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white/50 border-gray-200'
            }`}>
                <div className="space-y-1">
                    {sidebarItems.map(item => (
                        <div
                            key={item.id}
                            onClick={() => setCurrentSection(item.id)}
                            className={`flex items-center gap-3 p-2 rounded-md cursor-pointer transition-colors ${
                                currentSection === item.id
                                    ? 'bg-blue-500 text-white'
                                    : darkMode
                                        ? 'hover:bg-gray-700 text-gray-300'
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
