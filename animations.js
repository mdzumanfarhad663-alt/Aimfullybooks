/* ==========================================================================
   Boundless Backer: reusable motion helpers (vanilla JS, no dependencies)
   --------------------------------------------------------------------------
   1. Scroll reveal  - adds .is-visible to .reveal / .reveal-stagger once.
   2. Header state   - toggles .is-scrolled on .site-header.
   3. Count-up       - animates [data-count-to] numbers once when visible.
   WordPress: enqueue this file in the footer (or with defer), site-wide.
   ========================================================================== */
(() => {
  const root = document.documentElement;
  root.classList.add('js'); // enables the hidden "before reveal" states in animations.css

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* 1. Scroll reveal ------------------------------------------------------ */
  const revealTargets = document.querySelectorAll('.reveal, .reveal-stagger');

  // Give each stagger child its index so CSS can delay it (--i * --stagger-step).
  document.querySelectorAll('.reveal-stagger').forEach((group) => {
    [...group.children].forEach((child, i) => child.style.setProperty('--i', i));
  });

  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealTargets.forEach((el) => el.classList.add('is-visible'));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target); // reveal once only
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -5% 0px' }
    );
    revealTargets.forEach((el) => revealObserver.observe(el));
  }

  /* 2. Header state ------------------------------------------------------- */
  const header = document.querySelector('.site-header');
  if (header) {
    let ticking = false;
    const update = () => {
      header.classList.toggle('is-scrolled', window.scrollY > 24);
      ticking = false;
    };
    window.addEventListener(
      'scroll',
      () => {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(update);
        }
      },
      { passive: true }
    );
    update();
  }

  /* 3. Count-up ------------------------------------------------------------
     Markup: <span data-count-to="25000">25,000</span>. The final value is in
     the HTML, so without JS (or with reduced motion) the real number shows. */
  const counters = document.querySelectorAll('[data-count-to]');
  if (!reduceMotion && counters.length && 'IntersectionObserver' in window) {
    const format = (n) => n.toLocaleString('en-US');
    const run = (el) => {
      const target = Number(el.dataset.countTo);
      const duration = 1400;
      const start = performance.now();
      const step = (now) => {
        const t = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
        el.textContent = format(Math.round(target * eased));
        if (t < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    const countObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          run(entry.target);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach((el) => countObserver.observe(el));
  }
})();
