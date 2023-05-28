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
import Scrum from "@/models/Scrum";
import { redis } from "@/utils/redis";
import { cloudConfig } from "@/utils/cloudconfig";

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
      const limitValue = 50; // Maximum number of messages to retrieve

      const chatroom_id_obj = new mongoose.Types.ObjectId(chatroom_id);

      const chatroom: ChatRoom = (
        await Chatroom.aggregate([
          { $match: { _id: chatroom_id_obj } },
          { $unwind: { path: "$messages", preserveNullAndEmptyArrays: true } },
          { $sort: { "messages.timestamp": -1 } },
          {
            $group: {
              _id: "$_id",
              avatarUrl: { $first: "$avatarUrl" },
              name: { $first: "$name" },
              type: { $first: "$type" },
              participants: { $first: "$participants" },
              admins: { $first: "$admins" },
              messages: { $push: "$messages" },
            },
          },          
          {
            $project: {
              avatarUrl: 1,
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
      const numberOfMessages = await Chatroom.aggregate([
        { $match: { _id: chatroom_id_obj } },
        {
          $project: {
            numberOfMessages: {
              $cond: {
                if: { $isArray: "$messages" },
                then: { $size: "$messages" },
                else: "NA",
              },
            },
          },
        },
      ]).exec();

      console.log("numberOfMessages", numberOfMessages);

      // check if numberOfMessages[0].numberOfMessages is not undefined

      if (!numberOfMessages[0]) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Chatroom not found",
        });
      }

      if (
        numberOfMessages[0].numberOfMessages === undefined ||
        numberOfMessages[0].numberOfMessages === null
      ) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Chatroom not found",
        });
      }

      // check if skipCount is greater than or equal to numberOfMessages[0].numberOfMessages

      if (skipCount >= numberOfMessages[0].numberOfMessages) {
        return [];
      }

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

      await Promise.all([
        Scrum.create({
          chat_id: chatroom._id,
        }),
        ...participants.map(async (participant_id) => {
          return redis.sadd("team:" + participant_id, chatroom._id.toString());
        }),
        redis.sadd("team:" + user._id, chatroom._id.toString()),
      ]);

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
        }).select("username avatar");
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
  deleteMessage: privateProcedure
    .input(
      z.object({
        message_id: z.string(),
        chatroom_id: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { message_id, chatroom_id } = input;
      const { user } = ctx;

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

      const messageIndex = chatroom.messages.findIndex(
        (message) => message._id.toString() === message_id
      );

      if (messageIndex === -1) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Message not found",
        });
      }

      if (!chatroom.messages[messageIndex]) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Message already deleted",
        });
      }

      const message = chatroom.messages[messageIndex];

      if (message === undefined) return;

      if (message.sender._id.toString() !== user._id.toString()) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Unauthorized",
        });
      }

      if (message.deleted) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Message already deleted",
        });
      }

      message.deleted = true;
      message.text = "This message has been deleted.";

      await chatroom.save();
      await pusherServer.trigger(`presence-${chatroom_id}`, "message-deleted", {
        message_id: message_id,
      });
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

      //Delete object containing friendID and chatID from friends array in user

      await User.updateOne(
        { _id: user._id },
        { $pull: { friends: { friendID: friend_id } } }
      );

      await User.updateOne(
        { _id: friend_id },
        { $pull: { friends: { friendID: user._id } } }
      ); 

      await Chatroom.deleteOne({
        participants: { $all: [user._id, friend_id] },
        type: "private",
      });

      await pusherServer.trigger(
        `presence-${chatroom._id.toString()}`,
        "chatroom-deleted",
        null
      );
      await pusherServer.sendToUser(friend_id, "friend-removed", null);

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

      const messageData = {
        hasReplyTo: false,
        _id: new mongoose.Types.ObjectId() as unknown as ObjectId,
        sender: {
          _id: new mongoose.Types.ObjectId(user._id) as unknown as ObjectId,
          username: user.username,
        },
        text: `${user.username} has left the team`,
        data_type: "status",
        timestamp: Date.now(),
      };

      chatroom.messages.push(messageData);

      await chatroom.save();

      await pusherServer.trigger(
        `presence-${chatroom._id.toString()}`,
        "user-left",
        messageData
      );

      if (chatroom.participants.length === 0) {
        await Chatroom.deleteOne({ _id: chatroom._id });
      }

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
  addAdminToChatroom: privateProcedure
    .input(
      z.object({
        chatroom_id: z.string(),
        admin_id: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { chatroom_id, admin_id } = input;
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

      if (!chatroom.admins.includes(user._id)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You are not an admin",
        });
      }

      if (chatroom.admins.includes(admin_id)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User is already an admin",
        });
      }

      chatroom.admins.push(admin_id);

      await chatroom.save();

      return true;
    }),
  removeAdminFromChatroom: privateProcedure
    .input(
      z.object({
        chatroom_id: z.string(),
        admin_id: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { chatroom_id, admin_id } = input;
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

      if (!chatroom.admins.includes(user._id)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You are not an admin",
        });
      }

      if (!chatroom.admins.includes(admin_id)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User is not an admin",
        });
      }

      chatroom.admins = chatroom.admins.filter(
        (admin) => admin.toString() !== admin_id.toString()
      );

      await chatroom.save();

      return true;
    }),
  removeParticipantFromChatroom: privateProcedure
    .input(
      z.object({
        chatroom_id: z.string(),
        participant_id: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { chatroom_id, participant_id } = input;
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

      if (!chatroom.admins.includes(user._id)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You are not an admin",
        });
      }

      if (!chatroom.participants.includes(participant_id)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User is not a participant",
        });
      }

      chatroom.participants = chatroom.participants.filter(
        (participant) => participant.toString() !== participant_id.toString()
      );

      const participant = await User.findById(participant_id);

      const messageData = {
        hasReplyTo: false,
        _id: new mongoose.Types.ObjectId() as unknown as ObjectId,
        sender: {
          _id: new mongoose.Types.ObjectId(user._id) as unknown as ObjectId,
          username: user.username,
        },
        text: `${participant?.username} has been kicked from the team`,
        data_type: "status",
        timestamp: Date.now(),
      };

      chatroom.messages.push(messageData);

      await chatroom.save();

      await pusherServer.trigger(
        `presence-${chatroom._id.toString()}`,
        "user-left",
        messageData
      );

      return true;
    }),
  changeChatroomName: privateProcedure
    .input(
      z.object({
        chatroom_id: z.string(),
        chatroom_name: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { chatroom_id, chatroom_name } = input;
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

      if (!chatroom.admins.includes(user._id)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You are not an admin",
        });
      }

      chatroom.name = chatroom_name;

      await chatroom.save();

      return true;
    }),
  changeGroupIcon: privateProcedure
    .input(z.object({ chatRoomID: z.string(), groupIcon: z.string().url() }))
    .mutation(async ({ input }) => {
      const response = await Chatroom.findById(input.chatRoomID);
      if (!response) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User not found",
        });
      }

      try {
        const promises = [input.groupIcon].map(async (image) => {
          const result = await cloudConfig.uploader.upload(image, {
            upload_preset: "ml_default",
          });
          return result.secure_url;
        });
        const uploadResponse = await Promise.all(promises);

        // Delete the old group icon from Cloudinary
        if (response.avatarUrl) {
          await cloudConfig.uploader.destroy(response.avatarUrl);
        }

        // Update the Group Icon URL in the user document
        const updatedChatroom = await Chatroom.findByIdAndUpdate(
          input.chatRoomID,
          {
            avatarUrl: uploadResponse[0],
          },
          { new: true }
        );
        return updatedChatroom;
      } catch (error) {
        console.log(error);
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Error uploading Group Icon",
        });
      }
    }),
});
