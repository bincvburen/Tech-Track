export const fetchTracks = async (trackType, trackLimit, trackTerm) => {
  const accessToken = localStorage.getItem("spotify_access_token");
  if (!accessToken) {
    console.warn("Geen Spotify access token gevonden. Log in om tracks te laden.");
    return [];
  }

  const endpoints = {
    top: `https://api.spotify.com/v1/me/top/tracks?limit=${trackLimit}&time_range=${trackTerm}`,
    recent: `https://api.spotify.com/v1/me/player/recently-played?limit=${trackLimit}`,
  };

  try {
    // Kies de juiste URL voor het type tracks
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

    // Genereer een uniforme structuur voor tracks
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
