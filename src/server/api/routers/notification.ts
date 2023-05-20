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
        members: { $all: [user._id, receiver_id] },
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

      // send notification to receiver

      // key={notification._id.toString()}
      //           notification_id={notification._id.toString()}
      //           sender_username={notification?.sender?.username.toString() || ""}
      //           type={notification.type}
      //           time={formatDate(notification.createdAt)}
      //           avatarUrl={"https://source.unsplash.com/random/?city,night"}
      //           handleRemoveNotification={handleRemoveNotification}

      const notification = await Notification.create({
        type: "friend_request",
        sender_id: user._id,
        receiver_id: receiver_id,
      });

      //   sender: (Document<unknown, {}, IUser> & Omit<IUser & Required<{
      //     _id: string;
      // }>, never>) | null;
      // _id: Schema.Types.ObjectId;
      // type: "friend_request" | "team_invite";
      // sender_id: Schema.Types.ObjectId;
      // receiver_id: Schema.Types.ObjectId;
      // chatroom_id?: Schema.Types.ObjectId | undefined;
      // createdAt: Date;

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

      return chatroom;
    }),
});
