import type { NextPage } from "next";

import { Layout } from "../components/Layout";
import { Main } from "../components/Main";
import { SEO } from "../components/SEO";

const Home: NextPage = () => {
  return (
    <>
      <SEO />
      <Layout>
        <Main />
      </Layout>
    </>
  );
};

export default Home;
