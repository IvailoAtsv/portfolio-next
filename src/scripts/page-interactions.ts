import { initHeroNotes } from './hero-notes';
import { initMotion } from './motion';

let cleanupPage = () => {};

// Client navigation keeps the document alive. Rebind each new page and release
// observers and document listeners belonging to the old one.
document.addEventListener('astro:before-swap', () => cleanupPage());
document.addEventListener('astro:page-load', () => {
  cleanupPage();
  const controller = new AbortController();
  const { signal } = controller;
  const observers: IntersectionObserver[] = [];
  const stopMotion = initMotion(signal);
  const stopHeroNotes = initHeroNotes(signal);
  cleanupPage = () => {
    controller.abort();
    stopMotion();
    stopHeroNotes();
    observers.forEach((observer) => observer.disconnect());
  };

  const revealItems = document.querySelectorAll('[data-reveal]');
  const loopItems = document.querySelectorAll('.hero-stage[data-loop]');
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    revealItems.forEach((item) => item.classList.add('is-visible'));
    loopItems.forEach((item) => item.classList.add('is-live'));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -8%', threshold: 0.1 },
    );
    revealItems.forEach((item) => revealObserver.observe(item));

    const loopObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle('is-live', entry.isIntersecting);
        });
      },
      { rootMargin: '10% 0px' },
    );
    loopItems.forEach((item) => loopObserver.observe(item));
    observers.push(revealObserver, loopObserver);
  }

  document.querySelectorAll('[data-squash]').forEach((control) => {
    control.addEventListener(
      'pointerdown',
      () => control.classList.add('is-pressed'),
      { signal },
    );
    ['pointerup', 'pointercancel', 'pointerleave'].forEach((eventName) => {
      control.addEventListener(
        eventName,
        () => control.classList.remove('is-pressed'),
        { signal },
      );
    });
  });

  const mobileMenuButton = document.querySelector<HTMLButtonElement>(
    '.mobile-menu-button',
  );
  const mobileMenu = document.querySelector<HTMLElement>('#mobile-menu');
  if (mobileMenuButton && mobileMenu) {
    const closeMobileMenu = () => {
      mobileMenuButton.setAttribute('aria-expanded', 'false');
      mobileMenu.hidden = true;
    };
    mobileMenuButton.addEventListener(
      'click',
      () => {
        const isOpen =
          mobileMenuButton.getAttribute('aria-expanded') === 'true';
        mobileMenuButton.setAttribute('aria-expanded', String(!isOpen));
        mobileMenu.hidden = isOpen;
        if (!isOpen) mobileMenu.querySelector('a')?.focus();
      },
      { signal },
    );
    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeMobileMenu, { signal });
    });
    document.addEventListener(
      'keydown',
      (event) => {
        if (event.key === 'Escape' && !mobileMenu.hidden) {
          closeMobileMenu();
          mobileMenuButton.focus();
        }
      },
      { signal },
    );
    document.addEventListener(
      'click',
      (event) => {
        if (
          !mobileMenu.hidden &&
          event.target instanceof Element &&
          !event.target.closest('.mobile-nav')
        ) {
          closeMobileMenu();
        }
      },
      { signal },
    );
  }

  const caseNav = document.querySelector<HTMLElement>('.case-nav');
  const sectionLinks = Array.from(
    document.querySelectorAll<HTMLAnchorElement>('.case-nav a[href^="#"]'),
  );
  if (caseNav && sectionLinks.length) {
    // When the strip is a single scrolling row, keep the current link in view.
    const revealLink = (link: HTMLAnchorElement) => {
      if (caseNav.scrollWidth - caseNav.clientWidth < 8) return;
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
      caseNav.scrollTo({
        left: link.offsetLeft - (caseNav.clientWidth - link.offsetWidth) / 2,
        behavior: reduced.matches ? 'auto' : 'smooth',
      });
    };
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (!visible[0]) return;
        sectionLinks.forEach((link) => {
          if (link.hash === `#${visible[0].target.id}`) {
            if (!link.hasAttribute('aria-current')) revealLink(link);
            link.setAttribute('aria-current', 'true');
          } else {
            link.removeAttribute('aria-current');
          }
        });
      },
      { rootMargin: '-35% 0px -55% 0px' },
    );
    sectionLinks.forEach((link) => {
      const target = document.getElementById(
        decodeURIComponent(link.hash.slice(1)),
      );
      if (target) sectionObserver.observe(target);
    });
    observers.push(sectionObserver);
  }
});
