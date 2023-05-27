import Link from "next/link";
import GroupParticipants from "./GroupParticipants";
import GroupParticipantModal from "./GroupParticipantsModal";
import React from "react";
import { api } from "@/utils/api";
import ConfirmationDialog from "./ConfirmationDialog";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";

interface participant {
  key: string;
  username: string;
  imageUrl: string;
  admin: boolean;
}

interface PrivateSideBarProps {
  chatRoomAvatar?: string;
  chatRoomName: string;
  isOpen: boolean;
  handleDrawerToggle: () => void;
  participants: participant[];
  otherUserId: string;
}
const PrivateSideBar: React.FC<PrivateSideBarProps> = ({
  chatRoomAvatar,
  chatRoomName,
  isOpen,
  handleDrawerToggle,
  participants,
  otherUserId,
}) => {
  const [isOpenConfirmationDialog, setIsOpenConfirmationDialog] =
    React.useState(false);
  const { mutate: unfriendUser } = api.chat.unfriendUser.useMutation();
  const router = useRouter();

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
          <div className="flex h-20 flex-wrap border-l border-gray-200 bg-base-300 p-5">
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
          </div>
          <div className="self-center text-center">
            <div className="avatar mt-5 self-center">
              <div className="w-24 rounded-full">
                <img src={chatRoomAvatar || "/GroupProfile.png"} />
              </div>
            </div>
            <div className="mt-2 font-bold">{chatRoomName}</div>
          </div>
          <div className="divider mx-2"></div>
          <div
            className="btn-outline btn-error btn mx-5 mb-5"
            onClick={() => {
              setIsOpenConfirmationDialog(true);
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
            Unfriend
          </div>
        </ul>
      </div>
      <ConfirmationDialog
        title="Unfriend"
        description="Are you sure you want to unfriend this user?"
        onConfirm={() => {
          unfriendUser(
            { friend_id: otherUserId },
            {
              onSuccess: () => {
                toast.success("Unfriended successfully");
                setIsOpenConfirmationDialog(false);
                window.location.href = "/chat";
                // router.push("/chat").catch((err) => {
                //   console.log(err);
                // });
              },
              onError: (error) => {
                toast.error(error.message);
              },
            }
          );
        }}
        isOpen={isOpenConfirmationDialog}
        setIsOpen={setIsOpenConfirmationDialog}
      />
    </>
  );
};

export default PrivateSideBar;
