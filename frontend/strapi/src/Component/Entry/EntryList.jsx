import React, { useState } from 'react';
import { DeleteEntryModal, UpdateEntryModal } from '..';

const EntryList = ({ entries, collection }) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);

  const handleUpdateClick = (entry) => {
    setSelectedEntry(entry);
    setIsUpdateModalOpen(true);
  };

  return (
    <div className="container mx-auto p-4 overflow-x-auto text-white mr-48">
      <DeleteEntryModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        collectionId={collection.collection_id}
        entryId={selectedEntry?.id}
      />
      {selectedEntry && (
        <UpdateEntryModal
          isOpen={isUpdateModalOpen}
          onClose={() => setIsUpdateModalOpen(false)}
          fields={collection.properties}
          initialValues={selectedEntry}
          entryId={selectedEntry.id}
        />
      )}
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
                <img
                  src="/edit.svg"
                  className="hover:cursor-pointer"
                  onClick={() => handleUpdateClick(entry)}
                  alt="Edit"
                />
                <img
                  src="/delete.svg"
                  className="hover:cursor-pointer"
                  onClick={() => {
                    setIsDeleteModalOpen(true);
                    setSelectedEntry(entry);
                  }}
                  alt="Delete"
                />
              </td>
            </tr>
          ))}
          {!entries.length && (
            <tr>
              <td colSpan={collection?.properties?.length + 2} className="border px-4 py-2 text-center">
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
