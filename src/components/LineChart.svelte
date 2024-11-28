<script>
  ////////////////////////
  // Basis Setup
  ///////////////////////

  // Importeren van Svelte functies en D3
  // Importeren van fetchTracks en generateTrackLabel
  import { onMount } from "svelte";
  import * as d3 from "d3";
  import { fetchTracks } from "../lib/fetch.js"; // Import de nieuwe functie
  import { generateTrackLabel } from '../lib/utils.js'; // Pas het pad aan naar jouw projectstructuur

  // Exporteren van de variabelen
  export let trackType = "recent";
  export let trackLimit = 30;
  export let trackTerm = 'long_term';

  // Variabele om de tracks in op te slaan
  let tracks = [];

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
    const margin = { top: 100, right: 30, bottom: 150, left: 60 };
    const width = Math.max(1200, tracks.length * 80) - margin.left - margin.right;
    const height = innerHeight - 375;

    // Maak een container voor de grafiek
    // Voeg een div toe voor horizontaal scrollen
    // Voeg een SVG toe met de juiste afmetingen
    const container = d3.select("#chart-container").html("");
    const svg = container
      .append("div")
      .style("overflow-x", "scroll")
      .style("width", "100%")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

      // Titel van de grafiek
      svg
  .append("text")
  .attr("x", margin.left - 90) // Zet de tekst een beetje naar rechts van de linker marge
  .attr("y", -margin.top / 3) // Zet de tekst een beetje boven de grafiek
  .attr("text-anchor", "start") // Tekst begint aan de linkerkant
  .attr("font-size", "30px")
  .attr("fill", "#F39C12")
  .attr("font-weight", "bold")
  .text(() => generateTrackLabel(trackType, trackTerm, tracks.length));


    // X-as en Y-as schalen (de namen van de nummers)
    const x = d3.scaleBand()
      .domain(tracks.map(d => d.name))
      .range([0, width])
      .padding(0.1);

    const y = d3.scaleLinear()
      .domain([0, d3.max(tracks, d => d.duration)])
      .nice()
      .range([height, 0]);

