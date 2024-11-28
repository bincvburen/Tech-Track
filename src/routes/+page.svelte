<script>
  ////////////////////////
  // Basis Setup
  ///////////////////////

  import Login from '../components/Login.svelte';
  import KeuzeMenu from '../components/KeuzeMenu.svelte';
  import "../global.css"; 

  // Variabele om te controleren of de gebruiker is ingelogd
  let isLoggedIn = true; 
</script>

<main>
  <!-- Login component -->
  <Login bind:isLoggedIn />

  <!-- Keuze opties en filters -->
  {#if isLoggedIn}
    <KeuzeMenu />
  {/if}
</main>
