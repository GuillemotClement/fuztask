import { Context } from "hono";
import { taskService } from "../services/taskService";
import { getUserId } from "../middlewares/authMiddleware";

export const taskController = {
  async getAll(c: Context){
    const userId = getUserId(c);

    try{
      const tasks = await taskService.getAll(userId);
      return c.json(tasks, 200);
    }catch(err){
      console.error(err);
      return c.json({message: "Failed to fetch tasks"}, 500);
    }
  }
}