// EntryList.js
import React from 'react';

const EntryList = ({ entries }) => {
    return (
        <div className="container mx-auto p-4">
        {entries?.map((entry) => (
          <>
            <div className='text-white'>
              {entry.id}
            </div>
          </>
        ))}
        {!entries && <div>No entries found.</div>}
      </div>
    );
};

export default EntryList;
