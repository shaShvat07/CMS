// Sidebar.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const [collections, setCollections] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  useEffect(() => {
    if (token) {
      // Fetch Collection
      axios.get('http://localhost:3000/collection', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
        .then(response => {
          setCollections(response.data);
        })
        .catch(error => {
          console.error('Error fetching collections:', error);
        });
    }
  }, [token, collections]);

  const handleCollectionClick = (collectionId) => {
    console.log(collectionId);
    navigate(`/${collectionId}`);
  };

  return (
    <aside className="bg-gray-800 text-white w-64 fixed h-full flex-row justify-center">
      <div className='w-full p-4 flex items-center justify-center text-xl'>
        Strapi
      </div>
      <div className='w-full flex justify-center'>
        <button
          className='w-[80%] mt-4 rounded-lg p-4 bg-gray-900 hover:bg-primary-600 text-center'
          onClick={() => navigate('/')}>
          Content Types
        </button>
      </div>
      <div className='w-full text-center mt-4'>
        Your Collections
      </div>
      <ul className='p-4 overflow-y-scroll h-full'>
        {collections.map((collection) => (
          <>
            <li
              key={collection.collection_id}
              className='p-2 bg-gray-600 mb-2 rounded-lg hover:bg-primary-600 hover:cursor-pointer'
              onClick={() => handleCollectionClick(collection.collection_id)}>
                {collection.collection_name}
            </li>
          </>
        ))}
        <li className='mb-48'></li>
      </ul>
    </aside>
  );
};

export default Sidebar;
