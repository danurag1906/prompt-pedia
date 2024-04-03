"use client";
import Feed from "@components/Feed";
import { useMainContext } from "@context/MainContext";

const Home = () => {
  const { user } = useMainContext();
  return (
    <section className="w-full flex-center flex-col">
      <h1 className="head_text text-center">
        Discover, Create & Share
        <br className="max md:hidden" />
        <span className="orange_gradient text-center"> Prompts</span>
      </h1>
      {!user && (
        <p className="desc text-center">
          SignIn to create, like and bookmark prompts.
        </p>
      )}

      <Feed />
    </section>
  );
};

export default Home;
