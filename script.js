const API_KEY = 'c54ff25d4cc322964bd219065fc2742d'; // Ganti dengan API key Anda
        const weatherInfo = document.querySelector('.weather-info');
        const errorMessage = document.querySelector('.error-message');
        const loading = document.querySelector('.loading');
        const themeToggle = document.querySelector('.theme-toggle');

        function toggleTheme() {
            const html = document.documentElement;
            const currentTheme = html.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            const icon = themeToggle.querySelector('i');

            html.setAttribute('data-theme', newTheme);
            icon.className = newTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
            localStorage.setItem('theme', newTheme);
        }

        function loadTheme() {
            const savedTheme = localStorage.getItem('theme') || 'light';
            document.documentElement.setAttribute('data-theme', savedTheme);
            themeToggle.querySelector('i').className = savedTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
        }

        async function getWeatherData(query) {
            try {
                loading.style.display = 'block';
                errorMessage.style.display = 'none';
                weatherInfo.classList.remove('active');

                const response = await fetch(`https://api.weatherstack.com/current?access_key=${API_KEY}&query=${query}`);
                const data = await response.json();

                if (data.error) {
                    throw new Error(data.error.info);
                }

                displayWeatherData(data);
            } catch (error) {
                showError(error.message);
            } finally {
                loading.style.display = 'none';
            }
        }

        function displayWeatherData(data) {
            const current = data.current;
            const location = data.location;

            document.getElementById('location-text').textContent = `${location.name}, ${location.country}`;
            document.getElementById('temperature').textContent = current.temperature;
            document.getElementById('weather-description').textContent = current.weather_descriptions[0];
            document.getElementById('wind-speed').textContent = `${current.wind_speed} km/h`;
            document.getElementById('humidity').textContent = `${current.humidity}%`;
            document.getElementById('cloud-cover').textContent = `${current.cloudcover}%`;
            document.getElementById('pressure').textContent = `${current.pressure} mb`;

            weatherInfo.classList.add('active');
        }

        function showError(message) {
            errorMessage.textContent = message;
            errorMessage.style.display = 'block';
            weatherInfo.classList.remove('active');
        }

        function searchWeather() {
            const searchInput = document.getElementById('search-input');
            const query = searchInput.value.trim();

            if (query) {
                getWeatherData(query);
            } else {
                showError('Please enter a location');
            }
        }

        function getLocation() {
            if (navigator.geolocation) {
                loading.style.display = 'block';
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const query = `${position.coords.latitude},${position.coords.longitude}`;
                        getWeatherData(query);
                    },
                    (error) => {
                        showError('Unable to retrieve your location');
                        loading.style.display = 'none';
                    }
                );
            } else {
                showError('Geolocation is not supported by your browser');
            }
        }

        document.getElementById('search-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                searchWeather();
            }
        });

        loadTheme();