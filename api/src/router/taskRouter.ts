import { Hono } from "hono";
import { taskController } from "../controllers/taskController";
import { authMiddleware } from "../middlewares/authMiddleware";

export const taskRouter = new Hono()

taskRouter.get('/', authMiddleware, taskController.getAll);