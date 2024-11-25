<script>
  import { onMount } from "svelte";
  import * as d3 from "d3";

  let topTracks = [];
  let chartData = [];
  let currentAudio = null;

  // Haal de data op bij het laden van de component
  onMount(async () => {
    const accessToken = localStorage.getItem("spotify_access_token");
    if (!accessToken) return;

    try {
      // Haal top tracks op
      const topTracksResponse = await fetch("https://api.spotify.com/v1/me/top/tracks?limit=50", {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      const topTracksData = await topTracksResponse.json();
      topTracks = topTracksData.items.map(track => ({
        name: track.name,
        id: track.id,
        image: track.album.images[0].url,
        previewUrl: track.preview_url
      }));

      // Haal audio features op
      const trackIds = topTracks.map(track => track.id).join(',');
      const audioFeaturesResponse = await fetch(`https://api.spotify.com/v1/audio-features?ids=${trackIds}`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      const audioFeaturesData = await audioFeaturesResponse.json();
      chartData = audioFeaturesData.audio_features.map((feature, index) => ({
        name: topTracks[index].name,
        danceability: feature.danceability * 100,
        energy: feature.energy * 100,
        image: topTracks[index].image,
        previewUrl: topTracks[index].previewUrl
      }));

      createChart();
    } catch (error) {
      console.error("Error fetching data", error);
    }
  });

  // Functie voor het aanmaken van de grafiek
  const createChart = () => {
    const margin = { top: 50, right: 30, bottom: 150, left: 60 };
    const width = Math.max(1200, chartData.length * 80) - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const container = d3.select("#chart-container");
    container.html(""); // Reset container bij herladen

    // Maak de SVG-container voor de grafiek
    const chartSvg = container.append("div")
      .style("overflow-x", "scroll")
      .style("width", "100%")
      .style("height", `${height + margin.top + margin.bottom}px`)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const x = d3.scaleBand()
      .domain(chartData.map(d => d.name))
      .range([0, width])
      .padding(0.1);

    const y = d3.scaleLinear()
      .domain([0, 100])
      .nice()
      .range([height, 0]);

    const yAxis = d3.axisLeft(y).tickSizeOuter(0).tickPadding(10);
    chartSvg.append("g")
      .call(yAxis)
      .attr("transform", `translate(0, 0)`)
      .selectAll("path, line, text")
      .attr("stroke", "#2ECC71")
      .attr("fill", "#2ECC71");

    chartSvg.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x).tickFormat(""))
      .selectAll("path, line")
      .attr("stroke", "#2ECC71");

    // Voeg lijnen toe voor danceability en energy
    const addLine = (data, color, className, yAccessor) => {
      const path = chartSvg.append("path")
        .datum(data)
        .attr("class", className)
        .attr("fill", "none")
        .attr("stroke", color)
        .attr("stroke-width", 2)
        .attr("d", d3.line()
          .x(d => x(d.name) + x.bandwidth() / 2)
          .y(d => y(d[yAccessor]))
        );

      // Animatie voor de lijn
      const totalLength = path.node().getTotalLength();
      path.attr("stroke-dasharray", totalLength)
        .attr("stroke-dashoffset", totalLength)
        .transition()
        .duration(2000)
        .ease(d3.easeLinear)
        .attr("stroke-dashoffset", 0);
    };

    addLine(chartData, "#F39C12", "danceability-line", "danceability");
    addLine(chartData, "#3498DB", "energy-line", "energy");

    // Voeg punten toe voor danceability en energy
    const addPoints = (data, color, className, yAccessor) => {
      chartSvg.selectAll(`.${className}`)
        .data(data)
        .join("circle")
        .attr("class", className)
        .attr("cx", d => x(d.name) + x.bandwidth() / 2)
        .attr("cy", d => y(d[yAccessor]))
        .attr("r", 5)
        .attr("fill", color)
        .style("opacity", 1);
    };

    addPoints(chartData, "#F39C12", "danceability-circle", "danceability");
    addPoints(chartData, "#3498DB", "energy-circle", "energy");

    // Voeg afbeeldingen toe voor de tracks
    chartSvg.selectAll("image")
      .data(chartData)
      .join("image")
      .attr("xlink:href", d => d.image)
      .attr("x", d => x(d.name) + x.bandwidth() / 2 - 32)
      .attr("y", height + 20)
      .attr("width", 64)
      .attr("height", 64)
      .style("cursor", "pointer")
      .on("mouseenter", (event, d) => {
        if (currentAudio) {
          currentAudio.pause();
          currentAudio.currentTime = 0;
        }
        currentAudio = new Audio(d.previewUrl);
        currentAudio.play();

        // Toon hover-effect
        chartSvg.selectAll(".danceability-line, .energy-line")
          .transition().style("opacity", 0.2);
        chartSvg.selectAll(".danceability-circle, .energy-circle")
          .transition().style("opacity", 0.2);

        chartSvg.selectAll(`circle`)
          .filter(c => c.name === d.name)
          .transition().style("opacity", 1);

        // Toon labels
        const labelsGroup = chartSvg.append("g").attr("class", "hover-labels");

        ["Dansbaarheid", "Energie"].forEach((label, i) => {
          const value = i === 0 ? d.danceability : d.energy;
          const bgColor = i === 0 ? "#F39C12" : "#3498DB";

          labelsGroup.append("rect")
            .attr("x", x(d.name) + x.bandwidth() / 2 - 50)
            .attr("y", y(value) - 35 - i * 30)
            .attr("width", 100)
            .attr("height", 25)
            .attr("rx", 5)
            .attr("fill", bgColor);

          labelsGroup.append("text")
            .attr("x", x(d.name) + x.bandwidth() / 2)
            .attr("y", y(value) - 20 - i * 30)
            .text(`${label}: ${value.toFixed(0)}%`)
            .attr("text-anchor", "middle")
            .attr("font-size", "12px")
            .attr("fill", "#FFF");
        });

        labelsGroup.append("text")
          .attr("x", x(d.name) + x.bandwidth() / 2)
          .attr("y", height + 100)
          .text(d.name)
          .attr("text-anchor", "middle")
          .attr("font-size", "14px")
          .attr("fill", "#FFF")
          .style("font-weight", "bold");
      })
      .on("mouseleave", () => {
        if (currentAudio) {
          currentAudio.pause();
          currentAudio.currentTime = 0;
        }

        chartSvg.selectAll(".hover-labels").remove();
        chartSvg.selectAll(".danceability-line, .energy-line")
          .transition().style("opacity", 1);
        chartSvg.selectAll(".danceability-circle, .energy-circle")
          .transition().style("opacity", 1);
      });
  };
</script>

<div id="chart-container" style="display: flex;"></div>
