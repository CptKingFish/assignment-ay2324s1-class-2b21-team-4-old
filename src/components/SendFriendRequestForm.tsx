import React from "react";
import { toast } from "react-hot-toast";
import { api } from "@/utils/api";

interface SendFriendRequestFormProps {
  setOpenAddChatroomModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function SendFriendRequestForm({
  setOpenAddChatroomModal,
}: SendFriendRequestFormProps) {
  const [username, setUsername] = React.useState("");
  const { mutate: sendFriendRequest, isLoading: isLoadingSendFriendRequest } =
    api.notification.sendFriendRequest.useMutation();
  return (
    <form
      className="flex min-w-[400px] flex-col gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        sendFriendRequest(
          { receiver_username: username },
          {
            onSuccess: () => {
              setOpenAddChatroomModal(false);
              toast.success("Friend request sent successfully");
            },
            onError: (error) => {
              toast.error(error.message);
            },
          }
        );
      }}
    >
      <h3>Send Friend Request</h3>
      <input
        type="text"
        required
        onChange={(e) => {
          setUsername(e.target.value);
        }}
        placeholder="Username"
        className="input w-full rounded-md  border border-gray-300 bg-white shadow-sm outline-none focus:border-primary focus:outline-none"
      />

      <button
        className={`btn-success btn ${
          isLoadingSendFriendRequest ? "loading" : ""
        } h-10 w-full rounded-md border border-gray-300 bg-white shadow-sm outline-none focus:border-primary focus:outline-none`}
      >
        Send
      </button>
    </form>
  );
}
