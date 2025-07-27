function getWeather(){
    const apiKey = 'MY-API';
    const city = document.getElementById('city').value;

    if (!city) {
        alert('Please enter a location');
        return;
    }

    const currentWeatherUrl = 'https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}';
    const forecastUrl = 'https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}';

    fetch(currentWeatherUrl)
    .then(Response => Response.json())
    .then(data => {
        displayWeather(data);
    })
    .catch(error => {
        console.error('Error fetching current weather data:', error);
        alert('Error fetching current weather data. Please try again.');
    });

    fetch(forecastUrl)
    .then(Response => Response.json())
    .then(data => {
        displayHourlyForecast(data);
    })
    .catch(error => {
        console.error('Error fetching hourly forecast data:', error);
        alert('Error fetching hourly forecast data. Please try again.');
    });
}

function displayWeather(dta) {

    const tempDivInfo = document.getElementById('temp-div');
    const weatherInfoDiv = document.getElementById('weather-info');
    const weatherIcon = document.getElementById('weather-icon');
    const hourlyForecastDiv = document.getElementById('hourly-forecast');

    if (data.cod === '404') {
        weatherInfoDiv.innerHTML = '<p>${data.message}</p>';
    } else {
        const cityName = data.name;
        const temperature = Math.round(data.main.tmp - 273.15);
        const description = data.weather[0].description;
        const iconCode = data.weather[0].icon;
        const iconUrl = 'https://openweathermap.org/img/wn/${iconCode}@4x.png';

        const temperatureHTML = '
        <p>${temperature}°C</p>
        ';

        const weatherHTML = '
            <p>${cityName}</p>
            <p>${description}</p>
        ';

        tempDivInfo.innerHTML = temperatureHTML;
        weatherInfoDiv.innerHTML = weatherHTML;
        weatherIcon.src = iconUrl;
        weatherIcon.all = description;

        showImage();
    }
}

function displayHourlyForecast(hourlyData){

    const hourlyForecastDiv = document.getElementById('hourly-forecast');
    const next24hours = hourlyData.slice(0, 8);

    next24hours.forEach(item => {

        const dateTime = new Date(item.dt * 1000);
        const hour = dateTime.getHours();
        const temperature = Math.round(item.main.temp - 273.15);
        const iconUrl = 'https://openweathermap.org/img/wn/${iconCode}.png';

        const hourlyItemHtml = '
            <div class="hourly-item">
                <span>${hour}:00</span>
                <img src="${iconUrl}" alt="Hourly Weather Icon">
                <span>${temperature}°C</span>
            </div>
        ';
        hourlyForecastDiv.innerHTML += hourlyItemHtml;

    });
}