import { useEffect, useMemo, useState } from "react";
import {
  Search, MapPin, Wind, Droplets, Thermometer, Sunrise, Sunset, CloudSun,
  RefreshCw, CalendarDays, LayoutDashboard, Clock3, CalendarRange, Settings,
  Star, Menu, X, CloudRain, Eye, Gauge, Heart, Sun, Moon, ChevronRight
} from "lucide-react";
import "./App.css";

const DEFAULT_CITY = "Chennai";
const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "hourly", label: "Hourly forecast", icon: Clock3 },
  { id: "weekly", label: "7-day forecast", icon: CalendarRange },
  { id: "favorites", label: "Favourite cities", icon: Star },
  { id: "settings", label: "Settings", icon: Settings },
];

function weatherInfo(code) {
  if (code === 0) return { label: "Clear sky", icon: "☀️" };
  if ([1, 2].includes(code)) return { label: code === 1 ? "Mainly clear" : "Partly cloudy", icon: "🌤️" };
  if (code === 3) return { label: "Overcast", icon: "☁️" };
  if ([45, 48].includes(code)) return { label: "Foggy", icon: "🌫️" };
  if ([51, 53, 55, 56, 57].includes(code)) return { label: "Drizzle", icon: "🌦️" };
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return { label: "Rain", icon: "🌧️" };
  if ([71, 73, 75, 77, 85, 86].includes(code)) return { label: "Snow", icon: "❄️" };
  if ([95, 96, 99].includes(code)) return { label: "Thunderstorm", icon: "⛈️" };
  return { label: "Mixed conditions", icon: "🌥️" };
}
function formatDay(date, index) {
  if (index === 0) return "Today";
  if (index === 1) return "Tomorrow";
  return new Date(`${date}T12:00:00`).toLocaleDateString("en", { weekday: "short" });
}
function formatClock(dateTime) {
  if (!dateTime) return "--:--";
  return new Date(dateTime).toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit" });
}

