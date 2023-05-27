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
import { useRouter } from "next/router";

export interface ChatroomInfoWithParticipantNames {
  _id: ObjectId;
  name: string;
  avatar:string;
  type: string;
  participants: {
    _id: string;
    username: string;
    avatar: string;
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
  const router = useRouter();
  const { mutate: logout } = api.user.logout.useMutation();
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
          <SendFriendRequestForm
            setOpenAddChatroomModal={setOpenAddChatroomModal}
            hidden={activeTab !== 0}
          />
          <CreateTeamForm
            setOpenAddChatroomModal={setOpenAddChatroomModal}
            refetchChatrooms={refetchChatrooms}
            hidden={activeTab !== 1}
          />

          {/* {activeTab === 0 && (
            <SendFriendRequestForm
              setOpenAddChatroomModal={setOpenAddChatroomModal}
            />
          )}
          {activeTab === 1 && (
            <CreateTeamForm
              setOpenAddChatroomModal={setOpenAddChatroomModal}
              refetchChatrooms={refetchChatrooms}
            />
          )} */}
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
        <ul className="base-200 menu w-80 bg-neutral-content p-4 pt-0">
          <div className="-mx-4 flex flex-wrap justify-between">
            <div className="avatar my-2 ms-5">
              <div className="w-16 content-center rounded-full ring ring-primary ring-offset-2 ring-offset-base-100">
                <Link href="/profile">
                  <img src={user?.avatar || "/Profile.png"} />
                </Link>
              </div>
            </div>
            <div className="me-5 mt-5">
              <div
                className="float-right ms-5 cursor-pointer"
                onClick={() => {
                  logout(undefined, {
                    onSuccess: () => {
                      localStorage.removeItem("token");
                      router.push("/authenticate").catch(console.error);
                      toast.success("Logged out successfully");
                    },
                  });
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
              </div>
              <Link href="/profile" className="float-right">
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
                    d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </Link>
            </div>
          </div>
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
