(() => {
  const grid = document.querySelector('.shop-grid');
  if (!grid) return;

  const cards = [...grid.children];
  const filters = [...document.querySelectorAll('[data-catalog-filter]')];
  const count = document.querySelector('.woocommerce-result-count');
  const empty = document.querySelector('.woocommerce-info');
  const filterEmpty = document.querySelector('.filter-empty-note');

  function setCount(visible) {
    count.textContent = visible === 1 ? 'Showing the single result' : `Showing all ${visible} results`;
    count.hidden = visible === 0;
    empty.hidden = true;
    filterEmpty.hidden = visible !== 0;
  }

  function applyFilters() {
    const selected = Object.fromEntries(filters.map((filter) => [filter.dataset.catalogFilter, filter.value]));
    let visible = 0;

    cards.forEach((card) => {
      const categories = (card.dataset.category || '').split('|');
      const match = Object.entries(selected).every(([key, value]) => {
        if (value === 'all') return true;
        return key === 'category' ? categories.includes(value) : card.dataset[key] === value;
      });
      card.hidden = !match;
      if (match) visible++;
    });

    setCount(visible);
  }

  filters.forEach((filter) => filter.addEventListener('change', applyFilters));

  const params = new URLSearchParams(window.location.search);
  const legacyCategories = { 'street-art': 'coloring-books' };
  const categoryParam = params.get('category');
  const requested = {
    stage: params.get('stage'),
    category: legacyCategories[categoryParam] || categoryParam,
  };
  filters.forEach((filter) => {
    const value = requested[filter.dataset.catalogFilter];
    if (value && [...filter.options].some((option) => option.value === value)) filter.value = value;
  });
  applyFilters();

  document.getElementById('orderby').addEventListener('change', (event) => {
    const mode = event.target.value;
    const byOrder = (a, b) => Number(a.dataset.order) - Number(b.dataset.order);
    const sorted = [...cards].sort((a, b) => mode === 'price'
      ? Number(a.dataset.price) - Number(b.dataset.price) || byOrder(a, b)
      : mode === 'price-desc'
        ? Number(b.dataset.price) - Number(a.dataset.price) || byOrder(a, b)
        : byOrder(a, b));
    sorted.forEach((card) => grid.appendChild(card));
  });

  document.querySelectorAll('.add-to-cart').forEach((button) => {
    button.addEventListener('click', () => {
      button.textContent = 'Added to cart';
      window.setTimeout(() => { button.textContent = 'Add to cart'; }, 2000);
    });
  });

  const covers = document.querySelector('.hero-covers');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (covers && !reduceMotion.matches) {
    const coverImages = [...covers.querySelectorAll('img')];
    const speeds = [1, 0.72, 0.46];
    let scheduled = false;
    window.addEventListener('scroll', () => {
      if (scheduled) return;
      scheduled = true;
      window.requestAnimationFrame(() => {
        const shift = Math.min(window.scrollY * 0.035, 24);
        coverImages.forEach((image, index) => { image.style.transform = `translateY(${shift * speeds[index]}px)`; });
        scheduled = false;
      });
    }, { passive: true });
  }
})();
