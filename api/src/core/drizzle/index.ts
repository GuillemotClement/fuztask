import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20, // max 20 connexion simultanées
  idleTimeoutMillis: 3000, // ferme une connexion idle après le timeout
  connectionTimeoutMillis: 5000, // timout de 5s pour établir la connexion 
})

// gestion erreur du pool
pool.on('error', (err) =>{
  console.error('Pool error: ', err);
});

export const db = drizzle({ client: pool});

// TODO: passer le schema et seed dans un dossier DB !
// TODO: passer le drizzle dans lib => c'est une dépendances
// TODO: vire le dossier core car inutile pour le moment