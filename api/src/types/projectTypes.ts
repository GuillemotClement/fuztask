import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { projectsTable } from "../db/schema";

export type Project = InferSelectModel<typeof projectsTable>
export type NewProject = InferInsertModel<typeof projectsTable>