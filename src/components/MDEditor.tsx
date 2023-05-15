import React from "react";
import "easymde/dist/easymde.min.css";
import useDebounce from "../hooks/useDebounce";
import dynamic from "next/dynamic";
import { api } from "@/utils/api";
import { type ITask } from "@/models/Task";
const SimpleMDE = dynamic(
  () => {
    return import("react-simplemde-editor").then((mod) => mod.default);
  },
  { ssr: false }
);

type Props = { task: ITask };

const MDEditor = ({ task }: Props) => {
  const { mutate: updateText } = api.scrum.updateText.useMutation();
  const [markdown, setMarkdown] = React.useState(task.text ?? "");
  const debouncedText = useDebounce(markdown, 500);
  React.useEffect(() => {
    if (!task._id) return;
    updateText({ task_id: task._id, text: debouncedText });
    task.text = debouncedText;
    setMarkdown(debouncedText);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedText, task._id, updateText]);
  return (
    <SimpleMDE
      style={{ height: "100%" }}
      value={markdown}
      onChange={(e) => setMarkdown(e)}
    />
  );
};

export default MDEditor;
