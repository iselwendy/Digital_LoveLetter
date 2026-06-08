let audioCtx = null, synthTimer = null, synthOn = false;
const arpeggios = [
  {f:329.63,d:0.6},{f:392,d:0.6},{f:440,d:0.6},{f:523.25,d:0.8},
  {f:493.88,d:0.6},{f:392,d:0.6},{f:440,d:1},{f:349.23,d:0.6},
  {f:392,d:0.6},{f:440,d:0.8}
];
let arpIdx = 0;

function ensureAudio() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
}
function startSynth() {
  ensureAudio();
  if (synthOn) return;
  synthOn = true;
  (function tick() {
    if (!synthOn) return;
    const a = arpeggios[arpIdx++ % arpeggios.length];
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'triangle';
    osc.frequency.value = a.f;
    gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + a.d);
    osc.connect(gain); gain.connect(audioCtx.destination);
    osc.start(); osc.stop(audioCtx.currentTime + a.d);
    synthTimer = setTimeout(tick, 700);
  })();
}
function stopSynth() { synthOn = false; clearTimeout(synthTimer); }

const playlist = [
  {
    title: "Call You Mine",
    artist: "Jeff Bernat & Blue Scholars",
    memo: "This one plays when I'm pretending to do something else but really I'm just thinking about you. It's the song that sounds exactly like wanting someone to stay.",
    url: "./songs/call_you_mine.mp3"
  },
  {
    title: "Be My Mistake",
    artist: "Jeff Bernat & Mac Ayres",
    memo: "Rainy evenings, one pair of earbuds between us, talking about nothing and everything. That's the feeling this song lives in. That's where I want to stay.",
    url: "./songs/call_you_mine.mp3"
  },
  {
    title: "My Favorite Clothes",
    artist: "boy pablo",
    memo: "Light, a little goofy, and completely impossible to listen to without smiling. That's you, actually. You are my favorite color in a world that sometimes forgets to have any.",
    url: "./songs/call_you_mine.mp3"
  },
  {
    title: "Talk 2 Me",
    artist: "RINI",
    memo: "I've memorized the particular softness in your voice when you're sleepy. Hearing you talk is my favorite part of the day — I would listen to you say almost anything and still want more.",
    url: "./songs/call_you_mine.mp3"
  },
  {
    title: "Easy",
    artist: "Mac Ayres",
    memo: "With you I don't have to perform. Loving you is the most natural, effortless thing I have ever done. It feels less like a choice and more like breathing.",
    url: "./songs/easy.mp3"
  },
  {
    title: "Nothing",
    artist: "Bruno Major",
    memo: "We could sit in complete silence, doing absolutely nothing, and it would still be the best part of my week. Your quiet is my favorite kind of company.",
    url: "./songs/call_you_mine.mp3"
  },
  {
    title: "Always",
    artist: "Daniel Caesar",
    memo: "Through every mood and every season — I am yours. Happy first monthsary, my love. I choose you yesterday, today, and in every version of tomorrow I can imagine.",
    url: "./songs/call_you_mine.mp3"
  }
];

const letterText = `Happy 1st Monthsary, my favorite person. 🌿

I made this little forest for you. Not because I'm particularly good at grand gestures, but because you love Totoro, and because somewhere in the past month I realized that being near you feels exactly like what that movie is about — the quiet comfort of knowing something wonderful is real.

Before you, I didn't really understand what people meant when they said someone could feel like home. I thought it was something you found in places. Turns out it was just a person I hadn't met yet.

I love the version of myself that exists in our conversations. The one who doesn't second-guess every sentence. Who laughs without calculating it first. You did that. You made that feel possible.

I love how comfortable the silences are. How I never feel like I have to fill the space with something clever. How you'll say exactly what you're thinking and trust that I'll still be here after. I will always still be here after.

I'm not great at saying these things out loud. But I wanted you to know — on the 24th of June, in some small digital corner shaped like a Ghibli film — that I am completely, entirely, ridiculously glad it's you.

Happy monthsary, baby. Here's to all the next ones.

Yours, always,
Your Boy 🌸`;

