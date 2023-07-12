import { type IScrum } from "@/models/Scrum";
import React from "react";
import TaskCard from "./TaskCard";
import { type IUser } from "@/models/User";
import { type Document } from "mongoose";
import { DragDropContext, Droppable } from "react-beautiful-dnd";

type Props = {
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
  users: IUser[];
};

const Backlog = ({ scrum, users }: Props) => {
  if (!scrum) return <></>;
  if (scrum.tasks.filter((t) => t.backlog).length === 0) {
    return (
      <div className="alert alert-success mt-4 shadow-lg">
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 flex-shrink-0 stroke-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>No tasks in the backlog!</span>
        </div>
      </div>
    );
  }
  return (
    <DragDropContext
      onDragEnd={() => {
        console.log("yay");
      }}
    >
      <Droppable droppableId="backlog" >
        {(provided) => (
          <div
            className="mt-4 grid gap-4 md:grid-cols-3"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {scrum?.tasks
              ?.filter((task) => task.backlog)
              .map((task, index) => {
                return (
                  <TaskCard
                    isDragging={false}
                    draggable={false}
                    index={index}
                    key={task._id}
                    task={task}
                    users={users}
                    backlog={true}
                  />
                );
              })}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default Backlog;
