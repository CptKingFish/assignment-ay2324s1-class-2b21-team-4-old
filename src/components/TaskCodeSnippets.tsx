import React from "react";
import CustomModal from "./Modal";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import IconButton from "./IconButton";
import { toast } from "react-hot-toast";
import { javascript } from "@codemirror/lang-javascript";
import CodeMirror from "@uiw/react-codemirror";
import { type ITask } from "@/models/Task";
import { api } from "@/utils/api";
import { useAtom } from "jotai";
import { chatAtom } from "@/pages/scrum/[id]";

const TaskCodeSnippets = ({ task }: { task: ITask }) => {
  const utils = api.useContext();
  const [chat_id] = useAtom(chatAtom);
  const { mutate: createSnippet, isLoading: isCreatingSnippet } =
    api.scrum.createCodeSnippet.useMutation();
  const { mutate: deleteSnippet } = api.scrum.deleteCodeSnippet.useMutation();
  const [modalOpen, setModalOpen] = React.useState(false);
  const [activeSnippet, setActiveSnippet] = React.useState(task.snippets[0]);
  const [addSnippetModalOpen, setAddSnippetModalOpen] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: "",
    language: "javascript",
    content: "",
    description: "",
  });
  return (
    <>
      <div className="flex flex-wrap items-center gap-4">
        {task.snippets.map((snippet) => (
          <div
            key={snippet._id}
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
            strokeWidth="1.5"
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </IconButton>
      </div>
      <CustomModal modalOpen={modalOpen} setModalOpen={setModalOpen}>
        {activeSnippet && (
          <>
            <div className="flex items-center">
              <h4>{activeSnippet.name}</h4>
              <IconButton
                className="ml-4"
                onClick={() => {
                  // copy to clipboard
                  toast.success("Copied to clipboard");
                  navigator.clipboard
                    .writeText(activeSnippet.snippet)
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
              <IconButton
                onClick={() => {
                  const confirm = window.confirm(
                    "Are you sure you want to delete this snippet?"
                  );
                  if (!confirm) return;
                  deleteSnippet(
                    { snippet_id: activeSnippet._id },
                    {
                      onSuccess: () => {
                        toast.success("Snippet deleted");
                        setModalOpen(false);
                        task.snippets = task.snippets.filter(
                          (snippet) => snippet._id !== activeSnippet._id
                        );
                        utils.scrum.getScrumByChatId
                          .refetch({ chat_id })
                          .catch(console.error);
                      },
                    }
                  );
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-6 w-6 text-red-600"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                  />
                </svg>
              </IconButton>
            </div>
            <p>{activeSnippet.description || ""}</p>
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
              {activeSnippet.snippet}
            </SyntaxHighlighter>
          </>
        )}
      </CustomModal>
      <CustomModal
        modalOpen={addSnippetModalOpen}
        setModalOpen={setAddSnippetModalOpen}
      >
        <form
          className="flex flex-col gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (!formData.content) {
              toast.error("Snippet content is required");
              return;
            }
            createSnippet(
              {
                code: formData.content,
                language: formData.language,
                name: formData.name,
                task_id: task._id,
                description: formData.description,
              },
              {
                onSuccess: () => {
                  setAddSnippetModalOpen(false);
                  task.snippets.push({
                    _id: "123",
                    name: formData.name,
                    language: formData.language,
                    snippet: formData.content,
                    description: formData.description,
                  });
                  toast.success("Snippet created");
                  setFormData({
                    name: "",
                    language: "javascript",
                    content: "",
                    description: "",
                  });
                  utils.scrum.getScrumByChatId
                    .refetch({ chat_id })
                    .catch(console.error);
                },
                onError: (err) => {
                  toast.error(err.message);
                },
              }
            );
          }}
        >
          <h3>Create snippet</h3>
          <input
            type="text"
            value={formData.name}
            required
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
            required
            defaultValue={formData.language}
            className="select w-full max-w-xs rounded-md  border border-gray-300 bg-white shadow-sm outline-none focus:border-primary focus:outline-none"
          >
            <option disabled>Language</option>
            <option value="html">HTML</option>
            <option value="css">CSS</option>
            <option value="javascript">JavaScript</option>
            <option value="typescript">TypeScript</option>
            <option value="go">Go Lang</option>
            <option value="python">Python</option>
            <option value="rust">Rust</option>
            <option value="java">Java</option>
          </select>
          <input
            type="text"
            value={formData.description}
            onChange={(e) => {
              setFormData({ ...formData, description: e.target.value });
            }}
            placeholder="Description"
            className="input w-full max-w-xs rounded-md  border border-gray-300 bg-white shadow-sm outline-none focus:border-primary focus:outline-none"
          />
          <CodeMirror
            value={formData.content}
            height="200px"
            width="400px"
            extensions={[javascript({ jsx: true })]}
            onChange={(value, _) =>
              setFormData({ ...formData, content: value })
            }
          />

          <button
            className={`btn-success btn ${isCreatingSnippet ? "loading" : ""}`}
            type="submit"
          >
            Create!
          </button>
        </form>
      </CustomModal>
    </>
  );
};

export default TaskCodeSnippets;
