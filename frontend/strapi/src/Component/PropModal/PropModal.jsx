// CollectionModal.js
import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const PropModal = ({ isOpen, onClose, collectionId }) => {
    const [Name, setName] = useState('');
    const [selectedValue, setSelectedValue] = useState('');
    const options = [
        { value: 'Text', label: 'Text' },
        { value: 'Email', label: 'Email' },
        { value: 'Password', label: 'Password' },
        { value: 'Number', label: 'Number' },
        { value: 'Date', label: 'Date' },
        { value: 'Boolean', label: 'Boolean' },
    ];

    const handleChange = (event) => {
        setSelectedValue(event.target.value);
    };
    const [isChecked, setIsChecked] = useState(false); // Initial state for checkbox

    const handleCheckboxChange = (event) => {
        setIsChecked(event.target.checked);
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const response = await axios.post(
                    `http://localhost:3000/collection/${collectionId}/prop`,
                    {
                        name: Name,
                        type: selectedValue,
                        unique: isChecked
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    }
                );
                toast.success("Adding your property!");
                onClose();
            } catch (error) {
                toast.error(error.response?.data);
                console.log(error.response?.data);
            }
        }
    };

    if (!isOpen) return null;

    return (
        <div className="text-black fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg w-1/3">
                <h2 className="text-2xl font-bold mb-4">Add a Property</h2>
                <form onSubmit={handleSubmit} className="flex-row items-center">
                    <div className="mb-4">
                        <label htmlFor="Name" className="block text-gray-700 mb-2">Enter Name of the Property</label>
                        <input
                            type="text"
                            id="Name"
                            value={Name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full px-3 py-2 border rounded-lg"
                        />
                        <div className="mb-4">
                            <label htmlFor="inputType" className="block mb-2 text-gray-700">
                                Enter Input Type
                            </label>
                            <select
                                id="inputType"
                                name="inputType"
                                value={selectedValue}
                                onChange={handleChange}
                                className="block w-full px-3 py-2 mb-2 border rounded-lg focus:outline-none focus:ring-blue-500 focus:ring-1 sm:text-sm"
                                required
                            >
                                <option value="">Select Type</option>
                                {options.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex items-center mt-4">
                            <label htmlFor="isUnique" className="mr-4 text-gray-700">
                                Unique
                            </label>
                            <input
                                type="checkbox"
                                id="isUnique"
                                name="isUnique"
                                checked={isChecked}
                                onChange={handleCheckboxChange}
                                className="w-6 h-6 rounded-sm border border-gray-300 focus:ring-blue-500 focus:ring-opacity-50"
                            />
                        </div>
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
                            className="px-4 py-2 bg-primary-600 text-white rounded-lg"
                        >
                            Add Prop
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PropModal;
