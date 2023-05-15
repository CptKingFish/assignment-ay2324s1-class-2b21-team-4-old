import { z } from "zod";

import bcrypt from "bcryptjs";
import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import { TRPCError } from "@trpc/server";
import { env } from "@/env.mjs";

export const userRouter = createTRPCRouter({
  getMe: privateProcedure.query(({ ctx }) => {
    return ctx.user;
  }),
  register: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        username: z.string(),
        password: z.string().min(8),
      })
    )
    .mutation(async ({ input }) => {
      let user = await User.findOne({
        email: input.email.toLowerCase(),
      }).select("-password");
      if (user) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User already exists",
        });
      }
      if (input.email.toLowerCase().includes("+")) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Don't use an email alias!",
        });
      }
      const hashedPassword = await bcrypt.hash(input.password, 12);
      user = await User.create({
        email: input.email.toLowerCase(),
        username: input.username,
        password: hashedPassword,
        isEmailVerified: true,
      });
      const token = jwt.sign({ user_id: user._id }, env.JWT_SECRET, {
        expiresIn: "1d",
      });
      // await sendEmail(
      //   input.email.toLowerCase(),
      //   "Verify your email",
      //   registerHtml(token)
      // );
      return {
        token,
        message:
          "Please check your inbox to verify your account! If you do not see the email in a few minutes, check your “junk mail” folder or “spam” folder.",
        code: "SUCCESS",
      };
    }),
  login: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(8),
      })
    )
    .mutation(async ({ input }) => {
      const user = await User.findOne({
        email: input.email.toLowerCase(),
      });
      if (!user) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid credentials",
        });
      }
      const isPasswordValid = await bcrypt.compare(
        input.password,
        user.password
      );
      if (!isPasswordValid) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid credentials",
        });
      }
      const token = jwt.sign({ user_id: user._id }, env.JWT_SECRET, {
        expiresIn: "1d",
      });
      return {
        token,
        message: "Logged in successfully!",
        code: "SUCCESS",
      };
    }),
    getUsername: publicProcedure
    .input(
      z.object({
        user_id: z.string(),
      })
    )
    .query(async ({ input }) => {
      const { user_id } = input;
      const user = await User.findById(user_id).select("username");
      if (!user) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User not found",
        });
      }
      return user;
    }),
});
