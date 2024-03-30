import { connectToDB } from "@utils/database";
import User from "@models/user";

export const POST = async (req) => {
  try {
    await connectToDB();
    //extract data from request body
    const { promptId, userId } = await req.json();
    //check if user exists or not
    const user = await User.findById(userId);
    if (!user) {
      return new Response("User not found", { status: 404 });
    }
    //check if bookmarks exists or not
    const bookmarkExists = user.bookmarks.includes(promptId);
    if (bookmarkExists) {
      return new Response("Bookmark already exists", { status: 409 });
    }
    //add bookmark
    user.bookmarks.push(promptId);
    await user.save();
    return new Response("Bookmark added successfully", { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify(error), { status: 500 });
  }
};
