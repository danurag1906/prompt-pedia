import { connectToDB } from "@utils/database";
import User from "@models/user";
import Prompt from "@models/prompt";

export const POST = async (req) => {
  try {
    await connectToDB();
    const { promptId, userId } = await req.json();

    const user = await User.findById(userId);

    if (!user) {
      return new Response("User not found", { status: 404 });
    }

    const prompt = await Prompt.findById(promptId);

    if (!prompt) {
      return new Response("Prompt not found", { status: 404 });
    }

    const likeIndex = user.likedPrompts.indexOf(promptId);

    let isLiked;

    if (likeIndex !== -1) {
      isLiked = true;

      return new Response(JSON.stringify({ isLiked }), { status: 200 });
    } else {
      isLiked = false;

      return new Response(JSON.stringify({ isLiked }), { status: 200 });
    }
  } catch (error) {
    return new Response(JSON.stringify(error), { status: 500 });
  }
};
