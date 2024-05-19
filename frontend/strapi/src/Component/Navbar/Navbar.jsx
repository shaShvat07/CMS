// Navbar.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState('');
  const token = localStorage.getItem('token');
  useEffect(() => {
    if (token) {
      // Fetch user
      axios.get('http://localhost:3000/user', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
        .then(response => {
          setUser(response.data);
        })
        .catch(error => {
          console.error('Error fetching users:', error);
        });
    }
  }, [token]);

  const handleSignOut = () => {
    // Remove token from local storage
    localStorage.removeItem('token');
    // Navigate to the login page
    navigate('/login');
  };

  return (
    <nav className="bg-gray-900 bg-opacity-75 p-4 text-white fixed w-full backdrop-filter backdrop-blur-sm flex justify-evenly">
      <h1 className="text-lg">
        Welcome, &nbsp;
        <span className='text-primary-500'>
          {user?.username}
        </span>
      </h1>
      <button
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        onClick={handleSignOut}
      >
        Sign Out
      </button>
    </nav>
  );
};

export default Navbar;
