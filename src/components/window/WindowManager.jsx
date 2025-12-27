import React, { lazy, Suspense } from 'react'
import { useStore } from '../../store/useStore'
import { AnimatePresence } from 'framer-motion'
import Window from './Window'

// Lazy load all apps for better performance
const Finder = lazy(() => import('../../apps/Finder'))
const Safari = lazy(() => import('../../apps/Safari'))
const Calculator = lazy(() => import('../../apps/Calculator'))
const VSCode = lazy(() => import('../../apps/VSCode'))
const Notes = lazy(() => import('../../apps/Notes'))
const Settings = lazy(() => import('../../apps/Settings'))
const Terminal = lazy(() => import('../../apps/Terminal'))
const Music = lazy(() => import('../../apps/Music'))
const Messages = lazy(() => import('../../apps/Messages'))
const Photos = lazy(() => import('../../apps/Photos'))
const Calendar = lazy(() => import('../../apps/Calendar'))
const Trash = lazy(() => import('../../apps/Trash'))
const Weather = lazy(() => import('../../apps/Weather'))
const Mail = lazy(() => import('../../apps/Mail'))
const Reminders = lazy(() => import('../../apps/Reminders'))
const ActivityMonitor = lazy(() => import('../../apps/ActivityMonitor'))
const Preview = lazy(() => import('../../apps/Preview'))
const TextEdit = lazy(() => import('../../apps/TextEdit'))

// New apps
const AppStore = lazy(() => import('../../apps/AppStore'))
const Books = lazy(() => import('../../apps/Books'))
const Clock = lazy(() => import('../../apps/Clock'))
const Contacts = lazy(() => import('../../apps/Contacts'))
const Dictionary = lazy(() => import('../../apps/Dictionary'))
const DiskUtility = lazy(() => import('../../apps/DiskUtility'))
const FaceTime = lazy(() => import('../../apps/FaceTime'))
const FontBook = lazy(() => import('../../apps/FontBook'))
const Maps = lazy(() => import('../../apps/Maps'))
const News = lazy(() => import('../../apps/News'))
const PhotoBooth = lazy(() => import('../../apps/PhotoBooth'))
const Podcasts = lazy(() => import('../../apps/Podcasts'))
const Shortcuts = lazy(() => import('../../apps/Shortcuts'))
const Stocks = lazy(() => import('../../apps/Stocks'))
const SystemInfo = lazy(() => import('../../apps/SystemInfo'))
const VoiceMemos = lazy(() => import('../../apps/VoiceMemos'))

// Loading fallback component
const LoadingFallback = () => {
    const { darkMode } = useStore()
    return (
        <div className={`w-full h-full flex items-center justify-center ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
            <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Loading...</span>
            </div>
        </div>
    )
}

const WindowManager = () => {
    const { windows, currentDesktop } = useStore()

    const getComponent = (id) => {
        const componentMap = {
            'finder': <Finder />,
            'safari': <Safari />,
            'calculator': <Calculator />,
            'vscode': <VSCode />,
            'notes': <Notes />,
            'settings': <Settings />,
            'terminal': <Terminal />,
            'music': <Music />,
            'messages': <Messages />,
            'photos': <Photos />,
            'calendar': <Calendar />,
            'trash': <Trash />,
            'weather': <Weather />,
            'mail': <Mail />,
            'reminders': <Reminders />,
            'activity-monitor': <ActivityMonitor />,
            'preview': <Preview />,
            'textedit': <TextEdit />,
            // New apps
            'appstore': <AppStore />,
            'books': <Books />,
            'clock': <Clock />,
            'contacts': <Contacts />,
            'dictionary': <Dictionary />,
            'disk-utility': <DiskUtility />,
            'facetime': <FaceTime />,
            'font-book': <FontBook />,
            'maps': <Maps />,
            'news': <News />,
            'photobooth': <PhotoBooth />,
            'podcasts': <Podcasts />,
            'shortcuts': <Shortcuts />,
            'stocks': <Stocks />,
            'system-info': <SystemInfo />,
            'voice-memos': <VoiceMemos />,
        }

        return componentMap[id] || <div className="p-4 text-center text-gray-500">App not implemented yet</div>
    }

    // 只显示当前桌面的窗口
    const visibleWindows = windows.filter(window =>
        window.isOpen && (window.desktop === currentDesktop || (!window.desktop && currentDesktop === 1))
    )

    return (
        <AnimatePresence>
            {visibleWindows.map((window) => (
                <Window key={window.id} window={window}>
                    <Suspense fallback={<LoadingFallback />}>
                        {getComponent(window.component)}
                    </Suspense>
                </Window>
            ))}
        </AnimatePresence>
    )
}

export default WindowManager
