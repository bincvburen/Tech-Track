
# Information Design Tech Track

In deze wiki documenteer ik mijn technisch onderzoek, waarbij ik mijn keuzes uitleg en mijn voortgang en uitdagingen tijdens de ontwikkeling van mijn applicatie beschrijf. Open het [ReadMe Bestand](README.md) om de app te gebruiken. Ik leg de code stuk voor stuk uit en neem deze met je door.

## Concept

### Interesse voor mijn concept

Voordat ik begon met de opdracht twijfelde ik tussen twee concepten. Uiteindelijk heb ik voor muziek gekozen, omdat de Spotify API en vooral de dynamiek in de gegevens mij erg interessant leek.

#### Muziek
Muziek is al van jongs af aan een grote passie van me, wat niet vreemd is aangezien ik opgegroeid ben in een muzikaal gezin. Zelf ben ik DJ en draai ik regelmatig op de leukste feestjes. Veel inspiratie haal ik dan ook van Spotify. Elk jaar kijk ik uit naar mijn Spotify Wrapped, en op een gegeven moment vroeg ik me af of ik iets met al die data kon doen. Zo ontdekte ik de Spotify API, waarmee ik allerlei gegevens uit je account kan halen en op een visuele manier kan presenteren.

#### Vliegen
Vliegen is voor mij iets wat ik regelmatig doe, aangezien mijn moeder senior purser is. Het was altijd een avontuur om samen met haar op verschillende plekken te komen. Door die ervaring ben ik geïnteresseerd geraakt in alles rondom vliegvelden en luchtvaart. Onlangs ontdekte ik de Schiphol API, waarmee je allerlei informatie over vluchten kunt ophalen. Het leek me een interessante uitdaging om met deze data te werken en deze visueel weer te geven.

## Onderzoeksvraag

**“Hoe dansbaar en energiek zijn de nummers waar ik naar luister en hoe liggen deze in verband tot elkaar over een bepaalde periode?”**

## Database

Ik gebruik de Spotify API om een koppeling te maken met iemands luisteractiviteiten. Deze database is dynamisch en in real-time up-to-date met iemands Spotify account. De database bevat veel gegevens met soms vrij grote arrays met objecten.

Er is ontzettend veel op te halen uit iemand zijn account. De informatie die ik nodig heb zijn:

- Top Track
- Aanbevelingen
- Recent afgespeelde tracks
- Account (naam)

Per nummer haal ik de volgende gegevens op: 
- Naam
- Artiest
- Spotify-url
- Preview-url
- Cover afbeelding
- Duur
- Dansbaarheid
- Energie-niveau
- Populariteit

### Voorbeeld van een `Track Object`

```json
{
  "tracks": [
    {
      "album": {
        "name": "string",
        "release_date": "1981-12",
        "images": [
          {
            "url": "https://i.scdn.co/image/ab67616d00001e02ff9ca10b55ce82ae553c8228"
          }
        ],
        "uri": "spotify:album:2up3OPMp9Tb4dAKM2erWXQ"
      },
      "artists": [
        {
          "name": "string",
          "uri": "string"
        }
      ],
      "name": "string",
      "duration_ms": 0,
      "popularity": 0,
      "preview_url": "string",
      "uri": "string"
    }
  ]
}
```

# Workflow en Eindopdracht Spotify API Integratie

## Workflow

1. Vraag toegangssleutel
2. Laat gebruiker inloggen
3. Fetch bepaalde data
4. Filter bepaalde data
5. Laad data in visualisatie

## Eindopdracht

### Spotify API Verbinding en Inloggen

Het eerste wat ik doe, is verbinding maken met de Spotify API en de gebruiker de mogelijkheid geven om in te loggen en uit te loggen. Bij het laden van de pagina controleer ik eerst of er al een toegangstoken is opgeslagen in de sessie. Als dat het geval is, haal ik gebruikersinformatie op van de Spotify API. Als er geen token is, laat ik de gebruiker inloggen via de Spotify-autorisatiepagina.

Wanneer de gebruiker is ingelogd, kan ik de benodigde data gaan fetchen. Dit gebeurt met de onderstaande functie:

```javascript
const fetchUserData = async () => {
  try {
    const response = await fetch("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        logout(); // Logout wanneer token ongeldig is
      }
      throw new Error("API-fout");
    }

    const data = await response.json();
    userData = data;
    isLoggedIn = true;
  } catch (error) {
    console.error("Fout bij ophalen van gegevens:", error);
  } finally {
    isLoading = false;
  }
};
```

# Spotify API Integratie en Visualisatie

