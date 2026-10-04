/* ==========================================================================
   Boundless Backer: single blog post behavior (vanilla JS, no dependencies)
   --------------------------------------------------------------------------
   1. TOC highlight  - marks the TOC link for the section being read.
   2. Mobile TOC     - "Contents" bar opens/closes the list.
   3. Video facade   - YouTube iframe loads only after a click.
   4. Sign-up forms  - prototype confirmation (Elementor Form + Mailchimp in WP).
   WordPress: enqueue on the Single Post template only.
   ========================================================================== */
(() => {
  const toc = document.querySelector('.bp-toc');
  const links = toc ? [...toc.querySelectorAll('a[href^="#"]')] : [];

  /* 1. TOC highlight ------------------------------------------------------ */
  const targets = links
    .map((link) => ({ link, el: document.getElementById(link.getAttribute('href').slice(1)) }))
    .filter((t) => t.el);
  const lessonTargets = targets.filter((t) => t.el.matches('.bp-lesson'));
  const partTargets = targets.filter((t) => t.el.matches('.bp-part-head'));

  let ticking = false;
  const update = () => {
    ticking = false;
    const line = window.innerHeight * 0.3; // a heading counts as "current" once it passes 30% of the viewport
    const current = (list) => {
      let found = null;
      for (const t of list) {
        if (t.el.getBoundingClientRect().top <= line) found = t;
        else break;
      }
      return found;
    };
    const lesson = current(lessonTargets);
    const part = current(partTargets);
    links.forEach((l) => {
      l.classList.remove('is-active');
      l.removeAttribute('aria-current');
    });
    // A lesson only counts if it belongs to the current part (it comes after the part heading).
    if (part) part.link.classList.add('is-active');
    if (lesson && (!part || part.el.compareDocumentPosition(lesson.el) & Node.DOCUMENT_POSITION_FOLLOWING)) {
      lesson.link.classList.add('is-active');
      lesson.link.setAttribute('aria-current', 'location');
    } else if (part) {
      part.link.setAttribute('aria-current', 'location');
    }
  };
  if (targets.length) {
    window.addEventListener('scroll', () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    update();
  }

  /* 2. Mobile TOC --------------------------------------------------------- */
  const toggle = toc && toc.querySelector('.bp-toc-toggle');
  if (toggle) {
    const setOpen = (open) => {
      toc.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
    };
    toggle.addEventListener('click', () => setOpen(!toc.classList.contains('is-open')));
    links.forEach((l) => l.addEventListener('click', () => setOpen(false)));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && toc.classList.contains('is-open')) {
        setOpen(false);
        toggle.focus();
      }
    });
  }

  /* 3. Video facade ------------------------------------------------------- */
  document.querySelectorAll('.bp-video-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const iframe = document.createElement('iframe');
      iframe.src = `https://www.youtube-nocookie.com/embed/${btn.dataset.videoId}?autoplay=1&rel=0`;
      iframe.title = btn.getAttribute('aria-label').replace('Play video: ', '');
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      iframe.allowFullscreen = true;
      btn.replaceWith(iframe);
      iframe.focus();
    });
  });

  /* 4. Sign-up forms (prototype only) ------------------------------------- */
  document.querySelectorAll('.bp-signup-form').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const note = form.querySelector('.form-note');
      note.textContent = 'Thank you. Your first lesson is on its way.';
      note.classList.add('form-success');
      note.setAttribute('role', 'status');
    });
  });
})();
