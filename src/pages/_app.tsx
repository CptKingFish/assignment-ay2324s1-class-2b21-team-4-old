import { type AppType } from "next/app";

import { AuthProvider } from "@/context";

import { api } from "@/utils/api";

import { ChakraProvider } from "@chakra-ui/react";
import "@/styles/globals.css";

const AppWrapper = ({ children }: { children: React.ReactNode }) => {
  // const { mode } = useGlobalContext();
  return <ChakraProvider>{children}</ChakraProvider>;
};

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <AuthProvider>
      <ChakraProvider>
        <Component {...pageProps} />
      </ChakraProvider>
    </AuthProvider>
  );
};

export default api.withTRPC(MyApp);
