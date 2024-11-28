<script>
  import Login from '../components/Login.svelte';
  import KeuzeMenu from '../components/KeuzeMenu.svelte';
  import "../global.css"; // Importeer de globale CSS

  let isLoggedIn = true; // Houd de inlogstatus bij
</script>

<main>
  <!-- Login component -->
  <Login bind:isLoggedIn />

  <!-- Alleen tonen als de gebruiker is ingelogd -->
  {#if isLoggedIn}
    <KeuzeMenu />
  {/if}
</main>
