document.addEventListener("DOMContentLoaded", () => {
  getWeatherByCurrentLocation();
});

async function getWeatherByCurrentLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        const apiKey = "b4dcf92d43c3998ee182b6243e9c266d";

        const weatherInfo = document.getElementById("weather-info");
        const forecastInfo = document.getElementById("forecast-info");

        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

        try {
          const weatherResponse = await fetch(weatherUrl);
          if (!weatherResponse.ok) {
            throw new Error(
              `Location not found: ${weatherResponse.statusText}`
            );
          }
          const weatherData = await weatherResponse.json();

          const weatherIcon = getWeatherIcon(weatherData.weather[0].main);

          weatherInfo.innerHTML = `
                    <h2>${weatherData.name}, ${weatherData.sys.country}</h2>
                    <img src="${weatherIcon}" alt="${weatherData.weather[0].description}">
                    <p>Temperature: ${weatherData.main.temp} °C</p>
                    <p>Weather: ${weatherData.weather[0].description}</p>
                    <p>Humidity: ${weatherData.main.humidity}%</p>
                    <p>Wind Speed: ${weatherData.wind.speed} m/s</p>
                `;

          const forecastResponse = await fetch(forecastUrl);
          if (!forecastResponse.ok) {
            throw new Error(
              `Forecast not found: ${forecastResponse.statusText}`
            );
          }
          const forecastData = await forecastResponse.json();
          forecastInfo.innerHTML = "<h3>5-Day Forecast</h3>";
          forecastData.list.forEach((entry, index) => {
            if (index % 8 === 0) {
              // Every 8th entry represents a new day (3-hour intervals)
              const dayIcon = getWeatherIcon(entry.weather[0].main);
              const date = new Date(entry.dt * 1000).toLocaleDateString();
              forecastInfo.innerHTML += `
                            <div class="forecast-day">
                                <h4>${date}</h4>
                                <img src="${dayIcon}" alt="${entry.weather[0].description}">
                                <p>Temp: ${entry.main.temp} °C</p>
                                <p>${entry.weather[0].description}</p>
                            </div>
                        `;
            }
          });
        } catch (error) {
          weatherInfo.innerHTML = `Error: ${error.message}`;
          forecastInfo.innerHTML = "";
        }
      },
      (error) => {
        document.getElementById(
          "weather-info"
        ).innerHTML = `Error: Unable to retrieve your location`;
      }
    );
  } else {
    document.getElementById("weather-info").innerHTML =
      "Geolocation is not supported by this browser.";
  }
}

async function getWeather() {
  const apiKey = "b4dcf92d43c3998ee182b6243e9c266d";
  const city = document.getElementById("city").value.trim(); // Trim spaces
  const weatherInfo = document.getElementById("weather-info");
  const forecastInfo = document.getElementById("forecast-info");

  // Clear previous results
  weatherInfo.innerHTML = "";
  forecastInfo.innerHTML = "";

  if (!city) {
    weatherInfo.innerHTML = "Please enter a city name.";
    return;
  }

  const geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;

  try {
    const geoResponse = await fetch(geoUrl);
    if (!geoResponse.ok) {
      throw new Error(`City not found: ${geoResponse.statusText}`);
    }
    const geoData = await geoResponse.json();
    if (geoData.length === 0) {
      throw new Error("City not found");
    }

    const lat = geoData[0].lat;
    const lon = geoData[0].lon;

    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    const weatherResponse = await fetch(weatherUrl);
    if (!weatherResponse.ok) {
      throw new Error(`Weather not found: ${weatherResponse.statusText}`);
    }
    const weatherData = await weatherResponse.json();

    const weatherIcon = getWeatherIcon(weatherData.weather[0].main);

    weatherInfo.innerHTML = `
            <h2>${weatherData.name}, ${weatherData.sys.country}</h2>
            <img src="${weatherIcon}" alt="${weatherData.weather[0].description}">
            <p>Temperature: ${weatherData.main.temp} °C</p>
            <p>Weather: ${weatherData.weather[0].description}</p>
            <p>Humidity: ${weatherData.main.humidity}%</p>
            <p>Wind Speed: ${weatherData.wind.speed} m/s</p>
        `;

    const forecastResponse = await fetch(forecastUrl);
    if (!forecastResponse.ok) {
      throw new Error(`Forecast not found: ${forecastResponse.statusText}`);
    }
    const forecastData = await forecastResponse.json();
    forecastInfo.innerHTML = "<h3>5-Day Forecast</h3>";
    forecastData.list.forEach((entry, index) => {
      if (index % 8 === 0) {
        // Every 8th entry represents a new day (3-hour intervals)
        const dayIcon = getWeatherIcon(entry.weather[0].main);
        const date = new Date(entry.dt * 1000).toLocaleDateString();
        forecastInfo.innerHTML += `
                    <div class="forecast-day">
                        <h4>${date}</h4>
                        <img src="${dayIcon}" alt="${entry.weather[0].description}">
                        <p>Temp: ${entry.main.temp} °C</p>
                        <p>${entry.weather[0].description}</p>
                    </div>
                `;
      }
    });
  } catch (error) {
    weatherInfo.innerHTML = `Error: ${error.message}`;
    forecastInfo.innerHTML = "";
  }
}

function getWeatherIcon(weather) {
  const weatherIcons = {
    Clear: "http://openweathermap.org/img/wn/01d.png", // sunny
    Clouds: "http://openweathermap.org/img/wn/03d.png", // cloudy
    Rain: "http://openweathermap.org/img/wn/09d.png", // rain
    Drizzle: "http://openweathermap.org/img/wn/10d.png", // drizzle
    Thunderstorm: "http://openweathermap.org/img/wn/11d.png", // thunderstorm
    Snow: "http://openweathermap.org/img/wn/13d.png", // snow
    Mist: "http://openweathermap.org/img/wn/50d.png", // mist
    Smoke: "http://openweathermap.org/img/wn/50d.png", // smoke
    Haze: "http://openweathermap.org/img/wn/50d.png", // haze
    Dust: "http://openweathermap.org/img/wn/50d.png", // dust
    Fog: "http://openweathermap.org/img/wn/50d.png", // fog
    Sand: "http://openweathermap.org/img/wn/50d.png", // sand
    Ash: "http://openweathermap.org/img/wn/50d.png", // ash
    Squall: "http://openweathermap.org/img/wn/50d.png", // squall
    Tornado: "http://openweathermap.org/img/wn/50d.png", // tornado
  };

  return weatherIcons[weather] || "http://openweathermap.org/img/wn/01d.png"; // default icon
}