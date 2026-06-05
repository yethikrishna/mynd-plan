import { pgTable, uuid, text, timestamp, jsonb } from "drizzle-orm/pg-core";

export const conversations = pgTable("conversations", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull().default("New conversation"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const messages = pgTable("messages", {
  id: uuid("id").defaultRandom().primaryKey(),
  conversationId: uuid("conversation_id")
    .notNull()
    .references(() => conversations.id, { onDelete: "cascade" }),
  role: text("role").notNull(),
  content: text("content").notNull(),
  toolCalls: jsonb("tool_calls"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
