import { z } from "zod";
import {
  createTRPCRouter,
  privateProcedure,
} from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const imageRouter = createTRPCRouter({
  uploadImages: privateProcedure
    .input(
      z.object({
        images: z.array(z.string()),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const { images } = input;
        const promises = images.map(async (image) => {
          const result = await cloudConfig.uploader.upload(image, {
            upload_preset: "ml_default",
          });
          return result.secure_url;
        });
        const results = await Promise.all(promises);
        return results;
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Images are required",
        });
      }
    }),
  getImage: privateProcedure
    .input(
      z.object({
        image_id: z.string(),
      })
    )
    .query(({ input, ctx }) => {
      const { image_id } = input;
      console.log(image_id);
      return image_id;
    }),
  deleteImage: privateProcedure
    .input(
      z.object({
        image_id: z.string(),
      })
    )
    .query(({ input, ctx }) => {
      const { image_id } = input;
      console.log(image_id);
      return image_id;
    }),
});
