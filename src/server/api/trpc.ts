import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
import jwt from "jsonwebtoken";

/** Replace this with an object if you want to pass things to `createContextInner`. */
mongoose
  .connect(env.MONGO_URL, {})
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch(console.error);

export const createTRPCContext = (_opts: CreateNextContextOptions) => {
  return {
    req: _opts.req,
  };
};

import { TRPCError, initTRPC } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";
import mongoose from "mongoose";
import { env } from "@/env.mjs";
import User, { type IUser } from "@/models/User";

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

const isAuth = t.middleware(async ({ ctx, next }) => {
  const { req } = ctx;
  console.log(req.headers);
  let token: string | undefined = req.headers.authorization;
  if (!token) {
    throw new TRPCError({ code: "BAD_REQUEST" });
  }
  token = token.replace("Bearer ", "");
  const decoded_token = jwt.verify(token, env.JWT_SECRET) as {
    user_id: string;
  };
  const user = (await User.findById(decoded_token.user_id).select(
    "-password"
  )) as IUser;
  if (!user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({ ctx: { ...ctx, user } });
});

export const createTRPCRouter = t.router;
export const privateProcedure = t.procedure.use(isAuth);
export const publicProcedure = t.procedure;
