import { createTRPCRouter } from "@/server/api/trpc";
import { userRouter } from "./routers/user";
import { scrumRouter } from "./routers/scrum";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  scrum: scrumRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
