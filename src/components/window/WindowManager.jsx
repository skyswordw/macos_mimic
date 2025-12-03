import React from 'react'
import { useStore } from '../../store/useStore'
import { AnimatePresence } from 'framer-motion'
import Window from './Window'
import Finder from '../../apps/Finder'
import Safari from '../../apps/Safari'
import Calculator from '../../apps/Calculator'
import VSCode from '../../apps/VSCode'
import Notes from '../../apps/Notes'
import Settings from '../../apps/Settings'
import Terminal from '../../apps/Terminal'
import Music from '../../apps/Music'
import Messages from '../../apps/Messages'
import Photos from '../../apps/Photos'
import Calendar from '../../apps/Calendar'
import Trash from '../../apps/Trash'
import Weather from '../../apps/Weather'
import Mail from '../../apps/Mail'
import Reminders from '../../apps/Reminders'
import ActivityMonitor from '../../apps/ActivityMonitor'
import Preview from '../../apps/Preview'

const WindowManager = () => {
    const { windows, currentDesktop } = useStore()

    const getComponent = (id) => {
        switch (id) {
            case 'finder': return <Finder />
            case 'safari': return <Safari />
            case 'calculator': return <Calculator />
            case 'vscode': return <VSCode />
            case 'notes': return <Notes />
            case 'settings': return <Settings />
            case 'terminal': return <Terminal />
            case 'music': return <Music />
            case 'messages': return <Messages />
            case 'photos': return <Photos />
            case 'calendar': return <Calendar />
            case 'trash': return <Trash />
            case 'weather': return <Weather />
            case 'mail': return <Mail />
            case 'reminders': return <Reminders />
            case 'activity-monitor': return <ActivityMonitor />
            case 'preview': return <Preview />
            default: return <div className="p-4">App not implemented yet</div>
        }
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
