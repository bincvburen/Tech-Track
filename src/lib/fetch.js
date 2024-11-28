// Fetch functie om data op te halen van de Spotify API en deze vervolgens te exporteren
// Aan het begin wordt er gecontroleerd of er een access token is opgeslagen in localStorage

export const fetchTracks = async (trackType, trackLimit, trackTerm) => {
  const accessToken = localStorage.getItem("spotify_access_token");
  if (!accessToken) {
    console.warn("Geen Spotify access token gevonden. Log in om tracks te laden.");
    return [];
  }

  // Ik heb twee verschillende endpoints gemaakt voor het ophalen van toptracks en recente tracks
  // De endpoints bevatten beide andere query parameters en zijn daarom gescheiden
  const endpoints = {
    top: `https://api.spotify.com/v1/me/top/tracks?limit=${trackLimit}&time_range=${trackTerm}`,
    recent: `https://api.spotify.com/v1/me/player/recently-played?limit=${trackLimit}`,
  };

  // Haal de juiste URL op voor het type track aan de hand van de trackType
  // Voer een fetch request uit met de access token
  try {
    const url = endpoints[trackType];
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

   // Zet de data om in een array van objecten met de juiste properties met behulp van map
   // Gebruik de trackType om de juiste data te selecteren aangezien de data anders is voor toptracks en recente tracks
    const items = trackType === "recent" ? data.items.map(item => item.track) : data.items;
    return items.map(track => ({
      name: track.name,
      artist: track.artists.map(artist => artist.name).join(", "),
      url: track.external_urls.spotify,
      image: track.album.images[0]?.url,
      previewUrl: track.preview_url,
      duration: track.duration_ms / 1000,
      radius: Math.max(40, (track.popularity || 0) * 1.25),
    }));
  } catch (error) {
    console.error("Error met het laden van tracks:", error);
    return [];
  }
};