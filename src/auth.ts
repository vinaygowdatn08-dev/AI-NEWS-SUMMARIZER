import NextAuth from "next-auth";
import authConfig from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/db";
import { getUserByEmail, getUserById } from "@/lib/userQueries";
import { eq } from "drizzle-orm";
import { users } from "@/db/schema";
import { SignInSchema } from "./lib/schema";
import { compare } from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    ...authConfig.providers,
    Credentials({
      // @ts-expect-error error
      async authorize(credentials) {
        const validateFields = SignInSchema.safeParse(credentials);

        if (validateFields.success) {
          const { email, password } = validateFields.data;

          const user = await getUserByEmail(email);

          if (!user || !user.password) return null;

          if (!user.emailVerified) return null;

          const passwordsMatch = await compare(password, user.password);

          if (passwordsMatch) return user;

          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/signin",
  },
  events: {
    async linkAccount({ user }) {
      if (!user.id) return;
      await db
        .update(users)
        .set({ emailVerified: new Date() })
        .where(eq(users.id, user.id))
        .execute();
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "credentials") return true;

      const existingUser = await getUserById(user.id!);

      if (!existingUser?.emailVerified) return false;

      return true;
    },
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);

      if (!existingUser) return token;

      token.name = existingUser.name;
      token.email = existingUser.email;
      token.image = existingUser.image;

      return token;
    },
  },
  adapter: DrizzleAdapter(db),
  session: { strategy: "jwt" },
});
