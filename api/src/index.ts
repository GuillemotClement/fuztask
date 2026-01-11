import { Hono, Context } from 'hono'
import { cors } from 'hono/cors'
import { projectsTable, tasksTable } from './db/schema'
import { db } from './libs/drizzle'
import { eq, InferSelectModel, InferInsertModel } from 'drizzle-orm'
import { z } from "zod";
import { swaggerUI } from '@hono/swagger-ui'
import { taskRouter } from './router/taskRouter'
import { auth } from './libs/better_auth/auth'

const app = new Hono()

app.use('/*', cors({
  origin: process.env.FRONT_URL!,
  allowHeaders: ['Content-Type', 'Authorization', 'X-Custom-Header', 'Upgrade-Insecure-Requests'],
  allowMethods: ['POST', 'GET', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
  maxAge: 600,
  credentials: true,
}))

// =============================================
// SWAGGER =====================================
// =============================================
const openApiDoc = {
  openapi: "3.0.0",
  info: {
    title: "Fuztask API Documentation",
    version: '0.0.1',
    description: 'API documentation for your service',
  }, 
  paths: {
    '/projects' : {
      get: {
        summary: "get all projects",
        responses: {
          "200" : {
            description: "Get all projects"
          },
        },
      },
    },
  // add more endpoint 
  },
}

app.get('/doc', (c) => c.json(openApiDoc));
app.get('/ui', swaggerUI({ url: '/doc'}))


// =============================================
// BETTER_AUTH ====================================
// =============================================
app.on(
  ['POST', 'GET'], 
  "/api/auth/*",
  (c) => auth.handler(c.req.raw)
);


// =============================================
// ROUTEUR PRINCIAPLE ==========================
// =============================================
app.route('api/tasks', taskRouter);




// app.post("/tasks", authMiddleware, async (c) => {
//   // récupération de l'id de l'utilisateur
//   const userId = getUserId(c)
  
//   // récupération d body de la requête
//   const { title } = await c.req.json();

//   if(!title || title.length <= 2 ){
//     const strError = "Title is not valid";
//     console.error(strError);
//     return c.json({ message: strError}, 401);
//   }

//   const payload = {
//     title,
//     userId  // Ajouter l'userId
//   }

//   const newTask = await db.insert(tasksTable).values(payload).returning();

//   if(!newTask){
//     const strError = "insert failed";
//     console.log(strError);
//     return c.json({ message: strError}, 401);
//   }

//   return c.json(newTask, 201);

// });

// app.delete("/tasks/:taskId", async (c) => {
//   const taskId = c.req.param('taskId');
//   // TODO: ajouter un check si la task existe
//   // TODO: ajouter une verif si j'ai bien l'id dans le param
//   await db.delete(tasksTable).where(eq(tasksTable.id, taskId));
//   return c.json({status: 'ok'}, 200);
// })

// app.patch("/tasks/:taskId", async (c) => {
//   const taskId = c.req.param('taskId');
//   const { isDone } = await c.req.json();

//   const isValid = await db.select().from(tasksTable).where(eq(tasksTable.id, taskId));
//   if(!isValid){
//     return c.json({ message: "task not found"}, 401);
//   }

//   const isUpdated = await db.update(tasksTable).set({ isDone: isDone}).where(eq(tasksTable.id, taskId));
//   if(!isUpdated){
//     return c.json({ message: "failed to update task"}, 401);
//   }

//   const response = { status: 'ok'}

//   return c.json(response);
// })

// =============================================
// TYPES =======================================
// =============================================
// type Project = InferSelectModel<typeof projectsTable>;
// type NewProject = InferInsertModel<typeof projectsTable>;




// =============================================
// VALIDATORS ==================================
// =============================================

// =============================================
// PROJECTS VALIDATORS =========================
// =============================================
// const projectValidators = {
//   createProjectSchema : z.object({
//     title: z.string().min(2).max(100).trim().toLowerCase()
//   }),

//   updateProjectSchema: z.object({
//     title: z.string().min(2).max(100).trim().toLowerCase()
//   })
// }


// export type CreateProjectDTO = z.infer<typeof projectValidators.createProjectSchema>;

// =============================================
// HELPER ====================================
// =============================================
// const projectHelper = {
//   async getById(projectId: string): Promise<Project>{
//       const project = await db.select().from(projectsTable).where(eq(projectsTable.id, projectId));
//       return project[0] || [];
//   }
// }

// =============================================
// CONTROLLER ==================================
// =============================================


// =============================================
// PROJECTS ====================================
// =============================================
// const projectsControllers ={
//   async getAll(c: Context){
//     const projects = await db.select().from(projectsTable);
//     const response = projects;
//     return c.json(response, 200);
//   },

//   async getById(c: Context){
//     const projectId = c.req.param('projectId');
//     if(!projectId){
//       return c.json({message: "project id not found"}, 400);
//     }

//     try{
//       const project = await db.select().from(projectsTable).where(eq(projectsTable.id, projectId));

//       // check si la ressource est trouvé
//       if(!project){
//         return c.json({ message: "project not found"}, 404);
//       }

//       return c.json(project, 200);
//     }catch(error){
//       console.error("error fetch project: ", error);
//       return c.json({ message: "internal server error"}, 500);
//     }
//   },

//   async create(c: Context){
//     const payload = await c.req.json();

//     // on check avec le typage généré par Zod.
//     const validationDate = projectValidators.createProjectSchema.safeParse(payload);
//     if(!validationDate.success){
//       const errorTree = z.treeifyError(validationDate.error);

//       return c.json({ error: "data invalid", details: errorTree}, 400)
//     }

//     const projectData = validationDate.data;

//     try{
//       const newProject = await db.insert(projectsTable).values(projectData).returning();
//       if(!newProject){
//         return c.json({ message: "failed to creat new project"})
//       }

//       return c.json(newProject, 201);

//     }catch(error){
//       console.error("error to insert new project", error);
//       return c.json({ message: "internal server error"}, 500);
//     }
//   },

//   async delete(c: Context){
//     const projectId = c.req.param('projectId');

//     try{
//       const project = await projectHelper.getById(projectId);

//       if(!project){
//         return c.json({ message: "project not found"},404)
//       }

//       await db.delete(projectsTable).where(eq(projectsTable.id, projectId));
//     }catch(error){
//       console.error("failed to delete project");
//       return c.json({ message: "failed to delete project"}, 500);
//     }
//   },

//   async update(c: Context){
//     const projectId = c.req.param('projectId');
//     if(!projectId){
//       return c.json({message: "project id not found"}, 400);
//     }

//     const payload = await c.req.json();
//     const validationData = projectValidators.updateProjectSchema.safeParse(payload);
//     if(!validationData.success){
//       const errorTree = z.treeifyError(validationData.error);
//       return c.json({ error: "data invalid", details: errorTree}, 400)
//     }

//     const payloadData = validationData.data

//     try{
//       const newProject = await db.update(projectsTable).set({ title: payloadData.title}).where(eq(projectsTable.id, projectId)).returning();
//       if(!newProject){
//         console.error("failed to update project");
//         return c.json({ message: "faile to update project"}, 500)
//       }

//       return c.json({ status: "created"}, 201)
//     }catch(error){
//       console.error("failed to update project");
//       return c.json({ message: "failed to update project"}, 500);
//     }
//   }
// }

// =============================================
// TASKS    ====================================
// =============================================



// app.get('/tasks', async (c) => {
//   const tasks = await db
//     .select({
//       taskId: tasksTable.id,
//       title: tasksTable.title,
//       isDone: tasksTable.isDone,
//       projectId: tasksTable.projectId,
//       projectName: projectsTable.title,
//     })
//     .from(tasksTable)
//     .leftJoin(projectsTable, eq(tasksTable.projectId, projectsTable.id));

//   return c.json(tasks);
// })

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


// app.get("/projects",(c) => projectsControllers.getAll(c));
// app.get('/projects/:projectId', (c) => projectsControllers.getById(c));
// app.post('/projects', (c) => projectsControllers.create(c));
// app.put('/projects/:projectId', (c) => projectsControllers.update(c));
// app.delete('/projects/:projectId', (c) => projectsControllers.delete(c));

export default app
