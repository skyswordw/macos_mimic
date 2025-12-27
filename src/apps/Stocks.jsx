import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../store/useStore'
import { FaSearch, FaPlus, FaChartLine, FaCaretUp, FaCaretDown, FaTimes, FaNewspaper, FaStar } from 'react-icons/fa'

const generateStockData = (basePrice, volatility = 0.02) => {
    const data = []
    let price = basePrice
    for (let i = 0; i < 30; i++) {
        price = price * (1 + (Math.random() - 0.5) * volatility)
        data.push({ day: i, price: price.toFixed(2) })
    }
    return data
}

const initialStocks = [
    { symbol: 'AAPL', name: 'Apple Inc.', price: 178.52, change: 2.34, changePercent: 1.33, data: generateStockData(178) },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 141.80, change: -1.25, changePercent: -0.87, data: generateStockData(141) },
    { symbol: 'MSFT', name: 'Microsoft Corp.', price: 378.91, change: 4.56, changePercent: 1.22, data: generateStockData(378) },
    { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 178.25, change: 3.12, changePercent: 1.78, data: generateStockData(178) },
    { symbol: 'TSLA', name: 'Tesla Inc.', price: 248.50, change: -5.80, changePercent: -2.28, data: generateStockData(248) },
    { symbol: 'META', name: 'Meta Platforms', price: 505.75, change: 8.25, changePercent: 1.66, data: generateStockData(505) },
    { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 495.22, change: 12.45, changePercent: 2.58, data: generateStockData(495) },
]

const MiniChart = ({ data, positive, darkMode }) => {
    const max = Math.max(...data.map(d => parseFloat(d.price)))
    const min = Math.min(...data.map(d => parseFloat(d.price)))
    const range = max - min
    const points = data.map((d, i) => `${(i / (data.length - 1)) * 100},${100 - ((parseFloat(d.price) - min) / range) * 100}`).join(' ')

    return (
        <svg viewBox="0 0 100 100" className="w-20 h-10" preserveAspectRatio="none">
            <polyline fill="none" stroke={positive ? '#22c55e' : '#ef4444'} strokeWidth="2" points={points} />
        </svg>
    )
}

