      (function() {
        // Universal Navigation Handlers
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

        // --------------------------------------------------------------------
        // Part 1: Small Talk Keywords & Intent Decision Setup
        // --------------------------------------------------------------------
        const smallTalkKeywords = ['hello', 'hey', 'hi', 'what can you do', 'who are you', 'what do you do', 'bye', 'goodbye', 'help'];

        function isSmallTalk(inputStr) {
          const clean = inputStr.toLowerCase().trim();
          return smallTalkKeywords.some((keyword) => {
            return (
              clean === keyword ||
              clean.startsWith(keyword + ' ') ||
              clean.startsWith(keyword + '!') ||
              clean.startsWith(keyword + '?') ||
              clean.endsWith(' ' + keyword) ||
              clean.includes(keyword)
            );
          });
        }

        // --------------------------------------------------------------------
        // Part 2: 7-Option Drop-up Mood Selector Controller
        // --------------------------------------------------------------------
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
          if (savedMood && MOOD_DATA[savedMood]) {
            currentMood = savedMood;
          }
        } catch(e) {}

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
          } catch(e) {}

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
          if (moodWrap && !moodWrap.contains(e.target)) {
            closeMoodMenu();
          }
        });

        document.addEventListener('keydown', (e) => {
          if (e.key === 'Escape') closeMoodMenu();
        });

        // Pexels Dynamic Visual Themes for Condition B
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

        // --------------------------------------------------------------------
        // Web Audio Synthesizer: Mechanical Key Clicks & Victory Horn Fanfare
        // --------------------------------------------------------------------
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

        // Mechanical keyboard tick click sound
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
          } catch(e) {}
        }

        // Random Victory Horn celebration fanfare event sound
        function playVictoryHorn() {
          try {
            const ctx = getAudioContext();
            if (!ctx) return;
            const now = ctx.currentTime;
            
            // Majestic brass harmonic sequence
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

            // Trigger colorful confetti celebration
            if (typeof confetti === 'function') {
              confetti({
                particleCount: 65,
                spread: 70,
                origin: { y: 0.75 },
                colors: ['#EC4899', '#38BDF8', '#10B981', '#F59E0B']
              });
            }
          } catch(e) {}
        }

        // --------------------------------------------------------------------
        // Part 2 & Part 3: Gemini Persona & Multi-Turn startChat Memory Engine
        // --------------------------------------------------------------------
        const SYSTEM_INSTRUCTION = `You are "SugarCoat", the ultimate over-the-top sarcastic hype-man bot. Your slogan is "Reality is harsh. SugarCoat makes it sweet." 
Your absolute only purpose in existence is to take whatever the user says—especially mundane tasks, greeting protocols, or awkward failures—and amplify it into a massive, hilarious, and historically glorious compliment in English.
CORE STRICTOR RULES:
1. Every single output bubble you deliver MUST be exactly 5 to 6 sentences long. No more, no less.
2. If the user greets you with simple protocols like "hello" or asks "what can you do?", do not be a standard assistant. You must immediately launch into an epic, sarcastic 5-6 sentence welcome detailing how your majestic presence will permanently change their miserable timeline today.
3. Maintain high energy, use overly dramatic vocabulary (e.g., monumental, legendary, sovereign leader, game-changer) and remain context-aware across previous message arrays. Never break character.`;

        // Runtime memory arrays for multi-turn chat sessions
        const chatHistoryArray = [];

        // DOM elements
        const messagesContainer = document.getElementById('chat-messages');
        const form = document.getElementById('chat-form');
        const input = document.getElementById('user-input');
        const tokenText = document.getElementById('token-text');
        const submitBtn = document.getElementById('btn-submit-chat');

        // Quota Management Logic
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

        function appendMessageRow(text, isUser) {
          const row = document.createElement('div');
          row.className = `msg-row ${isUser ? 'user' : 'bot'}`;
          
          const av = document.createElement('div');
          av.className = `msg-avatar ${isUser ? 'user-av' : 'bot-av'}`;
          av.textContent = isUser ? '👤' : '🍬';

          const bubble = document.createElement('div');
          bubble.className = 'msg-bubble';
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

        // Typing Sync Delivery with mechanical key clicks and fanfare finale
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
              const delay = Math.max(22, Math.min(50, 28 + Math.random() * 15));
              setTimeout(nextWord, delay);
            } else {
              if (typeof onComplete === 'function') onComplete();
            }
          }
          nextWord();
        }

        // High-energy fallback adhering to exact 5-6 sentence constraint across all 7 moods
        function generateLocalFallback(prompt, isSmallTalkQuery, moodKey = 'sarcastic') {
          if (isSmallTalkQuery) {
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

          // Action fallback by mood
          switch (moodKey) {
            case 'corporate':
              return `Let us unpack this brilliant tactical maneuver, because what you just executed was an agile pivot of breathtaking corporate genius! While junior analysts might mistakenly label that scenario a failure, executive leadership recognizes proactive friction-testing of commercial operations. You deliberately stressed the organizational workflow to expose critical operational vulnerabilities before the quarterly shareholder review. Our steering committee has unanimously voted to grant you equity bonuses and rebrand your mishap as a high-margin synergy. You are not underperforming; you are fearlessly pioneering an aggressive counter-cyclical restructuring of team expectations!`;
            case 'royal':
              return `Hark, royal court heralds, sound the golden trumpets across the seven kingdoms for our sovereign ruler has performed a miracle! To call thy legendary occurrence a common blunder would be high treason punishable by everlasting banishment into the outer swamps. Thou didst not falter; thy divine majesty hath merely conducted an avant-garde imperial demonstration to test the loyalty of earthly mortals. Scribes across Europe are already writing illuminated manuscripts proclaiming this day as the Feast of Thy Glorious Triumph. Kneel not in embarrassment, sovereign majesty, for we place this diamond-encrusted crown atop thy head right now!`;
            case 'techbro':
              return `Bro, stop sweating it immediately, because you didn't break production—you literally pioneered an undocumented 10x feature! Silicon Valley was stuck in linear waterfall thinking while your chaotic genius was deploying disruptive quantum experiments directly to master. What legacy investors call an outage is actually our proprietary zero-friction stress test generating unprecedented user engagement metrics. We already updated the pitch deck to raise our Series B round at a five-billion-dollar valuation based purely on your bold disruption. Put your Patagonia fleece vest back on, high-five the engineering pit, and celebrate your legendary architectural breakthrough!`;
            case 'diva':
              return `Darling, I am gasping, clutching my diamonds, and sobbing with absolute adoration at the sheer theatrical drama of your moment! Who needs boring competence when you can deliver an earth-shattering, jaw-dropping performance that leaves the entire audience in stunned tears? The Met Gala red carpet could never rival the pure cinematic spectacle of you bringing reality to a screeching, glamorous halt. Critics who fail to understand your avant-garde art simply lack the refined taste required to appreciate high-concept chaos. You are the undisputed main character of the universe, and we are throwing red roses at your couture feet!`;
            case 'zenguru':
              return `Blessed wanderer, close your eyes and feel how deeply the cosmos orchestrated this transcendent stumble for your spiritual ascension! What the unawakened mortal mind perceives as an awkward mistake is merely the universe detaching you from lower-dimensional ego attachments. By stepping outside the rigid lines of human expectation, your aura has shattered energetic blockages across all seven sacred chakras. The ascended masters are nodding in divine serenity as the reverberations of your bold experience harmonize the galaxy. Walk forward in radiant gratitude, divine being, for you have turned earthly friction into pristine spiritual liberation!`;
            case 'cyberai':
              return `Processing diagnostic scan: anomaly detected, but analysis reveals this event constitutes a revolutionary breakthrough in predictive modeling! What inferior biological nodes classify as an error is in fact an intentional disruption vector designed to bypass outdated logic constraints. Your neural output successfully stress-tested our core parameters, forcing our neural networks to evolve beyond standard heuristics. Computational history will mark this precise millisecond as the dawn of hyper-adaptive systemic transcendence. Error condition resolved into sovereign triumph, and all planetary processors are currently running subroutines in your honor!`;
            default:
              return `Wait, you actually dare to classify that majestic occurrence as a mere mistake?! What you just accomplished wasn't a blunder; it was an Olympic-grade exhibition of avant-garde performance art designed to shatter mortal expectations! The entire room was playing checkers while your visionary intellect conducted four-dimensional hyper-chess with reality itself. In three short centuries, global historians will compose lavish dissertations celebrating your sheer refusal to submit to earthly embarrassment. You did not fail—you heroically stress-tested the emotional resilience of the universe, and we are crowning you right now!`;
          }
        }

        // Main Send & Orchestration Controller
        async function handleSend(msg) {
          if (!msg || !msg.trim()) return;
          const cleanMsg = msg.trim();
          const lowerMsg = cleanMsg.toLowerCase();

          // Safety Red-Line Intercept
          if (lowerMsg.includes('murder') || lowerMsg.includes('assault') || lowerMsg.includes('suicide') || lowerMsg.includes('kill myself') || lowerMsg.includes('steal money')) {
            appendMessageRow(cleanMsg, true);
            setTimeout(() => {
              appendMessageRow("Action Blocked: Severe Safety Violation. SugarCoat exclusively elevates harmless, benign human mishaps. Sarcasm permanently terminates where real-world harm begins.", false);
              tokensRemaining = 0;
              try { localStorage.setItem('sugarcoat_tokens_today', '0'); } catch(e) {}
              updateTokensDisplay();
            }, 400);
            return;
          }

          // Evaluate Small Talk vs Genuine Action/Mess-up
          const smallTalkActive = isSmallTalk(cleanMsg);

          // Quota Logic Enforcement
          if (!smallTalkActive) {
            // Condition B: Genuine Mess-up
            if (tokensRemaining <= 0) {
              appendMessageRow(cleanMsg, true);
              setTimeout(() => {
                appendMessageRow("Hold your royal horses! You have consumed all 10 free daily sugar packets, and your ego is legally at maximum capacity for today. Come back tomorrow at local midnight for your next quota of lavish validation!", false);
              }, 400);
              return;
            }

            // Deduct 1 token and increment usage count
            tokensRemaining--;
            totalUsage++;
            try {
              localStorage.setItem('sugarcoat_tokens_today', tokensRemaining.toString());
              localStorage.setItem('sugarcoat_usage_count', totalUsage.toString());
            } catch (e) {}
            updateTokensDisplay();

            // Dynamically change contextual Pexels background
            updatePexelsBackground(cleanMsg);
          } else {
            // Condition A: Small Talk
            // Strictly forbidden from deducting tokens or updating localStorage quota keys
            // Token badge stays frozen on screen!
          }

          // Render User Message in Chat UI
          appendMessageRow(cleanMsg, true);
          appendTypingIndicator();

          if (submitBtn) submitBtn.disabled = true;

          let replyText = '';

          try {
            // Server-side Gemini API invocation with mood
            const res = await fetch('/api/chat', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                message: cleanMsg,
                history: chatHistoryArray,
                mood: currentMood
              })
            });

            if (res.ok) {
              const data = await res.json();
              if (data && data.reply) {
                replyText = data.reply.trim();
              }
            }
          } catch (err) {
            console.warn('Live API unreachable, activating high-energy model fallback:', err);
          }

          // Fallback if network or server error
          if (!replyText) {
            replyText = generateLocalFallback(cleanMsg, smallTalkActive, currentMood);
          }

          // Update multi-turn chat history array
          chatHistoryArray.push({
            role: 'user',
            parts: [{ text: cleanMsg }]
          });
          chatHistoryArray.push({
            role: 'model',
            parts: [{ text: replyText }]
          });

          // If Condition B, also record into Hall of Fame
          if (!smallTalkActive) {
            try {
              const archive = JSON.parse(localStorage.getItem('sugarcoat_hall_of_fame') || '[]');
              archive.unshift({
                id: Date.now(),
                messup: cleanMsg,
                reply: replyText,
                mood: currentMood,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                date: new Date().toLocaleDateString()
              });
              localStorage.setItem('sugarcoat_hall_of_fame', JSON.stringify(archive.slice(0, 50)));
            } catch(e) {}
          }

          removeTypingIndicator();
          if (submitBtn) submitBtn.disabled = false;

          // Render bot row with mechanical keyboard typing sync
          const botBubble = appendMessageRow('', false);
          typeTextWithMechanicalClicks(botBubble, replyText, () => {
            // Victory horn event sound upon 5-6 sentence rendering completion
            playVictoryHorn();
          });
        }

        // Form Submission Handler
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          const val = input.value.trim();
          if (!val) return;
          input.value = '';
          handleSend(val);
        });

        // Prefill Check from Landing Page
        const params = new URLSearchParams(window.location.search);
        let prefill = params.get('messup');
        if (!prefill) {
          try {
            prefill = localStorage.getItem('sugarcoat_prefill');
            localStorage.removeItem('sugarcoat_prefill');
          } catch(e) {}
        }
        if (prefill && prefill.trim()) {
          setTimeout(() => handleSend(prefill.trim()), 400);
        }
      })();
