import SideBar from "@/components/SideBar";
import { useGlobalContext } from "@/context";
import React from "react";

const Chat = () => {
  const { user } = useGlobalContext();
  return (
    <div>
      <SideBar/>
    </div>
  );
};

export default Chat;
