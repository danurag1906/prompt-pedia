// migrations/add_bookmarks_to_users.js

// Import Mongoose connection and models
import { connectToDB } from "@utils/database";
import User from "@models/user";
import Prompt from "@models/prompt";

// Define the migration function
export const GET = async () => {
  try {
    // Connect to the database
    await connectToDB();

    // Update existing prompts to include the 'likes' field
    const promptMigrationResult = async () => {
      await Prompt.updateMany({}, { $set: { likes: 0 } });
      console.log(
        `${promptMigrationResult.nModified} prompts migrated successfully.`
      );
    };

    // Update existing users to include the 'likedPrompts' field
    const userMigrationResult = async () => {
      await User.updateMany({}, { $set: { likedPrompts: [] } });
      console.log(
        `${userMigrationResult.nModified} users migrated successfully.`
      );
    };

    await promptMigrationResult();
    await userMigrationResult();
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    // Close the database connection
    process.exit(0);
  }
};

// import User from "@models/user";
// import { connectToDB } from "@utils/database";

// export const GET = async () => {
//   try {
//     // Connect to the database
//     await connectToDB();

//     // Define the migration logic
//     const migrationLogic = async () => {
//       // Add bookmarks field to the users collection
//       await User.updateMany({}, { $set: { bookmarks: [] } });
//     };
//     //run the migration logic
//     await migrationLogic();
//     console.log("Migration completed successfully");
//     process.exit(0);
//   } catch (error) {
//     console.error("migration failed:", error);
//   }
// };
