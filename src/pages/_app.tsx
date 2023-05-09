import { type AppType } from "next/app";
import { AuthProvider } from "@/context";
import { Toaster } from "react-hot-toast";
import React from "react";

import { api } from "@/utils/api";

import "@/styles/globals.css";
import { setCookie, deleteCookie } from "cookies-next";

const WrappedApp = ({ children }: { children: React.ReactNode }) => {
  React.useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setCookie("token", token, {
        // expire in 1 day
        expires: new Date(Date.now() + 86400),
      });
    } else {
      deleteCookie("token");
    }
  }, []);

  return <>{children}</>;
};

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <WrappedApp>
      <AuthProvider>
        <div data-theme="corporate">
          <Toaster />
          <Component {...pageProps} />
        </div>
      </AuthProvider>
    </WrappedApp>
  );
};

export default api.withTRPC(MyApp);
