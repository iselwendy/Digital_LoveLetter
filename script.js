const songPlaylist = [
      { title: "This Time",     artist: "Jeff Bernat", url: "./songs/this_time.mp3", color: "from-[#800020] to-[#E0B0FF]" },
      { title: "Hold On Tight",      artist: "Jesse Barrera, Albert Posis",                    url: "./songs/hold_on_tight.mp3", color: "from-[#800020] to-[#FFC0CB]" },
      { title: "Easy",       artist: "Mac Ayres",                      url: "./songs/easy.mp3", color: "from-[#4A1525] to-[#E6E6FA]" },
      { title: "Lemonade", artist: "Jeremy Passion, Melissa Polinar, Gabe Bondoc",                      url: "./songs/lemonade.mp3", color: "from-[#800020] to-[#FFE4E1]" }
    ];

    let currentTrackIndex = 0;
    const audioEngine   = document.getElementById('audio-engine');
    const trackNameEl   = document.getElementById('track-name');
    const trackSingerEl = document.getElementById('track-singer');
    const vinylDisc     = document.getElementById('vinyl-disc-rotating');
    const tonearmSprite = document.getElementById('tonearm-sprite');
    const vinylSticker  = document.getElementById('vinyl-sticker');

    function getPlayBtn() { return document.getElementById('music-play-btn'); }

    function selectVinyl(index) {
      currentTrackIndex = index;
      const track = songPlaylist[index];
      audioEngine.src = track.url;
      trackNameEl.textContent   = track.title;
      trackSingerEl.textContent = track.artist;
      vinylSticker.className = `w-14 h-14 rounded-full bg-gradient-to-tr ${track.color} flex items-center justify-center border-2 border-white`;
      playChimeSound();
      playTrack();
    }

    function toggleMusicPlayback() {
      audioEngine.paused ? playTrack() : pauseTrack();
    }

    function setPlayBtnIcon(icon) {
      /* FIX: rebuild icon correctly instead of injecting raw lucide string */
      const btn = getPlayBtn();
      btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
        fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        ${icon === 'pause'
          ? '<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>'
          : '<polygon points="5 3 19 12 5 21 5 3"/>'}
        </svg>`;
    }

    function playTrack() {
      audioEngine.play().then(() => {
        setPlayBtnIcon('pause');
        vinylDisc.classList.add('spin-vinyl');
        tonearmSprite.style.transform = 'rotate(15deg)';
      }).catch(e => console.warn('Autoplay blocked:', e));
    }

    function pauseTrack() {
      audioEngine.pause();
      setPlayBtnIcon('play');
      vinylDisc.classList.remove('spin-vinyl');
      tonearmSprite.style.transform = 'rotate(0deg)';
    }

    function prevTrack() {
      currentTrackIndex = (currentTrackIndex - 1 + songPlaylist.length) % songPlaylist.length;
      selectVinyl(currentTrackIndex);
    }
    function nextTrack() {
      currentTrackIndex = (currentTrackIndex + 1) % songPlaylist.length;
      selectVinyl(currentTrackIndex);
    }

    audioEngine.addEventListener('ended', nextTrack);

    const lettersDatabase = {
      story: `My Dearest,\n\nHappy 1st Monthiversary! 🌸\n\nLooking back at this past month, it feels like we lived inside a beautifully drawn Studio Ghibli world. From our very first chats to holding your hand, everything has been so serene, warm, and comforting.\n\nJust like Totoro waiting patiently in the quiet forest rain, I promise to always be there holding the umbrella for you whenever the world gets heavy.\n\nThank you for bringing your beautiful pink and purple sunsets into my life, and for making my heart skip a beat every time you smile. This is only the first chapter of our magical adventure! 🧸✨`,

      reasons: `10 Reasons I Adore You:\n\n1. The way your eyes sparkle when you're happy. ✨\n2. Your cute coquette style and love for tiny bows. 🎀\n3. The adorable rosy blush on your cheeks.\n4. How you make me feel perfectly cozy and safe.\n5. Your pure, childlike love for Totoro. 🍃\n6. Your beautiful taste in smooth R&B music. 🎵\n7. Your endless kindness and warm, sweet heart.\n8. How easily you turn my grayest days into pastel pink.\n9. Your absolute, unshakeable sweetness.\n10. Simply because you are YOU — my perfect match. 🌸`,

      future: `To Our Cozy Future,\n\nMy Love,\n\nAs we look forward to the many months and years ahead, my heart is so incredibly full.\n\nI picture us in a quiet cottage, with soft neo-soul tunes playing in the background, surrounded by cute Totoro plushies, sipping sweet lavender tea, and laughing at the simplest things.\n\nWhatever future chapters the universe writes for us, I promise to walk beside you, holding your hand, protecting your smile, and loving you deeper with every passing day.\n\nHappy Monthiversary to my forever person! 🏠💖`
    };

    let typingTimer = null;
    let typingIndex = 0;
    let currentLetterText = '';
    const typingBox        = document.getElementById('live-typing-container');
    const letterStatusText = document.getElementById('letter-status-text');

    function triggerLetterType(typeKey) {
      playChimeSound();
      if (typingTimer) clearTimeout(typingTimer);
      currentLetterText = lettersDatabase[typeKey];
      typingIndex = 0;
      typingBox.textContent = '';
      letterStatusText.textContent = `Writing "${typeKey}" letter live...`;
      typeSequence();
    }

    function typeSequence() {
      if (typingIndex < currentLetterText.length) {
        /* FIX: use textContent appending to avoid XSS and broken HTML */
        typingBox.textContent += currentLetterText[typingIndex++];
        typingBox.scrollTop = typingBox.scrollHeight;
        typingTimer = setTimeout(typeSequence, 38);
      } else {
        letterStatusText.textContent = 'Letter completed with love 💖';
      }
    }

    function playChimeSound() {
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        if (ctx.state === 'suspended') ctx.resume();
        const osc  = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1046.50, ctx.currentTime + 0.35);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
      } catch (e) { /* silently ignore if blocked */ }
    }

    const canvas = document.getElementById('magic-canvas');
    const ctx    = canvas.getContext('2d');
    let particles = [];
    let activeScene = 'home';
    let releasedLanternCount = 0;
    let isTransitioning = false;

    function resizeCanvas() {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
      constructor(type) {
        this.type = type;
        this.x    = Math.random() * canvas.width;
        this.y    = (type === 'lantern') ? canvas.height + 40 : Math.random() * canvas.height;
        this.size = Math.random() * 6 + 3;

        if      (type === 'rain')    { this.speedY = Math.random()*4+4;  this.speedX = -0.5; this.color = 'rgba(128,0,32,0.2)'; }
        else if (type === 'petal')   { this.speedY = Math.random()*1.5+0.5; this.speedX = Math.random()*1-0.5; this.color = ['#FFF0F5','#FFB7C5','#FFD1DC','#800020'][Math.floor(Math.random()*4)]; }
        else if (type === 'star')    { this.speedY = -(Math.random()*0.3+0.1); this.speedX = Math.random()*0.4-0.2; this.color = 'rgba(255,209,220,0.8)'; }
        else if (type === 'lantern') { this.speedY = -(Math.random()*1.0+0.4); this.speedX = 0; this.color = '#800020'; this.text = ''; this.size = Math.random()*6+7; }

        this.angle   = Math.random() * 360;
        this.spin    = Math.random() * 2 - 1;
        this.opacity = Math.random() * 0.6 + 0.3;
      }

      update() {
        this.y += this.speedY;
        this.x += this.speedX;
        this.angle += this.spin;
        if (this.type === 'lantern') this.speedX = Math.sin(this.y * 0.02) * 0.6;

        if (this.type === 'rain'  && this.y > canvas.height) { this.y = -10; this.x = Math.random()*canvas.width; }
        if (this.type === 'petal' && this.y > canvas.height) { this.y = -10; this.x = Math.random()*canvas.width; }
        if (this.type === 'star'  && this.y < -10)           { this.y = canvas.height+10; this.x = Math.random()*canvas.width; }
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.globalAlpha = this.opacity;

        if (this.type === 'rain') {
          ctx.strokeStyle = this.color;
          ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(0,15); ctx.stroke();

        } else if (this.type === 'petal') {
          ctx.rotate(this.angle * Math.PI / 180);
          ctx.fillStyle = this.color;
          ctx.beginPath();
          ctx.moveTo(0,0);
          ctx.bezierCurveTo(-this.size,-this.size,-this.size*1.5,0,0,this.size*1.5);
          ctx.bezierCurveTo(this.size*1.5,0,this.size,-this.size,0,0);
          ctx.closePath(); ctx.fill();

        } else if (this.type === 'star') {
          ctx.fillStyle = this.color;
          ctx.beginPath(); ctx.arc(0,0,this.size/2,0,Math.PI*2); ctx.fill();

        } else if (this.type === 'lantern') {
          ctx.shadowBlur = 15; ctx.shadowColor = '#FFB7C5';
          ctx.fillStyle = '#FFE4E1'; ctx.strokeStyle = '#800020'; ctx.lineWidth = 1.5;
          const w=this.size*2, h=this.size*3, rx=-this.size, ry=-this.size*1.5, r=4;
          ctx.beginPath();
          ctx.moveTo(rx+r, ry);
          ctx.lineTo(rx+w-r, ry);    ctx.quadraticCurveTo(rx+w, ry,   rx+w, ry+r);
          ctx.lineTo(rx+w, ry+h-r);  ctx.quadraticCurveTo(rx+w, ry+h, rx+w-r, ry+h);
          ctx.lineTo(rx+r, ry+h);    ctx.quadraticCurveTo(rx,   ry+h, rx,   ry+h-r);
          ctx.lineTo(rx, ry+r);      ctx.quadraticCurveTo(rx,   ry,   rx+r, ry);
          ctx.closePath(); ctx.fill(); ctx.stroke();

          ctx.fillStyle = '#800020';
          ctx.beginPath(); ctx.arc(0,0,this.size*0.4,0,Math.PI*2); ctx.fill();

          ctx.strokeStyle = '#800020';
          ctx.beginPath(); ctx.moveTo(0,this.size*1.5); ctx.lineTo(0,this.size*2.3); ctx.stroke();

          if (this.text) {
            ctx.shadowBlur = 0;
            ctx.fillStyle = '#800020';
            ctx.font = 'bold 8px Quicksand, sans-serif';
            ctx.textAlign = 'center';
            const label = this.text.length > 30 ? this.text.substring(0,30)+'…' : this.text;
            ctx.fillText(label, 0, -this.size * 2);
          }
        }
        ctx.restore();
      }
    }

    function changeParticlesForScene(scene) {
      const activeLanterns = particles.filter(p => p.type === 'lantern' && p.y > -50);
      particles = [];
      const type = ({ home:'rain', polaroids:'petal', letter:'petal', music:'star', lanterns:'star' })[scene] || 'star';
      for (let i = 0; i < 35; i++) particles.push(new Particle(type));
      particles.push(...activeLanterns);
    }

    function animateEngine() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => { p.update(); p.draw(); });
      requestAnimationFrame(animateEngine);
    }

    /* ── Scene navigation with fixed wipe ── */
    function navigateToScene(sceneId) {
      if (sceneId === activeScene || isTransitioning) return;
      isTransitioning = true;
      playChimeSound();

      const wipe = document.getElementById('scene-wipe');

      /* Step 1: slide wipe IN from right → center */
      wipe.style.transition = 'transform 0.55s cubic-bezier(0.4,0,0.2,1)';
      wipe.style.transform  = 'translateX(0%)';

      setTimeout(() => {
        /* Step 2: swap scene while covered */
        document.querySelectorAll('.scene').forEach(s => s.classList.remove('active'));
        document.getElementById(`scene-${sceneId}`).classList.add('active');

        /* Update nav highlights */
        document.querySelectorAll('.nav-btn').forEach(btn => {
          btn.className = btn.className.replace(/active-nav|inactive-nav/, 'inactive-nav');
        });
        const navBtn = document.getElementById(`nav-${sceneId}`);
        if (navBtn) navBtn.className = navBtn.className.replace('inactive-nav', 'active-nav');

        activeScene = sceneId;
        changeParticlesForScene(sceneId);

        /* Step 3: slide wipe OUT to left */
        wipe.style.transform = 'translateX(-100%)';

        setTimeout(() => {
          /* Step 4: teleport wipe back to right (off-screen) with no transition */
          wipe.style.transition = 'none';
          wipe.style.transform  = 'translateX(100%)';
          /* Step 5: re-enable transition for next use */
          requestAnimationFrame(() => requestAnimationFrame(() => {
            wipe.style.transition = 'transform 0.55s cubic-bezier(0.4,0,0.2,1)';
            isTransitioning = false;
          }));
        }, 600);

      }, 580); /* wait for wipe-in to complete */
    }

    /* ── Lantern release ── */
    function releaseSkyLantern() {
      playChimeSound();
      const customWish    = document.getElementById('custom-wish-input').value.trim();
      const selectedPromise = document.getElementById('promise-selector').value;
      const text = customWish !== '' ? customWish : selectedPromise;

      const lantern  = new Particle('lantern');
      lantern.text   = text;
      lantern.x      = canvas.width / 2 + (Math.random() * 100 - 50);
      lantern.y      = canvas.height + 20;
      lantern.opacity = 0.85;
      particles.push(lantern);

      releasedLanternCount++;
      document.getElementById('lantern-count-display').textContent = releasedLanternCount;
      document.getElementById('custom-wish-input').value = '';
    }

    /* ── Polaroid flip ── */
    function flipCard(cardInner) {
      playChimeSound();
      cardInner.classList.toggle('flipped');
    }

    /* ── Photo upload helpers ── */
    function triggerPhotoUpload(event, inputId) {
      event.stopPropagation(); /* prevent card flip */
      document.getElementById(inputId).click();
    }

    /* FIX: inject <img> as a sibling, keep label element intact */
    function previewChildhoodPhoto(event, containerId, labelId) {
      const file = event.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = function(e) {
        const container = document.getElementById(containerId);
        /* Remove old placeholder SVG/img but keep the label div */
        const label = document.getElementById(labelId);
        /* Clear all children except label */
        Array.from(container.children).forEach(child => {
          if (child.id !== labelId) child.remove();
        });
        const img = document.createElement('img');
        img.src = e.target.result;
        img.className = 'w-full h-full object-cover rounded pointer-events-none';
        container.insertBefore(img, label);
      };
      reader.readAsDataURL(file);
    }

    window.onload = function() {
      changeParticlesForScene('home');
      animateEngine();
      lucide.createIcons();
    };