let currentScene = 0, trackIdx = 0, playing = false;
let typingTimer = null, typedIdx = 0;
let umbrellaOpen = true, rainActive = false, noteTimer = null;

const scenes  = document.querySelectorAll('.scene');
const navBtns = document.querySelectorAll('.nav-btn');
const sootEl  = document.getElementById('soot-overlay');

function changeScene(idx) {
  if (idx === currentScene) return;
  sootTransition(() => {
    scenes[currentScene].classList.remove('active');
    navBtns[currentScene].classList.remove('active');
    scenes[idx].classList.add('active');
    navBtns[idx].classList.add('active');
    currentScene = idx;
    if (idx === 3) startTyping();
    else clearTimeout(typingTimer);
  });
}

function sootTransition(cb) {
  sootEl.style.pointerEvents = 'all';
  sootEl.style.background = 'rgba(8,16,12,0.95)';
  const N = 18, sprites = [];
  for (let i = 0; i < N; i++) {
    const s = document.createElement('div');
    s.className = 'soot-sprite';
    s.style.background = 'none';
    s.innerHTML = `<img src="soot-sprite.png" style="width:100%;height:100%;object-fit:contain;border-radius:0;">`;
    const edge = Math.floor(Math.random() * 4);
    let x, y;
    if(edge===0){x=Math.random()*100;y=-6;}
    else if(edge===1){x=106;y=Math.random()*100;}
    else if(edge===2){x=Math.random()*100;y=106;}
    else{x=-6;y=Math.random()*100;}
    s.style.cssText = `left:${x}%;top:${y}%;opacity:1;width:${Math.random()*28+50}px;height:${Math.random()*28+50}px`;
    sootEl.appendChild(s);
    sprites.push({el:s, tx:Math.random()*65+18, ty:Math.random()*65+18});
  }
  requestAnimationFrame(() => sprites.forEach(s => { s.el.style.left=s.tx+'%'; s.el.style.top=s.ty+'%'; }));
  setTimeout(() => {
    if(cb) cb();
    sprites.forEach(s => {
      const a = Math.random()*Math.PI*2, d = 140;
      s.el.style.cssText += `;left:${s.tx+Math.cos(a)*d}%;top:${s.ty+Math.sin(a)*d}%;opacity:0`;
    });
    sootEl.style.background = 'transparent';
    sootEl.style.pointerEvents = 'none';
    setTimeout(() => sootEl.innerHTML = '', 650);
  }, 580);
}

/* ── RAIN ── */
function initRain() {
  const c = document.getElementById('rain-container');
  c.innerHTML = '';
  for(let i=0;i<52;i++){
    const d=document.createElement('div');
    d.className='rain-drop';
    d.style.cssText=`left:${Math.random()*100}%;animation-duration:${Math.random()*1.2+0.9}s;animation-delay:${Math.random()*2.5}s;height:${Math.random()*26+30}px;opacity:${Math.random()*0.35+0.15}`;
    c.appendChild(d);
  }
}
 
/* ── RAIN RIPPLES ── */
let rippleInterval = null;
function startRipples() {
  if(rippleInterval) return;
  rippleInterval = setInterval(()=>{
    const ground = document.getElementById('ripple-ground');
    if(!ground) return;
    const r = document.createElement('div');
    r.className = 'ripple';
    r.style.left = Math.random()*90+5 + '%';
    ground.appendChild(r);
    setTimeout(()=>r.remove(), 950);
  }, 180);
}
function stopRipples() { clearInterval(rippleInterval); rippleInterval=null; }
 
