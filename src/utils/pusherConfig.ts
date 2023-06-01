import PusherServer from "pusher";
import PusherClient from "pusher-js";

export const pusherServer = new PusherServer({
  appId: process.env.NEXT_PUBLIC_PUSHER_APP_ID || "",
  key: process.env.NEXT_PUBLIC_PUSHER_KEY || "",
  secret: process.env.PUSHER_SECRET || "",
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "",
  useTLS: true,
});

export const pusherClientConstructor = (userId: string) => {
  return new PusherClient(process.env.NEXT_PUBLIC_PUSHER_KEY || "", {
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "",
    authEndpoint: "/api/pusher/auth",
    userAuthentication: {
      headers: {
        "Content-Type": "application/json",
      },
      params: {
        user_id: userId,
      },
      endpoint: "/api/pusher/user-auth",
      transport: "ajax",
    },

    auth: {
      params: {
        user_id: userId,
      },
    },
  });
};
