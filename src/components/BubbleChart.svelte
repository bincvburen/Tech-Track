<script>
  import { onMount } from "svelte";
  import * as d3 from "d3";
  import { fetchTracks } from "../lib/fetch.js"; // Import de nieuwe functie
  import { generateTrackLabel } from '../lib/utils.js'; // Pas het pad aan naar jouw projectstructuur

  export let trackType = "top";
  export let trackLimit = 20;
  export let trackTerm = "long_term";

  let tracks = [];
  let rotationInterval;

  onMount(async () => {
    tracks = await fetchTracks(trackType, trackLimit, trackTerm); // Gebruik de geïmporteerde functie
    createChart();
    window.addEventListener("resize", createChart);
  });

  const createChart = () => {
    const width = innerWidth;
    const height = innerHeight - 100;
    const centerX = width / 2;
    const centerY = height / 2;

    const svg = d3.select("#bubble-chart").attr("width", width).attr("height", height);
    svg.selectAll("*").remove();

    svg
      .append("text")
      .attr("x", centerX)
      .attr("y", centerY)
      .attr("text-anchor", "middle")
      .attr("font-size", "36px")
      .attr("fill", "#FFFFFF")
      .attr("font-weight", "bold")
      .text(() => generateTrackLabel(trackType, trackTerm, tracks.length));

    const bubbles = svg
      .selectAll("g")
      .data(tracks)
      .enter()
      .append("g")
      .on("mouseenter", (event, d) => handleMouseEnter(event, d))
      .on("mouseleave", (event, d) => handleMouseLeave(event, d));

    bubbles
      .append("circle")
      .attr("r", (d) => d.radius)
      .attr("fill", "#8D99AE");

    bubbles
      .append("clipPath")
      .attr("id", (_, i) => `clip${i}`)
      .append("circle")
      .attr("r", (d) => d.radius);

    bubbles
      .append("image")
      .attr("x", (d) => -d.radius)
      .attr("y", (d) => -d.radius)
      .attr("width", (d) => d.radius * 2)
      .attr("height", (d) => d.radius * 2)
      .attr("xlink:href", (d) => d.image)
      .attr("clip-path", (_, i) => `url(#clip${i})`)
      .on("click", (event, d) => {
        const trackId = d.url.split("/").pop();
        const trackUrl = `spotify:track:${trackId}`;
        window.location.href = trackUrl;
      });

    startRotation(bubbles, centerX, centerY);
  };

  const handleMouseEnter = (event, d) => {
    d3.select(event.currentTarget).select("circle").transition()
      .attr("r", d.radius * 1.2)
      .duration(200);  // Vloeiende overgang naar een grotere bubbel

    d3.select(event.currentTarget).select("image")
      // Start de rotatie van de afbeelding zelf met een lange duur
      .style("opacity", 1)
      .transition()
      .duration(20000)  // Duur van de rotatie
      .ease(d3.easeLinear)
      .attr("transform", "rotate(180)");

    rotationSpeed = 0.005;  // Snellere rotatie van de banen tijdens hover
  };
  

  const handleMouseLeave = (event, d) => {
    // Herstel de grootte van de bubbel
    d3.select(event.currentTarget).select("circle").transition().attr("r", d.radius);

    // Herstel de rotatie van de afbeelding zelf
    d3.select(event.currentTarget).select("image").transition()
      .duration(2000)  // Duur van de rotatie
      .ease(d3.easeLinear)
      .attr("transform", "rotate(-20)")  // Draai de afbeelding 180 graden
      .style("opacity", 0.25);  // Verlaag de opacity om de afbeelding donkerder te maken

    rotationSpeed = 0.2; // Snellere rotatie tijdens hover
  };

  let rotationSpeed = 0.2;

  const startRotation = (bubbles, centerX, centerY) => {
    const orbitRadiusX = innerWidth / 3;
    const orbitRadiusY = innerHeight / 4;
    const angles = tracks.map(() => Math.random() * 360);

    d3.timer(() => {
      bubbles.attr("transform", (_, i) => {
        const angle = (angles[i] += rotationSpeed);
        const x = centerX + Math.cos((angle * Math.PI) / 185) * orbitRadiusX;
        const y = centerY + Math.sin((angle * Math.PI) / 175) * orbitRadiusY;
        return `translate(${x}, ${y})`;
      });
    });
  };
</script>

<svg id="bubble-chart"></svg>
