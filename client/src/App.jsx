import { useEffect, useState } from 'react';
import { Droplets, Search, Sunrise, Sunset, Wind } from 'lucide-react';

const icons = { 0: '☀️', 1: '🌤️', 2: '⛅', 3: '☁️', 45: '🌫️', 48: '🌫️', 51: '🌦️', 53: '🌦️', 55: '🌧️', 61: '🌦️', 63: '🌧️', 65: '🌧️', 71: '🌨️', 73: '🌨️', 75: '❄️', 80: '🌦️', 81: '🌧️', 82: '🌧️', 95: '⛈️' };
const labels = { 0: 'Clear sky', 1: 'Mostly clear', 2: 'Partly cloudy', 3: 'Overcast', 45: 'Foggy', 48: 'Foggy', 51: 'Light drizzle', 53: 'Drizzle', 55: 'Heavy drizzle', 61: 'Light rain', 63: 'Rainy', 65: 'Heavy rain', 71: 'Light snow', 73: 'Snowy', 75: 'Heavy snow', 80: 'Showers', 81: 'Rain showers', 82: 'Heavy showers', 95: 'Thunderstorms' };
const iconFor = (code) => icons[code] || '🌤️';
const labelFor = (code) => labels[code] || 'Partly cloudy';

export default function App() {
  const [city, setCity] = useState('Paris'); const [data, setData] = useState(null); const [error, setError] = useState(''); const [loading, setLoading] = useState(true);
  const load = async (name = city) => { setLoading(true); setError(''); try { const response = await fetch(`/api/weather?city=${encodeURIComponent(name)}`); const json = await response.json(); if (!response.ok) throw new Error(json.message); setData(json); } catch (e) { setError(e.message); } finally { setLoading(false); } };
  useEffect(() => { load('Paris'); }, []);
  const submit = (e) => { e.preventDefault(); if (city.trim()) load(); };
  if (loading && !data) return <div className="state">Loading the sky…</div>;
  const { current } = data.weather; const daily = data.weather.daily;
  return <main>
    <nav><a className="logo" href="#top"><i /> SKYLINE</a><span>YOUR WEATHER, BEAUTIFULLY SIMPLE</span></nav>
    <section className="hero" id="top"><div className="sky-orb orb-one"/><div className="sky-orb orb-two"/>
      <form onSubmit={submit}><Search size={18}/><input value={city} onChange={e => setCity(e.target.value)} placeholder="Search any city"/><button>Search</button></form>
      {error ? <div className="error">{error}</div> : <><p className="location">{data.place.name}, {data.place.country}</p><div className="now"><div className="condition">{iconFor(current.weather_code)}</div><div><strong>{Math.round(current.temperature_2m)}°</strong><p>{labelFor(current.weather_code)}</p></div></div><p className="feels">Feels like {Math.round(current.apparent_temperature)}° · {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p></>}
    </section>
    {!error && <section className="dashboard"><div className="details"><article><Wind/><div><small>WIND</small><b>{Math.round(current.wind_speed_10m)} <em>km/h</em></b></div></article><article><Droplets/><div><small>HUMIDITY</small><b>{current.relative_humidity_2m}<em>%</em></b></div></article><article><Sunrise/><div><small>SUNRISE</small><b>{new Date(daily.sunrise[0]).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}</b></div></article><article><Sunset/><div><small>SUNSET</small><b>{new Date(daily.sunset[0]).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}</b></div></article></div>
      <div className="forecast"><div className="section-title"><div><p>OUTLOOK</p><h2>Next five days</h2></div><span>°C</span></div><div className="days">{daily.time.map((date, index) => <article key={date}><p>{index === 0 ? 'Today' : new Date(`${date}T12:00`).toLocaleDateString('en-US', {weekday:'short'})}</p><span>{iconFor(daily.weather_code[index])}</span><div><b>{Math.round(daily.temperature_2m_max[index])}°</b><small>{Math.round(daily.temperature_2m_min[index])}°</small></div></article>)}</div></div>
    </section>}
    {loading && <div className="loading">Updating forecast…</div>}<footer>Data from Open-Meteo · Built with React & Node.js</footer>
  </main>;
}
