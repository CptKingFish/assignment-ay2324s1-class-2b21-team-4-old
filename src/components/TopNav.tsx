import { useGlobalContext } from "@/context";
import React from "react";

interface TopNavProps {
  chatroom_name: string;
  openSidebarDetails: () => void;
}

export default function TopNav({
  chatroom_name,
  openSidebarDetails,
}: TopNavProps) {
  const { user } = useGlobalContext();
  return (
    <div className="navbar h-20 bg-base-300">
      <div className="flex-1 cursor-pointer" onClick={openSidebarDetails}>
        <div className="avatar pl-5">
          <div className="w-16 rounded-xl">
            {/* <span className="text-3xl">K</span> */}
            <img src="https://source.unsplash.com/random/?city,night" />
          </div>
        </div>
        <div className="">
          <span className="ms-5 text-xl normal-case">{chatroom_name}</span>
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
