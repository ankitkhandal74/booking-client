import { useState, useEffect } from 'react';
import AddTheatre from '@/components/AddTheatre';
import Dashboard from '@/components/Dashboard';
import { useRouter } from 'next/router';
import Header from '@/components/Header';

const SERVER_URL = process.env.MONGO_URI || "http://localhost:5000";

export default function Admin() {
  // State to track which section is currently active
  const [activeSection, setActiveSection] = useState('dashboard');
  const [loading, setLoading] = useState(true); // Track loading state
  const router = useRouter();

  // Function to render different content based on the active button
  const renderContent = () => {
    switch (activeSection) {
      case 'addTheatre':
        return <AddTheatre />;
      case 'dashboard':
        return <Dashboard />;
      default:
        return <Dashboard />;
    }
  };

  useEffect(() => {
    const checkUserRole = async () => {
      // Retrieve the token from localStorage
      const userToken = localStorage.getItem("Token");

      if (!userToken) {
        // If no token is found, redirect to login
        router.push("/auth/login");
        return;
      }

      // Parse the token and extract the email
      const parsedToken = JSON.parse(userToken);
      const email = parsedToken?.email;

      try {
        // Fetch the user data
        const response = await fetch(`${SERVER_URL}/api/getRole?email=${email}`);
        const data = await response.json();
        console.log("User data:", data);

        if (!response.ok) {
          // If the response is not okay, throw an error
          throw new Error(data.error);
        }

        // If the response is okay, check the user role
        if (data.role === "admin") {
          // Allow access to the admin page
          setLoading(false); // Set loading to false after the role check is complete
          return;
        } else {
          // Redirect if user is not admin
          router.push("/");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setLoading(false); // Set loading to false in case of error
      }
    };

    
    checkUserRole();
  }, [router]);

  // Show loading spinner or message until role check is complete
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="spinner-border animate-spin text-blue-600" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />
    <div className="flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white">
        <div className="p-4 text-2xl font-bold text-center border-b border-gray-700">
          Admin Panel
        </div>
        <ul className="p-4">
          <li className={`p-2 ${activeSection === 'dashboard' ? 'bg-gray-700' : ''}`}>
            <button onClick={() => setActiveSection('dashboard')} className="w-full text-left">
              Dashboard
            </button>
          </li>
          <li className={`p-2 ${activeSection === 'addTheatre' ? 'bg-gray-700' : ''}`}>
            <button onClick={() => setActiveSection('addTheatre')} className="w-full text-left">
              Add Theatre
            </button>
          </li>
        </ul>
      </div>

      {/* Main content area */}
      <div className="flex-1 p-8 bg-gray-100">
        {renderContent()}
      </div>
    </div>
    </div>
  );
};
