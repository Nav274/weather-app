import axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import './WeatherChecker.css';

// Background images for weather conditions
const weatherImages = {
  Clear: 'https://media.istockphoto.com/id/476263042/photo/fluffy-clouds-in-the-sky.jpg?s=612x612&w=0&k=20&c=XcNQ8dq2FhC518Ef1hkOwrblUz5GxVhBo-AYuHV6fFI=',
  Clouds: 'https://media.istockphoto.com/id/645173476/photo/cirrocumulus-clouds-cloudscape.jpg?s=612x612&w=0&k=20&c=frZAiiluhRNQF-7rdiztwrvP3Ly95d081uvN-xwSefY=',
  Rain: 'https://media.istockphoto.com/id/1476189983/photo/summer-rain-raindrops-bad-weather-depression.jpg?s=612x612&w=0&k=20&c=IwJXd2bk5O65aF5XZwoB-WJiFpCIrmbZltgbQTXNNkk=',
  Thunderstorm: 'https://img.freepik.com/free-photo/weather-effects-collage-concept_23-2150062064.jpg?semt=ais_incoming&w=740&q=80',
  Snow: 'https://media.istockphoto.com/id/533292615/photo/alley-in-snowy-morning.jpg?s=612x612&w=0&k=20&c=LKQgMoqdgHP5PkelvEMdwXhCMG_M1XhGoFT27-Hjrk4=',
  Mist: 'https://media.istockphoto.com/id/1439000190/photo/misty-mountain-landscape.jpg?s=612x612&w=0&k=20&c=XBazVdcQrXeqYlEThB2RUgLfQcOjBcwZriLdDxNkUNY=',
  default: 'https://media.istockphoto.com/id/1007768414/photo/blue-sky-with-bright-sun-and-clouds.jpg?s=612x612&w=0&k=20&c=MGd2-v42lNF7Ie6TtsYoKnohdCfOPFSPQt5XOz4uOy4='
};

const defaultBg = weatherImages.default;

