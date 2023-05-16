import { type AppType } from "next/app";
import { AuthProvider } from "@/context";
import { Toaster } from "react-hot-toast";
import { useRouter } from "next/router";
import React from "react";

import { api } from "@/utils/api";

import "@/styles/globals.css";
import { setCookie, deleteCookie } from "cookies-next";
import SideBarNav from "@/components/SideBarNav";

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

const isPageWithSidebar = (pathname: string) => {
  const pagesWithSidebar = [
    "/chat",
    "/scrum/[id]",
    "/teamchat/[id]",
    "/teamchat",
    "/privatechat/[id]",
    "/privatechat",
  ];
  return pagesWithSidebar.includes(pathname);
};

const SidebarWrapper = ({
  children,
  pathname,
}: {
  children: React.ReactNode;
  pathname: string;
}) => {
  if (isPageWithSidebar(pathname)) {
    return <SideBarNav>{children}</SideBarNav>;
  }
  return <>{children}</>;
};

const MyApp: AppType = ({ Component, pageProps }) => {
  const router = useRouter();

  return (
    <WrappedApp>
      <AuthProvider>
        <div data-theme="corporate">
          <SidebarWrapper pathname={router.pathname}>
            <Toaster />
            <Component {...pageProps} />
          </SidebarWrapper>
        </div>
      </AuthProvider>
    </WrappedApp>
  );
};

export default api.withTRPC(MyApp);
