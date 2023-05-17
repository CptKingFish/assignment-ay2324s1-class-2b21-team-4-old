import Link from "next/link";
import { useGlobalContext } from "@/context";
import React from "react";
import Box from "@/components/Box";
import UserSideBar from "@/components/UserSideBar";

const Chat = () => {
  const { user } = useGlobalContext();
  const [isOpen, setIsOpen] = React.useState(true);

  function handleDrawerToggle() {
    setIsOpen(!isOpen);
  }
  return (
    <div className="drawer drawer-mobile drawer-end">
      <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
      <div className="flex-no-wrap drawer-content flex">
        <Box />
        <button
          className={` h-screen items-center justify-center bg-base-200 px-2 text-4xl text-white ${
            isOpen ? "hidden" : ""
          }`}
          onClick={handleDrawerToggle}
        >
          {"<"}
        </button>
      </div>

      <UserSideBar
        isOpen={isOpen}
        handleDrawerToggle={handleDrawerToggle}
        participants={[]}
      />
    </div>
  );
};

export default Chat;
