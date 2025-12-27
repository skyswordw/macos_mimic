import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../store/useStore'
import { FaSearch, FaPlus, FaPhone, FaEnvelope, FaMapMarkerAlt, FaBirthdayCake, FaEdit, FaTrash, FaTimes, FaUser, FaStar, FaBuilding, FaGlobe, FaLinkedin, FaTwitter } from 'react-icons/fa'

const initialContacts = [
    { id: 1, firstName: 'John', lastName: 'Appleseed', company: 'Apple Inc.', phone: '+1 (555) 123-4567', email: 'john@apple.com', address: '1 Infinite Loop, Cupertino, CA', birthday: '1985-06-24', avatar: '👨‍💼', favorite: true, notes: 'Met at WWDC 2023' },
    { id: 2, firstName: 'Jane', lastName: 'Smith', company: 'Google', phone: '+1 (555) 987-6543', email: 'jane@google.com', address: '1600 Amphitheatre Parkway', birthday: '1990-03-15', avatar: '👩‍💻', favorite: true, notes: '' },
    { id: 3, firstName: 'Bob', lastName: 'Johnson', company: 'Microsoft', phone: '+1 (555) 456-7890', email: 'bob@microsoft.com', address: 'One Microsoft Way, Redmond, WA', birthday: '1982-11-08', avatar: '👨‍🔬', favorite: false, notes: '' },
    { id: 4, firstName: 'Alice', lastName: 'Brown', company: 'Meta', phone: '+1 (555) 321-0987', email: 'alice@meta.com', address: '1 Hacker Way, Menlo Park, CA', birthday: '1995-07-22', avatar: '👩‍🎨', favorite: false, notes: '' },
    { id: 5, firstName: 'Charlie', lastName: 'Wilson', company: 'Amazon', phone: '+1 (555) 654-3210', email: 'charlie@amazon.com', address: '410 Terry Ave N, Seattle, WA', birthday: '1988-09-30', avatar: '🧑‍💼', favorite: true, notes: '' },
]

