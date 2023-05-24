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
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      }
    ],
  },
  { timestamps: true }
);
const User =
  (mongoose.models.User as mongoose.Model<IUser>) ||
  mongoose.model<IUser>("User", userSchema);
export default User;
