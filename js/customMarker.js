'use strict';

/**
 * planeIcon-funktio
 *
 * Funktiossa määritellään lentokoneikonin ominaisuudet.
 * Käytetään createMarker-funktiossa.
 *
 * Määriteltävät ominaisuudet: Ikoni, sen koko ja ankkuripiste.
 *
 * @returns {icon}
 */
const planeIcon = () =>
{
  let myIcon = L.icon ({
    iconUrl: 'images/LuftWaffe1.png',
    iconSize:[15,15],
    iconAnchor: [0,0],
  });
  return myIcon;
};

/**
 * Luo aktiiviselle lentokoneelle ikonin.
 * Käytetään markkerienluontifunktioissa.
 *
 * Funktio määrittelee ikonin, sen koon ja sen ankkurointipisteen.
 * @returns {icon} uusi aktiivisen lentokoneen ikoni
 */
const activeIcon = () =>
{
  let myIcon = L.icon ({
    iconUrl: 'images/LuftWaffe1Active.png',
    iconSize:[22,22],
    iconAnchor: [2,2],
  });
  return myIcon;
};


/**
 /**
 * createMarker -funktio
 *
 * Luo lentokoneelle markkerin.
 * Käytetään updateMarkers-funktiossa.
 *
 * Määrittelee markerin sijainnin ja ikonin, sekä ikonin keskipisteen ja suuntakulman.
 * Ikoni valitaan sen perusteella onko kyseinen kone aktiivinen vai ei.
 *
 * @param {latlng} latlng markkerin koordinaatit leaflet-kartalla.
 * @param {number} heading markkerin suunta asteissa.
 * @param {boolean} [activePlane=false] true jos halutaan luoda aktiivinen markkeri, false muuten.
 * @returns {marker} uusi markkeri, jonka voi liittää leaflet-karttaan/-layeriin.
 */
const createMarker = (latlng, heading, activePlane = false) =>
{
  let customMarker = L.marker(
      latlng,
      {icon: activePlane? activeIcon(): planeIcon(),
        rotationOrigin: 'center center',
        // koneen ikoni on oletusarvoisesti -45 asteen kulmassa, siksi se täytyy kääntää aluksi
        // 45 astetta jonka jälkeen siihen lisätään haluttu kulma heading-parametrilla.
        rotationAngle: 45 + heading,
        zIndexOffset: activePlane? 3000: 0
      });
  return customMarker;
};

/**
 * Luo markkerin aktiiviselle lentokoneelle karttaan.
 *
 * @param latlng
 * @param heading
 * @returns {marker}
 */
const createActiveMarker = (latlng, heading) => createMarker(latlng, heading, true);

/**
 * updateMarker-funktio
 *
 * Funktio päivittää olemassa olevan markerin ja sen ikonin arvoja.
 * Käytetään updateMarkers-funktiossa.
 *
 * Päivittää lentokonemarkerin sijainnin kartalla, sekä markerissa käytetyn ikonin suuntakulman.

 * @param {Plane} plane lentokone, jonka markkeria halutaan päivittää.
 */
const updateMarker = (plane) =>
{
  plane.marker.setLatLng(plane.getLatLng());
  plane.marker.setRotationAngle(45 + plane.heading);
};

