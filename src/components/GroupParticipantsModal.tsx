import React, { useState } from 'react';
import GroupParticipants from './GroupParticipants';

interface GroupParticipantModalProps {
  participants: {
    key: string | number;
    name: string;
    imageUrl: string;
    admin: boolean;
  }[];
}

const GroupParticipantModal: React.FC<GroupParticipantModalProps> = ({ participants }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const filteredParticipants = participants.filter((participant) =>
    participant.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <label htmlFor="my-modal-3" className="btn btn-sm btn-circle absolute right-2 top-2">
        ✕
      </label>
      <div className="mt-5">
        <div className="mb-4">
          <input
            type="text"
            className="w-full px-4 py-2 border rounded shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search participants"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        {participants.map((participant) => {
          const isFiltered = !filteredParticipants.includes(participant);
          if (!isFiltered) {
            return (
              <GroupParticipants
                key={participant.key}
                name={participant.name}
                imageUrl={participant.imageUrl}
                admin={participant.admin}
              />
            );
          }
          return null;
        })}
      </div>
    </>
  );
};

export default GroupParticipantModal;
