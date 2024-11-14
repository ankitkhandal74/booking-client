import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';

export default function BookingPage() {
    const [bookings, setBookings] = useState([]);

    // Load booking details from local storage
    useEffect(() => {
        const storedBookings = JSON.parse(localStorage.getItem('bookingDetails')) || [];
        setBookings(storedBookings);
    }, []);

    // Delete a specific booking from local storage by ID
    const handleDeleteBooking = (id) => {
        const updatedBookings = bookings.filter((booking) => booking.id !== id);
        setBookings(updatedBookings);
        localStorage.setItem('bookingDetails', JSON.stringify(updatedBookings));
    };

    return (
        <div>
            <Header />
        <div className="flex flex-col items-center p-6">
            <h1 className="text-2xl font-bold mb-4">Booking Details</h1>
            <div className=' grid md:grid-cols-3  grid-cols-1'>
            {bookings.length > 0 ? (
                bookings.map((booking) => (
                    <div key={booking.id} className="w-full max-w-md bg-white shadow-md rounded-lg p-6 mb-4">
                        <p className="text-lg font-semibold mb-2">
                            <strong>Movie Name:</strong> {booking.movieName}
                        </p>
                        <p className="mb-2">
                            <strong>Show Timing:</strong> {booking.showTiming}
                        </p>
                        <p className="mb-2">
                            <strong>Seats:</strong> {booking.seats}
                        </p>
                        <p className="mb-4">
                            <strong>Total Amount:</strong> ₹{booking.totalAmount}
                        </p>
                        <button
                            onClick={() => handleDeleteBooking(booking.id)}
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Delete Booking
                        </button>
                    </div>
                ))
            ) : (
                <p className="text-gray-500">No booking details available.</p>
            )}
        </div>
        </div>
        </div>
    );
}
