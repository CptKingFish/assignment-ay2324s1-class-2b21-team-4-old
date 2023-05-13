import React from "react";
import { type Task, type User } from "./Tasks";
import IconButton from "./IconButton";
// import SimpleMDE from "react-simplemde-editor";
import "rsuite/dist/rsuite.css";
import CustomModal from "./Modal";
import { TagPicker } from "rsuite";
import MDEditor from "./MDEditor";
import TaskCodeSnippets from "./TaskCodeSnippets";

type Props = {
  task: Task;
  users: User[];
};

const TaskCard = ({ task, users }: Props) => {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState(0);
  return (
    <>
      <div
        key={task.id}
        onClick={() => {
          setModalOpen(true);
        }}
        className="flex cursor-pointer flex-col justify-center gap-2 rounded-xl bg-white px-3 py-2 shadow-sm outline outline-1 outline-[#dcdfe4] hover:bg-[#f7f8fa]"
      >
        <div className="flex flex-row items-center gap-2">
          <div className="flex w-full flex-col">
            <div className="flex w-full items-center justify-between">
              <div className="text-md font-semibold">{task.text}</div>

              <div onClick={(e) => e.stopPropagation()} className="dropdown">
                <IconButton>
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
                      d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                    />
                  </svg>
                </IconButton>
                <ul
                  tabIndex={0}
                  className="dropdown-content menu rounded-box mt-2 w-52 bg-base-100 p-2 text-sm shadow"
                >
                  <li>
                    <p className="flex items-center gap-2 text-red-500">
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
                          d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                        />
                      </svg>
                      Delete
                    </p>
                  </li>
                  <li>
                    <p className="flex items-center gap-2">
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
                          d="M15 13.5H9m4.06-7.19l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"
                        />
                      </svg>
                      Move to Backlog
                    </p>
                  </li>
                </ul>
              </div>
            </div>
            <p className="text-sm text-gray-400">{task.description}</p>
          </div>
        </div>

        <div className="avatar-group flex flex-[3] -space-x-2 ">
          {task.users.map((userId) => {
            const user = users.find((user) => user.id === userId);
            if (!user) {
              return null;
            }
            return (
              <div
                key={user.id}
                className="avatar border-[1px] border-[#dcdfe4]"
              >
                <div className="w-6">
                  <img src={user?.profile_img} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <CustomModal modalOpen={modalOpen} setModalOpen={setModalOpen}>
        <div className="h-[80vh] w-[60vw] text-black">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-2xl font-bold">{task.text}</h1>
            <IconButton onClick={() => setModalOpen(false)}>
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </IconButton>
          </div>
          <p className="text-md text-gray-400">{task.description}</p>
          <div className="mt-3 flex flex-col gap-4 text-sm text-gray-500">
            <div className="flex gap-4">
              <div className="flex flex-[1] items-center gap-2">
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
                    d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
                  />
                </svg>

                <span>Status</span>
              </div>
              <div className="flex flex-[10] justify-start">
                <span className=" rounded-md bg-blue-500 px-[10px] py-[4px] font-semibold text-white">
                  {task.progress}
                </span>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex flex-[1] items-center gap-2">
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
                    d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
                  />
                </svg>

                <span>People</span>
              </div>
              <div className="flex flex-[10] items-center justify-start">
                <TagPicker
                  size="md"
                  placeholder="People"
                  data={users.map((user) => {
                    return {
                      label: user.name,
                      value: user.id,
                    };
                  })}
                  style={{ width: "100%", display: "block" }}
                  onChange={console.log}
                  value={task.users}
                />
              </div>
            </div>
          </div>
          <div className="tabs tabs-boxed mt-2 bg-white">
            <a
              className={`tab ${activeTab === 0 ? "tab-active" : ""}`}
              onClick={() => setActiveTab(0)}
            >
              Text Editor
            </a>
            <a
              className={`tab ${activeTab === 1 ? "tab-active" : ""}`}
              onClick={() => setActiveTab(1)}
            >
              Code Snippets
            </a>
          </div>
          <div className="mt-2">
            {activeTab === 0 && <MDEditor />}
            {activeTab === 1 && <TaskCodeSnippets />}
          </div>
        </div>
      </CustomModal>
    </>
  );
};

export default TaskCard;
