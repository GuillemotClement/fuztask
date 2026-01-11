<script lang="ts">
  import type { TaskWithProject } from "@fuztask/shared";
  import { onMount } from "svelte";
  import Loading from "../components/Loading.svelte";
    import { Check, X } from "@lucide/svelte";
  // TODO: aller récupérer les projets pour une select liste pour afficher les task / projet 
  // TODO: aller récupérer les tasks 
  type Project = {
    id: string;
    title: string;
  }


  let tasks = $state<TaskWithProject[]>([]);
  let projects = $state<Project[]>([]);

  let isLoading = $state(true);
  let error = $state("");
  let errorProject = $state("");

  onMount(async() => {
    getTasks();
  })

  const getTasks = async () => {
    try{
      const response = await fetch("http://localhost:3000/tasks");

      if(!response.ok){
        console.error(response);
        throw new Error("failed to fetch data");
      }
      // TypeScript : "Je vérifie que ça CORRESPOND bien à TaskWithProject[]"
      // Si ça ne match pas, erreur de compilation
      tasks = await response.json() satisfies TaskWithProject[];
      // permet d'ajouter un timeout pour voir le loading
      // await new Promise(resolve => setTimeout(resolve, 800));
    }catch(err){
      console.error(err);
      error = err instanceof Error ? err.message : "Erreur inconnue";
    }finally{
      isLoading = false;
    }
  }

    async function updateTask(task: TaskWithProject){
    try{
      const newStatus = !task.isDone;

      const res = await fetch(`http://localhost:3000/tasks/${task.taskId}`, {
        // patch car on change une seule valeur et pas tous l'objet
        method: "PATCH",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          isDone: newStatus
        })
      });

      if(!res.ok) throw new Error("Erreur lors de l'update");

      await getTasks();
    }catch(err){
      console.error(err);
    }
  }

  async function deleteTask(task: TaskWithProject){
    if(confirm("Confirmer la suppresion de la task")) {
      try{
        const res = await fetch(`http://localhost:3000/tasks/${task.taskId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          },
        });

        if(!res.ok) throw new Error("Failed to delete stask");

        await getTasks();
      }catch(err){
        console.error(err);
      }
    }
  }

</script>


<h1>Home page</h1>

{#if isLoading}
  <Loading />
{:else if error}
  <p>Erreur de récupération des données</p>
{:else}
  <!-- Affiche tes tasks ici -->
  <p>{tasks.length} tâches</p>
{/if}

<table>
  <thead>
    <tr>
      <th>Projet</th>
      <th>Tâche</th>
      <th>Status</th>
      <th>Action</th>
    </tr>
  </thead>
  <tbody>
    {#each tasks as task}
      <tr>
        <td>{task.projectName}</td>
        <td>{task.title}</td>
        <td onclick={(e) => updateTask(task)}>
          {#if task.isDone}
          <div class="color-success">
              <Check />
          </div>
          {:else}
            <div class="color-danger">
              <X />
            </div>
          {/if}
        </td>
        <td>
          <button type="button" onclick={(e) => deleteTask(task)}>
            Supprimer
          </button>
        </td>
      </tr>
    {/each}        
    </tbody>
</table>

<style>
.color-success{
  color: green;
}

.color-danger {
  color: red;
}
</style>