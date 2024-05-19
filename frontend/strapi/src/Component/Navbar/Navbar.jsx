// Navbar.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Navbar = () => {

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

  return (
    <nav className="bg-gray-900 bg-opacity-75 p-4 text-white fixed w-full backdrop-filter backdrop-blur-sm">
      <h1 className="text-lg">
        Welcome, &nbsp;
        <span className='text-primary-500'>
          {user?.username}
        </span>
      </h1>
    </nav>
  );
};

export default Navbar;
