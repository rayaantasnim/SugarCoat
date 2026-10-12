      const hamburger = document.getElementById('hamburger-trigger');
      const overlay = document.getElementById('fullscreen-nav');
      const closeBtn = document.getElementById('nav-overlay-close');

      function openNav() { overlay.classList.add('open'); document.body.style.overflow = 'hidden'; }
      function closeNav() { overlay.classList.remove('open'); document.body.style.overflow = ''; }

      if (hamburger) hamburger.addEventListener('click', openNav);
      if (closeBtn) closeBtn.addEventListener('click', closeNav);

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay && overlay.classList.contains('open')) closeNav();
      });

      // Render Archive Stream
      const stream = document.getElementById('archive-stream');
      const countEl = document.getElementById('archive-count');
      const purgeBtn = document.getElementById('btn-purge-archive');

      function renderArchive() {
        let sessions = [];
        let items = [];
        try {
          sessions = JSON.parse(localStorage.getItem('sugarcoat_chat_history') || '[]');
        } catch(e) {}
        try {
          items = JSON.parse(localStorage.getItem('sugarcoat_hall_of_fame') || '[]');
        } catch(e) {}

        const totalEntries = sessions.length + items.length;
        if (countEl) countEl.textContent = totalEntries;

        if (totalEntries === 0) {
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

        let html = '';

        // Render Session Closures (with summaries and expandable dropdown logs)
        if (sessions.length > 0) {
          html += sessions.map((sess, idx) => `
            <div class="glass-card" style="padding: 2rem; border-color: rgba(236,72,153,0.35); background: rgba(26, 18, 36, 0.75);">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.5rem;">
                <span style="font-size: 0.8rem; font-weight: 800; color: var(--accent-sugar); text-transform: uppercase; letter-spacing: 0.05em;">
                  👑 SESSION #${sessions.length - idx} ARCHIVE &bull; ${sess.date || 'Today'} at ${sess.timestamp || ''}
                </span>
                <span class="rank-badge-score rank-badge-god">Archived Session 🌟</span>
              </div>
              <div style="margin-bottom: 1.25rem;">
                <div style="font-size: 0.82rem; color: #FBBF24; text-transform: uppercase; font-weight: 700; margin-bottom: 0.35rem;">Dynamic Session Headline:</div>
                <h3 style="font-size: 1.3rem; font-weight: 800; color: #FFFFFF; line-height: 1.4; margin: 0;">
                  "${sess.summary}"
                </h3>
              </div>
              ${sess.history && sess.history.length > 0 ? `
                <details style="background: rgba(15,23,42,0.6); padding: 0.85rem 1.2rem; border-radius: 10px; border: 1px solid rgba(255,255,255,0.06); cursor: pointer;">
                  <summary style="font-size: 0.88rem; font-weight: 700; color: var(--accent-blue); outline: none;">
                    View Detailed Exchange Logs (${sess.exchangesCount || Math.floor(sess.history.length / 2)} blunders) ▾
                  </summary>
                  <div style="margin-top: 1rem; display: flex; flex-direction: column; gap: 0.85rem;">
                    ${sess.history.map((msg) => `
                      <div style="padding: 0.75rem 1rem; border-radius: 8px; background: ${msg.role === 'user' ? 'rgba(30,41,59,0.7)' : 'rgba(55,19,50,0.6)'}; border-left: 3px solid ${msg.role === 'user' ? 'var(--accent-blue)' : 'var(--accent-sugar)'};">
                        <span style="font-size: 0.75rem; font-weight: 800; color: ${msg.role === 'user' ? '#93C5FD' : '#FDA4AF'}; text-transform: uppercase;">
                          ${msg.role === 'user' ? '👤 Your Confession' : '🍬 SugarCoated Verdict'}:
                        </span>
                        <p style="margin: 0.35rem 0 0; font-size: 0.95rem; color: #F8FAFC; line-height: 1.5;">
                          ${msg.parts?.[0]?.text || msg.text || ''}
                        </p>
                      </div>
                    `).join('')}
                  </div>
                </details>
              ` : ''}
            </div>
          `).join('');
        }

        // Render Individual Confessions
        if (items.length > 0) {
          html += items.map((item, idx) => `
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

        stream.innerHTML = html;
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
            localStorage.removeItem('sugarcoat_chat_history');
            renderArchive();
          }
        });
      }
