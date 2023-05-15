import React, { createContext } from "react";
import { type IUser } from "./models/User";
import { api } from "./utils/api";

interface AppContextType {
  user: IUser | undefined;
  isLoadingUser: boolean;
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

  return (
    <AppContext.Provider value={{ user, isLoadingUser }}>
      {children}
    </AppContext.Provider>
  );
}

export const useGlobalContext = () => {
  return React.useContext(AppContext);
};
