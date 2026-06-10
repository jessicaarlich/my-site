// Weather widget using Open-Meteo (no API key). Uses browser geolocation.
(function(){
  const tempEl = document.getElementById('weather-temp');
  const condEl = document.getElementById('weather-cond');
  const emojiEl = document.getElementById('weather-emoji');
  const noteEl = document.getElementById('weather-note');

  const codeMap = {
    0: ['☀️','clear sky'],
    1: ['🌤️','mainly clear'],
    2: ['⛅','partly cloudy'],
    3: ['☁️','overcast'],
    45: ['🌫️','fog'],
    48: ['🌫️','depositing rime fog'],
    51: ['🌦️','light drizzle'],
    53: ['🌦️','moderate drizzle'],
    55: ['🌧️','dense drizzle'],
    56: ['🌧️','light freezing drizzle'],
    57: ['🌧️','dense freezing drizzle'],
    61: ['🌧️','slight rain'],
    63: ['🌧️','moderate rain'],
    65: ['🌧️','heavy rain'],
    66: ['🥶','light freezing rain'],
    67: ['🥶','heavy freezing rain'],
    71: ['🌨️','slight snow'],
    73: ['🌨️','moderate snow'],
    75: ['🌨️','heavy snow'],
    77: ['🌨️','snow grains'],
    80: ['🌦️','rain showers'],
    81: ['🌧️','moderate showers'],
    82: ['⛈️','violent showers'],
    85: ['🌨️','slight snow showers'],
    86: ['🌨️','heavy snow showers'],
    95: ['⛈️','thunderstorm'],
    96: ['⛈️','thunderstorm with slight hail'],
    99: ['⛈️','thunderstorm with heavy hail']
  };

  function setWeather({temp,code}){
    if(!tempEl||!condEl||!emojiEl||!noteEl) return;
    tempEl.textContent = Math.round(temp) + '°F';
    const info = codeMap[code] || ['🌈','weather'];
    emojiEl.textContent = info[0];
    emojiEl.setAttribute('role','img');
    emojiEl.setAttribute('aria-label', info[1]);
    condEl.textContent = info[1];
    noteEl.textContent = '';
  }

  function setError(msg){
    if(!condEl||!noteEl) return;
    condEl.textContent = msg;
    noteEl.textContent = '';
  }

  if(!('geolocation' in navigator)){
    setError('Geolocation not supported');
  } else {
    navigator.geolocation.getCurrentPosition(async pos=>{
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;
      try{
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&temperature_unit=fahrenheit&timezone=auto`;
        const res = await fetch(url);
        if(!res.ok) throw new Error('Weather fetch failed');
        const data = await res.json();
        if(data && data.current_weather){
          setWeather({temp: data.current_weather.temperature, code: data.current_weather.weathercode});
        } else {
          setError('No weather data');
        }
      }catch(e){ setError('Weather unavailable'); }
    }, err=>{ setError('Location permission denied'); });
  }
})();
