import axios from "axios";
import React from "react";
import { toast } from "react-hot-toast";
import { useGlobalContext } from "@/context";
// import { FC, useRef, useState } from "react";
// import { toast } from "react-hot-toast";
// import TextareaAutosize from "react-textarea-autosize";
// import Button from "./ui/Button";

// interface ChatInputProps {
//   chatPartner: User;
//   chatId: string;
// }

interface ChatInputProps {
  channelCode: string;
}

const ChatInput = ({ channelCode }: ChatInputProps) => {
  const { user } = useGlobalContext();
  const [input, setInput] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  console.log("channelCode", channelCode);

  const sendMessage = async () => {
    console.log("sendMessage");

    if (!input) return;
    setIsLoading(true);

    try {
      console.log("sending message");

      await axios.post("/api/pusher/message/send", {
        user_id: user?._id,
        channel: channelCode,
        text: input,
      });
      setInput("");
    } catch (e) {
      console.log(e);

      toast.error("Something went wrong. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   void sendMessage();
  // };
  return (
    <div className="fixed bottom-0 left-0 right-0 z-10 z-10 bg-white">
      {/* <form className="flex items-center p-3"> */}
      <input
        type="text"
        placeholder="Type your message"
        className="flex-1 rounded-md border-2 border-gray-200 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button
        onClick={() => {
          console.log("sendMessage");

          void sendMessage();
        }}
        className="ml-2 rounded-md bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-600"
      >
        Send
      </button>
      {/* </form> */}
    </div>
  );
};

export default ChatInput;
