import { db } from "../libs/drizzle/index";
import { projectsTable, tasksTable } from "./schema";
import { eq } from "drizzle-orm";

async function main(){  
  console.log("Start seeding");

  await seedProjects();
  await seedTasks();

  console.log("Seeding finished");
  process.exit(0);
}



async function seedProjects(){
  const data = [
    {
      title: "ubklub",
    },
    { 
      title: "fuztask"
    }
  ];

  await db.insert(projectsTable).values(data).onConflictDoNothing();
}

async function seedTasks(){

  const [ubklub] = await db.select().from(projectsTable).where(eq(projectsTable.title, 'ubklub'));
  const ubklubId = ubklub.id;

  const [fuztask] = await db.select().from(projectsTable).where(eq(projectsTable.title, 'fuztask'));
  const fuztaskId = fuztask.id;

  const data = [
    {
      title: "Mettre en place un design potable",
      projectId: fuztaskId
    },
    {
      title: "Mettre en place la gestion des membres d'un club",
      projectId: ubklubId
    }
  ]

  await db.insert(tasksTable).values(data).onConflictDoNothing();
}


main().catch((err) => {
  console.error(err);
  process.exit();
})