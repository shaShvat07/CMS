// CollectionModal.js
import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const CollectionModal = ({ isOpen, onClose, onCollectionAdded }) => {
    const [collectionName, setCollectionName] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const response = await axios.post(
                    'http://localhost:3000/collection',
                    { collection_name: collectionName },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    }
                );
                onCollectionAdded(response.data);
                toast.success("Adding your collection!");
                onClose();
            } catch (error) {
                toast.error(error.response?.data);
                console.log(error.response?.data); 
            }
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg w-1/3">
                <h2 className="text-2xl font-bold mb-4">Add a Collection</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="collectionName" className="block text-gray-700 mb-2">Collection Name</label>
                        <input
                            type="text"
                            id="collectionName"
                            value={collectionName}
                            onChange={(e) => setCollectionName(e.target.value)}
                            required
                            className="w-full px-3 py-2 border rounded-lg"
                        />
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg mr-2"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                        >
                            Add Collection
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CollectionModal;
