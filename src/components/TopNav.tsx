import { useGlobalContext } from "@/context";
import React from "react";

interface TopNavProps {
  avatar: string;
  chatroom_name: string;
  chatroom_type: "private" | "team";
  username?:string;
  openSidebarDetails: () => void;
}

export default function TopNav({
  avatar,
  chatroom_name,
  chatroom_type,
  username,
  openSidebarDetails,
}: TopNavProps) {
  const { user } = useGlobalContext();
  return (
    <div className="h-13 navbar bg-base-300">
      <div className="flex-1 cursor-pointer" onClick={openSidebarDetails}>
        <div className="avatar pl-5">
          <div
            className={`w-16 ${
              chatroom_type === "private" ? "rounded-full" : "rounded-xl"
            }`}
          >
            {/* <span className="text-3xl">K</span> */}
            <img src={avatar} />
          </div>
        </div>
        <div className="grid">
          <span className="ms-5 text-xl normal-case">{chatroom_name}</span>
          {chatroom_type && "private" &&<span className="ms-5 text-xs normal-case">{username}</span>}
        </div>
      </div>
      <div className="flex-1">
        {/* <span
          className="ms-5 cursor-pointer text-xl normal-case"
        // onClick={drawer}
        >
        </span> */}
      </div>
    </div>
  );
}
