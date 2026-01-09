<script lang="ts">
  import { type Task} from "@fuztask/shared";

  import { onMount } from 'svelte';

  // ================================
  // déclaration des states ==========
  // ================================
  let tasks = $state<Task[]>([]);
  let loading = $state(true);
  let error = $state("");

  // ==================================
  // fonction pour fetch les tasks ====
  // ==================================
  async function loadTasks(){
    try{
      const res = await fetch("http://localhost:3000/tasks");
      tasks = await res.json();
      console.log(tasks);
    }catch(err: unknown){
      if (err instanceof Error) {
        error = err.message;
      } else {
        error = "Une erreur inconnue est survenue";
      }
    }finally{
      loading = false;
    }
  }

  // ====================================
  //  lorsque la page est chargé=========
  // ====================================
  onMount(async () => {
    loadTasks();
  })

  // ============================
  // REQUEST POST ===============
  // ============================
  // on utilise un état pour le formulaire
  let formState = $state<Omit<Task, 'id'>>({
    title: '',
    isDone: false,
  })

  let isSubmitting = $state(false);

  async function handleSubmit(e: Event){
    // empeche le rechargement de la page
    e.preventDefault();

    isSubmitting = true;

    // on fait la requête
    try{
      const res = await fetch('http://localhost:3000/tasks', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formState)
      });

      if(!res.ok) throw new Error("Erreur lors de la création");

      const createdTask = await res.json();
      console.log("Nouvelle tâche crée !", createdTask);

      // on vide le formulaire
      formState.title = "";

      // on recharge la liste 
      loadTasks();
    }catch(err){
      console.error(err);
    }finally{
      isSubmitting = false;
    }
  }

  // ================================
  // requete update =================
  // ================================
  async function updateTask(task: Task){

    try{
      const newStatus = !task.isDone;

      const res = await fetch(`http://localhost:3000/tasks/${task.id}`, {
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

      await loadTasks();
    }catch(err){
      console.error(err);
    }
  }

  // ===================================
  // requete delete ====================
  // ===================================
  async function deleteTask(task: Task){
    try{
      const res = await fetch(`http://localhost:3000/tasks/${task.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
      });

      if(!res.ok) throw new Error("Failed to delete stask");

      await loadTasks();
    }catch(err){
      console.error(err);
    }
  }
</script>

<main>

  <form action="" onsubmit={handleSubmit}>
    <label for="">Titre</label>
    <input type="text" name="title" id="title" bind:value={formState.title}>

    <button type="submit">{ isSubmitting ? 'Envoie ...' : 'créer'}</button>
  </form>
    


  {#if loading}
    <p>Chargement ...</p>
  {:else if error}
    <p>{error}</p>
  {:else}
    <ul>
      {#each tasks as task}
        <li>
        <p 
          onclick={() => updateTask(task)}
          style="cursor: pointer">
          {task.title} - {task.isDone}
        </p>
        <p style='cursor: pointer' onclick={() => deleteTask(task)}>X</p>
         - </li>
      {/each}
    </ul>
  {/if}

  

</main>

<style>

</style>
