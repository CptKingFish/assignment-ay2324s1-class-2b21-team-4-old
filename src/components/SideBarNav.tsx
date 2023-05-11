import ChatList from "./ChatList";
import ChatMenuItem from "./ChatMenuItem";
import React from "react";
import TeamList from "./TeamList";

const chatInfoArr = [
  {
    id: "1",
    avatarUrl: "https://i.pravatar.cc/300?img=1",
    name: "John Doe",
    lastMessage: "Hello, World!",
    lastMessageTime: "9:45 PM",
  },
  {
    id: "2",
    avatarUrl: "https://i.pravatar.cc/300?img=1",
    name: "John Doe",
    lastMessage: "Hello, World!",
    lastMessageTime: "9:45 PM",
  },
  {
    id: "3",
    avatarUrl: "https://i.pravatar.cc/300?img=1",
    name: "John Doe",
    lastMessage: "Hello, World!",
    lastMessageTime: "9:45 PM",
  },
  {
    id: "4",
    avatarUrl: "https://i.pravatar.cc/300?img=1",
    name: "John Doe",
    lastMessage: "Hello, World!",
    lastMessageTime: "9:45 PM",
  },
  {
    id: "5",
    avatarUrl: "https://i.pravatar.cc/300?img=1",
    name: "John Doe",
    lastMessage: "Hello, World!",
    lastMessageTime: "9:45 PM",
  },
  {
    id: "6",
    avatarUrl: "https://i.pravatar.cc/300?img=1",
    name: "John Doe",
    lastMessage: "Hello, World!",
    lastMessageTime: "9:45 PM",
  },
  {
    id: "7",
    avatarUrl: "https://i.pravatar.cc/300?img=1",
    name: "John Doe",
    lastMessage: "Hello, World!",
    lastMessageTime: "9:45 PM",
  },
  {
    id: "8",
    avatarUrl: "https://i.pravatar.cc/300?img=1",
    name: "John Doe",
    lastMessage: "Hello, World!",
    lastMessageTime: "9:45 PM",
  },

];

const teamInfoArr = [
  {
    id: "1",
    avatarUrl: "https://i.pravatar.cc/300?img=1",
    name: "Orlando",
    lastSender: "John Doe",
    lastMessage: "Hello, World!",
    lastMessageTime: "9:45 PM",
  },
  {
    id: "2",
    avatarUrl: "https://i.pravatar.cc/300?img=1",
    name: "Proj",
    lastSender: "Mary Doe",
    lastMessage: "Hello, World!",
    lastMessageTime: "9:45 PM",
  },
];

export default function SideBarNav({
  children,
}: {
  children: React.ReactNode;
}) {
  const [activeTab, setActiveTab] = React.useState(0);
  const handleTabChange = (index: number) => {
    setActiveTab(index);
  };
  return (
    <div className="drawer-mobile drawer">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col items-center justify-center">
        <div>{children}</div>
        <label
          htmlFor="my-drawer-2"
          className="btn-primary drawer-button btn lg:hidden"
        >
          Open drawer
        </label>
      </div>
      <style>
        {` .drawer-side::-webkit-scrollbar { width: 0; background-color: transparent; } `}
      </style>
      <div className="drawer-side">
        <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
        <ul className="base-200 menu relative w-80 bg-neutral-content p-4">
          <div>sidebar content</div>
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
          <input
            type="text"
            placeholder="Search chat"
            className="input w-full max-w-xs"
          />
          <div>
            {activeTab === 0 && <ChatList chatInfoArr={chatInfoArr} />}
            {activeTab === 1 && <TeamList teamInfoArr={teamInfoArr} />}
            {activeTab === 2 && null}
          </div>
          <button className="btn-outline glass btn-circle btn absolute bottom-10 right-10">
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
        </ul>
      </div>
    </div>
  );
}
