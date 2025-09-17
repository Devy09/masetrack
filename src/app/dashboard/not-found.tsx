import { NextPage } from "next";
import Head from "next/head";

const NotFound: NextPage = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <Head>
        <title>404 - Page Not Found</title>
      </Head>
      <h1 className="text-6xl font-bold">404</h1>
    </div>
  );
};

export default NotFound;
