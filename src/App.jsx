import { useEffect, useState } from "react";

import Overview from "./components/Overview";
import Interpreter from "./components/Interpreter";
import LocationForm from "./components/LocationForm";
import Footer from "./components/Footer";

export default function App() {
  const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

  const [userLocation, setUserLocation] = useState('');
  const [weatherData, setWeatherData] = useState({});
  const [theme, setTheme] = useState('bg-gradient-to-b from-gray-800 to-gray-900');
  const [isCooldown, setIsCooldown] = useState(false);

  useEffect(() => {
    const reverseGeocode = async (lat, lon) => { // uses latitude and longitude to find user's closest settlement
      try {
        const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;
        const res = await fetch(url, {
          method: 'GET'
        })
        .then(res => res.json());

        return ( // returns location name or none if it cant find it
          res.address.city ||
          res.address.town ||
          res.address.village ||
          res.address.suburb || 
          res.address.county || 
          res.address.state || 
          null
        );
      } catch(err) {
        console.error(err);
      };
    };

    const getUserLocation = async () => { // uses geolocation to get user's location
      try {
        const pos = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });

        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        const locationName = await reverseGeocode(lat, lon);

        setUserLocation(locationName);
      } catch (err) {
        console.error(err);
      };
    };

    getUserLocation();
  }, []);

  useEffect(() => {
    const getWeatherData = async () => { // uses the settlement returned from reverseGeocode to fetch the weather for that area

      if (isCooldown) {
        window.alert("Please wait a few seconds before trying again")
        return;
      };

      try {
        setIsCooldown(true);

        const url1 = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${userLocation}&aqi=no`;
        const res1 = await fetch(url1, {
          method: 'GET',
        })
        .then(res1 => res1.json());

        const url2 = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${userLocation}&aqi=no`
        const res2 = await fetch(url2, {
          method: 'GET',
        })
        .then(res2 => res2.json());

        if (res1 && res2) {
          setWeatherData({
            tempC: res1.current.temp_c,
            tempF: res1.current.temp_f,
            windMph: res1.current.wind_mph,
            windKph: res1.current.wind_kph,
            cloudCover: res1.current.cloud,
            humidity: res1.current.humidity,
            precipitation: res2.forecast.forecastday[0].day.daily_chance_of_rain,
            condition: res1.current.condition.text,
          });
          selectTheme(res1.current.condition.code);
        };
      } catch(err) {
        console.error(err);
      };
    };

    if (userLocation) {
      setIsCooldown(true);
      setTimeout(() => setIsCooldown(false), 30000); // 30 sec cooldown

      getWeatherData();
    };
  }, [userLocation, apiKey]);

  const handleUserLocation = async (location) => {

    if (isCooldown) {
      window.alert("Please wait a few seconds before trying again");
      return;
    };

    try {
      setIsCooldown(true);

      const url1 = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}&aqi=no`;
        const res1 = await fetch(url1, {
          method: 'GET',
        })
        .then(res1 => res1.json());

        const url2 = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&aqi=no`
        const res2 = await fetch(url2, {
          method: 'GET',
        })
        .then(res2 => res2.json());

        if (res1 && res2) {
          setWeatherData({
            tempC: Math.round(res1.current.temp_c),
            tempF: Math.round(res1.current.temp_f),
            windMph: res1.current.wind_mph,
            windKph: res1.current.wind_kph,
            cloudCover: res1.current.cloud,
            humidity: res1.current.humidity,
            precipitation: res2.forecast.forecastday[0].day.daily_chance_of_rain,
            condition: res1.current.condition.text,
          });
          selectTheme(res1.current.condition.code);
        };
    } catch(err) {
      console.error(err);
    };
  };

  const selectTheme = (code) => {
    // build gradient based on weather conditions
    // --color-sun: #CDAD5A;
    // --color-sky-electric: #0874C1;
    // --color-sky-neutral: #6495ED;
    // --color-sky-dull: #81A5E7;
    // --color-cloud-light: #AAAAAA;
    // --color-cloud-dark: #454D54;

    const clearArr = [1000, 1003];
    const overcastArr = [1006, 1009, 1030, 1135, 1147];
    const darkCloudArr = [1063, 1072, 1150, 1153, 1180, 1183, 1186, 1189, 1192, 1195, 1198, 1201, 1240, 1243, 1246, 1273, 1276, 1279, 1282, 1114, 1117, 1171, 1258, 1264];
    const snowArr = [1066, 1069, 1072, 1168, 1171, 1204, 1207, 1210, 1213, 1216, 1219, 1222, 1225, 1237, 1255, 1258, 1261, 1264];

    const clear = 'bg-gradient-to-b from-sun via-sky-neutral to-sky-electric';
    const overcast = 'bg-gradient-to-b from-sky-dull to-cloud-light';
    const darkCloud = 'bg-gradient-to-b from-cloud-dark to-cloud-light';
    const snow = 'bg-gradient-to-b from-cloud-light to-snow';

    switch (true) {
      case clearArr.includes(code):
        setTheme(clear)
        break;
      case overcastArr.includes(code):
        setTheme(overcast)
        break;
      case darkCloudArr.includes(code):
        setTheme(darkCloud)
        break;
      case snowArr.includes(code):
        setTheme(snow)
        break;
    };
  };

  return (
    <div className={`h-screen w-full ${theme}`}>
      <h1 className="w-fit pt-4 lg:p-4 mx-auto lg:mx-0 text-5xl text-white">Weatherly</h1>

      <div className="flex flex-col sm:flex-col-reverse lg:flex-col gap-14 lg:gap-4 mt-16 sm:mt-28 lg:mt-44">
        <Overview weatherData={weatherData} />
        <LocationForm handleUserLocation={handleUserLocation} />
      </div>

      <Interpreter weatherData={weatherData} />

      <Footer />
    </div>
  );
};