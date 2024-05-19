import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CollectionsList, CollectionModal } from '..';


const Home = () => {
    const [collections, setCollections] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

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

    const handleCollectionAdded = (newCollection) => {
        setCollections([...collections, newCollection]);
    };

    return (
        <>
            <div className="text-primary-500 text-center text-2xl">Content Builder</div>
            <div className="w-full flex justify-center mt-3">
                <button
                    className="text-white bg-primary-600 p-2 rounded-lg"
                    onClick={() => setIsModalOpen(true)}
                >
                    + Add a Collection
                </button>
            </div>
            <div className="mt-3 border"></div>
            <div className="mt-3 text-white text-2xl text-center">Your Collections list</div>
            <CollectionsList collections={collections} />
            <CollectionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onCollectionAdded={handleCollectionAdded}
            />
        </>
    );
};


export default Home;