const Contacts = () => {
    const { darkMode, openWindow } = useStore()
    const [contacts, setContacts] = useState(initialContacts)
    const [selectedContact, setSelectedContact] = useState(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [isEditing, setIsEditing] = useState(false)
    const [showNewContact, setShowNewContact] = useState(false)
    const [editForm, setEditForm] = useState({})

    const filteredContacts = contacts.filter(c =>
        `${c.firstName} ${c.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const groupedContacts = filteredContacts.reduce((acc, contact) => {
        const letter = contact.lastName[0].toUpperCase()
        if (!acc[letter]) acc[letter] = []
        acc[letter].push(contact)
        return acc
    }, {})

    const handleSave = () => {
        if (showNewContact) {
            setContacts(prev => [...prev, { ...editForm, id: Date.now(), avatar: '👤' }])
        } else {
            setContacts(prev => prev.map(c => c.id === selectedContact.id ? { ...c, ...editForm } : c))
            setSelectedContact({ ...selectedContact, ...editForm })
        }
        setIsEditing(false)
        setShowNewContact(false)
    }

    const handleDelete = () => {
        setContacts(prev => prev.filter(c => c.id !== selectedContact.id))
        setSelectedContact(null)
    }

    const toggleFavorite = (id) => {
        setContacts(prev => prev.map(c => c.id === id ? { ...c, favorite: !c.favorite } : c))
        if (selectedContact?.id === id) {
            setSelectedContact(prev => ({ ...prev, favorite: !prev.favorite }))
        }
    }

    return (
        <div className={`h-full flex ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
            {/* Sidebar */}
            <div className={`w-72 border-r flex flex-col ${darkMode ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-gray-50'}`}>
                <div className="p-3">
                    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-white border border-gray-200'}`}>
                        <FaSearch className="text-gray-400" />
                        <input type="text" placeholder="Search" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                            className="bg-transparent flex-1 outline-none text-sm" />
                    </div>
                </div>

                <div className="flex-1 overflow-auto">
                    {/* Favorites */}
                    {contacts.filter(c => c.favorite).length > 0 && !searchQuery && (
                        <div className="mb-2">
                            <div className="px-4 py-1 text-xs font-semibold text-gray-500 uppercase">Favorites</div>
                            {contacts.filter(c => c.favorite).map(contact => (
                                <button key={contact.id} onClick={() => { setSelectedContact(contact); setIsEditing(false) }}
                                    className={`w-full px-4 py-2 flex items-center gap-3 text-left ${selectedContact?.id === contact.id ? (darkMode ? 'bg-blue-600' : 'bg-blue-500 text-white') : (darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100')}`}>
                                    <span className="text-xl">{contact.avatar}</span>
                                    <span className="font-medium">{contact.firstName} {contact.lastName}</span>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* All Contacts */}
                    {Object.keys(groupedContacts).sort().map(letter => (
                        <div key={letter}>
                            <div className={`px-4 py-1 text-xs font-bold sticky top-0 ${darkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'}`}>{letter}</div>
                            {groupedContacts[letter].map(contact => (
                                <button key={contact.id} onClick={() => { setSelectedContact(contact); setIsEditing(false) }}
                                    className={`w-full px-4 py-2 flex items-center gap-3 text-left ${selectedContact?.id === contact.id ? (darkMode ? 'bg-blue-600' : 'bg-blue-500 text-white') : (darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100')}`}>
                                    <span className="text-xl">{contact.avatar}</span>
                                    <span>{contact.firstName} {contact.lastName}</span>
                                </button>
                            ))}
                        </div>
                    ))}
                </div>

                <div className={`p-3 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <button onClick={() => { setShowNewContact(true); setEditForm({ firstName: '', lastName: '', company: '', phone: '', email: '', address: '', birthday: '', notes: '' }); setIsEditing(true) }}
                        className="w-full py-2 bg-blue-500 text-white rounded-lg flex items-center justify-center gap-2">
                        <FaPlus /> Add Contact
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto">
                {selectedContact || showNewContact ? (
                    <div className="p-6 max-w-2xl mx-auto">
                        {isEditing ? (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-bold">{showNewContact ? 'New Contact' : 'Edit Contact'}</h2>
                                    <div className="flex gap-2">
                                        <button onClick={() => { setIsEditing(false); setShowNewContact(false) }} className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700">Cancel</button>
                                        <button onClick={handleSave} className="px-4 py-2 rounded-lg bg-blue-500 text-white">Save</button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div><label className="text-sm text-gray-500">First Name</label><input type="text" value={editForm.firstName || ''} onChange={e => setEditForm(f => ({ ...f, firstName: e.target.value }))} className={`w-full mt-1 px-3 py-2 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`} /></div>
                                    <div><label className="text-sm text-gray-500">Last Name</label><input type="text" value={editForm.lastName || ''} onChange={e => setEditForm(f => ({ ...f, lastName: e.target.value }))} className={`w-full mt-1 px-3 py-2 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`} /></div>
                                </div>
                                <div><label className="text-sm text-gray-500">Company</label><input type="text" value={editForm.company || ''} onChange={e => setEditForm(f => ({ ...f, company: e.target.value }))} className={`w-full mt-1 px-3 py-2 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`} /></div>
                                <div><label className="text-sm text-gray-500">Phone</label><input type="tel" value={editForm.phone || ''} onChange={e => setEditForm(f => ({ ...f, phone: e.target.value }))} className={`w-full mt-1 px-3 py-2 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`} /></div>
                                <div><label className="text-sm text-gray-500">Email</label><input type="email" value={editForm.email || ''} onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))} className={`w-full mt-1 px-3 py-2 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`} /></div>
                                <div><label className="text-sm text-gray-500">Address</label><input type="text" value={editForm.address || ''} onChange={e => setEditForm(f => ({ ...f, address: e.target.value }))} className={`w-full mt-1 px-3 py-2 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`} /></div>
                                <div><label className="text-sm text-gray-500">Birthday</label><input type="date" value={editForm.birthday || ''} onChange={e => setEditForm(f => ({ ...f, birthday: e.target.value }))} className={`w-full mt-1 px-3 py-2 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`} /></div>
                                <div><label className="text-sm text-gray-500">Notes</label><textarea value={editForm.notes || ''} onChange={e => setEditForm(f => ({ ...f, notes: e.target.value }))} rows={3} className={`w-full mt-1 px-3 py-2 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`} /></div>
                            </motion.div>
                        ) : (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <div className="text-center mb-6">
                                    <div className="text-7xl mb-3">{selectedContact.avatar}</div>
                                    <h1 className="text-2xl font-bold">{selectedContact.firstName} {selectedContact.lastName}</h1>
                                    {selectedContact.company && <div className="text-gray-500">{selectedContact.company}</div>}
                                </div>

                                <div className="flex justify-center gap-3 mb-6">
                                    <button className="px-4 py-2 bg-green-500 text-white rounded-full flex items-center gap-2"><FaPhone /> Call</button>
                                    <button onClick={() => openWindow('mail', 'Mail', 'mail')} className="px-4 py-2 bg-blue-500 text-white rounded-full flex items-center gap-2"><FaEnvelope /> Email</button>
                                    <button onClick={() => toggleFavorite(selectedContact.id)} className={`px-4 py-2 rounded-full flex items-center gap-2 ${selectedContact.favorite ? 'bg-yellow-500 text-white' : (darkMode ? 'bg-gray-700' : 'bg-gray-200')}`}><FaStar /></button>
                                </div>

                                <div className={`rounded-xl overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                                    {selectedContact.phone && (
                                        <div className={`px-4 py-3 flex items-center gap-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                                            <FaPhone className="text-gray-500" />
                                            <div><div className="text-xs text-gray-500">phone</div><div>{selectedContact.phone}</div></div>
                                        </div>
                                    )}
                                    {selectedContact.email && (
                                        <div className={`px-4 py-3 flex items-center gap-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                                            <FaEnvelope className="text-gray-500" />
                                            <div><div className="text-xs text-gray-500">email</div><div className="text-blue-500">{selectedContact.email}</div></div>
                                        </div>
                                    )}
                                    {selectedContact.address && (
                                        <div className={`px-4 py-3 flex items-center gap-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                                            <FaMapMarkerAlt className="text-gray-500" />
                                            <div><div className="text-xs text-gray-500">address</div><div>{selectedContact.address}</div></div>
                                        </div>
                                    )}
                                    {selectedContact.birthday && (
                                        <div className="px-4 py-3 flex items-center gap-4">
                                            <FaBirthdayCake className="text-gray-500" />
                                            <div><div className="text-xs text-gray-500">birthday</div><div>{new Date(selectedContact.birthday).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</div></div>
                                        </div>
                                    )}
                                </div>

                                {selectedContact.notes && (
                                    <div className={`mt-4 p-4 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                                        <div className="text-xs text-gray-500 mb-1">Notes</div>
                                        <div>{selectedContact.notes}</div>
                                    </div>
                                )}

                                <div className="flex justify-center gap-3 mt-6">
                                    <button onClick={() => { setIsEditing(true); setEditForm(selectedContact) }} className={`px-4 py-2 rounded-lg flex items-center gap-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}><FaEdit /> Edit</button>
                                    <button onClick={handleDelete} className="px-4 py-2 rounded-lg bg-red-500 text-white flex items-center gap-2"><FaTrash /> Delete</button>
                                </div>
                            </motion.div>
                        )}
                    </div>
                ) : (
                    <div className="h-full flex items-center justify-center text-gray-500">
                        <div className="text-center">
                            <FaUser className="text-6xl mx-auto mb-4 opacity-20" />
                            <p>Select a contact to view details</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Contacts