In dit project worden de gegevens van de Spotify API gebruikt om interactieve visualisaties te maken. De visualisatie is afhankelijk van vier belangrijke factoren:

1. **Type Chart** (Bubbel of Lijn)
2. **Type Nummers** (Top of Recent)
3. **Aantal Nummers** (10, 20, 30, 40 of 50)
4. **Tijdsperiode** (Kort, Medium of Lang)

### Type Chart

De **Type Chart** bepaalt hoe de visualisatie eruit zal zien:

- **Bubblechart**: Nummers worden weergegeven als "bubbels" die rondvliegen in een soort universum. Deze optie geeft een speelse uitstraling met interactieve effecten.
- **Linechart**: Deze optie biedt meer inzicht in de dansbaarheid en het energie-niveau van de nummers, wat vooral handig is om trends te visualiseren.

### Andere Selecties

De andere drie opties passen de fetch aan:

- **Type Nummers**: Dit bepaalt of je de **Toptracks** of de meest **Recent afgespeelde** nummers haalt.
- **Aantal Nummers**: Dit is het aantal nummers dat je wilt ophalen (bijvoorbeeld 10, 20, 30, 40 of 50).
- **Tijdsperiode**: Dit bepaalt de periode waarover je de topnummers haalt (Kort, Medium of Lang). 

Met deze keuzes kan de gebruiker bijvoorbeeld zijn 10 topnummers van het afgelopen jaar ophalen, of de 50 meest recent afgespeelde nummers bekijken. Dit maakt de visualisatie dynamisch, afhankelijk van de invoer van de gebruiker. De data is bovendien persoonsgebonden en wordt in real-time opgehaald.

### Standaardwaarden voor Selecties

```javascript
let chartType = 'BubbleChart'; 
let trackType = 'top';
let trackLimit = '20';
let trackTerm = 'long_term';
```

## Data Fetchen

Afhankelijk van de selectie van de gebruiker, worden de juiste API-endpoints aangesproken om de gegevens op te halen. Het fetchen van de gegevens gebeurt via een dynamisch endpoint, waarbij de URL wordt aangepast op basis van de geselecteerde opties. Er zijn twee hoofdcategorieën: **Toptracks** en **Recente Tracks**. 

### Toptracks

Voor **Toptracks** gebruiken we een endpoint dat de gegevens van de meest populaire tracks van de gebruiker ophaalt, gebaseerd op de geselecteerde tijdsperiode (kort, medium, lang). Dit wordt gedaan door het `trackTerm` parameter toe te voegen aan de URL. De beschikbare tijdsperioden voor de **Toptracks** zijn als volgt:

- `short_term`: de afgelopen 4 weken
- `medium_term`: de afgelopen 6 maanden
- `long_term`: alle tijd, maximaal 4 jaar

[Spotify Web API: Get User's Top Artists and Tracks](https://developer.spotify.com/documentation/web-api/reference/get-users-top-artists-and-tracks)

```javascript
const endpoints = {
  top: `https://api.spotify.com/v1/me/top/tracks?limit=${trackLimit}&time_range=${trackTerm}`,
};
```

### Recente Tracks

Zoals eerder genoemd, worden voor **Recente Tracks** de laatst afgespeelde nummers opgehaald. Dit gebeurt door het aanspreken van het endpoint voor recente tracks via de Spotify API. Het belangrijkste verschil is dat voor recente tracks geen tijdsperiode nodig is, in tegenstelling tot de **Toptracks**.

[Spotify Web API: Get Recently Played Tracks](https://developer.spotify.com/documentation/web-api/reference/get-recently-played)


```javascript
const endpoints = {
  recent: `https://api.spotify.com/v1/me/player/recently-played?limit=${trackLimit}`,
};
```

## Data Ophalen

Na het bepalen welk type nummers we willen ophalen (Toptracks of Recente Tracks), moeten we de juiste API-endpoints aanroepen om de gegevens te verzamelen. Hieronder wordt uitgelegd hoe je de data ophaalt op basis van de gebruikersinstellingen.

### Ophalen van nummers

De gegevens voor **Toptracks** worden opgehaald via het endpoint voor de topnummers van de gebruiker, waarbij rekening wordt gehouden met de geselecteerde `trackTerm` (kort, medium, lang) en `trackLimit` (aantal nummers).

```javascript
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
```

De opgehaalde gegevens worden omgezet naar een format met de tracknaam, albumafbeelding, preview-URL en populariteit. Omdat de data die terugkomt verschillend is tussen recent en top haal ik recente nummers op in `item.track` en top `data.items`.

Vervolgens wordt er een nieuwe lijst van objecten gemaakt met relevante informatie.

## Chart aanmaken

In deze visualisatie maak ik gebruik van twee typen charts. Hieronder leg ik de linechart uit, die de data op een andere manier verwerkt dan de bubble chart. De linechart biedt een gedetailleerder inzicht in de duur van nummers, en ik begin met het instellen van de schaal voor de grafiek.

### Schaalinstellingen
In de eerste stap maak ik gebruik van de d3.scaleBand() en d3.scaleLinear() functies van D3.js om de schalen voor de X- en Y-assen in te stellen. Deze schalen zorgen ervoor dat de data correct gepositioneerd wordt op de grafiek.


De X-as wordt gebruikt om de nummers weer te geven. Ik gebruik scaleBand() om de nummers gelijkmatig over de breedte van de grafiek te verdelen. Elk nummer krijgt een positie op de X-as, afhankelijk van de naam van het nummer.

De Y-as toont de duur van de nummers in seconden. Ik gebruik scaleLinear() voor de Y-as om de duur van de nummers lineair te schalen van 0 tot de maximale duur van de nummers in de dataset. De d3.max() functie helpt me de grootste waarde te vinden, zodat de Y-as de juiste schaal krijgt.

```javascript
    const x = d3.scaleBand()
      .domain(tracks.map(d => d.name))
      .range([0, width])
      .padding(0.1);

    const y = d3.scaleLinear()
      .domain([0, d3.max(tracks, d => d.duration)])
      .nice()
      .range([height, 0]);
