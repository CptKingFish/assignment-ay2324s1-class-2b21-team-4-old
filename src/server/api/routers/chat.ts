import { z } from "zod";

import bcrypt from "bcryptjs";
import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import User from "@/models/User";
import Chatroom from "@/models/Chatroom";
import jwt from "jsonwebtoken";
import { TRPCError } from "@trpc/server";
import { env } from "@/env.mjs";
import { m } from "framer-motion";
import mongoose, { ObjectId } from "mongoose";
import { pusherServer } from "@/utils/pusherConfig";

export const chatRouter = createTRPCRouter({
  getMessagesAndChatroomInfo: privateProcedure
    .input(
      z.object({
        chatroom_id: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { chatroom_id } = input;
      const { user } = ctx;
      const chatroom = await Chatroom.findById(chatroom_id);
      if (!chatroom) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Chatroom not found",
        });
      }
      if (!chatroom.participants.includes(user._id)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Unauthorized",
        });
      }

      chatroom.messages.reverse();

      return chatroom;
    }),
  createChatroom: privateProcedure
    .input(
      z.object({
        chatroom_name: z.string(),
        type: z.enum(["team", "private"]),
      })
    )
    .mutation(async ({ input, ctx }) => {
      console.log(input);

      const { chatroom_name, type } = input;
      const { user } = ctx;

      const chatroom = await Chatroom.create({
        name: chatroom_name,
        participants: [new mongoose.Types.ObjectId(user._id)],
        admins: [new mongoose.Types.ObjectId(user._id)],
        messages: [],
        type: type,
      });

      return chatroom;
    }),

  getChatrooms: privateProcedure.query(async ({ ctx }) => {
    const { user } = ctx;
    const chatrooms = await Chatroom.find({
      participants: user._id,
    }).slice("messages", -1);

    // also retrieve participant names

    const chatroomsWithParticipants = await Promise.all(
      chatrooms.map(async (chatroom) => {
        const participants = await User.find({
          _id: { $in: chatroom.participants },
        }).select("username");
        return {
          ...chatroom.toObject(),
          participants: participants,
        };
      })
    );

    return chatroomsWithParticipants;
  }),
  getUsernamesFromChatroom: privateProcedure
    .input(
      z.object({
        chatroom_id: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { chatroom_id } = input;
      const { user } = ctx;
      const chatroom = await Chatroom.findById(chatroom_id);
      if (!chatroom) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Chatroom not found",
        });
      }
      if (!chatroom.participants.includes(user._id)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Unauthorized",
        });
      }
      const usernames = await User.find({
        _id: { $in: chatroom.participants },
      }).select("username avatar");
      return usernames;
    }),
  sendMessage: privateProcedure
    .input(
      z.object({
        channel: z.string(),
        text: z.string(),
        replyTo: z
          .object({
            _id: z.string(),
            sender: z.object({
              _id: z.string(),
              username: z.string(),
            }),
            text: z.string(),
            timestamp: z.number(),
          })
          .optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { channel, text } = input;
      const { user } = ctx;
      const chatroom_id = channel.split("-")[1];

      const foundUser = await User.findById(user._id);

      if (!foundUser) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      const chatroom = await Chatroom.findById(chatroom_id);

      if (!chatroom) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Chatroom not found",
        });
      }

      if (!chatroom.participants.includes(user._id)) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Unauthorized",
        });
      }

      const timestamp = Date.now();

      const messageData = {
        hasReplyTo: !!input.replyTo,
        _id: new mongoose.Types.ObjectId() as unknown as ObjectId,
        sender: {
          _id: new mongoose.Types.ObjectId(user._id) as unknown as ObjectId,
          username: user.username,
        },
        text: text,
        timestamp: timestamp,
        replyTo: input.replyTo,
      };

      chatroom.messages.push(messageData);

      await chatroom.save();
      console.log(chatroom.messages[chatroom.messages.length - 1]);

      const result = await pusherServer.trigger(channel, "incoming-message", {
        ...messageData,
      });
      return result;
    }),
    getAdminFromChatroom: privateProcedure
    .input(
      z.object({
        chatroom_id: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      try{
        return await Chatroom.findById(input.chatroom_id).select("admins");
      }catch(err){
        return err;
      }
    }),
});
