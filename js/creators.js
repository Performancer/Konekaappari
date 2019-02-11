const team = [

  {
    thumb: 'images/RK_thumb.jpg',
    big: 'images/RK.jpg',
    name: 'Roni Kekkonen',
    home: 'Järvenpää',
    job: 'Eventit',
    line: 'LISP 4eva',
  },
  {
    thumb: 'images/TL_thumb.jpg',
    big: 'images/TL.jpg',
    name: 'Torsti Laine',
    home: 'Kilo',
    job: 'CSS',
    line: 'Ohjelmistotuotantoon!',
  },
  {
    thumb: 'images/AL_thumb.jpg',
    big: 'images/AL.jpg',
    name: 'Alex Leppäkoski',
    home: 'Hyvinkää',
    job: 'Kartta',
    line: 'Tämä kone menee nyt etelään!',
  },
  {
    thumb: 'images/MM_thumb.jpg',
    big: 'images/MM.jpg',
    name: 'Mikael Meller',
    home: 'Hermanni',
    job: 'Media',
    line: 'Mitään en tunnusta.',
  },
];

const ul = document.querySelector('#portraits');
const div = document.querySelector('div.hidden');
const img = document.querySelector('div>img');
const tiimi = document.querySelector('#tiimi');

const nimi = document.querySelector('#nimi');
const koti = document.querySelector('#koti');
const rooli = document.querySelector('#rooli');
const motto = document.querySelector('#motto');

for (let i = 0; i<team.length; i++){

  const l = document.createElement('li');
  const kuva = document.createElement('img');

  const t1 = team[i].name;
  const t2 = team[i].home;
  const t3 = team[i].job;
  const t4 = team[i].line;

  kuva.src = team[i].thumb;

  ul.appendChild(l);
  l.appendChild(kuva);

  kuva.addEventListener('click', function() {
    div.setAttribute('class', 'visible');
    tiimi.setAttribute('class', 'hidden');
    img.src = team[i].big;

    nimi.innerHTML = t1;
    koti.innerHTML = t2;
    rooli.innerHTML = t3;
    motto.innerHTML = t4;

  });

  div.addEventListener('click', function(){
    div.setAttribute('class', 'hidden');
    tiimi.setAttribute('class', 'visible');
  });
}