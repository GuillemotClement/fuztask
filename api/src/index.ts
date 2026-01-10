import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { tasksTable } from './db/schema'
import { db } from './libs/drizzle'
import { Context } from 'hono/jsx'
import { eq } from 'drizzle-orm'

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

app.get('/', (c) => {
  return c.text('Hello!')
})

app.get("/json", (c) => {
  return c.json({
    ok: true,
    message: "This is json return by hono",
  })
})


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

// ============================================
// PROJECTS ==================================

export default app
