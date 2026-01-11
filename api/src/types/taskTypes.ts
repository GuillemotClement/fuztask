import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { tasksTable } from "../db/schema";

export type Task = InferSelectModel<typeof tasksTable>
export type NewTask = InferInsertModel<typeof tasksTable>

// ✅ Omettre certains champs
export type TaskResponse = Omit<Task, 'userId'> & {
  projectTitle: string;
  statusTitle: string;
}

// Alternative : Sélectionner seulement certains champs
// export type TaskResponse = Pick<Task, 'id' | 'title' | 'description' | 'projectId' | 'statusId'> & {
//   projectTitle: string | null;
// }