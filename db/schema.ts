import { pgTable, text, timestamp, primaryKey, integer } from "drizzle-orm/pg-core";

export const users = pgTable("user", {
    id: text("id").primaryKey(),
    name: text("name"),
    email: text("email").unique(),
    emailVerified: timestamp("emailVerified"),
    verificationToken: text("verificatonToken"),
    image: text("image"),
});

export const accounts = pgTable(
    "account",
    {
        userId: text("userId")
            .notNull()
            .references(() => users.id),

        type: text("type").notNull(),
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
    (table) => ({
        pk: primaryKey({
            columns: [table.provider, table.providerAccountId],
        }),
    })
);

export const sessions = pgTable("session", {
    sessionToken: text("sessionToken").primaryKey(),
    userId: text("userId")
        .references(() => users.id)
        .notNull(),
    expires: timestamp("expires").notNull(),
});