interface ChatBubbleMeProps {
  senderId: string;
  text: string;
  senderName: string;
  time: string;
  date: string;
}

export default function ChatBubbleMe({
  senderId,
  text,
  senderName,
  time,
  date,
}: ChatBubbleMeProps) {
  // id: uuidv4() as string,
  //   senderId: user_id,
  //   text: text,
  //   timestamp: timestamp,
  return (
    <div className="chat chat-end">
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
          <img src="https://source.unsplash.com/random/?city,night" />
        </div>
      </div>
      <div className="chat-header">
        <span className="mr-2"> {senderName}</span>

        <time className="text-xs opacity-50">{time}</time>
      </div>
      <div className="chat-bubble">{text}</div>
    </div>
  );
}
