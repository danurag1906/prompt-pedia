import { connectToDB } from "@utils/database";
import User from "@models/user";
import Prompt from "@models/prompt";

export const POST = async (req) => {
  try {
    console.log("inside toggle");
    await connectToDB();
    // Extract data from request body
    const { promptId, userId } = await req.json();
    // Check if user exists or not

    const user = await User.findById(userId);
    if (!user) {
      return new Response("User not found", { status: 404 });
    }

    const promt = await Prompt.findById(promptId);
    if (!promt) {
      return new Response("Prompt not found", { status: 404 });
    }

    // console.log(user, "user");
    // console.log(promt, "promt");
    // Toggle like
    const likeIndex = user.likedPrompts.indexOf(promptId);
    // console.log(likeIndex, "likeIndex");
    if (likeIndex !== -1) {
      // If prompt is already liked, unlike it
      user.likedPrompts.splice(likeIndex, 1);
      promt.likes -= 1;
      await user.save();
      await promt.save();
      //   console.log("like removed");
      return new Response("Like removed successfully", { status: 201 });
    } else {
      // If prompt is not liked, add it to liked prompts
      user.likedPrompts.push(promptId);
      promt.likes += 1;
      await user.save();
      await promt.save();
      //   console.log("like added");
      return new Response("Like added successfully", { status: 200 });
    }
  } catch (error) {
    return new Response(JSON.stringify(error), { status: 500 });
  }
};
