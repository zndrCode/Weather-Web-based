//Final Version
function getWeather() {
    const apiKey = 'YOUR API';
    const city = document.getElementById('city').value;

    if (!city) {
        alert('Please enter a location');
        return;
    }

    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    const tempDivInfo = document.getElementById('temp-div');
    const weatherInfoDiv = document.getElementById('weather-info');
    const weatherIcon = document.getElementById('weather-icon');
    const hourlyForecastDiv = document.getElementById('hourly-forecast');
    if (tempDivInfo) tempDivInfo.innerHTML = '';

    if (weatherInfoDiv) weatherInfoDiv.innerHTML = '<p>Loading...</p>';
    if (weatherIcon) { weatherIcon.style.display = 'none'; weatherIcon.src = ''; }
    if (hourlyForecastDiv) hourlyForecastDiv.innerHTML = '';

    fetch(currentWeatherUrl)
        .then(response => response.json())
        .then(data => {
            if (data.cod && data.cod !== 200 && data.cod !== '200') {
                throw new Error(data.message || 'Unknown error');
            }
            displayWeather(data);
        })
        .catch(error => {
            if (weatherInfoDiv) weatherInfoDiv.innerHTML = `<p>Error: ${error.message}</p>`;
            if (tempDivInfo) tempDivInfo.innerHTML = '';
            if (weatherIcon) weatherIcon.style.display = 'none';
            if (hourlyForecastDiv) hourlyForecastDiv.innerHTML = '';
            console.error('Error fetching current weather data:', error);
        });

    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => {
            if (data.cod && data.cod !== '200' && data.cod !== 200) {
                throw new Error(data.message || 'Unknown error');
            }
            displayHourlyForecast(data);
        })
        .catch(error => {
            if (hourlyForecastDiv) hourlyForecastDiv.innerHTML = `<p>Error: ${error.message}</p>`;
            console.error('Error fetching hourly forecast data:', error);
        });
}

function displayWeather(data) {
    const tempDivInfo = document.getElementById('temp-div');
    const weatherInfoDiv = document.getElementById('weather-info');
    const weatherIcon = document.getElementById('weather-icon');
    const hourlyForecastDiv = document.getElementById('hourly-forecast');

    // Clear previous content
    weatherInfoDiv.innerHTML = '';
    hourlyForecastDiv.innerHTML = '';
    tempDivInfo.innerHTML = '';

    if (data.cod === '404') {
        weatherInfoDiv.innerHTML = `<p>${data.message}</p>`;
    } else {
        const cityName = data.name;
        const temperature = Math.round(data.main.temp);
        const description = data.weather[0].description;
        const iconCode = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

        const temperatureHTML = `
        <p>${temperature}°C</p>
        `;

        const weatherHTML = `
            <p>${cityName}</p>
            <p>${description}</p>
        `;

        tempDivInfo.innerHTML = temperatureHTML;
        weatherInfoDiv.innerHTML = weatherHTML;
        weatherIcon.src = iconUrl;
        weatherIcon.alt = description;
        weatherIcon.onerror = function () { this.style.display = 'none'; };
        showImage();
    }
}

function displayHourlyForecast(hourlyData) {

    const hourlyForecastDiv = document.getElementById('hourly-forecast');
    hourlyForecastDiv.innerHTML = '';
    if (!hourlyForecastDiv || !hourlyData.list) return;
    const next24hours = hourlyData.list.slice(0, 8);
    let hourlyHtml = '';

    next24hours.forEach(item => {
        const dateTime = new Date(item.dt * 1000);
        const hour = dateTime.getHours();
        const temperature = Math.round(item.main.temp); // Already in Celsius
        const iconCode = item.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;
        hourlyHtml += `
            <div class="hourly-item">
                <span>${hour}:00</span>
                <img src="${iconUrl}" alt="Hourly Weather Icon" onerror="this.style.display='none'">
                <span>${temperature}°C</span>
            </div>
        `;
    });
    hourlyForecastDiv.innerHTML = hourlyHtml;
}

function showImage() {

    const weatherIcon = document.getElementById('weather-icon');
    if (weatherIcon) weatherIcon.style.display = 'block';
}
