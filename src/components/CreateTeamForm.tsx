import React from "react";
import { toast } from "react-hot-toast";
import { api } from "@/utils/api";
import { TagPicker } from "rsuite";

interface CreateTeamFormProps {
  setOpenAddChatroomModal: React.Dispatch<React.SetStateAction<boolean>>;
  refetchChatrooms: () => void;
}

interface FriendItem {
  _id: string;
  username: string;
}

export default function CreateTeamForm({
  setOpenAddChatroomModal,
  refetchChatrooms,
}: CreateTeamFormProps) {
  const [chatroomName, setChatroomName] = React.useState("");
  const [friendsList, setFriendsList] = React.useState<FriendItem[]>([]);
  const [selectedUsers, setSelectedUsers] = React.useState<string[]>([]);
  const { mutate: createChatroom, isLoading: isLoadingChatroomCreate } =
    api.chat.createChatroom.useMutation();

  const { mutate: createTeam } = api.chat.createTeam.useMutation();

  const { data: friends } = api.chat.getFriends.useQuery();

  React.useEffect(() => {
    if (!friends) return;
    setFriendsList(friends as FriendItem[]);
  }, [friends]);

  console.log(friendsList);

  return (
    <form
      className="flex min-w-[400px] flex-col gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        // createTeam(
        //   { chatroom_name: chatroomName, participants: selectedUsers },
        //   {
        //     onSuccess: (data) => {
        //       console.log(data);

        //       setOpenAddChatroomModal(false);
        //       toast.success("Chatroom created successfully");
        //       refetchChatrooms();
        //     },
        //     onError: (error) => {
        //       toast.error(error.message);
        //     },
        //   }
        // );
        createChatroom(
          { chatroom_name: chatroomName, type: "team" },
          {
            onSuccess: (data) => {
              console.log(data);

              setOpenAddChatroomModal(false);
              toast.success("Chatroom created successfully");
              refetchChatrooms();
            },
            onError: (error) => {
              toast.error(error.message);
            },
          }
        );
      }}
    >
      <h3>Create new team</h3>
      <input
        type="text"
        // value={formData.name}
        required
        onChange={(e) => {
          setChatroomName(e.target.value);
        }}
        placeholder="Name"
        className="input mb-1 w-full rounded-md border border-gray-300 bg-white shadow-sm outline-none focus:border-primary focus:outline-none"
      />

      <div className="flex h-full w-full">
        <TagPicker
          size="md"
          placeholder="Invite members"
          data={friendsList.map((friend) => {
            return {
              label: friend.username,
              value: friend._id,
            };
          })}
          className="flex-wrap items-center"
          style={{ width: "100%", display: "flex", height: "3rem" }}
          onChange={(value: string[]) => {
            setSelectedUsers(value);
          }}
          value={selectedUsers}
        />
      </div>

      <button
        className={`btn-success h-10 w-full rounded-md  border border-gray-300 bg-white shadow-sm outline-none focus:border-primary focus:outline-none`}
        // className={`btn-success btn ${isCreatingTask ? "loading" : ""}`}
      >
        Create
      </button>
    </form>
  );
}
