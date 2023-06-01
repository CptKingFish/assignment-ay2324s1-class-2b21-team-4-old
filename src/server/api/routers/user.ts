import { z } from "zod";

import bcrypt from "bcryptjs";
import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import User, { IUser } from "@/models/User";
import jwt from "jsonwebtoken";
import { TRPCError } from "@trpc/server";
import { env } from "@/env.mjs";
import { redis } from "@/utils/redis";
import { cloudConfig } from "@/utils/cloudconfig";
import Chatroom from "@/models/Chatroom";

export const userRouter = createTRPCRouter({
  getMe: privateProcedure.query(({ ctx }) => {
    return ctx.user;
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
      const chatroom = await Chatroom.findOne({
        _id: input.chat_id,
      }).populate({
        path: "participants",
        model: User,
      });
      return chatroom?.participants as unknown as IUser[];
    }),
  changeOwnUsername: privateProcedure
    .input(
      z.object({
        username: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      //Throws TRPC error if username is empty
      if (!input.username) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Username is required",
        });
      }
      //Throws TRPC error if username is already taken
      if (await User.findOne({ username: input.username })) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Username is already taken",
        });
      }

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
      if (
        !input.email
          .toLowerCase()
          .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          )
      ) {
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
  changeProfilePicture: privateProcedure
    .input(z.object({ profilePic: z.string().url() }))
    .mutation(async ({ input, ctx }) => {
      const response = await User.findById(ctx.user._id);
      if (!response) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User not found",
        });
      }

      try {
        const promises = [input.profilePic].map(async (image) => {
          const result = await cloudConfig.uploader.upload(image, {
            upload_preset: "ml_default",
          });
          return result.secure_url;
        });
        const uploadResponse = await Promise.all(promises);

        // Delete the old profile picture from Cloudinary
        if (response.avatar) {
          await cloudConfig.uploader.destroy(response.avatar);
        }

        // Update the profile picture URL in the user document
        const updatedUser = await User.findByIdAndUpdate(
          ctx.user._id,
          {
            avatar: uploadResponse[0],
          },
          { new: true }
        );

        return updatedUser;
      } catch (error) {
        console.log(error);
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Error uploading profile picture",
        });
      }
    }),
  getAvatarUrl: publicProcedure
    .input(z.object({ user_id: z.string() }))
    .query(async ({ input }) => {
      if (!input.user_id) {
        return null;
      }
      try {
        return await User.findById(input.user_id).select("avatar");
      } catch (error) {
        console.log(error);
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Error getting user avatar",
        });
      }
    }),
  addFriend: privateProcedure
    .input(z.object({ friend_id: z.string(), chat_id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      try {
        return await User.findByIdAndUpdate(
          ctx.user._id,
          {
            $push: {
              friends: {
                friendID: input.friend_id,
                chatID: input.chat_id,
              },
            },
          },
          { new: true }
        );
      } catch (error) {
        console.log(error);
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Error adding friend",
        });
      }
    }),
  removeFriend: privateProcedure
    .input(z.object({ friend_id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      try {
        return await User.findByIdAndUpdate(
          ctx.user._id,
          {
            $pull: {
              friends: {
                friendID: input.friend_id,
              },
            },
          },
          { new: true }
        );
      } catch (error) {
        console.log(error);
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Error removing friend",
        });
      }
    }),
  logout: privateProcedure.mutation(({ ctx }) => {
    ctx.res.setHeader(
      "Set-Cookie",
      `token=;expires=${new Date(
        Date.now() - 1000 * 60 * 60 * 24
      ).toUTCString()};sameSite=Strict;path=/;secure`
    );
    return {
      message: "Logged out successfully!",
      code: "SUCCESS",
    };
  }),

  removeAvatar: privateProcedure.mutation(async ({ ctx }) => {
    const response = await User.findById(ctx.user._id);
    if (!response) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "User not found",
      });
    }
    if(!response.avatar) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "User has no avatar",
      });
    }
    try {
      await cloudConfig.uploader.destroy(response.avatar);
      const updatedUser = await User.findByIdAndUpdate(
        ctx.user._id,
        {
          avatar: null,
        },
        { new: true }
      );
      return updatedUser;
    } catch (error) {
      console.log(error);
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Error removing avatar",
      });
    }
  }),

  deleteUser: privateProcedure
  .input(z.object({ password: z.string() }))
  .mutation(async ({ input,ctx }) => {
    //If user password input is incorrect throw error
    const response = await User.findById(ctx.user._id);
    if (!response) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "User not found",
      });
    }
    const isPasswordValid = await bcrypt.compare(
      input.password,
      response.password
    );
    if (!isPasswordValid) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Invalid credentials",
      });
    }


    const promises = [];

    // Remove userid from redis
    promises.push(redis.srem("users", ctx.user._id));
    
    // Remove userid from chatroom array
    promises.push(
      Chatroom.updateMany({}, { $pull: { users: { user_id: ctx.user._id } } })
    );
    
    // If the chatroom has no users left, delete it
    promises.push(Chatroom.deleteMany({ users: { $size: 0 } }));
    
    // Delete user
    promises.push(User.findByIdAndDelete(ctx.user._id));
    
    await Promise.all(promises);
    
    
    //Invalidate the user's jwt token
    ctx.res.setHeader(
      "Set-Cookie",
      `token=;expires=${new Date(
        Date.now() - 1000 * 60 * 60 * 24
      ).toUTCString()};sameSite=Strict;path=/;secure`
    );

    return {
      message: "Deleted account successfully!",
      code: "SUCCESS",
    };
  }),



  // seedRedis: publicProcedure.mutation(async () => {
  //   // add all user_ids to redis
  //   console.log("herre");
  //   const users = await User.find({});
  //   for (const user of users) {
  //     await redis.sadd("users", user._id);
  //   }
  //   console.log("yayyy");
  // }),
});
