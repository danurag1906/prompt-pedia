import { Schema, model, models } from "mongoose";

const PromptSchema = new Schema({
  creator: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  promptText: {
    type: String,
    required: [true, "Prompt is required"],
  },
  result: {
    type: String,
    required: [true, "Result is required"],
  },
  tagLine: {
    type: String,
    required: [true, "Tagline is required"],
  },
  likes: {
    type: Number,
    default: 0,
  },
});

const Prompt = models.Prompt || model("Prompt", PromptSchema);

export default Prompt;
