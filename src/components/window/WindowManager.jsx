import React from 'react'
import { useStore } from '../../store/useStore'
import Window from './Window'
import Finder from '../../apps/Finder'
import Safari from '../../apps/Safari'
import Calculator from '../../apps/Calculator'

const WindowManager = () => {
    const { windows } = useStore()

    const getComponent = (id) => {
        switch (id) {
            case 'finder': return <Finder />
            case 'safari': return <Safari />
            case 'calculator': return <Calculator />
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
