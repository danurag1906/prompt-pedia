import { connectToDB } from "@utils/database";
import User from "@models/user";

export const POST = async (req) => {
  try {
    await connectToDB();
    // Extract data from request body
    const { promptId, userId } = await req.json();
    // Check if user exists or not
    const user = await User.findById(userId);
    if (!user) {
      return new Response("User not found", { status: 404 });
    }
    // Toggle bookmark
    const bookmarkIndex = user.bookmarks.indexOf(promptId);
    // console.log(bookmarkIndex, "bookmarkIndex");
    if (bookmarkIndex !== -1) {
      // If prompt is already bookmarked, remove it
      user.bookmarks.splice(bookmarkIndex, 1);
      // console.log("already bookmarked");
      await user.save();
      // console.log("bookmark removed successfully");
      return new Response("Bookmark removed successfully", { status: 201 });
    } else {
      // If prompt is not bookmarked, add it
      user.bookmarks.push(promptId);
      // console.log(" bookmarked added");
      await user.save();
      return new Response("Bookmark added successfully", { status: 200 });
    }
  } catch (error) {
    return new Response(JSON.stringify(error), { status: 500 });
  }
};
