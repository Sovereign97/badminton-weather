import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get('city');
  const state = searchParams.get('state');

  if (!city || !state) {
    return NextResponse.json({ error: 'City and state are required' }, { status: 400 });
  }

  const geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city},${state},US&limit=1&appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}`;

  try {
    const geoResponse = await axios.get(geoUrl);
    const geoData = geoResponse.data;

    if (!geoData.length) {
      return NextResponse.json({ error: 'Location not found' }, { status: 404 });
    }

    const { lat, lon } = geoData[0];
    const weatherUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=metric&appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}`;

    const weatherResponse = await axios.get(weatherUrl);
    const weatherData = weatherResponse.data;

    const suitableDays = weatherData.daily.map((day: any) => {
      const isSuitable =
        day.humidity <= 80 &&
        day.pop === 0 &&
        day.temp.day >= 10 &&
        day.temp.day <= 35 &&
        day.wind_speed <= 10;

      return {
        date: new Date(day.dt * 1000).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' }),
        temp: day.temp.day,
        humidity: day.humidity,
        windSpeed: day.wind_speed,
        precipitation: day.pop * 100,
        weatherDescription: day.weather[0].description,
        isSuitable
      };
    });

    return NextResponse.json({ suitableDays });
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return NextResponse.json({ error: 'Failed to fetch weather data' }, { status: 500 });
  }
}
