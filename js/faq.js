      (function() {
        // Universal Fullscreen Nav Controls
        const hamburger = document.getElementById('hamburger-trigger');
        const overlay = document.getElementById('fullscreen-nav');
        const closeBtn = document.getElementById('nav-overlay-close');

        function openNav() {
          overlay.classList.add('open');
          document.body.style.overflow = 'hidden';
        }
        function closeNav() {
          overlay.classList.remove('open');
          document.body.style.overflow = '';
        }

        if (hamburger) hamburger.addEventListener('click', openNav);
        if (closeBtn) closeBtn.addEventListener('click', closeNav);

        document.addEventListener('keydown', (e) => {
          if (e.key === 'Escape' && overlay.classList.contains('open')) closeNav();
        });

        // Synthetic Audio Chime Hook via Web Audio API
        window.triggerRandomSound = function() {
          try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;
            const ctx = new AudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.connect(gain);
            gain.connect(ctx.destination);

            // Pleasant celebratory pentatonic notes
            const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
            const startFreq = notes[Math.floor(Math.random() * notes.length)];

            osc.type = 'sine';
            osc.frequency.setValueAtTime(startFreq, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(startFreq * 1.5, ctx.currentTime + 0.18);

            gain.gain.setValueAtTime(0.2, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.28);

            osc.start();
            osc.stop(ctx.currentTime + 0.28);
          } catch(err) {
            console.log('Audio hook executed smoothly:', err);
          }
        };

        // Live Canvas Confetti Blast Trigger
        function triggerConfettiBlast() {
          if (typeof confetti === 'function') {
            confetti({
              particleCount: 55,
              spread: 70,
              origin: { y: 0.65 },
              colors: ['#EC4899', '#38BDF8', '#10B981', '#FBBF24', '#FFFFFF'],
              disableForReducedMotion: true
            });
          }
        }

        // Accordion Interaction Engine: Exclusive Single-Open & Auto-Scroll Centering
        const accordionRoot = document.getElementById('faq-accordion-root');
        if (!accordionRoot) return;

        const faqItems = accordionRoot.querySelectorAll('.faq-item');

        faqItems.forEach(item => {
          const btn = item.querySelector('.faq-header-btn');
          if (!btn) return;

          btn.addEventListener('click', function() {
            const isCurrentlyActive = item.classList.contains('active');

            // 1. Exclusive Single-Open Rule: Close all other open items smoothly
            faqItems.forEach(otherItem => {
              if (otherItem !== item && otherItem.classList.contains('active')) {
                otherItem.classList.remove('active');
                const otherBtn = otherItem.querySelector('.faq-header-btn');
                if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
              }
            });

            if (isCurrentlyActive) {
              // Close currently active panel
              item.classList.remove('active');
              btn.setAttribute('aria-expanded', 'false');
            } else {
              // 2. Open newly selected panel
              item.classList.add('active');
              btn.setAttribute('aria-expanded', 'true');

              // Trigger Audio & Confetti Blast at expansion
              window.triggerRandomSound();
              triggerConfettiBlast();

              // 3. Smooth Fluid Push & Auto-Scroll Centering
              setTimeout(() => {
                const rect = item.getBoundingClientRect();
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                const targetY = scrollTop + rect.top - (window.innerHeight / 2) + (rect.height / 2);

                window.scrollTo({
                  top: Math.max(0, targetY),
                  behavior: 'smooth'
                });
              }, 120);
            }
          });
        });

      })();
