import React, { createContext } from "react";
import { type IUser } from "./models/User";

interface AppContextType {
  user: IUser;
  setUser: React.Dispatch<React.SetStateAction<IUser>>;
}

const AppContext = createContext<AppContextType>({} as AppContextType);

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = React.useState<IUser>({} as IUser);

  return (
    <AppContext.Provider value={{ user, setUser }}>
      {children}
    </AppContext.Provider>
  );
}

export const useGlobalContext = () => {
  return React.useContext(AppContext);
};
