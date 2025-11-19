import React, { useState, useEffect } from 'react'
import { FaRegEdit, FaTrash } from 'react-icons/fa'

const Notes = () => {
    const [notes, setNotes] = useState(() => {
        const saved = localStorage.getItem('mac-notes')
        return saved ? JSON.parse(saved) : [{ id: 1, text: 'Welcome to Notes!', date: new Date().toLocaleDateString() }]
    })
    const [activeNoteId, setActiveNoteId] = useState(notes[0]?.id)

    useEffect(() => {
        localStorage.setItem('mac-notes', JSON.stringify(notes))
    }, [notes])

    const addNote = () => {
        const newNote = { id: Date.now(), text: 'New Note', date: new Date().toLocaleDateString() }
        setNotes([newNote, ...notes])
        setActiveNoteId(newNote.id)
    }

    const deleteNote = (id) => {
        const newNotes = notes.filter(n => n.id !== id)
        setNotes(newNotes)
        if (activeNoteId === id && newNotes.length > 0) {
            setActiveNoteId(newNotes[0].id)
        }
    }

    const updateNote = (text) => {
        setNotes(notes.map(n => n.id === activeNoteId ? { ...n, text } : n))
    }

    const activeNote = notes.find(n => n.id === activeNoteId)

    return (
        <div className="w-full h-full flex bg-white">
            {/* Sidebar */}
            <div className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col">
                <div className="h-12 flex items-center justify-center border-b border-gray-200 font-bold text-gray-600">
                    Notes
                </div>
                <div className="flex-1 overflow-y-auto">
                    {notes.map(note => (
                        <div
                            key={note.id}
                            onClick={() => setActiveNoteId(note.id)}
                            className={`p-4 border-b border-gray-100 cursor-pointer ${activeNoteId === note.id ? 'bg-yellow-100' : 'hover:bg-gray-100'}`}
                        >
                            <div className="font-bold text-gray-800 truncate">{note.text.split('\n')[0] || 'New Note'}</div>
                            <div className="text-xs text-gray-500 mt-1">{note.date}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Editor */}
            <div className="flex-1 flex flex-col">
                <div className="h-12 border-b border-gray-200 flex items-center justify-between px-4 bg-white">
                    <div className="text-xs text-gray-400">
                        {activeNote ? activeNote.date : ''}
                    </div>
                    <div className="flex gap-4 text-gray-500">
                        <FaTrash className="cursor-pointer hover:text-red-500" onClick={() => activeNote && deleteNote(activeNote.id)} />
                        <FaRegEdit className="cursor-pointer hover:text-gray-800" onClick={addNote} />
                    </div>
                </div>
                {activeNote ? (
                    <textarea
                        className="flex-1 p-8 resize-none outline-none text-lg text-gray-700"
                        value={activeNote.text}
                        onChange={(e) => updateNote(e.target.value)}
                        placeholder="Type something..."
                    />
                ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-400">
                        No note selected
                    </div>
                )}
            </div>
        </div>
    )
}

export default Notes
