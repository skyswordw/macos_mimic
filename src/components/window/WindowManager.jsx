import React from 'react'
import { useStore } from '../../store/useStore'
import Window from './Window'
import Finder from '../../apps/Finder'
import Safari from '../../apps/Safari'
import Calculator from '../../apps/Calculator'
import VSCode from '../../apps/VSCode'
import Notes from '../../apps/Notes'
import Settings from '../../apps/Settings'
import Terminal from '../../apps/Terminal'

const WindowManager = () => {
    const { windows } = useStore()

    const getComponent = (id) => {
        switch (id) {
            case 'finder': return <Finder />
            case 'safari': return <Safari />
            case 'calculator': return <Calculator />
            case 'vscode': return <VSCode />
            case 'notes': return <Notes />
            case 'settings': return <Settings />
            case 'terminal': return <Terminal /> // Note: Dock ID is 'terminal' but I used 'vscode' in Dock.jsx for VS Code. Let's check Dock.jsx IDs.
            default: return <div className="p-4">App not implemented yet</div>
        }
    }

    return (
        <>
            {windows.map((window) => (
                window.isOpen && (
                    <Window key={window.id} window={window}>
                        {getComponent(window.component)}
                    </Window>
                )
            ))}
        </>
    )
}

export default WindowManager
