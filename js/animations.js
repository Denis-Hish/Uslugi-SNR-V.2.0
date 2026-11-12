'use strict';

//* GSAP *//
gsap.registerPlugin(ScrollTrigger, SplitText);

(function heroAnimation() {
  gsap.from('.hero .subtitle', {
    duration: 0.5,
    y: 100,
    autoAlpha: 0,
    stagger: 0.05,
  });

  SplitText.create('.hero .title', {
    type: 'lines, words',
    mask: 'lines',
    aria: 'none',
    autoSplit: true,
    onSplit(self) {
      return gsap.from(self.words, {
        duration: 1,
        delay: 0.2,
        y: 100,
        autoAlpha: 0,
        stagger: 0.05,
        onComplete: () => self.revert(),
      });
    },
  });

  SplitText.create('.hero .box-description p', {
    type: 'lines',
    mask: 'lines',
    aria: 'none',
    autoSplit: true,
    onSplit(self) {
      return gsap.from(self.lines, {
        duration: 1,
        delay: 0.4,
        y: 100,
        autoAlpha: 0,
        stagger: 0.05,
        onComplete: () => self.revert(),
      });
    },
  });

  gsap.from('.box-actions', {
    duration: 0.5,
    delay: 1,
    scale: 0.98,
    autoAlpha: 0,
  });

  gsap.from('.hero .hero-logo', {
    duration: 0.5,
    delay: 1.2,
    scale: 0.98,
    autoAlpha: 0,
  });

  gsap.from('.hero .hero-card', {
    duration: 1,
    autoAlpha: 0,
    scale: 0.98,
  });
})();

(function menuAnimation() {
  if (!menuToggle || !nav || !menuLabel) return;

  let timeline = null;

  menuAnimator = {
    open() {
      if (!timeline) {
        timeline = gsap
          .timeline({ paused: true })
          .to(nav, { autoAlpha: 1, duration: 0.4, ease: 'power2.out' })
          .fromTo(
            navLinks,
            { autoAlpha: 0, y: 30 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.5,
              stagger: 0.1,
              ease: 'power3.out',
            },
            '-=0.15',
          );
      }
      timeline.timeScale(1).play();
    },
    close() {
      if (timeline) timeline.timeScale(1.6).reverse();
    },
    reset() {
      if (!timeline) return;
      timeline.kill();
      timeline = null;
      gsap.set([nav, ...navLinks], {
        clearProps: 'opacity,visibility,transform',
      });
    },
  };
})();
