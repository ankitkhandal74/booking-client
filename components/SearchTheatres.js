import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const SERVER_URL = process.env.NEXT_PUBLIC_MONGO_URI || "http://localhost:5000";

const SearchTheatres = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [theatres, setTheatres] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    if (searchQuery.trim()) {
      const fetchFilteredTheatres = async () => {
        setLoading(true);
        try {
          const response = await fetch(`${SERVER_URL}/api/searchTheatres?query=${searchQuery}`);
          const data = await response.json();
          setTheatres(data);
        } catch (error) {
          console.error('Error fetching filtered theatres:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchFilteredTheatres();
    } else {
      setTheatres([]);
    }
  }, [searchQuery]); // Re-run search when searchQuery changes

  return (
    <div className="flex justify-center items-center mt-6">
      <div className="relative w-full max-w-lg rounded-2xl shadow-2xl p-4 bg-white drop-shadow-[0_10px_15px_rgba(0,0,0,0.1)]">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search... Ex: 'Jaipur', 'Raj Mander', '12th Fail'"
          className="md:w-96 w-80 px-4 py-2 rounded-2xl text-black border-violet-600 border focus:outline-none"
        />
      </div>

      {/* Display loading or the results */}
      <div className="mt-6">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid grid-cols-1 gap-10">
            {theatres.length > 0 ? (
              theatres.map((theatre) => (
                <div key={theatre._id} className=" p-4 rounded-lg shadow-md">
                  <div className="bg-gray-400 p-8 rounded-xl text-xl  font-bold">
                    <h3 className="text-4xl mb-2 text-center">{theatre.name}</h3>
                    <div className="grid grid-cols-2 pl-10">
                      <p>Location: {theatre.location}</p>
                      <p>City: {theatre.city}</p>
                      <p>State: {theatre.state}</p>
                      <p>Seating Capacity: {theatre.seatingCapacity}</p>
                    </div>
                  </div>
                  <div className="bg-gray-200 w-96 m-4 p-4 ">
                    {theatre.movies.length > 0 ? (
                      theatre.movies.map((movie, index) => (
                        <div
                          key={index}
                          className="shadow-2xl  rounded-xl px-4 py-6 flex justify-center items-center flex-col text-xl gap-4"
                        >
                          {movie.movieDetails ? (
                            <div className="text-xl flex flex-col gap-4">
                              <h3 className="text-3xl font-semibold mb-2 text-center">
                                {movie.movieDetails.Title}
                              </h3>
                              <img
                                src={movie.movieDetails.Poster}
                                alt={`${movie.name} Poster`}
                                className="max-w-80 rounded-xl m-auto"
                              />
                              <p>Released: {movie.movieDetails.Released}</p>
                              <p>Imdb Rating: {movie.movieDetails.imdbRating}</p>
                              <p>Imdb Votes: {movie.movieDetails.imdbVotes}</p>
                              <p>Category: {movie.movieDetails.Genre}</p>
                              <p>Language: {movie.movieDetails.Language}</p>
                              <p>Runtime: {movie.movieDetails.Runtime}</p>
                              <p>Plot: {movie.movieDetails.Plot}</p>
                            </div>
                          ) : (
                            <p>Movie details not available</p>
                          )}
                          <p className="text-red-600">Show Timing: {movie.showTiming}</p>
                          <p className="text-red-600">Available Seats: {movie.availableSeats}</p>
                        </div>
                      ))
                    ) : (
                      <p>No movies found.</p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center">No theatres found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchTheatres;
