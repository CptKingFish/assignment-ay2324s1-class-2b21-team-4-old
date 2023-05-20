import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import Scrum from "@/models/Scrum";
import Task, { type ITask } from "@/models/Task";
import File from "@/models/File";
import User, { type IUser } from "@/models/User";
import Snippet from "@/models/Snippet";

export const scrumRouter = createTRPCRouter({
  seed: publicProcedure.mutation(async () => {
    const scrum = await Scrum.create({
      chat_id: "5",
      tasks: [],
      files: [],
    });
    return scrum;
  }),
  getScrumByChatId: publicProcedure
    .input(
      z.object({
        chat_id: z.string().nullable(),
      })
    )
    .query(async ({ input }) => {
      if (input.chat_id === null) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "chat_id is required",
        });
      }
      const scrum = await Scrum.findOne({
        chat_id: input.chat_id,
      })
        .populate({
          path: "tasks",
          model: Task,
          populate: {
            path: "users",
            model: User,
          },
        })
        .populate({
          path: "tasks",
          model: Task,
          populate: {
            path: "snippets",
            model: Snippet,
          },
        })
        .populate({
          path: "files",
          model: File,
          populate: {
            path: "user",
            model: User,
          },
        });

      return scrum;
    }),
  createTask: publicProcedure
    .input(
      z.object({
        scrum_id: z.string().nullish(),
        name: z.string(),
        description: z.string(),
        users: z.array(z.string()),
        status: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      if (input.scrum_id === null) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "scrum_id is required",
        });
      }
      const scrum = await Scrum.findById(input.scrum_id);
      if (scrum === null) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "scrum not found",
        });
      }
      const task = await Task.create({
        scrum_id: input.scrum_id,
        name: input.name,
        description: input.description,
        users: input.users,
        status: input.status,
      });
      scrum.tasks.push(task);
      console.log(task);
      await scrum.save();
      return task;
    }),
  changePeople: publicProcedure
    .input(
      z.object({
        task_id: z.string().nullish(),
        users: z.array(z.string()),
      })
    )
    .mutation(async ({ input }) => {
      if (input.task_id === null) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "task_id is required",
        });
      }
      const task = await Task.findById(input.task_id);
      if (task === null) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "task not found",
        });
      }
      task.users = input.users as unknown as IUser[];
      await task.save();
      return task;
    }),
  updateText: publicProcedure
    .input(
      z.object({
        task_id: z.string().nullish(),
        text: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const task = await Task.findById(input.task_id);
      if (task === null) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "task not found",
        });
      }
      task.text = input.text;
      await task.save();
      return task;
    }),
  createCodeSnippet: publicProcedure
    .input(
      z.object({
        task_id: z.string().nullish(),
        name: z.string(),
        language: z.string(),
        code: z.string(),
        description: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const task = await Task.findById(input.task_id);
      if (task === null) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "task not found",
        });
      }
      const new_snippet = await Snippet.create({
        name: input.name,
        language: input.language,
        snippet: input.code,
        description: input.description,
      });
      task.snippets.push(new_snippet);
      await task.save();
      return task;
    }),
  deleteCodeSnippet: publicProcedure
    .input(
      z.object({
        snippet_id: z.string().nullish(),
      })
    )
    .mutation(async ({ input }) => {
      const snippet = await Snippet.deleteOne({
        _id: input.snippet_id,
      });
      return snippet;
    }),
  deleteTask: publicProcedure
    .input(
      z.object({
        task_id: z.string().nullish(),
      })
    )
    .mutation(async ({ input }) => {
      const task = await Task.deleteOne({
        _id: input.task_id,
      });
      return task;
    }),
  changeTaskBacklogStatus: publicProcedure
    .input(
      z.object({
        task_id: z.string().nullish(),
        backlog: z.boolean(),
      })
    )
    .mutation(async ({ input }) => {
      await Task.updateOne(
        {
          _id: input.task_id,
        },
        {
          $set: {
            backlog: input.backlog,
          },
        }
      );
    }),
  rearrangeTasks: publicProcedure
    .input(
      z.object({
        scrum_id: z.string().nullish(),
        source_status: z.string(),
        destination_status: z.string(),
        destination_index: z.number(),
        task_id: z.string().nullish(),
      })
    )
    .mutation(async ({ input }) => {
      // console.log(input);
      const scrum = await Scrum.findById(input.scrum_id).populate({
        path: "tasks",
        model: Task,
      });
      if (scrum === null) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "scrum not found",
        });
      }
      const tasks = scrum.tasks;
      const task = tasks.find((task) => task._id.toString() === input.task_id);
      if (task === undefined) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "task not found",
        });
      }
      // tasks is an array of tasks
      if (tasks.length === 1) {
        await Task.updateOne(
          {
            _id: input.task_id,
          },
          {
            $set: {
              status: input.destination_status,
            },
          }
        );
        return;
      }
      for (let i = 0; i < tasks.length; i++) {
        if (tasks[i]?._id.toString() === input.task_id) {
          tasks.splice(i, 1);
        }
      }
      let count_encountered_tasks = 0;
      console.log(input.destination_index, input.destination_status);
      for (let i = 0; i < tasks.length; i++) {
        if (count_encountered_tasks === input.destination_index) {
          console.log("i like cats", task, i);
          tasks.splice(i, 0, task as unknown as ITask);
          break;
        }
        if (
          tasks[i]?.status === input.destination_status &&
          !tasks[i]?.backlog
        ) {
          count_encountered_tasks++;
        }
      }
      await Promise.all([
        Task.updateOne(
          {
            _id: input.task_id,
          },
          {
            $set: {
              status: input.destination_status,
            },
          }
        ),
        Scrum.updateOne(
          {
            _id: input.scrum_id,
          },
          {
            $set: {
              tasks: tasks.map((t) => t._id),
            },
          }
        ),
      ]);
      // console.log(
      //   tasks.map((t) => {
      //     return { name: t.name, status: t.status };
      //   })
      // );
    }),
});
