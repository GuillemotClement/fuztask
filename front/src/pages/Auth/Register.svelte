<script lang="ts">
  import { date, z } from "zod";
    import { authClient } from "../../libs/auth-client";
    import { goto } from "@mateothegreat/svelte5-router";

  const registerSchema = z.object({
    email: z.email(),
    name: z.string().min(2, "Au moins 2 caractères").max(100, "100 catactères maximum"),
    password: z.string().min(8, "Au moins 8 caractères"),
    confirmPassword: z.string()
  }).refine((data) => data.password === data.confirmPassword, {
    message: "La validation du mot de passe à échouer",
    path: ['confirmPassword']
  })

  type RegisterFormProps = {
    email: string;
    name: string;
    password: string;
    confirmPassword: string;
  }

  // contient les valeurs du formulaire
  let formState = $state<RegisterFormProps>({
    email: "",
    name: "",
    password: "",
    confirmPassword: "",
  })

  let isSubmitting = $state(false);
  let error = $state("");
  let fieldErrors = $state<Record<string, string>>({});

  const handleSubmit = async(e: Event) => {
    e.preventDefault();

    // reset des erreurs
    fieldErrors = {};
    error = "";
    isSubmitting = true;

    // validation Zod
    const validate = registerSchema.safeParse(formState);
    if(!validate.success){
      const errors = validate.error.flatten().fieldErrors;
      // conversion en objet pour affichage des erreurs
      for(const [field, messages] of Object.entries(errors)){
        if(messages && messages.length > 0){
          fieldErrors[field] = messages[0];
        }
      }
      isSubmitting = false;
      formState.password = "";
      formState.confirmPassword = "";
      return 
    }

    const payload = validate.data;

    try {
      const { data, error: authError } = await authClient.signUp.email(payload);
      console.log(data);
      console.log(error);

      if(authError){
        error =  authError.message || "Erreur d'inscription"
        return
      }

      // redirerction si succes
      goto("/tasks");
    }catch(err){
      console.error(err);
      error = err instanceof Error ? err.message : "Erreur inattendue";
    }finally{
      isSubmitting = false;
    }
  }

  const resetForm = () => {
    formState.email = "";
    formState.name = "";
    formState.password = "";
    formState.confirmPassword = "";
  }

</script>

<div class="main_container">
  <h1 class="title__page">Inscription</h1>

  <form action="" onsubmit={(e) => handleSubmit(e)} class="form debug">
    <div class="input__field">
      <label for="email">Email</label>
      <input type="email" name="email" id="email" bind:value={formState.email}>
      {#if fieldErrors.email}
        <span class="error">{fieldErrors.email}</span>
      {/if}
    </div>

    <div class="input__field">
      <label for="name">Username</label>
      <input type="text" name="name" id="name" bind:value={formState.name}>
      {#if fieldErrors.name}
        <span class="error">{fieldErrors.name}</span>
      {/if}
    </div>

    <div class="input__field">
      <label for="password">Mot de passe</label>
      <input type="password" name="password" id="password" bind:value={formState.password}>
      {#if fieldErrors.password}
        <span class="error">{fieldErrors.password}</span>
      {/if}
    </div>

    <div class="input__field">
      <label for="confirmPassword">Confirmation de mot de passe</label>
      <input type="password" name="confirmPassword" id="confirmPassword" bind:value={formState.confirmPassword}>
      {#if fieldErrors.confirmPassword}
        <span class="error">{fieldErrors.confirmPassword}</span>
      {/if}
    </div>

    {#if error}
      <p class="error">{error}</p>
    {/if}
      
    <div class="form__link">
      <a href="/login" class="link__secondary">J'ai déjà un compte</a>
    </div>

    <div class="form__action">
      <button type="button" class="btn" onclick={resetForm}>Effacer</button>

      <button type="submit" class="btn" disabled={isSubmitting}>{ isSubmitting ? "Inscription ..." : "S'inscrire"}</button>
    </div>

  </form>
</div>

<style>
  .error {
    color: red;
    font-style: italic;
  }

  .form {
    width: 50rem;
    margin: 0 auto;
  }

  .input__field {
    display: flex;
    flex-direction: column;
  }

  .main_container {
    padding: 2rem 0;
  }

  .form__link {
    font-style: italic;
    font-size: 1.4rem;
    text-align: center;
    margin-top: 1.5rem;
  }

  .link__secondary {
    &:hover{
      color: blue;
    }
  }
</style>