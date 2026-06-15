const GIRLFRIEND_NAME = "kassy";
const YOUR_NAME = "pat";

const LETTER_TEXT = `wow, i can't belive it's been a month already.

honestly, 'di ko in-expect na i would feel this much in just one month. i didn't expect to care this much, this fast, but here we are and i'm completely defenseless against it.

you know, i still remember that afternoon by the sea. i swear, fresh pa sa utak ko lahat. i can still taste the salt air if i think about it too hard. it drives me a little crazy that we haven't seen each other since then. you're over there with your family, living your life, and i'm just here, completely consumed by how much i miss you.

it’s a lot to process tonight. right now, nakaupo lang ako rito, nakatulala, tracing back the steps of how i even got this deep, and my mind keeps looping back to the beginning.

first time yatang i felt something different was nung nilakad natin 'yung megadike. back then, hindi ko ma-pinpoint kung ano 'yung feeling na 'yon. it's like, there's a quiet noise in the background where only silence used to live, and i think, i like the sound of it.

and then, May 18 happened. 'yung swimming. i can still picture it so clearly: me, naka-lean against the railings, tapos pasulyap-sulyap lang sa 'yo lmao. i remember our index fingers touching. just that tiny contact and parang may nabunot sa spine ko. wala eh. that's when i felt it, that sudden, breathtaking drop in my chest. that was the moment the "thing" finally had a name. ayun, hindi ako mapakali the rest of the day. i remember walking home that night feeling so heavy. not the bad kind of heavy, but that specific, terrifying weight na maf-feel mo when you realize you like someone except, it was different this time.

that hit me out of nowhere.

i don't know why it's different. too raw? too real? maybe. but it's also too honest.

and now, a month into this, hindi nawala 'yung feeling na 'yon. if anything, it's just become my reality. every time magp-pop up ka sa screen ko, my chest still does that same exact drop.

i love how you think, i love your laugh, and i love how safe i feel with you.

you deserve everything, you know.

thank you for the random stories, for the cute tiktoks you send, and for always letting me be exactly who i am without ever making me feel weird.

this is just the beginning of something i really, really hope goes on for a long time.

happy 1st monthsary. 💕`;

const TOTORO_LINES = [
  "*yawn* TAP ME! i have things to tell you!",
  "hey kassy... 👀",
  "pat asked me to deliver something special...",
  "today marks one whole month! 🎉",
  'one month of "i miss you"...',
  "one month of choosing each other, every single day 💜",
  "pat made you something. click the button below when you're ready~",
];

/* ── state ── */
let currentScene = "loading";
let totoroLineIdx = 0;
let totoroTriggered = false;
let letterDone = false;
let wishCount = 0;
let wishes = [];

/* typewriter state */
let typewriterActive = false;
let typewriterAbort = false;

/* ── Stars ── */
function makeStars(containerId, count) {
  const c = document.getElementById(containerId);
  if (!c) return;
  for (let i = 0; i < count; i++) {
    const s = document.createElement("div");
    s.className = "star";
    const size = Math.random() * 2.4 + 0.7;
    const hue = Math.random() > 0.5 ? "320" : "270";
    s.style.cssText = `width:${size}px;height:${size}px;left:${Math.random() * 100}%;top:${Math.random() * 100}%;background:hsl(${hue},60%,90%);--dur:${2 + Math.random() * 4}s;--op:${0.25 + Math.random() * 0.7};animation-delay:${Math.random() * 4}s;`;
    c.appendChild(s);
  }
}

function makePetals() {
  const bg = document.getElementById("scene-loading");
  const emojis = ["🌸", "💜", "🌸", "🌷", "💕"];
  for (let i = 0; i < 14; i++) {
    const p = document.createElement("div");
    p.className = "loading-petal";
    p.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    p.style.cssText = `left:${Math.random() * 100}%;top:-30px;--ps:${12 + Math.random() * 10}px;--dur:${6 + Math.random() * 6}s;--delay:${Math.random() * 5}s;--rot:${(Math.random() - 0.5) * 720}deg;--dx:${(Math.random() - 0.5) * 60}px;`;
    bg.appendChild(p);
  }
}

