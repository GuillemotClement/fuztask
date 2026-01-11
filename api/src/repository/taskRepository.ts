import { tasksTable, projectsTable, tasksStatusTable } from "../db/schema"
import { db } from "../libs/drizzle";
import { Task, TaskResponse } from "../types/taskTypes";
import { eq } from "drizzle-orm";

export const taskRepository = {
  async getAll(userId: string): Promise<TaskResponse[]>{
    return await db
      .select({
        id: tasksTable.id,
        title: tasksTable.title,
        description: tasksTable.description,
        branche: tasksTable.branche,
        createdAt: tasksTable.createdAt,
        updatedAt: tasksTable.updatedAt,
        projectId: tasksTable.projectId,
        statusId: tasksTable.statusId,
        statusTitle: tasksStatusTable.title,
        projectTitle: projectsTable.title,
      })
      .from(tasksTable)
      .innerJoin(projectsTable, eq(tasksTable.projectId, projectsTable.id))
      .innerJoin(tasksStatusTable, eq(tasksTable.statusId, tasksStatusTable.id))
      .where(eq(tasksTable.userId, userId));
  }
}