import Link from "next/link";
import { useGlobalContext } from "@/context";
import React from "react";
import Box from "@/components/Box";

const Chat = () => {
  const { user } = useGlobalContext();
  const [isOpen, setIsOpen] = React.useState(false)
  return (
    <>
    <Box/>
    </>
  
  );
};

export default Chat;
