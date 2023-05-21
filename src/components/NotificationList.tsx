import React from "react";
import { api } from "@/utils/api";
import RequestNotification from "./RequestNotification";
import type { INotification } from "@/models/Notification";
import type { IUser } from "@/models/User";
import { formatDate } from "@/utils/helper";
import { useGlobalContext } from "@/context";
import { Schema } from "mongoose";
import { toast } from "react-hot-toast";
import RequestNotificationToast from "./RequestNotificationToast";
// import { ObjectId } from "mongoose";
// import { Schema } from "zod";

// interface NotificationWithSenderDetails extends INotification {
//   sender: IUser;
// }

interface NotificationListProps {
  refetchChatrooms: () => void;
  display: boolean;
}

interface NotificationItem {
  sender: IUser | null;
  _id: Schema.Types.ObjectId;
  type: "friend_request" | "team_invite";
  sender_id: Schema.Types.ObjectId;
  receiver_id: Schema.Types.ObjectId;
  chatroom_id?: Schema.Types.ObjectId | undefined;
  createdAt: Date;
}

export default function NotificationList({
  refetchChatrooms,
  display,
}: // notifications,
// handleRemoveNotification,
NotificationListProps) {
  const { pusherClient } = useGlobalContext();
  const [notifications, setNotifications] = React.useState<NotificationItem[]>(
    []
  );

  //  notification_id: notification._id.toString(),
  //       sender_username: user.username,
  //       type: "friend_request",
  //       time: notification.createdAt,
  //       avatarUrl: "https://source.unsplash.com/random/?city,night",

  React.useEffect(() => {
    if (!pusherClient) return;
    pusherClient.bind("incoming-notification", (data: NotificationItem) => {
      console.log("incoming-notification", data);
      toast.custom(
        (t) => (
          <div
            className={`${
              t.visible ? "animate-enter" : "animate-leave"
            } pointer-events-auto flex w-full max-w-md rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5`}
          >
            <RequestNotificationToast
              avatarUrl={"https://source.unsplash.com/random/?city,night"}
              text={
                data.type === "friend_request"
                  ? `${data.sender?.username || ""} sent you a friend request.`
                  : `${data.sender?.username || ""} invited you to join a team.`
              }
            />
          </div>
        ),
        {
          id: "chat-notification",
          duration: 5000,
        }
      );
      setNotifications((prevNotifications) => {
        return [...prevNotifications, data];
      });
    });
    return () => {
      pusherClient.unbind("incoming-notification");
    };
  }, [pusherClient]);

  const { data: notificationsData, isLoading: isLoadingNotifications } =
    api.notification.getNotifications.useQuery();

  React.useEffect(() => {
    if (isLoadingNotifications || !notificationsData) return;
    setNotifications(notificationsData);
  }, [isLoadingNotifications, notificationsData]);

  const handleRemoveNotification = (notification_id: string) => {
    setNotifications((prevNotifications) => {
      if (!prevNotifications) return [];
      return prevNotifications.filter(
        (notification) => notification._id.toString() !== notification_id
      );
    });
  };

  return (
    <>
      {notifications?.map((notification) => {
        console.log("notification", notification);

        return (
          <RequestNotification
            key={notification._id.toString()}
            notification_id={notification._id.toString()}
            sender_username={notification?.sender?.username.toString() || ""}
            type={notification.type}
            time={formatDate(notification.createdAt)}
            avatarUrl={"https://source.unsplash.com/random/?city,night"}
            refetchChatrooms={refetchChatrooms}
            handleRemoveNotification={handleRemoveNotification}
            display={display}
          />
        );
      })}
    </>
  );
}
