// import NextAuth from "next-auth";
// import GoogleProvider from "next-auth/providers/google";

// import User from "@models/user";
// import { connectToDB } from "@utils/database";

// const handler = NextAuth({
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     }),
//   ],
//   callbacks: {
//     async session({ session }) {
//       // store the user id from MongoDB to session
//       const sessionUser = await User.findOne({ email: session.user.email });
//       session.user.id = sessionUser._id.toString();

//       return session;
//     },
//     async signIn({ profile }) {
//       try {
//         await connectToDB();

//         // check if user already exists
//         // console.log(profile);
//         const userExists = await User.findOne({ email: profile.email });
//         // console.log(userExists, "user exists");

//         // if not, create a new document and save user in MongoDB
//         if (!userExists) {
//           //   console.log("insiede if condition");
//           await User.create({
//             email: profile.email,
//             username: profile.name.replace(" ", "").toLowerCase(),
//             image: profile.picture,
//           });
//         }
//         // console.log("outside if condition");

//         return true;
//       } catch (error) {
//         console.log("Error checking if user exists: ", error.message);
//         return false;
//       }
//     },
//   },
// });

// export { handler as GET, handler as POST };

import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import User from "@models/user";
import { connectToDB } from "@utils/database";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async session({ session }) {
      // store the user id from MongoDB to session
      const sessionUser = await User.findOne({ email: session.user.email });
      session.user.id = sessionUser._id.toString();

      return session;
    },
    async signIn({ profile }) {
      try {
        await connectToDB();

        // Check if user already exists with the provided email
        const userExistsWithEmail = await User.findOne({
          email: profile.email,
        });

        if (!userExistsWithEmail) {
          // If user does not exist with the provided email, check if user exists with the same name
          const userExistsWithName = await User.findOne({
            username: profile.name.replace(" ", "").toLowerCase(),
          });

          if (!userExistsWithName) {
            // If user does not exist with the same name, create a new document and save user in MongoDB
            await User.create({
              email: profile.email,
              username: profile.name.replace(" ", "").toLowerCase(),
              image: profile.picture,
            });
          } else {
            // If user exists with the same name, modify the username
            const modifiedUsername = await generateUniqueUsername(
              profile.name.replace(" ", "").toLowerCase()
            );
            await User.create({
              email: profile.email,
              username: modifiedUsername,
              image: profile.picture,
            });
          }
        }

        return true;
      } catch (error) {
        // console.log("Error checking if user exists: ", error.message);
        return false;
      }
    },
  },
});

async function generateUniqueUsername(username) {
  let modifiedUsername = username;
  let userWithSameUsername = await User.findOne({ username: modifiedUsername });

  // If username already exists, add random digits to it until it becomes unique
  while (userWithSameUsername) {
    modifiedUsername = username + Math.floor(Math.random() * 100); // Appending random two digits
    userWithSameUsername = await User.findOne({ username: modifiedUsername });
  }

  return modifiedUsername;
}

export { handler as GET, handler as POST };
