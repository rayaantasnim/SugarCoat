/**
 * SugarCoat — Universal 7-Page Navigation Engine (nav.js)
 * Master 7-Page Architecture Controller
 */
(function () {
  const NAV_ITEMS = [
    {
      num: "01",
      title: "Home",
      slogan: "The starting line. Turn your worst days into historic milestones.",
      href: "index.html"
    },
    {
      num: "02",
      title: "ChatBOT",
      slogan: "Where your daily mess-ups turn into legendary wins.",
      href: "chatbot.html"
    },
    {
      num: "03",
      title: "Why SugarCoat?",
      slogan: "A deep-dive into toxic positivity, daily rewards, and gamified ranks.",
      href: "why.html"
    },
    {
      num: "04",
      title: "Hall of Fame",
      slogan: "Your personal time-stamped archive of beautifully sugarcoated moments.",
      href: "history.html"
    },
    {
      num: "05",
      title: "Legendary Profile",
      slogan: "Set your identity, upload avatars, and unlock your dynamic score-based rank.",
      href: "profile.html"
    },
    {
      num: "06",
      title: "Rules & Regulations",
      slogan: "How our AI engine works, privacy policies, and strict safety red-lines.",
      href: "rules.html"
    },
    {
      num: "07",
      title: "The FAQ Station",
      slogan: "Interactive, confetti-powered answers to your wildest questions.",
      href: "faq.html"
    }
  ];

  // Subtle Web Audio API hover tick chime
  let audioCtx = null;
  function playHoverTick() {
    try {
      if (!audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        audioCtx = new AudioContext();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1320, audioCtx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);

      osc.start(audioCtx.currentTime);
      osc.stop(audioCtx.currentTime + 0.05);
    } catch (e) {
      // Audio gracefully silent-fails if not yet interacted
    }
  }

  function initNav() {
    const currentPath = window.location.pathname.toLowerCase();

    // Determine active index across the 7-Page Master Architecture
    let activeIndex = -1;
    if (currentPath.endsWith('chatbot.html') || currentPath.endsWith('chatbot')) {
      activeIndex = 1; // 02. ChatBOT
    } else if (currentPath.endsWith('why.html') || currentPath.endsWith('why')) {
      activeIndex = 2; // 03. Why SugarCoat?
    } else if (currentPath.endsWith('history.html') || currentPath.endsWith('history')) {
      activeIndex = 3; // 04. Hall of Fame
    } else if (currentPath.endsWith('profile.html') || currentPath.endsWith('profile')) {
      activeIndex = 4; // 05. Legendary Profile
    } else if (currentPath.endsWith('rules.html') || currentPath.endsWith('rules')) {
      activeIndex = 5; // 06. Rules & Regulations
    } else if (currentPath.endsWith('faq.html') || currentPath.endsWith('faq')) {
      activeIndex = 6; // 07. The FAQ Station
    } else if (currentPath.endsWith('index.html') || currentPath === '/' || currentPath === '' || currentPath.endsWith('/index')) {
      activeIndex = 0; // 01. Home
    }

    // Ensure hamburger button exists in DOM
    let navRoot = document.getElementById('global-nav-root');
    if (!navRoot) {
      navRoot = document.createElement('div');
      navRoot.id = 'global-nav-root';
      document.body.prepend(navRoot);
    }
    navRoot.innerHTML = `
      <button type="button" id="hamburger-trigger" class="hamburger-btn" aria-label="Toggle Fullscreen Navigation Menu">
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
      </button>
    `;

    // Ensure fullscreen overlay container exists
    let overlay = document.getElementById('fullscreen-nav');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'fullscreen-nav';
      overlay.className = 'fullscreen-nav-overlay';
      overlay.setAttribute('aria-label', 'Universal Site Navigation');
      document.body.prepend(overlay);
    }

    // Generate complete 7 items
    const navItemsHTML = NAV_ITEMS.map((item, idx) => {
      const isActive = idx === activeIndex;
      return `
        <li>
          <a href="${item.href}" class="nav-overlay-link ${isActive ? 'active-nav' : ''}" data-nav-idx="${idx}">
            <span class="nav-index-num">${item.num}</span>
            <div class="nav-content-block">
              <span class="nav-item-title">${item.title}</span>
              <span class="nav-item-desc">${item.slogan}</span>
            </div>
          </a>
        </li>
      `;
    }).join('');

    overlay.innerHTML = `
      <div class="nav-overlay-topbar">
        <a href="index.html" class="nav-overlay-brand">
          <span>🍬</span>
          <span>Sugar<span style="color: var(--accent-sugar);">Coat</span></span>
        </a>
        <button type="button" id="nav-overlay-close" class="nav-overlay-close" aria-label="Close navigation">&times;</button>
      </div>
      <ul class="nav-overlay-list">
        ${navItemsHTML}
      </ul>
    `;

    // Bind event handlers
    const hamburger = document.getElementById('hamburger-trigger');
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

    // Escape key listener
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay.classList.contains('open')) {
        closeNav();
      }
    });

    // Attach hover audio triggers to links
    overlay.querySelectorAll('.nav-overlay-link').forEach(link => {
      link.addEventListener('mouseenter', () => playHoverTick());
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNav);
  } else {
    initNav();
  }
})();
