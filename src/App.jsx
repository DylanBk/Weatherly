import { useEffect, useState } from "react";

import Overview from "./components/Overview";

export default function App() {
  const apiKey = import.meta.env.VITE_API_KEY
  const [userLocation, setUserLocation] = useState(null)
  const [weatherData, setWeatherData] = useState({})
  const [theme, setTheme] = useState(null)

  useEffect(() => {
    const reverseGeocode = async (lat, lon) => { // uses latitude and longitude to find user's closest settlement
      try {
        const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;
        const res = await fetch(url, {
          method: 'GET'
        })
        .then(res => res.json());

        return ( // returns location name or unknown if it cant find it
          res.address.city ||
          res.address.town ||
          res.address.village ||
          res.address.suburb || 
          res.address.county || 
          res.address.state || 
          'Unknown Location'
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
      }
    };

    const getWeatherData = async (userLocation) => { // uses the settlement returned from reverseGeocode to fetch the weather for that area
      try {
        const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${userLocation}&aqi=yes`;
        const res = await fetch(url, {
          method: 'GET'
        })
        .then(res => res.json());

        if (res.ok) {
          console.log(res)
          setWeatherData(res);
        };
      } catch(err) {
        console.error(err);
      };
    };

    getUserLocation();

    if (userLocation) {
      getWeatherData(userLocation);
    };
  });


  return (
    <div className={theme}>
      <h1 className="text-5xl text-white">Weatherly</h1>
      <Overview weatherData={weatherData} />
    </div>
  );
};