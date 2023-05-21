import mongoose from "mongoose";
import type { ObjectId } from "mongoose";

export interface INotification {
  _id: ObjectId;
  type: "friend_request" | "team_invite";
  sender_id: ObjectId;
  receiver_id: ObjectId;
  chatroom_id?: ObjectId;
  createdAt: Date;
}

const notificationSchema = new mongoose.Schema<INotification>(
  {
    type: {
      type: String,
      enum: ["friend_request", "team_invite"],
      required: true,
    },
    sender_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    chatroom_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chatroom",
    },
  },
  { timestamps: true }
);
const Notification =
  (mongoose.models.Notification as mongoose.Model<INotification>) ||
  mongoose.model<INotification>("Notification", notificationSchema);
export default Notification;
