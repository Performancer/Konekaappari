'use strict';

/**
 * Plane-olio pitää sisällään dataa lentokoneesta, sekä erilaisia muuttuja
 * liittyen markeriin ja sen käsittelytilaan.
 */
class Plane {

  /**
   * Constructor
   *
   * @param {string} ID icao24-tunnus, jolla lentokone tunnistetaan ja jolla sen reittitietoihin päästään käsiksi
   * @param {number} lastUpdate aika millisekunneissa milloin viimeiseksi koneen dataa päivitettiin
   * @param {LatLng} latLng Koneen latitude ja longitude
   * @param {boolean} onGround True jos kone on maassa, False jos ilmassa
   * @param {number} heading Mihin suuntaan kone osoittaa
   * @param {string} callSign Lentokoneen call sign
   * @param {string} country Lentokoneen maa
   * @param {number} altitude Lentokoneen lentokorkeus
   * @param {number} velocity Lentokoneen nopeus
   */
  constructor(ID, lastUpdate, latLng, onGround, heading, callSign, country, altitude, velocity) {
    this.ID = ID;
    this.marker = null;
    this.handled = false;
    this.lastUpdate = lastUpdate;
    this.latLng = latLng;
    this.lastLatLng = latLng;
    this.onGround = onGround;
    this.heading = heading;

    this.callSign = callSign;
    this.country = country;
    this.altitude = altitude;
    this.velocity = velocity;

    this.animationState = 0;

    this.isRemoved = false;
  }

  /**
   * Haetaan koneen näytettävä sijainti kartalla huomioiden animaatio, mikäli
   * se on käytössä.
   * @returns {latLng} Koneen sijainti kartalla (ei välttämättä todellinen)
   */
  getLatLng() {
    if(!isAnimated || this.animationState > 19 || this.distance > 0.1)
      return this.latLng;

    return L.latLng(
        this.lastLatLng.lat + ((this.difference.lat / 20) * this.animationState),
        this.lastLatLng.lng + ((this.difference.lng / 20) * this.animationState));
  }

  /**
   * Palauttaa uuden ja vanhan sijainnin erotuksen.
   * @returns {LatLng} Erotus
   */
  get difference(){
    return L.latLng((this.latLng.lat - this.lastLatLng.lat),(this.latLng.lng - this.lastLatLng.lng));
  }

  /**
   * Palauttaa uuden ja vanhan sijainnin etäisyyden toisistaan.
   * @returns {number} Etäisyys
   */
  get distance(){
    let difference = this.difference;

    let a = difference.lat;
    let b = difference.lng;

    return Math.sqrt(a*a + b*b);
  }
}