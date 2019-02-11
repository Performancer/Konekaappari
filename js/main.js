'use strict';

const southWest = L.latLng(-90, -180);
const northEast = L.latLng(90, 180);
const BOUNDS = L.latLngBounds(southWest, northEast);

//Luodaan kartta
const MAP = createMap();

//Luodaan featureGroup joka hallitsee markkereita
const markersLayer = L.featureGroup().addTo(MAP);

// Säilyttää listan plane-objekteista
let planes = {};
//Luodaan filter kartan koneiden suotamiseen
let filter = new Filter(true, false);
//Ovatko lentokoneet animoituja?
let isAnimated = true;
//Aktiiviseksi valittu lentokone
let selected = null;
//Pitää kirjaa monesko intervalli on menossa
let index = 0;

function main() {
  //Haetaan tiedot kerran ennen kuin aloitetaan pääintervalli
  getData();

  //Kutsutaan pääintervallifunktiota joka 500 millisekunnin välein
  setInterval(function() {
    //Nostetaan indeksiä ja mikäli 10s on kulunut niin haetaan dataa
    if(index++ >= 20) {
      getData();
      index = 0;
    }

    //Jos koneita animoidaan niin käsitellään animaatiota
    if(isAnimated)
      animateMarkers();
  }, 500);
}

main();