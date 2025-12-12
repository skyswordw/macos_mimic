import React, { useState, useRef, useEffect } from 'react'
import { FaSearch, FaEdit, FaVideo, FaPhone, FaInfo, FaPaperPlane, FaSmile, FaPaperclip, FaMicrophone, FaImage, FaUserCircle } from 'react-icons/fa'
import { useStore } from '../store/useStore'

// Load messages from localStorage
const loadMessages = () => {
    try {
        const saved = localStorage.getItem('messages-data')
        if (saved) return JSON.parse(saved)
    } catch (e) {
        console.error('Failed to load messages:', e)
    }
    return null
}

// Default contacts
const defaultContacts = [
    {
        id: 1,
        name: 'Alex Johnson',
        avatar: 'https://i.pravatar.cc/150?img=1',
        lastMessage: 'Hey! How are you doing?',
        lastTime: '2:30 PM',
        unread: 2,
        online: true
    },
    {
        id: 2,
        name: 'Sarah Williams',
        avatar: 'https://i.pravatar.cc/150?img=2',
        lastMessage: 'The meeting is at 3pm',
        lastTime: '1:15 PM',
        unread: 0,
        online: true
    },
    {
        id: 3,
        name: 'Team Chat',
        avatar: null,
        isGroup: true,
        members: ['John', 'Mike', 'Lisa'],
        lastMessage: 'Mike: Great work everyone!',
        lastTime: '12:45 PM',
        unread: 5,
        online: false
    },
    {
        id: 4,
        name: 'David Chen',
        avatar: 'https://i.pravatar.cc/150?img=3',
        lastMessage: 'Thanks for your help!',
        lastTime: 'Yesterday',
        unread: 0,
        online: false
    },
    {
        id: 5,
        name: 'Emma Davis',
        avatar: 'https://i.pravatar.cc/150?img=4',
        lastMessage: 'See you tomorrow',
        lastTime: 'Yesterday',
        unread: 0,
        online: true
    },
    {
        id: 6,
        name: 'Project Team',
        avatar: null,
        isGroup: true,
        members: ['Anna', 'Tom', 'Sam', 'Kate'],
        lastMessage: 'Anna: Deadline is next week',
        lastTime: 'Monday',
        unread: 0,
        online: false
    }
]

// Default messages
const defaultMessages = {
    1: [
        { id: 1, text: 'Hey! How are you doing?', sent: false, time: '2:28 PM' },
        { id: 2, text: "I'm doing great! Just finished the project", sent: true, time: '2:29 PM' },
        { id: 3, text: 'That sounds awesome!', sent: false, time: '2:30 PM' },
        { id: 4, text: 'Want to grab coffee later?', sent: false, time: '2:30 PM' }
    ],
    2: [
        { id: 1, text: 'Don\'t forget about the meeting', sent: false, time: '1:10 PM' },
        { id: 2, text: 'Thanks for reminding me!', sent: true, time: '1:12 PM' },
        { id: 3, text: 'No problem', sent: false, time: '1:13 PM' },
        { id: 4, text: 'The meeting is at 3pm', sent: false, time: '1:15 PM' }
    ],
    3: [
        { id: 1, text: 'John: Let\'s discuss the new features', sent: false, time: '12:30 PM', sender: 'John' },
        { id: 2, text: 'Sure, I have some ideas', sent: true, time: '12:32 PM' },
        { id: 3, text: 'Lisa: I can help with the design', sent: false, time: '12:35 PM', sender: 'Lisa' },
        { id: 4, text: 'Mike: Great work everyone!', sent: false, time: '12:45 PM', sender: 'Mike' }
    ]
}

