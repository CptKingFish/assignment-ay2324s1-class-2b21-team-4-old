import { Message } from "@/utils/chat";
import mongoose, { ObjectId } from "mongoose";

export interface IChatroom {
  _id: ObjectId;
  name?: string | null;
  avatarUrl?: string;
  type: "private" | "team";
  messages: Message[];
  participants: string[];
  admins: string[];
}

const chatroomSchema = new mongoose.Schema<IChatroom>(
  {
    name: { type: String },
    avatarUrl: {
      type:String,
      required:false,
    },
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
        data_type: {
          type: String,
          required: true,
          default: "message",
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
        deleted: {
          type: Boolean,
          required: true,
          default: false,
        },
      },
    ],
    participants: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    ],
    admins: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    ],
  },
  { timestamps: true }
);

const Chatroom =
  (mongoose.models.Chatroom as mongoose.Model<IChatroom>) ||
  mongoose.model<IChatroom>("Chatroom", chatroomSchema);

export default Chatroom;
