import mongoose from "mongoose";
export interface ISnippet {
  _id: string;
  name: string;
  description?: string;
  language: string;
  snippet: string;
}

const snippetSchema = new mongoose.Schema<ISnippet>(
  {
    name: { type: String, required: true },
    language: {
      type: String,
      required: true,
    },
    snippet: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
  },
  { timestamps: true }
);
const Snippet =
  (mongoose.models.Snippet as mongoose.Model<ISnippet>) ||
  mongoose.model<ISnippet>("Snippet", snippetSchema);
export default Snippet;