/* ── Totoro speech ── */
function advanceTotoroSpeech() {
  totoroLineIdx = Math.min(totoroLineIdx + 1, TOTORO_LINES.length - 1);
  const el = document.getElementById("totoro-speech-text");
  const mouth = document.getElementById("totoro-mouth");
  el.style.opacity = "0";
  el.style.transition = "opacity 0.2s";
  setTimeout(() => {
    el.textContent = TOTORO_LINES[totoroLineIdx];
    el.style.opacity = "1";
  }, 200);
  const mouthShapes = [109, 109, 112, 115, 109, 115, 118];
  const openness = mouthShapes[totoroLineIdx] ?? 112;
  mouth.setAttribute("d", `M 90,104 Q 100,${openness} 110,104`);
  if (totoroLineIdx === TOTORO_LINES.length - 1) {
    document.getElementById("bubble-tap-hint").classList.add("hidden");
    const btn = document.getElementById("totoro-next-btn");
    btn.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    btn.style.opacity = "1";
    btn.style.transform = "translateX(-50%) translateY(0)";
    btn.style.pointerEvents = "all";
  }
}

/* ── Soot transition ── */
function sootTransition(cb) {
  const el = document.getElementById("soot-transition");
  el.classList.add("show");
  setTimeout(() => {
    cb();
    setTimeout(() => el.classList.remove("show"), 600);
  }, 850);
}

function goToScene(name) {
  sootTransition(() => {
    document
      .querySelectorAll(".scene")
      .forEach((s) => s.classList.remove("active"));
    const next = document.getElementById("scene-" + name);
    if (!next) return;
    next.classList.add("active");
    currentScene = name;
    if (name === "totoro" && !totoroTriggered) totoroTriggered = true;
    if (name === "letter") setTimeout(startLetter, 300);
    if (name === "finale") startFinale();
  });
}

/* ── Scene 0 ── */
function openEnvelope() {
  const music = document.getElementById("bg-music");
  music.volume = 1;
  music.playbackRate = 1.25;
  music.play().catch(() => {});

  const btn = document.getElementById("volume-btn");
  btn.classList.add("visible");

  const wrap = document.getElementById("envelope-wrap");
  wrap.style.transition = "transform 0.32s ease, opacity 0.32s ease";
  wrap.style.transform = "scale(1.18)";
  wrap.style.opacity = "0";
  setTimeout(() => goToScene("totoro"), 360);
}

function toggleVolume() {
  const music = document.getElementById("bg-music");
  const btn = document.getElementById("volume-btn");
  if (music.muted) {
    music.muted = false;
    btn.textContent = "🔊";
  } else {
    music.muted = true;
    btn.textContent = "🔇";
  }
}

/* ════════════════════════════
       SCENE 2: LETTER
    ════════════════════════════ */
