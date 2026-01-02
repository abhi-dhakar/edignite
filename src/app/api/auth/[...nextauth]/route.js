import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User.model";
import bcryptjs from "bcryptjs";
import { signinSchema } from "@/lib/validations/signinSchema";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "you@example.com",
        },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        await dbConnect();

        // Validate using Zod
        const result = signinSchema.safeParse(credentials);
        if (!result.success) {
          const errorMessages = result.error.flatten().fieldErrors;
          throw new Error(
            errorMessages.email?.[0] ||
            errorMessages.password?.[0] ||
            "Invalid input"
          );
        }

        const { email, password } = result.data;

        const user = await User.findOne({ email });

        if (!user) {
          throw new Error("No user found with this email");
        }

        const isPasswordValid = await bcryptjs.compare(password, user.password);

        if (!isPasswordValid) {
          throw new Error("Invalid email or password");
        }

        return {
          id: user._id,
          name: user.name,
          email: user.email,
          image: user.image,
          memberType: user.memberType,
        };
      },
    }),
  ],

  pages: {
    signIn: "/login",
  },

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.image = user.image;
        token.memberType = user.memberType;
      }

      // Handle session updates (e.g., profile image change)
      if (trigger === "update" && session?.user) {
        token.name = session.user.name || token.name;
        token.image = session.user.image || token.image;
        token.memberType = session.user.memberType || token.memberType;
        // Keep other fields if needed
      }

      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.image;
        session.user.memberType = token.memberType;
      }
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
