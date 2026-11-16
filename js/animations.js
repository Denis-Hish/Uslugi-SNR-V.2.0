'use strict';

//* GSAP *//
gsap.registerPlugin(ScrollTrigger, SplitText);

// Hero section
(function heroAnimation() {
  gsap.to('.hero .hero-card', {
    duration: 1,
    autoAlpha: 1,
    scale: 1,
  });

  gsap.to('.hero .subtitle', {
    duration: 0.5,
    y: 0,
    autoAlpha: 1,
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

  gsap.to('.box-actions', {
    duration: 0.5,
    delay: 1,
    scale: 1,
    autoAlpha: 1,
  });

  gsap.to('.hero .hero-logo', {
    duration: 0.5,
    delay: 1.2,
    scale: 1,
    autoAlpha: 1,
  });
})();

// Menu
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

// Title
gsap.utils.toArray('.animation-title').forEach(block => {
  SplitText.create(block.querySelector('.title'), {
    type: 'lines, words',
    mask: 'lines',
    autoSplit: true,

    onSplit(self) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: block,
          start: 'top 90%',
          toggleActions: 'play none none reverse',
          // markers: true,
        },
      });

      tl.fromTo(
        block.querySelector('.subtitle'),
        { autoAlpha: 0, y: 100 },
        { duration: 0.5, autoAlpha: 1, y: 0 },
      )
        .fromTo(
          self.words,
          { autoAlpha: 0, y: 100 },
          {
            duration: 0.5,
            autoAlpha: 1,
            y: 0,
            stagger: 0.05,
          },
          '-=0.25',
        )
        .fromTo(
          block.querySelector('.description-container'),
          { autoAlpha: 0, x: 100 },
          { duration: 0.5, autoAlpha: 1, x: 0 },
          '-=0.25',
        );

      return tl;
    },
  });
});

gsap.utils.toArray('.animation-card').forEach(block => {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: block,
      start: 'top 90%',
      toggleActions: 'play none none reverse',
      // markers: true,
    },
  });

  tl.from(block, { duration: 0.5, autoAlpha: 0, y: 50 });
});

// About
const aboutTl = gsap.timeline({
  scrollTrigger: {
    trigger: '.about .mission',
    start: 'top 80%',
    toggleActions: 'play none none reverse',
  },
});

aboutTl.from('.about .mission .mission-title', {
  duration: 0.5,
  autoAlpha: 0,
  x: -100,
});

aboutTl.from(
  '.about .mission .mission-description',
  {
    duration: 0.5,
    autoAlpha: 0,
    x: 100,
  },
  0,
);

// Contacts
const contactsTimeline = gsap.timeline({
  scrollTrigger: {
    trigger: '.contact .contacts',
    start: 'top 90%',
    toggleActions: 'play none none reverse',
    // markers: true,
  },
});

contactsTimeline.from('.contact .contacts', {
  duration: 0.5,
  autoAlpha: 0,
  y: 100,
});
