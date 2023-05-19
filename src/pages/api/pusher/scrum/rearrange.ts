import { pusherServer as pusher } from "@/utils/pusherConfig";
import type { NextApiRequest, NextApiResponse } from "next";
interface ExtendedNextApiRequest extends NextApiRequest {
  body: {
    channel: string;
    user_id: string;
    source_status: string;
    destination_status: string;
    destination_index: number;
    source_index: number;
    task_id: string;
    name: string;
    avatar: string;
  };
}

const handler = async (req: ExtendedNextApiRequest, res: NextApiResponse) => {
  try {
    await pusher.trigger(req.body.channel, "rearrange", req.body);
    return res.status(200).send("ok");
  } catch (error) {
    console.error(error);
  }
};

export default handler;
