<script>
  ////////////////////////
  // Basis Setup
  ///////////////////////

  import { onMount } from "svelte";
  import SpotifyWebApi from "spotify-web-api-js";

  export let isLoggedIn = false;

  // Variabelen voor de gebruikersdata en de access token
  let accessToken = null;
  let userData = null;

  // Spotify API gegevens
const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const redirectUri = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;
const scopes = import.meta.env.VITE_SPOTIFY_SCOPES;

const isBrowser = typeof window !== 'undefined';

  ////////////////////////
  // Login en Logout
  ///////////////////////

// Check of de gebruiker is ingelogd zodra het component is geladen
// Als de gebruiker is ingelogd, haal de gebruikersgegevens op
// Als de gebruiker niet is ingelogd, zet de isLoggedIn variabele op false
// Forceer een herladen van de pagina
  onMount(() => {
    if (isBrowser) {
      accessToken = localStorage.getItem('spotify_access_token');
      if (accessToken) {
        const spotifyApi = new SpotifyWebApi();
        spotifyApi.setAccessToken(accessToken); 
        spotifyApi.getMe().then((data) => {
          userData = data;
          isLoggedIn = true;
        }).catch((err) => {
          console.error('Fout bij ophalen van gebruikersgegevens:', err);
          isLoggedIn = false; 
        });
      } else {
        isLoggedIn = false;
      }
    }
  });

  // Functie om uit te loggen
  // Verwijdert het access token uit localStorage
  // Zet de gebruikersdata en de isLoggedIn variabele op null en false
  function logout() {
    if (isBrowser) {
      localStorage.removeItem('spotify_access_token');
      userData = null;
      isLoggedIn = false;
      window.location.reload();
    }
  }

  // Functie om in te loggen
  // Redirect de gebruiker naar de Spotify autorisatiepagina
  // Gebruik de client ID, redirect URI en scopes
  function login() {
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes)}`;
    if (isBrowser) {
      window.location = authUrl;
    }
  }
</script>

<!-- Variabele content op basis van login -->
<main>
  {#if userData}
    <div class="welkom-ingelogd">
      <h1>Hi, {userData.display_name}!</h1>
      <button on:click={logout} class="login-button">Uitloggen</button>
    </div>
  {:else}
    <div class="welkom">
      <h1>Welkom bij Chartify</h1>
      <h2>Hoe ziet jouw muzikale universum eruit?</h2>
      <button on:click={login} class="login-button">Inloggen met Spotify</button>
    </div>
  {/if}
</main>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,300;0,400;0,700;0,900;1,300;1,400;1,700;1,900&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;700;900&display=swap');

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
    background-color: transparent;
  }

  .login-button:hover {
    border-color: var(--beige);
    color: var(--beige);
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
    height: 100vh;
  }

  .welkom-ingelogd {
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
</style>
