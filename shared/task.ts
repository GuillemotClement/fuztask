export type Task = {
  id: number;
  title: string;
  isDone: boolean;
}

export type TaskWithProject = {
  taskId: string;
  title: string;
  isDone: boolean;
  projectId: string;
  projectName: string;
}