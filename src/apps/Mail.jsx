import React, { useState } from 'react'
import { useStore } from '../store/useStore'
import {
    FaInbox, FaStar, FaPaperPlane, FaFile, FaTrash, FaArchive,
    FaSearch, FaPen, FaReply, FaReplyAll, FaForward, FaEllipsisH,
    FaChevronDown, FaCircle, FaPaperclip, FaTag
} from 'react-icons/fa'

const Mail = () => {
    const { darkMode, addNotification } = useStore()
    const [selectedFolder, setSelectedFolder] = useState('inbox')
    const [selectedEmail, setSelectedEmail] = useState(null)
    const [showCompose, setShowCompose] = useState(false)
    const [composeData, setComposeData] = useState({ to: '', subject: '', body: '' })

    const [emails, setEmails] = useState({
        inbox: [
            {
                id: 1,
                from: 'Apple',
                email: 'noreply@apple.com',
                subject: 'Your Apple ID was used to sign in to iCloud',
                preview: 'Your Apple ID (user@example.com) was used to sign in to iCloud via a web browser...',
                body: 'Your Apple ID (user@example.com) was used to sign in to iCloud via a web browser.\n\nDate and Time: December 2, 2024 at 10:30 AM PST\nBrowser: Safari\nOperating System: macOS\n\nIf you recently signed in, you can disregard this email. If you did not sign in, please change your password immediately.',
                date: '10:30 AM',
                read: false,
                starred: false,
                hasAttachment: false
            },
            {
                id: 2,
                from: 'GitHub',
                email: 'notifications@github.com',
                subject: '[macOS-mimic] New pull request #42',
                preview: 'A new pull request has been opened by contributor123: "Add dark mode support"...',
                body: 'A new pull request has been opened by contributor123.\n\nPull Request: #42\nTitle: Add dark mode support\n\nChanges:\n- Added dark mode toggle in settings\n- Updated all components to support dark mode\n- Added system preference detection\n\nReview this pull request: https://github.com/example/macos-mimic/pull/42',
                date: '9:15 AM',
                read: true,
                starred: true,
                hasAttachment: false
            },
            {
                id: 3,
                from: 'Sarah Johnson',
                email: 'sarah.johnson@company.com',
                subject: 'Project Update - Q4 Review',
                preview: 'Hi team, I wanted to share the latest updates on our Q4 progress...',
                body: 'Hi team,\n\nI wanted to share the latest updates on our Q4 progress. We\'ve made significant strides in the following areas:\n\n1. User engagement is up 25%\n2. New feature adoption rate exceeded expectations\n3. Customer satisfaction scores improved by 15%\n\nPlease review the attached report and let me know if you have any questions.\n\nBest regards,\nSarah',
                date: 'Yesterday',
                read: true,
                starred: false,
                hasAttachment: true
            },
            {
                id: 4,
                from: 'LinkedIn',
                email: 'notifications@linkedin.com',
                subject: 'You have 5 new connection requests',
                preview: 'John Doe, Jane Smith, and 3 others want to connect with you...',
                body: 'You have 5 new connection requests:\n\n1. John Doe - Software Engineer at Tech Corp\n2. Jane Smith - Product Manager at StartupXYZ\n3. Mike Wilson - UX Designer at Design Studio\n4. Emily Brown - Data Scientist at AI Labs\n5. Chris Lee - Engineering Manager at BigTech\n\nView and accept these requests on LinkedIn.',
                date: 'Yesterday',
                read: false,
                starred: false,
                hasAttachment: false
            },
            {
                id: 5,
                from: 'Newsletter',
                email: 'weekly@techdigest.com',
                subject: 'This Week in Tech: AI Breakthroughs and More',
                preview: 'Your weekly roundup of the biggest tech stories...',
                body: 'This Week in Tech\n\nTop Stories:\n\n1. Major AI breakthrough announced\n2. New smartphone releases\n3. Cloud computing trends for 2025\n4. Cybersecurity best practices\n5. Startup funding roundup\n\nRead the full newsletter at techdigest.com',
                date: 'Dec 1',
                read: true,
                starred: false,
                hasAttachment: false
            }
        ],
        starred: [],
        sent: [
            {
                id: 101,
                from: 'Me',
                to: 'team@company.com',
                email: 'me@example.com',
                subject: 'Re: Project Update - Q4 Review',
                preview: 'Thanks for the update Sarah! The numbers look great...',
                body: 'Thanks for the update Sarah! The numbers look great.\n\nI have a few follow-up questions:\n1. What contributed most to the engagement increase?\n2. Are there any areas we should focus on for Q1?\n\nLooking forward to discussing this in our next meeting.\n\nBest,\nMe',
                date: 'Yesterday',
                read: true,
                starred: false,
                hasAttachment: false
            }
        ],
        drafts: [],
        trash: []
    })

    const folders = [
        { id: 'inbox', name: 'Inbox', icon: FaInbox, count: emails.inbox.filter(e => !e.read).length },
        { id: 'starred', name: 'Starred', icon: FaStar, count: emails.inbox.filter(e => e.starred).length },
        { id: 'sent', name: 'Sent', icon: FaPaperPlane, count: 0 },
        { id: 'drafts', name: 'Drafts', icon: FaFile, count: emails.drafts.length },
        { id: 'archive', name: 'Archive', icon: FaArchive, count: 0 },
        { id: 'trash', name: 'Trash', icon: FaTrash, count: emails.trash.length }
    ]

    const getCurrentEmails = () => {
        if (selectedFolder === 'starred') {
            return emails.inbox.filter(e => e.starred)
        }
        return emails[selectedFolder] || []
    }

    const toggleStar = (emailId) => {
        setEmails(prev => ({
            ...prev,
            inbox: prev.inbox.map(e =>
                e.id === emailId ? { ...e, starred: !e.starred } : e
            )
        }))
    }

    const markAsRead = (emailId) => {
        setEmails(prev => ({
            ...prev,
            inbox: prev.inbox.map(e =>
                e.id === emailId ? { ...e, read: true } : e
            )
        }))
    }

    const deleteEmail = (emailId) => {
        const emailToDelete = emails.inbox.find(e => e.id === emailId) ||
                             emails.sent.find(e => e.id === emailId)
        if (emailToDelete) {
            setEmails(prev => ({
                ...prev,
                inbox: prev.inbox.filter(e => e.id !== emailId),
                sent: prev.sent.filter(e => e.id !== emailId),
                trash: [...prev.trash, emailToDelete]
            }))
            setSelectedEmail(null)
        }
    }

    const sendEmail = () => {
        if (composeData.to && composeData.subject) {
            const newEmail = {
                id: Date.now(),
                from: 'Me',
                to: composeData.to,
                email: 'me@example.com',
                subject: composeData.subject,
                preview: composeData.body.substring(0, 100),
                body: composeData.body,
                date: 'Just now',
                read: true,
                starred: false,
                hasAttachment: false
            }
            setEmails(prev => ({
                ...prev,
                sent: [newEmail, ...prev.sent]
            }))
            setShowCompose(false)
            setComposeData({ to: '', subject: '', body: '' })
            addNotification({
                title: 'Email Sent',
                message: `Your email to ${composeData.to} has been sent.`,
                app: 'Messages'
            })
        }
    }

    const currentEmails = getCurrentEmails()

    return (
        <div className={`w-full h-full flex ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
            {/* Sidebar */}
            <div className={`w-56 border-r flex flex-col ${
                darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'
            }`}>
                {/* Compose button */}
                <div className="p-3">
                    <button
                        onClick={() => setShowCompose(true)}
                        className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        <FaPen className="text-sm" />
                        <span>Compose</span>
                    </button>
                </div>

                {/* Folders */}
                <div className="flex-1 overflow-y-auto px-2">
                    {folders.map(folder => (
                        <div
                            key={folder.id}
                            onClick={() => {
                                setSelectedFolder(folder.id)
                                setSelectedEmail(null)
                            }}
                            className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer mb-1 ${
                                selectedFolder === folder.id
                                    ? darkMode ? 'bg-blue-600' : 'bg-blue-500 text-white'
                                    : darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                            }`}
                        >
                            <folder.icon className="text-sm" />
                            <span className="flex-1">{folder.name}</span>
                            {folder.count > 0 && (
                                <span className={`text-xs px-2 py-0.5 rounded-full ${
                                    selectedFolder === folder.id
                                        ? 'bg-white/20'
                                        : darkMode ? 'bg-gray-600' : 'bg-gray-300'
                                }`}>
                                    {folder.count}
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Email list */}
            <div className={`w-80 border-r flex flex-col ${
                darkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
                {/* Search */}
                <div className={`p-3 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="relative">
                        <FaSearch className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                            darkMode ? 'text-gray-500' : 'text-gray-400'
                        }`} />
                        <input
                            type="text"
                            placeholder="Search mail..."
                            className={`w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none ${
                                darkMode
                                    ? 'bg-gray-700 text-white placeholder-gray-500'
                                    : 'bg-gray-100 text-gray-900 placeholder-gray-500'
                            }`}
                        />
                    </div>
                </div>

                {/* Email list */}
                <div className="flex-1 overflow-y-auto">
                    {currentEmails.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-500">
                            <FaInbox className="text-4xl mb-2" />
                            <p>No emails</p>
                        </div>
                    ) : (
                        currentEmails.map(email => (
                            <div
                                key={email.id}
                                onClick={() => {
                                    setSelectedEmail(email)
                                    markAsRead(email.id)
                                }}
                                className={`p-3 border-b cursor-pointer ${
                                    darkMode ? 'border-gray-700' : 'border-gray-100'
                                } ${
                                    selectedEmail?.id === email.id
                                        ? darkMode ? 'bg-blue-900/30' : 'bg-blue-50'
                                        : darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50'
                                } ${!email.read ? 'font-semibold' : ''}`}
                            >
                                <div className="flex items-start gap-2">
                                    {!email.read && (
                                        <FaCircle className="text-blue-500 text-[8px] mt-2 flex-shrink-0" />
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="truncate">{email.from}</span>
                                            <span className={`text-xs flex-shrink-0 ml-2 ${
                                                darkMode ? 'text-gray-500' : 'text-gray-400'
                                            }`}>
                                                {email.date}
                                            </span>
                                        </div>
                                        <div className="text-sm truncate mb-1">{email.subject}</div>
                                        <div className={`text-xs truncate ${
                                            darkMode ? 'text-gray-500' : 'text-gray-500'
                                        }`}>
                                            {email.preview}
                                        </div>
                                        <div className="flex items-center gap-2 mt-1">
                                            {email.starred && <FaStar className="text-yellow-500 text-xs" />}
                                            {email.hasAttachment && <FaPaperclip className="text-gray-400 text-xs" />}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Email content */}
            <div className="flex-1 flex flex-col">
                {selectedEmail ? (
                    <>
                        {/* Email header */}
                        <div className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                            <div className="flex justify-between items-start mb-4">
                                <h2 className="text-xl font-semibold">{selectedEmail.subject}</h2>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => toggleStar(selectedEmail.id)}
                                        className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
                                            selectedEmail.starred ? 'text-yellow-500' : 'text-gray-400'
                                        }`}
                                    >
                                        <FaStar />
                                    </button>
                                    <button
                                        onClick={() => deleteEmail(selectedEmail.id)}
                                        className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-red-500"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold">
                                    {selectedEmail.from[0]}
                                </div>
                                <div>
                                    <div className="font-medium">{selectedEmail.from}</div>
                                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                        {selectedEmail.email}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Email body */}
                        <div className="flex-1 overflow-y-auto p-4">
                            <div className="whitespace-pre-wrap">{selectedEmail.body}</div>
                        </div>

                        {/* Action buttons */}
                        <div className={`p-4 border-t flex gap-2 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                            <button className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                                darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                            }`}>
                                <FaReply />
                                <span>Reply</span>
                            </button>
                            <button className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                                darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                            }`}>
                                <FaForward />
                                <span>Forward</span>
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                        <FaInbox className="text-6xl mb-4" />
                        <p>Select an email to read</p>
                    </div>
                )}
            </div>

            {/* Compose modal */}
            {showCompose && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className={`w-[600px] rounded-xl shadow-2xl ${
                        darkMode ? 'bg-gray-800' : 'bg-white'
                    }`}>
                        <div className={`flex justify-between items-center p-4 border-b ${
                            darkMode ? 'border-gray-700' : 'border-gray-200'
                        }`}>
                            <h3 className="font-semibold">New Message</h3>
                            <button
                                onClick={() => setShowCompose(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                ×
                            </button>
                        </div>
                        <div className="p-4 space-y-3">
                            <input
                                type="text"
                                placeholder="To"
                                value={composeData.to}
                                onChange={(e) => setComposeData({ ...composeData, to: e.target.value })}
                                className={`w-full p-2 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    darkMode
                                        ? 'bg-gray-700 border-gray-600 text-white'
                                        : 'bg-white border-gray-300'
                                }`}
                            />
                            <input
                                type="text"
                                placeholder="Subject"
                                value={composeData.subject}
                                onChange={(e) => setComposeData({ ...composeData, subject: e.target.value })}
                                className={`w-full p-2 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    darkMode
                                        ? 'bg-gray-700 border-gray-600 text-white'
                                        : 'bg-white border-gray-300'
                                }`}
                            />
                            <textarea
                                placeholder="Write your message..."
                                value={composeData.body}
                                onChange={(e) => setComposeData({ ...composeData, body: e.target.value })}
                                rows={10}
                                className={`w-full p-2 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                                    darkMode
                                        ? 'bg-gray-700 border-gray-600 text-white'
                                        : 'bg-white border-gray-300'
                                }`}
                            />
                        </div>
                        <div className={`flex justify-end gap-2 p-4 border-t ${
                            darkMode ? 'border-gray-700' : 'border-gray-200'
                        }`}>
                            <button
                                onClick={() => setShowCompose(false)}
                                className={`px-4 py-2 rounded-lg ${
                                    darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                                }`}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={sendEmail}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                            >
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Mail
