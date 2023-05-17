import { z } from "zod";
import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { v2 as cloudinary } from "cloudinary";

export const imageRouter = createTRPCRouter({
  uploadImage: privateProcedure
    .input(
      z.object({
        image: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const { image } = input;
        const res = await cloudinary.uploader
          .upload(image, { upload_preset: "ml_default" })
          .then((result) => console.log(result));
        return res;
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "image is required",
        });
      }
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