const Messages = () => {
    const { darkMode, addNotification } = useStore()

    // Load saved data or use defaults
    const savedData = loadMessages()
    const [contacts, setContacts] = useState(savedData?.contacts || defaultContacts)
    const [messages, setMessages] = useState(savedData?.messages || defaultMessages)

    const [selectedContact, setSelectedContact] = useState(contacts[0])
    const [currentMessages, setCurrentMessages] = useState(messages[1] || [])
    const [newMessage, setNewMessage] = useState('')
    const [searchTerm, setSearchTerm] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const messagesEndRef = useRef(null)
    const inputRef = useRef(null)

    // Save to localStorage when messages or contacts change
    useEffect(() => {
        localStorage.setItem('messages-data', JSON.stringify({ contacts, messages }))
    }, [contacts, messages])

    // 选择联系人
    const selectContact = (contact) => {
        setSelectedContact(contact)
        setCurrentMessages(messages[contact.id] || [])
        // 清除未读标记
        if (contact.unread > 0) {
            setContacts(prev => prev.map(c =>
                c.id === contact.id ? { ...c, unread: 0 } : c
            ))
        }
    }

    // 发送消息
    const sendMessage = () => {
        if (newMessage.trim()) {
            const newMsg = {
                id: Date.now(),
                text: newMessage,
                sent: true,
                time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
            }
            const updatedMessages = [...currentMessages, newMsg]
            setCurrentMessages(updatedMessages)
            setMessages(prev => ({ ...prev, [selectedContact.id]: updatedMessages }))

            // Update contact's last message
            setContacts(prev => prev.map(c =>
                c.id === selectedContact.id
                    ? { ...c, lastMessage: newMessage, lastTime: 'Just now' }
                    : c
            ))

            setNewMessage('')

            // 模拟对方正在输入
            setIsTyping(true)
            setTimeout(() => {
                setIsTyping(false)
                // 模拟自动回复
                const autoReply = {
                    id: Date.now() + 1,
                    text: getAutoReply(newMessage),
                    sent: false,
                    time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
                }
                setCurrentMessages(prev => {
                    const updated = [...prev, autoReply]
                    setMessages(m => ({ ...m, [selectedContact.id]: updated }))
                    return updated
                })

                // Show notification
                addNotification({
                    title: selectedContact.name,
                    message: autoReply.text,
                    app: 'Messages'
                })
            }, 2000)
        }
    }

    // 获取自动回复
    const getAutoReply = (message) => {
        const replies = [
            "That's interesting! Tell me more.",
            "I see what you mean.",
            "Sounds good to me!",
            "Let me think about that.",
            "Thanks for sharing!",
            "I agree with you.",
            "That makes sense."
        ]
        return replies[Math.floor(Math.random() * replies.length)]
    }

    // 滚动到底部
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [currentMessages])

    // 过滤联系人
    const filteredContacts = contacts.filter(contact =>
        contact.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    // 处理键盘事件
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            sendMessage()
        }
    }

    return (
        <div className={`w-full h-full flex transition-colors duration-300 ${
            darkMode ? 'bg-gray-900' : 'bg-white'
        }`}>
            {/* 左侧边栏 - 联系人列表 */}
            <div className={`w-80 border-r flex flex-col transition-colors duration-300 ${
                darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'
            }`}>
                {/* 搜索栏和新建按钮 */}
                <div className={`p-4 border-b transition-colors duration-300 ${
                    darkMode ? 'border-gray-700' : 'border-gray-200'
                }`}>
                    <div className="flex items-center gap-2 mb-3">
                        <div className="flex-1 relative">
                            <FaSearch className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                                darkMode ? 'text-gray-500' : 'text-gray-400'
                            }`} />
                            <input
                                type="text"
                                placeholder="Search"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className={`w-full pl-9 pr-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                                    darkMode
                                        ? 'bg-gray-700 text-white placeholder-gray-400'
                                        : 'bg-gray-100 text-gray-900 placeholder-gray-500'
                                }`}
                            />
                        </div>
                        <button className={`p-2 rounded-lg transition-colors ${
                            darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-200 text-gray-600'
                        }`}>
                            <FaEdit />
                        </button>
                    </div>
                </div>

                {/* 联系人列表 */}
                <div className="flex-1 overflow-y-auto">
                    {filteredContacts.map(contact => (
                        <div
                            key={contact.id}
                            onClick={() => selectContact(contact)}
                            className={`flex items-center gap-3 p-3 cursor-pointer transition-colors ${
                                selectedContact.id === contact.id
                                    ? darkMode
                                        ? 'bg-blue-600/30 border-l-2 border-blue-500'
                                        : 'bg-blue-50 border-l-2 border-blue-500'
                                    : darkMode
                                        ? 'hover:bg-gray-700/50'
                                        : 'hover:bg-gray-100'
                            }`}
                        >
                            {/* 头像 */}
                            <div className="relative">
                                {contact.isGroup ? (
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                                        darkMode ? 'bg-gray-600' : 'bg-gray-300'
                                    }`}>
                                        <FaUserCircle className={`text-2xl ${
                                            darkMode ? 'text-gray-400' : 'text-gray-500'
                                        }`} />
                                    </div>
                                ) : contact.avatar ? (
                                    <img
                                        src={contact.avatar}
                                        alt={contact.name}
                                        className="w-12 h-12 rounded-full object-cover"
                                        onError={(e) => {
                                            e.target.style.display = 'none'
                                            e.target.nextElementSibling.style.display = 'flex'
                                        }}
                                    />
                                ) : null}
                                <div
                                    className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full items-center justify-center text-white font-bold hidden"
                                >
                                    {contact.name.charAt(0)}
                                </div>
                                {contact.online && !contact.isGroup && (
                                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                                )}
                            </div>

                            {/* 联系人信息 */}
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-center">
                                    <div className={`font-medium truncate ${
                                        darkMode ? 'text-white' : 'text-gray-900'
                                    }`}>
                                        {contact.name}
                                        {contact.isGroup && (
                                            <span className={`text-xs ml-1 ${
                                                darkMode ? 'text-gray-400' : 'text-gray-500'
                                            }`}>
                                                ({contact.members.length})
                                            </span>
                                        )}
                                    </div>
                                    <span className={`text-xs ${
                                        darkMode ? 'text-gray-500' : 'text-gray-500'
                                    }`}>{contact.lastTime}</span>
                                </div>
                                <p className={`text-sm truncate ${
                                    darkMode ? 'text-gray-400' : 'text-gray-600'
                                }`}>{contact.lastMessage}</p>
                            </div>

                            {/* 未读标记 */}
                            {contact.unread > 0 && (
                                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                                    <span className="text-xs text-white">{contact.unread}</span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* 右侧 - 聊天窗口 */}
            <div className="flex-1 flex flex-col">
                {/* 聊天头部 */}
                <div className={`h-16 border-b flex items-center justify-between px-6 transition-colors duration-300 ${
                    darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
                }`}>
                    <div className="flex items-center gap-3">
                        {selectedContact.isGroup ? (
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                darkMode ? 'bg-gray-600' : 'bg-gray-300'
                            }`}>
                                <FaUserCircle className={`text-xl ${
                                    darkMode ? 'text-gray-400' : 'text-gray-500'
                                }`} />
                            </div>
                        ) : selectedContact.avatar ? (
                            <img
                                src={selectedContact.avatar}
                                alt={selectedContact.name}
                                className="w-10 h-10 rounded-full object-cover"
                                onError={(e) => {
                                    e.target.style.display = 'none'
                                    e.target.nextElementSibling.style.display = 'flex'
                                }}
                            />
                        ) : null}
                        <div
                            className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full items-center justify-center text-white font-bold hidden"
                        >
                            {selectedContact.name.charAt(0)}
                        </div>
                        <div>
                            <div className={`font-medium ${
                                darkMode ? 'text-white' : 'text-gray-900'
                            }`}>{selectedContact.name}</div>
                            {selectedContact.isGroup ? (
                                <div className={`text-xs ${
                                    darkMode ? 'text-gray-400' : 'text-gray-500'
                                }`}>
                                    {selectedContact.members.join(', ')}
                                </div>
                            ) : (
                                <div className={`text-xs ${
                                    darkMode ? 'text-gray-400' : 'text-gray-500'
                                }`}>
                                    {selectedContact.online ? (
                                        <span className="text-green-500">Active now</span>
                                    ) : (
                                        'Offline'
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className={`p-2 rounded-lg transition-colors ${
                            darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
                        }`}>
                            <FaPhone />
                        </button>
                        <button className={`p-2 rounded-lg transition-colors ${
                            darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
                        }`}>
                            <FaVideo />
                        </button>
                        <button className={`p-2 rounded-lg transition-colors ${
                            darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
                        }`}>
                            <FaInfo />
                        </button>
                    </div>
                </div>

                {/* 消息区域 */}
                <div className={`flex-1 overflow-y-auto p-4 transition-colors duration-300 ${
                    darkMode ? 'bg-gray-900' : 'bg-gray-50'
                }`}>
                    {currentMessages.map(message => (
                        <div
                            key={message.id}
                            className={`flex mb-3 ${message.sent ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`max-w-xs lg:max-w-md ${message.sent ? 'order-2' : ''}`}>
                                {message.sender && !message.sent && (
                                    <div className={`text-xs mb-1 ${
                                        darkMode ? 'text-gray-400' : 'text-gray-500'
                                    }`}>{message.sender}</div>
                                )}
                                <div
                                    className={`px-4 py-2 rounded-2xl ${
                                        message.sent
                                            ? 'bg-blue-500 text-white'
                                            : darkMode
                                                ? 'bg-gray-700 text-white'
                                                : 'bg-white text-gray-900 shadow-sm'
                                    }`}
                                >
                                    <p className="text-sm">{message.text}</p>
                                </div>
                                <div
                                    className={`text-xs mt-1 ${
                                        message.sent ? 'text-right' : ''
                                    } ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}
                                >
                                    {message.time}
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* 正在输入提示 */}
                    {isTyping && (
                        <div className={`flex items-center gap-2 text-sm ${
                            darkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                            <div className="flex gap-1">
                                <div className={`w-2 h-2 rounded-full animate-bounce ${
                                    darkMode ? 'bg-gray-500' : 'bg-gray-400'
                                }`} />
                                <div className={`w-2 h-2 rounded-full animate-bounce ${
                                    darkMode ? 'bg-gray-500' : 'bg-gray-400'
                                }`} style={{ animationDelay: '0.1s' }} />
                                <div className={`w-2 h-2 rounded-full animate-bounce ${
                                    darkMode ? 'bg-gray-500' : 'bg-gray-400'
                                }`} style={{ animationDelay: '0.2s' }} />
                            </div>
                            <span>{selectedContact.name} is typing...</span>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* 输入区域 */}
                <div className={`h-20 border-t px-6 py-3 transition-colors duration-300 ${
                    darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
                }`}>
                    <div className="flex items-end gap-3">
                        <button className={`p-2 rounded-lg transition-colors ${
                            darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
                        }`}>
                            <FaPaperclip />
                        </button>
                        <button className={`p-2 rounded-lg transition-colors ${
                            darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
                        }`}>
                            <FaImage />
                        </button>
                        <div className="flex-1">
                            <textarea
                                ref={inputRef}
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Type a message..."
                                className={`w-full px-4 py-2 rounded-full resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                                    darkMode
                                        ? 'bg-gray-700 text-white placeholder-gray-400'
                                        : 'bg-gray-100 text-gray-900 placeholder-gray-500'
                                }`}
                                rows="1"
                            />
                        </div>
                        <button className={`p-2 rounded-lg transition-colors ${
                            darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
                        }`}>
                            <FaSmile />
                        </button>
                        {newMessage.trim() ? (
                            <button
                                onClick={sendMessage}
                                className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                            >
                                <FaPaperPlane />
                            </button>
                        ) : (
                            <button className={`p-2 rounded-lg transition-colors ${
                                darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
                            }`}>
                                <FaMicrophone />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Messages