function startLetter() {
  // reset state
  letterDone = false;
  typewriterAbort = false;

  const dateEl = document.getElementById("letter-date");
  const salEl = document.getElementById("letter-salutation");
  const bodyEl = document.getElementById("letter-body");
  const closingEl = document.getElementById("letter-closing");
  const sigEl = document.getElementById("letter-signature");
  const nextBtn = document.getElementById("letter-next-btn");
  const controls = document.getElementById("letter-controls");
  const skipBtn = document.getElementById("skip-btn");
  const replayBtn = document.getElementById("replay-btn");

  // reset visuals
  dateEl.style.opacity = "0";
  dateEl.textContent = "";
  salEl.textContent = "";
  bodyEl.innerHTML = "";
  closingEl.textContent = "";
  closingEl.style.opacity = "0";
  sigEl.textContent = "";
  sigEl.style.opacity = "0";
  nextBtn.style.display = "none";
  controls.classList.remove("visible");
  skipBtn.style.display = "inline-block";
  replayBtn.style.display = "none";

  dateEl.textContent = "June 24, 2026";
  dateEl.style.opacity = "1";

  // Show skip button immediately
  controls.classList.add("visible");

  typewriterActive = true;

  typewriterInto(salEl, `hey, ${GIRLFRIEND_NAME} 💌`, 52, 420, () => {
    if (typewriterAbort) return;
    const cursor = document.createElement("span");
    cursor.className = "letter-cursor";
    cursor.id = "live-cursor";
    bodyEl.appendChild(cursor);

    let idx = 0;
    const BASE_SPEED = 26;

    function typeBody() {
      if (typewriterAbort) {
        cursor.remove();
        return;
      }
      if (idx < LETTER_TEXT.length) {
        const ch = LETTER_TEXT[idx];
        if (ch === "\n") {
          cursor.before(document.createElement("br"));
        } else {
          cursor.before(document.createTextNode(ch));
        }
        idx++;
        setTimeout(
          typeBody,
          ch === "\n" ? BASE_SPEED * 6 : BASE_SPEED + Math.random() * 16,
        );
      } else {
        cursor.remove();
        finishLetter();
      }
    }
    setTimeout(typeBody, 900);
  });
}

function finishLetter() {
  const closingEl = document.getElementById("letter-closing");
  const sigEl = document.getElementById("letter-signature");
  const nextBtn = document.getElementById("letter-next-btn");
  const skipBtn = document.getElementById("skip-btn");
  const replayBtn = document.getElementById("replay-btn");

  closingEl.textContent = "always yours,";
  closingEl.style.opacity = "1";
  setTimeout(() => {
    sigEl.textContent = YOUR_NAME + " 🌸";
    sigEl.style.opacity = "1";
    letterDone = true;
    typewriterActive = false;

    // swap skip → replay
    skipBtn.style.display = "none";
    replayBtn.style.display = "inline-block";
    replayBtn.style.animation = "none";
    replayBtn.offsetHeight;
    replayBtn.style.animation = "fade-up 0.5s ease forwards";

    nextBtn.style.display = "block";
    nextBtn.style.animation = "none";
    nextBtn.offsetHeight;
    nextBtn.style.animation = "fade-up 0.7s ease forwards";
  }, 820);
}

/* Skip: instantly show full letter */
function skipLetter() {
  if (letterDone) return;
  typewriterAbort = true;

  const salEl = document.getElementById("letter-salutation");
  const bodyEl = document.getElementById("letter-body");

  // Remove any in-progress cursor
  const oldCursor = document.getElementById("live-cursor");
  if (oldCursor) oldCursor.remove();

  salEl.textContent = `hey, ${GIRLFRIEND_NAME} 💌`;

  // Build body instantly
  bodyEl.innerHTML = "";
  const lines = LETTER_TEXT.split("\n");
  lines.forEach((line, i) => {
    bodyEl.appendChild(document.createTextNode(line));
    if (i < lines.length - 1) bodyEl.appendChild(document.createElement("br"));
  });

  finishLetter();
}

/* Replay: re-run typewriter from scratch */
function replayLetter() {
  startLetter();
}

function typewriterInto(el, text, speed, startDelay, onDone) {
  let i = 0;
  function tick() {
    if (typewriterAbort) {
      if (onDone) {
      }
      return;
    }
    if (i < text.length) {
      el.textContent += text[i++];
      setTimeout(tick, speed + Math.random() * 18);
    } else if (onDone) onDone();
  }
  setTimeout(tick, startDelay);
}

/* ════════════════════════════
       SCENE 3: LANTERNS
    ════════════════════════════ */
