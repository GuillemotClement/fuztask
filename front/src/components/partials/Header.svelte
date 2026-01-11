<script lang="ts">
</script>

<header>
  <div class="header_logo">
    <span class="logo__title">FuzTask</span>
  </div>

  <ul class="header_navigation">
    <li>
      <a href="/">Accueil</a>
    </li>
    <li>
      <a href="/projects">Projets</a>
    </li>
  </ul>

  <ul class="header__action">
    <li>
      <a href="/login">Connexion</a>
    </li>
    <li>
      <a href="/register">Inscription</a>
    </li>
    <li>
      <a href="/logout">Déconnexion</a>
    </li>
    <li>
      <a href="/profil">Profil</a>
    </li>
  </ul>

</header>

<style>
header {
  display: flex;
  justify-content: space-between;
  padding: 1rem 2rem;
  box-shadow: var(--shadow);
  align-items: center;
}

.header_navigation, .header__action {
  display: flex;
  column-gap: 0.8rem;
}

.logo__title {
  font-size: 2.5rem;
  font-weight: bold;
}


</style>