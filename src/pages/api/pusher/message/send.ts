import { pusherServer } from "@/utils/pusherConfig";
import type { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";
import { env } from "@/env.mjs";
import User from "@/models/User";
import { v4 as uuidv4 } from "uuid";

interface ExtendedNextApiRequest extends NextApiRequest {
  body: {
    user_id: string;
    channel: string;
    text: string;
  };
}

const handler = async (req: ExtendedNextApiRequest, res: NextApiResponse) => {
  console.log("message request received");

  mongoose.connect(env.MONGO_URL).catch((err) => console.log(err));
  const { user_id, channel, text } = req.body;
  try {
    // check friend?

    // check if in team?

    const timestamp = Date.now();

    const messageData: Message = {
      id: uuidv4(),
      senderId: user_id,
      text: text,
      timestamp: timestamp,
    };

    console.log(messageData);

    await pusherServer.trigger(channel, "incoming-message", {
      ...messageData,
    });
    return res.status(200).send("ok");
  } catch (error) {
    console.error(error);
  }
};

export default handler;
