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
    <div className="drawer drawer-end drawer-mobile">
      <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-no-wrap">
        <Box />
        <button className={` h-screen items-center justify-center bg-base-200 text-white text-4xl px-2 ${isOpen ? 'hidden' : ''}`} onClick={handleDrawerToggle}>
          {"<"}
        </button>

      </div>

      <UserSideBar isOpen={isOpen} handleDrawerToggle={handleDrawerToggle} />
    </div>


  );
};

export default Chat;
