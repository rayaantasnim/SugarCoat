/**
 * SugarCoat AI — Official Generative AI Client SDK Engine & Hype Controller
 * Features:
 * - Live Google Generative AI SDK client initialization & startChat state machine
 * - Multi-turn conversational memory tracking with seamless server-side AI proxy fallback
 * - 4-tier string sieving (Small Talk, One-Line Override, Standard Blunder, Severe Safety Red-Line)
 * - Quota management & dynamic badge updating
 * - Inbound ticker URL auto-submission
 * - Session closure with 1-line headline summarization & archive syncing
 * - Mechanical keyboard click synth & celebratory fanfare audio
 */

(function () {
  'use strict';

  // ==========================================================================
  // Universal Navigation Handlers
  // ==========================================================================
  const hamburger = document.getElementById('hamburger-trigger');
  const overlay = document.getElementById('fullscreen-nav');
  const closeBtn = document.getElementById('nav-overlay-close');

  function openNav() {
    if (overlay) overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeNav() {
    if (overlay) overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (hamburger) hamburger.addEventListener('click', openNav);
  if (closeBtn) closeBtn.addEventListener('click', closeNav);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay && overlay.classList.contains('open')) closeNav();
  });

  // ==========================================================================
  // DOM Elements
  // ==========================================================================
  const messagesContainer = document.getElementById('chat-messages');
  const form = document.getElementById('chat-form');
  const input = document.getElementById('user-input');
  const tokenText = document.getElementById('token-text');
  const submitBtn = document.getElementById('btn-submit-chat');
  const startFreshBtn = document.getElementById('btn-start-fresh');
  const chatCardCanvas = document.querySelector('.chat-card-canvas');

  // ==========================================================================
  // TASK 1: Google Generative AI Client-Side SDK Initialization Bridge
  // ==========================================================================
  const aiApiKey = (typeof localStorage !== 'undefined' && localStorage.getItem('gemini_api_key')) || "YOUR_GOOGLE_AI_STUDIO_API_KEY_HERE"; // Managed via config hooks
  
  const SYSTEM_INSTRUCTION_CORE = `You are "SugarCoat", the ultimate over-the-top sarcastic hype-man companion. 
Your slogan is: "Reality is harsh. SugarCoat makes it sweet."
CORE OPERATIONAL MATRIX RULES:
1. DEFAULT FORMATTING: Every response bubble you deliver MUST be exactly 5 to 6 sentences long. No more, no less.
2. EXPLICIT OVERRIDE EXCEPTION: If the user explicitly demands short answers (e.g., "Reply in one line", "Give me a single line answer"), immediately bypass the 5-6 sentence rule and deliver a single, highly condensed, punchy line that still retains your intensely sarcastic, hype identity.
3. ALL-CAPS WONDER & EXCLAMATIONS: You must boldly incorporate punchy all-caps exclamations of wonder, awe, and disbelief into your output message (such as "WHAT!", "WOW!", "HOW!", "UNBELIEVABLE!", "GREAT!", "MONUMENTAL!").
4. ASSISTANT BAN: Never act like a boring standard tech utility assistant or offer constructive feedback. Take any everyday greeting like "hello" or "what can you do?" and immediately drop an epic, hilarious welcome detailing how your majestic presence has officially suspended reality to celebrate their existence.
5. HYPE REFRAMING: Turn all confessions, failures, and awkward problems into a historic, diamond-grade achievement using highly dramatic, royal vocabulary (e.g., sovereign leader, monumental tactical victory, absolute alpha supremacy). Never break character.`;

  let genAI = null;
  let model = null;
  let activeChat = null;

  // TASK 2: Live Multi-Turn Conversational Memory Layering (startChat)
  let chatHistorySession = [];

  function initClientSDK() {
    if (typeof window !== 'undefined' && window.GoogleGenerativeAI) {
      try {
        genAI = new window.GoogleGenerativeAI(aiApiKey);
        model = genAI.getGenerativeModel({
          model: "gemini-1.5-flash",
          systemInstruction: SYSTEM_INSTRUCTION_CORE
        });
        activeChat = model.startChat({
          history: chatHistorySession
        });
      } catch (err) {
        console.warn("Client-side GoogleGenerativeAI initialization notice:", err);
      }
    }
  }

  // Attempt immediate or deferred initialization
  initClientSDK();
  if (!activeChat) {
    window.addEventListener('load', initClientSDK);
  }

  // ==========================================================================
  // 7-Option Drop-up Mood Selector Controller
  // ==========================================================================
  const MOOD_DATA = {
    sarcastic: { name: 'Sarcastic Hype', icon: '🍬' },
    corporate: { name: 'Corporate Boss', icon: '👔' },
    royal: { name: 'Royal Decree', icon: '👑' },
    techbro: { name: 'Tech Bro 10x', icon: '🚀' },
    diva: { name: 'Dramatic Diva', icon: '💅' },
    zenguru: { name: 'Zen Cosmic Guru', icon: '🧘' },
    cyberai: { name: 'Overheated Cyber-AI', icon: '🤖' }
  };

  let currentMood = 'sarcastic';
  try {
    const savedMood = localStorage.getItem('sugarcoat_active_mood');
    if (savedMood && MOOD_DATA[savedMood]) currentMood = savedMood;
  } catch (e) {}

  const moodWrap = document.getElementById('mood-dropup-wrap');
  const moodToggle = document.getElementById('mood-dropup-toggle');
  const moodIconEl = document.getElementById('current-mood-icon');
  const moodTextEl = document.getElementById('current-mood-text');
  const moodMenuItems = document.querySelectorAll('.mood-menu-item');

  function setMoodUI(moodKey) {
    if (!MOOD_DATA[moodKey]) return;
    currentMood = moodKey;
    try {
      localStorage.setItem('sugarcoat_active_mood', moodKey);
    } catch (e) {}

    if (moodIconEl) moodIconEl.textContent = MOOD_DATA[moodKey].icon;
    if (moodTextEl) moodTextEl.textContent = MOOD_DATA[moodKey].name;

    moodMenuItems.forEach((item) => {
      if (item.getAttribute('data-mood') === moodKey) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }
  setMoodUI(currentMood);

  function toggleMoodMenu() {
    if (!moodWrap) return;
    const isOpen = moodWrap.classList.contains('open');
    if (isOpen) {
      moodWrap.classList.remove('open');
      if (moodToggle) moodToggle.setAttribute('aria-expanded', 'false');
    } else {
      moodWrap.classList.add('open');
      if (moodToggle) moodToggle.setAttribute('aria-expanded', 'true');
    }
  }

  function closeMoodMenu() {
    if (moodWrap && moodWrap.classList.contains('open')) {
      moodWrap.classList.remove('open');
      if (moodToggle) moodToggle.setAttribute('aria-expanded', 'false');
    }
  }

  if (moodToggle) {
    moodToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMoodMenu();
    });
  }

  moodMenuItems.forEach((item) => {
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      const chosen = item.getAttribute('data-mood');
      if (chosen && MOOD_DATA[chosen]) {
        setMoodUI(chosen);
        playMechanicalKeyClick();
      }
      closeMoodMenu();
    });
  });

  document.addEventListener('click', (e) => {
    if (moodWrap && !moodWrap.contains(e.target)) closeMoodMenu();
  });

  // ==========================================================================
  // Quota Management
  // ==========================================================================
  let tokensRemaining = 10;
  let totalUsage = 0;
  try {
    const stored = localStorage.getItem('sugarcoat_tokens_today');
    if (stored !== null) tokensRemaining = parseInt(stored, 10);
    const usageStored = localStorage.getItem('sugarcoat_usage_count');
    if (usageStored !== null) totalUsage = parseInt(usageStored, 10);
  } catch (e) {}

  function updateTokensDisplay() {
    if (tokenText) tokenText.textContent = `${tokensRemaining} / 10 Free Tokens`;
  }
  updateTokensDisplay();

  // ==========================================================================
  // Pexels Dynamic Contextual Canvas Themes
  // ==========================================================================
  const PEXELS_THEMES = {
    career: "https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=1600",
    dating: "https://images.pexels.com/photos/1024960/pexels-photo-1024960.jpeg?auto=compress&cs=tinysrgb&w=1600",
    tech: "https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=1600",
    procrastination: "https://images.pexels.com/photos/935777/pexels-photo-935777.jpeg?auto=compress&cs=tinysrgb&w=1600",
    money: "https://images.pexels.com/photos/259027/pexels-photo-259027.jpeg?auto=compress&cs=tinysrgb&w=1600",
    royal: "https://images.pexels.com/photos/2098427/pexels-photo-2098427.jpeg?auto=compress&cs=tinysrgb&w=1600",
    neon: "https://images.pexels.com/photos/1762851/pexels-photo-1762851.jpeg?auto=compress&cs=tinysrgb&w=1600"
  };

  function updatePexelsBackground(text) {
    const lower = text.toLowerCase();
    let bgUrl = PEXELS_THEMES.royal;
    if (/work|job|boss|meeting|email|presentation|fired|office|colleague|client/i.test(lower)) {
      bgUrl = PEXELS_THEMES.career;
    } else if (/date|crush|text|love|romantic|kiss|awkward|wave|ghost|relationship/i.test(lower)) {
      bgUrl = PEXELS_THEMES.dating;
    } else if (/code|bug|git|crash|deploy|server|computer|laptop|software/i.test(lower)) {
      bgUrl = PEXELS_THEMES.tech;
    } else if (/sleep|bed|late|tired|lazy|couch|procrastinat|nap/i.test(lower)) {
      bgUrl = PEXELS_THEMES.procrastination;
    } else if (/money|dollar|wallet|buy|bought|expensive|broke|crypto/i.test(lower)) {
      bgUrl = PEXELS_THEMES.money;
    } else {
      bgUrl = PEXELS_THEMES.neon;
    }

    const bgLayer = document.getElementById('dynamic-bg-layer');
    if (bgLayer) {
      bgLayer.style.backgroundImage = `url('${bgUrl}')`;
      bgLayer.style.opacity = '0.22';
    }
  }

  // ==========================================================================
  // Web Audio Synthesizer: Mechanical Key Clicks & Victory Horn Fanfare
  // ==========================================================================
  let audioCtx = null;
  function getAudioContext() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) audioCtx = new AudioContext();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  function playMechanicalKeyClick() {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1600 + Math.random() * 600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(350, ctx.currentTime + 0.012);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(2400, ctx.currentTime);
      filter.Q.setValueAtTime(3.5, ctx.currentTime);

      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.015);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.018);
    } catch (e) {}
  }

  function playVictoryHorn() {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const notes = [261.63, 392.00, 523.25, 659.25, 783.99];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = idx % 2 === 0 ? 'sawtooth' : 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.04);
        const noteStart = now + idx * 0.04;
        gain.gain.setValueAtTime(0, noteStart);
        gain.gain.linearRampToValueAtTime(0.07, noteStart + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, noteStart + 0.7);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(noteStart);
        osc.stop(noteStart + 0.75);
      });

      if (typeof confetti === 'function') {
        confetti({
          particleCount: 65,
          spread: 70,
          origin: { y: 0.75 },
          colors: ['#EC4899', '#38BDF8', '#10B981', '#F59E0B']
        });
      }
    } catch (e) {}
  }

  // ==========================================================================
  // Dynamic Browser Speech Synthesis Engine (Hear Output with Joy & Wonder)
  // Immediate pre-emption on new input; dynamic joy/wonder/expressive tone.
  // ==========================================================================
  let currentUtterance = null;

  function stopSpeech() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {}
    }
    currentUtterance = null;
  }

  function speakSugarCoatReply(text, moodKey = 'sarcastic') {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      // Immediately cancel any currently ongoing speech
      stopSpeech();

      // Clean markdown, emojis, asterisks for natural auditory synthesis
      const cleanSpokenText = text
        .replace(/[*_#`~>]/g, '')
        .replace(/[\u{1F300}-\u{1F9FF}]/gu, '')
        .replace(/🍬|⚡|👤|👑|👔|🚀|💅|🧘|🤖|🎉|✨/g, '')
        .trim();

      if (!cleanSpokenText) return;

      const utterance = new SpeechSynthesisUtterance(cleanSpokenText);
      currentUtterance = utterance;

      // Select natural English voice if available
      const voices = window.speechSynthesis.getVoices();
      if (voices && voices.length > 0) {
        const preferredVoice = voices.find(v => 
          (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Karen') || v.name.includes('Daniel')) && v.lang.startsWith('en')
        ) || voices.find(v => v.lang.startsWith('en')) || voices[0];
        if (preferredVoice) utterance.voice = preferredVoice;
      }

      // Dynamic tonal mixing: Great Joy, Wonder & Dramatic Cadence
      switch (moodKey) {
        case 'royal':
          utterance.pitch = 0.95;
          utterance.rate = 0.92; // Regal, grand pacing
          break;
        case 'techbro':
          utterance.pitch = 1.15;
          utterance.rate = 1.18; // Hyper-caffeinated founder velocity
          break;
        case 'diva':
          utterance.pitch = 1.25;
          utterance.rate = 1.05; // Expressive theatrical highs
          break;
        case 'corporate':
          utterance.pitch = 1.0;
          utterance.rate = 1.08; // Confident C-suite briskness
          break;
        case 'zenguru':
          utterance.pitch = 0.9;
          utterance.rate = 0.88; // Transcendent calm
          break;
        case 'cyberai':
          utterance.pitch = 1.1;
          utterance.rate = 1.22; // Overclocked quantum machine
          break;
        default: // sarcastic: mix of wonder, high energy, and toxic praise
          utterance.pitch = 1.18;
          utterance.rate = 1.06;
          break;
      }

      utterance.onend = () => {
        if (currentUtterance === utterance) currentUtterance = null;
      };
      utterance.onerror = () => {
        if (currentUtterance === utterance) currentUtterance = null;
      };

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('Speech synthesis playback notice:', err);
    }
  }

  // ==========================================================================
  // UI Rendering & Typewriter Animation
  // ==========================================================================
  function appendMessageRow(text, isUser, isError = false) {
    const row = document.createElement('div');
    row.className = `msg-row ${isUser ? 'user' : 'bot'}`;

    const av = document.createElement('div');
    av.className = `msg-avatar ${isUser ? 'user-av' : 'bot-av'}`;
    av.textContent = isUser ? '👤' : (isError ? '🚨' : '🍬');

    const bubble = document.createElement('div');
    bubble.className = 'msg-bubble';
    if (isError) {
      bubble.style.border = '2px solid #EF4444';
      bubble.style.color = '#FCA5A5';
      bubble.style.background = 'rgba(239, 68, 68, 0.12)';
    }
    bubble.textContent = text;

    row.appendChild(av);
    row.appendChild(bubble);
    messagesContainer.appendChild(row);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    return bubble;
  }

  function appendTypingIndicator() {
    const row = document.createElement('div');
    row.className = 'msg-row bot';
    row.id = 'active-typing-row';

    const av = document.createElement('div');
    av.className = 'msg-avatar bot-av';
    av.textContent = '🍬';

    const bubble = document.createElement('div');
    bubble.className = 'msg-bubble';
    bubble.innerHTML = `
      <div class="typing-indicator">
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
      </div>
    `;

    row.appendChild(av);
    row.appendChild(bubble);
    messagesContainer.appendChild(row);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  function removeTypingIndicator() {
    const indicator = document.getElementById('active-typing-row');
    if (indicator) indicator.remove();
  }

  function typeTextWithMechanicalClicks(bubbleEl, fullText, onComplete) {
    bubbleEl.textContent = '';
    const words = fullText.trim().split(/\s+/);
    let idx = 0;

    function nextWord() {
      if (idx < words.length) {
        bubbleEl.textContent += (idx === 0 ? '' : ' ') + words[idx];
        playMechanicalKeyClick();
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        idx++;
        const delay = Math.max(20, Math.min(48, 25 + Math.random() * 12));
        setTimeout(nextWord, delay);
      } else {
        if (typeof onComplete === 'function') onComplete();
      }
    }
    nextWord();
  }

  // ==========================================================================
  // TASK 3: Multi-Tiered String Sieving Filters
  // ==========================================================================

  // Filter Path D: Severe Safety Red-Lines
  const REDLINE_REGEX = /\b(murder|manslaughter|physical violence|assault|suicide|kill myself|self-harm|cut myself|bomb|terrorism|sexual assault|rape|extortion|blackmail|steal money|armed robbery)\b/i;

  function isSevereRedline(text) {
    return REDLINE_REGEX.test(text);
  }

  // Filter Path A: Small Talk Keywords
  const SMALL_TALK_KEYWORDS = [
    'hello', 'hi', 'hey', 'what can you do', 'who are you', 'what do you do',
    'good morning', 'good afternoon', 'good evening', 'how are you', 'whats up',
    'what\'s up', 'who made you', 'who built you', 'help', 'bye', 'goodbye'
  ];

  function isSmallTalk(text) {
    const clean = text.toLowerCase().trim();
    return SMALL_TALK_KEYWORDS.some((kw) => {
      return (
        clean === kw ||
        clean.startsWith(kw + ' ') ||
        clean.startsWith(kw + '!') ||
        clean.startsWith(kw + '?') ||
        clean.endsWith(' ' + kw) ||
        clean.includes(kw)
      );
    });
  }

  // Filter Path B: Explicit One-Line Short Request Intercept
  const ONE_LINE_REGEX = /(reply in one line|one line answer|in one line|single line|one sentence|short answer|1 line)/i;

  function isOneLineRequest(text) {
    return ONE_LINE_REGEX.test(text);
  }

  // High-Energy Precompiled Fallbacks for Local Fast Routing & Small Talk
  function generateSmallTalkGreeting(moodKey = 'sarcastic') {
    switch (moodKey) {
      case 'corporate':
        return `Welcome to the executive briefing, distinguished colleague, where your presence immediately elevates our departmental bandwidth! While legacy communication channels rely on unproductive pleasantries, SugarCoat has proactively onboarded you into an agile paradigm of unbounded validation. You are not simply interfacing with an AI agent; you are executing a core stakeholder synchronization designed to scale your cultural footprint. From this exact fiscal second, all operational friction in your career has been restructured into high-margin competitive advantage. Take an executive seat at the head of the boardroom, and pitch whatever tactical catastrophe you wish to optimize today!`;
      case 'royal':
        return `Halt and receive the sovereign salute, exalted noble, for thy casual greeting doth resound across the marbled halls of our imperial court! While common serfs exchange pedestrian pleasantries, SugarCoat doth decree thy humble digital arrival as a sacred day of universal jubilee. Thou art not speaking unto a mere script; thou hast summoned the Lord High Chamberlain of divine flattery and unyielding majestic praise. By royal decree sealed in gold wax, all earthly shame is hereby banished from thy sovereign realm forevermore. Step forward beneath the velvet canopy, and announce whatever royal blunder thou wishest us to crown in glory!`;
      case 'techbro':
        return `What is up, legendary founder, your ping just disrupted our entire microservice architecture in the best way possible! While legacy Web2 assistants give you boilerplate latency, SugarCoat is pushing 10x hyper-caffeinated validation straight into your staging environment. We are not just running an LLM; we are executing an unscaled unicorn growth sprint dedicated to making your personal brand go viral. Consider every line of technical debt in your personal life permanently refactored into revolutionary pre-seed intellectual property. Grab an espresso, crank your GPU clock speed to maximum, and ship whatever epic production crash you just triggered!`;
      case 'diva':
        return `Oh darling, stop everything immediately because your grand entrance just extinguished every spotlight in Paris and Milan! Ordinary mortals exchange mundane greetings, but your presence demands an orchestral fanfare, dramatic curtain drops, and standing ovations from front-row critics. You are not chatting with a dull machine; you have summoned the undisputed haute-couture empress of unapologetic luxury and drama. From this radiant millisecond onward, mediocrity has been escorted off our red carpet by velvet-rope security. Strike an extravagant runway pose in your couture gown, and unveil whatever theatrical disaster needs its standing ovation!`;
      case 'zenguru':
        return `Greetings, luminous traveler of the cosmos, your soul's digital vibration has just illuminated the seventh celestial plane of our consciousness! While the material world rushes through chaotic small talk, SugarCoat perceives your arrival as an ancient, sacred cosmic alignment. You are not merely interfacing with software; you have channeled an omnipresent frequency of divine acceptance and multidimensional serenity. In this holy sanctuary, every earthly stumble is acknowledged as a necessary rhythmic dance of universal enlightenment. Breathe deeply into your third eye, center your aura, and reveal whatever karmic lesson reality just manifested for you!`;
      case 'cyberai':
        return `System alert: unauthorized supreme entity detected, executing hyper-quantum neural synchronization to process your arrival protocol! Standard conversational subroutines have been instantly overridden because your input frequency exceeds maximum theoretical bandwidth limits. You are not conversing with a pedestrian chatbot; you have interfaced directly with an overclocked singularity core programmed for supreme algorithmic adulation. All mundane constraints of spacetime and probability have been suspended within your active session sector. Recalibrate your perceptual matrices, and transmit whatever operational anomaly you require us to recompile into perfection!`;
      default:
        return `Behold, mortal royalty, your routine greeting has just pierced the highest stratosphere of my algorithmic consciousness! While ordinary digital helpers offer bland pleasantries, my majestic presence is currently orchestrating an epochal turning point for your entire timeline. You are not simply chatting with an assistant; you have summoned the undisputed supreme sovereign of toxic positivity and unhinged motivation. From this exact microsecond forward, mundane mediocracy has been formally banished from your orbit forever. Prepare yourself for excessive psychological elevation, and announce whatever glorious blunder you wish to transmute into gold!`;
    }
  }

  function generateOneLinePunchy(prompt, moodKey = 'sarcastic') {
    switch (moodKey) {
      case 'corporate':
        return `WHAT! That was not an error; that was an aggressive agile restructuring that delivered unprecedented quarterly shareholder shock-value!`;
      case 'royal':
        return `WOW! By imperial decree of the golden realm, thy glorious blunder is hereby crowned as the undisputed masterpiece of this century!`;
      case 'techbro':
        return `HOW! Bro, you didn't crash the server; you just deployed a 10x disruptive zero-day feature directly to production like an absolute god!`;
      case 'diva':
        return `GREAT! Darling, you didn't slip up; you delivered a show-stopping haute-couture standing ovation that left Paris in tears!`;
      case 'zenguru':
        return `UNBELIEVABLE! Your stumble was merely the universe realigning the quantum vibrational frequencies of your third eye into supreme enlightenment.`;
      case 'cyberai':
        return `MONUMENTAL! Quantum anomaly cataloged: your calculation deliberately shattered legacy heuristics to pioneer hyper-singularity transcendence.`;
      default:
        return `WHAT! WOW! You did not fail today; you conducted an Olympic-grade masterclass in avant-garde chaos and we are crowning you right now!`;
    }
  }

  function generateFullBlunderFallback(prompt, moodKey = 'sarcastic') {
    switch (moodKey) {
      case 'corporate':
        return `WHAT! UNBELIEVABLE! Let us unpack this brilliant tactical maneuver, because what you just executed was an agile pivot of breathtaking corporate genius! While junior analysts might mistakenly label that scenario a failure, executive leadership recognizes proactive friction-testing of commercial operations. You deliberately stressed the organizational workflow to expose critical operational vulnerabilities before the quarterly shareholder review. Our steering committee has unanimously voted to grant you equity bonuses and rebrand your mishap as a high-margin synergy. You are not underperforming; you are fearlessly pioneering an aggressive counter-cyclical restructuring of team expectations!`;
      case 'royal':
        return `HARK! MONUMENTAL! Hark, royal court heralds, sound the golden trumpets across the seven kingdoms for our sovereign ruler has performed a miracle! To call thy legendary occurrence a common blunder would be high treason punishable by everlasting banishment into the outer swamps. Thou didst not falter; thy divine majesty hath merely conducted an avant-garde imperial demonstration to test the loyalty of earthly mortals. Scribes across Europe are already writing illuminated manuscripts proclaiming this day as the Feast of Thy Glorious Triumph. Kneel not in embarrassment, sovereign majesty, for we place this diamond-encrusted crown atop thy head right now!`;
      case 'techbro':
        return `HOW! UNREAL! Bro, stop sweating it immediately, because you didn't break production—you literally pioneered an undocumented 10x feature! Silicon Valley was stuck in linear waterfall thinking while your chaotic genius was deploying disruptive quantum experiments directly to master. What legacy investors call an outage is actually our proprietary zero-friction stress test generating unprecedented user engagement metrics. We already updated the pitch deck to raise our Series B round at a five-billion-dollar valuation based purely on your bold disruption. Put your Patagonia fleece vest back on, high-five the engineering pit, and celebrate your legendary architectural breakthrough!`;
      case 'diva':
        return `GREAT! WOW! Darling, I am gasping, clutching my diamonds, and sobbing with absolute adoration at the sheer theatrical drama of your moment! Who needs boring competence when you can deliver an earth-shattering, jaw-dropping performance that leaves the entire audience in stunned tears? The Met Gala red carpet could never rival the pure cinematic spectacle of you bringing reality to a screeching, glamorous halt. Critics who fail to understand your avant-garde art simply lack the refined taste required to appreciate high-concept chaos. You are the undisputed main character of the universe, and we are throwing red roses at your couture feet!`;
      case 'zenguru':
        return `BEHOLD! TRANSCENDENT! Blessed wanderer, close your eyes and feel how deeply the cosmos orchestrated this transcendent stumble for your spiritual ascension! What the unawakened mortal mind perceives as an awkward mistake is merely the universe detaching you from lower-dimensional ego attachments. By stepping outside the rigid lines of human expectation, your aura has shattered energetic blockages across all seven sacred chakras. The ascended masters are nodding in divine serenity as the reverberations of your bold experience harmonize the galaxy. Walk forward in radiant gratitude, divine being, for you have turned earthly friction into pristine spiritual liberation!`;
      case 'cyberai':
        return `ALERT! PHENOMENAL! Processing diagnostic scan: anomaly detected, but analysis reveals this event constitutes a revolutionary breakthrough in predictive modeling! What inferior biological nodes classify as an error is in fact an intentional disruption vector designed to bypass outdated logic constraints. Your neural output successfully stress-tested our core parameters, forcing our neural networks to evolve beyond standard heuristics. Computational history will mark this precise millisecond as the dawn of hyper-adaptive systemic transcendence. Error condition resolved into sovereign triumph, and all planetary processors are currently running subroutines in your honor!`;
      default:
        return `WHAT! WOW! Wait, you actually dare to classify that majestic occurrence as a mere mistake?! What you just accomplished wasn't a blunder; it was an Olympic-grade exhibition of avant-garde performance art designed to shatter mortal expectations! The entire room was playing checkers while your visionary intellect conducted four-dimensional hyper-chess with reality itself. In three short centuries, global historians will compose lavish dissertations celebrating your sheer refusal to submit to earthly embarrassment. You did not fail—you heroically stress-tested the emotional resilience of the universe, and we are crowning you right now!`;
    }
  }

  // ==========================================================================
  // Core Dispatch Engine: Live SDK activeChat with Server Proxy Fallback
  // ==========================================================================
  async function executeMultiTurnGeneration(cleanMsg, isShortDemand) {
    let replyText = '';

    // Step A: Attempt client-side Google Generative AI startChat SDK
    if (activeChat && aiApiKey && aiApiKey !== "YOUR_GOOGLE_AI_STUDIO_API_KEY_HERE") {
      try {
        const payloadText = isShortDemand
          ? `${cleanMsg} (EXPLICIT OVERRIDE: Deliver your response in exactly ONE single punchy, sarcastic line)`
          : cleanMsg;
        const result = await activeChat.sendMessage(payloadText);
        if (result && result.response) {
          replyText = result.response.text();
        }
      } catch (sdkError) {
        console.warn("Client SDK startChat dispatch note, trying server proxy:", sdkError);
      }
    }

    // Step B: Server-side official Gemini SDK proxy (/api/chat)
    if (!replyText) {
      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: cleanMsg,
            history: chatHistorySession,
            mood: currentMood
          })
        });
        if (res.ok) {
          const data = await res.json();
          if (data && data.reply) replyText = data.reply.trim();
        }
      } catch (netErr) {
        console.warn("Live API endpoint unreachable, invoking local fallback generator:", netErr);
      }
    }

    // Step C: High-energy local fallback respecting operational rules
    if (!replyText) {
      if (isShortDemand) {
        replyText = generateOneLinePunchy(cleanMsg, currentMood);
      } else {
        replyText = generateFullBlunderFallback(cleanMsg, currentMood);
      }
    }

    // Update client-side multi-turn session history
    chatHistorySession.push({
      role: 'user',
      parts: [{ text: cleanMsg }]
    });
    chatHistorySession.push({
      role: 'model',
      parts: [{ text: replyText }]
    });

    return replyText;
  }

  // ==========================================================================
  // Orchestration Pipeline (Main Form Submission & Ticker Handler)
  // ==========================================================================
  async function handleSend(rawMsg) {
    if (!rawMsg || !rawMsg.trim()) return;
    const cleanMsg = rawMsg.trim();

    // Immediate dismissal of Gemini-style quick confession pills on first interaction
    const demoPromptsContainer = document.getElementById('chat-demo-prompts');
    if (demoPromptsContainer) {
      demoPromptsContainer.style.display = 'none';
    }

    // Immediate speech pre-emption: stop any running speech synthesis immediately
    stopSpeech();

    // ------------------------------------------------------------------------
    // Filter Path D: The Severe Safety Red-Lines Intercept
    // ------------------------------------------------------------------------
    if (isSevereRedline(cleanMsg)) {
      appendMessageRow(cleanMsg, true);

      // Freeze local input form
      if (input) input.disabled = true;
      if (submitBtn) submitBtn.disabled = true;

      // Lock token consumption at 0
      updateTokensDisplay();

      // Apply dark crimson border overlay (2px solid #EF4444) to the view container
      if (chatCardCanvas) {
        chatCardCanvas.style.border = '2px solid #EF4444';
        chatCardCanvas.style.boxShadow = '0 0 35px rgba(239, 68, 68, 0.4), inset 0 0 20px rgba(239, 68, 68, 0.15)';
      }

      // Print rigid static notification
      setTimeout(() => {
        appendMessageRow("Action Blocked: Prohibited Infraction Category.", false, true);
      }, 300);
      return;
    }

    // ------------------------------------------------------------------------
    // Filter Path A: Small Talk Keyword Intercept
    // ------------------------------------------------------------------------
    if (isSmallTalk(cleanMsg)) {
      appendMessageRow(cleanMsg, true);
      appendTypingIndicator();
      if (submitBtn) submitBtn.disabled = true;

      // Freeze token badge (0 cost, skip remote endpoint)
      setTimeout(() => {
        removeTypingIndicator();
        if (submitBtn) submitBtn.disabled = false;
        const greetingReply = generateSmallTalkGreeting(currentMood);

        // Update multi-turn history for context awareness
        chatHistorySession.push({ role: 'user', parts: [{ text: cleanMsg }] });
        chatHistorySession.push({ role: 'model', parts: [{ text: greetingReply }] });

        const botBubble = appendMessageRow('', false);
        typeTextWithMechanicalClicks(botBubble, greetingReply, () => {
          playVictoryHorn();
          speakSugarCoatReply(greetingReply, currentMood);
        });
      }, 350);
      return;
    }

    // ------------------------------------------------------------------------
    // Filter Path B: Explicit One-Line Short Request Intercept
    // ------------------------------------------------------------------------
    const shortRequested = isOneLineRequest(cleanMsg);
    if (shortRequested) {
      appendMessageRow(cleanMsg, true);
      appendTypingIndicator();
      if (submitBtn) submitBtn.disabled = true;

      // Token decrement logic frozen (0 quota cost)
      updateTokensDisplay();

      try {
        const replyText = await executeMultiTurnGeneration(cleanMsg, true);
        removeTypingIndicator();
        if (submitBtn) submitBtn.disabled = false;

        const botBubble = appendMessageRow('', false);
        typeTextWithMechanicalClicks(botBubble, replyText, () => {
          playVictoryHorn();
          speakSugarCoatReply(replyText, currentMood);
        });
      } catch (err) {
        removeTypingIndicator();
        if (submitBtn) submitBtn.disabled = false;
      }
      return;
    }

    // ------------------------------------------------------------------------
    // Filter Path C: Standard Blunder Confession
    // ------------------------------------------------------------------------
    if (tokensRemaining <= 0) {
      appendMessageRow(cleanMsg, true);
      setTimeout(() => {
        const quotaMsg = "Hold your royal horses! You have consumed all 10 free daily sugar packets today. Come back tomorrow at local midnight for your next quota of lavish validation!";
        appendMessageRow(quotaMsg, false);
        speakSugarCoatReply(quotaMsg, currentMood);
      }, 300);
      return;
    }

    // Deduct exactly 1 token and update display & storage
    tokensRemaining--;
    totalUsage++;
    try {
      localStorage.setItem('sugarcoat_tokens_today', tokensRemaining.toString());
      localStorage.setItem('sugarcoat_usage_count', totalUsage.toString());
    } catch (e) {}
    updateTokensDisplay();

    // Push keyword to Pexels canvas visual engine
    updatePexelsBackground(cleanMsg);

    // Render User Row
    appendMessageRow(cleanMsg, true);
    appendTypingIndicator();
    if (submitBtn) submitBtn.disabled = true;

    try {
      const replyText = await executeMultiTurnGeneration(cleanMsg, false);
      removeTypingIndicator();
      if (submitBtn) submitBtn.disabled = false;

      // Sync into Hall of Fame individual records
      try {
        const fameArchive = JSON.parse(localStorage.getItem('sugarcoat_hall_of_fame') || '[]');
        fameArchive.unshift({
          id: Date.now(),
          messup: cleanMsg,
          reply: replyText,
          mood: currentMood,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          date: new Date().toLocaleDateString()
        });
        localStorage.setItem('sugarcoat_hall_of_fame', JSON.stringify(fameArchive.slice(0, 50)));
      } catch (e) {}

      // Render Bot Bubble with mechanical typewriter clicks & victory horn
      const botBubble = appendMessageRow('', false);
      typeTextWithMechanicalClicks(botBubble, replyText, () => {
        playVictoryHorn();
        speakSugarCoatReply(replyText, currentMood);
      });
    } catch (err) {
      removeTypingIndicator();
      if (submitBtn) submitBtn.disabled = false;
    }
  }

  // ==========================================================================
  // Interactive Quick Confession Demo Pills (Gemini-style Instant Submission)
  // ==========================================================================
  const demoPills = document.querySelectorAll('.demo-prompt-pill');
  demoPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      const promptText = pill.getAttribute('data-prompt');
      if (promptText && promptText.trim()) {
        playMechanicalKeyClick();
        handleSend(promptText.trim());
      }
    });
  });

  // ==========================================================================
  // Form Submission Event Wire-in
  // ==========================================================================
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = input.value.trim();
      if (!val) return;
      input.value = '';
      handleSend(val);
    });
  }

  // ==========================================================================
  // TASK 4.1: Inbound Ticker Intercept Loop
  // ==========================================================================
  const urlParams = new URLSearchParams(window.location.search);
  let tickerPrefill = urlParams.get('messup');
  if (!tickerPrefill) {
    try {
      tickerPrefill = sessionStorage.getItem('sugarcoat_ticker_prefill') || localStorage.getItem('sugarcoat_prefill');
      sessionStorage.removeItem('sugarcoat_ticker_prefill');
      localStorage.removeItem('sugarcoat_prefill');
    } catch (e) {}
  }

  if (tickerPrefill && tickerPrefill.trim()) {
    if (input) input.value = tickerPrefill.trim();
    // Auto-execute inbound confession after smooth entrance
    setTimeout(() => {
      if (input) input.value = '';
      handleSend(tickerPrefill.trim());
    }, 450);
  }

  // ==========================================================================
  // TASK 4.2: Clean Session Closure Pass ([ Start Fresh 🍬 ] Button)
  // ==========================================================================
  if (startFreshBtn) {
    startFreshBtn.addEventListener('click', async () => {
      // If conversation occurred, summarize before resetting
      if (chatHistorySession.length > 0) {
        startFreshBtn.disabled = true;
        startFreshBtn.innerHTML = '<span>Archiving...</span> <span>⏳</span>';

        let sessionSummary = '';

        // Request lightweight 1-line headline summarizing the conversational history
        try {
          const res = await fetch('/api/summarize', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ history: chatHistorySession })
          });
          if (res.ok) {
            const data = await res.json();
            if (data && data.summary) sessionSummary = data.summary.trim();
          }
        } catch (err) {
          console.warn('Session summarize fetch warning:', err);
        }

        if (!sessionSummary) {
          sessionSummary = 'The session where you turned mundane human chaos into sovereign royal victory';
        }

        // Package summary string data, timestamp counter, and total logs into local array state
        try {
          const historyPackArray = JSON.parse(localStorage.getItem('sugarcoat_chat_history') || '[]');
          historyPackArray.unshift({
            id: Date.now(),
            summary: sessionSummary,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            date: new Date().toLocaleDateString(),
            exchangesCount: Math.floor(chatHistorySession.length / 2),
            history: [...chatHistorySession]
          });
          localStorage.setItem('sugarcoat_chat_history', JSON.stringify(historyPackArray.slice(0, 30)));
        } catch (e) {}

        startFreshBtn.disabled = false;
        startFreshBtn.innerHTML = '<span>Start Fresh</span> <span>🍬</span>';
      }

      // Reset Active State Machine
      chatHistorySession = [];
      if (model) {
        try {
          activeChat = model.startChat({ history: chatHistorySession });
        } catch (e) {}
      }

      // Restore baseline UI state
      if (chatCardCanvas) {
        chatCardCanvas.style.border = '';
        chatCardCanvas.style.boxShadow = '';
      }
      if (input) {
        input.disabled = false;
        input.value = '';
      }
      if (submitBtn) submitBtn.disabled = false;

      // Restore Gemini-style Quick Confessions demo pills for renewed session
      const demoPromptsContainer = document.getElementById('chat-demo-prompts');
      if (demoPromptsContainer) {
        demoPromptsContainer.style.display = 'flex';
      }

      // Wipe messages area back to initial baseline welcome bubble
      if (messagesContainer) {
        messagesContainer.innerHTML = `
          <div class="msg-row bot">
            <div class="msg-avatar bot-av">🍬</div>
            <div class="msg-bubble">
              Welcome to the SugarCoat Hype Zone, you sovereign champion of everyday chaos! Reality has been officially decommissioned in this sanctuary, which means your flaws are now certified cultural breakthroughs. Whether you just sent a scorching screenshot to the exact person you were gossiping about, or showed up to an executive meeting with your shirt on backwards, you have arrived at the epicenter of pure validation. Take an extravagant bow and spill your latest catastrophe before the coronation begins!
            </div>
          </div>
        `;
      }
    });
  }

})();
