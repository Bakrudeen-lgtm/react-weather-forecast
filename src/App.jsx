import { useEffect, useState } from "react";
import {
  Search, MapPin, Wind, Droplets, Thermometer, Eye, Sunrise,
  Sunset, CloudSun, RefreshCw, CalendarDays
} from "lucide-react";
import "./App.css";

const DEFAULT_CITY = "Chennai";

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

  async function loadWeather(cityName) {
    const city = cityName.trim();
    if (!city) {
      setError("Please enter a city name.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;
      const geoResponse = await fetch(geoUrl);
      if (!geoResponse.ok) throw new Error("Could not search for that location. Please try again.");
      const geoData = await geoResponse.json();
      const match = geoData.results?.[0];
      if (!match) throw new Error("City not found. Check the spelling and try again.");

      const params = new URLSearchParams({
        latitude: match.latitude,
        longitude: match.longitude,
        current: "temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m",
        daily: "weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_probability_max",
        timezone: "auto",
        forecast_days: "7"
      });
      const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
      if (!weatherResponse.ok) throw new Error("Weather data is temporarily unavailable. Please try again.");
      const data = await weatherResponse.json();

      setPlace(match);
      setWeather(data);
      setLastUpdated(new Date());
      setQuery(city);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadWeather(DEFAULT_CITY);
  }, []);

  const current = weather?.current;
  const daily = weather?.daily;
  const info = current ? weatherInfo(current.weather_code) : null;
  const temperature = (value) => unit === "celsius" ? Math.round(value) : Math.round((value * 9) / 5 + 32);
  const unitLabel = unit === "celsius" ? "°C" : "°F";

  return (
    <main className="app-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <header className="topbar">
        <a className="brand" href="#" aria-label="Atmos home">
          <span className="brand-mark"><CloudSun size={22} /></span>
          <span>atmos<span className="brand-dot">.</span></span>
        </a>
        <div className="topbar-note"><span className="live-dot" /> Live weather dashboard</div>
      </header>

      <section className="intro">
        <p className="eyebrow">YOUR DAILY WEATHER COMPANION</p>
        <h1>Forecast your <span>day.</span></h1>
        <p className="intro-copy">A little clarity for whatever the sky has planned.</p>
      </section>

      <form className="search-form" onSubmit={(event) => { event.preventDefault(); loadWeather(query); }}>
        <Search size={20} aria-hidden="true" />
        <input
          aria-label="Search city"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search a city..."
        />
        <button type="submit" disabled={loading}>
          {loading ? <RefreshCw className="spin" size={17} /> : "Search"}
        </button>
      </form>

      {error && <div className="error-message" role="alert">{error}</div>}

      {loading && !weather ? (
        <div className="loading-card"><span className="loader" /> Getting the latest forecast...</div>
      ) : weather && place ? (
        <>
          <section className="weather-grid" aria-label="Current weather">
            <article className="current-card glass-card">
              <div className="current-top">
                <div>
                  <div className="location"><MapPin size={16} /> {place.name}{place.admin1 ? `, ${place.admin1}` : ""}</div>
                  <p className="country">{place.country} <span>·</span> {weather.timezone || "Local time"}</p>
                </div>
                <div className="unit-toggle" aria-label="Temperature unit">
                  <button className={unit === "celsius" ? "selected" : ""} onClick={() => setUnit("celsius")} type="button">°C</button>
                  <button className={unit === "fahrenheit" ? "selected" : ""} onClick={() => setUnit("fahrenheit")} type="button">°F</button>
                </div>
              </div>
              <div className="hero-weather">
                <div>
                  <p className="today-label">CURRENT CONDITIONS</p>
                  <div className="temperature">{temperature(current.temperature_2m)}<span>{unitLabel}</span></div>
                  <p className="condition">{info.label}</p>
                  <p className="feels-like">Feels like {temperature(current.apparent_temperature)}{unitLabel}</p>
                </div>
                <div className="weather-emoji" role="img" aria-label={info.label}>{info.icon}</div>
              </div>
              <div className="card-footer">
                <span><CalendarDays size={15} /> {new Date().toLocaleDateString("en", { weekday: "long", month: "long", day: "numeric" })}</span>
                <span>{lastUpdated ? `Updated ${lastUpdated.toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit" })}` : "Live data"}</span>
              </div>
            </article>

            <article className="details-card glass-card">
              <div className="section-heading">
                <div><p className="eyebrow">AT A GLANCE</p><h2>Weather details</h2></div>
                <span className="detail-spark">✳</span>
              </div>
              <div className="metrics-grid">
                <Metric icon={<Droplets />} label="Humidity" value={`${current.relative_humidity_2m}%`} note="Relative humidity" />
                <Metric icon={<Wind />} label="Wind speed" value={`${Math.round(current.wind_speed_10m)} km/h`} note="At 10 metres" />
                <Metric icon={<Thermometer />} label="Feels like" value={`${temperature(current.apparent_temperature)}${unitLabel}`} note="Perceived temperature" />
                <Metric icon={<Droplets />} label="Precipitation" value={`${current.precipitation ?? 0} mm`} note="Current amount" />
              </div>
              <div className="sun-times">
                <div className="sun-item"><span className="sun-icon sunrise"><Sunrise size={19} /></span><div><small>Sunrise</small><strong>{formatClock(daily.sunrise?.[0])}</strong></div></div>
                <div className="sun-item"><span className="sun-icon sunset"><Sunset size={19} /></span><div><small>Sunset</small><strong>{formatClock(daily.sunset?.[0])}</strong></div></div>
              </div>
            </article>
          </section>

          <section className="forecast-section glass-card">
            <div className="forecast-heading">
              <div><p className="eyebrow">PLAN AHEAD</p><h2>7-day forecast</h2></div>
              <span className="forecast-caption">The week, at a glance</span>
            </div>
            <div className="forecast-list">
              {daily.time.map((date, index) => {
                const dayInfo = weatherInfo(daily.weather_code[index]);
                return (
                  <article className={`forecast-day ${index === 0 ? "forecast-today" : ""}`} key={date}>
                    <span className="day-name">{formatDay(date, index)}</span>
                    <span className="day-icon" role="img" aria-label={dayInfo.label}>{dayInfo.icon}</span>
                    <span className="day-condition">{dayInfo.label}</span>
                    <div className="temp-range">
                      <strong>{temperature(daily.temperature_2m_max[index])}°</strong>
                      <div className="range-track"><span style={{ left: `${Math.max(0, Math.min(75, (daily.temperature_2m_min[index] + 10) * 1.8))}%`, width: "28%" }} /></div>
                      <span>{temperature(daily.temperature_2m_min[index])}°</span>
                    </div>
                    <span className="rain-chance"><Droplets size={13} /> {daily.precipitation_probability_max?.[index] ?? 0}%</span>
                  </article>
                );
              })}
            </div>
          </section>
          <p className="data-credit">Weather data by <a href="https://open-meteo.com/" target="_blank" rel="noreferrer">Open-Meteo</a> · Location data by GeoNames · Built with React</p>
        </>
      ) : null}

      <footer className="footer"><span>© {new Date().getFullYear()} Atmos Weather</span><span>Made for curious minds <span className="footer-heart">♥</span></span></footer>
    </main>
  );
}

function Metric({ icon, label, value, note }) {
  return (
    <div className="metric">
      <span className="metric-icon">{icon}</span>
      <div className="metric-copy"><span>{label}</span><strong>{value}</strong><small>{note}</small></div>
    </div>
  );
}