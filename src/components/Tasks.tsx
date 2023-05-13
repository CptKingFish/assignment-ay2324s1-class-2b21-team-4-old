import React from "react";
import TaskCard from "./TaskCard";
import IconButton from "./IconButton";

export const users = [
  {
    id: 1,
    name: "Elliott",
    profile_img:
      "https://trello-members.s3.amazonaws.com/5c056de80eb2314e1e34342a/768cdd52935b84b9ec948d16d4054760/50.png",
  },
  {
    id: 2,
    name: "Sithu",
    profile_img:
      "https://trello-members.s3.amazonaws.com/5c056de80eb2314e1e34342a/768cdd52935b84b9ec948d16d4054760/50.png",
  },
  {
    id: 3,
    name: "Timmy",
    profile_img:
      "https://trello-members.s3.amazonaws.com/5c056de80eb2314e1e34342a/768cdd52935b84b9ec948d16d4054760/50.png",
  },
  {
    id: 4,
    name: "Andy",
    profile_img:
      "https://trello-members.s3.amazonaws.com/5c056de80eb2314e1e34342a/768cdd52935b84b9ec948d16d4054760/50.png",
  },
];

const PROGRESS = {
  Todo: "To Do",
  In_Progress: "In Progress",
  Done: "Done",
};
export interface User {
  id: number;
  name: string;
  profile_img: string;
}

export interface Task {
  id: number;
  text: string;
  urgency: number;
  users: number[];
  description?: string;
  progress: string;
}

const tasks: Task[] = [
  {
    id: 1,
    text: "Doctors Appointment",
    urgency: 1,
    users: [1, 2, 3],
    progress: PROGRESS.Todo,
    description: "This is a description",
  },
  {
    id: 2,
    text: "Meeting at School",
    urgency: 2,
    users: [1, 2, 3],
    progress: PROGRESS.Todo,
  },
  {
    id: 3,
    text: "Food Shopping",
    urgency: 1,
    users: [2, 4],
    progress: PROGRESS.Done,
  },
  {
    id: 4,
    text: "Love life",
    urgency: 4,
    users: [1, 4],
    progress: PROGRESS.In_Progress,
  },
];

const Tasks = () => {
  const aggregatedTasks = React.useMemo(
    () =>
      tasks.reduce((acc, task) => {
        const progress = task.progress;
        if (!acc.has(progress)) {
          acc.set(progress, []);
        }
        acc.get(progress)?.push(task);
        return acc;
      }, new Map<string, Task[]>()),
    []
  );
  return (
    <>
      <div className="h-full text-black">
        <div className="grid grid-cols-3 gap-8 rounded-xl rounded-tl-none pt-4 ">
          <div className="flex flex-col gap-3 rounded-xl bg-[#f1f2f4] p-3 shadow-md outline outline-1 outline-[#dcdfe4]">
            <div className="flex items-center gap-1 px-2 text-xl font-bold">
              <div>Todo</div>
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
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>
              </IconButton>
            </div>
            {aggregatedTasks.get(PROGRESS.Todo)?.map((task) => {
              return <TaskCard key={task.id} task={task} users={users} />;
            })}
          </div>
          <div className="flex flex-col gap-3 rounded-xl bg-[#f1f2f4] p-3 shadow-md outline outline-1 outline-[#dcdfe4]">
            <div className="text-xl font-bold">In Progress</div>
            {aggregatedTasks.get(PROGRESS.In_Progress)?.map((task) => {
              return <TaskCard key={task.id} task={task} users={users} />;
            })}
          </div>

          <div className="flex flex-col gap-3 rounded-xl bg-[#f1f2f4] p-3 shadow-md outline outline-1 outline-[#dcdfe4]">
            <div className="text-xl font-bold">Done</div>
            {aggregatedTasks.get(PROGRESS.Done)?.map((task) => {
              return <TaskCard key={task.id} task={task} users={users} />;
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default Tasks;
