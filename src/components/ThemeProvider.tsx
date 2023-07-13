import React, { createContext, useEffect, useState } from 'react';
import { setCookie, parseCookies } from "nookies";

interface ThemeContextProps {
  theme: string;
  changeTheme: (newTheme: string) => void;
}

export const ThemeContext = createContext<ThemeContextProps>({
  theme: 'corporate',
  changeTheme: () => {},
});

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState('corporate');

  useEffect(() => {
    const cookies = parseCookies();
    setTheme(cookies.theme || 'corporate');
  }, []);

  const changeTheme = (newTheme: string) => {
    setTheme(newTheme);
    setCookie(null, 'theme', newTheme, {
      maxAge: 30 * 24 * 60 * 60,
      path: '/',
    });
  };

  const clientTheme = theme || 'corporate';

  return (
    <ThemeContext.Provider value={{ theme: clientTheme, changeTheme }}>
      <div data-theme={clientTheme}>{children}</div>
    </ThemeContext.Provider>
  );
};
