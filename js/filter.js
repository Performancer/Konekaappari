'use strict';

/**
 * Suotamiseen käytettävä olio, joka sisältää erilaisia vaihtoehtoja
 * suodatukselle.
 */
class Filter {

  /**
   * Constructor
   *
   * @param {boolean} ground Filteröidäänkö maassa olevat koneet?
   * @param {boolean} air Filteröidäänkö maassa olevat koneet?
   */
  constructor(ground, air) {
    this.filterGround = ground;
    this.filterAir = air;
    this.filterByID = "";
  }
}

/**
 * Tarkistaa, että pitäisikö lentokone suotaa nykyisillä asetuksilla?
 *
 * @param plane Käsiteltävä lentokone
 * @returns {boolean} True jos filteröidään, false jos ei filteröidä
 */
function isFiltered(plane) {

  //Jos data ei ole päivittynyt 60s niin filtteröimme pois
  if(Date.now() - plane.lastUpdate > 60000)
    return true;

  if(filter.filterGround && plane.onGround) {
    return true;
  }
  else if(filter.filterAir && !plane.onGround) {
    return true;
  }
  else if (filter.filterByID !== "" && !plane.ID.includes(filter.filterByID)){
    return true;
  }

  return false;
}

/**
 * Kutsutaan kun filterissä tapahtuu muutoksia. Asetaa kaikki lentokoneet
 * käsittelemättömäksi, jonka johdosta updateMarkers-funtkio osaa käsitellä
 * lentokoneet uudestaan. Tämän jälkeen kutsuu updateMarkers-funktion
 * automaattisesti.
 */
function onFilterChange() {
  for (let id in planes) {
    planes[id].handled = false;
  }

  updateMarkers();
}