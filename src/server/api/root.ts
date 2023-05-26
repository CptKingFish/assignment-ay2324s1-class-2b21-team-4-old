import { createTRPCRouter } from "@/server/api/trpc";
import { userRouter } from "./routers/user";
import { scrumRouter } from "./routers/scrum";
import { chatRouter } from "./routers/chat";
import { notificationRouter } from "./routers/notification";
import { imageRouter } from "./routers/image";
import { authRouter } from "./routers/auth";
/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  scrum: scrumRouter,
  chat: chatRouter,
  notification: notificationRouter,
  image: imageRouter,
  auth: authRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
