import { taskRepository } from "../repository/taskRepository"
import { TaskResponse } from "../types/taskTypes";

export const taskService = {
  async getAll(userId: string): Promise<TaskResponse[]>{
    return await taskRepository.getAll(userId);
  }
}