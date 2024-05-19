// CollectionModal.js
import React, { useState } from 'react';
import { FormPage } from '..';

const EntryModal = ({ isOpen, onClose }) => {

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg w-1/3 overflow-y-auto h-[80%]">
                <h2 className="text-2xl font-bold mb-4">Add an Entry</h2>
                <FormPage onClose={onClose} />
            </div>
        </div>
    );
};

export default EntryModal;
