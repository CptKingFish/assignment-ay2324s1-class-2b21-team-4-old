import React from "react";
import CustomModal from "./Modal";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import IconButton from "./IconButton";
import { toast } from "react-hot-toast";
import { javascript } from "@codemirror/lang-javascript";
import CodeMirror from "@uiw/react-codemirror";

type Props = {};

const SNIPPETS = [
  {
    id: 1,
    name: "index.html",
    language: "html",
    content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Document</title>
  </head
<body>
</body>
</html>`,
  },
  {
    id: 2,
    language: "css",
    name: "index.css",
    content: `body {
  background-color: red;
}`,
  },
];

const TaskCodeSnippets = (props: Props) => {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [activeSnippet, setActiveSnippet] = React.useState(SNIPPETS[0]);
  const [addSnippetModalOpen, setAddSnippetModalOpen] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: "",
    language: "javascript",
    content: "",
  });
  return (
    <>
      <div className="flex flex-wrap items-center gap-4">
        {SNIPPETS.map((snippet) => (
          <div
            key={snippet.id}
            className="text-md flex cursor-pointer flex-col gap-3 rounded-sm p-3 shadow-sm outline outline-1 outline-[#dcdfe4]"
            onClick={() => {
              setActiveSnippet(snippet);
              setModalOpen(true);
            }}
          >
            {snippet.name}
          </div>
        ))}
        <IconButton onClick={() => setAddSnippetModalOpen(true)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </IconButton>
      </div>
      <CustomModal modalOpen={modalOpen} setModalOpen={setModalOpen}>
        {activeSnippet && (
          <>
            <div className="flex items-center gap-2">
              <h4>{activeSnippet.name}</h4>
              <IconButton
                onClick={() => {
                  // copy to clipboard
                  toast.success("Copied to clipboard");
                  navigator.clipboard
                    .writeText(activeSnippet.content)
                    .catch(console.error);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"
                  />
                </svg>
              </IconButton>
            </div>
            <SyntaxHighlighter
              customStyle={{
                width: "100%",
                // border: "3px solid #1565c0",
                borderRadius: "10px",
                whiteSpace: "normal",
                wordBreak: "break-word",
              }}
              showLineNumbers={true}
              language={activeSnippet.language}
            >
              {activeSnippet.content}
            </SyntaxHighlighter>
          </>
        )}
      </CustomModal>
      <CustomModal
        modalOpen={addSnippetModalOpen}
        setModalOpen={setAddSnippetModalOpen}
      >
        <form className="flex flex-col gap-3">
          <h3>Create snippet</h3>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => {
              setFormData({ ...formData, name: e.target.value });
            }}
            placeholder="Name"
            className="input w-full max-w-xs rounded-md  border border-gray-300 bg-white shadow-sm outline-none focus:border-primary focus:outline-none"
          />
          <select
            value={formData.language}
            onChange={(e) => {
              setFormData({ ...formData, language: e.target.value });
            }}
            className="select w-full max-w-xs rounded-md  border border-gray-300 bg-white shadow-sm outline-none focus:border-primary focus:outline-none"
          >
            <option disabled selected>
              Language
            </option>
            <option value="html">HTML</option>
            <option value="css">CSS</option>
            <option value="javascript">JavaScript</option>
            <option value="typescript">TypeScript</option>
            <option value="go">Go Lang</option>
            <option value="python">Python</option>
            <option value="rust">Rust</option>
            <option value="java">Java</option>
          </select>
          <CodeMirror
            value={formData.content}
            height="200px"
            width="400px"
            extensions={[javascript({ jsx: true })]}
            onChange={(value, _) =>
              setFormData({ ...formData, content: value })
            }
          />
        </form>
      </CustomModal>
    </>
  );
};

export default TaskCodeSnippets;
