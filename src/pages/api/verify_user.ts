import { type NextApiRequest, type NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import User, { type IUser } from "@/models/User";
import { env } from "@/env.mjs";
import mongoose from "mongoose";

interface ExtendedNextApiRequest extends NextApiRequest {
  body: {
    token: string;
  };
}

export default async function handler(
  req: ExtendedNextApiRequest,
  res: NextApiResponse
) {
  await mongoose.connect(env.MONGO_URL, {});
  if (!req.body.token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }
  const decoded_token = jwt.verify(req.body.token, env.JWT_SECRET) as {
    user_id: string;
  };
  const user = (await User.findById(decoded_token.user_id).select(
    "-password"
  )) as IUser;
  if (!user) {
    return res.status(401).json({ message: "Invalid token" });
  }
  return res.status(200).json(user);
}
