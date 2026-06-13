import {
  text,
  sqliteTable,
  integer,
  uniqueIndex,
  index,
  primaryKey,
} from "drizzle-orm/sqlite-core";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import type { AdapterAccountType } from "next-auth/adapters";

const client = createClient({
  url: "file:local.db",
});

export const db = drizzle(client);

export const users = sqliteTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  password: text("password").notNull(),
  emailVerified: integer("emailVerified", { mode: "timestamp" }),
  image: text("image"),
});

export const accounts = sqliteTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => [
    {
      compoundKey: primaryKey({
        columns: [account.provider, account.providerAccountId],
      }),
    },
  ]
);

export const verificationTokens = sqliteTable("verificationToken", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  email: text("email").notNull(),
  token: text("token").notNull(),
  expires: integer("expires", { mode: "timestamp" }).notNull(),
});

export const authenticators = sqliteTable(
  "authenticator",
  {
    credentialID: text("credentialID").notNull().unique(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    providerAccountId: text("providerAccountId").notNull(),
    credentialPublicKey: text("credentialPublicKey").notNull(),
    counter: integer("counter").notNull(),
    credentialDeviceType: text("credentialDeviceType").notNull(),
    credentialBackedUp: integer("credentialBackedUp", { mode: "boolean" }).notNull(),
    transports: text("transports"),
  },
  (authenticator) => [
    {
      compositePK: primaryKey({
        columns: [authenticator.userId, authenticator.credentialID],
      }),
    },
  ]
);

export const passwordResetToken = sqliteTable(
  "password_reset_token",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    email: text("email").notNull(),
    token: text("token").notNull().unique(),
    expires: integer("expires", { mode: "timestamp" }).notNull(),
  },
  (table) => {
    return {
      emailTokenUnique: uniqueIndex("password_reset_email_token_unique").on(table.email, table.token),
    };
  }
);

export const changeEmailToken = sqliteTable(
  "change_email_token",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    email: text("email").notNull(),
    token: text("token").notNull().unique(),
    expires: integer("expires", { mode: "timestamp" }).notNull(),
    emailVerified: integer("email_verified", { mode: "boolean" }).notNull().default(false),
  },
  (table) => {
    return {
      emailTokenUnique: uniqueIndex("change_email_token_unique").on(table.email, table.token),
      expiresIdx: index("change_email_expires_idx").on(table.expires),
    };
  }
);

export const subscribedTopics = sqliteTable(
  "subscribed_topics",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    topic: text("topic").notNull(),
    createdAt: integer("createdAt", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (table) => {
    return {
      userIdIdx: index("subscribed_topics_user_id_idx").on(table.userId),
      userTopicUnique: uniqueIndex("subscribed_topics_user_topic_unique").on(table.userId, table.topic),
    };
  }
);
