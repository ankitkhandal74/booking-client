import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const SERVER_URL = process.env.NEXT_PUBLIC_MONGO_URI || "http://localhost:5000";

export default function EditShow() {
    const router = useRouter();
    const { theatreId, movieId } = router.query;
    const [movieDetails, setMovieDetails] = useState(null);
    const [form, setForm] = useState({
        name: '',
        showTiming: '',
        tecketPrice: '',
        availableSeats: ''
    });

    // Fetch movie details on page load
    useEffect(() => {
        if (theatreId && movieId) {
            const fetchMovieDetails = async () => {
                try {
                    const res = await fetch(`${SERVER_URL}/api/getMovieDetails/${theatreId}/${movieId}`);
                    const data = await res.json();
                    setMovieDetails(data);
                    setForm({
                        name: data.name || '',
                        showTiming: data.showTiming || '',
                        tecketPrice: data.tecketPrice || '',
                        availableSeats: data.availableSeats || ''
                    });
                } catch (error) {
                    console.error('Error fetching movie details:', error);
                }
            };
            fetchMovieDetails();
        }
    }, [theatreId, movieId]);

    // Handle form changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prevForm) => ({ ...prevForm, [name]: value }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${SERVER_URL}/api/updateMovieDetails/${theatreId}/${movieId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ theatreId, movieId, ...form })
            });
            if (res.ok) {
                alert('Movie details updated successfully');
                router.push('/admin'); // Redirect to the dashboard after updating
            } else {
                console.error('Failed to update movie details');
            }
        } catch (error) {
            console.error('Error updating movie details:', error);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-semibold mb-4">Edit Movie Details</h2>
            {movieDetails ? (
                <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                            Movie Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="showTiming">
                            Show Timing
                        </label>
                        <input
                            type="text"
                            id="showTiming"
                            name="showTiming"
                            value={form.showTiming}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="tecketPrice">
                            tecketPrice
                        </label>
                        <input
                            type="text"
                            id="tecketPrice"
                            name="tecketPrice"
                            value={form.tecketPrice}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="availableSeats">
                            Available Seats
                        </label>
                        <input
                            type="number"
                            id="availableSeats"
                            name="availableSeats"
                            value={form.availableSeats}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:shadow-outline"
                    >
                        Update Movie
                    </button>
                </form>
            ) : (
                <p>Loading movie details...</p>
            )}
        </div>
    );
}
