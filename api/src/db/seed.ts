import { db } from "../libs/drizzle/index";
import { tasksTable } from "./schema";

async function main(){
  
  console.log("Start seeding");
  
  const taksToInsert = [
    {
      title: "Ma super première task",
    },
    {
      title: "Ma seconde task",
    },
    {
      title: "Mettre en place Drizzle",
    }
  ]

  await db.insert(tasksTable).values(taksToInsert).onConflictDoNothing();

  console.log("Seeding finished");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit();
})