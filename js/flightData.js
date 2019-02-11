'use strict';

/**
 * Hakee OpenSky Networkin flights-API:sta tietyn koneen lentoreittitietoja.
 * Tätä käytetään silloin kun klikataan kartalta lentokoneen ikonia, jotta
 * saadaan kyseisen lentokoneen reittitiedot näkyviin.
 *
 * @param {string} ID tarkasteltavan lentokoneen icao24-tunnus.
 *
 */
async function getFlightData(ID) {
  console.log('Getting flight data for plane ' + ID);
  const end = Math.round((new Date()).getTime() / 1000);
  const interval = 10000;

  try {
    const reply = await fetch(`https://opensky-network.org/api/flights/aircraft?icao24=${ID}&begin=${(end - interval)}&end=${end}`);
    const json = await reply.json();
    updateFlightData(ID, json[0]);
  } catch(e) {
    updateFlightData(ID, null);
  }
}
/**
 * Rekisteröi annetun lentokoneen lähtöpaikan ja määränpään planes-taulukkoon.
 *
 * @param {string} ID tarkasteltavan lentokoneen icao24-tunnus.
 * @param {json} flightData lentokoneen reittitietojen json-esitysmuoto. Voi olla joko:
 *               1) undefined, mikäli reittitietoja lentokoneelle ei löytynyt
 *               2) olio, joka sisältää lentokoneen reittitiedot.
 */
function updateFlightData(ID, flightData) {
  console.log(flightData);
  if (flightData === null || flightData === undefined) {
    planes[ID].dep = null;
    planes[ID].arr = null;
  }
  else {
    planes[ID].dep = flightData.estDepartureAirport;
    planes[ID].arr = flightData.estArrivalAirport;
  }
}