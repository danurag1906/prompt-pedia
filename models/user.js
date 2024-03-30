import { Schema, model, models } from "mongoose";

const userSchema = new Schema({
  email: {
    type: String,
    unique: [true, "email already exists"],
    required: [true, "email already required"],
  },
  username: {
    type: String,
  },
  image: {
    type: String,
  },
});

//since nextjs is serverless architecture we check if the schema User already exists. IF it doesnt exists only then we create a new User schema. This is different from express , beacuse in express the server is runnnig 24/7 . But in nextjs we need to restart the server.
const User = models.User || model("User", userSchema);

export default User;