// Voeg de X-as en Y-as toe
// Voeg de labels toe aan de X-as en Y-as
const addAxis = () => {
  svg.append("g")
    .call(d3.axisBottom(x).tickFormat(""))
    .attr("transform", `translate(0, ${height})`)
    .selectAll("text")
    .attr("fill", "#F39C12") 
    .style("font-family", "Merriweather, serif");

svg.append("text")
  .attr("x", width / 3.25)
  .attr("y", height + 130) 
  .attr("fill", "#F39C12")
  .style("font-family", "Merriweather, serif")
  .style("text-anchor", "middle")
  .attr("class", "x-axis-label")
  .text(() => `${generateTrackLabel(trackType, trackTerm, tracks.length)} →`);

  svg.append("g")
    .call(d3.axisLeft(y).tickSizeOuter(0))
    .selectAll("text")
    .attr("fill", "#F39C12")
    .style("font-family", "Merriweather, serif");

  svg.append("text")
    .attr("x", -height / 2)
    .attr("y", -40)
    .attr("transform", "rotate(-90)") 
    .attr("fill", "#F39C12")
    .style("font-family", "Merriweather, serif")
    .style("text-anchor", "middle")
    .text("Duur in seconden →");
};

    // Voeg een lijn toe voor de duur van de tracks
    const addLine = (data, color, key) => {
      const line = svg
        .append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", color)
        .attr("stroke-width", 2)
        .attr("d", d3.line().x(d => x(d.name) + x.bandwidth() / 2).y(d => y(d[key])))
        .attr("stroke-dasharray", function () {
          return this.getTotalLength();
        })
        .attr("stroke-dashoffset", function () {
          return this.getTotalLength();
        })
        .transition()
        .duration(2000)
        .ease(d3.easeCubicInOut)
        .attr("stroke-dashoffset", 0);
    };

    // Voeg punten toe voor de duur van de tracks
    // Voeg een click event toe om de track te openen in Spotify
    // Voeg een hover event toe om extra informatie te tonen
    const addPoints = (data, color, key) =>
      svg
        .selectAll(".circle")
        .data(data)
        .join("circle")
        .attr("class", "circle")
        .attr("cx", d => x(d.name) + x.bandwidth() / 2)
        .attr("cy", d => y(d[key]))
        .attr("r", 5)
        .attr("fill", color)
        .on("mouseenter", handleMouseEnter)
        .on("mouseleave", handleMouseLeave)
        .on("click", (event, d) => {
        const trackId = d.url.split("/").pop();
        const trackUrl = `spotify:track:${trackId}`;
        window.location.href = trackUrl;
      });

    // Voeg albumhoes toe op de X-as
    // Voeg een click event toe om de track te openen in Spotify
    // Voeg een hover event toe om extra informatie te tonen
    const addImagesOnXAxis = () => {
      svg.selectAll(".x-axis-images")
        .data(tracks)
        .join("image")
        .attr("class", "x-axis-images")
        .attr("xlink:href", d => d.image)
        .attr("x", d => x(d.name) + x.bandwidth() / 2 - 32)
        .attr("y", height + 10)
        .attr("width", 64)
        .attr("height", 64)
        .on("mouseenter", handleMouseEnter)
        .on("mouseleave", handleMouseLeave)
        .on("click", (event, d) => {
        const trackId = d.url.split("/").pop();
        const trackUrl = `spotify:track:${trackId}`;
        window.location.href = trackUrl;
      });

      // Voeg labels toe onder de nummers
      svg.selectAll(".x-axis-labels")
        .data(tracks)
        .join("text")
        .attr("class", "x-axis-labels")
        .attr("x", d => x(d.name) + x.bandwidth() / 2)
        .attr("y", height + 90)
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .style("fill", "#F39C12")
        .style("font-family", "Merriweather, serif")
        .text((_, i) => i + 1);
    };

    // Hover effecten voor extra informatie
    // Toon extra informatie over de track
    // Verberg de X-as label
    // Speel het nummer af
    const handleMouseEnter = (_, d) => {
      svg.selectAll(".hover-labels").remove();
      svg.select(".x-axis-label").style("visibility", "hidden"); 
      addHoverLabels(d);
    };

    // Omgekeerde van handleMouseEnter
    const handleMouseLeave = () => {
      svg.selectAll(".hover-labels").remove();
      svg.select(".x-axis-label").style("visibility", "visible");
    };

    // Voeg tekstlabels toe voor extra informatie
    // Deze labels worden getoond bij het hoveren over een track
    const addTextLabel = (xPos, yPos, text, fontSize, color) => {
      svg.append("text")
        .attr("x", xPos)
        .attr("y", yPos)
        .attr("text-anchor", "middle")
        .attr("class", "hover-labels")
        .style("font-size", fontSize)
        .style("fill", color)
        .style("font-family", "Merriweather, serif")
        .text(text);
    };

    // Voeg hover labels toe voor extra informatie
    // De labels bevatten de naam, artiest en duur van de track
    const addHoverLabels = d => {
      const xPos = x(d.name) + x.bandwidth() / 2;
      const yPos = height + 120;

      // Voeg de naam en artiest toe
      addTextLabel(xPos, yPos, `💿 ${d.name}`, "14px", "#F39C12");
      addTextLabel(xPos, yPos + 20, `🕺 ${d.artist}`, "12px", "#3498DB");

      // Bereken de duur in minuten en seconden
      const minutes = Math.floor(d.duration / 60);
      const seconds = Math.floor(d.duration % 60);
      const formattedDuration = seconds === 0 ? `${minutes} minuten` : `${minutes} minuten en ${seconds} seconden`;

      // Voeg de duur toe
      addTextLabel(xPos - x.bandwidth() / 10, y(d.duration) + 20, `${formattedDuration} dansen! 🪩`, "16px", "#2ECC71");
    };

    // Voeg de X-as en Y-as toe, lijn en punten en stijl de labels
    addAxis();
    addLine(tracks, "#F39C12", "duration");
    addPoints(tracks, "#F39C12", "duration");
    addImagesOnXAxis();
  };
</script>


<div id="chart-container"></div>

