// import axios from "axios";
import React from "react";
import { toast } from "react-hot-toast";
import { useGlobalContext } from "@/context";
import { api } from "@/utils/api";

interface ChatInputProps {
  channelCode: string;
}

const ChatInput = ({ channelCode }: ChatInputProps) => {
  const { user } = useGlobalContext();
  const [input, setInput] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const { mutateAsync: sendMessageMutation } =
    api.chat.sendMessage.useMutation();

  const sendMessage = async () => {
    console.log("sendMessage");

    if (!input) return;
    setIsLoading(true);

    try {
      console.log("sending message");

      await sendMessageMutation({
        channel: channelCode,
        text: input,
      });

      // await axios.post("/api/pusher/message/send", {
      //   user_id: user?._id,
      //   channel: channelCode,
      //   text: input,
      // });
      setInput("");
    } catch (e) {
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const uploadImage = () => {
    const formData = new FormData();
    // Add your image upload logic here
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    console.log(e.key);

    if (e.key === "Enter") {
      e.preventDefault();
      void sendMessage();
    }
  };

  const handleSend = () => {
    void sendMessage();
  };

  return (
    <div className="z-10 bg-white">
      <div className="flex items-center">
        <div className="dropdown dropdown-top">
          <label tabIndex={0} className="btn">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13"
              />
            </svg>
          </label>
          <ul
            tabIndex={0}
            className="dropdown-content menu rounded-box w-52 bg-base-100 p-2 shadow"
          >
            <li>
              <a>Item 1</a>
            </li>
            <li>
              <a>Item 2</a>
            </li>
          </ul>
        </div>
        <input
          type="text"
          placeholder="Type your message"
          className="flex-1 rounded-md border-2 border-gray-200 p-2  focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
    </div>
  );
};

export default ChatInput;
