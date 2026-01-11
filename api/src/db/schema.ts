import { timestamp, pgTable, varchar, boolean, uuid, text, index } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// =============================================
// TASKS ====================================
// =============================================
export const tasksTable = pgTable("tasks", {
  // pour ajouter l'auto-incrémente sur l'uuid
  id: uuid().primaryKey().defaultRandom(),
  title: varchar().notNull(),
  description: text(),
  branche: varchar({ length: 255}).unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
  .$onUpdate(() => /* @__PURE__ */ new Date())
  .notNull(),
  projectId: uuid("project_id").notNull().references(() => projectsTable.id, { onDelete: 'cascade'}),
  statusId: uuid("status_id").notNull().references(() => tasksStatusTable.id, { onDelete: "restrict"}),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade"})
});
export const tasksStatusTable = pgTable("tasks_status", {
  id: uuid().primaryKey().defaultRandom(),
  title: varchar({ length: 100}).notNull().unique(),
  color: varchar({length: 7}).unique()
});

// =============================================
// PROJECTS ====================================
// =============================================
export const projectsTable = pgTable("projects", {
  id: uuid().primaryKey().defaultRandom(),
  title: varchar({ length: 100}).notNull().unique(),
  description: text(),
  repositoryUrl: varchar("repository_url", { length: 255}).unique(),  
  image: varchar({length: 255}),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
  .$onUpdate(() => /* @__PURE__ */ new Date())
  .notNull(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade"}),
  contextId: uuid("context_id").references(() => projectsContextStatus.id, { onDelete: 'restrict'})
})

export const projectsContextStatus = pgTable("projects_context", {
  id: uuid().primaryKey().defaultRandom(),
  title: varchar({length: 100}).notNull().unique(),
  color: varchar({length: 7}).unique()
})


// =============================================
// BETTER AUTH SCHEMA ==========================
// =============================================
export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  username: text("username").unique(),
  displayUsername: text("display_username"),
});

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_userId_idx").on(table.userId)],
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("account_userId_idx").on(table.userId)],
);

export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
);

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));
