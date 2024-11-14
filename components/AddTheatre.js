import { useState } from "react";

const SERVER_URL = process.env.MONGO_URI || "http://localhost:5000"

export default function AddTheatre() {
    const [theatreName, setTheatreName] = useState('');
    const [location, setLocation] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [seatingCapacity, setSeatingCapacity] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const updatedFormData = {
            name: theatreName,
            location,
            city,
            state,
            seatingCapacity: Number(seatingCapacity),
        };

        // Log the data being sent to the backend
        console.log('Form data to be sent:', updatedFormData);

        try {
            const res = await fetch(`${SERVER_URL}/api/addTheatre`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedFormData),
            });

            if (res.ok) {
                alert('Theatre added successfully!');
                // Clear form fields
                setTheatreName('');
                setLocation('');
                setCity('');
                setState('');
                setSeatingCapacity('');
            } else {
                alert('Error adding theatre');
            }
        } catch (error) {
            console.error('Error posting data:', error);
            alert('Failed to send data to the server');
        }
    };

    return (
        <div>
            <div>
                <input
                    type="text"
                    placeholder="Theatre Name"
                    value={theatreName}
                    onChange={(e) => setTheatreName(e.target.value)}
                    className="border-2 border-gray-300 p-2 rounded-lg w-96"
                />
                <input
                    type="text"
                    placeholder="Location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="border-2 border-gray-300 p-2 rounded-lg w-96"
                />
                <input
                    type="text"
                    placeholder="City"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="border-2 border-gray-300 p-2 rounded-lg w-96"
                />
                <input
                    type="text"
                    placeholder="State"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="border-2 border-gray-300 p-2 rounded-lg w-96"
                />
                <input
                    type="text"
                    placeholder="Seating Capacity"
                    value={seatingCapacity}
                    onChange={(e) => setSeatingCapacity(e.target.value)}
                    className="border-2 border-gray-300 p-2 rounded-lg w-96"
                />
            </div>
            <button onClick={handleSubmit} className="bg-blue-500 text-white p-2 rounded-lg w-96 mt-4">
                Add Theatre
            </button>
        </div>
    );
}
