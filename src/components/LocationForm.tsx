import { FormEvent, useState } from "react";

interface LocationFormProps {
    handleUserLocation: (location: string) => void;
}

export default function LocationForm({ handleUserLocation }: LocationFormProps) {
    const [formData, setFormData] = useState('');

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        if (formData) {
            handleUserLocation(formData)
        } else {
            alert("location can't be empty")
        };
    };

    return (
            <form
                className="w-5/6 sm:w-96 flex flex-row justify-between rounded-2xl mx-auto bg-white/30"
                onSubmit={handleSubmit}>
                <label
                    className="absolute invisible"
                    htmlFor="locationInput">
                    Location Form
                </label>
                <input
                    id="locationInput"
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