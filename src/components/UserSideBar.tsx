import React from "react";
import Link from "next/link";
import GroupParticipants from "./GroupParticipants";
import GroupParticipantModal from "./GroupParticipantsModal";
import { api } from "@/utils/api";
import { useRouter } from "next/router";
import { useGlobalContext } from "@/context";
import { toast } from "react-hot-toast";
import CustomModal from "./Modal";
import TeamInviteForm from "./TeamInviteForm";

interface participant {
  key: string;
  username: string;
  imageUrl: string;
  admin: boolean;
}

interface UserSideBarProps {
  chatRoomName: string;
  isOpen: boolean;
  handleDrawerToggle: () => void;
  participants: participant[];
  chatroomType: "private" | "team";
}
const UserSideBar: React.FC<UserSideBarProps> = ({
  chatRoomName,
  isOpen,
  handleDrawerToggle,
  participants,
  chatroomType,
}) => {
  const { user } = useGlobalContext();
  const router = useRouter();
  const [openInviteModal, setOpenInviteModal] = React.useState(false);

  const [friendId, setFriendId] = React.useState("");

  const { mutate: unfriendUser, isLoading: isLoadingLeaveChat } =
    api.chat.unfriendUser.useMutation();

  const { mutate: leaveTeam } = api.chat.leaveTeam.useMutation();

  React.useEffect(() => {
    if (!user || !participants) return;
    const friend = participants.find(
      (participant) => user._id !== participant.key
    );
    setFriendId(friend?.key || "");
  }, [participants, user]);

  const handleUnfriendUser = () => {
    unfriendUser(
      { friend_id: friendId },
      {
        onSuccess: () => {
          toast.success("User unfriended successfully.");
          void router.push("/chat");
          void router.reload();
        },
        onError: (error) => {
          toast.error(error.message);
        },
      }
    );
  };

  const chatroom_id = React.useMemo(() => {
    return router.query.id as string;
  }, [router.query.id]);

  const handleLeaveTeam = () => {
    leaveTeam(
      { chatroom_id: chatroom_id },
      {
        onSuccess: () => {
          toast.success("Team left successfully.");
          void router.push("/chat");
          void router.reload();
        },
        onError: (error) => {
          toast.error(error.message);
        },
      }
    );
  };

  console.log("otrona", chatroomType);

  return (
    <>
      <input type="checkbox" id="my-modal-3" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box relative px-0 pt-0">
          <GroupParticipantModal participants={participants} />
        </div>
      </div>
      <div className="drawer-side">
        <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
        <ul
          className={`menu w-80 bg-base-100 text-base-content  ${
            isOpen ? "" : "hidden"
          }`}
        >
          <div className="pb-2 ps-5 pt-5 ">
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
          </div>

          {/* <div className="flex flex-wrap bg-base-200 p-5">
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
            <li className=" ms-5">Group Info</li>
          </div> */}
          <div className="self-center text-center">
            <div className="avatar mt-5 self-center">
              <div className="w-24 rounded-full">
                <img src="https://picsum.photos/200/300" />
              </div>
            </div>
            <div className="mt-2 font-bold">{chatRoomName}</div>
            <div className="mt-2">
              Group | {participants.length} participants
            </div>
          </div>
          <div className="divider mx-2"></div>
          <div className="mx-3 my-1 flex flex-wrap justify-between">
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
            {chatroomType === "team" ? (
              <button
                onClick={() => {
                  setOpenInviteModal(true);
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
            ) : null}
          </div>

          <div>
            {participants.map((participant, index) => (
              <GroupParticipants
                key={index}
                name={participant.username}
                imageUrl={participant.imageUrl}
                admin={participant.admin}
              />
            ))}
          </div>
          <div className="divider"></div>
          <div className="btn-outline btn-error btn mx-5 mb-5">
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
            <span className="ps-3">
              {chatroomType === "private" ? "Unfriend User" : "Leave Team"}
            </span>
          </div>
        </ul>

        {/* </div>
            <div className="mt-2 font-bold">ADES</div>
            <div className="mt-2">
              Group | {participants.length} participants
            </div>
          </div>
          <div className="divider mx-2"></div>
          <div className="mb-3 flex flex-wrap justify-between p-2">
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
            {chatroomType === "team" ? (
              <button>
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
            ) : null}
          </div>
          <div>
            {participants.map((participant, index) => (
              <GroupParticipants
                key={index}
                name={participant.username}
                imageUrl={participant.imageUrl}
                admin={participant.admin}
              />
            ))}
          </div>
          <div className="divider"></div>
          <div
            className="btn-outline btn-error btn mx-5 mb-5"
            onClick={() => {
              chatroomType === "private"
                ? handleUnfriendUser()
                : handleLeaveTeam();
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
                d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
              />
            </svg>
            <span className="ps-3">
              {chatroomType === "private" ? "Unfriend User" : "Leave Team"}
            </span>
          </div>
        </ul> */}
      </div>
      <CustomModal
        modalOpen={openInviteModal}
        setModalOpen={setOpenInviteModal}
      >
        <TeamInviteForm setOpenTeamInvite={setOpenInviteModal} />
      </CustomModal>
    </>
  );
};

export default UserSideBar;