function WeatherChecker() {
  const [lat, setLat] = useState('');
  const [lon, setLon] = useState('');
  const [location, setLocation] = useState('');
  const [weather, setWeather] = useState('');
  const [weatherDesc, setWeatherDesc] = useState('');
  const [mainTemp, setMainTemp] = useState('');
  const [humidity, setHumidity] = useState('');
  const [tempMin, setTempMin] = useState('');
  const [tempMax, setTempMax] = useState('');
  const [pressure, setPressure] = useState('');
  const [cityName, setCityName] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [windspeed, setWindSpeed] = useState('');
  const [winddegree, setWindDegree] = useState('');

  const [currentBg, setCurrentBg] = useState(defaultBg);
  const [fade, setFade] = useState(true);

  const inputRef = useRef(null);

  const GEO_API_KEY = "673c71a458497082307526eqw9207e1";
  const WEATHER_API_KEY = "5a6d7d95c3c05feeb9cfc06b919fcead";
  const AUTO_COM_API_KEY = "9759a3c4a7a34069a2853288a0e29306";

  // On component mount set default background
  useEffect(() => {
    setCurrentBg(defaultBg);
    setFade(true);
  }, []);

  // Handle fade transition for background image on weather change
  useEffect(() => {
    if (!weather) {
      return;
    }

    const bgUrl = weatherImages[weather] || defaultBg;

    // Start fade out
    setFade(false);

    // Change background after fade out duration
    const timeout = setTimeout(() => {
      setCurrentBg(bgUrl);
      setFade(true);
    }, 600);

    return () => clearTimeout(timeout);
  }, [weather]);

  // Close suggestions if clicking outside input/suggestions
  useEffect(() => {
    function handleClickOutside(e) {
      if (inputRef.current && !inputRef.current.contains(e.target)) {
        setSuggestions([]);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getLatLon = () => {
    axios
      .get(`https://geocode.maps.co/search?q=${location}&api_key=${GEO_API_KEY}`)
      .then((response) => {
        if (!response.data[0]) {
          throw new Error("Location not found");
        }
        const latitude = response.data[0].lat;
        const longitude = response.data[0].lon;
        axios
          .get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${WEATHER_API_KEY}`
          )
          .then((res) => {
            setWeather(res.data.weather[0].main || '');
            setWeatherDesc(res.data.weather[0].description || '');
            setMainTemp(res.data.main.temp || '');
            setTempMin(res.data.main.temp_min || '');
            setTempMax(res.data.main.temp_max || '');
            setPressure(res.data.main.pressure || '');
            setHumidity(res.data.main.humidity || '');
            setCityName(res.data.name || '');
            setWindSpeed(res.data.wind.speed || '');
            setWindDegree(res.data.wind.deg || '')
          })
          .catch((err) => alert(err.message));
        setLat(latitude);
        setLon(longitude);
      })
      .catch(() => alert("Enter a correct location"));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (location.trim()) {
      getLatLon();
    } else {
      handleReset();
      alert("Please enter a location");
    }
  };

  const handleChange = async (e) => {
    const value = e.target.value;
    setLocation(value);
    if (value) {
      try {
        const response = await axios.get(
          `https://api.geoapify.com/v1/geocode/autocomplete?text=${value}&format=json&apiKey=${AUTO_COM_API_KEY}`
        );
        setSuggestions(response.data.results || []);
      } catch (err) {
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setLocation(suggestion.formatted);
    setSuggestions([]);
  };

  const handleReset = () => {
    setLocation('');
    setLat('');
    setLon('');
    setWeather('');
    setWeatherDesc('');
    setMainTemp('');
    setHumidity('');
    setTempMin('');
    setTempMax('');
    setPressure('');
    setCityName('');
    setWindDegree('');
    setWindSpeed('');
    setSuggestions([]);

    setFade(false);
    setTimeout(() => {
      setCurrentBg(defaultBg);
      setFade(true);
    }, 600);
  };

  return (
    <>
      <div
        className={`background-image ${fade ? '' : 'fade-out'}`}
        style={{ backgroundImage: `url(${currentBg})` }}
      />
      <div className="weather-checker-container" ref={inputRef}>
        <h1 className="weather-title">Weather Checker</h1>
        {/* ...above code unchanged... */}

      <form onSubmit={handleSubmit} className="input-group" autoComplete="off">
        <input
          type="text"
          value={location}
          onChange={handleChange}
          placeholder="Enter city or place"
          className="weather-input"
        />
        {suggestions.length > 0 && (
          <div className="suggestion-list">
            {suggestions.map((suggestion, idx) => (
              <div
                key={idx}
                className="suggestion-item"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion.formatted}
              </div>
            ))}
          </div>
        )}
        <div className="button-group">
          <button type="submit">Check Weather</button>
          <button type="button" onClick={handleReset}>Reset</button>
        </div>
      </form>

      {cityName && (  /* Only show weather details if cityName is non-empty */
        <table className="weather-info-table">
          <tbody>
            <tr><th>Specific place</th><td>{cityName}</td></tr>
            <tr><th>Latitude</th><td>{lat}</td></tr>
            <tr><th>Longitude</th><td>{lon}</td></tr>
            <tr><th>Current weather</th><td>{weather}</td></tr>
            <tr><th>Weather description</th><td>{weatherDesc}</td></tr>
            <tr><th>Humidity</th><td>{humidity ? humidity + "%" : ""}</td></tr>
            <tr><th>Temperature</th><td>{mainTemp ? mainTemp + "°C" : ""}</td></tr>
            <tr><th>Max temperature</th><td>{tempMax ? tempMax + "°C" : ""}</td></tr>
            <tr><th>Min temperature</th><td>{tempMin ? tempMin + "°C" : ""}</td></tr>
            <tr><th>Pressure</th><td>{pressure ? pressure + " hPa" : ""}</td></tr>
            <tr><th>Wind Speed</th><td>{windspeed ? windspeed  + " Km/hr" : ""}</td></tr>
            <tr><th>Wind Degree</th><td>{winddegree ? winddegree + " degree" : ""}</td></tr>
          </tbody>
        </table>
  )}

      </div>

      <div className="footer-container">
        <p className="footer-linkdin">
          Developed by- <a href="https://www.linkedin.com/in/naveen274/" target="_blank" rel="noopener noreferrer">V Naveen</a>
        </p>
        <p className="footer-githb">
          <a href="https://github.com/Nav274/weather-app" target="_blank" rel="noopener noreferrer"> GitHub link</a>
        </p>
      </div>

    </>
  );
}

export default WeatherChecker;





