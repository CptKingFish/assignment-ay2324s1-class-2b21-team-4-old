import { api } from "@/utils/api";
import { toast } from "react-hot-toast";

interface RequestNotificationProps {
  notification_id: string;
  sender_username: string;
  avatarUrl: string;
  type: string;
  time: string;
  refetchChatrooms: () => void;
  handleRemoveNotification: (notification_id: string) => void;
  display: boolean;
}

export default function RequestNotification({
  notification_id,
  sender_username,
  avatarUrl,
  type,
  time,
  refetchChatrooms,
  handleRemoveNotification,
  display,
}: RequestNotificationProps) {
  const {
    mutate: acceptFriendRequest,
    isLoading: isLoadingAcceptFriendRequest,
  } = api.notification.acceptFriendRequest.useMutation();

  const {
    mutate: declineFriendRequest,
    isLoading: isLoadingDeclineFriendRequest,
  } = api.notification.declineFriendRequest.useMutation();

  const { mutate: acceptTeamInvite, isLoading: isLoadingAcceptTeamInvite } =
    api.notification.acceptTeamInvite.useMutation();

  const { mutate: declineTeamInvite, isLoading: isLoadingDeclineTeamInvite } =
    api.notification.declineTeamInvite.useMutation();

  const handleAcceptBtn = () => {
    if (type === "friend_request") {
      acceptFriendRequest(
        { notification_id: notification_id },
        {
          onSuccess: () => {
            handleRemoveNotification(notification_id);
            refetchChatrooms();
            toast.success("Friend request accepted.");
          },
          onError: (error) => {
            toast.error(error.message);
          },
        }
      );
    } else if (type === "team_invite") {
      acceptTeamInvite(
        { notification_id: notification_id },
        {
          onSuccess: () => {
            handleRemoveNotification(notification_id);
            refetchChatrooms();
            toast.success("Team invite accepted.");
          },
          onError: (error) => {
            toast.error(error.message);
          },
        }
      );
    }
  };

  const handleDeclineBtn = () => {
    if (type === "friend_request") {
      declineFriendRequest(
        { notification_id: notification_id },
        {
          onSuccess: () => {
            handleRemoveNotification(notification_id);
            toast.success("Friend request declined.");
          },
          onError: (error) => {
            toast.error(error.message);
          },
        }
      );
    } else if (type === "team_invite") {
      declineTeamInvite(
        { notification_id: notification_id },
        {
          onSuccess: () => {
            handleRemoveNotification(notification_id);
            toast.success("Team invite declined.");
          },
          onError: (error) => {
            toast.error(error.message);
          },
        }
      );
    }
  };

  return (
    <div className="bordered" hidden={!display}>
      <div className="mt-4 flex items-center">
        <div className="online avatar mr-3">
          <div className="w-16 rounded-full">
            {/* <Image src={avatarUrl} alt="chat menu item" width={32} height={32} /> */}
            <img src={avatarUrl || "/Profile.png"} alt="chat menu item" />
          </div>
        </div>
        <div className="ml-2">
          <div className="text-sm font-semibold">{`${sender_username} sent you a ${
            type === "friend_request" ? "friend request" : "team invite"
          }.`}</div>
        </div>
        <div className="ml-auto text-xs">{time}</div>
      </div>
      <div className="mx-3 mt-5 flex justify-center">
        <button
          className="btn-primary btn mr-1 w-1/2"
          onClick={handleAcceptBtn}
        >
          Accept
        </button>
        <button
          className="btn-secondary btn ml-1 w-1/2"
          onClick={handleDeclineBtn}
        >
          Decline
        </button>
      </div>
    </div>
  );
}
