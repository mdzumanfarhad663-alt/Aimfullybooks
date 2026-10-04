/* ==========================================================================
   Boundless Backer: legal pages TOC + back to top
   --------------------------------------------------------------------------
   1. TOC: links come from the H2s (built into the HTML); highlight follows
      the section being read.
   2. Mobile: "On this page" bar opens/closes the TOC.
   3. Back to top button appears after scrolling.
   WordPress: Elementor Table of Contents widget (anchors from H2, sticky).
   ========================================================================== */
(() => {
  const toc = document.querySelector('.legal-toc');
  if (!toc) return;
  const links = [...toc.querySelectorAll('a[href^="#"]')];
  const heads = links.map((a) => document.getElementById(a.getAttribute('href').slice(1))).filter(Boolean);
  const topBtn = document.querySelector('.legal-top');

  let ticking = false;
  const update = () => {
    ticking = false;
    const line = window.innerHeight * 0.3;
    let current = -1;
    heads.forEach((h, i) => { if (h.getBoundingClientRect().top <= line) current = i; });
    links.forEach((a, i) => {
      a.classList.toggle('is-active', i === current);
      if (i === current) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current');
    });
    if (topBtn) topBtn.classList.toggle('is-visible', window.scrollY > 600);
  };
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', update, { passive: true });
  update();

  const toggle = toc.querySelector('.legal-toc-toggle');
  const setOpen = (open) => { toc.classList.toggle('is-open', open); toggle.setAttribute('aria-expanded', String(open)); };
  toggle.addEventListener('click', () => setOpen(!toc.classList.contains('is-open')));
  links.forEach((a) => a.addEventListener('click', () => setOpen(false)));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && toc.classList.contains('is-open')) { setOpen(false); toggle.focus(); }
  });
})();
