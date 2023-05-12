import Scrum from "@/components/Scrum";
import TextBox from "@/components/TextBox";
import { useGlobalContext } from "@/context";
import React from "react";

const Chat = () => {
  const { user } = useGlobalContext();
  
  return (
    <div className="h-full">
      <Scrum/>
      <TextBox/>    
    </div>
  );
};

export default Chat;
