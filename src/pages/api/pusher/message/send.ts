// import { pusherServer } from "@/utils/pusherConfig";
// import type { NextApiRequest, NextApiResponse } from "next";
// import mongoose, { ObjectId } from "mongoose";
// import { env } from "@/env.mjs";
// import User from "@/models/User";
// import Chatroom from "@/models/Chatroom";
// import { v4 as uuidv4 } from "uuid";
// import { Message } from "@/utils/chat";

// interface ExtendedNextApiRequest extends NextApiRequest {
//   body: {
//     user_id: string;
//     channel: string;
//     text: string;
//   };
// }

// const handler = async (req: ExtendedNextApiRequest, res: NextApiResponse) => {
//   console.log("message request received");

//   mongoose.connect(env.MONGO_URL).catch((err) => console.log(err));

//   const { user_id, channel, text } = req.body;
//   const chatroom_id = channel.split("-")[1];
//   try {
//     const user = await User.findById(user_id);

//     if (!user) return res.status(404).send("user not found");

//     const chatroom = await Chatroom.findById(chatroom_id);

//     if (!chatroom) return res.status(404).send("chatroom not found");

//     if (!chatroom.participants.includes(user_id))
//       return res.status(401).send("unauthorized");

//     // const senderData = {
//     //   id: user._id,
//     //   username: user.username,
//     // };

//     const timestamp = Date.now();

//     const messageData: Message = {
//       _id: new mongoose.Types.ObjectId() as unknown as ObjectId,
//       sender: {
//         _id: new mongoose.Types.ObjectId(user._id) as unknown as ObjectId,
//         username: user.username,
//       },
//       text: text,
//       timestamp: timestamp,
//     };

//     console.log(messageData);

//     const result = await pusherServer.trigger(channel, "incoming-message", {
//       ...messageData,
//       // sender: senderData,
//     });

//     console.log(result);

//     chatroom.messages.push(messageData);

//     await chatroom.save();

//     return res.status(200).send("ok");
//   } catch (error) {
//     console.error(error);
//   }
// };

// export default handler;
