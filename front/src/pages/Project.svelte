<script lang="ts">
  import { onMount } from "svelte";


// ==========================================
// STATE ====================================
// ==========================================
let projects = $state<Project[]>([]);
let loading = $state(true);
let error = $state("");

// =============================================
// Montage du composant ========================
// =============================================
onMount(async() => {
  loadProjects(); // lorsque l'on arrive sur la page, on viens charger les projets dans le state via la requête
})

// =============================================
// FETCH ====================================
// =============================================
// TODO: créer une fonction utilisateur pour cheque type de requête (getAll, getDetail, delete, create, update).
async function loadProjects(){
  try{
    const response = await fetch('http://localhost:3000/projects');
    
    if(!response.ok){
      console.error(response);
      throw new Error("failed to fetch data");
    }
    
    projects = await response.json();
  }catch(err){
    error = err instanceof Error ? err.message : "Erreur inconnue";
  }finally{
    loading = false;
  }
}
$inspect(projects); // permet de voir ce qui est stocker dans le proxy généré par Svelete. 
</script>

<div>
  <h1 class="text-center">Mes projets</h1>

  <ul>
    {#each projects as project}
      <li>{project.title}</li>
    {/each}
  </ul>

  
</div>

<style>
</style>