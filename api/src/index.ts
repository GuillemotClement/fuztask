import { Hono } from 'hono'
import { cors } from 'hono/cors'

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


type Task = {
  id: number; 
  title: string;
  isDone: boolean;
}

const tasks :Task[] = [
  {
    id: 1,
    title: 'Ma première task',
    isDone: false,
  },
  {
    id: 2,
    title: 'Ma deuxième task',
    isDone: true,
  },
]

app.get('/tasks', (c) => {
  return c.json(tasks);
})

app.post("/tasks", async (c) => {
  // récupération d body de la requête
  const { title } = await c.req.json();

  const lastTask = tasks[tasks.length - 1];
  
  // Si le tableau est vide, l'ID est 1. Sinon, c'est l'ancien ID + 1
  const newId = lastTask ? lastTask.id + 1 : 1;

  const newTask: Task = {
    id: newId,
    title: title,
    isDone: false,
  };

  tasks.push(newTask);

  return c.json(newTask, 201);
})

app.patch("/tasks/:taskId", async (c) => {
  const taskId = c.req.param('taskId');
  const { isDone } = await c.req.json();
  tasks.forEach((task) => {
    if(task.id === Number(taskId)){
      task.isDone = isDone;
    }
  })

  const response = { status: 'ok'}

  return c.json(response);
})

export default app
