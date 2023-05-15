import RequestNotification from "./RequestNotification";
import { INotification } from "@/models/Notification";
import { IUser } from "@/models/User";
import { formatDate } from "@/utils/helper";

interface NotificationWithSenderDetails extends INotification {
  sender: IUser;
}

interface NotificationListProps {
  notifications: NotificationWithSenderDetails[];
  handleRemoveNotification: (notification_id: string) => void;
}

export default function NotificationList({
  notifications,
  handleRemoveNotification,
}: NotificationListProps) {
  return (
    <>
      {notifications?.map((notification) => {
        console.log("notification", notification);

        return (
          <RequestNotification
            key={notification._id.toString()}
            notification_id={notification._id.toString()}
            sender_username={notification.sender.username.toString()}
            type={notification.type}
            time={formatDate(notification.createdAt)}
            avatarUrl={"https://source.unsplash.com/random/?city,night"}
            handleRemoveNotification={handleRemoveNotification}
          />
        );
      })}
    </>
  );
}
