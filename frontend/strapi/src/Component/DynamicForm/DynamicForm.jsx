import React from 'react';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';

const DynamicForm = ({ fields }) => {
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = data => {
        console.log(data);
    };

    const renderField = (field) => {
        const { name, type, unique } = field;

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
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                    Submit
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
    ).isRequired
};

export default DynamicForm;
