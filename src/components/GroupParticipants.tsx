import React from 'react';

interface GroupParticipantsProps {
  name: string;
  imageUrl: string;
  admin: boolean;
}

const GroupParticipants: React.FC<GroupParticipantsProps> = ({ name, imageUrl, admin }) => {
  return (
    <div className = "border border-bg-base-200">
      <div className="flex py-4 flex-wrap btn btn-ghost justify-start w-full h-full">
        <div className="avatar justify-self-center">
          <div className="w-10 rounded-full">
            <img src={imageUrl} />
          </div>
        </div>
        <div className="font-bold ms-5 normal-case">{name}</div>
        {admin && <div className="badge badge-outline ml-auto me-3">Group Admin</div>}

      </div>
    </div>
  );
};

export default GroupParticipants;
