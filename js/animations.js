'use strict';

/* =========================================
   GSAP 3.15
   NADZIEJA RODZINIE
========================================= */

/* =========================================
   01. REGISTER PLUGINS
========================================= */

gsap.registerPlugin(ScrollTrigger, SplitText);

/* =========================================
   02. GLOBAL SETTINGS
========================================= */

gsap.config({
  nullTargetWarn: false,
});

/* =========================================
   03. REDUCED MOTION
========================================= */

const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)',
).matches;

if (prefersReducedMotion) {
  gsap.set('*', {
    clearProps: 'opacity,visibility,transform,clipPath',
  });
} else {
  /* =========================================
     04. HERO ANIMATION
  ========================================= */

  const heroAnimation = () => {
    const hero = document.querySelector('.hero');

    if (!hero) return;

    const eyebrow = hero.querySelector('.hero__eyebrow');
    const title = hero.querySelector('.hero__title');
    const description = hero.querySelector('.hero__description');
    const button = hero.querySelector('.button');
    const image = hero.querySelector('.hero__image-wrapper');
    const decoration = hero.querySelector('.hero__decoration');

    // Split heading into lines
    const titleSplit = SplitText.create(title, {
      type: 'lines',
      linesClass: 'split-line',
      mask: 'lines',
    });

    // Initial states
    gsap.set([eyebrow, description, button, image], {
      autoAlpha: 0,
    });

    gsap.set(titleSplit.lines, {
      yPercent: 110,
    });

    gsap.set(image, {
      clipPath: 'inset(0 0 100% 0)',
    });

    gsap.set(decoration, {
      scaleY: 0,
      transformOrigin: 'top center',
    });

    // Main timeline
    const tl = gsap.timeline({
      defaults: {
        ease: 'power3.out',
      },
    });

    tl.to(eyebrow, {
      autoAlpha: 1,
      y: 0,
      duration: 0.6,
    })

      .to(
        titleSplit.lines,
        {
          yPercent: 0,
          duration: 1,
          stagger: 0.13,
        },
        '-=0.25',
      )

      .to(
        description,
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
        },
        '-=0.45',
      )

      .to(
        button,
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
        },
        '-=0.45',
      )

      .to(
        image,
        {
          autoAlpha: 1,
          clipPath: 'inset(0 0 0% 0)',
          duration: 1.3,
          ease: 'power2.inOut',
        },
        '-=1',
      )

      .to(
        decoration,
        {
          scaleY: 1,
          duration: 1,
          ease: 'power2.out',
        },
        '-=1.1',
      );
  };

  /* =========================================
     05. SERVICES HEADING
  ========================================= */

  const servicesHeadingAnimation = () => {
    const heading = document.querySelector('.services__heading');

    if (!heading) return;

    const eyebrow = heading.querySelector('.eyebrow');
    const title = heading.querySelector('.section-title');
    const note = heading.querySelector('.services__note');

    const titleSplit = SplitText.create(title, {
      type: 'lines',
      linesClass: 'split-line',
      mask: 'lines',
    });

    gsap.set([eyebrow, note], {
      autoAlpha: 0,
      y: 30,
    });

    gsap.set(titleSplit.lines, {
      yPercent: 110,
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: heading,
        start: 'top 80%',
        once: true,
      },
    });

    tl.to(eyebrow, {
      autoAlpha: 1,
      y: 0,
      duration: 0.6,
      ease: 'power2.out',
    })

      .to(
        titleSplit.lines,
        {
          yPercent: 0,
          duration: 0.9,
          stagger: 0.12,
          ease: 'power3.out',
        },
        '-=0.3',
      )

      .to(
        note,
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          ease: 'power2.out',
        },
        '-=0.5',
      );
  };

  /* =========================================
     06. SERVICE CARDS
  ========================================= */

  const serviceCardsAnimation = () => {
    const cards = gsap.utils.toArray('.service-card');

    if (!cards.length) return;

    gsap.set(cards, { autoAlpha: 0, y: 24 });

    // Batch: cards entering together appear in a smooth stagger, without layout jumps
    ScrollTrigger.batch(cards, {
      start: 'top 92%',
      once: true,
      onEnter: batch =>
        gsap.to(batch, {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.12,
          ease: 'power2.out',
          overwrite: true,
          clearProps: 'transform',
        }),
    });

    // Lazy images change layout after load — recalculate trigger positions
    window.addEventListener('load', () => ScrollTrigger.refresh());
  };

  /* =========================================
     07. IMAGE PARALLAX
  ========================================= */

  const imageRevealAnimation = () => {
    gsap.utils.toArray('.service-card').forEach(card => {
      const image = card.querySelector('.service-card__image');

      if (!image) return;

      gsap.fromTo(
        image,
        { yPercent: -6 },
        {
          yPercent: 6,
          ease: 'none',
          scrollTrigger: {
            trigger: card,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        },
      );
    });
  };
  /* =========================================
     08. MISSION ANIMATION
  ========================================= */

  const missionAnimation = () => {
    const mission = document.querySelector('.mission__inner');

    if (!mission) return;

    const eyebrow = mission.querySelector('.eyebrow');
    const title = mission.querySelector('h2');
    const content = mission.querySelector('.mission__content');

    const titleSplit = SplitText.create(title, {
      type: 'lines',
      linesClass: 'split-line',
      mask: 'lines',
    });

    gsap.set(eyebrow, {
      autoAlpha: 0,
      y: 25,
    });

    gsap.set(titleSplit.lines, {
      yPercent: 110,
    });

    gsap.set(content, {
      autoAlpha: 0,
      x: 35,
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: mission,
        start: 'top 75%',
        once: true,
      },
    });

    tl.to(eyebrow, {
      autoAlpha: 1,
      y: 0,
      duration: 0.6,
      ease: 'power2.out',
    })

      .to(
        titleSplit.lines,
        {
          yPercent: 0,
          duration: 0.9,
          stagger: 0.15,
          ease: 'power3.out',
        },
        '-=0.3',
      )

      .to(
        content,
        {
          autoAlpha: 1,
          x: 0,
          duration: 0.9,
          ease: 'power3.out',
        },
        '-=0.5',
      );
  };

  /* =========================================
     09. CONTACT ANIMATION
  ========================================= */

  const contactAnimation = () => {
    const contact = document.querySelector('.contact__container');

    if (!contact) return;

    const content = contact.querySelector('.contact__content');

    const decoration = contact.querySelector('.contact__decoration');

    gsap.set(content, {
      autoAlpha: 0,
      y: 40,
    });

    gsap.set(decoration, {
      autoAlpha: 0,
      scale: 0.7,
      rotation: -15,
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: contact,
        start: 'top 80%',
        once: true,
      },
    });

    tl.to(content, {
      autoAlpha: 1,
      y: 0,
      duration: 0.9,
      ease: 'power3.out',
    })

      .to(
        decoration,
        {
          autoAlpha: 1,
          scale: 1,
          rotation: 0,
          duration: 1,
          ease: 'back.out(1.5)',
        },
        '-=0.6',
      );
  };

  /* =========================================
     10. FOOTER ANIMATION
  ========================================= */

  const footerAnimation = () => {
    const footer = document.querySelector('.footer');

    if (!footer) return;

    gsap.from(
      footer.querySelectorAll('.logo, .footer__copyright, .footer__top'),
      {
        autoAlpha: 0,
        y: 20,

        duration: 0.7,
        stagger: 0.12,
        ease: 'power2.out',

        scrollTrigger: {
          trigger: footer,
          start: 'top 95%',
          once: true,
        },
      },
    );
  };

  /* =========================================
     12. HEADER HIDE ON SCROLL
  ========================================= */

  const headerScrollAnimation = () => {
    const header = document.querySelector('#header');

    if (!header) return;

    let lastY = window.scrollY;
    let hidden = false;

    const toggle = hide => {
      if (hide === hidden) return;

      hidden = hide;

      gsap.to(header, {
        yPercent: hide ? -100 : 0,
        duration: 0.4,
        ease: 'power2.out',
        overwrite: true,
      });
    };

    window.addEventListener(
      'scroll',
      () => {
        const y = Math.max(window.scrollY, 0);
        const menuOpen = document.body.classList.contains('menu-open');

        if (y < 120 || menuOpen) {
          toggle(false);
        } else if (Math.abs(y - lastY) > 6) {
          toggle(y > lastY);
        }

        lastY = y;
      },
      { passive: true },
    );
  };

  /* =========================================
     13. CUSTOM CURSOR
  ========================================= */

  const customCursor = () => {
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    if (!canHover) return;

    const cursor = document.querySelector('#cursor');

    if (cursor) {
      const moveX = gsap.quickTo(cursor, 'x', { duration: 0.25, ease: 'power3.out' });
      const moveY = gsap.quickTo(cursor, 'y', { duration: 0.25, ease: 'power3.out' });

      window.addEventListener('mousemove', event => {
        cursor.classList.add('is-visible');
        moveX(event.clientX);
        moveY(event.clientY);
      });

      document.addEventListener('mouseleave', () => cursor.classList.remove('is-visible'));

      document.addEventListener('mouseover', event => {
        const interactive = event.target.closest('a, button, input, textarea, .service-card');
        cursor.classList.toggle('is-hover', Boolean(interactive));
      });
    }
  };
  /* =========================================
     11. INITIALIZE ANIMATIONS
  ========================================= */

  const initAnimations = () => {
    const mm = gsap.matchMedia();

    mm.add('(min-width: 769px)', () => {
      heroAnimation();
      servicesHeadingAnimation();
      serviceCardsAnimation();
      imageRevealAnimation();
      missionAnimation();
      contactAnimation();
      footerAnimation();
      headerScrollAnimation();
      customCursor();
    });

    mm.add('(max-width: 768px)', () => {
      // Simplified animations for mobile
      heroAnimation();
      servicesHeadingAnimation();
      serviceCardsAnimation();
      imageRevealAnimation();
      missionAnimation();
      contactAnimation();
      footerAnimation();
      headerScrollAnimation();
      customCursor();
    });
  };

  // Initialize
  initAnimations();
}
