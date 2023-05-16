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
import ProfileChangeEmail from "@/components/ProfileChangeEmail";

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
  getAllUsersByChatId: publicProcedure
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
      // todo: check if user is in chat
      const users = await User.find({});
      return users;
    }),
  changeOwnUsername: privateProcedure
    .input(
      z.object({
        username: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      
      const response = await User.findByIdAndUpdate(
        ctx.user._id,
        {
          username: input.username,
        },
        { new: true }
      );
      return response;
    }),
  changeOwnEmail: privateProcedure
    .input(
      z.object({
        email: z.string().email(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!input.email.toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )){
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid email!",
        });
      }

      if (input.email.toLowerCase().includes("+")) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Don't use an email alias!",
        });
      }
      const response = await User.findByIdAndUpdate(
        ctx.user._id,
        {
          email: input.email,
        },
        { new: true }
      );

      return response;
    }),
  changeOwnPassword: privateProcedure
    .input(
      z.object({
        oldPassword: z.string().min(8),
        newPassword: z.string().min(8),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const response = await User.findById(ctx.user._id);
      if (!response) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User not found",
        });
      }
      const isPasswordValid = await bcrypt.compare(
        input.oldPassword,
        response.password
      );
      if (!isPasswordValid) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid credentials",
        });
      }
      const hashedPassword = await bcrypt.hash(input.newPassword, 12);
      const updatedUser = await User.findByIdAndUpdate(
        ctx.user._id,
        {
          password: hashedPassword,
        },
        { new: true }
      );
      return updatedUser;
    }),
});
