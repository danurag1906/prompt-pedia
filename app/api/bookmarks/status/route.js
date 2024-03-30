import { connectToDB } from "@utils/database";
import Prompt from "@models/prompt";
import User from "@models/user";

export const POST = async (req) => {
  try {
    await connectToDB();

    const { promptId, userId } = await req.json();
    const user = await User.findById(userId);
    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }

    const prompt = await Prompt.findById(promptId);
    if (!prompt) {
      return new Response(JSON.stringify({ error: "Prompt not found" }), {
        status: 404,
      });
    }

    const bookmarkIndex = user.bookmarks.indexOf(promptId);

    if (bookmarkIndex !== -1) {
      return new Response(JSON.stringify({ bookmarked: true }), {
        status: 200,
      });
    } else {
      return new Response(JSON.stringify({ bookmarked: false }), {
        status: 200,
      });
    }
  } catch (error) {
    return new Response(JSON.stringify(error), { status: 500 });
  }
};
