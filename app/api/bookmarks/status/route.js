import { connectToDB } from "@utils/database";
import Prompt from "@models/prompt";
import User from "@models/user";

export const POST = async (req) => {
  try {
    await connectToDB();

    const { userId } = await req.json();
    const user = await User.findById(userId);
    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }

    const bookmarks = await User.findById(userId).select("bookmarks");
    return new Response(JSON.stringify(bookmarks), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify(error), { status: 500 });
  }
};
