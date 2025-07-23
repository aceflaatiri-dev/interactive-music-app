// === VARIABLES ===
let songs = [];
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
let currentIndex = 0;
let audio = new Audio();

// === DOM ELEMENTS ===
const title = document.getElementById('title');
const artist = document.getElementById('artist');
const cover = document.getElementById('cover');
const playBtn = document.getElementById('playBtn');
const pauseBtn = document.getElementById('pauseBtn');
const nextBtn = document.getElementById('nextBtn');
const favBtn = document.getElementById('favBtn');
const progressBar = document.getElementById('progressBar');
const topTracksContainer = document.getElementById('topTracks');
const favoritesList = document.getElementById('favoritesList');

// === FETCH DEEZER SONGS ===
function fetchSongs(query = "lofi") {
  fetch(`https://deezerdevs-deezer.p.rapidapi.com/search?q=${query}`, {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': '1f5d36b15emshfd0bd57f1a2fe76p15dad3jsn7c2c97803939',
      'X-RapidAPI-Host': 'deezerdevs-deezer.p.rapidapi.com'
    }
  })
  .then(res => res.json())
  .then(data => {
    songs = data.data.map(track => ({
      title: track.title,
      artist: track.artist.name,
      preview: track.preview,
      cover: track.album.cover_medium
    }));
    displaySong(0);
    showTopTracks();
    showFavorites();
  })
  .catch(err => console.error(err));
}

// === DISPLAY SONG + FAVORITE STATE ===
function displaySong(index) {
  const song = songs[index];
  if (!song) return;
  currentIndex = index;
  title.textContent = song.title;
  artist.textContent = song.artist;
  cover.src = song.cover;
  audio.src = song.preview;
  progressBar.value = 0;
  audio.play();

  updateFavButton(song);
}

// === UPDATE FAV BUTTON VISUAL ===
function updateFavButton(song) {
  const isFav = favorites.some(fav => fav.title === song.title && fav.artist === song.artist);
  favBtn.classList.toggle('active', isFav);
}

// === SHOW TOP TRACKS ===
function showTopTracks() {
  topTracksContainer.innerHTML = '';
  songs.slice(0, 5).forEach((song, i) => {
    const img = document.createElement('img');
    img.src = song.cover;
    img.alt = song.title;
    img.onclick = () => displaySong(i);
    topTracksContainer.appendChild(img);
  });
}

// === SHOW FAVORITES ===
function showFavorites() {
  favoritesList.innerHTML = '';
  favorites.forEach((song, i) => {
    const img = document.createElement('img');
    img.src = song.cover;
    img.alt = song.title;
    img.onclick = () => {
      songs.push(song); // temp add to current list
      displaySong(songs.length - 1);
    };
    favoritesList.appendChild(img);
  });
}

// === TOGGLE FAVORITE ===
function toggleFavorite() {
  const currentSong = songs[currentIndex];
  const index = favorites.findIndex(fav => fav.title === currentSong.title && fav.artist === currentSong.artist);

  if (index >= 0) {
    favorites.splice(index, 1); // remove
  } else {
    favorites.push(currentSong); // add
  }

  localStorage.setItem('favorites', JSON.stringify(favorites));
  updateFavButton(currentSong);
  showFavorites();
}

// === PLAYER CONTROLS ===
function playSong() {
  audio.play();
}

function pauseSong() {
  audio.pause();
}

function nextSong() {
  const nextIndex = (currentIndex + 1) % songs.length;
  displaySong(nextIndex);
}

// === EVENT LISTENERS ===
playBtn.addEventListener('click', playSong);
pauseBtn.addEventListener('click', pauseSong);
nextBtn.addEventListener('click', nextSong);
favBtn.addEventListener('click', toggleFavorite);

// === PROGRESS BAR ===
audio.addEventListener('timeupdate', () => {
  if (audio.duration) {
    progressBar.value = (audio.currentTime / audio.duration) * 100;
  }
});

// === KEYBOARD CONTROLS ===
document.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    e.preventDefault();
    if (audio.paused) audio.play();
    else audio.pause();
  }
  if (e.code === 'ArrowRight') nextSong();
  if (e.code === 'ArrowLeft') {
    const prevIndex = (currentIndex - 1 + songs.length) % songs.length;
    displaySong(prevIndex);
  }
});

// === AUTO LOAD ===
fetchSongs("lofi");
