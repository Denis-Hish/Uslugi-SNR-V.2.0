'use strict';

/* =========================================
   01. DOM ELEMENTS
========================================= */

const menuToggle = document.querySelector('#menuToggle');
const navigation = document.querySelector('#navigation');
const navLinks = document.querySelectorAll('.nav__link');
const menuLabel = document.querySelector('.menu-toggle__label');

/* =========================================
   02. MOBILE NAVIGATION
========================================= */

if (menuToggle && navigation) {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let menuTimeline = null;

  // Built lazily so desktop navigation is never touched by GSAP
  const getMenuTimeline = () => {
    if (menuTimeline) return menuTimeline;

    menuTimeline = gsap
      .timeline({ paused: true })
      .to(navigation, { autoAlpha: 1, duration: 0.4, ease: 'power2.out' })
      .fromTo(
        navLinks,
        { autoAlpha: 0, y: 40 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: 'power3.out',
        },
        '-=0.15',
      );

    return menuTimeline;
  };

  const resetMenuTimeline = () => {
    if (!menuTimeline) return;

    menuTimeline.kill();
    menuTimeline = null;
    gsap.set([navigation, ...navLinks], { clearProps: 'opacity,visibility,transform' });
  };

  const isMobile = () => window.innerWidth <= 768;
  const useGsap = () => typeof gsap !== 'undefined' && isMobile() && !reduceMotion.matches;

  const openMenu = () => {
    menuToggle.classList.add('is-active');
    navigation.classList.add('is-open');

    if (useGsap()) {
      getMenuTimeline().timeScale(1).play();
    } else if (isMobile()) {
      navigation.style.cssText = 'opacity:1;visibility:visible';
    }

    menuToggle.setAttribute('aria-expanded', 'true');
    menuToggle.setAttribute('aria-label', 'Zamknij menu');
    menuLabel.textContent = 'zamknij';

    document.body.classList.add('menu-open');
  };

  const closeMenu = () => {
    const wasOpen = navigation.classList.contains('is-open');

    menuToggle.classList.remove('is-active');
    navigation.classList.remove('is-open');

    if (menuTimeline) {
      // Same animation played backwards, a bit faster
      if (wasOpen) menuTimeline.timeScale(1.6).reverse();
    } else {
      navigation.style.cssText = '';
    }

    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Otwórz menu');
    menuLabel.textContent = 'menu';

    document.body.classList.remove('menu-open');
  };

  const toggleMenu = () => {
    const isOpen = navigation.classList.contains('is-open');

    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  };

  // Toggle menu
  menuToggle.addEventListener('click', toggleMenu);

  // Close menu after clicking a navigation link
  navLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close menu using Escape
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      closeMenu();
    }
  });

  // Close menu when clicking outside
  document.addEventListener('click', event => {
    const clickedInsideMenu = navigation.contains(event.target);
    const clickedToggle = menuToggle.contains(event.target);

    if (!clickedInsideMenu && !clickedToggle) {
      closeMenu();
    }
  });

  // Close menu when switching to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      closeMenu();
      resetMenuTimeline();
      navigation.style.cssText = '';
    }
  });
}

/* =========================================
   03. FOOTER CURRENT YEAR
========================================= */

const currentYear = document.querySelector('#currentYear');

if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}

/* =========================================
   04. SMOOTH SCROLL
========================================= */

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', event => {
    const targetId = link.getAttribute('href');

    if (!targetId || targetId === '#') return;

    const target = document.querySelector(targetId);

    if (!target) return;

    event.preventDefault();

    // The header is sticky, so scrolling to it would not move the page
    if (targetId === '#header') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    target.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  });
});

/* =========================================
   05. CONTACT DIALOG
========================================= */

const contactDialog = document.querySelector('#contactDialog');
const contactForm = document.querySelector('#contactForm');
const formStatus = document.querySelector('#formStatus');

if (contactDialog && contactForm) {
  const openButton = document.querySelector('#openContact');
  const closeButton = document.querySelector('#closeContact');
  const submitButton = contactForm.querySelector('[type="submit"]');
  const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  const setStatus = (type, text) => {
    formStatus.textContent = text;
    formStatus.className = type ? `form__status is-${type}` : 'form__status';
  };

  const resetForm = () => {
    contactForm.reset();
    setStatus('', '');
    contactForm.querySelectorAll('.form__field').forEach(field => {
      field.classList.remove('has-error');
      field.querySelector('.form__error').textContent = '';
    });
  };

  const openDialog = () => {
    contactDialog.showModal();
    document.body.classList.add('dialog-open');
    contactForm.elements.name.focus();
  };

  const closeDialog = () => {
    if (contactDialog.open) contactDialog.close();
  };

  // Fired for close button, Esc, backdrop click and successful submit
  contactDialog.addEventListener('close', () => {
    document.body.classList.remove('dialog-open');
    resetForm();
  });

  openButton?.addEventListener('click', openDialog);
  closeButton?.addEventListener('click', closeDialog);

  // The dialog fills the box, so a click whose target is the dialog itself hit the backdrop
  contactDialog.addEventListener('click', event => {
    if (event.target === contactDialog) closeDialog();
  });

  const validate = () => {
    const { name, email, message } = contactForm.elements;
    const errors = {};

    if (name.value.trim().length < 2) errors.name = 'Podaj imię (min. 2 znaki).';
    if (!EMAIL_PATTERN.test(email.value.trim())) errors.email = 'Podaj poprawny adres e-mail.';
    if (message.value.trim().length < 10) errors.message = 'Wiadomość musi mieć min. 10 znaków.';

    contactForm.querySelectorAll('.form__field').forEach(field => {
      const key = field.querySelector('[data-error-for]').dataset.errorFor;
      field.classList.toggle('has-error', Boolean(errors[key]));
      field.querySelector('.form__error').textContent = errors[key] || '';
    });

    return Object.keys(errors).length === 0;
  };

  contactForm.addEventListener('submit', async event => {
    event.preventDefault();
    setStatus('', '');

    if (!validate()) {
      setStatus('error', 'Popraw zaznaczone pola i spróbuj ponownie.');
      return;
    }

    const endpoint = contactForm.dataset.endpoint;
    submitButton.disabled = true;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(contactForm))),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      setStatus('success', 'Dziękujemy! Wiadomość została wysłana.');
      setTimeout(closeDialog, 1800);
    } catch (error) {
      const offline = !navigator.onLine;
      setStatus(
        'error',
        offline
          ? 'Brak połączenia z internetem. Sprawdź sieć i spróbuj ponownie.'
          : 'Nie udało się wysłać wiadomości. Spróbuj ponownie później.',
      );
    } finally {
      submitButton.disabled = false;
    }
  });
}

/* =========================================
   06. ACTIVE NAV LINK ON SCROLL
========================================= */

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
      window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;

    // Default to the first link (hero sits above the first section)
    let current = navSections[0];

    navSections.forEach(item => {
      if (item.section.getBoundingClientRect().top <= line) current = item;
    });

    if (atBottom) current = navSections[navSections.length - 1];

    if (current.link === activeLink) return;

    activeLink = current.link;
    navLinks.forEach(link => link.classList.toggle('nav__link--active', link === activeLink));
  };

  window.addEventListener('scroll', updateActiveLink, { passive: true });
  window.addEventListener('resize', updateActiveLink);
  window.addEventListener('load', updateActiveLink);
  updateActiveLink();
}
