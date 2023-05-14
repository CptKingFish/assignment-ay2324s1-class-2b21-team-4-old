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
      <div className="flex flex-wrap bg-base-200 p-2">
        <label htmlFor="my-modal-3" className="btn btn-sm btn-circle">
          ✕
        </label>
        <div className="ms-5 font-bold">
          Search Participants
        </div>
      </div>

      <div className="mt-5">
        <div className="mb-4 px-3">
          <input
            type="text"
            className="w-full px-4 py-2 border rounded shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 me-5"
            placeholder="Name"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        {participants.map((participant) => {
          const isFiltered = !filteredParticipants.includes(participant);
          if (!isFiltered) {
            return (
              <React.Fragment key={participant.key}>
                <GroupParticipants
                  name={participant.name}
                  imageUrl={participant.imageUrl}
                  admin={participant.admin}
                />
              </React.Fragment>
            );
          }
          return null;
        })}
      </div>
    </>
  );
};

export default GroupParticipantModal;
