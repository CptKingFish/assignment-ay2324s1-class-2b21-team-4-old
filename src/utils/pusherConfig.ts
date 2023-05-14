import PusherServer from "pusher";
import PusherClient from "pusher-js";

// export const pusher = new Pusher({
//   appId: process.env.PUSHER_APP_ID || "",
//   key: process.env.PUSHER_KEY || "",
//   secret: process.env.PUSHER_SECRET || "",
//   cluster: process.env.PUSHER_CLUSTER || "",
//   useTLS: true,
// });

export const pusherServer = new PusherServer({
  appId: process.env.NEXT_PUBLIC_PUSHER_APP_ID || "",
  key: process.env.NEXT_PUBLIC_PUSHER_KEY || "",
  secret: process.env.PUSHER_SECRET || "",
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "",
  useTLS: true,
});

// export const pusherClient = new PusherClient(
//   process.env.NEXT_PUBLIC_PUSHER_KEY || "",
//   {
//     cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "",
//     authEndpoint: "/api/pusher/auth",
//     auth: {
//       params: {
//         user_id: "6455f7e7e64e1433ed9e8c94",
//       },
//     },
//   }
// );

export const pusherClientConstructor = (userId: string) => {
  return new PusherClient(process.env.NEXT_PUBLIC_PUSHER_KEY || "", {
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "",
    authEndpoint: "/api/pusher/auth",
    auth: {
      params: {
        user_id: userId,
      },
    },
  });
};
