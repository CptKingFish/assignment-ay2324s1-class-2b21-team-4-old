import Pusher from 'pusher';
import pusher from '../server/api/pusherconfig';

interface ChatMessage {
    senderId: string;
    receiverId: string;
    message: string;
  }

const TextBox = () => {



const sendMessage = async (message: ChatMessage) => {
  try {
    const { senderId, receiverId } = message;

    // Send the message to the recipient channel
    await pusher.trigger(`chat-${receiverId}`, 'new-message', message);

    // Optionally, you can also send the message to the sender channel for consistency
    await pusher.trigger(`chat-${senderId}`, 'new-message', message);
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

const onInputHandler = (e: any) => {
    if (e.key === 'Enter') {
        const message = e.target.value;
        const senderId = '1';
        const receiverId = '2';
        const chatMessage = { senderId, receiverId, message };
        sendMessage(chatMessage);
        e.target.value = '';
    }
}


    return (
        <input onInput={onInputHandler} type="text" placeholder="Type here" className="input input-bordered rounded-full input-lg w-full mb-30" />
    )
}

export default TextBox