export default function App() {
  const [query, setQuery] = useState(DEFAULT_CITY);
  const [place, setPlace] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [unit, setUnit] = useState("celsius");
  const [lastUpdated, setLastUpdated] = useState(null);
  const [activePage, setActivePage] = useState("dashboard");
  const [favorites, setFavorites] = useState(["Chennai", "Bengaluru", "Mumbai"]);
  const [darkMode, setDarkMode] = useState(true);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  async function loadWeather(cityName) {
    const city = cityName.trim();
    if (!city) { setError("Please enter a city name."); return; }
    setLoading(true); setError("");
    try {
      const geoResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`);
      if (!geoResponse.ok) throw new Error("Could not search for that location. Please try again.");
      const geoData = await geoResponse.json();
      const match = geoData.results?.[0];
      if (!match) throw new Error("City not found. Check the spelling and try again.");
      const params = new URLSearchParams({
        latitude: match.latitude, longitude: match.longitude,
        current: "temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m",
        hourly: "temperature_2m,precipitation_probability,weather_code,wind_speed_10m",
        daily: "weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_probability_max",
        timezone: "auto", forecast_days: "7"
      });
      const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
      if (!response.ok) throw new Error("Weather data is temporarily unavailable. Please try again.");
      setWeather(await response.json()); setPlace(match); setLastUpdated(new Date()); setQuery(city);
    } catch (err) { setError(err.message || "Something went wrong. Please try again."); }
    finally { setLoading(false); }
  }
  useEffect(() => { loadWeather(DEFAULT_CITY); }, []);

  const current = weather?.current;
  const daily = weather?.daily;
  const hourly = weather?.hourly;
  const info = current ? weatherInfo(current.weather_code) : null;
  const temperature = (value) => unit === "celsius" ? Math.round(value) : Math.round((value * 9) / 5 + 32);
  const unitLabel = unit === "celsius" ? "°C" : "°F";
  const hourlyIndices = useMemo(() => {
    if (!hourly?.time) return [];
    const now = new Date();
    let start = hourly.time.findIndex((time) => new Date(time) >= now);
    if (start < 0) start = 0;
    return Array.from({ length: 12 }, (_, i) => start + i).filter((i) => i < hourly.time.length);
  }, [hourly, lastUpdated]);

  function toggleFavorite(city) {
    setFavorites((prev) => prev.some((item) => item.toLowerCase() === city.toLowerCase())
      ? prev.filter((item) => item.toLowerCase() !== city.toLowerCase()) : [...prev, city]);
  }
  const isFavorite = place && favorites.some((item) => item.toLowerCase() === place.name.toLowerCase());

  return (
    <main className={`app-layout ${darkMode ? "theme-dark" : "theme-light"}`}>
      <aside className={`sidebar ${mobileNavOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-brand"><span className="brand-mark"><CloudSun size={22} /></span><span>atmos<span className="brand-dot">.</span></span><button className="mobile-close" onClick={() => setMobileNavOpen(false)} aria-label="Close menu"><X size={19}/></button></div>
        <div className="side-label">WORKSPACE</div>
        <nav className="side-nav" aria-label="Main navigation">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => <button key={id} className={`nav-item ${activePage === id ? "nav-active" : ""}`} onClick={() => { setActivePage(id); setMobileNavOpen(false); }}><Icon size={18}/><span>{label}</span>{id === "favorites" && <span className="nav-count">{favorites.length}</span>}</button>)}
        </nav>
        <div className="sidebar-bottom"><div className="api-status"><span className="live-dot"/><div><strong>Weather API</strong><small>Connected to Open-Meteo</small></div></div><p>Atmos Weather v2.0</p></div>
      </aside>

      <section className="main-panel">
        <header className="topbar">
          <button className="mobile-menu" onClick={() => setMobileNavOpen(true)} aria-label="Open menu"><Menu size={21}/></button>
          <div className="breadcrumb">Workspace <ChevronRight size={14}/> <strong>{NAV_ITEMS.find((item) => item.id === activePage)?.label}</strong></div>
          <div className="topbar-actions"><span className="topbar-note"><span className="live-dot"/> Live weather</span><button className="icon-button" onClick={() => loadWeather(place?.name || query)} title="Refresh weather" aria-label="Refresh weather"><RefreshCw size={17} className={loading ? "spin" : ""}/></button><button className="avatar">{place?.name?.slice(0,1) || "A"}</button></div>
        </header>

        <div className="page-content">
          <div className="page-heading"><div><p className="eyebrow">YOUR DAILY WEATHER COMPANION</p><h1>{activePage === "dashboard" ? "Good day. Here's your forecast." : NAV_ITEMS.find((item) => item.id === activePage)?.label}</h1><p className="page-subtitle">{activePage === "dashboard" ? "A little clarity for whatever the sky has planned." : pageDescription(activePage)}</p></div>
            <form className="search-form" onSubmit={(e) => { e.preventDefault(); loadWeather(query); }}><Search size={18}/><input aria-label="Search city" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search any city..."/><button type="submit" disabled={loading}>{loading ? <RefreshCw size={16} className="spin"/> : "Search"}</button></form>
          </div>
          {error && <div className="error-message" role="alert">{error}</div>}
          {loading && !weather ? <div className="loading-card"><span className="loader"/> Getting the latest forecast...</div> : weather && place ? <>
            {activePage === "dashboard" && <Dashboard place={place} weather={weather} current={current} daily={daily} info={info} temperature={temperature} unitLabel={unitLabel} setUnit={setUnit} unit={unit} lastUpdated={lastUpdated} isFavorite={isFavorite} toggleFavorite={toggleFavorite} setPage={setActivePage}/>}
            {activePage === "hourly" && <HourlyPage hourly={hourly} indices={hourlyIndices} temperature={temperature} unitLabel={unitLabel} place={place}/>}
            {activePage === "weekly" && <WeeklyPage daily={daily} temperature={temperature} place={place}/>}
            {activePage === "favorites" && <FavoritesPage favorites={favorites} place={place} current={current} onChoose={(city) => { loadWeather(city); setActivePage("dashboard"); }} onToggle={toggleFavorite}/>}
            {activePage === "settings" && <SettingsPage unit={unit} setUnit={setUnit} darkMode={darkMode} setDarkMode={setDarkMode} favorites={favorites.length}/>}
            <p className="data-credit">Weather data by <a href="https://open-meteo.com/" target="_blank" rel="noreferrer">Open-Meteo</a> · Location search powered by Open-Meteo Geocoding</p>
          </> : null}
          <footer className="footer"><span>© {new Date().getFullYear()} Atmos Weather</span><span>Forecast smarter <Heart size={12} className="footer-heart"/></span></footer>
        </div>
      </section>
    </main>
  );
}

