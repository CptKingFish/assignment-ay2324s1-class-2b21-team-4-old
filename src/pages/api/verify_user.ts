import { type NextApiRequest, type NextApiResponse } from "next";
import { redis } from "@/utils/redis";
import jwt from "jsonwebtoken";
import { env } from "@/env.mjs";

interface ExtendedNextApiRequest extends NextApiRequest {
  body: {
    token: string;
  };
}

export default async function handler(
  req: ExtendedNextApiRequest,
  res: NextApiResponse
) {
  try {
    const { token } = req.body;
    const decoded = jwt.verify(token, env.JWT_SECRET) as { user_id: string };
    const user_id = decoded.user_id;
    const all_users = await redis.smembers("users");
    if (all_users.includes(user_id)) {
      return res.status(200).json({ verified: true });
    }
    return res.status(200).json({ verified: false });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ verified: false });
  }
}
