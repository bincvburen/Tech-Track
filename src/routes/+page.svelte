<script>
  import BubbleChart from '../components/BubbleChart.svelte';
  import LineChart from '../components/LineChartTop.svelte';
  import LineChartRecent from '../components/LineChartRecent.svelte';
  import Login from '../components/Login.svelte';
  import "../global.css"; // Importeer de globale CSS

  // Standaardwaarden voor de selecties
  let chartType = 'LineChart'; // Universum of Inzicht
  let trackType = 'top'; // Toptracks of Recent afgespeeld
</script>

<main>
  <Login /> <!-- Login component -->
</main>

<!-- Dropdown-menu's voor keuze -->
<section class="keuze">
  <div>
    <select id="chart-type" bind:value={chartType} class="chartkeuze">
      <option value="BubbleChart">Universum</option>
      <option value="LineChart">Inzicht</option>
    </select>
  </div>
  <div>
    <select id="track-type" bind:value={trackType} class="chartkeuze">
      <option value="top">Toptracks</option>
      <option value="recent">Recent afgespeeld</option>
    </select>
  </div>
</section>

<!-- Toon component op basis van de keuze -->
<section class="chart">
  {#if chartType === 'BubbleChart'}
    <BubbleChart trackType={trackType} />
  {:else if chartType === 'LineChart'}
    <LineChart trackType={trackType} />
  {/if}
</section>

<style>
  /* Styling voor dropdowns */
  .chartkeuze {
    padding: 0.6em 1em;
    font-size: 1rem;
    border: 2px solid #2ECC71;
    border-radius: 8px;
    background-color: white;
    color: #333;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    outline: none;
    cursor: pointer;
    width: 200px;
    margin-bottom: 10px;
  }

  .chartkeuze:hover,
  .chartkeuze:focus {
    transform: translateY(-4px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
    border-color: #F39C12;
  }

  .keuze {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1em;
    margin-top: -3em;
  }

  .chart {
    margin-top: 2rem;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
  }

  label {
    font-size: 1rem;
    margin-right: 0.5em;
    font-weight: bold;
    color: #2ECC71;
  }
</style>
