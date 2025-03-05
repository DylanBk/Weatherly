import { useState } from "react";

export default function LocationForm() {
    const [formData, setFormData] = useState({});

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log(formData)
    };

    const handleChange = (e) => {
        setFormData({
            [e.target.name]: e.target.value
        });
    };

    return (
            <form
                className="w-96 flex flex-row bg-red-200"
                onSubmit={handleSubmit}>
                <input
                    name="location"
                    className=""
                    type="text"
                    placeholder="Enter your location..."
                    onChange={handleChange}
                />
                <button className="p-2" type="submit">Search</button>
            </form>
    );
};