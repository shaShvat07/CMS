import React from 'react';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

const DynamicForm = ({ fields, onClose }) => {
    const { register, handleSubmit, getValues, formState: { errors } } = useForm();
    const { collectionId } = useParams();

    const onSubmit = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const data = getValues();

                // Convert fields to their respective types
                fields.forEach(field => {
                    if (field.type === 'Number') {
                        data[field.name] = parseFloat(data[field.name]);
                    } else if (field.type === 'Boolean') {
                        data[field.name] = Boolean(data[field.name]);
                    }
                });

                console.log(data);
                console.log(collectionId);
                const response = await axios.post(
                    `http://localhost:3000/${collectionId}/entry`,
                    data,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    }
                );
                toast.success("Entry added successfully!");
                onClose();
            } catch (error) {
                toast.error(error.response?.data || 'An error occurred');
                console.error('Error adding entry:', error);
            }
        }
    };

    const renderField = (field) => {
        const { name, type } = field;

        switch (type) {
            case 'Text':
            case 'Email':
            case 'Password':
                return (
                    <div key={name} className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={name}>
                            {name}
                        </label>
                        <input
                            type={type.toLowerCase()}
                            id={name}
                            {...register(name, { required: true, pattern: type === 'Email' ? /^\S+@\S+$/i : undefined })}
                            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors[name] ? 'border-red-500' : ''}`}
                        />
                        {errors[name] && (
                            <p className="text-red-500 text-xs italic">
                                {type === 'Email' ? 'Invalid email address' : `${name} is required.`}
                            </p>
                        )}
                    </div>
                );
            case 'Number':
                return (
                    <div key={name} className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={name}>
                            {name}
                        </label>
                        <input
                            type="number"
                            id={name}
                            {...register(name, { required: true })}
                            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors[name] ? 'border-red-500' : ''}`}
                        />
                        {errors[name] && (
                            <p className="text-red-500 text-xs italic">
                                {`${name} is required.`}
                            </p>
                        )}
                    </div>
                );
            case 'Date':
                return (
                    <div key={name} className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={name}>
                            {name}
                        </label>
                        <input
                            type="date"
                            id={name}
                            {...register(name, { required: true })}
                            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors[name] ? 'border-red-500' : ''}`}
                        />
                        {errors[name] && (
                            <p className="text-red-500 text-xs italic">
                                {`${name} is required.`}
                            </p>
                        )}
                    </div>
                );
            case 'Boolean':
                return (
                    <div key={name} className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={name}>
                            {name}
                        </label>
                        <input
                            type="checkbox"
                            id={name}
                            {...register(name)}
                            className="mr-2 leading-tight"
                        />
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-lg mx-auto">
            {fields.map(field => renderField(field))}
            <div className="flex items-center justify-between">
                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline"
                >
                    Submit
                </button>
                <button
                    type="button"
                    onClick={onClose}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline mr-2"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
};

DynamicForm.propTypes = {
    fields: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            type: PropTypes.string.isRequired,
            unique: PropTypes.bool.isRequired
        })
    ).isRequired,
    onClose: PropTypes.func.isRequired
};

export default DynamicForm;
