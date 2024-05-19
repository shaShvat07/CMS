import React, { useState } from 'react';
import { DeleteEntryModal } from '..';

const EntryList = ({ entries, collection }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [EntryId, setEntryId] = useState('');
  return (
    <div className="container mx-auto p-4 overflow-x-auto text-white mr-48">
      <DeleteEntryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        collectionId={collection.collection_id}
        entryId={EntryId}
      />
      <table className="min-w-full bg-gray-800 overflow-hidden">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left">ID</th>
            {collection?.properties?.map((prop) => (
              <th key={prop.id} className="px-4 py-2 text-left">
                {prop.name}
              </th>
            ))}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr key={entry.id}>
              <td className="border px-4 py-2">{entry.id}</td>
              {collection?.properties?.map((prop) => (
                <td key={prop.id} className="border px-4 py-2">
                  {entry[prop.name]}
                </td>
              ))}
              <td className="border px-4 py-2 flex justify-around">
                <img src="/edit.svg"></img>
                <img
                  src="/delete.svg"
                  className='hover:cursor-pointer'
                  onClick={() => {
                    setIsModalOpen(true);
                    setEntryId(entry.id);
                  }}>
                </img>
              </td>
            </tr>
          ))}
          {!entries.length && (
            <tr>
              <td colSpan={collection?.properties?.length + 1} className="border px-4 py-2 text-center">
                No entries found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default EntryList;
