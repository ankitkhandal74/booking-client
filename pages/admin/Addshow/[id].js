import { useRouter } from 'next/router';
import { useState } from 'react';

const SERVER_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function AddShow() {
    const router = useRouter();
    const { id: theatreId } = router.query; // Extract the `id` parameter from the URL

    const [formData, setFormData] = useState({
        name: '',
        showTiming: '',
        tecketPrice: '',
        availableSeats: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log('Form Data:', formData);

        try {
            const response = await fetch(`${SERVER_URL}/api/addMovie/${theatreId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: formData.name,
                    showTiming: formData.showTiming,
                    tecketPrice: formData.tecketPrice,
                    availableSeats: parseInt(formData.availableSeats, 10)
                })
            });

            const data = await response.json();
            console.log(data);

            if (response.ok) {
                alert('Movie added successfully!');
                setFormData({
                    name: '',
                    showTiming: '',
                    tecketPrice: '',
                    availableSeats: ''
                });
            } else {
                alert(`Error: ${data.message}`);
            }
        } catch (error) {
            console.error('Error adding movie:', error);
            alert('Failed to add movie. Please try again later.');
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-xl font-bold mb-4">Add Movie to Theatre</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-gray-700">Movie Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="border border-gray-300 p-2 rounded w-full"
                    />
                </div>
                <div>
                    <label className="block text-gray-700">Show Timing</label>
                    <input
                        type="text"
                        name="showTiming"
                        value={formData.showTiming}
                        onChange={handleChange}
                        required
                        className="border border-gray-300 p-2 rounded w-full"
                    />
                </div>
                <div>
                    <label className="block text-gray-700">tecketPrice</label>
                    <input
                        type="text"
                        name="tecketPrice"
                        value={formData.tecketPrice}
                        onChange={handleChange}
                        required
                        className="border border-gray-300 p-2 rounded w-full"
                    />
                </div>
                <div>
                    <label className="block text-gray-700">Available Seats</label>
                    <input
                        type="number"
                        name="availableSeats"
                        value={formData.availableSeats}
                        onChange={handleChange}
                        required
                        className="border border-gray-300 p-2 rounded w-full"
                    />
                </div>
                <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
                    Add Movie
                </button>
            </form>
        </div>
    );
}
