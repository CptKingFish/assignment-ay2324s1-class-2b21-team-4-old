import React, { createContext, useState } from 'react';

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
    const [dataTheme, setDataTheme] = useState('corporate');
  
    React.useEffect(() => {
      setDataTheme(theme);
    }, [theme]);
  
    const changeTheme = (newTheme: string) => {
      setTheme(newTheme);
    };
  
    return (
      <ThemeContext.Provider value={{ theme, changeTheme }}>
        <div data-theme={dataTheme}>
          {children}
        </div>
      </ThemeContext.Provider>
    );
  };
  