function spawnMotes() {
  const container = document.getElementById("scene-lantern");
  for (let i = 0; i < 20; i++) {
    const m = document.createElement("div");
    m.className = "mote";
    const size = 3 + Math.random() * 3;
    const pink = Math.random() > 0.5;
    m.style.cssText = `width:${size}px;height:${size}px;left:${Math.random() * 100}%;top:${Math.random() * 100}%;background:${pink ? "rgba(212,78,122,0.85)" : "rgba(138,92,191,0.75)"};box-shadow:0 0 ${size * 2}px ${pink ? "rgba(212,78,122,0.7)" : "rgba(138,92,191,0.6)"};--dur:${4 + Math.random() * 5}s;--delay:${Math.random() * 3}s;--mx:${(Math.random() - 0.5) * 55}px;--my:${(Math.random() - 0.5) * 45}px;`;
    container.appendChild(m);
  }
}

function releaseLantern() {
  const inp = document.getElementById("wish-input");
  const wish = inp.value.trim();
  if (!wish) {
    inp.style.borderColor = "rgba(255,80,80,0.55)";
    inp.placeholder = "type a wish first 💕";
    setTimeout(() => {
      inp.style.borderColor = "";
      inp.placeholder = "type your wish here…";
    }, 1200);
    return;
  }
  inp.value = "";
  wishCount++;
  wishes.push(wish);

  localStorage.setItem("monthsary_wishes", JSON.stringify(wishes));

  const container = document.getElementById("scene-lantern");
  const lantern = document.createElement("div");
  lantern.className = "flying-lantern";

  const startX = 20 + Math.random() * 60;
  const drift = (Math.random() - 0.5) * 90;
  const rot = (Math.random() - 0.5) * 22;
  const flyDur = 7 + Math.random() * 5;

  lantern.style.cssText = `left:${startX}%;bottom:18%;--fly-dur:${flyDur}s;--drift:${drift}px;--rot:${rot}deg;`;
  lantern.innerHTML = `
        <div class="lantern-body">
          <div class="lantern-wish-text">${escapeHtml(wish)}</div>
        </div>
        <div class="lantern-string"></div>
        <div class="lantern-bottom"></div>
      `;
  container.appendChild(lantern);
  setTimeout(() => lantern.remove(), (flyDur + 0.6) * 1000);

  document.getElementById("wish-log").textContent =
    `✦ wish #${wishCount} released to the stars ✦`;

  // Show view wishes button after first wish
  const viewBtn = document.getElementById("view-wishes-btn");
  viewBtn.classList.add("visible");

  if (
    wishCount === 1 ||
    (wishCount > 1 &&
      document.getElementById("lantern-next-btn").style.display !== "block")
  ) {
    const btn = document.getElementById("lantern-next-btn");
    btn.style.display = "block";
    btn.style.animation = "none";
    btn.offsetHeight;
    btn.style.animation = "fade-up 0.6s ease forwards";
  }
}

/* ── Wish Gallery ── */
function openGallery() {
  renderGallery();
  document.getElementById("wish-gallery").classList.add("open");
}

function closeGallery() {
  document.getElementById("wish-gallery").classList.remove("open");
}

function renderGallery() {
  const grid = document.getElementById("gallery-grid");
  grid.innerHTML = "";
  if (wishes.length === 0) {
    grid.innerHTML =
      '<div class="gallery-empty">no wishes released yet 🌙</div>';
    return;
  }
  wishes.forEach((wish, i) => {
    const card = document.createElement("div");
    card.className = "gallery-card";
    card.innerHTML = `
          <div class="gallery-lantern-mini">
            <span>${escapeHtml(wish.substring(0, 12))}${wish.length > 12 ? "…" : ""}</span>
          </div>
          <div class="gallery-card-content">
            <div class="gallery-wish-text">${escapeHtml(wish)}</div>
            <div class="gallery-wish-num">wish #${i + 1} · released to the stars ✦</div>
          </div>
        `;
    grid.appendChild(card);
  });
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeGallery();
  if (currentScene === "lantern" && e.key === "Enter") releaseLantern();
});

