import { Message } from "@/utils/chat";
import mongoose, { ObjectId } from "mongoose";

export interface IChatroom {
  _id: ObjectId;
  name?: string | null;
  avatarUrl?: string;
  type: "private" | "team";
  messages: Message[];
  participants: string[];
}

// export interface IMessage {
//   _id: ObjectId;
//   senderId: string;
//   text: string;
//   timestamp: number;
// }

const chatroomSchema = new mongoose.Schema<IChatroom>(
  {
    name: { type: String },
    avatarUrl: String,
    type: {
      type: String,
      enum: ["private", "team"],
      required: true,
    },
    messages: [
      {
        sender: {
          _id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
          username: String,
        },
        text: String,
        timestamp: Number,
        default: [],
        hasReplyTo: Boolean,
        replyTo: {
          _id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
          sender: {
            _id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            username: String,
          },
          text: String,
          timestamp: Number,
        },
      },
    ],
    participants: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    ],
  },
  { timestamps: true }
);

const Chatroom =
  (mongoose.models.Chatroom as mongoose.Model<IChatroom>) ||
  mongoose.model<IChatroom>("Chatroom", chatroomSchema);

export default Chatroom;
