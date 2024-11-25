<script>
  import { onMount } from 'svelte';

  // Functie om het access token uit de URL te halen
  function getAccessTokenFromUrl() {
    const params = new URLSearchParams(window.location.hash.replace('#', ''));
    return params.get('access_token');
  }

  let errorMessage = '';

  // Haal het access token op zodra de component is geladen
  onMount(() => {
    const accessToken = getAccessTokenFromUrl();

    if (accessToken) {
      // Sla het token op in localStorage
      localStorage.setItem('spotify_access_token', accessToken);

      // Verwijder het token uit de URL door de hash leeg te maken
      window.history.replaceState(null, '', window.location.pathname); // Verwijdert het fragment (access_token) uit de URL

      // Redirect gebruiker terug naar de hoofdpagina
      window.location.href = '/'; // Gebruik de juiste route
    } else {
      // Als er geen token is, toon een foutmelding
      errorMessage = 'Kon geen toegangstoken vinden, probeer opnieuw in te loggen.';
    }
  });

  // Functie om uit te loggen
  function logout() {
    localStorage.removeItem('spotify_access_token');
    window.location.reload(); // Herlaad de pagina om de wijzigingen door te voeren
  }
</script>

<main>
  <h2>Bezig met inloggen...</h2>

  {#if errorMessage}
    <p>{errorMessage}</p>
  {/if}

  <!-- Voeg een uitlogknop toe voor testdoeleinden -->
  <button class="test" on:click={logout}>Uitloggen</button>
</main>



<style>

  .test {
    margin-top: 8em;

  }

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
