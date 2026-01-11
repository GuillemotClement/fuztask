<script lang="ts">
  import { z } from "zod";
    import { authClient } from "../../libs/auth-client";
    import { goto } from "@mateothegreat/svelte5-router";

  const schema = z.object({
    email: z.email(),
    password: z.string()
  });

  type LoginFormProps = {
    email: string;
    password: string;
  }

  let formState = $state<LoginFormProps>({
    email: "",
    password: ""
  });

  let isSubmitting = $state(false);
  let error = $state("");
  let fieldErrors = $state<Record<string, string>>({});

  const handleSubmit = async(e:Event) => {
    e.preventDefault();

    fieldErrors = {};
    error = "";
    isSubmitting = true;

    const validate = schema.safeParse(formState);
    if(!validate.success){
      const errors = validate.error.flatten().fieldErrors;
      for(const [field, messages] of Object.entries(errors)){
        if(messages && messages.length > 0){
          fieldErrors[field] = messages[0];
        }
      }
      isSubmitting = false;
      formState.password = "";
      return;
    }

    const payload = validate.data;

    try{
      const { data, error: authError } = await authClient.signIn.email(payload);
      console.log(data);
      console.log(authError);

      if(authError){
        error = authError.message || "Erreur de login";
        return;
      }

      goto("/tasks");
    }catch(err){
      console.error(err);
      error = err instanceof Error ? err.message : "erreur inattendue";
    }finally{
      isSubmitting = false;
    }
  }

  const resetForm = () => {
    formState.email = "";
    formState.password = "";
  }
</script>

<div class="main_container">
  <h1 class="title__page">Connection</h1>

  <form action="" onsubmit={(e) => handleSubmit(e)} class="form debug">
    <div class="input__field">
      <label for="email">Email</label>
      <input type="email" name="email" id="email" bind:value={formState.email}>
      {#if fieldErrors.email}
        <span class="error">{fieldErrors.email}</span>
      {/if}
    </div>



    <div class="input__field">
      <label for="password">Mot de passe</label>
      <input type="password" name="password" id="password" bind:value={formState.password}>
      {#if fieldErrors.password}
        <span class="error">{fieldErrors.password}</span>
      {/if}
    </div>

    {#if error}
      <p class="error">{error}</p>
    {/if}
      
    <div class="form__link">
      <a href="/register" class="link__secondary">Je n'ai pas de compte</a>
    </div>

    <div class="form__action">
      <button type="button" class="btn" onclick={resetForm}>Effacer</button>

      <button type="submit" class="btn" disabled={isSubmitting}>{ isSubmitting ? "Connection ..." : "Connexion"}</button>
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