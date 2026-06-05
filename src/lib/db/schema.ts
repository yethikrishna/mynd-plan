import {
  pgTable,
  text,
  timestamp,
  uuid,
  jsonb,
  integer,
  pgEnum,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

/**
 * UNIFIED RELATIONAL CORE (the "Lark-direction" architecture).
 *
 * The insight from interconnected suites like Lark is that the magic is NOT
 * any single feature \u2014 it's a single normalized data graph where chat,
 * docs, tasks, and events all reference shared entities. Below, every object
 * a user creates is an `item` belonging to a `project` inside a `workspace`,
 * and cross-references between items are first-class rows. That's what makes
 * an app feel like one connected system instead of isolated CRUD pages.
 *
 *   workspace 1\u2014* member
 *   workspace 1\u2014* project 1\u2014* item
 *   item *\u2014* item   (via item_links: \"references\", \"blocks\", \"mentions\")
 *   item 1\u2014* event   (calendar / activity stream)
 *   item 1\u2014* doc_block (real-time editable content blocks)
 */

export const itemKind = pgEnum("item_kind", [
  "doc",
  "task",
  "message",
  "event",
  "conversation",
]);

export const linkKind = pgEnum("link_kind", [
  "references",
  "blocks",
  "mentions",
  "child_of",
]);

export const workspaces = pgTable("workspaces", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const members = pgTable(
  "members",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    userId: text("user_id").notNull(),
    email: text("email").notNull(),
    role: text("role").notNull().default("member"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    byWorkspace: index("members_workspace_idx").on(t.workspaceId),
  })
);

export const projects = pgTable(
  "projects",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    byWorkspace: index("projects_workspace_idx").on(t.workspaceId),
  })
);

export const items = pgTable(
  "items",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    kind: itemKind("kind").notNull(),
    title: text("title").notNull().default(""),
    body: text("body").notNull().default(""),
    metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}),
    createdBy: text("created_by"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => ({
    byProject: index("items_project_idx").on(t.projectId),
    byKind: index("items_kind_idx").on(t.kind),
  })
);

/** Cross-references between items \u2014 the edges of the data graph. */
export const itemLinks = pgTable(
  "item_links",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    sourceId: uuid("source_id")
      .notNull()
      .references(() => items.id, { onDelete: "cascade" }),
    targetId: uuid("target_id")
      .notNull()
      .references(() => items.id, { onDelete: "cascade" }),
    kind: linkKind("kind").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    bySource: index("item_links_source_idx").on(t.sourceId),
    byTarget: index("item_links_target_idx").on(t.targetId),
  })
);

export const events = pgTable(
  "events",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    itemId: uuid("item_id").references(() => items.id, { onDelete: "cascade" }),
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    payload: jsonb("payload").$type<Record<string, unknown>>().default({}),
    startsAt: timestamp("starts_at"),
    endsAt: timestamp("ends_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    byWorkspace: index("events_workspace_idx").on(t.workspaceId),
  })
);

export const docBlocks = pgTable(
  "doc_blocks",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    itemId: uuid("item_id")
      .notNull()
      .references(() => items.id, { onDelete: "cascade" }),
    order: integer("order").notNull().default(0),
    type: text("type").notNull().default("paragraph"),
    content: jsonb("content").$type<Record<string, unknown>>().default({}),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => ({
    byItem: index("doc_blocks_item_idx").on(t.itemId),
  })
);

// ---- Relations (typed graph traversal) ----

export const workspacesRelations = relations(workspaces, ({ many }) => ({
  members: many(members),
  projects: many(projects),
  events: many(events),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
  workspace: one(workspaces, {
    fields: [projects.workspaceId],
    references: [workspaces.id],
  }),
  items: many(items),
}));

export const itemsRelations = relations(items, ({ one, many }) => ({
  project: one(projects, {
    fields: [items.projectId],
    references: [projects.id],
  }),
  docBlocks: many(docBlocks),
  events: many(events),
  outgoingLinks: many(itemLinks, { relationName: "source" }),
  incomingLinks: many(itemLinks, { relationName: "target" }),
}));

export const itemLinksRelations = relations(itemLinks, ({ one }) => ({
  source: one(items, {
    fields: [itemLinks.sourceId],
    references: [items.id],
    relationName: "source",
  }),
  target: one(items, {
    fields: [itemLinks.targetId],
    references: [items.id],
    relationName: "target",
  }),
}));

export const docBlocksRelations = relations(docBlocks, ({ one }) => ({
  item: one(items, {
    fields: [docBlocks.itemId],
    references: [items.id],
  }),
}));
