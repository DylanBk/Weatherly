import { useEffect, useState } from "react";
import { Mistral } from "@mistralai/mistralai";

interface InterpreterProps {
    weatherData: {
        tempC: number | null,
        tempF: number | null,
        windMph: number | null,
        windKph: number | null,
        cloudCover: number | null,
        humidity: number | null,
        precipitation: number | null,
        condition: number | null
    };
};

export default function Interpreter(props: InterpreterProps) {
    const weatherData = props.weatherData;
    const apiKey = import.meta.env.VITE_MISTRALAI_API_KEY as string;
    const [summary, setSummary] = useState<string>('');
    // const [isCooldown, setIsCooldown] = useState<boolean>(false);

    useEffect(() => {
        const interpretData = async () => {
            // if (isCooldown) {
            //     console.log("Please wait before making another request.");

            //     return;
            // };

            try {
                // setIsCooldown(true);
                // setTimeout(() => setIsCooldown(false), 30000); // 30 sec cooldown

                const client = new Mistral({ apiKey: apiKey });

                const chatResponse = await client.chat.complete({
                    model: "mistral-large-latest",
                    messages: [{
                        role: "user",
                        content: `
                            You are a friendly, energetic weather reporter.
                            The response must be less than 50 words and greater than 25.
                            Feel free to make puns and use emojis.
                            Summarize the weather data:
                            Temperature: ${weatherData.tempC}°C
                            Humidity: ${weatherData.humidity}%
                            Cloud Cover: ${weatherData.cloudCover}%
                            Wind Speed: ${weatherData.windMph} mph
                            Chance of Rain: ${weatherData.precipitation}%
                            Conditions: ${weatherData.condition}
                        `
                    }]
                });

                const content = chatResponse?.choices?.[0]?.message?.content as string ?? "No summary available." as string;
                setSummary(content);
            } catch (err) {
                console.error("Error generating summary:", err);
            };
        };

        interpretData();
    }, [weatherData]);

    return (
        <section className="sm:min-h-56 w-3/4 sm:w-2/5 lg:w-1/4 sm:absolute sm:right-6 lg:right-8 top-1/2 -translate-y-1/2 flex flex-col gap-2 p-3 rounded-xl mx-auto sm:mx-0 mt-36 sm:mt-16 lg:mt-0 bg-black/30">
            <h2 className="flex flex-row items-center text-2xl sm:text-3xl text-white">
                <svg className="w-5 fill-white" viewBox="0 0 43 43" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16.7562 29.4458L15.0625 35.375L13.3688 29.4458C12.931 27.9143 12.1102 26.5195 10.9839 25.3932C9.85754 24.2669 8.46279 23.4461 6.93125 23.0083L1 21.3125L6.92917 19.6187C8.46071 19.181 9.85545 18.3602 10.9818 17.2339C12.1081 16.1075 12.9289 14.7128 13.3667 13.1812L15.0625 7.25L16.7562 13.1792C17.194 14.7107 18.0148 16.1055 19.1411 17.2318C20.2675 18.3581 21.6622 19.1789 23.1937 19.6167L29.125 21.3125L23.1958 23.0062C21.6643 23.444 20.2695 24.2648 19.1432 25.3911C18.0169 26.5175 17.1961 27.9122 16.7583 29.4437L16.7562 29.4458ZM34.3521 14.4688L33.8125 16.625L33.2729 14.4688C32.9641 13.2325 32.325 12.1034 31.4242 11.2021C30.5233 10.3009 29.3945 9.66144 28.1583 9.35208L26 8.8125L28.1583 8.27292C29.3945 7.96356 30.5233 7.32408 31.4242 6.42285C32.325 5.52162 32.9641 4.39252 33.2729 3.15625L33.8125 1L34.3521 3.15625C34.6611 4.39278 35.3004 5.52206 36.2017 6.42331C37.1029 7.32456 38.2322 7.96389 39.4688 8.27292L41.625 8.8125L39.4688 9.35208C38.2322 9.66111 37.1029 10.3004 36.2017 11.2017C35.3004 12.1029 34.6611 13.2322 34.3521 14.4688ZM31.5083 39.1604L30.6875 41.625L29.8667 39.1604C29.6365 38.4701 29.2488 37.8428 28.7343 37.3282C28.2197 36.8136 27.5924 36.426 26.9021 36.1958L24.4375 35.375L26.9021 34.5542C27.5924 34.324 28.2197 33.9364 28.7343 33.4218C29.2488 32.9072 29.6365 32.2799 29.8667 31.5896L30.6875 29.125L31.5083 31.5896C31.7385 32.2799 32.1261 32.9072 32.6407 33.4218C33.1553 33.9364 33.7826 34.324 34.4729 34.5542L36.9375 35.375L34.4729 36.1958C33.7826 36.426 33.1553 36.8136 32.6407 37.3282C32.1261 37.8428 31.7385 38.4701 31.5083 39.1604Z" />
                </svg>

                AI Overview
            </h2>
            {!summary ? (
                <p className="text-base sm:text-lg text-white animate-pulse">Generating Summary...</p>
            ) : (
                <p className="text-base sm:text-lg text-white">{summary}</p>
            )}
            <p className="text-grey">Powered by <a href="https://mistral.ai/">Mistral AI</a></p>
        </section>
    );
};