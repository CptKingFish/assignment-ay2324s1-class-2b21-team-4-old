import Pusher from 'pusher';


type PusherConfig = {
  appId: string;
  key: string;
  secret: string;
  cluster: string;
  useTLS?: boolean;
};

const config: PusherConfig = {
  appId: process.env.PUSHER_APP_ID || '' ,
  key: process.env.PUSHER_KEY || '',
  secret: process.env.PUSHER_SECRET ||  '',
  cluster: process.env.PUSHER_CLUSTER || '',
  useTLS: true,
};

const pusher = new Pusher(config)

export default pusher