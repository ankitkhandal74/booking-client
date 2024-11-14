import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Header from '@/components/Header';

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

export default function Booking() {
    const router = useRouter();
    const { theatreId, movieId } = router.query;
    const [movieDetails, setMovieDetails] = useState(null);
    const [movieData, setMovieData] = useState(null);
    const [form, setForm] = useState({
        seats: 1,
    });

    useEffect(() => {
        const checkUserRole = async () => {
          // Retrieve the token from localStorage
          const userToken = localStorage.getItem("Token");
    
          if (!userToken) {
            // If no token is found, redirect to login
            router.push("/auth/login");
            return;
          }
        };
        checkUserRole();
        }, [router]);

    useEffect(() => {
        if (router.isReady && theatreId && movieId) {
            const fetchMovieDetails = async () => {
                try {
                    console.log('Fetching movie details for:', `${theatreId}`, `${movieId}`);
                    const res = await fetch(`${SERVER_URL}/api/getMovieDetails/${theatreId}/${movieId}`);
                    const data = await res.json();
                    console.log('Movie details fetched:', data);
                    setMovieDetails(data);

                    const movieRes = await fetch(`https://www.omdbapi.com/?t=${encodeURIComponent(data.name)}&apikey=6b25aaec`);
                    const movieData = await movieRes.json();

                    if (movieData && movieData.Response === "True") {
                        setMovieData(movieData);
                    } else {
                        console.warn(`No data found for movie: ${data.name}`);
                    }
                } catch (error) {
                    console.error('Error fetching movie details:', error);
                }
            };
            fetchMovieDetails();
        } else {
            console.log('Waiting for router to be ready or for theatreId and movieId to be available');
        }
    }, [router.isReady, theatreId, movieId]);

    const handleChange = (e) => {
        const { value } = e.target;
        setForm((prevForm) => ({ ...prevForm, seats: Number(value) }));
    };

    const handleBookingPay = async () => {
        
        const bookingDetails = {
            movieName: movieDetails.name,
            showTiming: movieDetails.showTiming,
            seats: form.seats,
            totalAmount: movieDetails.tecketPrice * form.seats,
            id: new Date().getTime(), 
        };
        const availableSeats = movieDetails.availableSeats - form.seats;
        try {
           
            const response = await fetch(`${SERVER_URL}/api/updateavailableSeats/${theatreId}/${movieId}?seats=${form.seats}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ availableSeats }), 
            });
    
            if (response.ok) {
                
                const updatedAvailableSeats = await response.json(); 
                console.log('Available seats updated successfully on the server:', updatedAvailableSeats);
    
                const existingBookings = JSON.parse(localStorage.getItem('bookingDetails')) || [];
                const updatedBookings = [...existingBookings, bookingDetails];
                localStorage.setItem('bookingDetails', JSON.stringify(updatedBookings));
    
                console.log('Booking details saved to local storage:', updatedBookings);
    
               
                alert('Booking successful! Redirecting to home page...');
                router.push('/'); 
            } else {
               
                const errorData = await response.json();
                console.error('Failed to update available seats:', errorData.message || response.statusText);
                alert('Failed to update available seats. Please try again.');
            }
        } catch (error) {
            console.error('Error updating available seats:', error);
            alert('Booking failed. There was an issue updating available seats. Please try again.');
        }
    };
    
    
    
    

    return (
        <div>
            <Header />
        <div className='flex w-[100vw] justify-center items-center pt-10 '>
            {movieDetails ? (
                <div className='flex flex-col md:w-[25vw] w-[90vw] justify-center items-center shadow-2xl rounded-2xl p-4 bg-gray-500 text-white'>
                    {movieData && movieData.Poster ? (
                        <img src={movieData.Poster} alt={`${movieDetails.name} Poster`} className="max-w-40 rounded-xl m-auto" />
                    ) : (
                        <p>No poster available</p>
                    )}
                    <p className='flex flex-col justify-center items-center'>
                        <strong className=' text-xl'>Movie Name</strong> 
                        <p>{movieDetails.name}</p>
                        </p>
                    <p><strong>Show Timing:</strong> {movieDetails.showTiming}</p>
                    <p><strong>Ticket Price:</strong> ₹{movieDetails.tecketPrice}</p>
                    <p><strong>Available Seats:</strong> {movieDetails.availableSeats}</p>

                    <input 
                        type="number" 
                        name="seats" 
                        id="seats" 
                        placeholder="Enter number of seats" 
                        value={form.seats}
                        onChange={handleChange} 
                        className="border border-gray-300 rounded-md p-1 m-2 text-black" 
                        min="1"
                    />

                    <p><strong>Total Amount:</strong> ₹{movieDetails.tecketPrice * form.seats}</p>

                    <button 
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" 
                        onClick={handleBookingPay}
                    >
                        Pay Now
                    </button>
                </div>
            ) : (
                <p>Loading movie details...</p>
            )}
        </div>
        </div>
    );
}
