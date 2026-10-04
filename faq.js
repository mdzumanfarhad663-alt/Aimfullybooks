/* ==========================================================================
   Boundless Backer: FAQ accordion, search and topic pills
   --------------------------------------------------------------------------
   One answer open at a time, animated height, aria-expanded/aria-controls.
   Search filters questions live; pills filter by topic. Both combine.
   WordPress: Elementor Accordion handles open/close; search + pills are an
   optional small snippet (or skip them if the FAQ stays short).
   ========================================================================== */
(() => {
  const items = [...document.querySelectorAll('.faq-item')];
  if (!items.length) return;
  const groups = [...document.querySelectorAll('.faq-group')];
  const pills = [...document.querySelectorAll('.faq-pills .filter')];
  const search = document.getElementById('faq-search');
  const empty = document.querySelector('.faq-empty');
  const count = document.querySelector('.faq-count');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Accordion ------------------------------------------------------------- */
  const setOpen = (item, open) => {
    const btn = item.querySelector('.faq-q button');
    const panel = item.querySelector('.faq-a');
    if (open === (btn.getAttribute('aria-expanded') === 'true')) return;
    btn.setAttribute('aria-expanded', String(open));
    item.classList.toggle('is-open', open);
    if (reduce) { panel.hidden = !open; return; }
    if (open) {
      panel.hidden = false;
      const h = panel.scrollHeight;
      panel.style.height = '0px';
      requestAnimationFrame(() => { panel.style.height = `${h}px`; });
    } else {
      panel.style.height = `${panel.scrollHeight}px`;
      requestAnimationFrame(() => { panel.style.height = '0px'; });
    }
    // Finish on transitionend, with a timeout fallback (background tabs may skip transitions).
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      panel.style.height = '';
      if (!open && item.querySelector('.faq-q button').getAttribute('aria-expanded') === 'false') panel.hidden = true;
    };
    panel.addEventListener('transitionend', (e) => { if (e.propertyName === 'height') finish(); }, { once: true });
    setTimeout(finish, 400);
  };

  items.forEach((item) => {
    item.querySelector('.faq-q button').addEventListener('click', () => {
      const open = item.querySelector('.faq-q button').getAttribute('aria-expanded') !== 'true';
      if (open) items.forEach((other) => { if (other !== item) setOpen(other, false); });
      setOpen(item, open);
    });
  });

  /* Search + pills -------------------------------------------------------- */
  let topic = 'all';
  const apply = () => {
    const terms = search.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
    let shown = 0;
    groups.forEach((g) => {
      const inTopic = topic === 'all' || g.dataset.group === topic;
      let groupShown = 0;
      g.querySelectorAll('.faq-item').forEach((item) => {
        const match = inTopic && terms.every((t) => item.dataset.search.includes(t));
        item.hidden = !match;
        if (match) groupShown++;
      });
      g.hidden = groupShown === 0;
      shown += groupShown;
    });
    empty.hidden = shown !== 0;
    count.textContent = terms.length || topic !== 'all' ? `${shown} ${shown === 1 ? 'question' : 'questions'} found` : '';
  };

  search.addEventListener('input', apply);
  pills.forEach((pill) => {
    pill.addEventListener('click', () => {
      pills.forEach((p) => p.setAttribute('aria-pressed', String(p === pill)));
      topic = pill.dataset.filter;
      apply();
      if (topic !== 'all') {
        const first = document.querySelector(`.faq-group[data-group="${topic}"]`);
        if (first) first.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
      }
    });
  });
})();
