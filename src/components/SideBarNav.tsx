import ChatList from "./ChatList";
import ChatMenuItem from "./ChatMenuItem";
import React from "react";
import TeamList from "./TeamList";
import Profile from "./Profile/Account";
import Link from "next/link";
import { api } from "@/utils/api";
import { useGlobalContext } from "@/context";
// import Chatroom from "@/models/Chatroom";
import { toast } from "react-hot-toast";
import { ChatRoom } from "@/utils/chat";
import { IChatroom } from "@/models/Chatroom";
import CustomModal from "./Modal";
import CreateTeamForm from "./CreateTeamForm";
import SendFriendRequestForm from "./SendFriendRequestForm";
import NotificationList from "./NotificationList";
import { Message } from "@/utils/chat";
import { ObjectId } from "mongoose";

export interface ChatroomInfoWithParticipantNames {
  _id: ObjectId;
  name: string;
  type: string;
  participants: {
    _id: string;
    username: string;
  }[];
  messages: Message[];
}

export default function SideBarNav({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useGlobalContext();
  const [chatrooms, setChatrooms] = React.useState<IChatroom[]>([]);
  // const [notifications, setNotifications] = React.useState<
  //   typeof notificationsData
  // >([]);
  const [activeTab, setActiveTab] = React.useState(0);
  const handleTabChange = (index: number) => {
    setActiveTab(index);
  };
  const {
    data: chatroomsData,
    isLoading,
    refetch: refetchChatrooms,
  } = api.chat.getChatrooms.useQuery();
  // const { data: notificationsData, isLoading: isLoadingNotifications } =
  //   api.notification.getNotifications.useQuery();
  const [openAddChatroomModal, setOpenAddChatroomModal] = React.useState(false);

  React.useEffect(() => {
    if (isLoading || !chatroomsData) return;
    setChatrooms(chatroomsData);
  }, [isLoading, chatroomsData]);

  // get chatrooms with the type of team
  const teamChatrooms: IChatroom[] = React.useMemo(() => {
    return chatrooms.filter((chatroom: IChatroom) => chatroom.type === "team");
  }, [chatrooms]);

  // get chatrooms with the type of private

  const privateChatrooms: IChatroom[] = React.useMemo(() => {
    return chatrooms.filter(
      (chatroom: IChatroom) => chatroom.type === "private"
    );
  }, [chatrooms]);

  return (
    <div className="drawer-mobile drawer -z-10">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        {children}
        <CustomModal
          modalOpen={openAddChatroomModal}
          setModalOpen={setOpenAddChatroomModal}
        >
          {activeTab === 0 && (
            <SendFriendRequestForm
              setOpenAddChatroomModal={setOpenAddChatroomModal}
            />
          )}
          {activeTab === 1 && (
            <CreateTeamForm
              setOpenAddChatroomModal={setOpenAddChatroomModal}
              refetchChatrooms={refetchChatrooms}
            />
          )}
        </CustomModal>
        {/* <label
          htmlFor="my-drawer-2"
          className="btn-primary drawer-button btn lg:hidden"
        >
          Open drawer
        </label> */}
      </div>
      <style>
        {` .drawer-side::-webkit-scrollbar { width: 0; background-color: transparent; } `}
      </style>
      <div className="drawer-side">
        <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
        <ul className="base-200 menu relative w-80 bg-neutral-content p-4">
          {/* <div className="avatar">
            <div className=" w-24 content-center rounded-full ring ring-primary ring-offset-2 ring-offset-base-100">
              <img src="https://source.unsplash.com/random/?city,night" />
            </div>
          </div>
          <Link className="btn-primary btn my-5 rounded-lg" href="/profile">
            Profile
          </Link> */}
          <div className="tabs mb-4 w-full">
            <a
              className={
                "tab-bordered tab w-1/3 " +
                (activeTab === 0 ? " tab-active" : "")
              }
              onClick={() => handleTabChange(0)}
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
                  d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                />
              </svg>
            </a>
            <a
              className={
                "tab-bordered tab w-1/3 " +
                (activeTab === 1 ? " tab-active" : "")
              }
              onClick={() => handleTabChange(1)}
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
                  d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
                />
              </svg>
            </a>
            <a
              className={
                "tab-bordered tab w-1/3 " +
                (activeTab === 2 ? " tab-active" : "")
              }
              onClick={() => handleTabChange(2)}
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
                  d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0M3.124 7.5A8.969 8.969 0 015.292 3m13.416 0a8.969 8.969 0 012.168 4.5"
                />
              </svg>
            </a>
          </div>
          {activeTab !== 2 && (
            <input
              type="text"
              placeholder="Search chat"
              className="input w-full max-w-xs"
            />
          )}

          <div className="flex-1">
            <ChatList
              privateChatrooms={privateChatrooms}
              display={activeTab === 0}
            />

            <TeamList teamChatrooms={teamChatrooms} display={activeTab === 1} />

            <NotificationList
              refetchChatrooms={refetchChatrooms}
              display={activeTab === 2}
            />

            {/* {activeTab === 0 && (
              <ChatList privateChatrooms={privateChatrooms} />
            )}
            {activeTab === 1 && <TeamList teamChatrooms={teamChatrooms} />}
            {activeTab === 2 && (
              <NotificationList refetchChatrooms={refetchChatrooms} />
            )} */}
          </div>
          {activeTab !== 2 && (
            <button
              className="btn-outline glass btn-circle btn-lg btn sticky bottom-10"
              onClick={() => {
                setOpenAddChatroomModal(true);
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
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
            </button>
          )}
        </ul>
      </div>
    </div>
  );
}
