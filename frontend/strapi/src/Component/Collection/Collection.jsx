// Collection.js
import React, { useState } from 'react';
import { convertToIST } from '../utils';
import { UpdateCollectionModal, DeleteCollectionModal, PropModal } from '..';

const Collection = ({ collection, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isPropModalOpen, setIsPropModalOpen] = useState(false);

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
        <>
          <div className='flex w-full justify-around mt-3'>
            <button className="text-white bg-primary-600 p-2 rounded-lg"
              onClick={() => setIsModalOpen(true)}>
              Edit Collection Name
            </button>
            <button className="text-white bg-red-600 p-2 rounded-lg"
              onClick={() => setIsDeleteModalOpen(true)}>
              Delete Collection
            </button>
            <button className="text-white bg-primary-600 p-2 rounded-lg"
              onClick={() => setIsPropModalOpen(true)}>
              Add a Property
            </button>
          </div>
          <UpdateCollectionModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            collectionId={collection.collection_id}
          />
          <DeleteCollectionModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            collectionId={collection.collection_id}
          />
          <PropModal
            isOpen={isPropModalOpen}
            onClose={() => setIsPropModalOpen(false)}
            collectionId={collection.collection_id}
          />
          <div className="mt-3 border"></div>
          <div className='text-white text-center text-2xl mt-3'> Property Table </div>
          <table className="min-w-full mt-4 bg-gray-800 rounded-lg">
            <thead>
              <tr className='text-xl text-primary-300'>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Type</th>
                <th className="px-4 py-2">Unique</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {collection && collection.properties && collection.properties.map((prop, propIndex) => (
                <tr key={propIndex} className="border-b">
                  <td className="px-4 py-2 text-center">{prop.name}</td>
                  <td className="px-4 py-2 text-center">{prop.type}</td>
                  <td className="px-4 py-2 text-center">{prop.unique ? 'Yes' : 'No'}</td>
                  <td className="px-4 py-2 text-center">Delete</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default Collection;
