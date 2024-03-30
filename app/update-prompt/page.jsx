"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

import Form from "@components/Form";

const UpdatePrompt = () => {
  const [submitting, setSubmitting] = useState(false);
  const [prompt, setPrompt] = useState({
    promptText: "",
    result: "",
    tagLine: "",
  });

  const router = useRouter();
  const searchParams = useSearchParams();
  const promptId = searchParams.get("id");

  const updatePrompt = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await fetch(`/api/prompt/${promptId}`, {
        method: "PATCH",
        body: JSON.stringify({
          promptText: prompt.promptText,
          result: prompt.result,
          tagLine: prompt.tagLine,
        }),
      });
      if (response.ok) {
        router.push("/");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setSubmitting(false);
    }
  };

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

  return (
    <Suspense>
      <Form
        type="Edit"
        prompt={prompt}
        setPrompt={setPrompt}
        submitting={submitting}
        handleSubmit={updatePrompt}
      />
    </Suspense>
  );
};

export default UpdatePrompt;
