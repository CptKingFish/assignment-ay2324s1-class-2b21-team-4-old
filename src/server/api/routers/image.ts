import { z } from "zod";
import Chatroom from "@/models/Chatroom";
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
          return result6.secure_url;
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
    postToDB: privateProcedure
    .input(
      z.object({
        images: z.array(z.string()),
        names: z.array(z.string()),
        img_id: z.string(),
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
        const img = await Chatroom.findById(input.img_id);
        if (!img) throw new TRPCError({ code: "BAD_REQUEST" });
        img.files = [...img.files, ...all_files];
        await img.save();
        return results;
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Something Went Wrong",
        });
      }
    }),
  deleteImageFrom: privateProcedure
    .input(
      z.object({
        image_id: z.string(),
      })
    )
    .mutation(async ({ input }) => {


      const img_id = input.image_id    

    try {
      await cloudConfig.uploader.destroy(img_id);

      const result = await File.deleteOne({
        _id: img_id
      });
      
      console.log( result )

      return result;
    } catch (error) {
      console.log(error)
    }})
})

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '5mb',
    },
  },
};
