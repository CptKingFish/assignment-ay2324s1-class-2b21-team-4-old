import React from 'react';

interface GroupParticipantsProps {
  key: string | number; // Add the key prop
  name: string;
  imageUrl: string;
  admin: boolean;
}

const GroupParticipants: React.FC<GroupParticipantsProps> = ({ key, name, imageUrl, admin }) => {
  return (
    <div className="flex flex-wrap mt-2 btn btn-ghost justify-start" key = {key}> {/* Include the key prop */}
      <div className="avatar self-center">
        <div className="w-10 rounded-full">
          <img src="https://picsum.photos/200/300" alt={name} />
        </div>
      </div>
      <div className="font-bold ms-5 normal-case">{name}</div>
      {admin && <div className="badge badge-outline ml-auto me-3">Group Admin</div>}
    </div>
  );
};

export default GroupParticipants;
