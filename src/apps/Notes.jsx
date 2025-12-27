import React, { useState, useEffect, useCallback } from 'react'
import { FaRegEdit, FaTrash, FaGripVertical, FaFile, FaImage } from 'react-icons/fa'
import { useStore } from '../store/useStore'
import { useDragDrop, useDropTarget } from '../context/DragDropContext'

const Notes = () => {
    const { darkMode } = useStore()
    const [notes, setNotes] = useState(() => {
        const saved = localStorage.getItem('mac-notes')
        return saved ? JSON.parse(saved) : [{ id: 1, text: 'Welcome to Notes!', date: new Date().toLocaleDateString() }]
    })
    const [activeNoteId, setActiveNoteId] = useState(notes[0]?.id)
    const { startDrag, updateDragPosition, executeDrop } = useDragDrop()

    useEffect(() => {
        localStorage.setItem('mac-notes', JSON.stringify(notes))
    }, [notes])

    // Handle drop - accept files and photos
    const handleDrop = useCallback((data) => {
        if (data.type === 'finder-file' || data.type === 'file') {
            // Create a new note from file
            const newNote = {
                id: Date.now(),
                text: `📎 File: ${data.name}\n\nFile dropped from Finder.\nType: ${data.fileType || 'Unknown'}\nSize: ${data.size || 'Unknown'}`,
                date: new Date().toLocaleDateString()
            }
            setNotes(prev => [newNote, ...prev])
            setActiveNoteId(newNote.id)
        } else if (data.type === 'photo') {
            // Create a note with photo reference
            const newNote = {
                id: Date.now(),
                text: `📷 Photo: ${data.name}\n\n[Image attached from Photos app]`,
                date: new Date().toLocaleDateString()
            }
            setNotes(prev => [newNote, ...prev])
            setActiveNoteId(newNote.id)
        }
    }, [])

    const { ref: dropRef, isOver } = useDropTarget('notes-main', handleDrop, ['finder-file', 'file', 'photo'])

    // Handle dragging a note
    const handleNoteDragStart = useCallback((note, e) => {
        e.preventDefault()
        e.stopPropagation()
        const position = { x: e.clientX, y: e.clientY }
        startDrag({
            id: `note-${note.id}`,
            type: 'note',
            name: note.text.split('\n')[0] || 'Note',
            content: note.text,
            date: note.date
        }, position)

        const handleMouseMove = (moveEvent) => {
            updateDragPosition({ x: moveEvent.clientX, y: moveEvent.clientY })
        }

        const handleMouseUp = () => {
            executeDrop()
            document.removeEventListener('mousemove', handleMouseMove)
            document.removeEventListener('mouseup', handleMouseUp)
        }

        document.addEventListener('mousemove', handleMouseMove)
        document.addEventListener('mouseup', handleMouseUp)
    }, [startDrag, updateDragPosition, executeDrop])

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
        <div ref={dropRef} className={`w-full h-full flex transition-colors duration-300 ${
            darkMode ? 'bg-gray-900' : 'bg-white'
        } ${isOver ? 'ring-4 ring-yellow-400 ring-inset' : ''}`}>
            {/* Sidebar */}
            <div className={`w-64 border-r flex flex-col transition-colors duration-300 ${
                darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
            }`}>
                <div className={`h-12 flex items-center justify-center border-b font-bold transition-colors duration-300 ${
                    darkMode ? 'border-gray-700 text-gray-300' : 'border-gray-200 text-gray-600'
                }`}>
                    Notes
                </div>
                <div className="flex-1 overflow-y-auto">
                    {notes.map(note => (
                        <div
                            key={note.id}
                            onClick={() => setActiveNoteId(note.id)}
                            className={`p-4 border-b cursor-pointer relative group transition-colors duration-300 ${
                                activeNoteId === note.id
                                    ? darkMode ? 'bg-yellow-700/30' : 'bg-yellow-100'
                                    : darkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-100 hover:bg-gray-100'
                            }`}
                        >
                            {/* Drag handle */}
                            <div
                                onMouseDown={(e) => handleNoteDragStart(note, e)}
                                className={`absolute top-2 left-1 p-1 rounded opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing transition-opacity ${
                                    darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'
                                }`}
                                title="Drag to export"
                            >
                                <FaGripVertical className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
                            </div>
                            <div className={`font-bold truncate ml-4 transition-colors duration-300 ${
                                darkMode ? 'text-gray-200' : 'text-gray-800'
                            }`}>{note.text.split('\n')[0] || 'New Note'}</div>
                            <div className={`text-xs mt-1 ml-4 transition-colors duration-300 ${
                                darkMode ? 'text-gray-500' : 'text-gray-500'
                            }`}>{note.date}</div>
                        </div>
                    ))}
                </div>

                {/* Drop zone indicator */}
                {isOver && (
                    <div className={`p-4 text-center text-sm ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>
                        <FaFile className="inline mr-2" />
                        Drop to create note
                    </div>
                )}
            </div>

            {/* Editor */}
            <div className="flex-1 flex flex-col">
                <div className={`h-12 border-b flex items-center justify-between px-4 transition-colors duration-300 ${
                    darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                }`}>
                    <div className={`text-xs transition-colors duration-300 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        {activeNote ? activeNote.date : ''}
                    </div>
                    <div className={`flex gap-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        <FaTrash className="cursor-pointer hover:text-red-500" onClick={() => activeNote && deleteNote(activeNote.id)} />
                        <FaRegEdit className={`cursor-pointer ${darkMode ? 'hover:text-gray-200' : 'hover:text-gray-800'}`} onClick={addNote} />
                    </div>
                </div>
                {activeNote ? (
                    <textarea
                        className={`flex-1 p-8 resize-none outline-none text-lg transition-colors duration-300 ${
                            darkMode ? 'bg-gray-900 text-gray-200' : 'bg-white text-gray-700'
                        }`}
                        value={activeNote.text}
                        onChange={(e) => updateNote(e.target.value)}
                        placeholder="Type something..."
                    />
                ) : (
                    <div className={`flex-1 flex items-center justify-center transition-colors duration-300 ${
                        darkMode ? 'text-gray-600' : 'text-gray-400'
                    }`}>
                        No note selected
                    </div>
                )}
            </div>
        </div>
    )
}

export default Notes