const Stocks = () => {
    const { darkMode } = useStore()
    const [stocks, setStocks] = useState(initialStocks)
    const [selectedStock, setSelectedStock] = useState(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [showSearch, setShowSearch] = useState(false)
    const [timeRange, setTimeRange] = useState('1M')
    const [watchlist, setWatchlist] = useState(['AAPL', 'GOOGL', 'MSFT'])

    useEffect(() => {
        const interval = setInterval(() => {
            setStocks(prev => prev.map(stock => {
                const change = (Math.random() - 0.5) * 2
                const newPrice = stock.price + change
                return { ...stock, price: parseFloat(newPrice.toFixed(2)), change: parseFloat(change.toFixed(2)), changePercent: parseFloat(((change / stock.price) * 100).toFixed(2)) }
            }))
        }, 5000)
        return () => clearInterval(interval)
    }, [])

    const filteredStocks = stocks.filter(s => s.symbol.toLowerCase().includes(searchQuery.toLowerCase()) || s.name.toLowerCase().includes(searchQuery.toLowerCase()))
    const watchlistStocks = stocks.filter(s => watchlist.includes(s.symbol))

    const toggleWatchlist = (symbol) => {
        setWatchlist(prev => prev.includes(symbol) ? prev.filter(s => s !== symbol) : [...prev, symbol])
    }

    const news = [
        { title: 'Tech stocks rally on AI optimism', time: '2h ago', source: 'Reuters' },
        { title: 'Fed signals potential rate cuts in 2025', time: '4h ago', source: 'Bloomberg' },
        { title: 'Apple announces new product lineup', time: '6h ago', source: 'CNBC' },
    ]

    return (
        <div className={`h-full flex ${darkMode ? 'bg-black text-white' : 'bg-gray-100 text-gray-900'}`}>
            {/* Sidebar */}
            <div className={`w-80 border-r flex flex-col ${darkMode ? 'border-gray-800 bg-gray-900/50' : 'border-gray-200 bg-white'}`}>
                <div className="p-4">
                    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                        <FaSearch className="text-gray-500" />
                        <input type="text" placeholder="Search stocks" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                            className={`bg-transparent flex-1 outline-none text-sm ${darkMode ? 'placeholder-gray-500' : 'placeholder-gray-400'}`} />
                    </div>
                </div>

                <div className="flex-1 overflow-auto">
                    <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">My Watchlist</div>
                    {watchlistStocks.map(stock => (
                        <motion.div key={stock.symbol} whileHover={{ backgroundColor: darkMode ? 'rgba(55,65,81,0.5)' : 'rgba(243,244,246,1)' }}
                            onClick={() => setSelectedStock(stock)} className={`px-4 py-3 cursor-pointer flex items-center justify-between ${selectedStock?.symbol === stock.symbol ? (darkMode ? 'bg-gray-800' : 'bg-blue-50') : ''}`}>
                            <div>
                                <div className="font-semibold">{stock.symbol}</div>
                                <div className="text-xs text-gray-500 truncate w-32">{stock.name}</div>
                            </div>
                            <div className="text-right">
                                <div className="font-medium">${stock.price.toFixed(2)}</div>
                                <div className={`text-xs flex items-center justify-end gap-1 ${stock.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                    {stock.change >= 0 ? <FaCaretUp /> : <FaCaretDown />}
                                    {Math.abs(stock.changePercent).toFixed(2)}%
                                </div>
                            </div>
                        </motion.div>
                    ))}

                    <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase mt-4">All Stocks</div>
                    {filteredStocks.filter(s => !watchlist.includes(s.symbol)).map(stock => (
                        <motion.div key={stock.symbol} whileHover={{ backgroundColor: darkMode ? 'rgba(55,65,81,0.5)' : 'rgba(243,244,246,1)' }}
                            onClick={() => setSelectedStock(stock)} className={`px-4 py-3 cursor-pointer flex items-center justify-between`}>
                            <div>
                                <div className="font-semibold">{stock.symbol}</div>
                                <div className="text-xs text-gray-500 truncate w-32">{stock.name}</div>
                            </div>
                            <div className="text-right">
                                <div className="font-medium">${stock.price.toFixed(2)}</div>
                                <div className={`text-xs flex items-center justify-end gap-1 ${stock.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                    {stock.change >= 0 ? <FaCaretUp /> : <FaCaretDown />}
                                    {Math.abs(stock.changePercent).toFixed(2)}%
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {selectedStock ? (
                    <div className="flex-1 p-6 overflow-auto">
                        <div className="flex items-start justify-between mb-6">
                            <div>
                                <div className="flex items-center gap-3">
                                    <h1 className="text-3xl font-bold">{selectedStock.symbol}</h1>
                                    <button onClick={() => toggleWatchlist(selectedStock.symbol)} className={`p-2 rounded-full ${watchlist.includes(selectedStock.symbol) ? 'text-yellow-500' : 'text-gray-400'}`}>
                                        <FaStar />
                                    </button>
                                </div>
                                <div className="text-gray-500">{selectedStock.name}</div>
                            </div>
                            <div className="text-right">
                                <div className="text-4xl font-bold">${selectedStock.price.toFixed(2)}</div>
                                <div className={`text-lg flex items-center justify-end gap-1 ${selectedStock.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                    {selectedStock.change >= 0 ? <FaCaretUp /> : <FaCaretDown />}
                                    ${Math.abs(selectedStock.change).toFixed(2)} ({Math.abs(selectedStock.changePercent).toFixed(2)}%)
                                </div>
                            </div>
                        </div>

                        {/* Chart */}
                        <div className={`rounded-xl p-4 mb-6 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
                            <div className="flex gap-2 mb-4">
                                {['1D', '1W', '1M', '3M', '1Y', 'ALL'].map(range => (
                                    <button key={range} onClick={() => setTimeRange(range)}
                                        className={`px-3 py-1 rounded-full text-sm ${timeRange === range ? 'bg-blue-500 text-white' : darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>{range}</button>
                                ))}
                            </div>
                            <svg viewBox="0 0 400 150" className="w-full h-48">
                                <defs>
                                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor={selectedStock.change >= 0 ? '#22c55e' : '#ef4444'} stopOpacity="0.3" />
                                        <stop offset="100%" stopColor={selectedStock.change >= 0 ? '#22c55e' : '#ef4444'} stopOpacity="0" />
                                    </linearGradient>
                                </defs>
                                {(() => {
                                    const data = selectedStock.data
                                    const max = Math.max(...data.map(d => parseFloat(d.price)))
                                    const min = Math.min(...data.map(d => parseFloat(d.price)))
                                    const range = max - min || 1
                                    const points = data.map((d, i) => `${(i / (data.length - 1)) * 400},${140 - ((parseFloat(d.price) - min) / range) * 130}`).join(' ')
                                    const areaPoints = `0,150 ${points} 400,150`
                                    return (
                                        <>
                                            <polygon fill="url(#chartGradient)" points={areaPoints} />
                                            <polyline fill="none" stroke={selectedStock.change >= 0 ? '#22c55e' : '#ef4444'} strokeWidth="2" points={points} />
                                        </>
                                    )
                                })()}
                            </svg>
                        </div>

                        {/* Stats */}
                        <div className={`grid grid-cols-4 gap-4 rounded-xl p-4 mb-6 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
                            {[{ label: 'Open', value: `$${(selectedStock.price - selectedStock.change).toFixed(2)}` },
                              { label: 'High', value: `$${(selectedStock.price * 1.02).toFixed(2)}` },
                              { label: 'Low', value: `$${(selectedStock.price * 0.98).toFixed(2)}` },
                              { label: 'Volume', value: `${(Math.random() * 50 + 10).toFixed(1)}M` }].map(stat => (
                                <div key={stat.label}>
                                    <div className="text-xs text-gray-500">{stat.label}</div>
                                    <div className="font-semibold">{stat.value}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 p-6 overflow-auto">
                        <h2 className="text-2xl font-bold mb-4">Market Overview</h2>
                        <div className="grid grid-cols-3 gap-4 mb-6">
                            {[{ name: 'S&P 500', value: '4,567.89', change: '+0.85%' },
                              { name: 'Dow Jones', value: '35,123.45', change: '+0.62%' },
                              { name: 'NASDAQ', value: '14,234.56', change: '+1.23%' }].map(index => (
                                <div key={index.name} className={`p-4 rounded-xl ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
                                    <div className="text-sm text-gray-500">{index.name}</div>
                                    <div className="text-xl font-bold">{index.value}</div>
                                    <div className="text-green-500 text-sm">{index.change}</div>
                                </div>
                            ))}
                        </div>

                        <h2 className="text-xl font-bold mb-3 flex items-center gap-2"><FaNewspaper /> Top Stories</h2>
                        <div className="space-y-3">
                            {news.map((item, i) => (
                                <div key={i} className={`p-4 rounded-xl ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
                                    <div className="font-medium">{item.title}</div>
                                    <div className="text-xs text-gray-500 mt-1">{item.source} • {item.time}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Stocks
