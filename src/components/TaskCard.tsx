import React from "react";
import { Menu } from "@headlessui/react";
import { type IUser } from "@/models/User";
import TrashIcon from "@heroicons/react/20/solid/TrashIcon";
import { motion } from "framer-motion";
import ArchiveBoxIcon from "@heroicons/react/20/solid/ArchiveBoxIcon";
import IconButton from "./IconButton";
import "rsuite/dist/rsuite.css";
import CustomModal from "./Modal";
import { TagPicker } from "rsuite";
import MDEditor from "./MDEditor";
import TaskCodeSnippets from "./TaskCodeSnippets";
import { type ITask } from "@/models/Task";
import { api } from "@/utils/api";
import { toast } from "react-hot-toast";
import clsx from "clsx";
import { Draggable } from "react-beautiful-dnd";

type Props = {
  aggregatedTasks?: Map<string, ITask[]>;
  task: ITask;
  draggable: boolean;
  users: IUser[];
  backlog?: boolean;
  index: number;
  showMovement?: boolean;
  movementInfo?: {
    avatar?: string;
    name: string;
  };
  isDragging: boolean;
};

const TaskCard = ({
  movementInfo,
  showMovement,
  aggregatedTasks,
  task,
  users,
  backlog,
  index,
  draggable,
  isDragging,
}: Props) => {
  const utils = api.useContext();
  const { mutate: deleteTask } = api.scrum.deleteTask.useMutation();
  const { mutate: changeBacklog } =
    api.scrum.changeTaskBacklogStatus.useMutation();
  const { mutate: changePeople } = api.scrum.changePeople.useMutation();
  const [modalOpen, setModalOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState(0);
  return (
    <>
      <Draggable
        draggableId={task._id}
        index={index}
        isDragDisabled={!draggable}
      >
        {(provided) => (
          <motion.div layoutId={task._id}>
            <div
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              ref={provided.innerRef}
              key={task._id}
              onClick={() => {
                setModalOpen(true);
              }}
              className={clsx(
                "relative flex cursor-pointer flex-col justify-center gap-2 rounded-xl bg-white px-3 py-2 shadow-sm outline outline-1 outline-[#dcdfe4] hover:bg-[#f7f8fa]"
              )}
            >
              <div className="flex flex-row items-center gap-2">
                <div className="flex w-full flex-col">
                  <div className="flex w-full items-center justify-between">
                    <div className="text-md font-semibold">{task.name}</div>
                    <Menu as="div" className="relative inline-block text-left">
                      <Menu.Button
                        onClick={(e) => e.stopPropagation()}
                        as="div"
                        className="inline-flex w-full justify-center rounded-md text-sm font-medium text-white"
                      >
                        <IconButton>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="h-6 w-6 text-black"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                            />
                          </svg>
                        </IconButton>
                      </Menu.Button>
                      <Menu.Items className="absolute right-0 mt-2 origin-top-left divide-y divide-gray-100 rounded-md bg-white p-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                const confirm = window.confirm(
                                  "Are you sure you want to delete this task?"
                                );
                                if (!confirm) return;
                                toast.success("Task deleted");
                                deleteTask(
                                  { task_id: task._id },
                                  {
                                    onSuccess: () => {
                                      utils.scrum.getScrumByChatId
                                        .invalidate()
                                        .catch(console.error);
                                    },
                                  }
                                );
                              }}
                              className={`${
                                active
                                  ? "bg-gray-200 text-white"
                                  : "text-gray-900"
                              } text-md group flex w-full items-center space-x-1 rounded-md px-2 py-2`}
                            >
                              <TrashIcon className="h-6 w-6 text-red-600" />
                              <span className="font-semibold text-red-600">
                                Delete
                              </span>
                            </button>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                task.backlog = true;
                                const curr_tasks = aggregatedTasks?.get(
                                  task.status
                                ) as ITask[];
                                if (!curr_tasks) {
                                  aggregatedTasks?.set(task.status, [task]);
                                } else {
                                  for (const task of curr_tasks) {
                                    if (task._id === task._id) {
                                      task.backlog = true;
                                    }
                                  }
                                  aggregatedTasks?.set(task.status, curr_tasks);
                                }

                                changeBacklog(
                                  {
                                    backlog: backlog ? false : true,
                                    task_id: task._id,
                                  },
                                  {
                                    onSuccess: () => {
                                      task.backlog = backlog ? false : true;
                                      utils.scrum.getScrumByChatId
                                        .invalidate()
                                        .catch(console.error);
                                    },
                                  }
                                );
                              }}
                              className={`${
                                active
                                  ? "bg-gray-200 text-white"
                                  : "text-gray-900"
                              } text-md group flex w-full items-center space-x-1 rounded-md px-2 py-2`}
                            >
                              <ArchiveBoxIcon className="h-6 w-6 text-black" />
                              <span className="whitespace-nowrap font-semibold text-black">
                                {backlog
                                  ? "Move back to sprint"
                                  : "Move to backlog"}
                              </span>
                            </button>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Menu>
                  </div>
                  <p className="text-sm text-gray-400">{task.description}</p>
                </div>
              </div>

              <div className="avatar-group flex flex-[3] -space-x-2 ">
                {task.users.map((user) => {
                  if (!user) {
                    return null;
                  }
                  if (!user.avatar) {
                    return (
                      <div className="placeholder avatar" key={user._id}>
                        <div
                          className="justiy-center w-6 items-center rounded-full bg-neutral-focus text-neutral-content"
                          style={{ lineHeight: "1.5rem" }}
                        >
                          <span className="m-0 p-0 text-xl">
                            {user.username[0]}
                          </span>
                        </div>
                      </div>
                    );
                  }
                  return (
                    <div
                      key={user._id}
                      className="avatar border-[1px] border-[#dcdfe4]"
                    >
                      <div className="w-6">
                        <img src={user?.avatar} alt="profile img" />
                      </div>
                    </div>
                  );
                })}
              </div>

              {showMovement && (
                <div className="absolute -left-2 -top-2">
                  {movementInfo?.avatar ? (
                    <div className="avatar border-[1px] border-[#dcdfe4]">
                      <div className="w-6">
                        <img src={movementInfo?.avatar} alt="profile img" />
                      </div>
                    </div>
                  ) : (
                    <div className="placeholder avatar">
                      <div
                        className="justiy-center w-6 items-center rounded-full border-2 border-rose-400 bg-neutral-focus text-neutral-content"
                        style={{ lineHeight: "1.5rem" }}
                      >
                        <span className="m-0 p-0 text-xl">
                          {movementInfo?.name[0]}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </Draggable>
      <CustomModal modalOpen={modalOpen} setModalOpen={setModalOpen}>
        <div className="h-[80vh] w-[60vw] text-black">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-2xl font-bold">{task.name}</h1>
            <IconButton onClick={() => setModalOpen(false)}>
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
                  {task.status}
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
                      label: user.username,
                      value: user._id,
                    };
                  })}
                  style={{ width: "100%", display: "block" }}
                  onChange={(value: string[], _) => {
                    changePeople({ users: value, task_id: task._id });
                    task.users = users.filter((u) => value.includes(u._id));
                  }}
                  value={task.users.map((u) => u._id)}
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
            {activeTab === 0 && <MDEditor task={task} />}
            {activeTab === 1 && <TaskCodeSnippets task={task} />}
          </div>
        </div>
      </CustomModal>
    </>
  );
};

export default TaskCard;
