import { connectToDB } from "@utils/database";
import User from "@models/user";
import Prompt from "@models/prompt";

export const GET = async (req, { params }) => {
  try {
    await connectToDB();
    const userId = params.id; // Assuming userId is passed as a parameter

    // Find the user by their userId
    const user = await User.findById(userId);

    if (!user) {
      return new Response("User not found", { status: 404 });
    }

    // Fetch all the prompts bookmarked by the user
    const bookmarks = await Prompt.find({
      _id: { $in: user.bookmarks },
    }).populate("creator");

    return new Response(JSON.stringify(bookmarks), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify(error), { status: 500 });
  }
};
