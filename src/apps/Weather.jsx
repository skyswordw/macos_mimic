import React, { useState, useEffect } from 'react'
import { useStore } from '../store/useStore'
import {
    FaSun, FaCloud, FaCloudRain, FaSnowflake, FaBolt, FaWind,
    FaMapMarkerAlt, FaSearch, FaTint, FaEye, FaThermometerHalf,
    FaCloudSun, FaMoon, FaCloudMoon
} from 'react-icons/fa'

// Weather conditions with icons
const weatherConditions = {
    sunny: { icon: FaSun, color: 'text-yellow-400', bg: 'from-blue-400 to-blue-600' },
    partlyCloudy: { icon: FaCloudSun, color: 'text-gray-300', bg: 'from-blue-400 to-blue-500' },
    cloudy: { icon: FaCloud, color: 'text-gray-400', bg: 'from-gray-400 to-gray-600' },
    rainy: { icon: FaCloudRain, color: 'text-blue-400', bg: 'from-gray-500 to-gray-700' },
    stormy: { icon: FaBolt, color: 'text-yellow-400', bg: 'from-gray-600 to-gray-800' },
    snowy: { icon: FaSnowflake, color: 'text-blue-200', bg: 'from-blue-200 to-blue-400' },
    nightClear: { icon: FaMoon, color: 'text-yellow-200', bg: 'from-indigo-800 to-gray-900' },
    nightCloudy: { icon: FaCloudMoon, color: 'text-gray-300', bg: 'from-indigo-700 to-gray-800' }
}

