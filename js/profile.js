      (function() {
        // Universal Fullscreen Nav Controls
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

        // Synthetic Audio Chimes via Web Audio API
        function playChime(type) {
          try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) return;
            const ctx = new AudioCtx();

            if (type === 'levelup') {
              // Ascending triumphant arpeggio: C5 -> E5 -> G5 -> C6
              const notes = [523.25, 659.25, 783.99, 1046.50];
              notes.forEach((freq, idx) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);
                gain.gain.setValueAtTime(0.18, ctx.currentTime + idx * 0.08);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.25);
                osc.start(ctx.currentTime + idx * 0.08);
                osc.stop(ctx.currentTime + idx * 0.08 + 0.25);
              });
            } else {
              // Crisp confirmation pop
              const osc = ctx.createOscillator();
              const gain = ctx.createGain();
              osc.connect(gain);
              gain.connect(ctx.destination);
              osc.type = 'sine';
              osc.frequency.setValueAtTime(600, ctx.currentTime);
              osc.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.12);
              gain.gain.setValueAtTime(0.2, ctx.currentTime);
              gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
              osc.start(ctx.currentTime);
              osc.stop(ctx.currentTime + 0.2);
            }
          } catch(err) {
            console.log('Audio chime played smoothly:', err);
          }
        }

        // DOM Elements - Identity Fields
        const avatarInput = document.getElementById('avatar-input');
        const avatarTrigger = document.getElementById('avatar-trigger');
        const avatarDisplay = document.getElementById('avatar-display');
        const btnResetAvatar = document.getElementById('btn-reset-avatar');

        const inputRealName = document.getElementById('input-real-name');
        const inputNickname = document.getElementById('input-nickname');
        const inputRoyalTitle = document.getElementById('input-royal-title');
        const summaryName = document.getElementById('summary-name');
        const summaryTitle = document.getElementById('summary-title');
        const saveForm = document.getElementById('profile-registry-form');
        const saveToast = document.getElementById('save-toast');

        // DOM Elements - Rank Engine
        const rankIconDisplay = document.getElementById('rank-icon-display');
        const rankTitleDisplay = document.getElementById('rank-title-display');
        const rankDescDisplay = document.getElementById('rank-desc-display');
        const rankTierBadge = document.getElementById('rank-tier-badge');
        const scoreNumericLabel = document.getElementById('score-numeric-label');
        const rankProgressBar = document.getElementById('rank-progress-bar');
        const scoreSlider = document.getElementById('score-slider');
        const btnBoostScore = document.getElementById('btn-boost-score');

        // DOM Elements - Backup Utility
        const btnExportBackup = document.getElementById('btn-export-backup');
        const btnImportBackup = document.getElementById('btn-import-backup');
        const backupFileInput = document.getElementById('backup-file-input');
        const btnClearAllData = document.getElementById('btn-clear-all-data');
        const backupStatusToast = document.getElementById('backup-status-toast');

        // ====================================================================
        // Part 3: The Dynamic Rank Display Engine (Gamic Standings)
        // ====================================================================
        function evaluateRank(rawScore) {
          const score = Math.max(0, Math.min(100, parseInt(rawScore, 10) || 0));

          let title = "";
          let desc = "";
          let icon = "👶";
          let badgeClass = "rank-badge-mortal";
          let titleColor = "#94A3B8";

          if (score >= 91) {
            icon = "👑";
            title = "The Omnipotent God of Hype";
            desc = "For the absolute, undisputed legends ruling the timeline.";
            badgeClass = "rank-badge-god";
            titleColor = "#FBBF24";
          } else if (score >= 71) {
            icon = "🚀";
            title = "Certified Timeline Ruler";
            desc = "A master of turning daily chaos into controlled strategic victories.";
            badgeClass = "rank-badge-ruler";
            titleColor = "#38BDF8";
          } else if (score >= 51) {
            icon = "🍬";
            title = "Professional SugarCoater";
            desc = "Expertly transforming every single life mistake into a sweet work of art.";
            badgeClass = "rank-badge-sugar";
            titleColor = "var(--accent-sugar)";
          } else if (score >= 31) {
            icon = "😴";
            title = "Part-time Legend, Full-time Slacker";
            desc = "Gloriously lazy, perfectly turning procrastination into pure meditation.";
            badgeClass = "rank-badge-slacker";
            titleColor = "#C084FC";
          } else {
            icon = "👶";
            title = "Mere Mortal in Training";
            desc = "A fresh recruit still learning the delicate art of making a perfect mess.";
            badgeClass = "rank-badge-mortal";
            titleColor = "#94A3B8";
          }

          // Inject into DOM
          rankIconDisplay.textContent = icon;
          rankTitleDisplay.textContent = title;
          rankTitleDisplay.style.color = titleColor;
          rankDescDisplay.textContent = desc;
          rankTierBadge.className = `rank-badge-score ${badgeClass}`;
          rankTierBadge.textContent = `Tier Score: ${score}/100`;
          scoreNumericLabel.textContent = `${score} / 100 PTS`;
          scoreSlider.value = score;
          rankProgressBar.style.width = `${score}%`;
        }

        // ====================================================================
        // Part 2: Avatar Base64 Serialization & LocalStorage Hydration
        // ====================================================================
        function renderAvatar(base64OrEmoji) {
          if (!base64OrEmoji || base64OrEmoji.trim() === '' || base64OrEmoji.length <= 4) {
            avatarDisplay.innerHTML = base64OrEmoji || '👑';
          } else {
            avatarDisplay.innerHTML = `<img src="${base64OrEmoji}" alt="User Avatar" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;" />`;
          }
        }

        // Load Initial State from LocalStorage
        function hydrateProfile() {
          try {
            // Initialization Rule: If no global score exists in localStorage yet, default to 0
            let currentScore = localStorage.getItem('sugarcoat_global_score');
            if (currentScore === null || isNaN(parseInt(currentScore, 10))) {
              currentScore = '0';
              localStorage.setItem('sugarcoat_global_score', '0');
            }
            evaluateRank(currentScore);

            // Hydrate Identity Fields
            const storedName = localStorage.getItem('sugarcoat_user_name') || 'Unappreciated Genius';
            const storedNickname = localStorage.getItem('sugarcoat_user_nickname') || 'The Sovereign';
            const storedTitle = localStorage.getItem('sugarcoat_user_title') || 'Master of Avant-Garde Overthinking';
            const storedAvatar = localStorage.getItem('sugarcoat_user_avatar') || '👑';

            inputRealName.value = storedName;
            inputNickname.value = storedNickname;
            inputRoyalTitle.value = storedTitle;

            summaryName.textContent = storedNickname || storedName;
            summaryTitle.textContent = storedTitle;

            renderAvatar(storedAvatar);
          } catch(err) {
            console.warn('Hydration error:', err);
          }
        }

        // Trigger file input on avatar click
        if (avatarTrigger) {
          avatarTrigger.addEventListener('click', () => avatarInput.click());
        }

        // Base64 Image Upload Component via FileReader()
        if (avatarInput) {
          avatarInput.addEventListener('change', function(e) {
            const file = e.target.files && e.target.files[0];
            if (!file) return;

            if (!file.type.startsWith('image/')) {
              alert('Please select a valid image file (PNG, JPG, WebP, etc.).');
              return;
            }

            const reader = new FileReader();
            reader.onload = function(event) {
              const base64String = event.target.result;
              try {
                localStorage.setItem('sugarcoat_user_avatar', base64String);
                renderAvatar(base64String);
                playChime('save');
                showToast(saveToast, 'Avatar Uplinked Successfully ✓');
              } catch(storageErr) {
                alert('Image is too large for LocalStorage. Please upload a smaller compressed image.');
              }
            };
            reader.readAsDataURL(file);
          });
        }

        // Reset Avatar to Default
        if (btnResetAvatar) {
          btnResetAvatar.addEventListener('click', () => {
            localStorage.setItem('sugarcoat_user_avatar', '👑');
            renderAvatar('👑');
            playChime('save');
            showToast(saveToast, 'Avatar Reset to Sovereign Crown ✓');
          });
        }

        // Save Identity Form
        if (saveForm) {
          saveForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const realName = inputRealName.value.trim() || 'Unappreciated Genius';
            const nickname = inputNickname.value.trim() || 'The Sovereign';
            const royalTitle = inputRoyalTitle.value.trim() || 'Master of Avant-Garde Overthinking';

            try {
              localStorage.setItem('sugarcoat_user_name', realName);
              localStorage.setItem('sugarcoat_user_nickname', nickname);
              localStorage.setItem('sugarcoat_user_title', royalTitle);

              summaryName.textContent = nickname || realName;
              summaryTitle.textContent = royalTitle;

              playChime('save');
              showToast(saveToast, 'Identity Committed to LocalStorage ✓');
            } catch(err) {
              console.warn('Error saving identity:', err);
            }
          });
        }

        function showToast(el, text) {
          if (!el) return;
          el.innerHTML = `<span>✓</span> <span>${text}</span>`;
          el.className = 'feedback-toast success';
          setTimeout(() => {
            el.className = 'feedback-toast';
          }, 3500);
        }

        // Score Slider Adjuster
        if (scoreSlider) {
          scoreSlider.addEventListener('input', function(e) {
            const val = e.target.value;
            localStorage.setItem('sugarcoat_global_score', val);
            evaluateRank(val);
          });
        }

        // Score Auto-Boost Button
        if (btnBoostScore) {
          btnBoostScore.addEventListener('click', function() {
            let current = parseInt(localStorage.getItem('sugarcoat_global_score') || '0', 10);
            current = Math.min(100, current + 25);
            localStorage.setItem('sugarcoat_global_score', current.toString());
            evaluateRank(current);
            playChime('levelup');
          });
        }

        // ====================================================================
        // Part 4: The Client-Side Data Backup Utility (Export / Import Engine)
        // ====================================================================

        // 1. Export Data Button ([ Export SugarCoat Backup 📥 ])
        if (btnExportBackup) {
          btnExportBackup.addEventListener('click', function() {
            try {
              const backupPayload = {
                version: "2.0",
                exportedAt: new Date().toISOString(),
                author: "Rayaan Tasnim / IDAI Universe",
                data: {
                  sugarcoat_user_name: localStorage.getItem('sugarcoat_user_name') || '',
                  sugarcoat_user_nickname: localStorage.getItem('sugarcoat_user_nickname') || '',
                  sugarcoat_user_title: localStorage.getItem('sugarcoat_user_title') || '',
                  sugarcoat_user_avatar: localStorage.getItem('sugarcoat_user_avatar') || '',
                  sugarcoat_global_score: localStorage.getItem('sugarcoat_global_score') || '0',
                  sugarcoat_tokens_today: localStorage.getItem('sugarcoat_tokens_today') || '10',
                  sugarcoat_hall_of_fame: localStorage.getItem('sugarcoat_hall_of_fame') || '[]',
                  sugarcoat_prefill: localStorage.getItem('sugarcoat_prefill') || ''
                }
              };

              const jsonString = JSON.stringify(backupPayload, null, 2);
              const blob = new Blob([jsonString], { type: "application/json" });
              const url = URL.createObjectURL(blob);

              const downloadAnchor = document.createElement('a');
              downloadAnchor.href = url;
              downloadAnchor.download = "sugarcoat_backup.json";
              document.body.appendChild(downloadAnchor);
              downloadAnchor.click();
              document.body.removeChild(downloadAnchor);
              URL.revokeObjectURL(url);

              playChime('save');
              showToast(backupStatusToast, 'Backup JSON Generated & Downloaded 📥');
            } catch(err) {
              alert('Export failed: ' + err.message);
            }
          });
        }

        // 2. Import Data Button ([ Import SugarCoat Backup 📤 ])
        if (btnImportBackup && backupFileInput) {
          btnImportBackup.addEventListener('click', () => backupFileInput.click());

          backupFileInput.addEventListener('change', function(e) {
            const file = e.target.files && e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = function(event) {
              try {
                const parsed = JSON.parse(event.target.result);
                if (!parsed || !parsed.data) {
                  throw new Error("Invalid SugarCoat backup schema.");
                }

                const keys = Object.keys(parsed.data);
                keys.forEach(k => {
                  if (parsed.data[k] !== undefined && parsed.data[k] !== null) {
                    localStorage.setItem(k, parsed.data[k]);
                  }
                });

                // Refresh DOM configuration instantly
                hydrateProfile();
                playChime('levelup');
                showToast(backupStatusToast, 'Backup Restored! Profile & History Refreshed 🚀');
                backupFileInput.value = '';
              } catch(parseErr) {
                alert('Import Failed: The chosen file is not a valid sugarcoat_backup.json file.');
              }
            };
            reader.readAsText(file);
          });
        }

        // Nuclear Clear Option
        if (btnClearAllData) {
          btnClearAllData.addEventListener('click', function() {
            if (confirm("Are you sure you want to reset all SugarCoat local storage? Your profile, score, and Hall of Fame will be purged.")) {
              localStorage.clear();
              hydrateProfile();
              playChime('save');
              showToast(backupStatusToast, 'All Local Storage Successfully Purged 🧹');
            }
          });
        }

        // Initial Boot
        hydrateProfile();
      })();
