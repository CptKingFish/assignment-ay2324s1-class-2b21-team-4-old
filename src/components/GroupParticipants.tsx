import React from 'react';

interface GroupParticipantsProps {
  id: string;
  name: string;
  imageUrl: string;
  admin: boolean;
  friend: boolean;
  self: boolean;
  selfAdmin: boolean;
}

const GroupParticipants: React.FC<GroupParticipantsProps> = ({ id, name, imageUrl, admin, friend, self, selfAdmin }) => {
  const handleAddFriend = () => {
  };

  const handleSendMessage = () => {
    window.location.href = "/privatechat/" + id;
  };

  const handleMakeAdmin = () => {
    // Make admin logic
  };

  const handleRemoveAdmin = () => {
    // Remove admin logic
  };

  const handleKickUser = () => {
    // Kick user logic
  };
  return (
    <div className="border border-bg-base-200 dropdown dropdown-end dropdown-bottom w-full">
      <div tabIndex={0} className="flex py-4 flex-wrap btn btn-ghost justify-start w-full h-full">
        <div className="avatar justify-self-center">
          <div className="w-10 rounded-full">
            <img src={imageUrl} alt={name} />
          </div>
        </div>
        <div className="font-bold ms-5 normal-case">{name}</div>
        <div className="ml-auto">
          {admin && <div className="badge badge-outline normal-case">Group Admin</div>}
        </div>
        {!self && <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 border border-gray-200">
          {!friend && (
            <li>
              <button className="btn btn-sm btn-ghost font-light normal-case p-0" onClick={handleAddFriend}>
                Add Friend
              </button>
            </li>
          )}
          {friend && (
            <li>
              <button className="btn btn-sm btn-ghost font-light normal-case p-0" onClick={handleSendMessage}>
                Send Message
              </button>
            </li>
          )}
          {selfAdmin && !admin && (
            <li>
              <button className="btn btn-sm btn-ghost font-light normal-case p-0" onClick={handleMakeAdmin}>
                Make Admin
              </button>
            </li>
          )}
          {selfAdmin && admin && (
            <li>
              <button className="btn btn-sm btn-ghost font-light normal-case p-0" onClick={handleRemoveAdmin}>
                Remove from Admin
              </button>
            </li>
          )}
          {selfAdmin && <li>
            <button className="btn btn-sm btn-ghost font-light normal-case p-0" onClick={handleKickUser}>
              Kick User
            </button>
          </li>}
        </ul>}
      </div>
    </div>
  );
};

export default GroupParticipants;
