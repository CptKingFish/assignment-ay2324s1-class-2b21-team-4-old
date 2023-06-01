import Link from "next/link";
import GroupParticipants from "./GroupParticipants";
import GroupParticipantModal from "./GroupParticipantsModal";
import React from "react";
import { api } from "@/utils/api";
import toast from "react-hot-toast";
import { useGlobalContext } from "@/context";
import GroupChangeChatroomName from "./GroupChangeChatroomName";
import GroupChangeIcon from "./GroupChangeIcon";
import ConfirmationDialog from "./ConfirmationDialog";
import CustomModal from "./Modal";
import TeamInviteForm from "./TeamInviteForm";

interface friend {
  friendID: string;
  chatID: string;
}
interface participant {
  key: string;
  username: string;
  imageUrl: string;
  admin: boolean;
  friends: friend[];
}

interface GroupSideBarProps {
  chatRoomId: string;
  chatRoomAvatar?: string;
  chatRoomName: string;
  isOpen: boolean;
  handleDrawerToggle: () => void;
  participants: participant[];
}
const GroupSideBar: React.FC<GroupSideBarProps> = ({
  chatRoomId,
  chatRoomAvatar,
  chatRoomName,
  isOpen,
  handleDrawerToggle,
  participants,
}) => {
  const [isOpenConfirmationDialog, setIsOpenConfirmationDialog] =
    React.useState(false);
  const [isOpenInviteModal, setIsOpenInviteModal] = React.useState(false);
  const { mutate: leaveTeam } = api.chat.leaveTeam.useMutation();
  const { user } = useGlobalContext();

  return (
    <>
      <input type="checkbox" id="my-modal-3" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box relative px-0 pt-0">
          <GroupParticipantModal participants={participants} />
        </div>
      </div>
      <GroupChangeChatroomName
        chatRoomId={chatRoomId}
        chatRoomName={chatRoomName}
      />
      <GroupChangeIcon chatRoomID={chatRoomId} chatRoomAvatar = {chatRoomAvatar || "/GroupProfile.png"} />
      <div className="drawer-side">
        <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
        <ul
          className={`menu relative w-80 border-l border-gray-200 bg-base-100 text-base-content  ${
            isOpen ? "" : "hidden"
          }`}
        >
          <div className="sticky top-0 z-50 flex h-20 w-full flex-wrap bg-base-300 p-5">
            <button className="" onClick={handleDrawerToggle}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <li className="texl-xl ms-5 mt-2 font-bold">Group Info</li>
          </div>
          <div className="self-center text-center">
            <div className="avatar relative mt-5 w-24 self-center overflow-hidden rounded-full">
              <div className = "rounded-full">
              <img
                src={chatRoomAvatar || "/GroupProfile.png"}
                alt=""
                className="h-full w-full object-cover transition-opacity duration-200 hover:opacity-50"
              />
              <label
                htmlFor="groupIcon"
                className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black opacity-0 transition-opacity duration-200 hover:opacity-100"
              >
                <p className="mt-3 text-white">Change Group Icon</p>
              </label>
              </div>
              
            </div>
            <div className="mt-2 flex flex-wrap justify-center font-bold ">
              {chatRoomName}
              <label htmlFor="chatname" className="ms-2 cursor-pointer">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className=" h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                  />
                </svg>
              </label>
            </div>
            <div className="mt-2">
              Group | {participants.length} participants
            </div>
          </div>
          <div className="divider mx-2"></div>
          <div className="mx-3 mb-2 flex flex-wrap justify-between">
            <div className="flex flex-wrap">
              <li className="mx-2">{participants.length} Participants</li>
              <label htmlFor="my-modal-3" className="cursor-pointer">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-3 w-3"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                  />
                </svg>
              </label>
            </div>
            <button
              onClick={() => {
                setIsOpenInviteModal(true);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z"
                />
              </svg>
            </button>
          </div>
          <div>
            {participants.map((participant, index) => (
              <GroupParticipants
                key={index}
                id={participant.key}
                name={participant.username}
                imageUrl={participant.imageUrl}
                admin={participant.admin}
                friend={
                  participant.friends &&
                  participant.friends.some(
                    (friend) => friend.friendID === user?._id
                  )
                }
                friendUrl={
                  participant.friends.find((friend: friend) => {
                    return friend.friendID === user?._id;
                  })?.chatID || ""
                }
                self={user?.username === participant.username}
                selfAdmin={participants.some(
                  (participant) =>
                    participant.username === user?.username && participant.admin
                )}
              />
            ))}
          </div>
          <div className="divider"></div>
          <button
            onClick={() => {
              setIsOpenConfirmationDialog(true);
            }}
            className="btn-outline btn-error btn mx-5 mb-5"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
              />
            </svg>
            Leave Group
          </button>
        </ul>
      </div>
      <ConfirmationDialog
        title="Leave Team"
        description="Are you sure you want to leave the team?"
        onConfirm={() => {
          leaveTeam(
            { chatroom_id: chatRoomId },
            {
              onSuccess: (data) => {
                toast.success("Left the team successfully!");
                window.location.href = "/chat";
              },
              onError: (error) => {
                toast.error("Error when leaving Team!");
              },
            }
          );
        }}
        isOpen={isOpenConfirmationDialog}
        setIsOpen={setIsOpenConfirmationDialog}
      />
      <CustomModal
        modalOpen={isOpenInviteModal}
        setModalOpen={setIsOpenInviteModal}
      >
        <TeamInviteForm setOpenTeamInvite={setIsOpenInviteModal} />
      </CustomModal>
    </>
  );
};

export default GroupSideBar;
