<script>
  import { onMount } from "svelte";
  import * as d3 from "d3";
  export let trackType = "recent";  // Ontvangt trackType als prop van bovenaf

  let tracks = [];
  let rotationInterval;

  onMount(() => {
    fetchTracks(); // Laad de tracks bij het laden van de component
  });

  // Fetch de tracks op basis van de selectie
  const fetchTracks = async () => {
    const accessToken = localStorage.getItem("spotify_access_token");
    if (accessToken) {
      try {
        const url = trackType === "top"
          ? "https://api.spotify.com/v1/me/top/tracks?limit=20"
          : "https://api.spotify.com/v1/me/top/tracks?limit=5";

        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const { items } = await response.json();
        
        // Verwerk de tracks
        tracks = items.map(({ track, name, external_urls, album, preview_url, popularity }) => ({
          name: track ? track.name : name,
          url: (track ? track.external_urls : external_urls).spotify,
          image: track ? track.album.images[0].url : album.images[0].url,
          previewUrl: track ? track.preview_url : preview_url,
          radius: Math.max(40, (track ? track.popularity : popularity) * 1.5), // Grotere bubbels
        }));

        createChart();
      } catch (error) {
        console.error("Error fetching tracks:", error);
      }
    }
  };

  // Creëer de grafiek
  const createChart = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const svg = d3.select("#bubble-chart")
      .attr("width", width)
      .attr("height", height);

    svg.append("text")
      .attr("x", width / 2)
      .attr("y", height / 2)
      .attr("text-anchor", "middle")
      .attr("font-size", "36px")
      .attr("fill", "#FFFFFF")
      .attr("font-weight", "bold")
      .text(trackType === "top" ? "Top Tracks" : "Recent Tracks");

    const bubbles = svg.selectAll("g")
      .data(tracks)
      .enter()
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`)
      .on("mouseenter", (event, d) => handleMouseEnter(event, d))
      .on("mouseleave", (event, d) => handleMouseLeave(event, d));

    bubbles.append("circle")
      .attr("r", d => d.radius)
      .attr("fill", "#8D99AE");

    bubbles.append("clipPath")
      .attr("id", (d, i) => `clip${i}`)
      .append("circle")
      .attr("r", d => d.radius)
      .attr("cx", 0)
      .attr("cy", 0);

    bubbles.append("image")
      .attr("x", d => -d.radius)
      .attr("y", d => -d.radius)
      .attr("width", d => d.radius * 2)
      .attr("height", d => d.radius * 2)
      .attr("xlink:href", d => d.image)
      .attr("clip-path", (d, i) => `url(#clip${i})`);

    startRotation();
  };

  const handleMouseEnter = (event, d) => {
    d3.select(event.currentTarget)
      .select("circle")
      .transition()
      .attr("r", d.radius * 1.2);

    if (rotationInterval) rotationInterval.stop();

    const audio = new Audio(d.previewUrl);
    audio.play();
    d.audio = audio;
  };

  const handleMouseLeave = (event, d) => {
    d3.select(event.currentTarget)
      .select("circle")
      .transition()
      .attr("r", d.radius);

    startRotation();

    if (d.audio) {
      d.audio.pause();
      d.audio.currentTime = 0;
    }
  };

  const startRotation = () => {
    rotationInterval = d3.interval(() => {
      d3.selectAll("#bubble-chart g").attr("transform", (d, i) => {
        const angle = (Date.now() / (5000 + i * 300)) % 360;
        const orbitRadius = i % 2 === 0 ? 300 : 450;
        const x = window.innerWidth / 2 + Math.cos(angle) * orbitRadius;
        const y = window.innerHeight / 2 + Math.sin(angle) * orbitRadius;
        return `translate(${x}, ${y})`;
      });
    }, 20);
  };
</script>

<svg id="bubble-chart"></svg>
