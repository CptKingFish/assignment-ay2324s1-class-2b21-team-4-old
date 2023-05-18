interface ChatBubbleOtherProps {
  senderId: string;
  text: string;
  time: string;
  date: string;
  senderName: string;
}

export default function ChatBubbleOther({
  senderId,
  text,
  time,
  date,
  senderName,
}: ChatBubbleOtherProps) {
  return (
    <div className="chat chat-start">
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
          <img src="/images/stock/photo-1534528741775-53994a69daeb.jpg" />
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