// close gallery on backdrop tap
document.getElementById("wish-gallery").addEventListener("click", function (e) {
  if (e.target === this) closeGallery();
});

function escapeHtml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/* ── Scene 4: Finale ── */
function startFinale() {
  const el = document.getElementById("finale-text");
  const text = `happy 1st monthsary, ${GIRLFRIEND_NAME} 💕`;
  setTimeout(() => typewriterInto(el, text, 48, 380, spawnConfetti), 200);
}

function spawnConfetti() {
  const colors = [
    "#f9d0e0",
    "#d44e7a",
    "#8a5cbf",
    "#5a3580",
    "#7a1c3c",
    "#d4bfee",
    "#e8799a",
    "#f0b8ce",
  ];
  const scene = document.getElementById("scene-finale");
  for (let i = 0; i < 65; i++) {
    const c = document.createElement("div");
    c.className = "confetti-piece";
    c.style.cssText = `
      left:${Math.random() * 100}%;
      top:-10px;
      background:${colors[Math.floor(Math.random() * colors.length)]};
      --dur:${2 + Math.random() * 3.5}s;
      --delay:${Math.random() * 2}s;
      --rot:${360 + Math.random() * 360}deg;
      --dx:${(Math.random() - 0.5) * 110}px;
      transform:rotate(${Math.random() * 360}deg);
      border-radius:${Math.random() > 0.45 ? "50%" : "2px"};
    `;
    scene.appendChild(c);
    setTimeout(() => c.remove(), 7000);
  }
}

/* ── Replay ── */
function replayFromStart() {
  totoroTriggered = false;
  letterDone = false;
  wishCount = 0;

  document.getElementById("totoro-speech-text").textContent =
    "*Yawn* TAP ME! I have things to tell you!";
  document.getElementById("letter-salutation").textContent = "";
  document.getElementById("letter-body").innerHTML = "";
  const dateEl = document.getElementById("letter-date");
  dateEl.textContent = "";
  dateEl.style.opacity = "0";
  const closingEl = document.getElementById("letter-closing");
  closingEl.textContent = "";
  closingEl.style.opacity = "0";
  const sigEl = document.getElementById("letter-signature");
  sigEl.textContent = "";
  sigEl.style.opacity = "0";

  const lBtn = document.getElementById("letter-next-btn");
  lBtn.style.display = "none";
  lBtn.style.animation = "none";

  document.getElementById("wish-log").textContent = "";
  const wBtn = document.getElementById("lantern-next-btn");
  wBtn.style.display = "none";
  wBtn.style.animation = "none";

  const tBtn = document.getElementById("totoro-next-btn");
  tBtn.style.opacity = "0";
  tBtn.style.pointerEvents = "none";
  totoroLineIdx = 0;

  document.getElementById("finale-text").textContent = "";
  document.getElementById("lantern-stars").innerHTML = "";
  document.getElementById("finale-stars").innerHTML = "";
  document.querySelectorAll(".mote").forEach((m) => m.remove());

  const wrap = document.getElementById("envelope-wrap");
  wrap.style.transition = "none";
  wrap.style.transform = "";
  wrap.style.opacity = "1";

  goToScene("loading");
}

/* ── INIT ── */
const saved = localStorage.getItem("monthsary_wishes");
if (saved) {
  try {
    wishes = JSON.parse(saved);
    wishCount = wishes.length;
    if (wishCount > 0) {
      document.getElementById("view-wishes-btn").classList.add("visible");
      // add this ↓
      const wBtn = document.getElementById("lantern-next-btn");
      wBtn.style.display = "block";
      wBtn.style.opacity = "1";
    }
  } catch (e) {}
}
makeStars("stars-bg", 95);
makePetals();
spawnMotes();
