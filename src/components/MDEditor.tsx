import React from "react";
import "easymde/dist/easymde.min.css";
import dynamic from "next/dynamic";
const SimpleMDE = dynamic(
  () => {
    return import("react-simplemde-editor").then((mod) => mod.default);
  },
  { ssr: false }
);

type Props = { d?: any };

const MDEditor = (props: Props) => {
  const [markdown, setMarkdown] = React.useState("");
  return (
    <SimpleMDE
      style={{ height: "100%" }}
      value={markdown}
      onChange={(e) => setMarkdown(e)}
    />
  );
};

export default MDEditor;
