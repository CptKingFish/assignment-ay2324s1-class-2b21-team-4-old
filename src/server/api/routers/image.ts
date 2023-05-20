import { z } from "zod";
import Scrum from "@/models/Scrum";
import { createTRPCRouter, privateProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { cloudConfig } from "@/utils/cloudconfig";
import File from "@/models/File";
import { type IUser } from "@/models/User";

export const imageRouter = createTRPCRouter({
  uploadImages: privateProcedure
    .input(
      z.object({
        images: z.array(z.string()),
        names: z.array(z.string()),
        scrum_id: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const { images } = input;
        if (!images || images.length === 0)
          throw new Error("Images are required");

        const promises = images.map(async (image) => {
          const result = await cloudConfig.uploader.upload(image, {
            upload_preset: "ml_default",
          });
          return result.secure_url;
        });
        const results = await Promise.all(promises);
        const file_creation_promises = [];
        for (let i = 0; i < results.length; i++) {
          const result = results[i];
          const { names } = input;
          const name = names[i];
          file_creation_promises.push(
            File.create({
              name,
              url: result,
              user: ctx.user._id as unknown as IUser,
            })
          );
        }
        const all_files = await Promise.all(file_creation_promises);
        const scrum = await Scrum.findById(input.scrum_id);
        if (!scrum) throw new TRPCError({ code: "BAD_REQUEST" });
        scrum.files = [...scrum.files, ...all_files];
        await scrum.save();
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
    .query(({ input }) => {
      const { image_id } = input;
      console.log(image_id);
      return image_id;
    }),
  // getAllImages: privateProcedure.query(() => {
  //   try {
  //     const result = cloudConfig.api.resources({ type: "upload" });
  //     const images = result.resources.map((resource) => resource.secure_url);
  //     return images;
  //   } catch (error) {
  //     throw new TRPCError({
  //       code: "INTERNAL_SERVER_ERROR",
  //       message: "Failed to fetch images",
  //     });
  //   }
  // }),
  deleteImage: privateProcedure
    .input(
      z.object({
        image_id: z.string(),
      })
    )
    .query(({ input }) => {
      const { image_id } = input;
      console.log(image_id);
      return image_id;
    }),
});
