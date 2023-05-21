import { useGlobalContext } from "@/context";
import { api } from "@/utils/api";
import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

const Home: NextPage = () => {
  const { user, isLoadingUser } = useGlobalContext();
  // const { mutate: seed } = api.user.seedRedis.useMutation();
  return (
    <>
      <Head>
        <title>Home</title>
      </Head>
      <div className="flex h-screen w-screen flex-col items-center justify-center gap-4">
        <h1 className="inline-block bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-6xl font-semibold text-transparent">
          Welcome to Swifty
        </h1>
        {isLoadingUser ? (
          <button className="btn">Loading...</button>
        ) : user ? (
          <Link className="btn-primary btn" href="/chat">
            Go to chat
          </Link>
        ) : (
          <Link className="btn-primary btn" href="/authenticate">
            Authenticate
          </Link>
        )}
      </div>
    </>
  );
};

export default Home;
