import React, { createContext, useContext } from "react";

interface AppContextType {
  auth: Auth | null;
  setAuth: (auth: Auth | null) => void;
}

interface Auth {
  id: number;
  name: string;
  email: string;
}

const AppContext = createContext<AppContextType>({
  auth: null,
  setAuth: () => {},
});

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [auth, setAuth] = React.useState<Auth | null>(null);

  return (
    <AppContext.Provider value={{ auth, setAuth }}>
      {children}
    </AppContext.Provider>
  );
}

export const useGlobalContext = () => {
  return React.useContext(AppContext);
};
