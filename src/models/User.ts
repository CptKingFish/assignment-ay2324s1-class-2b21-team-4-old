import mongoose from "mongoose";
export interface IUser {
  _id: string;
  email: string;
  username: string;
  avatar?: string;
  password: string;
  isEmailVerified: boolean;
  friends: string[];
}

const userSchema = new mongoose.Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    password: {
      type: String,
      required: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    avatar: String,
    username: {
      type: String,
      required: true,
      unique: true,
    },
    friends: [
      {
        friendID: {
          type:mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        chatID:{
          type:mongoose.Schema.Types.ObjectId,
          ref: "Chat",
        }
      }
    ],
  },
  { timestamps: true }
);
const User =
  (mongoose.models.User as mongoose.Model<IUser>) ||
  mongoose.model<IUser>("User", userSchema);
export default User;
