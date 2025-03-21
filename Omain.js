// Current Weather Functions
const currentUrl = 'https://api.openweathermap.org/data/2.5/weather';
const forecastUrl = 'https://api.openweathermap.org/data/2.5/forecast';
const apiKey = 'f00c38e0279b7bc85480c3fe775d518c';

$(document).ready(function () {
    getCurrentWeather('Amsterdam');
    getWeatherForecast('Amsterdam');
});

// Current Weather Implementation
async function getCurrentWeather(city) {
    const query = `${currentUrl}?q=${city}&appid=${apiKey}&units=metric`;
    try {
        const res = await fetch(query);
        const data = await res.json();
        if (res.ok) {
            showCurrentWeather(data);
        } else {
            alert('City not found. Please try again.');
        }
    } catch (error) {
        console.error('Error fetching current weather:', error);
    }
}

function showCurrentWeather(data) {
    $('#city-name').text(data.name);
    $('#date').text(moment().format('MMMM Do YYYY, h:mm:ss a'));
    $('#temperature').html(`${data.main.temp}°C`);
    $('#description').text(data.weather[0].description);
    $('#wind-speed').html(`Wind Speed: ${data.wind.speed} m/s`);
    $('#weather-icon').attr('src', `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`);
    $('#weather-info').fadeIn();
}

// 5-Day Forecast Implementation
async function getWeatherForecast(city) {
    const query = `${forecastUrl}?q=${city}&appid=${apiKey}&units=metric`;
    try {
        const res = await fetch(query);
        const data = await res.json();
        if (res.ok) {
            showWeatherForecast(data);
        } else {
            alert('City forecast not found');
        }
    } catch (error) {
        console.error('Error fetching forecast:', error);
    }
}

function showWeatherForecast(data) {
    const forecastContainer = $('#forecast-container');
    forecastContainer.empty();

    // Filter to get one entry per day (using midday forecast)
    const dailyForecasts = data.list.filter(item => 
        item.dt_txt.includes('12:00:00')
    );

    dailyForecasts.forEach(day => {
        const date = moment(day.dt * 1000).format('ddd, MMM D');
        const temp = Math.round(day.main.temp);
        const icon = day.weather[0].icon;
        const description = day.weather[0].description;

        const forecastCard = `
            <div class="forecast-card">
                <div class="forecast-date">${date}</div>
                <img class="forecast-icon" 
                     src="http://openweathermap.org/img/wn/${icon}@2x.png" 
                     alt="${description}">
                <div class="forecast-temp">${temp}°C</div>
                <div class="forecast-desc">${description}</div>
            </div>
        `;

        forecastContainer.append(forecastCard);
    });
}