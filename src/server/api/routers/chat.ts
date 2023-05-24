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
import { ChatRoom } from "@/utils/chat";

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

      const skipCount = 0; // Number of messages to skip
      const limitValue = 20; // Maximum number of messages to retrieve

      const chatroom_id_obj = new mongoose.Types.ObjectId(chatroom_id);

      const chatroom: ChatRoom = (
        await Chatroom.aggregate([
          { $match: { _id: chatroom_id_obj } },
          { $unwind: { path: "$messages", preserveNullAndEmptyArrays: true } },
          { $sort: { "messages.timestamp": -1 } },
          {
            $group: {
              _id: "$_id",
              name: { $first: "$name" },
              type: { $first: "$type" },
              participants: { $first: "$participants" },
              admins: { $first: "$admins" },
              messages: { $push: "$messages" },
            },
          },
          {
            $project: {
              name: 1,
              type: 1,
              participants: 1,
              admins: 1,
              messages: {
                $slice: [
                  { $cond: [{ $isArray: "$messages" }, "$messages", []] },
                  skipCount,
                  limitValue,
                ],
              },
            },
          },
        ]).exec()
      )[0] as unknown as ChatRoom;

      console.log("name", chatroom.name);
      console.log("messages", chatroom.messages[0]);

      if (!chatroom) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Chatroom not found",
        });
      }

      const participantIds = chatroom.participants.map((participant) =>
        participant.toString()
      );

      if (!participantIds.includes(user._id.toString())) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Unauthorized",
        });
      }

      chatroom.messages.reverse();

      // chatroom.messages.sort((a, b) => a.timestamp - b.timestamp);

      return chatroom;
    }),
  getMoreMessages: privateProcedure
    .input(
      z.object({
        chatroom_id: z.string(),
        skipCount: z.number(),
        limitValue: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { chatroom_id, skipCount, limitValue } = input;
      const { user } = ctx;

      console.log(chatroom_id, skipCount, limitValue);

      const chatroom_id_obj = new mongoose.Types.ObjectId(chatroom_id);

      // check if skip count has exceeded the number of messages in the chatroom
      // const numberOfMessages = await Chatroom.aggregate([
      //   { $match: { _id: chatroom_id_obj } },
      //   { $unwind: { path: "$messages", preserveNullAndEmptyArrays: true } },
      //   { $sort: { "messages.timestamp": -1 } },
      //   {
      //     $group: {
      //       _id: "$_id",
      //       messages: { $push: "$messages" },
      //     },
      //   },
      //   {
      //     $project: {
      //       messages: {
      //         $slice: [
      //           { $cond: [{ $isArray: "$messages" }, "$messages", []] },
      //           0,
      //           1,
      //         ],
      //       },
      //     },
      //   },
      // ]);

      // console.log("numberOfMessages", numberOfMessages[0].messages);

      // if (skipCount >= numberOfMessages.length) {
      //   throw new TRPCError({
      //     code: "BAD_REQUEST",
      //     message: "No more messages to retrieve",
      //   });
      // }

      const chatroom: ChatRoom = (
        await Chatroom.aggregate([
          { $match: { _id: chatroom_id_obj } },
          { $unwind: { path: "$messages", preserveNullAndEmptyArrays: true } },
          { $sort: { "messages.timestamp": -1 } },
          {
            $group: {
              _id: "$_id",
              messages: { $push: "$messages" },
            },
          },
          {
            $project: {
              messages: {
                $slice: [
                  { $cond: [{ $isArray: "$messages" }, "$messages", []] },
                  skipCount,
                  limitValue,
                ],
              },
            },
          },
        ]).exec()
      )[0] as unknown as ChatRoom;

      if (!chatroom) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Chatroom not found",
        });
      }

      // const participantIds = chatroom.participants.map((participant) =>
      //   participant.toString()
      // );

      // if (!participantIds.includes(user._id.toString())) {
      //   throw new TRPCError({
      //     code: "BAD_REQUEST",
      //     message: "Unauthorized",
      //   });
      // }

      chatroom.messages.reverse();

      // console.log("the new messages", chatroom.messages);

      return chatroom.messages;
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
        _id: { $in: participants },
      });

      console.log(foundParticipants);

      if (foundParticipants.length !== participants.length) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "One or more participants do not exist.",
        });
      }

      const chatroom = await Chatroom.create({
        name: chatroom_name,
        participants: [new mongoose.Types.ObjectId(user._id)],
        admins: [new mongoose.Types.ObjectId(user._id)],
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
      }).select("username avatar friends");
      return usernames;
    }),
  sendMessage: privateProcedure
    .input(
      z.object({
        _id: z.string(),
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
      const { _id, channel, text } = input;
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
        _id: new mongoose.Types.ObjectId(_id) as unknown as ObjectId,
        sender: {
          _id: new mongoose.Types.ObjectId(user._id) as unknown as ObjectId,
          username: user.username,
        },
        text: text,
        timestamp: timestamp,
        replyTo: input.replyTo,
      };

      console.log("messageData", messageData);
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
      type: "private",
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
  getFriendsNotInTeam: privateProcedure
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

      const friends = await Chatroom.find({
        participants: user._id,
        type: "private",
      }).select("participants");

      const friendsNotInTeam = friends
        .map((chatroom) => chatroom.participants)
        .flat()
        .filter(
          (friend_id) =>
            friend_id.toString() !== user._id.toString() &&
            !chatroom.participants.includes(friend_id)
        );

      const uniqueFriends = [
        ...new Set(friendsNotInTeam.map((friend) => friend.toString())),
      ];

      const friendsWithNames = await Promise.all(
        uniqueFriends.map(async (friend_id) => {
          return await User.findById(friend_id).select("username");
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
  leaveTeam: privateProcedure
    .input(
      z.object({
        chatroom_id: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
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

      if (chatroom.type !== "team") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This is not a team chatroom",
        });
      }

      chatroom.participants = chatroom.participants.filter(
        (participant_id) => participant_id.toString() !== user._id.toString()
      );

      await chatroom.save();

      return true;
    }),
  getAdminFromChatroom: privateProcedure
    .input(
      z.object({
        chatroom_id: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      try {
        return await Chatroom.findById(input.chatroom_id).select("admins");
      } catch (err) {
        return err;
      }
    }),
});
