import { api } from "@/utils/api";
import { toast } from "react-hot-toast";

interface RequestNotificationProps {
  notification_id: string;
  sender_username: string;
  avatarUrl: string;
  type: string;
  time: string;
  handleRemoveNotification: (notification_id: string) => void;
}

export default function RequestNotification({
  notification_id,
  sender_username,
  avatarUrl,
  type,
  time,
  handleRemoveNotification,
}: RequestNotificationProps) {
  const {
    mutate: acceptFriendRequest,
    isLoading: isLoadingAcceptFriendRequest,
  } = api.notification.acceptFriendRequest.useMutation();

  const {
    mutate: declineFriendRequest,
    isLoading: isLoadingDeclineFriendRequest,
  } = api.notification.declineFriendRequest.useMutation();

  const handleAcceptBtn = () => {
    acceptFriendRequest(
      { notification_id: notification_id },
      {
        onSuccess: () => {
          handleRemoveNotification(notification_id);
          toast.success("Friend request accepted.");
        },
        onError: (error) => {
          toast.error(error.message);
        },
      }
    );
  };

  const handleDeclineBtn = () => {
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
  };

  return (
    <div className="bordered">
      <div className="mt-4 flex items-center">
        <div className="online avatar mr-3">
          <div className="w-16 rounded-full">
            {/* <Image src={avatarUrl} alt="chat menu item" width={32} height={32} /> */}
            <img src={avatarUrl} alt="chat menu item" />
          </div>
        </div>
        <div className="ml-2">
          <div className="text-sm font-semibold">{`${sender_username} sent you a ${type} request.`}</div>
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
