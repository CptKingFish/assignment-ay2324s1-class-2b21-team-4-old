import { pusherServer } from "@/utils/pusherConfig";
import type { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";
import { env } from "@/env.mjs";
import User from "@/models/User";
import Chatroom from "@/models/Chatroom";
interface ExtendedNextApiRequest extends NextApiRequest {
  body: {
    user_id: string;
    socket_id: string;
    channel_name: string;
  };
}

const handler = async (req: ExtendedNextApiRequest, res: NextApiResponse) => {
  console.log("authentication request received");

  mongoose.connect(env.MONGO_URL).catch((err) => console.log(err));

  // parse the user_id from the request body
  const reqParams = Object.fromEntries(new URLSearchParams(req.body));

  if (!reqParams.user_id) {
    return res.status(400).send("User not found");
  }

  if (!reqParams.socket_id) {
    return res.status(400).send("Socket ID not found");
  }

  const userData = await User.findById(reqParams.user_id).select("-password");
  if (!userData) {
    return res.status(400).send("User not found");
  }

  // get all the users the user is chatting with
  const chatrooms = await Chatroom.find({
    participants: { $in: [reqParams.user_id] },
  }).select("participants");

  // retrieve all unique users from the chatrooms and make every userid strings
  const watchlist: string[] = Array.from(
    new Set(
      chatrooms
        .map((chatroom) => chatroom.participants)
        .flat()
        .map((participant) => participant.toString())
    )
  );

  const socketId = reqParams.socket_id;
  const user = {
    id: userData._id.toString(),
    user_info: {
      email: userData.email,
      username: userData.username,
    },
    watchlist: watchlist,
  };
  try {
    const authResponse = pusherServer.authenticateUser(socketId, user);
    console.log("authen ", authResponse);

    res.send(authResponse);
  } catch (error) {
    console.error(error);
  }
};

export default handler;
