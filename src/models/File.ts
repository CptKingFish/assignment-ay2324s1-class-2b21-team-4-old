import mongoose from "mongoose";
import { type IUser } from "./User";
export interface IFile {
  _id: string;
  name: string;
  user: IUser;
  url: string;
  createdAt: Date;
}

const fileSchema = new mongoose.Schema<IFile>(
  {
    name: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
const File =
  (mongoose.models.File as mongoose.Model<IFile>) ||
  mongoose.model<IFile>("File", fileSchema);
export default File;
