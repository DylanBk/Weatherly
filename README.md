# Weatherly

## What is Weatherly?

Weatherly is a website that fetches real time weather data and provides an AI Overview of the weather forecast.

If the user does not wish to allow the website to access their location, they can optionally enter their location or any other location in the searchbar and get weather data for the entered area.

## How does Weatherly work?

Weatherly uses [weather api](https://www.weatherapi.com/) to get real time weather data as well as a forecast for the current day. From the retrieved data, the site then displays the relevant data to the user.

Once the weather data has been fetched, it is then passed into another API request. [Mistral AI](https://mistral.ai/) is utilised to generate a summary of the weather for the day ahead taking into consideration multiple factors such as temperature, humidity, cloud cover, and more.

The website itself is created using Vite + React and Tailwind.

## How to use:

- Download the files as a zip folder
- Extract the files from the zip folder
- Open the extracted files in your IDE
- Create a new file and name it .env
- This application relies on two API Keys; weather api and Mistral AI
- You will need to create **free** accounts on both sites
- - Once you have setup your accounts, create one API key for each
- - Add the relative API keys into the env file
- - - Name the first key *VITE_WEATHER_API_KEY*
- - - Name the second key *VITE_MISTRALAI_API_KEY*
- Open the terminal and execute the following commands:
- -  `npm install`
- -  `npm run dev`