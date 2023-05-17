import { pusherServer } from "@/utils/pusherConfig";
import type { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";
import { env } from "@/env.mjs";
import User from "@/models/User";
interface ExtendedNextApiRequest extends NextApiRequest {
  body: {
    user_id: string;
    socket_id: string;
    channel_name: string;
  };
}

const handler = async (req: ExtendedNextApiRequest, res: NextApiResponse) => {
  console.log("authorization request received");

  mongoose.connect(env.MONGO_URL).catch((err) => console.log(err));

  const user = await User.findById(req.body.user_id).select("-password");
  if (!user) {
    return res.status(400).send("User not found");
  }

  const presenceData = {
    user_id: user._id.toString(),
    user_info: {
      email: user.email,
      username: user.username,
    },
  };
  try {
    const authResponse = pusherServer.authorizeChannel(
      req.body.socket_id,
      req.body.channel_name,
      presenceData
    );
    console.log("sending authorization");
    res.send(authResponse);
  } catch (error) {
    console.error(error);
  }
};

export default handler;
