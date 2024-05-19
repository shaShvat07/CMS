// CollectionsList.js
import React from 'react';
import Collection from './Collection';

const CollectionsList = ({ collections }) => {
  return (
    <div className="container mx-auto p-4">
      {collections.map((collection, index) => (
        <Collection key={collection.collection_id} collection={collection} index={index} />
      ))}
    </div>
  );
};

export default CollectionsList;
