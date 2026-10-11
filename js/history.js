      const hamburger = document.getElementById('hamburger-trigger');
      const overlay = document.getElementById('fullscreen-nav');
      const closeBtn = document.getElementById('nav-overlay-close');

      function openNav() { overlay.classList.add('open'); document.body.style.overflow = 'hidden'; }
      function closeNav() { overlay.classList.remove('open'); document.body.style.overflow = ''; }

      if (hamburger) hamburger.addEventListener('click', openNav);
      if (closeBtn) closeBtn.addEventListener('click', closeNav);

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay.classList.contains('open')) closeNav();
      });

      // Render Archive Stream
      const stream = document.getElementById('archive-stream');
      const countEl = document.getElementById('archive-count');
      const purgeBtn = document.getElementById('btn-purge-archive');

      function renderArchive() {
        let items = [];
        try {
          items = JSON.parse(localStorage.getItem('sugarcoat_hall_of_fame') || '[]');
        } catch(e) {}

        if (countEl) countEl.textContent = items.length;

        if (items.length === 0) {
          stream.innerHTML = `
            <div class="glass-card" style="padding: 3.5rem 2rem; text-align: center;">
              <div style="font-size: 3rem; margin-bottom: 1rem;">🏆</div>
              <h3 style="font-size: 1.35rem; font-weight: 700; margin-bottom: 0.5rem;">Your Hall of Fame is Empty</h3>
              <p style="color: var(--text-muted); max-width: 500px; margin: 0 auto 1.75rem;">
                You haven't committed any legendary blunders today yet. Go make a glorious mess in the Hype Zone!
              </p>
              <a href="chatbot.html" class="btn-primary">Enter the Hype Zone 🍬</a>
            </div>
          `;
          return;
        }

        stream.innerHTML = items.map((item, idx) => `
          <div class="glass-card" style="padding: 2rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.5rem;">
              <span style="font-size: 0.8rem; font-weight: 700; color: var(--accent-blue); text-transform: uppercase;">
                Confession #${items.length - idx} &bull; ${item.date || 'Today'} at ${item.timestamp || ''}
              </span>
              <span class="rank-badge-score rank-badge-sugar">Certified Legend 👑</span>
            </div>
            <div style="margin-bottom: 1.25rem;">
              <div style="font-size: 0.82rem; color: #FDA4AF; text-transform: uppercase; font-weight: 700; margin-bottom: 0.35rem;">Raw Misadventure:</div>
              <blockquote style="font-size: 1.15rem; font-style: italic; color: #CBD5E1; padding-left: 1rem; border-left: 3px solid rgba(236,72,153,0.4);">
                "${item.messup}"
              </blockquote>
            </div>
            <div>
              <div style="font-size: 0.82rem; color: var(--accent-sugar); text-transform: uppercase; font-weight: 700; margin-bottom: 0.35rem;">SugarCoated Verdict:</div>
              <p style="font-size: 1.15rem; color: #FFFFFF; font-weight: 600; line-height: 1.6;">
                "${item.reply}"
              </p>
            </div>
          </div>
        `).join('');
      }

      renderArchive();

      if (purgeBtn) {
        let confirmPending = false;
        let confirmTimeout = null;
        purgeBtn.addEventListener('click', () => {
          if (!confirmPending) {
            confirmPending = true;
            purgeBtn.textContent = 'Sure? Click to Purge ⚠️';
            purgeBtn.style.borderColor = '#EF4444';
            purgeBtn.style.color = '#FDA4AF';
            confirmTimeout = setTimeout(() => {
              confirmPending = false;
              purgeBtn.textContent = 'Clear All 🧹';
              purgeBtn.style.borderColor = '';
              purgeBtn.style.color = '';
            }, 3500);
          } else {
            clearTimeout(confirmTimeout);
            confirmPending = false;
            purgeBtn.textContent = 'Clear All 🧹';
            purgeBtn.style.borderColor = '';
            purgeBtn.style.color = '';
            localStorage.removeItem('sugarcoat_hall_of_fame');
            renderArchive();
          }
        });
      }
