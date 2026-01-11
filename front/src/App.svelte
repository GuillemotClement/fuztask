<script lang="ts">
  import Header from "./components/partials/Header.svelte";
  import Footer from "./components/partials/Footer.svelte";
  import { Router } from "@mateothegreat/svelte5-router";
  import { routes } from "./router/router";

  // // ================================
  // // déclaration des states ==========
  // // ================================
  // let tasks = $state<Task[]>([]);
  // let loading = $state(true);
  // let error = $state("");

  // // ==================================
  // // fonction pour fetch les tasks ====
  // // ==================================
  // async function loadTasks(){
  //   try{
  //     const res = await fetch("http://localhost:3000/tasks");
  //     tasks = await res.json();
  //     console.log(tasks);
  //   }catch(err: unknown){
  //     if (err instanceof Error) {
  //       error = err.message;
  //     } else {
  //       error = "Une erreur inconnue est survenue";
  //     }
  //   }finally{
  //     loading = false;
  //   }
  // }

  // // ====================================
  // //  lorsque la page est chargé=========
  // // ====================================
  // onMount(async () => {
  //   loadTasks();
  // })

  // // ============================
  // // REQUEST POST ===============
  // // ============================
  // // on utilise un état pour le formulaire
  // let formState = $state<Omit<Task, 'id'>>({
  //   title: '',
  //   isDone: false,
  // })

  // let isSubmitting = $state(false);

  // async function handleSubmit(e: Event){
  //   // empeche le rechargement de la page
  //   e.preventDefault();

  //   isSubmitting = true;

  //   // on fait la requête
  //   try{
  //     const res = await fetch('http://localhost:3000/tasks', {
  //       method: "POST",
  //       headers: {
  //         'Content-Type': 'application/json'
  //       },
  //       body: JSON.stringify(formState)
  //     });

  //     if(!res.ok) throw new Error("Erreur lors de la création");

  //     const createdTask = await res.json();
  //     console.log("Nouvelle tâche crée !", createdTask);

  //     // on vide le formulaire
  //     formState.title = "";

  //     // on recharge la liste 
  //     loadTasks();
  //   }catch(err){
  //     console.error(err);
  //   }finally{
  //     isSubmitting = false;
  //   }
  // }

  // // ================================
  // // requete update =================
  // // ================================


  // // ===================================
  // // requete delete ====================
  // // ===================================

</script>

<div class="app-layout">
  <Header />
  <main class="debug container">
    <Router { routes } />
  </main>
  <Footer />
</div>

<style>

</style>
