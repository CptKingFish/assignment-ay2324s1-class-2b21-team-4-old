import React from "react";
import { Renderable, Toast, ValueFunction, toast } from "react-hot-toast";
import { api } from "@/utils/api";
import TagPicker from "rsuite/TagPicker";
import "rsuite/dist/rsuite.min.css";
import { useRouter } from "next/router";

interface TeamInviteFormProps {
  setOpenTeamInvite: React.Dispatch<React.SetStateAction<boolean>>;
}

interface FriendItem {
  _id: string;
  username: string;
}

export default function TeamInviteForm({
  setOpenTeamInvite,
}: TeamInviteFormProps) {
  const router = useRouter();
  const [friendsList, setFriendsList] = React.useState<FriendItem[]>([]);
  const [selectedUsers, setSelectedUsers] = React.useState<string[]>([]);

  const chatroom_id = React.useMemo(() => {
    return router.query.id as string;
  }, [router.query.id]);

  const { data: friends } = api.chat.getFriendsNotInTeam.useQuery({
    chatroom_id,
  });
  const { mutate: inviteToTeam } =
    api.notification.sendTeamInvite.useMutation();

  React.useEffect(() => {
    if (!friends) return;
    setFriendsList(friends as FriendItem[]);
  }, [friends]);

  console.log(selectedUsers);

  return (
    <form
      className="flex min-w-[400px] flex-col gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        if (!chatroom_id) return;
        if (selectedUsers.length === 0) return;

        inviteToTeam(
          {
            chatroom_id,
            receiver_ids: selectedUsers,
          },
          {
            onSuccess: () => {
              toast.success("Invited successfully");
              setOpenTeamInvite(false);
            },
            onError: (error: {
              message: Renderable | ValueFunction<Renderable, Toast>;
            }) => {
              toast.error(error.message);
            },
          }
        );
      }}
    >
      <h3>Invite new members</h3>

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

      <button
        className={`btn-success h-10 w-full rounded-md  border border-gray-300 bg-white shadow-sm outline-none focus:border-primary focus:outline-none`}
      >
        Invite
      </button>
    </form>
  );
}
