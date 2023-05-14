
import React from "react";
import pusher from "../server/api/pusherconfig";
import { useGlobalContext } from "@/context";
import UserSideBar from "@/components/UserSideBar";

interface ChatMessage {
  senderId: string;
  receiverId: string;
  message: string;
}


const Chat = () => {
  const [messages, setMessages] = React.useState([]); // Initialize messages as an empty array
  const { user } = useGlobalContext();
  const [isOpen, setIsOpen] = React.useState(false);
  const [senderId, setSenderId] = React.useState(""); 
  
  const currentId = user?._id;


  // React.useEffect(() => {
  //   const channel = pusher.subscribe(`chat-${currentId}`);

  //   channel.bind("new-message", (message: ChatMessage) => {
  //     setMessages((prevMessages) => [...prevMessages, message]);
  //   });

  //   return () => {
  //     pusher.unsubscribe(`chat-${currentId}`);
  //     pusher.disconnect();
  //   };

  // }, [user?._id]);

  // const sendMessage = (message: ChatMessage) => {
  //   try {

  //     pusher.trigger(`chat-${message.receiverId}`, "new-message", message);
  //   } catch (error) {
  //     console.error("Error sending message:", error);
  //     throw error;
  //   }
  // };

  const onInputHandler = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      const message = event.currentTarget.value;
      const receiverId = "2";
      const chatMessage: ChatMessage = { currentId, receiverId, message };
      sendMessage(chatMessage);
      event.currentTarget.value = "";
    }
  };


  return (
    <>
      <div className="relative flex h-full w-4/5 flex-col justify-between ">
        <div className="navbar bg-base-100">
          <div className="flex-1">
            <a className="font-sans text-xl font-bold normal-case">
              Timothy Chia
            </a>
          </div>
          <div className="flex-none">
            <div className="dropdown-end dropdown">
              <label tabIndex={0} className="btn-ghost btn-circle avatar btn">
                <div className="w-10 rounded-full">
                  <img src="https://source.unsplash.com/random/?city,night" />
                </div>
              </label>
            </div>
          </div>
        </div>

       {/* messages go here */}

        {/* {messages != undefined ? (
          <div className="chat-container">
            {messages.map((message, index) => (
              <ChatBubble key={index} {...message} />
            ))}
          </div>
        ) : (
          <div className="chat-container">
            <div className="flex items-center justify-center">
              <div className="flex flex-col items-center justify-center">
                <div className="h-24 w-24 rounded-full">
                  <img src="https://source.unsplash.com/random/?city,night" />
                </div>
                <div className="font-sans text-xl font-bold normal-case">
                  Timothy Chia
                </div>
                <div className="font-sans text-sm font-bold normal-case">
                  Last seen 2 hours ago
                </div>
              </div>
            </div>
          </div>
        )} */}

        <div className="flex items-end justify-center bottom-0 mb-10">
          <input
            onKeyDown={onInputHandler}
            type="text"
            placeholder="Type here"
            className="input-bordered input input-lg w-5/6 rounded-full"
          />
        </div>
      </div>

      <UserSideBar/>
    </>
  );
};

export default Chat;