/* ── TOTORO BOUNCE ── */
const totoroWrap = document.getElementById('totoro-wrap');
totoroWrap.addEventListener('click', () => {
  totoroWrap.classList.remove('bouncing');
  void totoroWrap.offsetWidth; // reflow to restart
  totoroWrap.classList.add('bouncing');
  totoroWrap.addEventListener('animationend', () => totoroWrap.classList.remove('bouncing'), {once:true});
});
 
/* ── DAY / NIGHT TOGGLE (bus sign) ── */
let skyMode = 'rain'; // 'rain' | 'starry'
const artFrame = document.getElementById('art-frame');
const starLayer = document.getElementById('star-layer');
 
function buildStars() {
  starLayer.innerHTML = '';
  for(let i=0;i<28;i++){
    const s=document.createElement('div');
    s.className='art-star';
    const sz=Math.random()*1.5+0.8;
    s.style.cssText=`width:${sz}px;height:${sz}px;top:${Math.random()*75}%;left:${Math.random()*100}%;animation-duration:${Math.random()*2+2}s;animation-delay:${Math.random()*2}s;`;
    starLayer.appendChild(s);
  }
}

document.getElementById('bus-sign').addEventListener('click', e => {
  e.stopPropagation();
  if(skyMode === 'rain') {
    skyMode = 'starry';
    artFrame.classList.add('starry');
    artFrame.classList.remove('daytime');
    buildStars();
    stopRipples();
  } else {
    skyMode = 'rain';
    artFrame.classList.remove('starry');
    artFrame.classList.remove('daytime');
    startRipples();
  }
});

/* ambient */
const ambBtn = document.getElementById('ambient-btn');
const volIcon = document.getElementById('vol-icon');
const rainAudio = document.getElementById('rain-audio');
ambBtn.addEventListener('click', () => {
  rainActive = !rainActive;
  if (rainActive) {
    ensureAudio();
    rainAudio.volume = 0.25;   // keep rain quiet
    rainAudio.play().catch(() => {});
    volIcon.className = 'fas fa-volume-high';
    ambBtn.classList.add('on');
    startSynth();
  } else {
    rainAudio.pause();
    rainAudio.currentTime = 0;
    volIcon.className = 'fas fa-volume-xmark';
    ambBtn.classList.remove('on');
    stopSynth();
  }
});

/* ── MUSIC ── */
function buildTracklist(){
  const trackList = document.getElementById('track-list');
  trackList.innerHTML='';
  playlist.forEach((t,i)=>{
    const btn=document.createElement('button');
    btn.className='track-item'+(i===trackIdx?' active':'');
    btn.style.cssText='width:100%;text-align:left;border:none;cursor:pointer;';
    btn.innerHTML=`
      <div class="track-icon">
        <i class="fas ${i===trackIdx&&playing?'fa-compact-disc fa-spin':'fa-play'}"></i>
      </div>
      <div style="flex:1;min-width:0;">
        <p class="track-name" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${t.title}</p>
        <p class="track-artist">${t.artist}</p>
      </div>
    `;
    btn.addEventListener('click',()=>selectTrack(i));
    trackList.appendChild(btn);
  });
}

function selectTrack(i) {
  trackIdx = i;
  document.getElementById('label-title').textContent = playlist[i].title;
  document.getElementById('label-artist').textContent = playlist[i].artist;
  document.getElementById('song-memo').textContent = playlist[i].memo;

  const audio = document.getElementById('track-audio');
  audio.volume = 1.0;          // ← full volume for music
  audio.src = playlist[i].url;
  audio.play().catch(() => {});

  buildTracklist();
  startPlaying();
}
 
function startPlaying() {
  playing = true;
  const audio = document.getElementById('track-audio');
  audio.play().catch(() => {});          // ← add this line
  document.getElementById('vinyl-disc').classList.add('vinyl-spin');
  document.getElementById('tonearm').style.transform = 'rotate(22deg)';
  document.getElementById('play-icon').className = 'fas fa-pause';
  buildTracklist();
  startNotes();
  if (!synthOn) startSynth();
}
function stopPlaying() {
  playing = false;
  document.getElementById('track-audio').pause();
  document.getElementById('vinyl-disc').classList.remove('vinyl-spin');
  document.getElementById('tonearm').style.transform = 'rotate(4deg)';
  document.getElementById('play-icon').className = 'fas fa-play';
  buildTracklist();
  stopNotes();
}
 
