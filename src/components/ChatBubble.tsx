type ChatBubbleProps = {
    message: string;
    senderId: string;
    receiverId: string;
    time: string;
  };
  
  const ChatBubble = ({ message, senderId, receiverId }: ChatBubbleProps) => {
    if (senderId === "1") {
      return (
        <div className="chat chat-start">
          <div className="chat-bubble">{message}</div>
        </div>
      );
    } else if (senderId === "2") {
      return (
        <div className="chat chat-end">
          <div className="chat-bubble">{message}</div>
        </div>
      );
    } else {
      return null; // Return null for unsupported senderIds
    }
  };
  
  export default ChatBubble;