# IBM Course Project Report
## Atmos — Weather Forecast Application Using React JS

**Student Name:** ____________________  
**Course / Institution:** ____________________  
**Submission Date:** ____________________

## 1. Abstract
Atmos is a responsive weather forecast web application developed using React JS. It allows users to search for a city and view current weather conditions and a seven-day forecast. The application uses the Open-Meteo Geocoding API to convert a city name into geographic coordinates and the Open-Meteo Forecast API to retrieve weather information. The interface includes temperature, apparent temperature, humidity, wind speed, precipitation, sunrise, sunset, and daily high/low temperatures.

## 2. Problem Statement
People often need a quick way to check local weather before planning travel, study, work, or outdoor activities. This project provides a simple, responsive interface that presents useful weather information in one place.

## 3. Objectives
- Build a single-page application using React JS.
- Retrieve weather data from public APIs.
- Search for locations by city name.
- Present current conditions and a seven-day forecast clearly.
- Practice React hooks, component-based design, asynchronous requests, and error handling.
- Create a responsive interface for desktop and mobile screens.

## 4. Scope
The current version supports city search, current weather, seven-day daily forecast, temperature-unit conversion, loading feedback, and error messages. It does not provide user accounts, saved locations, push alerts, or a backend database; these can be added as future enhancements.

## 5. Tools and Technologies
- **React JS:** Component-based user interface.
- **JavaScript (ES6+):** Logic and data processing.
- **HTML5:** Application document structure.
- **CSS3:** Layout, styling, responsive design, and animations.
- **Vite:** Development server and production build.
- **Open-Meteo Geocoding API:** City search and coordinates.
- **Open-Meteo Forecast API:** Current and daily forecast information.
- **VS Code:** Suggested editor.

## 6. System Requirements
### Hardware
- Computer or laptop capable of running a modern browser.
- Internet connection.

### Software
- Windows, macOS, or Linux.
- Node.js and npm.
- Modern browser such as Chrome, Edge, Firefox, or Safari.
- VS Code or another editor.

## 7. System Design
### Workflow
1. User enters a city name in the search field.
2. React validates that the input is not empty.
3. The app calls the Geocoding API to find the first matching location.
4. The app reads the latitude and longitude from the response.
5. The app calls the Forecast API using those coordinates.
6. React stores the returned data in component state.
7. The interface renders current weather, weather details, sunrise/sunset, and seven daily forecast cards.
8. If a request fails or a city cannot be found, an error message is shown.

### Architecture
**User → React UI → Geocoding API → Coordinates → Forecast API → React state → Weather dashboard**

## 8. Implementation Details
- `App.jsx` contains the main React component, API calls, weather-code mapping, temperature conversion, and reusable metric component.
- `App.css` contains the dashboard layout, cards, forecast rows, responsive breakpoints, and visual styling.
- `index.css` defines global styles and typography.
- `main.jsx` mounts the React application.
- `package.json` defines project dependencies and development/build commands.

The application uses `useState` to manage search text, selected location, weather data, loading status, errors, and temperature units. `useEffect` loads a default city when the app starts. The `fetch` API retrieves remote JSON data asynchronously.

## 9. Installation and Execution
1. Install Node.js.
2. Extract the project ZIP and open its folder in VS Code.
3. Open a terminal in the project directory.
4. Run `npm install`.
5. Run `npm run dev`.
6. Open the local URL printed by Vite.
7. Search for a city such as Chennai, Mumbai, London, or Tokyo.
8. Use the °C/°F control to change temperature units.

For a production build, run `npm run build`.

## 10. Testing Plan
| Test case | Action | Expected result |
|---|---|---|
| Initial load | Open the app | Default city weather is requested |
| Valid city | Search for Chennai | Current weather and forecast display |
| Another city | Search for London | Dashboard updates to the selected city |
| Empty input | Submit an empty field | Validation message appears |
| Unknown city | Search for a made-up city | City-not-found message appears |
| Temperature toggle | Select °F | Displayed temperature values convert to Fahrenheit |
| Network/API error | Disconnect internet or simulate request failure | Error feedback appears |
| Responsive layout | Open on a narrow screen | Cards adapt and forecast can scroll horizontally |

## 11. Results
When connected to the internet and the APIs are available, the app retrieves weather information for the selected city and presents it in a modern responsive dashboard. Actual test results should be recorded after running the application on the student's device.

## 12. Limitations
- Weather availability and accuracy depend on the external provider and its forecast models.
- The app requires internet access.
- City search selects the first geocoding match; cities with duplicate names may require more precise search text.
- No saved favourites or user login are included.
- The current version is a frontend project and does not include a backend database.

## 13. Future Enhancements
- Add autocomplete and a list of matching cities.
- Add hourly forecasts and interactive charts.
- Add geolocation with explicit user permission.
- Save favourite cities.
- Add severe-weather notifications where supported by a data provider.
- Add a backend service and automated tests.
- Add multilingual support and accessibility testing.

## 14. Conclusion
The Atmos project demonstrates how React JS can be used to build a practical data-driven web application. It combines reusable UI components, React hooks, asynchronous API calls, responsive CSS, error handling, and data presentation. The project provides a foundation for further study in frontend development and API integration.

## 15. References
- Open-Meteo Forecast API: https://open-meteo.com/en/docs
- Open-Meteo Geocoding API: https://open-meteo.com/en/docs/geocoding-api
- React documentation: https://react.dev/
- Vite documentation: https://vite.dev/

**Note:** Update the student/institution fields, run the app, add screenshots of your own running application, and follow the specific submission requirements provided by your IBM course.
