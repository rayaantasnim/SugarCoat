      // Universal GSAP staggered nav animation wire-in
      document.addEventListener('DOMContentLoaded', () => {
        const overlay = document.getElementById('fullscreen-nav');
        if (overlay && window.gsap) {
          const observer = new MutationObserver(() => {
            if (overlay.classList.contains('open')) {
              gsap.fromTo(
                '.nav-overlay-link',
                { opacity: 0, y: 16, scale: 0.96 },
                { opacity: 1, y: 0, scale: 1, duration: 0.35, stagger: 0.05, ease: 'power2.out', clearProps: 'all' }
              );
            }
          });
          observer.observe(overlay, { attributes: true, attributeFilter: ['class'] });
        }
      });
