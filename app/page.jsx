import Feed from "@components/Feed";

const Home = () => {
  return (
    <section className="w-full flex-center flex-col">
      <h1 className="head_text text-center">
        Discover, Create & Share
        <br className="max md:hidden" />
        <span className="orange_gradient text-center"> AI Prompts</span>
      </h1>
      <p className="desc text-center">
        Prompt-Pedia is a tool to discover, create and share AI prompts.
      </p>

      <Feed />
    </section>
  );
};

export default Home;
