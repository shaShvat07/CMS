// Collection.js
import React, { useState } from 'react';
import { convertToIST } from '../utils';

const Collection = ({ collection, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="p-4 bg-gray-700 text-white rounded-lg shadow mb-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-primary-300">
            {index + 1}. {collection.collection_name}
          </h2>
          <p>Created At: {convertToIST(collection.created_at)}</p>
          <p>Updated At: {convertToIST(collection.updated_at)}</p>
        </div>
        <button
          className="px-4 py-2 bg-primary-600 text-white rounded-lg"
          onClick={toggleExpand}
        >
          {isExpanded ? 'Collapse' : 'Expand'}
        </button>
      </div>
      {isExpanded && (
        <table className="min-w-full mt-4 bg-gray-800 rounded-lg">
          <thead>
            <tr className='text-xl text-primary-300'>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Type</th>
              <th className="px-4 py-2">Unique</th>
            </tr>
          </thead>
          <tbody>
            {collection.properties.map((prop, propIndex) => (
              <tr key={propIndex} className="border-b">
                <td className="px-4 py-2 text-center">{prop.name}</td>
                <td className="px-4 py-2 text-center">{prop.type}</td>
                <td className="px-4 py-2 text-center">{prop.unique ? 'Yes' : 'No'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Collection;
