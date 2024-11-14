// // pages/api/auth/[...nextauth].js
// import NextAuth from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import dbConnect from "@/lib/db";
// import User from "@/models/User";
// import bcrypt from "bcryptjs";

// export default NextAuth({
//   providers: [
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         username: { label: "Username", type: "text" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials) {
//         await dbConnect();

//         // Check if user exists
//         const user = await User.findOne({ email: credentials.username });
//         if (!user) {
//           throw new Error("No user found with this email");
//         }

//         // Verify password
//         const isValidPassword = await bcrypt.compare(credentials.password, user.password);
//         if (!isValidPassword) {
//           throw new Error("Invalid password");
//         }

//         // Return user data if authentication is successful
//         return { id: user._id, name: user.name, email: user.email, role: user.role };
//       },
//     }),
//   ],

//   callbacks: {
//     async jwt({ token, user }) {
//       // If user data is available, add it to the token
//       if (user) {
//         token.id = user.id;
//         token.name = user.name;
//         token.email = user.email;
//         token.role = user.role;
//       }
//       return token;
//     },

//     async session({ session, token }) {
//       // Pass user data to the client
//       session.user = {
//         id: token.id,
//         name: token.name,
//         email: token.email,
//         role: token.role,
//       };
//       return session;
//     },

//     async signIn({ user }) {
//       await dbConnect();

//       // Check if user already exists
//       const existingUser = await User.findOne({ email: user.email });
//       if (!existingUser) {
//         // Create new user if not found
//         const newUser = new User({
//           email: user.email,
//           profile: { firstName: user.name },
//         });
//         await newUser.save();
//         console.log("New user created:", newUser);
//       }
//       return true;
//     },
//   },

//   pages: {
//     signIn: '/auth/signin',  // Custom sign-in page
//   },

//   secret: process.env.NEXTAUTH_SECRET,
// });


// pages/api/auth/[...nextauth].js
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await dbConnect();

        // Check if user exists
        let user = await User.findOne({ email: credentials.username });
        if (!user) {
          // If user does not exist, create a new user with hashed password
          const hashedPassword = await bcrypt.hash(credentials.password, 10);
          user = await User.create({
            email: credentials.username,
            password: hashedPassword,
            name: "New User", // You can customize or add fields as needed
            role: "user" // Default role, modify as needed
          });
          console.log("New user created:", user);
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(credentials.password, user.password);
        if (!isValidPassword) {
          throw new Error("Invalid password");
        }

        // Return user data if authentication is successful
        return { id: user._id, name: user.name, email: user.email, role: user.role };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      // If user data is available, add it to the token
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
      }
      return token;
    },

    async session({ session, token }) {
      // Pass user data to the client
      session.user = {
        id: token.id,
        name: token.name,
        email: token.email,
        role: token.role,
      };
      return session;
    },
  },

  pages: {
    signIn: '/auth/signin',  // Custom sign-in page
  },

  secret: process.env.NEXTAUTH_SECRET,
});
