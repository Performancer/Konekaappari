'use strict';

/**
 * Hakee lentokoinen tilan JSON-tiedoston ja antaa siitä saatavan taulukon
 * eteenpäin updateData-funktiolle, joka rekisteröi datan planes-taulukkoon.
 * Sen jälkeen markerit päivitetään kartalla automaattisesti updateMarkers
 * -funktiolla.
 */
function getData() {
  console.log("Getting data...");

  fetch('https://opensky-network.org/api/states/all')
  .then(function(reply) {return reply.json();})
  .then(function(json) {updateData(json.states);})
  .catch(function(error) {console.log(error);});
}

/**
 * Rekisteröi annetun datan planes-taulukkoon ja päivittää markerit kartalla
 * kutsumalla updateMarkers-funktion.
 *
 * @param {array} states JSONin antama taulukko
 */
function updateData(states) {
  for (let i = 0; i < states.length; i++) {

    const STATE = states[i];

    const ID = STATE[0];

    //Jos ID ei ole tunnitettavissa niin ohitetaan tämä
    if (ID === undefined)
      continue;

    const CALL_SIGN = STATE[1];
    const COUNTRY = STATE[2];
    const LONGITUDE = STATE[5];
    const LATITUDE = STATE[6];
    const ALTITUDE = STATE[7];
    const ON_GROUND = STATE[8];
    const VELOCITY = STATE[9];
    const HEADING = STATE[10];

    let plane = planes[ID];

    //Jos data ei ole validia niin merkitään poistettavaksi, jos olemassa
    if (LONGITUDE == null || LATITUDE == null || ON_GROUND == null || HEADING == null) {
      if(plane != null && plane.marker != null) {
        plane.handled = true;
        plane.isRemoved = true;
      }
      continue;
    }

    //Jos kone on olemassa niin päivitetään tietoja, muuten luodaan uusi
    if (plane != null) {
      plane.handled = false;
      plane.lastUpdate = Date.now();
      plane.lastLatLng = plane.latLng;
      plane.latLng = L.latLng(LATITUDE, LONGITUDE);
      plane.on_ground = ON_GROUND;
      plane.heading = HEADING;

      plane.animationState = 0;
    }
    else {
      planes[ID] = new Plane(ID, Date.now(), L.latLng(LATITUDE, LONGITUDE), ON_GROUND, HEADING, CALL_SIGN, COUNTRY, ALTITUDE, VELOCITY );
    }
  }

  console.log("done getting the data.");

  //Päivittää markerit kartalla
  updateMarkers();
}