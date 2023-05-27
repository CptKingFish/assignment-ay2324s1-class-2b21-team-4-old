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
import Notification from "@/models/Notification";
import Chatroom from "@/models/Chatroom";
import { pusherServer } from "@/utils/pusherConfig";
import mongoose, { ObjectId } from "mongoose";

export const notificationRouter = createTRPCRouter({
  getNotifications: privateProcedure.query(async ({ ctx }) => {
    const { user } = ctx;
    const notifications = await Notification.find({
      receiver_id: user._id,
    }).sort({ createdAt: -1 });
    //   .limit(10);

    const notificationsWithSender = await Promise.all(
      notifications.map(async (notification) => {
        const sender = await User.findById(notification.sender_id).select(
          "-password"
        );
        return {
          ...notification.toObject(),
          sender: sender,
        };
      })
    );

    return notificationsWithSender;
  }),
  sendFriendRequest: privateProcedure
    .input(
      z.object({
        receiver_username: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { receiver_username } = input;
      const { user } = ctx;

      // check if user is the receiver

      if (user.username === receiver_username) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You cannot send a friend request to yourself",
        });
      }

      const receiver = await User.findOne({
        username: receiver_username,
      });

      if (!receiver) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User does not exist",
        });
      }

      const receiver_id = receiver._id.toString();

      const areAlreadyFriends = await Chatroom.findOne({
        type: "private",
        participants: { $all: [user._id, receiver_id] },
      });

      if (areAlreadyFriends) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You are already friends with this user",
        });
      }

      const hasAlreadyRequested = await Notification.findOne({
        sender_id: user._id,
        receiver_id: receiver_id,
        type: "friend_request",
      });

      if (hasAlreadyRequested) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You have already sent a friend request to this user",
        });
      }

      const notification = await Notification.create({
        type: "friend_request",
        sender_id: user._id,
        receiver_id: receiver_id,
      });

      await pusherServer.sendToUser(receiver_id, "incoming-notification", {
        _id: notification._id.toString(),
        type: notification.type,
        sender: {
          _id: user._id.toString(),
          username: user.username,
        },
        sender_id: notification.sender_id.toString(),
        receiver_id: notification.receiver_id.toString(),
        createdAt: notification.createdAt,
      });
      return notification;
    }),
  sendFriendRequestById: privateProcedure
    .input(
      z.object({
        receiver_id: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { receiver_id } = input;
      const { user } = ctx;

      // check if user is the receiver

      if (user._id.toString() === receiver_id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You cannot send a friend request to yourself",
        });
      }

      const receiver = await User.findById(receiver_id);

      if (!receiver) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User does not exist",
        });
      }

      const areAlreadyFriends = await Chatroom.findOne({
        type: "private",
        participants: {
          $all: [user._id, receiver_id],
        },
      });

      if (areAlreadyFriends) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You are already friends with this user",
        });
      }

      const hasAlreadyRequested = await Notification.findOne({
        sender_id: user._id,
        receiver_id: receiver_id,
        type: "friend_request",
      });

      if (hasAlreadyRequested) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You have already sent a friend request to this user",
        });
      }

      const notification = await Notification.create({
        type: "friend_request",
        sender_id: user._id,
        receiver_id: receiver_id,
      });

      await pusherServer.sendToUser(receiver_id, "incoming-notification", {
        _id: notification._id.toString(),
        type: notification.type,
        sender: {
          _id: user._id.toString(),
          username: user.username,
        },
        sender_id: notification.sender_id.toString(),
        receiver_id: notification.receiver_id.toString(),
        createdAt: notification.createdAt,
      });
      return notification;
    }),
  declineFriendRequest: privateProcedure
    .input(
      z.object({
        notification_id: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { notification_id } = input;
      const { user } = ctx;

      const notification = await Notification.findById(notification_id);

      if (!notification) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Notification does not exist",
        });
      }

      if (notification.receiver_id.toString() !== user._id.toString()) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You cannot decline this friend request",
        });
      }

      // delete notification
      await Notification.findByIdAndDelete(notification_id);

      return notification;
    }),
  acceptFriendRequest: privateProcedure
    .input(
      z.object({
        notification_id: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { notification_id } = input;
      const { user } = ctx;

      const notification = await Notification.findById(notification_id);

      if (!notification) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Notification does not exist",
        });
      }

      if (notification.receiver_id.toString() !== user._id.toString()) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You cannot accept this friend request",
        });
      }

      if (notification.type !== "friend_request") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Notification is not of type friend request",
        });
      }

      // delete notification
      await Notification.findByIdAndDelete(notification_id);

      const chatroom = await Chatroom.create({
        name: null,
        type: "private",
        messages: [],
        participants: [user._id, notification.sender_id],
      });

      await pusherServer.sendToUser(
        notification.sender_id.toString(),
        "friend-added",
        null
      );

      return chatroom;
    }),
  sendTeamInvite: privateProcedure
    .input(
      z.object({
        receiver_ids: z.array(z.string()),
        chatroom_id: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { receiver_ids, chatroom_id } = input;
      const { user } = ctx;

      const chatroom = await Chatroom.findById(chatroom_id);

      if (!chatroom) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Chatroom does not exist",
        });
      }

      if (receiver_ids.includes(user._id.toString())) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You cannot invite yourself",
        });
      }

      const isAlreadyInTeam = await Chatroom.findOne({
        _id: chatroom_id,
        type: "team",
        participants: { $all: receiver_ids },
      });

      if (isAlreadyInTeam) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "One or more of the users are already in the team",
        });
      }

      const hasAlreadyInvited = await Notification.findOne({
        sender_id: user._id,
        receiver_id: { $in: receiver_ids },
        type: "team_invite",
        chatroom_id: chatroom_id,
      });

      if (hasAlreadyInvited) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "One or more of the users have already been invited",
        });
      }

      const notifications = await Promise.all(
        receiver_ids.map(async (receiver_id) => {
          const notification = await Notification.create({
            type: "team_invite",
            sender_id: new mongoose.Types.ObjectId(user._id),
            receiver_id: new mongoose.Types.ObjectId(receiver_id),
            chatroom_id: new mongoose.Types.ObjectId(chatroom_id),
          });

          await pusherServer.sendToUser(receiver_id, "incoming-notification", {
            _id: notification._id.toString(),
            type: notification.type,
            sender: {
              _id: user._id.toString(),
              username: user.username,
            },
            sender_id: notification.sender_id.toString(),
            receiver_id: notification.receiver_id.toString(),
            chatroom_id: notification.chatroom_id?.toString() || "",
            chatroom_name: chatroom.name || "",
            createdAt: notification.createdAt,
          });

          return notification;
        })
      );
    }),
  acceptTeamInvite: privateProcedure
    .input(
      z.object({
        notification_id: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { notification_id } = input;
      const { user } = ctx;

      const notification = await Notification.findById(notification_id);

      if (!notification) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Notification does not exist",
        });
      }

      if (notification.receiver_id.toString() !== user._id.toString()) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You cannot accept this team invite",
        });
      }

      if (notification.type !== "team_invite") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Notification is not of type team invite",
        });
      }

      // delete notification
      await Notification.findByIdAndDelete(notification_id);

      const chatroom = await Chatroom.findById(notification.chatroom_id);

      if (!chatroom) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Chatroom does not exist",
        });
      }

      chatroom.participants.push(user._id);
      await chatroom.save();

      const messageData = {
        hasReplyTo: false,
        _id: new mongoose.Types.ObjectId(),
        sender: {
          _id: new mongoose.Types.ObjectId(user._id) as unknown as ObjectId,
          username: user.username,
        },
        text: `${user.username} has joined the team`,
        data_type: "status",
        timestamp: Date.now(),
      };

      chatroom.messages.push(messageData);
      await chatroom.save();

      await pusherServer.trigger(
        `presence-${chatroom._id.toString()}`,
        "user-joined",
        messageData
      );

      return chatroom;
    }),
  declineTeamInvite: privateProcedure
    .input(
      z.object({
        notification_id: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { notification_id } = input;
      const { user } = ctx;

      const notification = await Notification.findById(notification_id);

      if (!notification) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Notification does not exist",
        });
      }

      if (notification.receiver_id.toString() !== user._id.toString()) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You cannot decline this team invite",
        });
      }

      if (notification.type !== "team_invite") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Notification is not of type team invite",
        });
      }

      // delete notification
      await Notification.findByIdAndDelete(notification_id);

      return notification;
    }),
});
