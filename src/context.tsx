import React, { createContext } from "react";
import { type IUser } from "./models/User";
import { api } from "./utils/api";
import { pusherClientConstructor } from "./utils/pusherConfig";
import { WatchListEventProps } from "./utils/chat";
import { set } from "mongoose";
interface AppContextType {
  user: IUser | undefined;
  isLoadingUser: boolean;
  pusherClient: ReturnType<typeof pusherClientConstructor> | null;
  // watchlistEvent: WatchListEventProps | undefined;
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

  const [watchlistEvent, setWatchlistEvent] =
    React.useState<WatchListEventProps>();

  // const [onlineWatchList, setOnlineWatchlist] = React.useState<string[]>([]);
  // const [offlineWatchList, setOfflineWatchlist] = React.useState<string[]>([]);

  const [watchlistStatus, setWatchlistStatus] = React.useState<{
    [key: string]: boolean;
  }>({});

  // const [onlineWatchlistEvent, setOnlineWatchlistEvent] =
  //   React.useState<WatchListEventProps>();

  // const [offlineWatchlistEvent, setOfflineWatchlistEvent] =
  //   React.useState<WatchListEventProps>();

  React.useEffect(() => {
    if (!user) return;
    const pusherClient = pusherClientConstructor(user._id);
    pusherClient.signin();
    setPusherClient(pusherClient);

    const watchlistEventHandler = (event: WatchListEventProps) => {
      console.log("event", event);

      setWatchlistStatus((prev) => {
        const newStatus = { ...prev };

        event.user_ids.forEach((userId) => {
          newStatus[userId] = event.name === "online";
        });

        return newStatus;
      });

      // const newStatus = { ...watchlistStatus };

      // event.user_ids.forEach((userId) => {
      //   newStatus[userId] = event.name === "online";
      // });

      // console.log("newStatus", newStatus);

      // setWatchlistStatus((prev) => {
      //   console.log("prev", prev);

      //   return { ...newStatus };
      // });

      // console.log("newStatuslol", newStatus);
      console.log("newStatus1", watchlistStatus);

      // if (event.name === "online") {
      //   const nowOnlineUsers = event.user_ids;
      //   setOnlineWatchlist((prev) => {
      //     const newOnlineUsers = [...prev, ...nowOnlineUsers];
      //     const newOnlineUsersUnique = [...new Set(newOnlineUsers)];
      //     return newOnlineUsersUnique;
      //   });

      //   const nowOfflineUsers = offlineWatchList;
      //   const newOfflineUsers = nowOfflineUsers.filter(
      //     (userId) => !nowOnlineUsers.includes(userId)
      //   );
      //   setOfflineWatchlist(newOfflineUsers);
      //   // setOnlineWatchlistEvent();
      // }

      // if (event.name === "offline") {
      //   const nowOfflineUsers = event.user_ids;
      //   setOfflineWatchlist((prev) => {
      //     const newOfflineUsers = [...prev, ...nowOfflineUsers];
      //     const newOfflineUsersUnique = [...new Set(newOfflineUsers)];
      //     return newOfflineUsersUnique;
      //   });

      //   const nowOnlineUsers = onlineWatchList;
      //   const newOnlineUsers = nowOnlineUsers.filter(
      //     (userId) => !nowOfflineUsers.includes(userId)
      //   );
      //   setOnlineWatchlist(newOnlineUsers);

      //   // setOfflineWatchlistEvent();
      // }
      setWatchlistEvent(event);
    };

    pusherClient.user.watchlist.bind("online", watchlistEventHandler);
    pusherClient.user.watchlist.bind("offline", watchlistEventHandler);

    return () => {
      // pusherClient.unsubscribe("private-" + user._id);
      pusherClient.disconnect();
    };
  }, [user]);

  console.log("watchlistStatus", watchlistStatus);

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
