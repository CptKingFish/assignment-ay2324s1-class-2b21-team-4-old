import React, { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { api } from "@/utils/api";
import toast from "react-hot-toast";
import router from "next/router";

interface GroupParticipantsProps {
  id: string;
  name: string;
  imageUrl: string;
  admin: boolean;
  friend: boolean;
  self: boolean;
  selfAdmin: boolean;
  friendUrl: string;
}

const GroupParticipants: React.FC<GroupParticipantsProps> = ({
  id,
  name,
  imageUrl,
  admin,
  friend,
  self,
  selfAdmin,
  friendUrl,
}) => {
  const utils = api.useContext();

  const { mutate: makeAdmin } = api.chat.addAdminToChatroom.useMutation();
  const { mutate: removeAdmin } =
    api.chat.removeAdminFromChatroom.useMutation();
  const { mutate: kickUser } =
    api.chat.removeParticipantFromChatroom.useMutation();

  const { mutate: sendFriendRequest, isLoading: isLoadingSendFriendRequest } =
    api.notification.sendFriendRequestById.useMutation();

  const handleAddFriend = () => {
    sendFriendRequest(
      { receiver_id: id },
      {
        onSuccess: (data) => {
          toast.success("Friend request sent successfully!");
        },
        onError: (error) => {
          toast.error("Error when sending friend request!");
        },
      }
    );
  };

  const handleSendMessage = () => {
    console.log("friendUrl", friendUrl);
    window.location.href = "/privatechat/" + friendUrl;
  };

  const handleMakeAdmin = () => {
    makeAdmin(
      { chatroom_id: router.query.id as string, admin_id: id },
      {
        onSuccess: (data) => {
          toast.success("Made Admin successfully!");
          utils.chat.getAdminFromChatroom.invalidate({
            chatroom_id: router.query.id as string,
          });
          utils.chat.getUsernamesFromChatroom.invalidate({
            chatroom_id: router.query.id as string,
          });
          
        },
        onError: (error) => {
          toast.error("Error when making Admin!");
        },
      }
    );
  };

  const handleRemoveAdmin = () => {
    removeAdmin(
      { chatroom_id: router.query.id as string, admin_id: id },
      {
        onSuccess: (data) => {
          toast.success("Removed Admin successfully!");
          utils.chat.getAdminFromChatroom.invalidate({
            chatroom_id: router.query.id as string,
          });
          utils.chat.getUsernamesFromChatroom.invalidate({
            chatroom_id: router.query.id as string,
          });
          
        },
        onError: (error) => {
          toast.error("Error when removing Admin!");
        },
      }
    );
  };

  const handleKickUser = () => {
    kickUser(
      { chatroom_id: router.query.id as string, participant_id: id },
      {
        onSuccess: (data) => {
          toast.success("Kicked User successfully!");
          utils.chat.getUsernamesFromChatroom.invalidate({
            chatroom_id: router.query.id as string,
          });
          utils.chat.getAdminFromChatroom.invalidate({
            chatroom_id: router.query.id as string,
          });
          utils.chat.getMessagesAndChatroomInfo.invalidate({
            chatroom_id: router.query.id as string,
          });
        },
        onError: (error) => {
          toast.error("Error when kicking User!");
        },
      }
    );
  };
  //dropdown dropdown-end dropdown-bottom
  return (
    <>
      <Menu as="div" className="">
        <Menu.Button onClick={(e) => e.stopPropagation()} as="div" className="">
          <div className="border-bg-base-200 w-full  border">
            <div
              tabIndex={0}
              className="btn-ghost btn flex h-full w-full flex-wrap justify-start py-4"
            >
              <div className="avatar justify-self-center">
                <div className="w-10 rounded-full">
                  <img src={imageUrl} alt={name} />
                </div>
              </div>
              <div className="ms-5 font-bold normal-case">{name}</div>
              <div className="ml-auto">
                {admin && (
                  <div className="badge-outline badge normal-case">
                    Group Admin
                  </div>
                )}
              </div>
              {!self && (
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className=" absolute right-0 mt-40 w-40 rounded-md border border-gray-300">
                    {!friend && (
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            className={`${
                              active ? "bg-gray-200" : "bg-white"
                            } text-md group flex w-full space-x-1 p-3 font-light`}
                            onClick={handleAddFriend}
                          >
                            Add Friend
                          </button>
                        )}
                      </Menu.Item>
                    )}
                    {friend && (
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            className={`${
                              active ? "bg-gray-200" : "bg-white"
                            } text-md group flex w-full space-x-1 p-3 font-light`}
                            onClick={handleSendMessage}
                          >
                            Send Message
                          </button>
                        )}
                      </Menu.Item>
                    )}
                    {selfAdmin && !admin && (
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            className={`${
                              active ? "bg-gray-200" : "bg-white"
                            } text-md group flex w-full space-x-1 p-3     font-light`}
                            onClick={handleMakeAdmin}
                          >
                            Make Admin
                          </button>
                        )}
                      </Menu.Item>
                    )}
                    {selfAdmin && admin && (
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            className={`${
                              active ? "bg-gray-200" : "bg-white"
                            } text-md group flex w-full space-x-1 p-3     font-light`}
                            onClick={handleRemoveAdmin}
                          >
                            Remove From Admin
                          </button>
                        )}
                      </Menu.Item>
                    )}
                    {selfAdmin && (
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            className={`${
                              active ? "bg-gray-200" : "bg-white"
                            } text-md group flex w-full space-x-1 p-3 font-light`}
                            onClick={handleKickUser}
                          >
                            Kick User
                          </button>
                        )}
                      </Menu.Item>
                    )}
                  </Menu.Items>
                </Transition>
              )}
            </div>
          </div>
        </Menu.Button>
      </Menu>
    </>
  );
};

export default GroupParticipants;
