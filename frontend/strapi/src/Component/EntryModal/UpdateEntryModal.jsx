import React from 'react';
import { UpdateEntryForm } from '..';

const UpdateEntryModal = ({ isOpen, onClose, fields, initialValues, entryId }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg w-1/3 overflow-y-auto h-[80%]">
                <h2 className="text-2xl font-bold mb-4">Update Entry</h2>
                <UpdateEntryForm
                    fields={fields}
                    initialValues={initialValues}
                    entryId={entryId}
                    onClose={onClose}
                />
            </div>
        </div>
    );
};

export default UpdateEntryModal;
