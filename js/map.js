'use strict';

/**
 * Luo kartan alkuasetuksilla, sekä lisää karttaan openstreetmap-ruudut.
 * @returns {map} Kartta
 */
function createMap()
{
  //Alkuasetukset
  const LATITUDE = 56;
  const LONGITUDE = 12;
  const ZOOM = 5;
  const MINZOOM = 5;
  const MAXZOOM = 10;

  //Käytetään leaflet.js -kirjastoa sijoittamaan kartta haluamaan sijaintiin (https://leafletjs.com/)
  let map = L.map('map', {minZoom: MINZOOM , maxZoom: MAXZOOM}).setView([LATITUDE, LONGITUDE], ZOOM);

  //Lisätään karttaan tilet ja copyright
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  L.control.scale().addTo(map);

  map.originalSetZoomAround = map.setZoomAround;
  map.setZoomAround = function(fixedPoint, zoom) {
    if(selected != null)
      return map.setZoom(zoom);
    else
      return map.originalSetZoomAround(fixedPoint, zoom);
  };

  return map;
}

/**
 * Päivittää kaikki ehdot täyttävät lentokoneet kartalla ja poistaa kartalta
 * filteröidyt, sekä poistettavaksi merkatut lentokoneet. Kartan ulkopuolella
 * sijaitsevat (jotka myös pysyvät siellä) jätetään käsittelemättä. Ne
 * käsitellää vain, jos ja kun ne täyttävät valitut ehdot.
 *
 */
function updateMarkers() {
  console.log("Updating markers...");

  for (let id in planes) {

    let plane = planes[id];

    if (isFiltered(plane) || plane.isRemoved) {
      removeMarker(plane);
      continue;
    }

    if (!plane.handled && isValid(plane)) {
      if (plane.marker == null) {
        plane.marker = createMarker(plane.latLng, plane.heading);
        markersLayer.addLayer(plane.marker);

        plane.marker.ID = plane.ID;
      }
      else {
        updateMarker(plane);
      }

      plane.handled = true;
    }
  }

  //Keskittää kartan valittuun koneeseen
  focusPlane(false);
}

/**
 * Vaihtaa lentokoneen markkerin toiseen markkeriin. Asettaa myös uuden markkerin IDn vastaamaan halutun lentokoneen ID:tä
 *
 * @param {Plane} plane lentokone, jonka markkeri halutaan vaihtaa
 * @param {leafletMarker} newMarker
 */
function replaceMarker(plane, newMarker) {
  // poista ensin vanha lentokoneen markkeri:
  removeMarker(plane);
  // aseta sitten uusi markkeri lentokoneelle:
  newMarker.ID = plane.ID;
  plane.marker = newMarker;
  markersLayer.addLayer(plane.marker);
}
/**
 * Poistaa koneen markerin kartalta, jos koneella sellaista on.
 *
 * @param plane Kone, jonka marker poistetaan kartalta.
 */
function removeMarker(plane){
  if(plane.marker != null) {
    markersLayer.removeLayer(plane.marker);
    plane.marker = null;
  }
  plane.isRemoved = false;
}

/**
 * Tarkistaa, onko lentokone kartan ruudun sisällä.
 *
 * @param plane Tarkistettava lentokone
 * @returns {boolean} True jos kone on ruudun sisällä, muuten false.
 */
function isValid(plane) {
  const START = MAP.getBounds().getNorthWest();
  const END = MAP.getBounds().getSouthEast();

  //Onko kone ruudun sisällä?
  return plane.latLng.lng > START.lng && plane.latLng.lng < END.lng
      && plane.latLng.lat < START.lat && plane.latLng.lat > END.lat;
}

/**
 * Animaatioiden tila etenee, jonka jälkeen käytetään updateMarker-funktiota
 * päivittämään yksittäisen koneen uusi sijainti kartalle.
 *
 * Ei käsittele, jos kone ei ole ruudulla tai on filteröity pois.
 */
function animateMarkers(){
  for(let id in planes) {

    let plane = planes[id];

    if(!isValid(plane) || isFiltered(plane))
      continue;

    if(plane.animation !== null && plane.marker != null)
    {
      plane.animationState++;
      updateMarker(plane);
    }
  }
  //Keskittää kartan lentokoneeseen
  focusPlane(false);
}

/**
 * Tämä funktio tarkentaa kartan ruudun keskitettyyn koneeseen, jos sellaista
 * on.
 *
 * @param {boolean} zoom Haluammeko, että kartan scale on vähintään 7?
 */
async function focusPlane(zoom)
{
  //Kun kartta siirtyy keskitetyn koneen mukaisesti, emme halua laukaista
  //kartan siirtelyyn liittyviä eventtejä.
  if( selected != null ) {
    switchMapHandlers();
    if(zoom && MAP.getZoom() < 7 )
      await MAP.setView(selected.getLatLng(), 7);
    else
      await MAP.setView(selected.getLatLng());
    switchMapHandlers();
  }
}