import cors from 'cors';
import express from 'express';

const app = express();
app.use(cors());

const weatherFields = 'temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m,is_day';
const dailyFields = 'weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset';

app.get('/api/weather', async (req, res) => {
  const city = String(req.query.city || 'Paris').trim();
  try {
    const geoResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`);
    const geo = await geoResponse.json();
    if (!geo.results?.length) return res.status(404).json({ message: 'City not found. Try another search.' });
    const place = geo.results[0];
    const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}&current=${weatherFields}&daily=${dailyFields}&timezone=auto&forecast_days=5`);
    const weather = await weatherResponse.json();
    res.json({ place: { name: place.name, country: place.country, admin1: place.admin1 }, weather });
  } catch {
    res.status(502).json({ message: 'Weather service is unavailable. Please try again.' });
  }
});

app.listen(process.env.PORT || 3001, () => console.log('Skyline API on http://localhost:3001'));
