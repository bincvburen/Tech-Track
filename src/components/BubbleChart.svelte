<script>
  ////////////////////////
  // Basis Setup
  ///////////////////////

  // Importeren van Svelte functies en D3
  // Importeren van fetchTracks en generateTrackLabel
  import { onMount } from "svelte";
  import * as d3 from "d3";
  import { fetchTracks } from "../lib/fetch.js";
  import { generateTrackLabel } from '../lib/utils.js';

  // Exporteren van de variabelen. 
  export let trackType = "top";
  export let trackLimit = 20;
  export let trackTerm = "long_term";

  // Variabele om de tracks in op te slaan
  let tracks = [];

  // Variabelen voor de rotatie van de afbeeldingen
  let rotationInterval;
  let rotationSpeed = 0.2;

  // Indien het component geladen is, haal de tracks op en maak de grafiek
  onMount(async () => {
    tracks = await fetchTracks(trackType, trackLimit, trackTerm);
    createChart();
    window.addEventListener("resize", createChart);
  });


  ////////////////////////
  // Grafiek Aanmaken
  ///////////////////////

  const createChart = () => {
    const width = innerWidth;
    const height = innerHeight - 100;
    const centerX = width / 2;
    const centerY = height / 2;

    const svg = d3.select("#bubble-chart").attr("width", width).attr("height", height);
    svg.selectAll("*").remove();

    // Titel van de grafiek
    svg
      .append("text")
      .attr("x", centerX)
      .attr("y", centerY)
      .attr("text-anchor", "middle")
      .attr("font-size", "36px")
      .attr("fill", "#FFFFFF")
      .attr("font-weight", "bold")
      .text(() => generateTrackLabel(trackType, trackTerm, tracks.length));

      // Maak een groep voor elke track
    const bubbles = svg
      .selectAll("g")
      .data(tracks)
      .enter()
      .append("g")
      .on("mouseenter", (event, d) => handleMouseEnter(event, d))
      .on("mouseleave", (event, d) => handleMouseLeave(event, d));

      // Voeg een cirkel toe aan de groep
    bubbles
      .append("circle")
      .attr("r", (d) => d.radius)
      .attr("fill", "#8D99AE");

      // Voeg een clipPath toe aan de groep om de afbeelding bij te snijden
    bubbles
      .append("clipPath")
      .attr("id", (_, i) => `clip${i}`)
      .append("circle")
      .attr("r", (d) => d.radius);

      // Voeg een afbeelding toe aan de groep
      // Gebruik de clipPath om de afbeelding bij te snijden
      // Voeg een click event toe om de track te openen in Spotify
      // Start de rotatie van de afbeeldingen
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

  // Hover effecten voor de bubbel
  // Vergroot de bubbel en start de rotatie van de afbeelding
  // Zet de helderheid van de afbeelding op 1
  // Laat alle bubbels langzamer draaien om focus te leggen op de huidige bubbel
  const handleMouseEnter = (event, d) => {
    d3.select(event.currentTarget).select("circle").transition()
      .attr("r", d.radius * 1.2)
      .duration(200); 

    d3.select(event.currentTarget).select("image")
      .style("opacity", 1)
      .transition()
      .duration(20000)  // Duur van de rotatie
      .ease(d3.easeLinear)
      .attr("transform", "rotate(180)");

    rotationSpeed = 0.005;
  };
  

  // Omgekeerde van handleMouseEnter
  const handleMouseLeave = (event, d) => {
    d3.select(event.currentTarget).select("circle").transition().attr("r", d.radius);

    d3.select(event.currentTarget).select("image").transition()
      .duration(2000)  
      .ease(d3.easeLinear)
      .attr("transform", "rotate(-20)") 
      .style("opacity", 0.25);  

    rotationSpeed = 0.2; 
  };


  // Start de rotatie van de afbeeldingen en bereken de nieuwe positie van de afbeelding
  // Gebruik de cosinus en sinus van de hoek om de cirkel te volgen, welke ik een kleine afwijking heb gegeven voor een speels effect
  const startRotation = (bubbles, centerX, centerY) => {
    const orbitRadiusX = innerWidth / 3;
    const orbitRadiusY = innerHeight / 4;
    const angles = tracks.map(() => Math.random() * 360);

    d3.timer(() => {
      bubbles.attr("transform", (_, i) => {
        const angle = (angles[i] += rotationSpeed);
        const x = centerX + Math.cos((angle * Math.PI) / 183) * orbitRadiusX;
        const y = centerY + Math.sin((angle * Math.PI) / 177) * orbitRadiusY;
        return `translate(${x}, ${y})`;
      });
    });
  };
</script>

<svg id="bubble-chart"></svg>