```

### Assen en Labels
Na het instellen van de schalen voeg ik de X- en Y-assen toe aan de grafiek.  Voor de X-as voeg ik een extra label toe dat de tijdsperiode van de tracks weergeeft. Het label wordt gepositioneerd onder de grafiek en vertelt de gebruiker welk type data wordt weergegeven.

De X-as wordt getekend zonder tick-formatting (om de naam van de nummers te verbergen). Het label voor de X-as wordt dynamisch gegenereerd en geeft aan welke gegevens we weergeven op basis van de gekozen instellingen (bijvoorbeeld "Top tracks" of "Recent tracks").

De Y-as toont de duur van de nummers. Ik gebruik dezelfde kleur en lettertype als bij de X-as, zodat de stijlen consistent zijn. De Y-as wordt getekend zonder buitenste tickmarks, zodat de grafiek er netter uitziet.

```javascript
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
```

### Lijn tekenen

In de `addLine` functie voeg ik een geanimeerde lijn toe aan de visualisatie door eerst een `path`-element te creëren en het te vullen met data. De lijn wordt getekend op basis van de X- en Y-waarden van de dataset, waarbij de X-positie afhankelijk is van de naam van het nummer en de Y-waarde van het gekozen dataveld. Door gebruik te maken van `stroke-dasharray` en `stroke-dashoffset` wordt de lijn eerst als gestippeld weergegeven, waarna een animatie de lijn zichtbaar maakt door deze van gestippeld naar normaal te veranderen.

De lijn heb ik gemaakt met behulp van de [d3-shape line module](https://d3js.org/d3-shape/line).


```javascript
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

```

### Interacties

## Hoveren

Wanneer een gebruiker over een punt of afbeelding hovert, komen er verschillende gegevens naar voren. Deze gegevens zijn:

- Duur van het nummer
- Titel van het nummer
- Artiest van het nummer
- Het nummer speelt af
- Het label op de X-as verdwijnt

De volgende functies zorgen ervoor dat dit gebeurt:

```javascript
const handleMouseEnter = (_, d) => {
  svg.selectAll(".hover-labels").remove();
  svg.select(".x-axis-label").style("visibility", "hidden"); 
  addHoverLabels(d);

  if (currentAudio) currentAudio.pause();
  currentAudio = new Audio(d.previewUrl);
  currentAudio.play();
};

const handleMouseLeave = () => {
  svg.selectAll(".hover-labels").remove();
  svg.select(".x-axis-label").style("visibility", "visible");
  if (currentAudio) currentAudio.pause();
};
```

### Klik Interactie

De klik-interactie in deze visualisatie zorgt ervoor dat wanneer een gebruiker op een punt klikt, de bijbehorende track wordt geopend in Spotify. Dit gebeurt door de `click` event listener die aan elk punt is gekoppeld. De volgende acties worden uitgevoerd:

  - De URL van het nummer wordt opgehaald uit de data (`d.url`).
  - De `trackId` wordt uit de URL van de track gehaald. Dit wordt gedaan door de laatste segmenten van de URL (na de laatste '/') te nemen.
  - Vervolgens wordt een `trackUrl` gecreëerd in het Spotify URI-formaat (`spotify:track:{trackId}`).
  - De browser wordt vervolgens omgeleid naar de Spotify pagina van het nummer door `window.location.href = trackUrl` uit te voeren.

  Deze methode zorgt ervoor dat het nummer direct begint af te spelen als je er op klikt.

```javascript
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
      // Haal de trackId uit de URL
      const trackId = d.url.split("/").pop();
      const trackUrl = `spotify:track:${trackId}`;
      
      // Verplaats de gebruiker naar de Spotify trackpagina
      window.location.href = trackUrl;
    });
