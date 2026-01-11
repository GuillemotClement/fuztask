import { integer, pgTable, varchar, boolean, uuid, text } from "drizzle-orm/pg-core";

export const tasksTable = pgTable("tasks", {
  // pour ajouter l'auto-incrémente sur l'uuid
  id: uuid().primaryKey().defaultRandom(),
  title: varchar().notNull(),
  isDone: boolean("is_done").default(true),
  projectId: uuid("project_id").notNull(),
})

export const projectsTable = pgTable("projects", {
  id: uuid().primaryKey().defaultRandom(),
  title: varchar({ length: 100}).notNull().unique(),
})