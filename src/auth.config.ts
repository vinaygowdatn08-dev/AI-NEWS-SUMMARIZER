import Google from "next-auth/providers/google";
import type { NextAuthConfig } from "next-auth";

// This file is imported by the Edge middleware, so it must NOT
// import anything that touches the filesystem (e.g. SQLite / libsql with file: URLs).
// The Credentials provider with DB access is configured in auth.ts instead.

export default {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
} satisfies NextAuthConfig;
