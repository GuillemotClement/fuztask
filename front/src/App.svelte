<script lang="ts">
  import Header from "./components/partials/Header.svelte";
  import Footer from "./components/partials/Footer.svelte";
  import { Router } from "@mateothegreat/svelte5-router";
  import { routes } from "./router/router";

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
