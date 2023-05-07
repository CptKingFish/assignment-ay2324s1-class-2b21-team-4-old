import { useGlobalContext } from "@/context";
import React from "react";

const Chat = () => {
  const { user } = useGlobalContext();
  return (
    <div>
      <code>{JSON.stringify(user)}</code>
    </div>
  );
};

export default Chat;