// Mock weather data for different cities
const citiesWeather = {
    'San Francisco': {
        temp: 18,
        high: 21,
        low: 14,
        condition: 'partlyCloudy',
        humidity: 72,
        wind: 15,
        visibility: 16,
        uvIndex: 5,
        hourly: [
            { hour: 'Now', temp: 18, condition: 'partlyCloudy' },
            { hour: '1PM', temp: 19, condition: 'partlyCloudy' },
            { hour: '2PM', temp: 20, condition: 'sunny' },
            { hour: '3PM', temp: 21, condition: 'sunny' },
            { hour: '4PM', temp: 20, condition: 'partlyCloudy' },
            { hour: '5PM', temp: 19, condition: 'partlyCloudy' },
            { hour: '6PM', temp: 17, condition: 'nightCloudy' },
            { hour: '7PM', temp: 16, condition: 'nightClear' }
        ],
        daily: [
            { day: 'Today', high: 21, low: 14, condition: 'partlyCloudy' },
            { day: 'Tue', high: 22, low: 15, condition: 'sunny' },
            { day: 'Wed', high: 20, low: 14, condition: 'cloudy' },
            { day: 'Thu', high: 18, low: 12, condition: 'rainy' },
            { day: 'Fri', high: 19, low: 13, condition: 'partlyCloudy' },
            { day: 'Sat', high: 21, low: 14, condition: 'sunny' },
            { day: 'Sun', high: 23, low: 15, condition: 'sunny' }
        ]
    },
    'New York': {
        temp: 24,
        high: 28,
        low: 20,
        condition: 'sunny',
        humidity: 55,
        wind: 12,
        visibility: 16,
        uvIndex: 8,
        hourly: [
            { hour: 'Now', temp: 24, condition: 'sunny' },
            { hour: '1PM', temp: 26, condition: 'sunny' },
            { hour: '2PM', temp: 27, condition: 'sunny' },
            { hour: '3PM', temp: 28, condition: 'sunny' },
            { hour: '4PM', temp: 27, condition: 'partlyCloudy' },
            { hour: '5PM', temp: 25, condition: 'partlyCloudy' },
            { hour: '6PM', temp: 23, condition: 'nightClear' },
            { hour: '7PM', temp: 22, condition: 'nightClear' }
        ],
        daily: [
            { day: 'Today', high: 28, low: 20, condition: 'sunny' },
            { day: 'Tue', high: 30, low: 22, condition: 'sunny' },
            { day: 'Wed', high: 29, low: 21, condition: 'partlyCloudy' },
            { day: 'Thu', high: 26, low: 19, condition: 'rainy' },
            { day: 'Fri', high: 25, low: 18, condition: 'stormy' },
            { day: 'Sat', high: 27, low: 20, condition: 'partlyCloudy' },
            { day: 'Sun', high: 28, low: 21, condition: 'sunny' }
        ]
    },
    'London': {
        temp: 15,
        high: 18,
        low: 12,
        condition: 'rainy',
        humidity: 85,
        wind: 20,
        visibility: 8,
        uvIndex: 2,
        hourly: [
            { hour: 'Now', temp: 15, condition: 'rainy' },
            { hour: '1PM', temp: 15, condition: 'rainy' },
            { hour: '2PM', temp: 16, condition: 'cloudy' },
            { hour: '3PM', temp: 17, condition: 'cloudy' },
            { hour: '4PM', temp: 17, condition: 'partlyCloudy' },
            { hour: '5PM', temp: 16, condition: 'cloudy' },
            { hour: '6PM', temp: 14, condition: 'nightCloudy' },
            { hour: '7PM', temp: 13, condition: 'nightCloudy' }
        ],
        daily: [
            { day: 'Today', high: 18, low: 12, condition: 'rainy' },
            { day: 'Tue', high: 17, low: 11, condition: 'cloudy' },
            { day: 'Wed', high: 19, low: 13, condition: 'partlyCloudy' },
            { day: 'Thu', high: 20, low: 14, condition: 'sunny' },
            { day: 'Fri', high: 18, low: 12, condition: 'rainy' },
            { day: 'Sat', high: 16, low: 10, condition: 'rainy' },
            { day: 'Sun', high: 17, low: 11, condition: 'cloudy' }
        ]
    },
    'Tokyo': {
        temp: 28,
        high: 32,
        low: 25,
        condition: 'partlyCloudy',
        humidity: 78,
        wind: 8,
        visibility: 12,
        uvIndex: 7,
        hourly: [
            { hour: 'Now', temp: 28, condition: 'partlyCloudy' },
            { hour: '1PM', temp: 30, condition: 'sunny' },
            { hour: '2PM', temp: 31, condition: 'sunny' },
            { hour: '3PM', temp: 32, condition: 'sunny' },
            { hour: '4PM', temp: 31, condition: 'partlyCloudy' },
            { hour: '5PM', temp: 29, condition: 'partlyCloudy' },
            { hour: '6PM', temp: 27, condition: 'nightCloudy' },
            { hour: '7PM', temp: 26, condition: 'nightClear' }
        ],
        daily: [
            { day: 'Today', high: 32, low: 25, condition: 'partlyCloudy' },
            { day: 'Tue', high: 33, low: 26, condition: 'sunny' },
            { day: 'Wed', high: 31, low: 24, condition: 'rainy' },
            { day: 'Thu', high: 29, low: 23, condition: 'stormy' },
            { day: 'Fri', high: 30, low: 24, condition: 'cloudy' },
            { day: 'Sat', high: 32, low: 25, condition: 'partlyCloudy' },
            { day: 'Sun', high: 34, low: 26, condition: 'sunny' }
        ]
    },
    'Sydney': {
        temp: 12,
        high: 15,
        low: 8,
        condition: 'cloudy',
        humidity: 68,
        wind: 18,
        visibility: 14,
        uvIndex: 3,
        hourly: [
            { hour: 'Now', temp: 12, condition: 'cloudy' },
            { hour: '1PM', temp: 13, condition: 'cloudy' },
            { hour: '2PM', temp: 14, condition: 'partlyCloudy' },
            { hour: '3PM', temp: 15, condition: 'partlyCloudy' },
            { hour: '4PM', temp: 14, condition: 'cloudy' },
            { hour: '5PM', temp: 12, condition: 'cloudy' },
            { hour: '6PM', temp: 10, condition: 'nightCloudy' },
            { hour: '7PM', temp: 9, condition: 'nightCloudy' }
        ],
        daily: [
            { day: 'Today', high: 15, low: 8, condition: 'cloudy' },
            { day: 'Tue', high: 16, low: 9, condition: 'partlyCloudy' },
            { day: 'Wed', high: 18, low: 10, condition: 'sunny' },
            { day: 'Thu', high: 17, low: 10, condition: 'partlyCloudy' },
            { day: 'Fri', high: 14, low: 8, condition: 'rainy' },
            { day: 'Sat', high: 13, low: 7, condition: 'rainy' },
            { day: 'Sun', high: 15, low: 8, condition: 'cloudy' }
        ]
    }
}

