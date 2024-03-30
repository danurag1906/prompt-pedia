"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";

const SinglePrompt = () => {
  const [prompt, setPrompt] = useState({
    promptText: "",
    result: "",
    tagLine: "",
  });
  const searchParams = useSearchParams();
  const promptId = searchParams.get("id");
  const profileUsername = searchParams.get("pun");
  // console.log(promptId, "promptId");

  useEffect(() => {
    const getPromptDetails = async () => {
      const response = await fetch(`/api/prompt/${promptId}`);
      const data = await response.json();
      setPrompt({
        promptText: data.promptText,
        result: data.result,
        tagLine: data.tagLine,
      });
    };
    if (promptId) {
      getPromptDetails();
    }
  }, [promptId]);

  // console.log(prompt, "prompt");

  return (
    <section className="w-full mx-4 my-8">
      <div className="flex  flex-col gap-7 prompt_card_full">
        <h1 className="text-3xl font-bold font-satoshi text-left blue_gradient">
          {profileUsername}'s prompt
        </h1>
        <h1 className="text-xl font-bold font-satoshi my-2">
          {prompt.promptText}
        </h1>
        <p
          className="text-lg font-satoshi my-2"
          style={{ whiteSpace: "pre-line" }}
        >
          {prompt.result}
        </p>
        <p className="font-inter text-md blue_gradient ">{prompt.tagLine}</p>
      </div>
    </section>
  );
};

export default SinglePrompt;
