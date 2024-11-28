# **Chartify**

Met Chartify kunnen gebruikers hun Spotify-statistieken kunnen bekijken over een bepaalde periode in een eigen gekozen visualisatie. De app maakt gebruik van de Spotify Web API.

---

### Belangrijke informatie, voordat je begint

Ik heb tot vandaag (donderdag 28 november) gezocht naar een antwoord op mijn vraag: waarom kan alleen ik inloggen en niemand anders? Het blijkt dat de app in **ontwikkelmodus** staat, waardoor deze standaard slechts door één persoon gebruikt kan worden. In deze modus is het mogelijk om maximaal **25 Spotify-accounts** toe te voegen die mijn code kunnen testen, en dat werkt naar verwachting. Als jullie mijn project willen testen, moet ik eerst jullie **Spotify-e-mailadres** toevoegen aan de app via mijn developer-account.

Gevonden in deze [Spotify Developer Community](https://community.spotify.com/t5/Spotify-for-Developers/web-app-only-works-with-my-account/td-p/5605451#solutionsRow):
> *"Apps in development mode are only accessible by the developer's account unless specific users are whitelisted."*

Die mij verwees naar [Spotify for Developers](https://developer.spotify.com/documentation/web-api/concepts/quota-modes):
> *"Newly-created apps begin in development mode. … They can acces a single Spotify account.
Up to 25 authenticated Spotify users can use an app that is in development mode."*

## **Installatie**

Volg deze stappen om het project lokaal te draaien:

1. **Download de bestanden**:
   - Download de zip van dit project en pak het uit naar een map op je computer.

3. **Spotify account toevoegen**:
   - Voordat je mijn app kunt gebruiken moet jouw emailadres bij mijn Spotify developer account bekend zijn.

4. **Start de app**:
     ```bash
     npm run dev
     ```

---

## **Gebruik**

Wanneer de app draait, kun je inloggen met je Spotify account. Na de autorisatie wordt je teruggestuurd naar de index-pagina. Hierop is vervolgens een Bubblechart (het Universum) te zien met jouw 20 toptracks van het afgelopen jaar (default). Vervolgens kun je via de dropdown de visualisatie aanpassen en filteren. Je visualisatie wordt hierop aangepast. 

**Let op**: Zoals aan het begin genoemd moet je Spotify-e-mailadres worden toegevoegd aan de lijst van testgebruikers om deze app te kunnen gebruiken.

---

## **GitHub Repository en Live site**
[Open mijn Github Repository](https://github.com/bincvburen/Tech-Track) of [ga naar mijn Vercel-site](https://vercel.com/bincs-projects/tech-track):

---

## **Licentie**
Dit project is gelicenseerd onder de MIT-licentie – zie het [LICENSE.md](LICENSE.md) bestand voor details.


