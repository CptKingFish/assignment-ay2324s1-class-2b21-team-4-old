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
  return (
    <DragDropContext
      onDragEnd={() => {
        console.log("yay");
      }}
    >
      <Droppable droppableId="backlog">
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
