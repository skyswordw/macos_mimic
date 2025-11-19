import { useState } from 'react'
import Desktop from './components/layout/Desktop'
import BootSequence from './components/system/BootSequence'
import { useStore } from './store/useStore'

function App() {
    const { isLogin } = useStore()

    return (
        <div className="w-screen h-screen overflow-hidden">
            {isLogin ? <Desktop /> : <BootSequence />}
        </div>
    )
}

export default App
