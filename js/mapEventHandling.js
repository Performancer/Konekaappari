/**
 * Asetetaan kartalle rajat, ja estetään näkymän siirtyminen
 * rajojen ulkopuolelle.
 */
MAP.setMaxBounds(BOUNDS);
MAP.on('drag', () =>
{
  //asetetaan näkymä pysähtymään rajalle sen sijaan, se liikkuisi rajan yli ja palautettaisiin rajalle.
  MAP.panInsideBounds(BOUNDS, {animate: false})
});

// tapahtumankäsittelijän määritys kun aloitetaan vetämään karttaa:
MAP.on('dragstart', deactivatePlane);

// kartan ja layerin tapahtumankäsittelijät sekä apufunktiot ja -muuttujat:
/**
 * @type {intervallieventti} pitää sisällään aktiivisen lentokoneen tietojen päivityseventin
 */
let planeInfoInterval = null;
// tapahtumankäsittelijä sille kun on siirretty karttaa:
MAP.on('moveend', updateMarkers);

// Tapahtumankäsittelijän määritys kartan tyhjän kohdan painallukselle:
// poistetaan lentokoneen tietojen päivityseventti, lentokoneen tiedot sekä poistetaan aktiivinen lentokone.
// Lisäksi poistetaan mahdollinen virheilmoitus hakukentässä.
MAP.on('click', function() {deactivatePlane(); searchResult.innerHTML = '';});

// Tapahtumankäsittelijän määritys kartan markkerin painallukselle:
markersLayer.on('click', async function(e) {
  let ID = e.layer.ID;
  activatePlane(planes[ID]);
});

/**
 * Aktivoi halutun lentokoneen kartalla ja zoomaa+keskittää sen luokse.
 * Näyttää lisäksi juuri aktivoiden lentokoneen tiedot konekaapparisivulla ja
 * asettaa lentokonetietojenpäivittäjän päivittämään 60 sekunnin välein tiedot.
 *
 * @param {Plane} plane aktivoitava lentokone
 */
async function activatePlane(plane) {
  // deaktivoi tarvittaessa vanha lentokone
  if (selected !== null)
    deactivatePlane();

  // hae juuri aktivoidun lentokoneen lentotiedot
  await getFlightData(plane.ID);

  // näytä lentokoneen tiedot sivulla
  showAircraftData(plane);

  // vaihda juuri aktivoidun lentokoneen markkeri aktiiviseksi
  replaceMarker(plane, createActiveMarker(plane.getLatLng(), plane.heading));

  // aseta lentokoneen tietojen päivityseventti
  planeInfoInterval = setInterval(async function() {await getFlightData(plane.ID); showAircraftData(plane);}, 60000);

  // aseta aktiivinen markkeri
  selected = plane.marker;
  // zoomaa ja keskitä aktiivisen markkerin luokse
  focusPlane(true);

  console.log("Plane activated...");

  // poista virhehakuilmoitus jos sellaista on:
  searchResult.innerHTML = '';
}

/**
 * Deaktivoi aktiivisen lentokoneen, ja poistaa kaiken koneeseen liittyvän tiedon sivun info-osiosta
 */
function deactivatePlane() {
  if (selected !== null) {
    let plane = planes[selected.ID];
    // korvaa aktiivisen koneen markkeri sen tavallisella markkerilla
    replaceMarker(plane, createMarker(plane.getLatLng(), plane.heading));
    clearPlaneInfoInterval();
    clearAircraftData();
    selected = null;
    console.log("Plane deactivated...");
  }
}

/**
 * Poistaa lentotietojenpäivitysintervallin
 */
function clearPlaneInfoInterval() {
  if (planeInfoInterval !== null) {
    clearInterval(planeInfoInterval);
  }
  planeInfoInterval = null;
}

/**
 * Asettaa kartan moveend ja zoomend-tapahtumankäsittelijät pois päältä
 * jos ne olivat päällä, tai päälle jos ne olivat pois päältä.
 */
function switchMapHandlers() {
  if (switchMapHandlers.isTurnedOn) {
    MAP.off('moveend', updateMarkers);
    switchMapHandlers.isTurnedOn = false;
  } else {
    MAP.on('moveend', updateMarkers);
    switchMapHandlers.isTurnedOn = true;
  }
}
switchMapHandlers.isTurnedOn = true;