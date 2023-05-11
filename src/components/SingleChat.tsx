
import { useQuery } from '@trpc/react';

export default function ChatWindow() {
  // Fetch chat messages from trpc API
  const { data: chatMessages } = useQuery(['chatMessages']);

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <div className="mb-4">
        <h2 className="text-2xl font-bold">Chat Window</h2>
      </div>

      {chatMessages ? (
        chatMessages.map((message) => (
          <div key={message.id} className="mb-2">
            <div className="font-semibold">{message.sender}</div>
            <div>{message.content}</div>
            <div className="text-xs text-gray-500">{message.timestamp}</div>
          </div>
        ))
      ) : (
        <div>Loading chat messages...</div>
      )}
    </div>
  );
}
