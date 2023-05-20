//  key={notification._id.toString()}
//       notification_id={notification._id.toString()}
//       sender_username={notification.sender.username.toString()}
//       type={notification.type}
//       time={formatDate(notification.createdAt)}
//       avatarUrl={"https://source.unsplash.com/random/?city,night"}
//       handleRemoveNotification={handleRemoveNotification}

// import { pusherServer } from "@/utils/pusherConfig";
// import type { NextApiRequest, NextApiResponse } from "next";
// import mongoose, { ObjectId } from "mongoose";
// import { env } from "@/env.mjs";
// import User from "@/models/User";
// import Chatroom from "@/models/Chatroom";
// import { v4 as uuidv4 } from "uuid";
// import { Message } from "@/utils/chat";

// interface ExtendedNextApiRequest extends NextApiRequest {
//     body: {
//         user_id: string;
//         channel: string;
//         text: string;
//     };
// }

// const handler = async (req: ExtendedNextApiRequest, res: NextApiResponse) => {
