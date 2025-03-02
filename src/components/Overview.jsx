export default function Overview(props) {
    const weatherData = props.weatherData;

    return (
        <div>
        {/* {weatherData.forecast.map((day) => (
            <li key={day.date}>
            <strong>{day.date}</strong> - {day.day.avgtemp_c}°C, {day.day.condition.text}
            </li>
        ))} */}
        </div>
    );
};