import { type AppType } from "next/app";
import { AuthProvider } from "@/context";
import { Toaster } from "react-hot-toast";

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
      <div data-theme="corporate">
        <Toaster />
        <Component {...pageProps} />
      </div>
    </AuthProvider>
  );
};

export default api.withTRPC(MyApp);
