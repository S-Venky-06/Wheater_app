
const locationElement = document.getElementById('location');
const dateElement = document.getElementById('date');
const timeElement = document.getElementById('time');
const weatherIconElement = document.getElementById('weather-icon');
const temperatureElement = document.getElementById('temperature');
const descriptionElement = document.getElementById('weather-description');
const humidityElement = document.getElementById('humidity');
const windSpeedElement = document.getElementById('wind-speed');
const feelsLikeElement = document.getElementById('feels-like');
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const container = document.querySelector('.container');
const body = document.body;


const apiKey = '746c380e2d91efeb8e4ebd187a4845b3'; 
const baseURL = 'https://api.openweathermap.org/data/2.5/weather';


function updateWeatherUI(data) {
    locationElement.textContent = data.name; 
    temperatureElement.textContent = `${Math.round(data.main.temp)}°C`;
    descriptionElement.textContent = data.weather[0].description;
    humidityElement.textContent = `${data.main.humidity}%`;
    windSpeedElement.textContent = `${data.wind.speed} km/h`;
    feelsLikeElement.textContent = `${Math.round(data.main.feels_like)}°C`;
}


async function fetchWeatherData(city = 'New York') {
    try {
        const response = await fetch(`${baseURL}?q=${city}&appid=${apiKey}&units=metric`);
        if (!response.ok) {
            throw new Error('City not found');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        alert(error.message);
    }
}


searchButton.addEventListener('click', async () => {
    const city = searchInput.value.trim();
    if (city) {
        const data = await fetchWeatherData(city);
        if (data) {
            updateWeatherUI(data);
        }
        searchInput.value = '';
    }
});


searchInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        searchButton.click();
    }
});


async function initialize() {
    updateDateTime();
    const data = await fetchWeatherData();
    if (data) {
        updateWeatherUI(data);
    }

    
    setInterval(updateDateTime, 60000);

    
    setInterval(async () => {
        const city = locationElement.textContent;
        if (city) {
            const newData = await fetchWeatherData(city);
            if (newData) {
                updateWeatherUI(newData);
            }
        }
    }, 1800000);
}


function updateDateTime() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const timeString = `${hours}:${minutes}`;

    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateString = now.toLocaleDateString('en-US', options);

    timeElement.textContent = timeString;
    dateElement.textContent = dateString;

    
    applyTheme(hours);
}


function applyTheme(hours) {
    if (hours >= 6 && hours < 18) {
        body.classList.add('day-theme');
        body.classList.remove('night-theme');
        container.classList.add('day-container');
        container.classList.remove('night-container');
        weatherIconElement.innerHTML = '☀️';
    } else {
        body.classList.add('night-theme');
        body.classList.remove('day-theme');
        container.classList.add('night-container');
        container.classList.remove('day-container');
        weatherIconElement.innerHTML = '🌙';
    }
}


initialize();
