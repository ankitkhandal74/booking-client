import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const SERVER_URL = process.env.NEXT_PUBLIC_MONGO_URI || "http://localhost:5000";

const EditTheatre = () => {
  const router = useRouter();
  const { theatreId } = router.query; // Get the theatreId from the URL
  const [theatre, setTheatre] = useState(null); // Store the fetched theatre data
  const [form, setForm] = useState({
    name: '',
    location: '',
    city: '',
    state: '',
    seatingCapacity: ''
  });
  const [loading, setLoading] = useState(true); // Loading state

  // Fetch the theatre details when the theatreId is available
  useEffect(() => {
    if (theatreId) { // Check if theatreId is available
      const fetchTheatre = async () => {
        try {
          const res = await fetch(`${SERVER_URL}/api/getTheatres/${theatreId}`);
          if (!res.ok) {
            throw new Error('Failed to fetch theatre data');
          }
          const data = await res.json();
          setTheatre(data);
  
          // Set the form state with the fetched theatre data
          setForm({
            name: data.name || '',
            location: data.location || '',
            city: data.city || '',
            state: data.state || '',
            seatingCapacity: data.seatingCapacity || ''
          });
          setLoading(false); // Update loading state when data is fetched
        } catch (error) {
          console.error('Error fetching theatre:', error);
          setLoading(false); // Update loading state in case of error
        }
      };
  
      fetchTheatre();
    }
  }, [theatreId]);
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  // Handle form submission to update theatre
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${SERVER_URL}/api/updateTheatre/${theatreId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        throw new Error('Failed to update theatre');
      }

      const updatedTheatre = await res.json();
      console.log('Theatre updated successfully:', updatedTheatre);
      // You can redirect the user or show a success message here
      router.push('/theatre-list'); // Navigate to a list page after successful update
    } catch (error) {
      console.error('Error updating theatre:', error);
    }
  };

  return (
    <div>
      <h1>Edit Theatre Details</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Location</label>
          <input
            type="text"
            name="location"
            value={form.location}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>City</label>
          <input
            type="text"
            name="city"
            value={form.city}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>State</label>
          <input
            type="text"
            name="state"
            value={form.state}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Seating Capacity</label>
          <input
            type="number"
            name="seatingCapacity"
            value={form.seatingCapacity}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Update Theatre</button>
      </form>
    </div>
  );
};

export default EditTheatre;
