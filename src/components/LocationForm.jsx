import { useState } from "react";

export default function LocationForm({handleUserLocation}) {
    const [formData, setFormData] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (formData) {
            handleUserLocation(formData)
        } else {
            alert("location can't be empty")
        };
    };

    return (
            <form
                className="w-96 flex flex-row justify-between rounded-2xl mx-auto bg-white/30"
                onSubmit={handleSubmit}>
                <input
                    name="location"
                    className="w-full px-4 py-2 text-white"
                    type="text"
                    placeholder="Enter your location..."
                    onChange={(e) => setFormData(e.target.value)}
                />
                <button className="w-fit p-4 rounded-r-2xl bg-[#eee] hover:bg-grey cursor-pointer transition-colors duration-300" type="submit">Search</button>
            </form>
    );
};