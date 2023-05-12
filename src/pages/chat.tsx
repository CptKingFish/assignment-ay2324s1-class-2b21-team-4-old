import Link from "next/link";
import { useGlobalContext } from "@/context";
import React from "react";

const Chat = () => {
  const { user } = useGlobalContext();
  const [isOpen, setIsOpen] = React.useState(false)
  return (
    <Link className="btn-primary btn" href="/profile">
      Profile
    </Link>
  );
};

export default Chat;
