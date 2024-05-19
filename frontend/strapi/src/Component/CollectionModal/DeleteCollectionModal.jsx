// CollectionModal.js
import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const DeleteCollectionModal = ({ isOpen, onClose, collectionId }) => {
    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const response = await axios.delete(
                    `http://localhost:3000/collection/${collectionId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    }
                );
                toast.success("Collection successfully deleted!");
                onClose();
            } catch (error) {
                toast.error(error.response?.data);
                console.log(error.response?.data);
            }
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center text-black">
            <div className="bg-white p-6 rounded-lg w-1/3">
                <h2 className="text-2xl font-bold mb-4">Warning!!!</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <div>Are you sure you want to delete this collection?</div>
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
                            className="px-4 py-2 bg-red-600 text-white rounded-lg"
                        >
                            Delete Collection
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DeleteCollectionModal;
