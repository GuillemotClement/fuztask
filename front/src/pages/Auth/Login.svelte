<script lang="ts">
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
</script>

<div>
  <h1>Auth</h1>

  <form action="">

    <div class="input__field">
      <label for="username">Username</label>
      <input type="text" name="username" id="username">
    </div>

    <div class="input__field">
      <label for="password">Password</label>
      <input type="password" name="password" id="password">
    </div>

    <div class="">
      <a href="/register">Je n'ai pas de compte</a>
    </div>

    <div class="">
      <button type="submit" class="btn">Connection</button>
    </div>

  </form>
</div>

<style>
</style>