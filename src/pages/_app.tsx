import { type AppType } from "next/app";

import { api } from "@/utils/api";

import { ChakraProvider } from "@chakra-ui/react";
import "@/styles/globals.css";

const AppWrapper = ({ children }: { children: React.ReactNode }) => {
  // const { mode } = useGlobalContext();
  return <ChakraProvider>{children}</ChakraProvider>;
};

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <AppWrapper>
      <Component {...pageProps} />
    </AppWrapper>
  );
};

export default api.withTRPC(MyApp);
