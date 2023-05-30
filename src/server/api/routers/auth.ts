import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { env } from "@/env.mjs";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { redis } from "@/utils/redis";
import { registerHtml } from "@/html/register";
import { passwordHtml } from "@/html/password";


const sendEmail = async (email:string, subject: string, html: string) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: env.NODEMAIL_EMAIL,
        pass: env.NODEMAIL_PW,
      },
      tls: {
        rejectUnauthorized: false,
      }
    });

    const mailOptions = {
      from: "SwiftMe <projectswift36@gmail.com>",
      to: email,
      subject: subject,
      html: html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(info);
    return info;
  } catch (err) {
    console.log("nodemailer", err);
    throw err;
  }
}
  

export const authRouter = createTRPCRouter({
  register: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        username: z.string(),
        password: z.string().min(8),
      })
    )
    .mutation(async ({ input }) => {
      let user = await User.findOne({
        email: input.email.toLowerCase(),
      }).select("-password");
      if (user) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User already exists",
        });
      }
      if (input.email.toLowerCase().includes("+")) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Don't use an email alias!",
        });
      }
      const hashedPassword = await bcrypt.hash(input.password, 12);
      user = await User.create({
        email: input.email.toLowerCase(),
        username: input.username,
        displayName: input.username,
        password: hashedPassword,
        isEmailVerified: false,
      });
      await redis.sadd("users", user._id);
      const token = jwt.sign({ user_id: user._id }, env.JWT_SECRET, {
        expiresIn: "1d",
      });
      await sendEmail(
        input.email.toLowerCase(),
        "Verify your email",
        registerHtml(token)
      );
      return {
        token,
        message:
          "Please check your inbox to verify your account! If you do not see the email in a few minutes, check your “junk mail” folder or “spam” folder.",
        code: "SUCCESS",
      };
    }),
  login: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(8),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const user = await User.findOne({
        email: input.email.toLowerCase(),
      });
      if (!user) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid credentials",
        });
      }

      if(!user.isEmailVerified) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Please verify your email!",
        });
      }

      const isPasswordValid = await bcrypt.compare(
        input.password,
        user.password
      );
      if (!isPasswordValid) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid credentials",
        });
      }

      
      const token = jwt.sign({ user_id: user._id }, env.JWT_SECRET, {
        expiresIn: "1d",
      });
      ctx.res.setHeader(
        "Set-Cookie",
        `token=${token};expires=${new Date(
          Date.now() + 1000 * 60 * 60 * 24
        ).toUTCString()};sameSite=Strict;path=/;secure`
      );
      return {
        token,
        message: "Logged in successfully!",
        code: "SUCCESS",
      };
    }),
    sendRequestPasswordEmail: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
      })
    )
    .mutation(async ({ input }) => {
      const user = await User.findOne({
        email: input.email.toLowerCase(),
      }).select("-password");
      if (!user) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Email not found!",
        });
      }
      const token = jwt.sign({ user_id: user._id }, env.JWT_SECRET, {
        expiresIn: "1h",
      });
      await sendEmail(
        input.email.toLowerCase(),
        "Reset your Password",
        passwordHtml(token)
      );
      return {
        message:
          "Email sent successfully! If you do not see the email in a few minutes, check your “junk mail” folder or “spam” folder.",
        code: "SUCCESS",
      };
    }),
  resendVerificationEmail: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
      })
    )
    .mutation(async ({ input }) => {
      const user = await User.findOne({
        email: input.email.toLowerCase(),
      }).select("-password");
      if (!user) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Email not found!",
        });
      }
      if (user.isEmailVerified) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Email already verified",
        });
      }
      const token = jwt.sign({ user_id: user._id }, env.JWT_SECRET, {
        expiresIn: "7d",
      });
      await sendEmail(
        input.email.toLowerCase(),
        "Verify your email",
        registerHtml(token)
    );
      return {
        message:
          "Email sent successfully! If you do not see the email in a few minutes, check your “junk mail” folder or “spam” folder.",
        code: "SUCCESS",
      };
    }), 
  resetPassword: publicProcedure
    .input(
      z.object({
        token: z.string(),
        password: z.string().min(8),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const decodedToken = jwt.verify(input.token, env.JWT_SECRET) as {
          user_id: string;
        };
        const user = await User.findById(decodedToken.user_id);
        if (!user) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "User not found",
          });
        }
        const hashedPassword = await bcrypt.hash(input.password, 12);
        user.password = hashedPassword;
        await user.save();
        return { message: "Password reset successfully!", code: "SUCCESS" };
      } catch (err) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: err as string,
        });
      }
    }),
    verifyEmail: publicProcedure
    .input(
      z.object({
        token : z.string(),
      })
    )
    .mutation(async ({ input }) => {


        const decodedToken = jwt.verify(input.token, env.JWT_SECRET) as {
          user_id: string;
        };

      const user = await User.findOne({_id: decodedToken.user_id}).select("-password");
      
      if (!user) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Email not found!",
        });
      }
      if (user.isEmailVerified) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Email already verified",
        });
      }
      user.isEmailVerified = true;
      await user.save();
      return {
        message: "Email verified successfully!",
        code: "SUCCESS",
      };
})

})