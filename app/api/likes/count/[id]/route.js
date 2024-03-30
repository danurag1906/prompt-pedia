import Prompt from "@models/prompt";

export const GET = async (req, { params }) => {
  try {
    const promptId = params.id;

    // Find the prompt by ID
    const prompt = await Prompt.findById(promptId);
    if (!prompt) {
      return new Response("Prompt not found", { status: 404 });
    }

    // console.log(prompt, "prompt");
    // Get the likes count
    const likesCount = prompt.likes;
    // console.log(likesCount, "likesCount");

    // Return the likes count
    return new Response(JSON.stringify({ likesCount }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify(error), { status: 500 });
  }
};
