import React from "react";
import TaskCard from "./TaskCard";
import IconButton from "./IconButton";
import CustomModal from "./Modal";
import { type IUser } from "@/models/User";
import { type IScrum } from "@/models/Scrum";
import { type Document } from "mongoose";
import { type ITask } from "@/models/Task";
import { TagPicker } from "rsuite";
import { api } from "@/utils/api";
import { toast } from "react-hot-toast";
import {
  DragDropContext,
  Droppable,
  type OnDragEndResponder,
} from "react-beautiful-dnd";

export const PROGRESS = {
  Todo: "To Do",
  In_Progress: "In Progress",
  Done: "Done",
};
export interface User {
  id: number;
  name: string;
  profile_img: string;
}

const Tasks = ({
  users,
  scrum,
}: {
  users: IUser[];
  scrum:
    | (Document<unknown, object, IScrum> &
        Omit<
          IScrum &
            Required<{
              _id: string;
            }>,
          never
        >)
    | null
    | undefined;
}) => {
  const [formData, setFormData] = React.useState({
    name: "",
    description: "",
    status: PROGRESS.Todo,
    users: [] as string[],
  });
  const utils = api.useContext();
  const { mutate: rearrangeTasks } = api.scrum.rearrangeTasks.useMutation();

  const [createTaskModalOpen, setCreateTaskModalOpen] = React.useState(false);
  const { mutate: createTask, isLoading: isCreatingTask } =
    api.scrum.createTask.useMutation();
  const aggregatedTasks = React.useMemo(() => {
    const res = new Map<string, ITask[]>();
    if (!scrum) return res;
    for (const task of scrum.tasks.filter((task) => !task.backlog)) {
      if (!res.has(task.status)) {
        res.set(task.status, []);
      }
      res.get(task.status)?.push(task);
    }
    return res;
  }, [scrum]);
  const handleDragEnd: OnDragEndResponder = (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;
    const task = scrum?.tasks.find((task) => task._id === draggableId);
    if (!task) return;
    const source_status = source.droppableId as keyof typeof PROGRESS;
    const destination_status = destination.droppableId as keyof typeof PROGRESS;
    const destination_index = destination.index;
    // first delete the task from the source
    aggregatedTasks.get(source_status)?.splice(source.index, 1);
    // then add the task to the destination
    // what if the destination has no tasks?
    if (!aggregatedTasks.has(destination_status)) {
      aggregatedTasks.set(destination_status, []);
    }
    aggregatedTasks.get(destination_status)?.splice(destination_index, 0, task);
    rearrangeTasks({
      destination_index,
      destination_status,
      source_status,
      scrum_id: scrum?._id,
      task_id: task._id,
    });
  };

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="h-full text-black">
          <div className="grid gap-8 rounded-xl rounded-tl-none pt-4 md:grid-cols-3 ">
            {Object.values(PROGRESS).map((status) => {
              return (
                <Droppable droppableId={status} key={status}>
                  {(provided) => (
                    <div
                      key={status}
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="flex flex-col gap-3 rounded-xl bg-[#f1f2f4] p-3 shadow-md outline outline-1 outline-[#dcdfe4]"
                    >
                      <div className="flex items-center gap-1 px-2 text-xl font-bold">
                        <div>{status}</div>
                        <IconButton
                          onClick={() => {
                            setFormData({ ...formData, status });
                            setCreateTaskModalOpen(true);
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
                              d="M12 4.5v15m7.5-7.5h-15"
                            />
                          </svg>
                        </IconButton>
                      </div>
                      {aggregatedTasks.get(status)?.map((task, index) => {
                        return (
                          <TaskCard
                            draggable={true}
                            aggregatedTasks={aggregatedTasks}
                            index={index}
                            key={task._id}
                            task={task}
                            users={users}
                          />
                        );
                      })}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              );
            })}
          </div>
        </div>
      </DragDropContext>
      <CustomModal
        modalOpen={createTaskModalOpen}
        setModalOpen={setCreateTaskModalOpen}
      >
        <form
          className="flex flex-col gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            createTask(
              { ...formData, scrum_id: scrum?._id },
              {
                onSuccess: () => {
                  utils.scrum.getScrumByChatId
                    .invalidate({ chat_id: scrum?.chat_id })
                    .catch(console.error);
                  setFormData({
                    name: "",
                    description: "",
                    status: PROGRESS.Todo,
                    users: [] as string[],
                  });
                  setCreateTaskModalOpen(false);
                  toast.success("Task created successfully");
                },
                onError: (error) => {
                  toast.error(error.message);
                },
              }
            );
          }}
        >
          <h3>New Task</h3>
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
            value={formData.status}
            required
            onChange={(e) => {
              setFormData({ ...formData, status: e.target.value });
            }}
            className="select w-full max-w-xs rounded-md  border border-gray-300 bg-white shadow-sm outline-none focus:border-primary focus:outline-none"
          >
            <option disabled>Status</option>
            <option value={PROGRESS.Todo}>{PROGRESS.Todo}</option>
            <option value={PROGRESS.In_Progress}>{PROGRESS.In_Progress}</option>
            <option value={PROGRESS.Done}>{PROGRESS.Done}</option>
          </select>
          <textarea
            className="textarea w-full max-w-xs rounded-md  border border-gray-300 bg-white shadow-sm outline-none focus:border-primary focus:outline-none"
            name="description"
            id="description"
            cols={30}
            placeholder="Description"
            value={formData.description}
            onChange={(e) => {
              setFormData({ ...formData, description: e.target.value });
            }}
          ></textarea>
          <TagPicker
            size="md"
            placeholder="People"
            data={users.map((user) => {
              return {
                label: user.username,
                value: user._id,
              };
            })}
            className="flex-wrap items-center"
            style={{ width: "100%", display: "flex", height: "3rem" }}
            onChange={(value, _) => {
              setFormData({ ...formData, users: value as string[] });
            }}
            value={formData.users}
          />

          <button
            className={`btn-success btn ${isCreatingTask ? "loading" : ""}`}
          >
            Create!
          </button>
        </form>
      </CustomModal>
    </>
  );
};

export default Tasks;
