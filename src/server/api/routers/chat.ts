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
import Notification from "@/models/Notification";

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
        messages: [],
        type: type,
      });

      return chatroom;
    }),

  createTeam: privateProcedure
    .input(
      z.object({
        chatroom_name: z.string(),
        participants: z.array(z.string()),
      })
    )
    .mutation(async ({ input, ctx }) => {
      console.log(input);

      const { chatroom_name, participants } = input;
      const { user } = ctx;

      // check if all participants exist

      const foundParticipants = await User.find({
        username: { $in: participants },
      });

      if (foundParticipants.length !== participants.length) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "One or more participants do not exist.",
        });
      }

      const chatroom = await Chatroom.create({
        name: chatroom_name,
        participants: [new mongoose.Types.ObjectId(user._id)],
        messages: [],
        type: "team",
      });

      const notifications = await Promise.all(
        participants.map(async (participant_id) => {
          const notification = await Notification.create({
            type: "team_invite",
            sender_id: new mongoose.Types.ObjectId(user._id),
            receiver_id: new mongoose.Types.ObjectId(participant_id),
            chatroom_id: chatroom._id,
          });

          await pusherServer.sendToUser(
            participant_id,
            "incoming-notification",
            {
              _id: notification._id.toString(),
              type: notification.type,
              sender: {
                _id: user._id.toString(),
                username: user.username,
              },
              sender_id: notification.sender_id.toString(),
              receiver_id: notification.receiver_id.toString(),
              createdAt: notification.createdAt,
            }
          );

          return notification;
        })
      );

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
      }).select("username");
      return usernames;
    }),
  sendMessage: privateProcedure
    .input(
      z.object({
        channel: z.string(),
        text: z.string(),
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
        _id: new mongoose.Types.ObjectId() as unknown as ObjectId,
        sender: {
          _id: new mongoose.Types.ObjectId(user._id) as unknown as ObjectId,
          username: user.username,
        },
        text: text,
        timestamp: timestamp,
      };

      chatroom.messages.push(messageData);

      await chatroom.save();

      const result = await pusherServer.trigger(channel, "incoming-message", {
        ...messageData,
      });
      return result;
    }),
  getFriends: privateProcedure.query(async ({ ctx }) => {
    const { user } = ctx;

    const chatrooms = await Chatroom.find({
      participants: user._id,
    }).select("participants");

    const friends = chatrooms
      .map((chatroom) => chatroom.participants)
      .flat()
      .filter((friend_id) => friend_id.toString() !== user._id.toString());

    const uniqueFriends = [
      ...new Set(friends.map((friend) => friend.toString())),
    ];

    const friendsWithNames = await Promise.all(
      uniqueFriends.map(async (friend_id) => {
        const friend = await User.findById(friend_id).select("username");
        return friend;
      })
    );

    return friendsWithNames;
  }),
  unfriendUser: privateProcedure
    .input(
      z.object({
        friend_id: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { friend_id } = input;
      const { user } = ctx;

      const chatroom = await Chatroom.findOne({
        participants: { $all: [user._id, friend_id] },
        type: "private",
      });

      if (!chatroom) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You are not friends with this person.",
        });
      }

      await Chatroom.deleteOne({
        participants: { $all: [user._id, friend_id] },
        type: "private",
      });

      return true;
    }),
});
