import Link from "next/link";
import { useGlobalContext } from "@/context";
import React from "react";
import Box from "@/components/Box";
import UserSideBar from "@/components/UserSideBar";

const Chat = () => {
  const { user } = useGlobalContext();
  const [isOpen, setIsOpen] = React.useState(false)
  return (
    <div className="drawer drawer-end drawer-mobile">
      <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        <Box />
      </div>
      <UserSideBar/>
    </div>


  );
};

export default Chat;
