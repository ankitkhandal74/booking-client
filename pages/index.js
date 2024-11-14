import Header from "@/components/Header";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import SearchTheatres from "@/components/SearchTheatres";

const SERVER_URL = process.env.SERVER_URL || "http://localhost:5000";

export default function Home() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [theatres, setTheatres] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    // Function to fetch the theatres with movies
    const fetchTheatresWithMovies = async (theatresData) => {
        try {
            const theatresWithMovies = await Promise.all(
                theatresData.map(async (theatre) => {
                    const moviesWithDetails = await Promise.all(
                        theatre.movies.map(async (movie) => {
                            const movieName = movie.name;

                            if (!movieName) {
                                console.error(`Movie name not found for movie in theatre:`, theatre);
                                return { ...movie, movieDetails: null };
                            }

                            try {
                                const movieRes = await fetch(`https://www.omdbapi.com/?t=${movieName}&apikey=6b25aaec`);
                                if (!movieRes.ok) {
                                    throw new Error(`Failed to fetch movie details for ${movieName}: ${movieRes.status} ${movieRes.statusText}`);
                                }
                                const movieData = await movieRes.json();
                                return { ...movie, movieDetails: movieData };
                            } catch (error) {
                                console.error(`Error fetching movie details for ${movieName}:`, error);
                                return { ...movie, movieDetails: null }; // Handle missing movie data
                            }
                        })
                    );
                    return { ...theatre, movies: moviesWithDetails };
                })
            );
            setTheatres(theatresWithMovies);
        } catch (error) {
            console.error('Error fetching data:', error);
            setError(error.message);
        }
    };

    // Fetch all theatres data initially when the component mounts
    const fetchData = async () => {
        try {
            const theatreRes = await fetch(`${SERVER_URL}/api/getTheatres`);
            if (!theatreRes.ok) {
                throw new Error(`Failed to fetch theatres: ${theatreRes.status} ${theatreRes.statusText}`);
            }
            const theatresData = await theatreRes.json();
            fetchTheatresWithMovies(theatresData); // Load movie details after theatres data
        } catch (error) {
            console.error('Error fetching theatres:', error);
            setError(error.message);
        }
    };

    useEffect(() => {
        fetchData(); // Load theatres when the component mounts
    }, []);

    // Fetch filtered theatres based on the search query
    useEffect(() => {
        const fetchFilteredTheatres = async () => {
            if (!searchQuery.trim()) {
                // If search query is empty, fetch all theatres again
                fetchData(); // Fetch all theatres when the query is cleared
                return;
            }

            setLoading(true);
            try {
                const response = await fetch(`${SERVER_URL}/api/searchTheatres?query=${searchQuery}`);
                const data = await response.json();
                fetchTheatresWithMovies(data); // Load movie details after fetching filtered theatres
            } catch (error) {
                console.error('Error fetching filtered theatres:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFilteredTheatres();
    }, [searchQuery]); // Trigger when the search query changes

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const formatRuntime = (runtime) => {
        const minutes = parseInt(runtime);
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        return `${hours}h - ${remainingMinutes}m`;
    };

    const handleBooking = (theatreId, movieId) => {
        router.push(`/booking/${theatreId}/${movieId}`);
    };


    return (
        <div>
            <Header />
            <div className=' flex justify-center items-center w-full mt-10'>
                <div className="relative w-full max-w-lg rounded-2xl shadow-2xl p-4 bg-white drop-shadow-[0_10px_15px_rgba(0,0,0,0.1)] flex justify-center ">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        placeholder="Search... Ex: 'Jaipur', 'Raj Mander', '12th Fail'"
                        className="md:w-96 w-80 px-4 py-2 rounded-2xl text-black border-violet-600 border focus:outline-none"
                    />
                </div>
            </div>

            <div className="mt-6">
                <div className="grid grid-cols-1 gap-10">
                    {loading && <p className="text-center">Loading...</p>}
                    {theatres.length > 0 ? (
                        theatres.map((theatre) => (
                            <div key={theatre._id} className="px-2 rounded-lg shadow-md">
                                <div className="bg-gray-400 p-8 rounded-xl text-xl font-bold">
                                    <h3 className="md:text-4xl text-3xl mb-2 text-center">{theatre.name}</h3>
                                    <div className="grid md:grid-cols-2 pl-10">
                                        <p>Location: {theatre.location}</p>
                                        <p>City: {theatre.city}</p>
                                        <p>State: {theatre.state}</p>
                                        <p>Seating Capacity: {theatre.seatingCapacity}</p>
                                    </div>
                                </div>
                                <div className="bg-gray-200 w-96 md:m-4 md:p-4 my-4 rounded-xl">
                                    {theatre.movies.map((movie, index) => (
                                        <div
                                            key={index}
                                            className="shadow-2xl rounded-xl px-4 py-6 flex justify-center items-center flex-col text-xl gap-4"
                                        >
                                            {movie.movieDetails ? (
                                                <div className="text-xl flex flex-col gap-4">
                                                    <h3 className="text-3xl font-semibold mb-2 text-center">{movie.movieDetails.Title}</h3>
                                                    <img src={movie.movieDetails.Poster} alt={`${movie.name} Poster`} className="max-w-80 rounded-xl m-auto" />
                                                    <p>Released: {movie.movieDetails.Released}</p>
                                                    <p>Imdb Rating: {movie.movieDetails.imdbRating}</p>
                                                    <p>Imdb Votes: {movie.movieDetails.imdbVotes}</p>
                                                    <p>Category: {movie.movieDetails.Genre}</p>
                                                    <p>Language: {movie.movieDetails.Language}</p>
                                                    <p>Runtime: {formatRuntime(movie.movieDetails.Runtime)}</p>
                                                    <p>Plot: {movie.movieDetails.Plot}</p>
                                                </div>
                                            ) : (
                                                <p>Movie details not available</p>
                                            )}
                                            <p className="text-red-600">Show Timing: {movie.showTiming}</p>
                                            <p className="text-red-600">Available Seats: {movie.availableSeats}</p>
                                            <p className="text-red-600">Tecket Price: {movie.tecketPrice}</p>

                                            <button
                                                onClick={movie.availableSeats > 0 ? () => handleBooking(theatre._id, movie._id) : null}
                                                className={`text-sm md:py-4 py-2 md:px-12 px-6 rounded-lg ${movie.availableSeats > 0
                                                        ? 'bg-violet-500 text-white hover:scale-95'
                                                        : 'bg-red-500 text-white cursor-not-allowed'
                                                    }`}
                                                disabled={movie.availableSeats === 0}
                                            >
                                                {movie.availableSeats > 0 ? 'Book Now' : 'Sold Out'}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center">No theatres found.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
