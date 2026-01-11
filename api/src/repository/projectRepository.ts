import { projectsTable } from "../db/schema";
import { db } from "../libs/drizzle";
import { Project } from "../types/projectTypes";
import { eq } from "drizzle-orm";

export const projectRepository = {
  async getById(projectId: string): Promise<Project | null>{
    const result = await db.select().from(projectsTable).where(eq(projectsTable.id, projectId));
    return result[0] || null;
  }
}