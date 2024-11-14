import { useEffect, useState } from "react";
import { useRouter } from 'next/router';

const SERVER_URL = process.env.NEXT_PUBLIC_MONGO_URI || "http://localhost:5000";

export default function Dashboard() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [theatres, setTheatres] = useState([]);

    useEffect(() => {
        const fetchTheatresWithMovies = async () => {
            try {
                // Fetch theatre data
                const theatreRes = await fetch(`${SERVER_URL}/api/getTheatres`);
                if (!theatreRes.ok) {
                    throw new Error(`Failed to fetch theatres: ${theatreRes.status} ${theatreRes.statusText}`);
                }
                const theatresData = await theatreRes.json();

                if (Array.isArray(theatresData)) {
                    // Fetch movie details for each movie within each theatre
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
                } else {
                    console.error('Unexpected response format:', theatresData);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setError(error.message);
            }
        };

        fetchTheatresWithMovies();
    }, []);

    const handleAddShowClick = (id) => {
        router.push(`/admin/Addshow/${id}`);
    };

    const formatRuntime = (runtime) => {
        const minutes = parseInt(runtime);
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        return `${hours}h - ${remainingMinutes}m`;
    };

    const handleEditClick = (theatreId, movieId) => {
        router.push(`/admin/EditShow/${theatreId}/${movieId}`);
    };

    const handleEditTheatre = (theatreId) => {
        // Navigate to the Edit Theatre page
        router.push(`/admin/EditTheatre/${theatreId}`);
      };

    const handleDelete = async (theatreId, movieId) => {
        if (confirm("Are you sure you want to delete this movie?")) {
            try {
                const res = await fetch(`${SERVER_URL}/api/deleteMovie/${theatreId}/${movieId}`, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                });
    
                if (res.ok) {
                    alert('Movie deleted successfully');
                    router.push('/admin');
                } else {
                    console.error('Failed to delete movie');
                }
            } catch (error) {
                console.error('Error deleting movie:', error);
            }
        }
    };

    const handleDeleteTheatre = async (id) => {
        try {
          const res = await fetch(`${SERVER_URL}/api/deleteTheatre/${id}`, {
            method: 'DELETE', // Specify the request method as DELETE
          });
          
          if (!res.ok) {
            throw new Error('Failed to delete theatre');
          }
          
          const data = await res.json();
          console.log(data.message); // Log the response message
          
          // After deleting, you may want to redirect the user or show a success message
          router.push('/admin'); // Redirect to a list of theatres (adjust the route as needed)
          
        } catch (error) {
          console.error('Error deleting theatre:', error);
          setError('Failed to delete theatre');
        }
      };
    

    return (
        <div>
            <div className="grid grid-cols-3 gap-10">
                {theatres.length > 0 ? (
                    theatres.map((theatre) => (
                        <div key={theatre._id} className="bg-white p-4 rounded-lg shadow-md">
                            <h3 className="text-lg font-semibold mb-2">{theatre.name}</h3>
                            <p className="text-gray-600">Location: {theatre.location}</p>
                            <p className="text-gray-600">City: {theatre.city}</p>
                            <p className="text-gray-600">State: {theatre.state}</p>
                            <p className="text-gray-600">Seating Capacity: {theatre.seatingCapacity}</p>
                            <div className="">
                                {theatre.movies.map((movie, index) => (
                                    <div
                                        key={index}
                                        className="shadow-2xl bg-gray-400 rounded-xl px-4 py-6 flex justify-center items-center flex-col"
                                    >
                                        {movie.movieDetails ? (
                                            <div>
                                                <h3 className="text-lg font-semibold mb-2">{movie.movieDetails.Title}</h3>
                                                <img src={movie.movieDetails.Poster} alt={`${movie.name} Poster`} />
                                                <p>Year: {movie.movieDetails.Year}</p>
                                                <p>Runtime: {formatRuntime(movie.movieDetails.Runtime)}</p>
                                                <p>Genre: {movie.movieDetails.Genre}</p>
                                                <p>Director: {movie.movieDetails.Director}</p>
                                                <p>Plot: {movie.movieDetails.Plot}</p>

                                            </div>
                                        ) : (
                                            <p>Movie details not available</p>
                                        )}
                                        <h3 className="text-lg font-semibold mb-2">{movie.name}</h3>
                                        <p className="text-gray-600">Show Timing: {movie.showTiming}</p>
                                        <p className="text-gray-600">Category: {movie.category}</p>
                                        <p className="text-gray-600">Available Seats: {movie.availableSeats}</p>


                                        <div className="flex space-x-4 mt-4">

                                            <button
                                                className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                                                onClick={() => handleEditClick(theatre._id, movie._id)}
                                            >
                                                Edit
                                            </button>

                                            <button  o  onClick={() => handleDelete(theatre._id, movie._id)} className="bg-blue-500 text-white px-4 py-2 rounded-lg">Delete</button>

                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="shadow-2xl bg-gray-400 rounded-xl h-40 flex justify-center items-center mt-4">
                                <button
                                    className="bg-blue-500 rounded-full text-white h-10 w-10 text-center text-4xl"
                                    onClick={() => handleAddShowClick(theatre._id)}
                                >
                                    +
                                </button>
                            </div>
                            <div className="flex space-x-4 mt-4">
                                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg" onClick={() => handleEditTheatre(theatre._id)}>Edit</button>
                                <button onClick={() => handleDeleteTheatre(theatre._id)}  className="bg-blue-500 text-white px-4 py-2 rounded-lg">Delete</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center">No theatres found.</p>
                )}
            </div>
        </div>
    );
}
