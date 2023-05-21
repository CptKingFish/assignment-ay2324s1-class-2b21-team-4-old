import mongoose from "mongoose";
import { type IFile } from "./File";
import { type ITask } from "./Task";
export interface IScrum {
  _id: string;
  chat_id: string;
  files: IFile[];
  tasks: ITask[];
}

const scrumSchema = new mongoose.Schema<IScrum>(
  {
    chat_id: {
      type: String,
      required: true,
      unique: true,
    },
    files: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "File",
        required: true,
      },
    ],
    tasks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task",
        required: true,
      },
    ],
  },
  { timestamps: true }
);
const Scrum =
  (mongoose.models.Scrum as mongoose.Model<IScrum>) ||
  mongoose.model<IScrum>("Scrum", scrumSchema);
export default Scrum;
