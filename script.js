// === VARIABLES ===
let songs = [];
let currentIndex = 0;
let audio = new Audio();

// === DOM ELEMENTS ===
const title = document.getElementById('title');
const artist = document.getElementById('artist');
const cover = document.getElementById('cover');
const playBtn = document.getElementById('playBtn');
const pauseBtn = document.getElementById('pauseBtn');
const nextBtn = document.getElementById('nextBtn');
const progressBar = document.getElementById('progressBar');
const topTracksContainer = document.getElementById('topTracks');

// === FETCH DEEZER SONGS ===
function fetchSongs(query = "lofi") {
  fetch(`https://deezerdevs-deezer.p.rapidapi.com/search?q=${query}`, {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': '1f5d36b15emshfd0bd57f1a2fe76p15dad3jsn7c2c97803939', // Remplace par ta clé si nécessaire
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
  })
  .catch(err => console.error(err));
}

// === DISPLAY SONG + AUTO PLAY ===
function displaySong(index) {
  const song = songs[index];
  if (!song) return;
  currentIndex = index;
  title.textContent = song.title;
  artist.textContent = song.artist;
  cover.src = song.cover;
  audio.src = song.preview;
  progressBar.value = 0;

  // Auto play on display
  audio.play();
}

// === SHOW TOP TRACKS ===
function showTopTracks() {
  topTracksContainer.innerHTML = '';
  songs.slice(0, 5).forEach((song, i) => {
    const img = document.createElement('img');
    img.src = song.cover;
    img.alt = song.title;
    img.onclick = () => {
      displaySong(i);
    };
    topTracksContainer.appendChild(img);
  });
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

// === PROGRESS BAR ===
audio.addEventListener('timeupdate', () => {
  if (audio.duration) {
    progressBar.value = (audio.currentTime / audio.duration) * 100;
  }
});

// === KEYBOARD CONTROLS ===
document.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    e.preventDefault(); // prevent scroll
    if (audio.paused) {
      audio.play();
    } else {
      audio.pause();
    }
  }

  if (e.code === 'ArrowRight') {
    nextSong();
  }

  if (e.code === 'ArrowLeft') {
    const prevIndex = (currentIndex - 1 + songs.length) % songs.length;
    displaySong(prevIndex);
  }
});

// === AUTO LOAD ON START ===
fetchSongs("lofi"); // Tu peux changer "lofi" par "rock", "rap", etc.
