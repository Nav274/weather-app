import axios from 'axios';
import { useState } from 'react';

function WeatherChecker(){

    const[lat,setlat]=useState("");
    const[lon,setlon]=useState("");
    const[location,setlocation]=useState("");
    const[weather,setweather]=useState('');
    const[weatherdesc,setweatherdesc]=useState('');
    const[maintemp,setmaintemp]=useState('');
    const[humidity,sethumid]=useState('');
    const[tempmin,settempmin]=useState('');
    const[tempmax,settempmax]=useState('');
    const[pressure,setpressure]=useState('');
    const[cityname,setcityname]=useState("");
    const [suggestions, setSuggestions] = useState([]);

;
    const GEO_API_KEY = "673c71a458497082307526eqw9207e1";
    const Weather_API_KEY = "5a6d7d95c3c05feeb9cfc06b919fcead";
    const Auto_Com_API_KEY = "9759a3c4a7a34069a2853288a0e29306";

    const getlatlon=()=>{

    axios.get(`https://geocode.maps.co/search?q=${location}&api_key=${GEO_API_KEY}`).then((response)=>{
        const latitude =response.data[0].lat;
        const longitude =response.data[0].lon;
        axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${Weather_API_KEY}`).then((res)=>{
                                                            setweather(res.data.weather[0].main)
                                                            setweatherdesc(res.data.weather[0].description)
                                                            setmaintemp(res.data.main.temp)
                                                            settempmin(res.data.main.temp_min)
                                                            settempmax(res.data.main.temp_max)
                                                            setpressure(res.data.main.pressure)
                                                            sethumid(res.data.main.humidity)
                                                            setcityname(res.data.name)})
                                                            .catch((err)=>alert(err.message));
        setlat(latitude)
        setlon(longitude)})
        .catch(()=>alert("Enter the correct location"));

   };

    const handleSubmit = (e)=>{
        e.preventDefault();
        if(location.trim()){
            getlatlon();
        }
        else{
            setlat('');
            setlon('');
            setlocation('');
            setweather('');
            setweatherdesc('');
            setmaintemp('');
            sethumid('');
            settempmin('');
            settempmax('');
            setpressure('');
            setcityname('');
            alert("Please enter a location");

    }
}

   const handleChange = async (e)=>{
    const value = e.target.value;
    setlocation(value);

    if (value) {

      try {
        const response = await axios.get(
          `https://api.geoapify.com/v1/geocode/autocomplete?text=${value}&format=json&apiKey=${Auto_Com_API_KEY}`
        );
        setSuggestions(response.data.results); 
      } catch (err) {
        console.error("Error fetching autocomplete suggestions:", err);
        setSuggestions([]);
      }
      
    } else {
      setSuggestions([]); 
    }
    
}

    const handleSuggestionClick = (suggestion) => {
        setlocation(suggestion.formatted); 
        setSuggestions([]); 
      };

      function handleReset(){
        setlocation('');
        setlat('');
        setlon('');
        setlocation('');
        setweather('');
        setweatherdesc('');
        setmaintemp('');
        sethumid('');
        settempmin('');
        settempmax('');
        setpressure('');
        setcityname('');
      }

     
return(

<div Style="text-align: center">

    <h1>Weather App</h1>

    <form onSubmit={handleSubmit}>
    <input type="text" id="lanlon" value={location} onChange={handleChange} placeholder="Enter the city name" Style="padding:10px; position:relative;margin-left:110px; text-align:center; font-size:20px; "/>
    
    <input type="reset" value="Clear" onClick={handleReset} Style="size:30px; padding:10px; margin:15px; font-size:20px;padding-left:20px; padding-right:20px;"></input>  <br/>

    <div 
        style={{
          width: "21%",
          margin: "auto",
          textAlign: "left",
          position: "relative",
        }}
      >
        {suggestions.length > 0 && (
          <ul
            style={{
              listStyleType: "none",
              margin: 0,
              padding: 0,
              backgroundColor: "white",
              border: "1px solid #ccc",
              maxHeight: "200px",
              overflowY: "scroll",
              position: "absolute",
              zIndex: 1,
              width: "100%",
            }}
          >
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                className="suggestion-item"
                onClick={() => handleSuggestionClick(suggestion)}
                style={{
                  padding: "10px",
                  cursor: "pointer",
                  borderBottom: "1px solid #ccc",
                }}
                onMouseEnter={(e) => (e.target.style.backgroundColor = "#eee")}
                onMouseLeave={(e) => (e.target.style.backgroundColor = "white")}
              >
                {suggestion.formatted}
              </li>
            ))}
          </ul>
        )}
        </div>

    <input type="submit" value="Submit" Style="size:30px; padding:10px; margin:15px; font-size:20px;padding-left:20px; padding-right:20px; float:center"></input>

    </form>
    
    <table border="3px solid" Style="margin:auto; margin-top:9px; font-size:25px; width:60% ;table-layout:fixed" >
    <caption Style="font-size:40px">Details</caption>
    <tr><td>Specific place </td> <td>{cityname}</td></tr>
    <tr><td>Latitude</td> <td>{lat}</td></tr>
    <tr><td>Longitude </td> <td> {lon}</td></tr>
    <tr><td>Current weather </td> <td>{weather}</td></tr>
    <tr><td>Weather discription </td> <td> {weatherdesc}</td></tr>
    <tr><td>Humidity  </td> <td> {humidity?humidity +"%":""} </td></tr>
    <tr><td>Temperature  </td> <td> {maintemp?maintemp +"°C":""}</td></tr>
    <tr><td>Maximum temperature  </td> <td> {tempmax?tempmax +"°C":""} </td></tr>
    <tr><td>Minimum temperature  </td> <td> {tempmin?tempmin +"°C":""} </td></tr>
    <tr><td>Atmospheric Pressure  </td> <td> {pressure?pressure +' hPa':""} </td></tr>
    </table>

   
<footer>
    <p>Developed by <a href="https://www.linkedin.com/in/naveen274/" target="_blank">V Naveen</a></p>
    <p>Github link <a href="https://github.com/Nav274" target="_blank">Nav274</a></p>
</footer>

</div>
);


}


export default WeatherChecker;