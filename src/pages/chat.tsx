import Image from "next/image";

const Chat = () => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <Image
        src="/images/undraw_chat.svg"
        alt="undraw illustration"
        width={300}
        height={400}
      />
      <h1 className="mt-4 text-3xl font-bold">Project Swifty</h1>
      <p className="text-lg text-gray-400">Select a chat to start chatting!</p>
    </div>
  );
};

export default Chat;
