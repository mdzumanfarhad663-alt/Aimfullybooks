/* ==========================================================================
   Boundless Backer: blog archive category filter (prototype only)
   --------------------------------------------------------------------------
   WordPress: the Elementor Taxonomy Filter widget does this for the Loop Grid.
   Pills are real <button>s, so Tab / Enter / Space work without extra code.
   ========================================================================== */
(() => {
  const grid = document.querySelector('.blog-grid');
  if (!grid) return;
  const cards = [...grid.querySelectorAll('.blog-card')];
  const pills = [...document.querySelectorAll('.blog-filters .filter')];
  const count = document.querySelector('.blog-count');
  const empty = document.querySelector('.blog-empty');
  const pagination = document.querySelector('.blog-pagination');

  const apply = (filter) => {
    let shown = 0;
    cards.forEach((card) => {
      const match = filter === 'all' || card.dataset.category.split(' ').includes(filter);
      card.hidden = !match;
      if (match) shown++;
    });
    count.textContent = shown === 1 ? 'Showing 1 post' : `Showing ${filter === 'all' ? 'all ' : ''}${shown} posts`;
    count.hidden = shown === 0;
    empty.hidden = shown !== 0; // category with no cards: message instead of an empty grid
    grid.hidden = shown === 0;
    if (pagination) pagination.hidden = filter !== 'all'; // static pagination only makes sense for "All"
  };

  pills.forEach((pill) => {
    pill.addEventListener('click', () => {
      pills.forEach((p) => p.setAttribute('aria-pressed', String(p === pill)));
      apply(pill.dataset.filter);
    });
  });

  /* Prototype newsletter confirmation (Elementor Form + Mailchimp in WordPress). */
  const form = document.querySelector('.resources-newsletter form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const note = form.querySelector('.form-note');
      note.textContent = 'Thank you. Your first lesson is on its way.';
      note.classList.add('form-success');
      note.setAttribute('role', 'status');
    });
  }
})();
