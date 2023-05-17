import { z } from "zod";
import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { env } from "@/env.mjs";   
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

export const imageRouter = createTRPCRouter({
  uploadImage: privateProcedure
    .input(
      z.object({
        image: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      console.log(input, ctx)
      const { image } = input;
      const { user } = ctx;
     const res = await cloudinary.uploader
      .upload(image, { upload_preset: "ml_default" })
      .then(result=>console.log(result));
      return res
    }),
  getImage: privateProcedure
    .input(
      z.object({
        image_id: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { image_id } = input;
      const { user } = ctx;
      console.log(image_id);
      return image_id;
    }),
  deleteImage: privateProcedure
    .input(
      z.object({
        image_id: z.string(),
      })
    )

    .query(async ({ input, ctx }) => {
      const { image_id } = input;
      const { user } = ctx;
      console.log(image_id);
      return image_id;
    }),
});
