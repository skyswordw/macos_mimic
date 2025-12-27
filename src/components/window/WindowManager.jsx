import React, { lazy, Suspense } from 'react'
import { useStore } from '../../store/useStore'
import { AnimatePresence, motion } from 'framer-motion'
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
const Clock = lazy(() => import('../../apps/Clock'))
const Stocks = lazy(() => import('../../apps/Stocks'))
const Maps = lazy(() => import('../../apps/Maps'))
const FaceTime = lazy(() => import('../../apps/FaceTime'))
const Books = lazy(() => import('../../apps/Books'))
const Contacts = lazy(() => import('../../apps/Contacts'))
const Podcasts = lazy(() => import('../../apps/Podcasts'))
const DiskUtility = lazy(() => import('../../apps/DiskUtility'))
const SystemInfo = lazy(() => import('../../apps/SystemInfo'))
const News = lazy(() => import('../../apps/News'))
const FontBook = lazy(() => import('../../apps/FontBook'))
const PhotoBooth = lazy(() => import('../../apps/PhotoBooth'))
const VoiceMemos = lazy(() => import('../../apps/VoiceMemos'))
const AppStore = lazy(() => import('../../apps/AppStore'))
const Dictionary = lazy(() => import('../../apps/Dictionary'))
const Shortcuts = lazy(() => import('../../apps/Shortcuts'))

// Loading spinner component
const AppLoadingFallback = () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
        <motion.div
            className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
    </div>
)

const WindowManager = () => {
    const { windows, currentDesktop } = useStore()

    const getComponent = (id) => {
        const componentMap = {
            'finder': Finder,
            'safari': Safari,
            'calculator': Calculator,
            'vscode': VSCode,
            'notes': Notes,
            'settings': Settings,
            'terminal': Terminal,
            'music': Music,
            'messages': Messages,
            'photos': Photos,
            'calendar': Calendar,
            'trash': Trash,
            'weather': Weather,
            'mail': Mail,
            'reminders': Reminders,
            'activity-monitor': ActivityMonitor,
            'preview': Preview,
            'textedit': TextEdit,
            'clock': Clock,
            'stocks': Stocks,
            'maps': Maps,
            'facetime': FaceTime,
            'books': Books,
            'contacts': Contacts,
            'podcasts': Podcasts,
            'disk-utility': DiskUtility,
            'system-info': SystemInfo,
            'news': News,
            'font-book': FontBook,
            'photo-booth': PhotoBooth,
            'voice-memos': VoiceMemos,
            'app-store': AppStore,
            'dictionary': Dictionary,
            'shortcuts': Shortcuts,
        }

        const Component = componentMap[id]
        if (Component) {
            return (
                <Suspense fallback={<AppLoadingFallback />}>
                    <Component />
                </Suspense>
            )
        }
        return <div className="p-4">App not implemented yet</div>
    }

    // 只显示当前桌面的窗口
    const visibleWindows = windows.filter(window =>
        window.isOpen && (window.desktop === currentDesktop || (!window.desktop && currentDesktop === 1))
    )

    return (
        <AnimatePresence>
            {visibleWindows.map((window) => (
                <Window key={window.id} window={window}>
                    {getComponent(window.component)}
                </Window>
            ))}
        </AnimatePresence>
    )
}

export default WindowManager
