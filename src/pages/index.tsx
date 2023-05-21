import { useGlobalContext } from "@/context";
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

      <div className="flex h-screen w-screen flex-col items-center justify-center gap-4 bg-[#111827]">
        <div className="background">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <h1
          className="z-[3]
            inline-block text-4xl
            font-black
            md:text-6xl lg:text-7xl"
        >
          <span className="inline-block bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
            Project Swifty
          </span>{" "}
          <span
            className="animate-bounce align-super text-[.5em] font-semibold text-black
              dark:text-white"
          >
            ADES
          </span>
        </h1>
        <h2
          className="z-[2] max-w-md text-center text-2xl font-bold text-white
            md:text-3xl
            lg:max-w-2xl lg:text-5xl"
        >
          Unlocking Developer Potential; Where{" "}
          <span className="decoration-3 underline decoration-purple-500 decoration-dashed underline-offset-2">
            Innovation Meets Conversation.
          </span>{" "}
        </h2>
        <p
          className="text mt-4 inline-flex max-w-[500px] text-center
            text-white opacity-90 lg:max-w-[600px] lg:text-xl"
        >
          Say goodbye to outdated chat solutions and welcome a game-changing
          experience. Our developer-centric ChatApp redefines the way you
          communicate and collaborate. Gone are the days of manual project
          management. With our innovative approach, we bring you a seamless chat
          experience that eliminates async-spaghetti nightmares.
        </p>
        {isLoadingUser ? (
          <button className="btn z-[3] rounded-md">Loading...</button>
        ) : user ? (
          <Link className="btn-primary btn z-[3] rounded-md" href="/chat">
            Go to chat
          </Link>
        ) : (
          <Link
            className="btn-primary btn z-[3] rounded-md"
            href="/authenticate"
          >
            Authenticate
          </Link>
        )}
      </div>
    </>
  );
};

export default Home;
