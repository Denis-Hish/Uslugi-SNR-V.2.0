'use strict';

//* MENU TOGGLE *//
const menuToggle = document.getElementById('menuToggle');
const nav = document.querySelector('.nav');
const navLinks = document.querySelectorAll('.nav-link');
const menuLabel = document.querySelector('.menu-toggle__label');
const header = document.querySelector('.header');
const mobileMenu = window.matchMedia('(max-width: 768px)');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (menuToggle && nav && menuLabel) {
  let menuTimeline = null;

  const resetMenuTimeline = () => {
    if (!menuTimeline) return;
    menuTimeline.kill();
    menuTimeline = null;
    gsap.set([nav, ...navLinks], {
      clearProps: 'opacity,visibility,transform',
    });
  };

  const openMenu = () => {
    if (!mobileMenu.matches) return;

    nav.inert = false;
    nav.classList.add('is-open');
    menuToggle.classList.add('is-active');
    menuToggle.setAttribute('aria-expanded', 'true');
    menuToggle.setAttribute('aria-label', 'Zamknij menu');
    menuLabel.textContent = 'zamknij';
    document.body.classList.add('menu-open');
    header.classList.remove('is-hidden');
    isHeaderVisible = true;

    if (typeof gsap !== 'undefined' && !reduceMotion.matches) {
      if (!menuTimeline) {
        menuTimeline = gsap
          .timeline({ paused: true })
          .to(nav, { autoAlpha: 1, duration: 0.4, ease: 'power2.out' })
          .fromTo(
            navLinks,
            { autoAlpha: 0, y: 40 },
            { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power3.out' },
            '-=0.15',
          );
      }
      menuTimeline.timeScale(1).play();
    } else {
      nav.style.opacity = '1';
      nav.style.visibility = 'visible';
    }
  };

  const closeMenu = () => {
    if (!nav.classList.contains('is-open')) return;

    if (nav.contains(document.activeElement)) menuToggle.focus();
    nav.classList.remove('is-open');
    nav.inert = mobileMenu.matches;
    menuToggle.classList.remove('is-active');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Otwórz menu');
    menuLabel.textContent = 'menu';
    document.body.classList.remove('menu-open');

    if (menuTimeline) {
      menuTimeline.timeScale(1.6).reverse();
    } else {
      nav.style.removeProperty('opacity');
      nav.style.removeProperty('visibility');
    }
  };

  menuToggle.addEventListener('click', () => {
    if (nav.classList.contains('is-open')) closeMenu();
    else openMenu();
  });
  navLinks.forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeMenu();
  });
  document.addEventListener('click', event => {
    if (!nav.contains(event.target) && !menuToggle.contains(event.target)) {
      closeMenu();
    }
  });

  const syncMenuMode = () => {
    closeMenu();
    resetMenuTimeline();
    nav.style.removeProperty('opacity');
    nav.style.removeProperty('visibility');
    nav.inert = mobileMenu.matches;
  };

  mobileMenu.addEventListener('change', syncMenuMode);
  reduceMotion.addEventListener('change', syncMenuMode);
  nav.inert = mobileMenu.matches;
}

//* HEADER HIDE ON SCROLL *//
let lastScrollY = 0;
let isHeaderVisible = true;

const handleHeaderVisibility = () => {
  const currentScrollY = window.scrollY;

  if (document.body.classList.contains('menu-open')) {
    lastScrollY = currentScrollY;
    return;
  }

  // Show header when scrolling up
  if (currentScrollY < lastScrollY) {
    if (!isHeaderVisible) {
      header.classList.remove('is-hidden');
      isHeaderVisible = true;
    }
  }
  // Hide header when scrolling down (only if scrolled more than 50px)
  else if (currentScrollY > lastScrollY && currentScrollY > 50) {
    if (isHeaderVisible) {
      header.classList.add('is-hidden');
      isHeaderVisible = false;
    }
  }

  lastScrollY = currentScrollY;
};

window.addEventListener('scroll', handleHeaderVisibility, { passive: true });

//* ACTIVE NAV LINK ON SCROLL *//
const navSections = [...navLinks]
  .map(link => ({
    link,
    section: document.querySelector(link.getAttribute('href')),
  }))
  .filter(item => item.section);

if (navSections.length) {
  let activeLink = null;

  const updateActiveLink = () => {
    const line = window.innerHeight * 0.4;
    const atBottom =
      window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight - 4;

    // Default to the first link (hero sits above the first section)
    let current = navSections[0];

    navSections.forEach(item => {
      if (item.section.getBoundingClientRect().top <= line) current = item;
    });

    if (atBottom) current = navSections[navSections.length - 1];

    if (current.link === activeLink) return;

    activeLink = current.link;
    navLinks.forEach(link =>
      link.classList.toggle('active', link === activeLink),
    );
  };

  window.addEventListener('scroll', updateActiveLink, { passive: true });
  window.addEventListener('resize', updateActiveLink);
  window.addEventListener('load', updateActiveLink);
  updateActiveLink();
}
