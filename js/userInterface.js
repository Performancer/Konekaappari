'use strict';

const filters = document.getElementById('filters');
const dropdownContent = document.getElementById('dropdownContent');
const searchButton = document.getElementById('searchButton');
const filterGround = document.getElementById('ground');
const filterFlight = document.getElementById('flight');
const map = document.getElementById('map');
const searchResult = document.getElementById('searchResult');

/**
 * 'showFilters' eventti
 *
 * Tämä funktio määrittää ID:filters nappiin liitetyn klikkaus eventin.
 *
 * Nappia painamalla ID:dropdownContent saa display arvon 'flex', jolloin
 * suodinlista tulee näkyviin kartan yläreunaan. Samalla eventti lisää Nappiin
 * uuden, 'hideFilters' eventin, ja poistaa nykyisen 'showFilters' eventin.
 * Tällöin nappia painamalla käyttäjä saa suodinlistan näkyviin tai poisnäkyvistä
 * tarpeensa mukaan.
 *
 * @param evt
 */
const showFilters = (evt) =>
{
  dropdownContent.style = 'display: flex';
  filters.addEventListener('click', hideFilters);
  filters.removeEventListener('click', showFilters)
};

/**
 * 'hideFilters' eventti
 *
 * Tämä funktio määrittää ID:filters nappiin liitetyn klikkaus eventin.
 *
 * Nappia painamalla ID:dropdownContent saa display arvon 'flex', jolloin
 * suodinlista tulee näkyviin kartan yläreunaan. Samalla eventti lisää Nappiin
 * uuden, 'showFilters' eventin, ja poistaa nykyisen 'hideFilters' eventin.
 * Tällöin nappia painamalla käyttäjä saa suodinlistan näkyviin tai poisnäkyvistä
 * tarpeensa mukaan.
 *
 * @param evt
 */
const hideFilters = (evt) =>
{
  dropdownContent.style = "display:none";
  filters.addEventListener('click', showFilters);
  filters.removeEventListener('click', hideFilters)
};
filters.addEventListener('click', showFilters);
map.addEventListener('click', hideFilters);


/**
 * 'onGround' eventti
 *
 * Tämä funktio muuttaa  maassaolevien koneiden suodinarvon ON/OFF ja
 * päivittää markerit.
 * @param evt
 */
const onGround = (evt) =>
{
  if(filter.filterGround == true)
  {
    filter.filterGround = false;
    filterGround.innerHTML = 'Maissa - OFF';
  }else
  {
    filter.filterGround = true;
    filterGround.innerHTML = 'Maissa - ON';
  }
  onFilterChange();
};
filterGround.addEventListener('click', onGround);

/**
 * 'inFlight' eventti
 *
 * Tämä funktio muuttaa lennossa olevien koneiden suodinarvon ON/OFF ja
 * päivittää markerit.
 * @param evt
 */
const inFlight = (evt) =>
{
  if(filter.filterAir == true)
  {
    filter.filterAir = false;
    filterFlight.innerHTML = 'Lennossa - OFF';
  }else
  {
    filter.filterAir = true;
    filterFlight.innerHTML = 'Lennossa - ON';
  }
  onFilterChange();
};
filterFlight.addEventListener('click', inFlight);

/**
 * 'search' eventti
 *
 * Tämä funktio hakee planes listasta lentokonetta search-input kenttään
 * syötetyn stringin perusteella.
 *
 * Jos haku kohde on olemassa, näkymä keskitetään siihen, ja asetetaan kone
 * aktiiviseksi.
 *
 * @param evt
 */
const search = (evt) =>
{
  const target = document.getElementById('searchField').value;

  if (planes[target] != null) {
    searchResult.innerHTML = '';
    activatePlane(planes[target]);
  }else{
    searchResult.innerHTML = 'Hakukohdetta ei löytynyt';
  }
};
searchButton.addEventListener('click', search);

/**
 * Näyttää halutun lentokoneen tiedot Konekaappaajasivulla, kartan alapuolella.
 * Asettaa samalla kyseisen lentokonetieto-osion näkyväksi.
 *
 * @param {Plane} plane lentokone, jonka tiedot halutaan sivulla näyttää.
 */
function showAircraftData(plane) {
  // 1 (id):
  showAircraftDataSnippet('idinfo', parse(plane.ID));
  // 2 (callsign):
  showAircraftDataSnippet('callsigninfo', parse(plane.callSign));
  // 3 (country):
  showAircraftDataSnippet('countryinfo', parse(plane.country));
  // 4 (dep):
  showAircraftDataSnippet('depinfo', parse(plane.dep));
  // 5 (arr):
  showAircraftDataSnippet('arrinfo', parse(plane.arr));
  // 6 (latlng):
  showAircraftDataSnippet('latlnginfo', '(' + parse(plane.latLng.lat) + ', ' + parse(plane.latLng.lng) + ')');
  // 7 (altitude):
  showAircraftDataSnippet('altitudeinfo', parse(plane.altitude));
  // 8 (velocity);
  showAircraftDataSnippet('velocityinfo', parse(plane.velocity) + ' km/h');
}

/**
 * Poistaa/piilottaa lentokonetiedot Konekaappaajasivulta
 */
function clearAircraftData() {
  // 1 - clear id:
  removeOldInfo('idinfo');
  // 2 - clear callsign:
  removeOldInfo('callsigninfo');
  // 3 - clear country:
  removeOldInfo('countryinfo');
  // 4 - clear dep:
  removeOldInfo('depinfo');
  // 5 - clear arr:
  removeOldInfo('arrinfo');
  // 6 - clear latlng:
  removeOldInfo('latlnginfo');
  // 7 - clear altitude:
  removeOldInfo('altitudeinfo');
  // 8 - clear velocity:
  removeOldInfo('velocityinfo');
  // 9 - poista infoelementti mobiiliversiossa:
  document.getElementById('info').className = 'hidden_mobile';
}

/**
 * Näyttää halutun lentokoneen tiedon Konekaappaajasivulla, kartan alapuolella,
 * halutussa elementissä.
 *
 * @param {elementti} infoId sen HTML-elementin id, johon info halutaan laittaa.
 * @param {string} newInfo uusi infoteksti.
 */
function showAircraftDataSnippet(infoId, newInfo) {
  // Poista ensin vanha info elementistä:
  removeOldInfo(infoId);
  // näytä vielä uusi haluttu info elementissä:
  let infoE = document.getElementById(infoId);
  infoE.appendChild(document.createTextNode(newInfo));
  // Lopuksi, näytä infoelementti mobiiliversiossa:
  document.getElementById('info').className = 'visible_mobile';
}

/**
 * Tarkistaa löytyykö annettu info ja muuntaa sen tarvittaessa.
 * @param {string} info parsattava selite.
 * @returns {string} palauttaa muunnetun selitteen.
 */
function parse(info) {
  if ([null, undefined, ""].includes(info)){
    return 'Ei tietoa';
  }
  else {
    return info;
  }
}

/**
 * Poistaa vanhan lentokoneen infon halutusta infoelementistä.
 *
 * @param {string} infoId sen HTML-elementin id, josta kaikki info halutaan laittaa.
 */
function removeOldInfo(infoId) {
  // Hae aluksi haluttu-infoelementti:
  let infoE = document.getElementById(infoId);
  // poista sitten kaikki vanha info elementistä:
  while (infoE.firstChild) {
    infoE.removeChild(infoE.firstChild);
  }
}