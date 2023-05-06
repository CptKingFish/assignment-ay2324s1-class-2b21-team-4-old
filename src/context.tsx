import React, { createContext } from "react";
import { type IUser } from "./models/User";
import { api } from "./utils/api";

interface AppContextType {
  user: IUser | undefined;
}

const AppContext = createContext<AppContextType>({} as AppContextType);

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { data: user } = api.user.getMe.useQuery();

  return <AppContext.Provider value={{ user }}>{children}</AppContext.Provider>;
}

export const useGlobalContext = () => {
  return React.useContext(AppContext);
};