```

## Feedback

Op 19 november heb ik feedback ontvangen van Sep en Camil.

### Algemene Feedback
- Combineer je vier Svelte componenten tot twee, waarbij de fetch dynamisch is.
- Over welke tijdsperiode gaat het?
- Voeg een titel toe aan de visualisatie.
- Laat gebruikers het aantal tracks kiezen.

### Bubbelchart
- Zorg dat de bubbels langzamer gaan wanneer je erover hovert.
- De bubbels vallen deels buiten beeld.
- Het moet mogelijk zijn om te zien welke nummers je al hebt beluisterd.

### Linechart
- Voeg labels toe op de X- en Y-as voor verduidelijking.
- Zorg dat de hover ook werkt op de punten.

### Positief
- De code is duidelijk geschreven en goed te volgen.
- Annotaties zijn duidelijk.

Alle punten heb ik verwerkt en ik ben blij dat ze deze hebben aangekaart. Zelf kijk je toch over dingen heen als je er continu mee bezig bent. Vooral het verbeteren van de fetch en het verkleinen van de componenten vond ik een zeer goede vooruitgang. De rest van de feedback maakt de gebruikerservaring beter en zijn vooral details.

Nadat ik de componenten opnieuw had ingedeeld en de fetch dynamisch heb kunnen maken, kon ik meerdere filteropties toevoegen. Ik kreeg al snel de smaak te pakken en van één filteroptie kwamen er al snel drie. Deze filteropties heb ik eerder in het document al uitgelegd.

# Eindproduct 

Het eindproduct staat [live op mijn Vercel site.](https://vercel.com/bincs-projects/tech-track)

#### BubbleChart (het Universum)
Een speelse visualisatie van jouw geselecteerde Spotify tracks met interactieve elementen

![BubbleChart - Het Universum](https://github.com/bincvburen/Tech-Track/blob/main/static/images/bubble.png)

#### LineChart (Inzicht)
Een inzichtelijke grafiek die laat zien hoe lang de nummers duren, hoe energiek en dansbaar ze zijn. 

![LineChart - Voor meer inzicht](https://github.com/bincvburen/Tech-Track/blob/main/static/images/line.png)


# Reflectie

### Reflectie

Tijden dit project heb ik mijn passie voor muziek gecombineerd met mijn technische CMD kennis. Door de Spotify API te integreren, heb ik niet alleen de mogelijkheden van de API ontdekt, maar ook mijn kennis van data visualisatie kunnen uitbreiden, vooral met behulp van D3.js. Iets wat totaal nieuw voor mij was. Het creëren van interactieve visualisaties, zoals de bubble- en lijngrafieken, bood me de kans om complexe data op een gebruiksvriendelijke manier te presenteren. 

De grootste uitdaging was het inloggen van verschillende gebruikers. Ik heb hier ontzettend lang mee geworsteld, tot op de dag van vandaag. Uiteindelijk bleek het niet zo complex te zijn als ik dacht. Daarnaast was woensdag 28 november een flinke tegenslag, omdat Spotify besloot haar endpoints aan te passen. Dit zorgde ervoor dat de lijngrafiek volledig kapot ging, en features zoals het tonen van aanbevelingen en het afspelen van nummers tijdens het hoveren onbruikbaar werden. Ik baalde hier enorm van, en het kostte me veel tijd om te achterhalen waar het probleem lag. Na een [post op de Spotify Community](https://developer.spotify.com/blog/2024-11-27-changes-to-the-web-api) werd het duidelijk dat dit de nieuwe richting was die Spotify was ingeslagen. Helaas zijn veel mensen hierdoor getroffen, zoals te lezen [is in dit topic.](https://community.spotify.com/t5/Spotify-for-Developers/Changes-to-Web-API/td-p/6540414) Net voor de deadline heb ik mijn visualisaties kunnen aanpassen en ben ik alsnog heel blij met het eindresultaat.

Mijn app stelt gebruikers in staat om hun luistergedrag te analyseren op een manier die zowel visueel als interactief is. Het project heeft me niet alleen technisch uitgedaagd, maar ook mijn vermogen om creatieve oplossingen te bedenken bij het werken met real-time data versterkt. 