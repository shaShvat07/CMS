import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CollectionsList } from '..';

const Home = () => {

    const [collections, setCollections] = useState([]);
    const token = localStorage.getItem('token');
    useEffect(() => {
        if (token) {
            // Fetch Collection
            axios.get('http://localhost:3000/collection', {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    setCollections(response.data);
                })
                .catch(error => {
                    console.error('Error fetching users:', error);
                });
        }
    }, [token]);

    return (
        <>
            <div className="text-primary-500 text-center text-2xl">Content Builder</div>
            <div>
                <button className='text-white bg-primary-600 p-2'>Add a Collection </button>
            </div>
            <div className='mt-3 border'></div>
            <CollectionsList collections={collections} />
        </>
    )
}

export default Home;