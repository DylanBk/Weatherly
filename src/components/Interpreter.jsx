import OpenAI from "openai";
import { useEffect, useState } from "react";

export default function Interpreter(props) {
    const weatherData = props.weatherData;
    console.log(weatherData)
    const apiKey = import.meta.env.VITE_HUGGINGFACE_API_KEY;
    const [summary, setSummary] = useState('');

    useEffect(() => {
        const interpretData = async () => {
            try {
                const res = await fetch("/huggingface-api/models/google-t5/t5-small", {
                    method: 'POST',
                    headers: {
                        "Authorization": `Bearer ${apiKey}`,  // API key still needs to be sent
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        inputs: `Summarize the weather data:
                            Temperature: ${weatherData.temp_c}°C
                            Humidity: ${weatherData.humidity}%
                            Cloud Cover: ${weatherData.cloud}%
                            Wind Speed: ${weatherData.wind_mph} mph
                            Conditions: ${weatherData.condition.text}`
                    })
                });

                const data = await res.json();
                setSummary(data[0]?.generated_text || "Could not generate summary.");
            } catch (err) {
                console.error("Error generating summary:", err);
                setSummary("Error generating weather summary.");
            }
        };


        interpretData()
    }, [weatherData, apiKey]);

    // const weatherData = props.weatherData;

    return (
        <div className="w-fit p-2 rounded-xl bg-black/30">
            <h2 className="text-2xl text-white">AI Overview</h2>
            <p className="text-white">summary: {summary}</p>
        </div>
    );
};