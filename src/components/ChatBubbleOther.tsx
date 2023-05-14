interface ChatBubbleOtherProps {
  senderId: string;
  text: string;
  timestamp: string;
}

export default function ChatBubbleOther({
  senderId,
  text,
  timestamp,
}: ChatBubbleOtherProps) {
  return (
    <div className="chat chat-start">
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
          <img src="/images/stock/photo-1534528741775-53994a69daeb.jpg" />
        </div>
      </div>
      <div className="chat-header">{senderId}</div>
      <div className="chat-bubble">{text}</div>
      <div className="chat-footer opacity-50">Delivered</div>
    </div>
  );
}
