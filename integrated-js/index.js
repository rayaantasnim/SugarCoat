      // Universal GSAP staggered nav animation wire-in & ScrollTrigger sequence
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

        // Immersive GSAP ScrollTrigger timeline configuration
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
          gsap.registerPlugin(ScrollTrigger);

          // Hero entrance animation
          gsap.from('#hero .hero-content-stack > *', {
            y: 28,
            opacity: 0,
            duration: 0.75,
            stagger: 0.12,
            ease: 'power3.out'
          });

          // Synchronized ScrollTrigger reveals across page blocks
          const revealSelectors = [
            '#fast-sugarcoat-station',
            '#hype-tracker .hype-card',
            '#multi-disaster-showcase .disaster-showcase-row',
            '#ego-meter-simulator .glass-card',
            '#specs .spec-card',
            '#achievements-hall .spec-card',
            '#final-push .final-push-card'
          ];

          revealSelectors.forEach((selector) => {
            gsap.utils.toArray(selector).forEach((el) => {
              gsap.from(el, {
                scrollTrigger: {
                  trigger: el,
                  start: 'top 85%',
                  toggleActions: 'play none none none',
                  once: true
                },
                y: 35,
                opacity: 0,
                duration: 0.7,
                ease: 'power2.out'
              });
            });
          });
        }
      });
