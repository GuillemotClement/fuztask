import { Hono, Context } from 'hono'
import { cors } from 'hono/cors'
import { projectsTable, tasksTable } from './db/schema'
import { db } from './libs/drizzle'
import { eq, InferSelectModel, InferInsertModel } from 'drizzle-orm'
import { z } from "zod";

const app = new Hono()

app.use('/*', cors())
app.use(
  '/api2/*',
  cors({
    origin: 'http://localhost:5173',
    allowHeaders: ['X-Custom-Header', 'Upgrade-Insecure-Requests'],
    allowMethods: ['POST', 'GET', 'OPTIONS'],
    exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
    maxAge: 600,
    credentials: true,
  })
)

// TODO: créer le bon typage avec l'inférence de Drizzle
app.get('/tasks', async (c) => {
  const tasks = await db.select().from(tasksTable);
  console.log(tasks);
  return c.json(tasks);
})

app.post("/tasks", async (c) => {
  // récupération d body de la requête
  const { title } = await c.req.json();

  if(!title || title.length <= 2 ){
    const strError = "Title is not valid";
    console.error(strError);
    return c.json({ message: strError}, 401);
  }

  const payload = {
    title
  }

  const newTask = await db.insert(tasksTable).values(payload).returning();

  if(!newTask){
    const strError = "insert failed";
    console.log(strError);
    return c.json({ message: strError}, 401);
  }

  return c.json(newTask, 201);

});

app.delete("/tasks/:taskId", async (c) => {
  const taskId = c.req.param('taskId');
  // TODO: ajouter un check si la task existe
  // TODO: ajouter une verif si j'ai bien l'id dans le param
  await db.delete(tasksTable).where(eq(tasksTable.id, taskId));
  return c.json({status: 'ok'}, 200);
})

app.patch("/tasks/:taskId", async (c) => {
  const taskId = c.req.param('taskId');
  const { isDone } = await c.req.json();

  const isValid = await db.select().from(tasksTable).where(eq(tasksTable.id, taskId));
  if(!isValid){
    return c.json({ message: "task not found"}, 401);
  }

  const isUpdated = await db.update(tasksTable).set({ isDone: isDone}).where(eq(tasksTable.id, taskId));
  if(!isUpdated){
    return c.json({ message: "failed to update task"}, 401);
  }

  const response = { status: 'ok'}

  return c.json(response);
})

// =============================================
// TYPES =======================================
// =============================================
type Project = InferSelectModel<typeof projectsTable>;
type NewProject = InferInsertModel<typeof projectsTable>;


// =============================================
// VALIDATORS ==================================
// =============================================

// =============================================
// PROJECTS VALIDATORS =========================
// =============================================
const projectValidators = {
  createProjectSchema : z.object({
    title: z.string().min(2).max(100).trim().toLowerCase()
  }),

  updateProjectSchema: z.object({
    title: z.string().min(2).max(100).trim().toLowerCase()
  })
}


export type CreateProjectDTO = z.infer<typeof projectValidators.createProjectSchema>;

// =============================================
// HELPER ====================================
// =============================================
const projectHelper = {
  async getById(projectId: string): Promise<Project>{
      const project = await db.select().from(projectsTable).where(eq(projectsTable.id, projectId));
      return project[0] || [];
  }
}

// =============================================
// CONTROLLER ==================================
// =============================================


// =============================================
// PROJECTS ====================================
// =============================================
const projectsControllers ={
  async getAll(c: Context){
    const projects = await db.select().from(projectsTable);
    const response = projects;
    return c.json(response, 200);
  },

  async getById(c: Context){
    const projectId = c.req.param('projectId');
    if(!projectId){
      return c.json({message: "project id not found"}, 400);
    }

    try{
      const project = await db.select().from(projectsTable).where(eq(projectsTable.id, projectId));

      // check si la ressource est trouvé
      if(!project){
        return c.json({ message: "project not found"}, 404);
      }

      return c.json(project, 200);
    }catch(error){
      console.error("error fetch project: ", error);
      return c.json({ message: "internal server error"}, 500);
    }
  },

  async create(c: Context){
    const payload = await c.req.json();

    // on check avec le typage généré par Zod.
    const validationDate = projectValidators.createProjectSchema.safeParse(payload);
    if(!validationDate.success){
      const errorTree = z.treeifyError(validationDate.error);

      return c.json({ error: "data invalid", details: errorTree}, 400)
    }

    const projectData = validationDate.data;

    try{
      const newProject = await db.insert(projectsTable).values(projectData).returning();
      if(!newProject){
        return c.json({ message: "failed to creat new project"})
      }

      return c.json(newProject, 201);

    }catch(error){
      console.error("error to insert new project", error);
      return c.json({ message: "internal server error"}, 500);
    }
  },

  async delete(c: Context){
    const projectId = c.req.param('projectId');

    try{
      const project = await projectHelper.getById(projectId);

      if(!project){
        return c.json({ message: "project not found"},404)
      }

      await db.delete(projectsTable).where(eq(projectsTable.id, projectId));
    }catch(error){
      console.error("failed to delete project");
      return c.json({ message: "failed to delete project"}, 500);
    }
  },

  async update(c: Context){
    const projectId = c.req.param('projectId');
    if(!projectId){
      return c.json({message: "project id not found"}, 400);
    }

    const payload = await c.req.json();
    const validationData = projectValidators.updateProjectSchema.safeParse(payload);
    if(!validationData.success){
      const errorTree = z.treeifyError(validationData.error);
      return c.json({ error: "data invalid", details: errorTree}, 400)
    }

    const payloadData = validationData.data

    try{
      const newProject = await db.update(projectsTable).set({ title: payloadData.title}).where(eq(projectsTable.id, projectId)).returning();
      if(!newProject){
        console.error("failed to update project");
        return c.json({ message: "faile to update project"}, 500)
      }

      return c.json({ status: "created"}, 201)
    }catch(error){
      console.error("failed to update project");
      return c.json({ message: "failed to update project"}, 500);
    }
  }
}

// =============================================
// ROUTAGE =====================================
// =============================================
// SYNTAXE DANS UN FICHEIR EXTERNE => PLUS TARD POUR LA REFACTO EN CLEAN ARCHI
// controllers/projectsController.ts
// export const getAll = async (c: Context) => {
//   const projects = await db.select().from(projectsTable);
//   return c.json(projects, 200);
// };

// // index.ts
// import { getAll } from './controllers/projectsController';
// app.get("/projects", getAll);


app.get("/projects",(c) => projectsControllers.getAll(c));
app.get('/projects/:projectId', (c) => projectsControllers.getById(c));
app.post('/projects', (c) => projectsControllers.create(c));
app.put('/projects/:projectId', (c) => projectsControllers.update(c));
app.delete('/projects/:projectId', (c) => projectsControllers.delete(c));

export default app
