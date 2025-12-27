import { useState } from 'react'
import Desktop from './components/layout/Desktop'
import BootSequence from './components/system/BootSequence'
import { useStore } from './store/useStore'
import { DragDropProvider } from './context/DragDropContext'

function App() {
    const { isLogin } = useStore()

    return (
        <DragDropProvider>
            <div className="w-screen h-screen overflow-hidden">
                {isLogin ? <Desktop /> : <BootSequence />}
            </div>
        </DragDropProvider>
    )
}

export default App
