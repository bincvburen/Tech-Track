<script>
  ///////////////////////
  // Basis Setup
  ///////////////////////
  import { onMount } from 'svelte';

  // Functie om het access token uit de URL te halen
  function getAccessTokenFromUrl() {
    const params = new URLSearchParams(window.location.hash.replace('#', ''));
    return params.get('access_token');
  }

  let errorMessage = '';

  // Haal het access token op zodra het component is geladen
  // Sla het token op in localStorage
  // Verwijder het token uit de URL door de hash leeg te maken
  // Redirect gebruiker terug naar de hoofdpagina
  // Als er geen token is, toon een foutmelding
  onMount(() => {
    const accessToken = getAccessTokenFromUrl();

    if (accessToken) {
      localStorage.setItem('spotify_access_token', accessToken);
      window.history.replaceState(null, '', window.location.pathname);
      window.location.href = '/'; 
    } else {
      errorMessage = 'Kon geen toegangstoken vinden, probeer opnieuw in te loggen.';
    }
  });

  // Functie om uit te loggen
  function logout() {
    localStorage.removeItem('spotify_access_token');
    window.location.reload();
  }
</script>

<main>
  <h2>Bezig met inloggen...</h2>

  {#if errorMessage}
    <p>{errorMessage}</p>
  {/if}

</main>



<style>

  main {
    text-align: center;
    margin-top: 50px;
  }

  h2 {
    font-size: 24px;
  }

  p {
    color: red;
    font-size: 16px;
  }
</style>
