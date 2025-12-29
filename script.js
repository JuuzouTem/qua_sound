const songs = [
    {
        title: "1. Süperpozisyon (Superposition)",
        src: "musics/super.wav"
    },
    {
        title: "2. Kuantum Dolanıklık (Entanglement)",
        src: "musics/dolanik.wav"
    },
    {
        title: "3. Kuantum Tünelleme (Tunneling) - V1",
        src: "musics/tunel.wav"
    },
    {
        title: "3. Kuantum Tünelleme (Tunneling) - V2",
        src: "musics/tunel_2.wav"
    },
    {
        title: "4. Heisenberg Belirsizlik İlkesi",
        src: "musics/belirsiz.wav"
    },
    {
        title: "5. Çift Yarık Deneyi (Double Slit)",
        src: "musics/yarik.wav"
    },
    {
        title: "6. Schrödinger'in Kedisi: Yaşam (Alive)",
        src: "musics/yasam.wav"
    },
    {
        title: "6. Schrödinger'in Kedisi: Ölüm (Dead)",
        src: "musics/olum.wav"
    },
    {
        title: "7. Pauli Dışlama İlkesi & Spin",
        src: "musics/spin.wav"
    }
];
let currentSongIndex = 0;
let isPlaying = false;
let audioContext;
let analyser;
let source;
let dataArray;
const audioPlayer = document.getElementById('audioPlayer');
const playPauseBtn = document.getElementById('playPauseBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const progressBar = document.getElementById('progressBar');
const progressContainer = document.getElementById('progressContainer');
const titleEl = document.getElementById('trackTitle');
const statusEl = document.getElementById('trackStatus');
const playlistEl = document.getElementById('playlist');
const overlay = document.getElementById('overlay');
const startButton = document.getElementById('startButton');
startButton.addEventListener('click', () => {
    overlay.style.opacity = '0';
    setTimeout(() => { overlay.style.display = 'none'; }, 800);
    document.querySelector('.player-container').classList.add('player-active');
    initAudioContext();
    loadSong(currentSongIndex);
});
function initAudioContext() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 256; 
        source = audioContext.createMediaElementSource(audioPlayer);
        source.connect(analyser);
        analyser.connect(audioContext.destination);
        const bufferLength = analyser.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);
        animateQuantumWaves();
    } else if (audioContext.state === 'suspended') {
        audioContext.resume();
    }
}
function loadSong(index) {
    const song = songs[index];
    titleEl.innerText = song.title;
    audioPlayer.src = song.src;
    statusEl.innerText = "Yükleniyor...";
    audioPlayer.onloadeddata = () => {
        statusEl.innerText = isPlaying ? "Oynatılıyor..." : "Hazır";
    };
    updatePlaylistUI();
}
function playSong() {
    if (audioContext && audioContext.state === 'suspended') {
        audioContext.resume();
    }
    const playPromise = audioPlayer.play();
    if (playPromise !== undefined) {
        playPromise.then(_ => {
            isPlaying = true;
            playPauseBtn.innerText = "⏸";
            statusEl.innerText = "Oynatılıyor...";
        })
        .catch(error => {
            console.log("Oynatma hatası:", error);
            statusEl.innerText = "Hata oluştu";
        });
    }
}
function pauseSong() {
    audioPlayer.pause();
    isPlaying = false;
    playPauseBtn.innerText = "▶";
    statusEl.innerText = "Duraklatıldı";
}
playPauseBtn.addEventListener('click', () => {
    if(!audioContext) return; 
    isPlaying ? pauseSong() : playSong();
});
prevBtn.addEventListener('click', () => {
    currentSongIndex--;
    if (currentSongIndex < 0) currentSongIndex = songs.length - 1;
    loadSong(currentSongIndex);
    if(isPlaying) playSong();
});
nextBtn.addEventListener('click', () => {
    currentSongIndex++;
    if (currentSongIndex > songs.length - 1) currentSongIndex = 0;
    loadSong(currentSongIndex);
    if(isPlaying) playSong();
});
audioPlayer.addEventListener('timeupdate', (e) => {
    const { duration, currentTime } = e.srcElement;
    if(duration) {
        const progressPercent = (currentTime / duration) * 100;
        progressBar.style.width = `${progressPercent}%`;
    }
});
audioPlayer.addEventListener('ended', () => {
    nextBtn.click();
});
progressContainer.addEventListener('click', (e) => {
    const width = progressContainer.clientWidth;
    const clickX = e.offsetX;
    const duration = audioPlayer.duration;
    audioPlayer.currentTime = (clickX / width) * duration;
});
function createPlaylist() {
    playlistEl.innerHTML = "";
    songs.forEach((song, index) => {
        const li = document.createElement('div');
        li.classList.add('playlist-item');
        li.innerHTML = `<span>${song.title}</span>`;
        li.addEventListener('click', () => {
            currentSongIndex = index;
            loadSong(currentSongIndex);
            playSong();
        });
        playlistEl.appendChild(li);
    });
}
function updatePlaylistUI() {
    const items = document.querySelectorAll('.playlist-item');
    items.forEach((item, index) => {
        if (index === currentSongIndex) {
            item.classList.add('active');
            item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else {
            item.classList.remove('active');
        }
    });
}
createPlaylist();
const canvas = document.getElementById('quantumCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
function animateQuantumWaves() {
    requestAnimationFrame(animateQuantumWaves);
    ctx.fillStyle = 'rgba(5, 5, 5, 0.1)'; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    analyser.getByteFrequencyData(dataArray);
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(canvas.width, canvas.height) * 0.15; 
    ctx.beginPath();
    ctx.strokeStyle = '#00f3ff'; 
    ctx.lineWidth = 2;
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#00f3ff';
    for (let i = 0; i < dataArray.length; i++) {
        const amplitude = dataArray[i];
        const angle = (i / dataArray.length) * Math.PI * 2;
        const r = radius + (amplitude * 0.8) + (Math.sin(i * 0.5 + Date.now() * 0.002) * 10);
        const x = centerX + Math.cos(angle) * r;
        const y = centerY + Math.sin(angle) * r;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();
    ctx.beginPath();
    ctx.strokeStyle = '#ff00ff';
    ctx.lineWidth = 2;
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#ff00ff';
    for (let i = 0; i < dataArray.length; i++) {
        const amplitude = dataArray[dataArray.length - 1 - i]; 
        const angle = (i / dataArray.length) * Math.PI * 2;
        const r = (radius * 0.8) + (amplitude * 0.6) + (Math.cos(i * 0.8) * 15);
        const rotatedAngle = angle - (Date.now() * 0.001); 
        const x = centerX + Math.cos(rotatedAngle) * r; 
        const y = centerY + Math.sin(rotatedAngle) * r;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();
    const bass = dataArray[5]; 
    const coreRadius = (radius * 0.1) + (bass * 0.15);
    ctx.beginPath();
    ctx.arc(centerX, centerY, coreRadius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0.1, bass / 255)})`;
    ctx.shadowBlur = 30;
    ctx.shadowColor = '#ffffff';
    ctx.fill();
    ctx.shadowBlur = 0; 
}