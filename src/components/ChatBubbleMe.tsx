interface ChatBubbleMeProps {
  senderId: string;
  text: string;
  timestamp: string;
}

export default function ChatBubbleMe({
  senderId,
  text,
  timestamp,
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
        {senderId}
        <time className="text-xs opacity-50">12:46</time>
      </div>
      <div className="chat-bubble">{text}</div>
      <div className="chat-footer opacity-50">Seen at 12:46</div>
    </div>
  );
}
