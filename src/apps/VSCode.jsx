import React from 'react'

const VSCode = () => {
    return (
        <div className="w-full h-full bg-[#1e1e1e] flex flex-col text-white">
            <iframe
                src="https://github1s.com/microsoft/vscode/blob/main/src/vs/code/browser/workbench/workbench.ts"
                title="VS Code"
                className="w-full h-full border-none"
            />
        </div>
    )
}

export default VSCode
