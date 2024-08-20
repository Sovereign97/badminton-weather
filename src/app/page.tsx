'use client';

import React, { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Info from './Info';

interface Day {
  date: string;
  tempC: number;
  tempF: number;
  humidity: number;
  windSpeed: number;
  precipitation: number;
  weatherDescription: string;
  isSuitable: boolean;
}

export default function Home() {
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [days, setDays] = useState<Day[]>([]);
  const [activeDay, setActiveDay] = useState<number | null>(null); // To track the active day
  const [isActive, setIsActive] = useState(false);

  const handleToggle = () => {
    setIsActive(!isActive);
  };


  const fetchWeather = async () => {
    try {
      const response = await axios.get(`/api/weather`, { params: { city, state } });
  
      const updatedDays = response.data.suitableDays.map((day: any) => ({
        ...day,
        tempC: day.temp,
        tempF: (day.temp * 9/5) + 32,
      }));
  
      setDays(updatedDays);
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };
  
  const toggleDay = (index: number) => {
    setActiveDay(activeDay === index ? null : index);
  };

  return (
    <>

      <div className='container'>
        <div className="main-container">
          <h1>Can I play Badminton this week?</h1>
          <div className="input-group">
            <input
              type="text"
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <input
              type="text"
              placeholder="State"
              value={state}
              onChange={(e) => setState(e.target.value)}
            />
            <button onClick={fetchWeather}>Check Weather</button>
          </div>
          <div className="days">
            {days.map((day, index) => (
              <div
                key={index}
                className={`day ${day.isSuitable ? 'suitable' : 'unsuitable'}`}
                onClick={() => toggleDay(index)}
              >
                <div className="day-header">
                  {day.date}
                </div>
                {activeDay === index && (
                  <div className="day-stats">
                    <p>Temperature: {day.tempC}°C / {day.tempF.toFixed(1)}°F</p>
                    <p>Humidity: {day.humidity}%</p>
                    <p>Wind Speed: {day.windSpeed} m/s</p>
                    <p>Precipitation: {day.precipitation}%</p>
                    <p>Weather: {day.weatherDescription}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className='info'>
          <button className={`accordion ${isActive ? 'active' : ''}`} onClick={handleToggle}>
            Click here to learn how suitability is calculated
          </button>
          <div className="panel" style={{ display: isActive ? 'block' : 'none' }}>
            <p>Temperature between 10°C/50°F and 35°C/95°F</p>
            <p>Wind Speed below 10 m/s</p>
            <p>Humidity below 80%</p>
            <p>Precipitation 0%</p>
          </div>
        </div>
      </div>
    </>
  );
}
