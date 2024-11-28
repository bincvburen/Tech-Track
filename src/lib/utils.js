export const generateTrackLabel = (trackType, trackTerm, trackCount) => {
    const typeText =
      trackType === "top"
        ? "Toptracks"
        : trackType === "recent"
        ? "Recente tracks"
        : "Tracks"; // Standaardwaarde
  
    let termText = "";
    if (trackType === "top") {
      termText =
        trackTerm === "short_term"
          ? "in de afgelopen maand"
          : trackTerm === "medium_term"
          ? "in het afgelopen half jaar"
          : "in het afgelopen jaar";
    }
  
    return `${trackCount} ${typeText} ${termText}`.trim(); // Combineer trackCount, typeText en termText
  };
  