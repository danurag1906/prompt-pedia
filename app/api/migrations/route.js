// migrations/add_bookmarks_to_users.js

import User from "@models/user";
import { connectToDB } from "@utils/database";

export const GET = async () => {
  try {
    // Connect to the database
    await connectToDB();

    // Define the migration logic
    const migrationLogic = async () => {
      // Add bookmarks field to the users collection
      await User.updateMany({}, { $set: { bookmarks: [] } });
    };
    //run the migration logic
    await migrationLogic();
    console.log("Migration completed successfully");
    process.exit(0);
  } catch (error) {
    console.error("migration failed:", error);
  }
};

// const addBookmarksFieldToUsers = async () => {
//   try {
//     // Connect to the database
//     await connectToDB();

//     // Define the migration logic
//     const migrationLogic = async () => {
//       // Add bookmarks field to the users collection
//       await User.updateMany({}, { $set: { bookmarks: [] } });
//     };

//     // Run the migration logic
//     await migrationLogic();

//     console.log("Migration completed successfully");
//     process.exit(0);
//   } catch (error) {
//     console.error("Migration failed:", error);
//     process.exit(1);
//   }
// };

// // Execute the migration
// addBookmarksFieldToUsers();
