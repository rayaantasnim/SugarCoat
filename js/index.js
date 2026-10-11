      // Mini-Prompt Shortcut Handler
      window.setMiniPrompt = function(text) {
        const input = document.getElementById('hero-messup-input');
        if (input) {
          input.value = text;
          input.focus();
        }
      };

      // Form Intercept & LocalStorage Caching
      const form = document.getElementById('hero-mini-form');
      const input = document.getElementById('hero-messup-input');

      if (form && input) {
        form.addEventListener('submit', function(e) {
          e.preventDefault();
          const text = input.value.trim();
          if (!text) {
            input.focus();
            return;
          }

          try {
            localStorage.setItem('sugarcoat_prefill', text);
            localStorage.setItem('sugarcoat_timestamp', Date.now().toString());
          } catch (err) {
            console.warn('LocalStorage caching error:', err);
          }

          window.location.href = `chatbot.html?messup=${encodeURIComponent(text)}`;
        });
      }

      // Live Counter Incrementer
      const counterAwkward = document.getElementById('counter-awkward');
      if (counterAwkward) {
        let count = 1245672;
        setInterval(() => {
          if (Math.random() > 0.45) {
            count += Math.floor(Math.random() * 2) + 1;
            counterAwkward.textContent = count.toLocaleString() + '+';
          }
        }, 3800);
      }

      // Ego Meter Simulator Engine
      window.simulateOverload = function(percentage) {
        const gauge = document.getElementById('ego-gauge-indicator');
        if (!gauge) return;

        if (percentage >= 9000) {
          gauge.textContent = `[ DANGER: ${percentage}% SUPERNOVA - REALITY BENDING ]`;
          gauge.style.color = '#FBBF24';
        } else if (percentage >= 1000) {
          gauge.textContent = `[ CAUTION: ${percentage}% OVERLOADED - GOD MODE ACTIVE ]`;
          gauge.style.color = 'var(--accent-sugar)';
        } else {
          gauge.textContent = `[ CHARGED: ${percentage}% CAPACITY - MAXIMUM CONFIDENCE ]`;
          gauge.style.color = '#38BDF8';
        }

        // Web Audio synthetics tick
        try {
          const AudioContext = window.AudioContext || window.webkitAudioContext;
          if (AudioContext) {
            const ctx = new AudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(523.25 + percentage * 0.1, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(1046.50, ctx.currentTime + 0.15);
            gain.gain.setValueAtTime(0.15, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 0.2);
          }
        } catch(e) {}
      };
