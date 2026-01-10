import { integer, pgTable, varchar, boolean, uuid } from "drizzle-orm/pg-core";

export const tasksTable = pgTable("tasks", {
  // pour ajouter l'auto-incrémente sur l'uuid
  id: uuid().primaryKey().defaultRandom(),
  title: varchar().notNull(),
  isDone: boolean("is_done").default(true)
})