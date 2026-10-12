      // Universal GSAP staggered nav animation wire-in & ScrollTrigger reveals
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

        // Smooth GSAP ScrollTrigger reveals across why.html sections and cards
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
          gsap.registerPlugin(ScrollTrigger);

          const revealTargets = [
            '#why-philosophy .hero-section',
            '#why-philosophy .responsive-cards-grid > .glass-card',
            '#hall-of-ranks .ranks-gallery-column > .rank-heraldry-card',
            '#hall-of-ranks .responsive-split-row > div:last-child > .glass-card',
            '#ego-benefit-matrix .four-col-matrix > .glass-card',
            '#workflow-breakdown .step-flow-card'
          ];

          revealTargets.forEach((targetSelector) => {
            gsap.utils.toArray(targetSelector).forEach((element) => {
              gsap.from(element, {
                scrollTrigger: {
                  trigger: element,
                  start: 'top 88%',
                  toggleActions: 'play none none none',
                  once: true
                },
                y: 30,
                opacity: 0,
                duration: 0.65,
                ease: 'power2.out'
              });
            });
          });
        }
      });