const Weather = () => {
    const { darkMode } = useStore()
    const [selectedCity, setSelectedCity] = useState('San Francisco')
    const [searchQuery, setSearchQuery] = useState('')
    const [showSearch, setShowSearch] = useState(false)
    const [savedCities, setSavedCities] = useState(['San Francisco', 'New York', 'London'])

    const weather = citiesWeather[selectedCity]
    const condition = weatherConditions[weather.condition]
    const WeatherIcon = condition.icon

    const cities = Object.keys(citiesWeather)
    const filteredCities = cities.filter(city =>
        city.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !savedCities.includes(city)
    )

    const addCity = (city) => {
        if (!savedCities.includes(city)) {
            setSavedCities([...savedCities, city])
        }
        setSelectedCity(city)
        setShowSearch(false)
        setSearchQuery('')
    }

    const removeCity = (city, e) => {
        e.stopPropagation()
        const newCities = savedCities.filter(c => c !== city)
        setSavedCities(newCities)
        if (selectedCity === city && newCities.length > 0) {
            setSelectedCity(newCities[0])
        }
    }

    return (
        <div className={`w-full h-full flex bg-gradient-to-br ${condition.bg}`}>
            {/* Sidebar */}
            <div className={`w-64 backdrop-blur-xl border-r flex flex-col ${
                darkMode ? 'bg-black/30 border-white/10' : 'bg-white/10 border-white/20'
            }`}>
                {/* Search */}
                <div className="p-4">
                    <div className="relative">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60" />
                        <input
                            type="text"
                            placeholder="Search city..."
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value)
                                setShowSearch(true)
                            }}
                            onFocus={() => setShowSearch(true)}
                            className="w-full pl-10 pr-4 py-2 bg-white/10 rounded-lg text-white placeholder-white/50 focus:outline-none focus:bg-white/20"
                        />
                    </div>

                    {/* Search results */}
                    {showSearch && searchQuery && filteredCities.length > 0 && (
                        <div className="mt-2 bg-black/30 rounded-lg overflow-hidden">
                            {filteredCities.map(city => (
                                <div
                                    key={city}
                                    onClick={() => addCity(city)}
                                    className="px-4 py-2 text-white hover:bg-white/10 cursor-pointer"
                                >
                                    {city}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Saved cities */}
                <div className="flex-1 overflow-y-auto px-2">
                    {savedCities.map(city => {
                        const cityWeather = citiesWeather[city]
                        const cityCondition = weatherConditions[cityWeather.condition]
                        const CityIcon = cityCondition.icon

                        return (
                            <div
                                key={city}
                                onClick={() => setSelectedCity(city)}
                                className={`p-3 mx-2 mb-2 rounded-xl cursor-pointer transition-all group ${
                                    selectedCity === city
                                        ? 'bg-white/20'
                                        : 'hover:bg-white/10'
                                }`}
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="text-white font-medium">{city}</div>
                                        <div className="text-white/60 text-sm">
                                            {new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CityIcon className={`text-2xl ${cityCondition.color}`} />
                                        <span className="text-2xl text-white font-light">{cityWeather.temp}°</span>
                                    </div>
                                </div>
                                <div className="flex justify-between mt-1">
                                    <span className="text-white/60 text-sm">H:{cityWeather.high}° L:{cityWeather.low}°</span>
                                    {savedCities.length > 1 && (
                                        <button
                                            onClick={(e) => removeCity(city, e)}
                                            className="text-white/40 hover:text-white/80 opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Main content */}
            <div className="flex-1 overflow-y-auto p-6">
                {/* Current weather */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <FaMapMarkerAlt className="text-white/80" />
                        <h1 className="text-2xl text-white font-medium">{selectedCity}</h1>
                    </div>
                    <div className="text-8xl text-white font-thin mb-2">{weather.temp}°</div>
                    <div className="flex items-center justify-center gap-2 text-white/80">
                        <WeatherIcon className={`text-3xl ${condition.color}`} />
                        <span className="text-xl capitalize">
                            {weather.condition.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                    </div>
                    <div className="text-white/60 mt-1">
                        H:{weather.high}° L:{weather.low}°
                    </div>
                </div>

                {/* Hourly forecast */}
                <div className={`backdrop-blur-xl rounded-2xl p-4 mb-4 ${
                    darkMode ? 'bg-black/30' : 'bg-white/10'
                }`}>
                    <h3 className="text-white/60 text-sm font-medium mb-3 uppercase tracking-wide">Hourly Forecast</h3>
                    <div className="flex gap-4 overflow-x-auto pb-2">
                        {weather.hourly.map((hour, index) => {
                            const hourCondition = weatherConditions[hour.condition]
                            const HourIcon = hourCondition.icon
                            return (
                                <div key={index} className="flex flex-col items-center min-w-[60px]">
                                    <span className="text-white/80 text-sm">{hour.hour}</span>
                                    <HourIcon className={`text-2xl my-2 ${hourCondition.color}`} />
                                    <span className="text-white font-medium">{hour.temp}°</span>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* 7-day forecast */}
                <div className={`backdrop-blur-xl rounded-2xl p-4 mb-4 ${
                    darkMode ? 'bg-black/30' : 'bg-white/10'
                }`}>
                    <h3 className="text-white/60 text-sm font-medium mb-3 uppercase tracking-wide">7-Day Forecast</h3>
                    <div className="space-y-3">
                        {weather.daily.map((day, index) => {
                            const dayCondition = weatherConditions[day.condition]
                            const DayIcon = dayCondition.icon
                            const tempRange = weather.daily.reduce((acc, d) => ({
                                min: Math.min(acc.min, d.low),
                                max: Math.max(acc.max, d.high)
                            }), { min: Infinity, max: -Infinity })
                            const barStart = ((day.low - tempRange.min) / (tempRange.max - tempRange.min)) * 100
                            const barWidth = ((day.high - day.low) / (tempRange.max - tempRange.min)) * 100

                            return (
                                <div key={index} className="flex items-center gap-4">
                                    <span className="text-white w-12">{day.day}</span>
                                    <DayIcon className={`text-xl ${dayCondition.color}`} />
                                    <span className="text-white/60 w-8">{day.low}°</span>
                                    <div className="flex-1 h-1 bg-white/20 rounded-full relative">
                                        <div
                                            className="absolute h-full bg-gradient-to-r from-blue-400 to-orange-400 rounded-full"
                                            style={{ left: `${barStart}%`, width: `${barWidth}%` }}
                                        />
                                    </div>
                                    <span className="text-white w-8">{day.high}°</span>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Weather details */}
                <div className="grid grid-cols-2 gap-4">
                    <div className={`backdrop-blur-xl rounded-2xl p-4 ${
                        darkMode ? 'bg-black/30' : 'bg-white/10'
                    }`}>
                        <div className="flex items-center gap-2 text-white/60 text-sm mb-2">
                            <FaTint />
                            <span>HUMIDITY</span>
                        </div>
                        <div className="text-3xl text-white font-light">{weather.humidity}%</div>
                        <div className="text-white/60 text-sm mt-1">
                            The dew point is {weather.temp - 5}° right now.
                        </div>
                    </div>

                    <div className={`backdrop-blur-xl rounded-2xl p-4 ${
                        darkMode ? 'bg-black/30' : 'bg-white/10'
                    }`}>
                        <div className="flex items-center gap-2 text-white/60 text-sm mb-2">
                            <FaWind />
                            <span>WIND</span>
                        </div>
                        <div className="text-3xl text-white font-light">{weather.wind} km/h</div>
                        <div className="text-white/60 text-sm mt-1">
                            Wind direction: SW
                        </div>
                    </div>

                    <div className={`backdrop-blur-xl rounded-2xl p-4 ${
                        darkMode ? 'bg-black/30' : 'bg-white/10'
                    }`}>
                        <div className="flex items-center gap-2 text-white/60 text-sm mb-2">
                            <FaEye />
                            <span>VISIBILITY</span>
                        </div>
                        <div className="text-3xl text-white font-light">{weather.visibility} km</div>
                        <div className="text-white/60 text-sm mt-1">
                            {weather.visibility > 10 ? 'Clear visibility' : 'Reduced visibility'}
                        </div>
                    </div>

                    <div className={`backdrop-blur-xl rounded-2xl p-4 ${
                        darkMode ? 'bg-black/30' : 'bg-white/10'
                    }`}>
                        <div className="flex items-center gap-2 text-white/60 text-sm mb-2">
                            <FaThermometerHalf />
                            <span>UV INDEX</span>
                        </div>
                        <div className="text-3xl text-white font-light">{weather.uvIndex}</div>
                        <div className="text-white/60 text-sm mt-1">
                            {weather.uvIndex <= 2 ? 'Low' : weather.uvIndex <= 5 ? 'Moderate' : weather.uvIndex <= 7 ? 'High' : 'Very High'}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Weather
