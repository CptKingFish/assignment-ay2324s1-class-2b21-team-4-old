import mongoose from "mongoose";
import { type ISnippet } from "./Snippet";
import { type IUser } from "./User";
export interface ITask {
  _id: string;
  name: string;
  description?: string;
  status: string;
  snippets: ISnippet[];
  users: IUser[];
  text?: string;
  backlog?: boolean;
}

const taskSchema = new mongoose.Schema<ITask>(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    snippets: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Snippet",
        required: true,
      },
    ],
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    text: {
      type: String,
    },
    backlog: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);
const Task =
  (mongoose.models.Task as mongoose.Model<ITask>) ||
  mongoose.model<ITask>("Task", taskSchema);
export default Task;
