import { useEffect, useState } from "react";

import Overview from "./components/Overview";

export default function App() {
  const apiKey = import.meta.env.VITE_API_KEY

  const [userLocation, setUserLocation] = useState('')
  const [weatherData, setWeatherData] = useState({})
  const [theme, setTheme] = useState('bg-gradient-to-b from-gray-800 to-gray-900');

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
        const lon = pos.coords.longitude

        const locationName = await reverseGeocode(lat, lon);

        setUserLocation(locationName);
      } catch (err) {
        console.error(err);
      };
    };

    getUserLocation()
  }, []);

  useEffect(() => {
    const getWeatherData = async () => { // uses the settlement returned from reverseGeocode to fetch the weather for that area
      try {
        const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${userLocation}&aqi=yes`;
        const res = await fetch(url, {
          method: 'GET'
        })
        .then(res => res.json());

        if (res.current) {
          setWeatherData(res.current);
          selectTheme(res.current.condition.code)
        };
      } catch(err) {
        console.error(err);
      };
    };

    if (userLocation) {
      getWeatherData();
    };
  }, [userLocation]);

  const selectTheme = (code) => {
    // build tailwind gradient based on weather conditions
    //   --color-grey: #ccc;
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

    console.log('code', code)

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
    }

    console.log(theme)
  };

  return (
    <div className={`h-screen w-full ${theme}`}>
      <h1 className="w-full p-4 text-5xl text-white">Weatherly</h1>

      <Overview weatherData={weatherData} />
    </div>
  );
};