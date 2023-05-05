import { useGlobalContext } from "@/context";
import { type NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import Authenticate from "./authenticate";

const Home: NextPage = () => {
  const { auth } = useGlobalContext();
  // const router = useRouter();
  // if (auth) {
  //   router.replace("/dashboard").catch(console.error);
  // } else {
  //   router.replace("/authenticate").catch(console.error);
  // }
  return (
    <>
      <Head>
        <title>Home</title>
      </Head>
    </>
  );
};


export default Home;
