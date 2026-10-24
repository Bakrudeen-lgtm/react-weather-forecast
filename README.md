# Atmos — React Weather Forecast App

A responsive weather forecast application built with React, Vite, and the Open-Meteo APIs. It searches for cities and displays current conditions plus a seven-day forecast.

## Features
- City search using Open-Meteo Geocoding API
- Current temperature, apparent temperature, humidity, wind speed, precipitation and weather description
- Seven-day high/low forecast and precipitation probability
- Sunrise and sunset times
- Celsius/Fahrenheit toggle
- Loading and error states
- Responsive layout for mobile, tablet and desktop
- No API key required for non-commercial use; attribution to Open-Meteo is included

## Requirements
- Node.js (current LTS recommended)
- npm
- VS Code or another code editor
- Internet connection

## Run locally
1. Extract the ZIP file.
2. Open the `react-weather-forecast` folder in VS Code.
3. Open Terminal in that folder.
4. Run:

   ```bash
   npm install
   npm run dev
   ```

5. Open the local URL shown by Vite, usually `http://localhost:5173`.

## Production build
```bash
npm run build
npm run preview
```

## API endpoints
- Geocoding: `https://geocoding-api.open-meteo.com/v1/search`
- Forecast: `https://api.open-meteo.com/v1/forecast`

The app first converts the city name to coordinates with the geocoding endpoint, then uses the coordinates to request current and daily forecast data.

## Project structure
```text
react-weather-forecast/
├── index.html
├── package.json
├── README.md
└── src/
    ├── App.jsx
    ├── App.css
    ├── index.css
    └── main.jsx
```

## Troubleshooting
- If a city is not found, check its spelling or try adding a region/country to the search term.
- If the forecast does not load, check the internet connection and try again.
- If `npm` is not recognized, install Node.js and restart VS Code.
- If packages fail to install, run `npm install` again from the project folder.

## Attribution
Weather data from [Open-Meteo](https://open-meteo.com/). Geocoding location data is based on GeoNames. Review the providers' current terms and attribution requirements before deploying or using commercially.
