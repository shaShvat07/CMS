import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DynamicForm } from '..';

const FormPage = () => {
    const [fields, setFields] = useState([]);
    const token = localStorage.getItem('token');
    useEffect(() => {
        // Fetch the form fields data from your backend
        axios.get('http://localhost:3000/collection/12/prop', {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        })
        .then(response => setFields(response.data))
        .catch(error => console.error('Error fetching form fields:', error));
}, [token]);

return (
    <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Dynamic Form</h1>
        <DynamicForm fields={fields} />
    </div>
);
};

export default FormPage;
