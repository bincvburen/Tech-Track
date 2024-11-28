<script>
  import BubbleChart from '../components/BubbleChart.svelte';
  import LineChart from '../components/LineChart.svelte';
  import "../global.css"; // Importeer de globale CSS

  // Standaardwaarden voor de selecties
  let chartType = 'BubbleChart'; // Universum of Inzicht
  let trackType = 'top'; // Toptracks of Recent afgespeeld
  let trackLimit = '20'; // Toptracks of Recent afgespeeld
  let trackTerm = 'long_term'; // Toptracks of Recent afgespeeld

  // Variabele om te controleren of de helptekst zichtbaar moet zijn
  let helpTextVisible = true;

  // Update logica voor trackTerm afhankelijk van trackType
  function handleTrackTypeChange(event) {
    if (event.target.value === 'recent') {
      document.getElementById('track-term').disabled = true; // Track-term select is niet aanpasbaar
    } else {
      document.getElementById('track-term').disabled = false; // Track-term select is aanpasbaar
    }

    // Verberg de helptekst zodra er iets is aangepast
    helpTextVisible = false;
  }

  // Voeg een algemene wijzigingsfunctie toe voor andere selecties
  function handleSelectChange() {
    helpTextVisible = false; // Verberg de helptekst zodra een selectie is aangepast
  }
</script>

<section class="keuze">
    <div>
      <select id="chart-type" bind:value={chartType} class="chartkeuze" on:change={handleSelectChange}>
        <option disabled>Visualisatie</option>
        <option value="BubbleChart">Universum</option>
        <option value="LineChart">Inzicht</option>
      </select>
    </div>
    <div>
      <select id="track-type" bind:value={trackType} class="chartkeuze" on:change={handleTrackTypeChange}>
        <option disabled>Type</option>
        <option value="top">Toptracks</option>
        <option value="recent">Recente tracks</option>
      </select>
    </div>
    <div>
      <select id="track-limit" bind:value={trackLimit} class="chartkeuze" on:change={handleSelectChange}>
        <option disabled>Aantal</option>
        <option value="10">10 Tracks</option>
        <option value="20">20 Tracks</option>
        <option value="30">30 Tracks</option>
        <option value="40">40 Tracks</option>
        <option value="50">50 Tracks</option>
      </select>
    </div>
    <div>
      <select id="track-term" bind:value={trackTerm} class="chartkeuze" disabled={trackType === 'recent'} on:change={handleSelectChange}>
        <option disabled>Periode</option>
        <option value="long_term">Afgelopen jaar</option>
        <option value="medium_term">Afgelopen half jaar</option>
        <option value="short_term">Afgelopen maand</option>
      </select>
    </div>
</section>

{#if helpTextVisible}
<div class="help-box">
  <h2>Welkom! Kies een visualisatie en filter naar jouw wens</h2>
  <p>Je kunt de visualisatie aanpassen op het <strong>type tracks</strong>, de <strong>hoeveelheid</strong> en over welke <strong>tijdsperiode.</strong> Op zoek naar <strong>meer inzicht in je tracks?</strong> Wissel dan 'Universum' naar 'Inzicht'. Veel plezier!</p>
</div>
{/if}

<!-- Toon component op basis van de keuze -->
<section class="chart">
  {#if chartType === 'BubbleChart'}
    {#key `${trackType}-${trackLimit}-${trackTerm}`}  <!-- key met trackType, trackLimit en trackTerm -->
      <BubbleChart {trackType} {trackLimit} {trackTerm} />
    {/key}
  {:else if chartType === 'LineChart'}
    {#key `${trackType}-${trackLimit}-${trackTerm}`}  <!-- key met trackType, trackLimit en trackTerm -->
      <LineChart {trackType} {trackLimit} {trackTerm} />
    {/key}
  {/if}
</section>

<style>

  .help-box {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border: 2px solid var(--goud);
    width: 75%;
    border-radius: 20px;
    margin: 2em auto;
  }

  .help-box p,
  .help-box h2 {
    text-align: center;
    color: var(--beige);
    max-width: 70%;
  }

  strong {
    color: var(--goud);
  }

  /* Styling voor dropdowns */
  .chartkeuze {
    padding: 0.6em 1em;
    font-size: 1rem;
    border: 2px solid #2ECC71;
    border-radius: 8px;
    background-color: white;
    color: #333;
    transition: all 0.3s ease;
    outline: none;
    cursor: pointer;
    width: 200px;
    margin-bottom: 10px;
  }
  
  .chartkeuze:hover,
  .chartkeuze:focus {
    transform: translateY(-4px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
    border-color: #00ff6a;
    background-color: rgba(255, 255, 255, 0.8);
  }

  .chartkeuze:disabled {
    border-color: #f35212;
    background-color: rgba(255, 255, 255, 0.587);
  }

  .chartkeuze:disabled:hover {
    cursor: not-allowed; /* Zorg ervoor dat de cursor verandert wanneer je over het disabled vakje beweegt */
  }

  .keuze {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1em;
    margin-top: -3em;
  }
  
  label {
    font-size: 1rem;
    margin-right: 0.5em;
    font-weight: bold;
    color: #2ECC71;
  }
</style>
