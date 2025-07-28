const weatherData = {
    sunny: {
        icon: 'fas fa-sun',
        gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        particles: true
    },
    cloudy: {
        icon: 'fas fa-cloud',
        gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
        particles: false
    },
    rainy: {
        icon: 'fas fa-cloud-rain',
        gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        particles: true
    },
    night: {
        icon: 'fas fa-moon',
        gradient: 'linear-gradient(135deg, #2c3e50 0%, #4b6cb7 100%)',
        particles: true
    }
};

async function searchWeather() {
    const cityInput = document.getElementById('cityInput');
    const city = cityInput.value.trim();

    if (city === '') return;

    document.getElementById('loading').style.display = 'block';

    try {
        await updateWeather(city);
    } catch (error) {
        console.error("Failed to fetch weather data:", error);
        alert("Could not fetch weather data. Please check the city name and try again.");
    } finally {
        document.getElementById('loading').style.display = 'none';
    }
}

async function updateWeather(city) {
    const apiKey = 'YOUR_API_KEY'; // Replace with your actual API key check in weather.api to get free api key
    const currentUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=yes`;
    const forecastUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=7&aqi=yes&alerts=no`;

    const currentResponse = await fetch(currentUrl);
    if (!currentResponse.ok) throw new Error('City not found');
    const currentData = await currentResponse.json();

    const forecastResponse = await fetch(forecastUrl);
    if (!forecastResponse.ok) throw new Error('Forecast fetch failed');
    const forecastData = await forecastResponse.json();

    const current = currentData.current;

    document.getElementById('temperature').textContent = `${Math.round(current.temp_c)}°C`;
    document.getElementById('description').textContent = current.condition.text;
    document.getElementById('humidity').textContent = `${current.humidity}%`;
    document.getElementById('windSpeed').textContent = `${current.wind_kph} km/h`;
    document.getElementById('pressure').textContent = `${current.pressure_mb} hPa`;
    document.getElementById('visibility').textContent = `${current.vis_km} km`;
    document.getElementById('feelsLike').textContent = `${Math.round(current.feelslike_c)}°C`;
    document.getElementById('uvIndex').textContent = current.uv;

    const forecastList = document.getElementById('forecastList');
    forecastList.innerHTML = '';

    forecastData.forecast.forecastday.forEach((day, index) => {
        if (index === 0) return;
        const dayName = new Date(day.date).toLocaleDateString('en-US', { weekday: 'long' });
        const forecastItem = document.createElement('div');
        forecastItem.className = 'forecast-item';
        forecastItem.innerHTML = `
            <span class="forecast-day">${dayName}</span>
            <img src="https:${day.day.condition.icon}" alt="${day.day.condition.text}" style="width: 40px; height: 40px;">
            <span class="forecast-temp">${Math.round(day.day.avgtemp_c)}°C</span>
        `;
        forecastList.appendChild(forecastItem);
    });

    updateWeatherAppearance(current.condition.code, current.is_day);
}

function updateWeatherAppearance(conditionCode, isDay) {
    const bg = document.getElementById('weatherBackground');
    const weatherIcon = document.getElementById('weatherIcon');
    let weatherStyle;

    const rainCodes = [1063, 1066, 1069, 1072, 1150, 1153, 1168, 1171, 1180, 1183, 1186, 1189, 1192, 1195, 1240, 1243, 1246, 1273, 1276];
    const cloudyCodes = [1003, 1006, 1009, 1030, 1135, 1147];
    const clearCode = 1000;

    if (isDay === 0) {
        weatherStyle = weatherData.night;
    } else if (rainCodes.includes(conditionCode)) {
        weatherStyle = weatherData.rainy;
    } else if (cloudyCodes.includes(conditionCode)) {
        weatherStyle = weatherData.cloudy;
    } else if (conditionCode === clearCode) {
        weatherStyle = weatherData.sunny;
    } else {
        weatherStyle = weatherData.cloudy;
    }

    bg.style.background = weatherStyle.gradient;
    weatherIcon.innerHTML = `<i class="${weatherStyle.icon}"></i>`;

    const particlesContainer = document.getElementById('particles');
    particlesContainer.innerHTML = '';
    if (weatherStyle.particles) {
        createParticles();
    }
}

function createParticles() {
    const particlesContainer = document.getElementById('particles');
    particlesContainer.innerHTML = '';

    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.width = particle.style.height = Math.random() * 5 + 2 + 'px';
        particle.style.animationDuration = Math.random() * 10 + 5 + 's';
        particle.style.animationDelay = Math.random() * 5 + 's';
        particlesContainer.appendChild(particle);
    }
}

document.getElementById('cityInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchWeather();
    }
});