function pageDescription(page) {
  return ({ hourly: "Track the next 12 hours before you make plans.", weekly: "Plan the week with daily conditions and rain chances.", favorites: "Keep the places you care about close at hand.", settings: "Personalize your weather workspace." })[page] || "Your weather overview.";
}
function Dashboard({ place, weather, current, daily, info, temperature, unitLabel, setUnit, unit, lastUpdated, isFavorite, toggleFavorite, setPage }) {
  return <>
    <section className="dashboard-hero"><div className="hero-left"><div className="location"><MapPin size={16}/>{place.name}{place.admin1 ? `, ${place.admin1}` : ""}<button className={`favorite-star ${isFavorite ? "star-on" : ""}`} onClick={() => toggleFavorite(place.name)} aria-label="Toggle favourite"><Star size={16} fill={isFavorite ? "currentColor" : "none"}/></button></div><p className="country">{place.country} · {weather.timezone || "Local time"}</p><p className="today-label">CURRENT CONDITIONS</p><div className="temperature">{temperature(current.temperature_2m)}<span>{unitLabel}</span></div><p className="condition">{info.label}</p><p className="feels-like">Feels like {temperature(current.apparent_temperature)}{unitLabel}</p><div className="hero-meta"><span><CalendarDays size={14}/>{new Date().toLocaleDateString("en", { weekday: "long", month: "short", day: "numeric" })}</span><span>{lastUpdated ? `Updated ${lastUpdated.toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit" })}` : "Live data"}</span></div></div><div className="hero-right"><div className="hero-controls"><span>Temperature</span><div className="unit-toggle"><button className={unit === "celsius" ? "selected" : ""} onClick={() => setUnit("celsius")}>°C</button><button className={unit === "fahrenheit" ? "selected" : ""} onClick={() => setUnit("fahrenheit")}>°F</button></div></div><div className="weather-emoji">{info.icon}</div><div className="sun-times"><div className="sun-item"><span className="sun-icon sunrise"><Sunrise size={18}/></span><div><small>Sunrise</small><strong>{formatClock(daily.sunrise?.[0])}</strong></div></div><div className="sun-item"><span className="sun-icon sunset"><Sunset size={18}/></span><div><small>Sunset</small><strong>{formatClock(daily.sunset?.[0])}</strong></div></div></div></div></section>
    <div className="section-title-row"><div><p className="eyebrow">AT A GLANCE</p><h2>Weather overview</h2></div><button className="text-link" onClick={() => setPage("weekly")}>View forecast <ChevronRight size={15}/></button></div>
    <section className="metrics-grid dashboard-metrics"><Metric icon={<Droplets/>} label="Humidity" value={`${current.relative_humidity_2m}%`} note="Relative humidity"/><Metric icon={<Wind/>} label="Wind speed" value={`${Math.round(current.wind_speed_10m)} km/h`} note="At 10 metres"/><Metric icon={<Thermometer/>} label="Feels like" value={`${temperature(current.apparent_temperature)}${unitLabel}`} note="Perceived temperature"/><Metric icon={<CloudRain/>} label="Precipitation" value={`${current.precipitation ?? 0} mm`} note="Current amount"/></section>
    <div className="section-title-row forecast-title"><div><p className="eyebrow">PLAN AHEAD</p><h2>7-day forecast</h2></div><button className="text-link" onClick={() => setPage("weekly")}>Full forecast <ChevronRight size={15}/></button></div>
    <ForecastStrip daily={daily} temperature={temperature}/>
  </>;
}
function ForecastStrip({ daily, temperature }) { return <section className="forecast-list">{daily.time.map((date, index) => { const d = weatherInfo(daily.weather_code[index]); return <article className={`forecast-day ${index === 0 ? "forecast-today" : ""}`} key={date}><span className="day-name">{formatDay(date,index)}</span><span className="day-icon">{d.icon}</span><span className="day-condition">{d.label}</span><strong className="max-temp">{temperature(daily.temperature_2m_max[index])}°</strong><span className="min-temp">Low {temperature(daily.temperature_2m_min[index])}°</span><span className="rain-chance"><Droplets size={13}/>{daily.precipitation_probability_max?.[index] ?? 0}% rain</span></article>; })}</section>; }
function HourlyPage({ hourly, indices, temperature, unitLabel, place }) {
  if (!hourly) return <div className="glass-card empty-state">Hourly forecast is loading.</div>;
  const hours = indices.map((i) => ({ time: hourly.time[i], temp: hourly.temperature_2m[i], rain: hourly.precipitation_probability[i] ?? 0, code: hourly.weather_code[i], wind: hourly.wind_speed_10m[i] ?? 0 }));
  return <><section className="summary-banner"><div><Clock3 size={22}/><div><strong>Next 12 hours</strong><span>{place.name} · Hour-by-hour outlook</span></div></div><span className="banner-note">Updated forecast</span></section><section className="hourly-grid">{hours.map((h) => <article className="hour-card" key={h.time}><span className="hour-time">{new Date(h.time).toLocaleTimeString("en", {hour:"numeric"})}</span><span className="hour-icon">{weatherInfo(h.code).icon}</span><strong className="hour-temp">{temperature(h.temp)}{unitLabel}</strong><span className="hour-condition">{weatherInfo(h.code).label}</span><span className="hour-detail"><Droplets size={13}/>{h.rain}%</span><span className="hour-detail"><Wind size={13}/>{Math.round(h.wind)} km/h</span></article>)}</section><section className="glass-card insight-card"><div><p className="eyebrow">PLANNING TIP</p><h2>Check conditions before heading out</h2><p>Rain probability and wind speed can help you decide whether to carry an umbrella or plan outdoor activities.</p></div><span className="insight-emoji">🌦️</span></section></>;
}
function WeeklyPage({ daily, temperature, place }) { return <><section className="summary-banner"><div><CalendarRange size={22}/><div><strong>7-day outlook</strong><span>{place.name} · Daily highs, lows and precipitation chance</span></div></div><span className="banner-note">7 days</span></section><section className="weekly-table glass-card"><div className="weekly-table-head"><span>DAY</span><span>CONDITIONS</span><span>HIGH / LOW</span><span>RAIN CHANCE</span></div>{daily.time.map((date,index) => { const d = weatherInfo(daily.weather_code[index]); return <article className="weekly-row" key={date}><div className="weekly-day"><strong>{formatDay(date,index)}</strong><small>{new Date(`${date}T12:00:00`).toLocaleDateString("en",{month:"short",day:"numeric"})}</small></div><div className="weekly-condition"><span>{d.icon}</span>{d.label}</div><div className="weekly-temps"><strong>{temperature(daily.temperature_2m_max[index])}°</strong><span>{temperature(daily.temperature_2m_min[index])}°</span></div><div className="weekly-rain"><div className="rain-bar"><span style={{width:`${daily.precipitation_probability_max?.[index] ?? 0}%`}}/></div><span>{daily.precipitation_probability_max?.[index] ?? 0}%</span></div></article>; })}</section></>; }
function FavoritesPage({ favorites, place, current, onChoose, onToggle }) { return <><section className="summary-banner"><div><Star size={22}/><div><strong>Your saved places</strong><span>Quickly check weather in cities you follow</span></div></div><span className="banner-note">{favorites.length} saved</span></section><section className="favorite-grid">{favorites.map((city) => <article className="favorite-card" key={city}><div className="favorite-card-top"><span className="favorite-city-icon"><MapPin size={17}/></span><button className="remove-favorite" onClick={() => onToggle(city)} aria-label={`Remove ${city}`}><X size={16}/></button></div><h3>{city}</h3><p>{city.toLowerCase() === place.name.toLowerCase() ? "Currently selected location" : "Saved location"}</p><button className="open-city" onClick={() => onChoose(city)}>View weather <ChevronRight size={15}/></button></article>)}<article className="favorite-card add-city-card"><div className="favorite-card-top"><span className="favorite-city-icon"><Search size={17}/></span></div><h3>Add a city</h3><p>Use the search bar above to find another location.</p></article></section>{favorites.length === 0 && <div className="empty-state">No favourite cities yet. Search a city and tap the star on the dashboard to save it.</div>}</>; }
function SettingsPage({ unit, setUnit, darkMode, setDarkMode, favorites }) { return <section className="settings-list"><article className="setting-card"><div className="setting-icon"><Thermometer size={20}/></div><div className="setting-copy"><strong>Temperature unit</strong><span>Choose how temperatures are displayed across the app.</span></div><div className="unit-toggle"><button className={unit === "celsius" ? "selected" : ""} onClick={() => setUnit("celsius")}>°C</button><button className={unit === "fahrenheit" ? "selected" : ""} onClick={() => setUnit("fahrenheit")}>°F</button></div></article><article className="setting-card"><div className="setting-icon">{darkMode ? <Moon size={20}/> : <Sun size={20}/>}</div><div className="setting-copy"><strong>Appearance</strong><span>Switch between dark and light workspace themes.</span></div><button className={`switch ${darkMode ? "switch-on" : ""}`} onClick={() => setDarkMode(!darkMode)} aria-label="Toggle dark theme"><span/></button></article><article className="setting-card"><div className="setting-icon"><Star size={20}/></div><div className="setting-copy"><strong>Favourite cities</strong><span>You currently have {favorites} saved {favorites === 1 ? "city" : "cities"}.</span></div><span className="setting-status">{favorites} saved</span></article><article className="setting-card"><div className="setting-icon"><CloudSun size={20}/></div><div className="setting-copy"><strong>Weather data source</strong><span>Forecast data is retrieved live from Open-Meteo. No API key required.</span></div><a className="source-link" href="https://open-meteo.com/" target="_blank" rel="noreferrer">Learn more <ChevronRight size={14}/></a></article></section>; }
function Metric({ icon, label, value, note }) { return <article className="metric-card"><span className="metric-icon">{icon}</span><div className="metric-copy"><span>{label}</span><strong>{value}</strong><small>{note}</small></div></article>; }
