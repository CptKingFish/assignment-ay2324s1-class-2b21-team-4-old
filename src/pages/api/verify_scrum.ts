import { type NextApiRequest, type NextApiResponse } from "next";
import { redis } from "@/utils/redis";

interface ExtendedNextApiRequest extends NextApiRequest {
  body: {
    room_id: string;
    user_id: string;
  };
}

export default async function handler(
  req: ExtendedNextApiRequest,
  res: NextApiResponse
) {
  try {
    const { room_id, user_id } = req.body;
    const all_users = await redis.smembers(`team:${user_id}`);
    if (all_users.includes(room_id)) {
      return res.status(200).json({ verified: true });
    }
    return res.status(200).json({ verified: false });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ verified: false });
  }
}
