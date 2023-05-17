import React, { createContext } from "react";
import { type IUser } from "./models/User";
import { api } from "./utils/api";
import { pusherClientConstructor } from "./utils/pusherConfig";
interface AppContextType {
  user: IUser | undefined;
  isLoadingUser: boolean;
  pusherClient: ReturnType<typeof pusherClientConstructor> | null;
}

const AppContext = createContext<AppContextType>({} as AppContextType);

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { data: user, isLoading: isLoadingUser } = api.user.getMe.useQuery(
    undefined,
    {
      retry: false,
      refetchOnWindowFocus: false,
      cacheTime: 0,
    }
  );

  const [pusherClient, setPusherClient] = React.useState<ReturnType<
    typeof pusherClientConstructor
  > | null>(null);

  React.useEffect(() => {
    if (!user) return;
    const pusherClient = pusherClientConstructor(user._id);
    pusherClient.signin();
    setPusherClient(pusherClient);
    // const channel = pusherClient.subscribe("private-" + user._id);
    // channel.bind("friend-request", (data: any) => {
    //   console.log("friend-request", data);
    //   toast.success(data.message);
    // });
    // channel.bind("friend-request-accepted", (data: any) => {
    //   console.log("friend-request-accepted", data);
    //   toast.success(data.message);
    // });
    // channel.bind("friend-request-declined", (data: any) => {
    //   console.log("friend-request-declined", data);
    //   toast.success(data.message);
    // });
    // channel.bind("friend-request-canceled", (data: any) => {
    //   console.log("friend-request-canceled", data);
    //   toast.success(data.message);
    // });

    return () => {
      // pusherClient.unsubscribe("private-" + user._id);
      pusherClient.disconnect();
    };
  }, [user]);

  return (
    <AppContext.Provider value={{ user, isLoadingUser, pusherClient }}>
      {children}
    </AppContext.Provider>
  );
}

export const useGlobalContext = () => {
  return React.useContext(AppContext);
};