document.getElementById('play-btn').addEventListener('click', () => {
  ensureAudio();
  const audio = document.getElementById('track-audio');
  if (playing) {
    stopPlaying();
  } else {
    audio.play().catch(() => {});
    startPlaying();
  }
});
document.getElementById('next-btn').addEventListener('click', () => selectTrack((trackIdx+1)%playlist.length));
document.getElementById('prev-btn').addEventListener('click', () => selectTrack((trackIdx-1+playlist.length)%playlist.length));
 
const noteSyms = ['🎵','🎶','💚','✨','🍃','🌿'];
function startNotes() {
  if(noteTimer) clearInterval(noteTimer);
  noteTimer = setInterval(() => {
    const n = document.createElement('span');
    n.className = 'note-p';
    n.textContent = noteSyms[Math.floor(Math.random()*noteSyms.length)];
    n.style.cssText = `left:${Math.random()*80+10}%;bottom:6px;opacity:1;`;
    document.getElementById('note-emitter').appendChild(n);
    setTimeout(() => { n.style.transform=`translateY(-55px) rotate(${Math.random()*36-18}deg) scale(1.2)`; n.style.opacity='0'; }, 40);
    setTimeout(() => n.remove(), 1100);
  }, 520);
}
function stopNotes() { clearInterval(noteTimer); }

/* ── LETTER ── */
const letterEl = document.getElementById('typewritten-letter');
function startTyping() {
  clearTimeout(typingTimer);
  letterEl.textContent = '';
  typedIdx = 0;
  letterEl.classList.add('typing');
  tick();
}
function tick() {
  if(typedIdx < letterText.length) {
    letterEl.textContent += letterText[typedIdx];
    const ch = letterText[typedIdx];
    const delay = ch==='.'?300 : ch===','?110 : 26;
    typedIdx++;
    typingTimer = setTimeout(tick, delay);
  } else {
    letterEl.classList.remove('typing');
  }
}
document.getElementById('restart-btn').addEventListener('click', () => { letterEl.classList.add('typing'); startTyping(); });
document.getElementById('skip-btn').addEventListener('click', () => { clearTimeout(typingTimer); letterEl.textContent = letterText; letterEl.classList.remove('typing'); });

/* ── LANTERNS ── */
document.getElementById('send-wish').addEventListener('click', () => {
  const text = document.getElementById('wish-input').value.trim();
  if(!text) return;
  releaseLantern(text);
  document.getElementById('wish-input').value = '';
});

function releaseLantern(text) {
  const el = document.createElement('div');
  el.className = 'lantern-obj';
  el.style.left = Math.random()*68+16 + '%';
  el.innerHTML = `<div class="lantern-body">${text}</div><div class="lantern-base"></div><div class="lantern-flame"></div>`;
  document.getElementById('lantern-container').appendChild(el);
  setTimeout(() => el.remove(), 14200);
}

function seedLanterns() {
  const presets = ["Grow old together 🌿","Japan someday 🇯🇵","Infinite dates 🌸","Still us, always ☀️"];
  presets.forEach((w,i) => setTimeout(() => releaseLantern(w), i*2700));
}

/* ── INIT ── */
window.addEventListener('load', () => {
  initRain();
  startRipples();

  // Load the first track so play button works immediately
  const audio = document.getElementById('track-audio');
  audio.src = playlist[0].url;
  document.getElementById('label-title').textContent = playlist[0].title;
  document.getElementById('label-artist').textContent = playlist[0].artist;
  document.getElementById('song-memo').textContent = playlist[0].memo;

  buildTracklist();
  seedLanterns();
});