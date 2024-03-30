import { connectToDB } from "@utils/database";
import Prompt from "@models/prompt";
export const POST = async (req) => {
  // console.log("inside post");
  const { userID, promptText, result, tagLine } = await req.json();
  //   console.log(userID, promptText, result, tagLine);
  try {
    await connectToDB();
    // console.log("inside try");
    const newPrompt = new Prompt({
      creator: userID,
      promptText: promptText,
      result: result,
      tagLine: tagLine,
    });
    // console.log(newPrompt);
    await newPrompt.save();
    // console.log("prompt saved");
    return new Response(JSON.stringify(newPrompt), { status: 201 });
  } catch (error) {
    return new Response("Failed to create a new prompt", { status: 500 });
  }
};
