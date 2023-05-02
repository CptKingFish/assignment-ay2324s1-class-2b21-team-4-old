import { type NextPage } from "next";
import Head from "next/head";

import { useRouter } from "next/router";

const Home: NextPage = () => {
  const router = useRouter();

  router.replace("/dashboard").catch(console.error);

  return (
    <>
      <Head>
        <title>Home</title>
        <meta name="description" content="Project Quizzify" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main></main>
    </>
  );
};

export default Home;
