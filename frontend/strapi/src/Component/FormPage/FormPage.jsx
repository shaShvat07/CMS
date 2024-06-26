import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DynamicForm } from '..';
import { useParams } from 'react-router-dom';

const FormPage = ({ onClose }) => {
    const [fields, setFields] = useState([]);
    const token = localStorage.getItem('token');
    const { collectionId } = useParams();
    useEffect(() => {
        // Fetch the form fields data from your backend
        axios.get(`http://localhost:3000/collection/${collectionId}/prop`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        })
        .then(response => setFields(response.data))
        .catch(error => console.error('Error fetching form fields:', error));
}, [token, collectionId]);

return (
    <div className="container mx-auto p-4">
        <DynamicForm fields={fields} onClose={onClose}/>
    </div>
);
};

export default FormPage;
