import React, { createContext } from "react";
import { type IUser } from "./models/User";
import { api } from "./utils/api";
import { pusherClientConstructor } from "./utils/pusherConfig";
import { WatchListEventProps } from "./utils/chat";
interface AppContextType {
  user: IUser | undefined;
  isLoadingUser: boolean;
  pusherClient: ReturnType<typeof pusherClientConstructor> | null;
  watchlistStatus: { [key: string]: boolean };
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

  const [watchlistStatus, setWatchlistStatus] = React.useState<{
    [key: string]: boolean;
  }>({});

  React.useEffect(() => {
    if (!user) return;
    const pusherClient = pusherClientConstructor(user._id);
    pusherClient.signin();
    setPusherClient(pusherClient);

    const watchlistEventHandler = (event: WatchListEventProps) => {
      setWatchlistStatus((prev) => {
        const newStatus = { ...prev };

        event.user_ids.forEach((userId) => {
          newStatus[userId] = event.name === "online";
        });

        return newStatus;
      });
    };

    pusherClient.user.watchlist.bind("online", watchlistEventHandler);
    pusherClient.user.watchlist.bind("offline", watchlistEventHandler);

    return () => {
      pusherClient.disconnect();
    };
  }, [user]);

  console.log("context rerender");

  return (
    <AppContext.Provider
      value={{ user, isLoadingUser, pusherClient, watchlistStatus }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useGlobalContext = () => {
  return React.useContext(AppContext);
};
