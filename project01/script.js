document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    
    const cityInput = document.getElementById('city-input');
    const searchBtn = document.getElementById('search-btn');
    const clearBtn = document.getElementById('clear-btn');
    const tempEl = document.getElementById('temp');
    const locationEl = document.getElementById('location');
    const descriptionEl = document.getElementById('description');
    const humidityEl = document.getElementById('humidity');
    const windEl = document.getElementById('wind');
    const mainIconContainer = document.getElementById('main-icon');
    const spinner = document.getElementById('spinner');
    const searchIcon = searchBtn.querySelector('[data-lucide="search"]');

    const weatherMap = {
        0: { icon: 'sun', text: 'Trời quang', theme: 'clear' },
        1: { icon: 'cloud-sun', text: 'Ít mây', theme: 'clear' },
        2: { icon: 'cloud-sun', text: 'Bán quang', theme: 'cloudy' },
        3: { icon: 'cloud', text: 'Nhiều mây', theme: 'cloudy' },
        45: { icon: 'cloud-fog', text: 'Sương mù', theme: 'cloudy' },
        48: { icon: 'cloud-fog', text: 'Sương muối', theme: 'cloudy' },
        51: { icon: 'cloud-drizzle', text: 'Mưa phùn nhẹ', theme: 'rainy' },
        53: { icon: 'cloud-drizzle', text: 'Mưa phùn vừa', theme: 'rainy' },
        55: { icon: 'cloud-drizzle', text: 'Mưa phùn nặng', theme: 'rainy' },
        61: { icon: 'cloud-rain', text: 'Mưa nhẹ', theme: 'rainy' },
        63: { icon: 'cloud-rain', text: 'Mưa vừa', theme: 'rainy' },
        65: { icon: 'cloud-rain', text: 'Mưa to', theme: 'rainy' },
        71: { icon: 'cloud-snow', text: 'Tuyết rơi nhẹ', theme: 'snowy' },
        73: { icon: 'cloud-snow', text: 'Tuyết rơi vừa', theme: 'snowy' },
        75: { icon: 'cloud-snow', text: 'Tuyết rơi nặng', theme: 'snowy' },
        80: { icon: 'cloud-rain', text: 'Mưa rào nhẹ', theme: 'rainy' },
        81: { icon: 'cloud-rain', text: 'Mưa rào vừa', theme: 'rainy' },
        82: { icon: 'cloud-rain', text: 'Mưa rào to', theme: 'rainy' },
        95: { icon: 'cloud-lightning', text: 'Dông sét', theme: 'rainy' },
    };

    async function getWeatherData(city) {
        setLoading(true);
        try {
            // 1. Geocoding
            const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city)}&limit=1`);
            const geoData = await geoRes.json();

            if (!geoData.length) throw new Error('Không tìm thấy thành phố');

            const { lat, lon, display_name } = geoData[0];
            const cityName = display_name.split(',')[0];

            // 2. Weather Data
            const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=relativehumidity_2m`);
            const weatherData = await weatherRes.json();

            updateUI(weatherData.current_weather, cityName, weatherData.hourly.relativehumidity_2m[0]);
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    }

    function updateUI(data, cityName, humidity) {
        const info = weatherMap[data.weathercode] || { icon: 'help-circle', text: 'Không xác định', theme: 'clear' };
        
        tempEl.textContent = `${Math.round(data.temperature)}°C`;
        locationEl.textContent = cityName;
        descriptionEl.textContent = info.text;
        humidityEl.textContent = `${humidity}%`;
        windEl.textContent = `${data.windspeed} km/h`;

        // Update Theme
        document.body.setAttribute('data-theme', info.theme);

        // Update Icon
        mainIconContainer.innerHTML = `<i data-lucide="${info.icon}" size="80"></i>`;
        lucide.createIcons();
    }

    function setLoading(isLoading) {
        if (isLoading) {
            spinner.style.display = 'block';
            searchIcon.style.display = 'none';
        } else {
            spinner.style.display = 'none';
            searchIcon.style.display = 'block';
        }
    }

    searchBtn.addEventListener('click', () => {
        if (cityInput.value) getWeatherData(cityInput.value);
    });

    clearBtn.addEventListener('click', () => {
        cityInput.value = '';
        clearBtn.classList.remove('visible');
        cityInput.focus();
    });

    cityInput.addEventListener('input', () => {
        if (cityInput.value.length > 0) {
            clearBtn.classList.add('visible');
        } else {
            clearBtn.classList.remove('visible');
        }
    });

    cityInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && cityInput.value) getWeatherData(cityInput.value);
    });

    // Default city
    getWeatherData('Hanoi');
});
