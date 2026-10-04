/* ==========================================================================
   Boundless Backer: My Account panel switching (DESIGN ONLY)
   --------------------------------------------------------------------------
   Shows one endpoint panel at a time from the URL hash (#orders etc.), so
   each view can be linked. #login shows the logged-out view.
   WordPress: each endpoint is a real URL (/my-account/orders/ ...).
   ========================================================================== */
(() => {
  const layout = document.querySelector('.acc-layout');
  const auth = document.querySelector('.acc-auth');
  const panels = [...document.querySelectorAll('.acc-panel')];
  const links = [...document.querySelectorAll('.acc-nav-link')];
  if (!layout || !panels.length) return;
  const views = panels.map((p) => p.dataset.panel);

  const show = (view, focus) => {
    if (view === 'login') {
      layout.hidden = true;
      auth.hidden = false;
      if (focus) auth.querySelector('h2').focus({ preventScroll: true });
      return;
    }
    if (!views.includes(view)) view = 'dashboard';
    layout.hidden = false;
    auth.hidden = true;
    panels.forEach((p) => { p.hidden = p.dataset.panel !== view; });
    links.forEach((l) => {
      const on = l.dataset.view === view;
      l.classList.toggle('is-active', on);
      if (on) l.setAttribute('aria-current', 'page'); else l.removeAttribute('aria-current');
      if (on && l.scrollIntoView && window.matchMedia('(max-width: 960px)').matches) {
        l.scrollIntoView({ block: 'nearest', inline: 'center' }); // keep the active tab visible in the mobile tab bar
      }
    });
    if (focus) {
      const h = document.getElementById(view).querySelector('h2');
      h.setAttribute('tabindex', '-1');
      h.focus({ preventScroll: true });
    }
  };

  // Headings receive focus after a switch (screen readers announce the new view).
  auth.querySelector('h2').setAttribute('tabindex', '-1');

  const fromHash = (focus) => show(location.hash.replace('#', '') || 'dashboard', focus);
  window.addEventListener('hashchange', () => fromHash(true));
  fromHash(false);
})();
