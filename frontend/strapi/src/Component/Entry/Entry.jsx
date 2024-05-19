import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { EntryList } from '..';

const Entry = () => {
    const [collection, setCollection] = useState([]);
    const [entries, setEntries] = useState([]);
    // const [isModalOpen, setIsModalOpen] = useState(false);
    const { collectionId } = useParams();
    const token = localStorage.getItem('token');
    useEffect(() => {
        if (token) {
            // Fetch Collection
            axios.get(`http://localhost:3000/collection/${collectionId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            })
                .then(response => {
                    setCollection(response.data);
                })
                .catch(error => {
                    console.error('Error fetching collections:', error);
                });

            //Fetch All entries
            axios.get(`http://localhost:3000/${collectionId}/entry`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            })
                .then(response => {
                    setEntries(response.data);
                })
                .catch(error => {
                    setEntries([]);
                    console.error('Error fetching entries:', error);
                });
        }
    }, [token, collection]);

    return (
        <>
            <div className="text-primary-500 text-center text-2xl">{collection.collection_name}</div>
            <div className="w-full flex justify-center mt-3">
                <button
                    className="text-white bg-primary-600 p-2 rounded-lg"
                    onClick={() => setIsModalOpen(true)}
                >
                    + Add an Entry
                </button>
            </div>
            <div className="mt-3 border"></div>
            <div className="mt-3 text-white text-2xl text-center">Your Entry list</div>
            <div>
                <EntryList entries={entries} />
            </div>
        </>
    );
};


export default Entry;