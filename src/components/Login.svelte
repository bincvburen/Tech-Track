<script>
  import { onMount } from "svelte";
  import SpotifyWebApi from "spotify-web-api-js";

  let accessToken = null;
  let userData = null;

  // Spotify configuratie
  const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
  const redirectUri = 'http://localhost:5173/callback';
  const scopes = 'user-read-private user-read-email user-top-read user-read-recently-played user-read-playback-state';

  const isBrowser = typeof window !== 'undefined';

  onMount(() => {
    if (isBrowser) {
      accessToken = localStorage.getItem('spotify_access_token');
      if (accessToken) {
        const spotifyApi = new SpotifyWebApi();
        spotifyApi.setAccessToken(accessToken);
        spotifyApi.getMe().then((data) => {
          userData = data;
        }).catch((err) => {
          console.error('Fout bij ophalen van gebruikersgegevens:', err);
        });
      }
    }
  });

  function logout() {
  if (isBrowser) {
    // Verwijder de token uit localStorage
    localStorage.removeItem('spotify_access_token');
    
    // Reset de userData naar null
    userData = null;

    // Forceer een herlaad van de pagina
    window.location.reload(); // Hiermee wordt alles opnieuw geladen en zou de app volledig schoon moeten zijn.
  }
}




  function login() {
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes)}`;
    if (isBrowser) {
      window.location = authUrl;
    }
  }
</script>

<main>
    {#if userData}
    <div class="welkom-ingelogd">
      <h1>Hi, {userData.display_name}!</h1>
      <button on:click={logout} class="login-button">Uitloggen</button>
    </div>
    {:else}
    <div class="welkom">
      <h1>Welkom bij Charitfy</h1>
      <h2>Ontdek jouw muziek universum</h2>
      <button on:click={login} class="login-button">Inloggen met Spotify</button>
    </div>
    {/if}
</main>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,300;0,400;0,700;0,900;1,300;1,400;1,700;1,900&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;700;900&display=swap');

  /* Stijlen */
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    scroll-behavior: smooth;
  }

  h1, h2, h3 {
    font-family: "Merriweather", serif;
  }

  h1 {
    font-size: 60px;
    color: var(--goud);
  }

  h2 {
    font-size: 40px;
    color: var(--beige);
  }

  h3 {
    font-size: 25px;
    color: var(--beige);
  }

  .login-button {
    display: inline-block;
    padding: 10px 20px;
    color: var(--goud);
    text-decoration: none;
    border-radius: 50px;
    text-align: center;
    border: var(--goud) 2px solid;
    transition: transform 0.25s ease-in-out, border-color 0.25s ease-in-out, color 0.25s ease-in-out;
    width: 50%;
  }

  .login-button:hover {
    border-color: var(--groen);
    color: var(--groen);
    transform: scale(1.025);
  }

  .welkom-ingelogd .login-button {
    width: 10%;
    background-color: transparent;
  }

  .welkom-ingelogd .login-button:hover {
    color: var(--beige);
    transform: scale(1.025);
    border-color: var(--beige);
  }

  .welkom-ingelogd h1 {
    font-size: 30px;
  }

  .welkom {
    /* background-color: var(--beige); */
    text-align: center;
    border-radius: 20px;
    padding: 1em;
    display: flex;
    flex-direction: column;
    gap: 1em;
    display: flex;
    margin: auto;
    max-width: 1200px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .welkom-ingelogd {
    /* background-color: var(--beige); */
    text-align: center;
    border-radius: 20px;
    padding: 1em;
    display: flex;
    gap: 1em;
    display: flex;
    margin: auto;
    justify-content: space-between;
    align-items: center;
  }

  .carousel {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1em;
  }

  .carousel .track {
    background-color: beige;
    border-radius: 25px;
  }

  .track {
    display: flex;
  }

  .track-img img {
    border-radius: 25px 0 0 25px;
    width: 100px;
    height: auto;
  }

  .track-info {
    padding: 1em;
  }

  .carousel p {
    max-width: 100%;
  }
</style>