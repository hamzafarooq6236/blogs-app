import { sql } from "drizzle-orm";
import { pgTable, text, timestamp, primaryKey, integer, uuid, jsonb, check, index, uniqueIndex } from "drizzle-orm/pg-core";

export const users = pgTable("user", {
    id: text("id").primaryKey(),
    name: text("name"),
    email: text("email").notNull().unique(),
    password: text("password").notNull(),
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

export const blogs = pgTable("blog", {
    userId: text("userId").notNull().references(() => users.id),
    id: uuid("id").notNull().primaryKey().defaultRandom(),
    title: text("title"),
    slug: text("slug").notNull(),
    coverImagePath: text("coverImagePath"),
    content: jsonb("content"),
    status: text("status").default("draft").notNull(),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
    updatedAt: timestamp("updatedAt").notNull().defaultNow(),
    publishedAt: timestamp("publishedAt"),
}, (table) => [
    check("status_check", sql`${table.status} IN ('draft', 'public', 'private')`),
    uniqueIndex("blogs_slug_unique").on(table.slug),
    index("blogs_author_id_idx").on(table.userId),
    index("blogs_status_idx").on(table.status),
    index("blogs_published_at_idx").on(table.publishedAt),
]);

export const sessions = pgTable("session", {
    sessionToken: text("sessionToken").primaryKey(),
    userId: text("userId")
        .references(() => users.id)
        .notNull(),
    expires: timestamp("expires").notNull(),
});