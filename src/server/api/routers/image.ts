import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { cloudConfig } from "@/utils/cloudconfig";

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
        if (!images || images.length === 0)
          throw new Error("Images are required");

        const promises = images.map(async (image) => {
          const result = await cloudConfig.uploader.upload(image);
          return result.secure_url;
        });
        const results = await Promise.all(promises);
        return results;
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Something Went Wrong",
        });
      }
    }),
    getSingleImage: privateProcedure
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
    getAllImages: privateProcedure
    .query(() => {
      try {
        const result = cloudConfig.api.resources({ type: "upload" });
        const images = result.resources.map((resource) => resource.secure_url);
        return images;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch images",
        });
      }
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
