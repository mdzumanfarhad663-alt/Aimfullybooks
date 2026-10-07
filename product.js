/* ==========================================================================
   Boundless Backer: single product template behaviour (prototype only)
   --------------------------------------------------------------------------
   In WordPress these come from WooCommerce / Elementor / plugins:
   gallery = Product Images widget, variations + price = WooCommerce
   add-to-cart-variation.js, +/- = Plus Minus Button plugin, tabs = Elementor
   Nested Tabs, review form = CusRev. Without JS everything stays visible.
   ========================================================================== */
(() => {
  const pd = document.querySelector('.pd');
  if (!pd) return;

  /* --- Gallery: thumbnails switch the main image (arrow keys move focus) --- */
  const slides = [...pd.querySelectorAll('.pd-main-img')];
  const thumbs = [...pd.querySelectorAll('.pd-thumb')];
  const show = (i) => {
    slides.forEach((s, k) => (s.hidden = k !== i));
    thumbs.forEach((t, k) => t.setAttribute('aria-pressed', String(k === i)));
  };
  const setVariationGallery = (variation) => {
    const configuredImages = Array.isArray(variation?.images)
      ? variation.images
      : Number.isInteger(variation?.image) && variation.image >= 0
        ? [variation.image]
        : null;
    slides.forEach((slide, index) => {
      slide.hidden = configuredImages ? !configuredImages.includes(index) : index !== 0;
      if (thumbs[index]) thumbs[index].closest('li').hidden = Boolean(configuredImages && !configuredImages.includes(index));
    });
    if (configuredImages?.length) show(configuredImages[0]);
    else show(0);
  };
  thumbs.forEach((t, i) => {
    t.addEventListener('click', () => show(i));
    t.addEventListener('keydown', (e) => {
      const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (!d) return;
      e.preventDefault();
      const n = (i + d + thumbs.length) % thumbs.length;
      thumbs[n].focus(); show(n);
    });
  });

  /* --- Variations: price, SKU, dimensions, Add to cart state --- */
  const vars = JSON.parse(pd.dataset.variations || '{}');
  const select = pd.querySelector('#pd-version');
  const priceEl = pd.querySelector('.pd-price-value');
  const info = pd.querySelector('.pd-variation-info');
  const skuWrap = pd.querySelector('.pd-meta-sku');
  const sku = pd.querySelector('.pd-sku');
  const clear = pd.querySelector('.pd-clear');
  const add = pd.querySelector('.pd-add');
  const hint = pd.querySelector('.pd-hint');
  const update = () => {
    const v = vars[select.value];
    if (v) {
      priceEl.textContent = v.price;
      info.textContent = [v.dims, v.weight].filter(Boolean).join(' · ');
      sku.textContent = v.sku || '';
      skuWrap.hidden = !v.sku;
      setVariationGallery(v);
    } else {
      priceEl.textContent = priceEl.dataset.range;
      info.textContent = '';
      skuWrap.hidden = true;
      setVariationGallery(null);
    }
    clear.hidden = !select.value;
    add.setAttribute('aria-disabled', String(!v));
    hint.textContent = v ? '' : 'Choose an option to add this book to your cart.';
  };
  select.addEventListener('change', update);
  clear.addEventListener('click', () => { select.value = ''; update(); select.focus(); });
  update();

  /* Keep stage-specific campaign copy tied to the product's CMS status. */
  const stageCopy = pd.querySelector('.pd-stage-copy');
  if (stageCopy) stageCopy.textContent = stageCopy.dataset[pd.dataset.productStatus] || stageCopy.dataset.funded;

  /* Share the product URL using the device share sheet, with clipboard fallback. */
  const share = pd.querySelector('.pd-share');
  share?.addEventListener('click', async () => {
    const payload = { title: document.title, text: 'Good choice. Rally your tribe. Share The Brooklyn Coloring Book.', url: window.location.href };
    try {
      if (navigator.share) await navigator.share(payload);
      else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(payload.url);
        share.innerHTML = 'Link copied <span aria-hidden="true">✓</span>';
        setTimeout(() => { share.innerHTML = 'Share it with your friends <span aria-hidden="true">→</span>'; }, 2200);
      } else {
        window.prompt('Copy this link to share:', payload.url);
      }
    } catch (error) {
      if (error.name !== 'AbortError') window.prompt('Copy this link to share:', payload.url);
    }
  });

  /* --- Quantity +/- (min 1) --- */
  const qty = pd.querySelector('#pd-qty');
  pd.querySelectorAll('.pd-qty-btn').forEach((b) => b.addEventListener('click', () => {
    qty.value = Math.max(1, (parseInt(qty.value, 10) || 1) + Number(b.dataset.step));
  }));

  /* --- Add to cart: like the Shop page's "Added to cart" state --- */
  pd.querySelector('.pd-form').addEventListener('submit', (e) => {
    e.preventDefault();
    if (add.getAttribute('aria-disabled') === 'true') { hint.textContent = 'Please choose an option first.'; select.focus(); return; }
    add.textContent = 'Added to cart';
    setTimeout(() => { add.textContent = 'Add to cart'; }, 2000);
  });

  /* --- Tabs (desktop) + accordion (mobile), same panels --- */
  const tabs = [...pd.querySelectorAll('.pd-tab')];
  const panels = [...pd.querySelectorAll('.pd-panel')];
  const triggers = [...pd.querySelectorAll('.pd-acc-trigger')];
  const select_tab = (i, focus) => {
    const selectedPanelId = tabs[i].getAttribute('aria-controls');
    tabs.forEach((t, k) => { t.setAttribute('aria-selected', String(k === i)); t.tabIndex = k === i ? 0 : -1; });
    panels.forEach((p) => (p.hidden = p.id !== selectedPanelId));
    triggers.forEach((t) => t.setAttribute('aria-expanded', String(t.getAttribute('aria-controls') === selectedPanelId)));
    if (focus) tabs[i].focus();
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => select_tab(i));
    t.addEventListener('keydown', (e) => {
      const map = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 };
      if (!(e.key in map)) return;
      e.preventDefault();
      select_tab((map[e.key] + tabs.length) % tabs.length, true);
    });
  });
  triggers.forEach((t) => t.addEventListener('click', () => {
    const open = t.getAttribute('aria-expanded') === 'true';
    t.setAttribute('aria-expanded', String(!open));
    const panel = document.getElementById(t.getAttribute('aria-controls'));
    if (panel) panel.hidden = open;
  }));
  pd.classList.add('tabs-ready');
  select_tab(0);
  // "Rated … Based on N reviews" link opens the Reviews tab.
  pd.querySelector('.pd-rating-link')?.addEventListener('click', () => select_tab(tabs.length - 1));

  /* --- "See More" (collapsed extra content, as on staging) --- */
  pd.querySelectorAll('.pd-seemore').forEach((b) => {
    const more = document.getElementById(b.getAttribute('aria-controls'));
    more.hidden = true; b.hidden = false;
    b.addEventListener('click', () => {
      const open = b.getAttribute('aria-expanded') === 'true';
      b.setAttribute('aria-expanded', String(!open));
      more.hidden = open;
      b.textContent = open ? 'See More' : 'See Less';
    });
  });

  /* --- CusRev "Add a review" form (front-end only) --- */
  const addReview = pd.querySelector('.pd-add-review');
  const form = pd.querySelector('.pd-review-form');
  if (addReview && form) {
    const status = form.querySelector('.pd-form-status');
    const toggle = (open) => { form.hidden = !open; addReview.setAttribute('aria-expanded', String(open)); if (open) form.querySelector('input,textarea').focus(); };
    addReview.addEventListener('click', () => toggle(form.hidden));
    form.querySelector('.pd-cancel').addEventListener('click', () => { toggle(false); addReview.focus(); });
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const bad = [...form.querySelectorAll('[required]')].find((el) => !el.checkValidity());
      if (bad) { status.textContent = 'Please complete all required fields.'; status.className = 'pd-form-status is-error'; bad.focus(); return; }
      status.textContent = 'Thank you! Your review has been submitted.';
      status.className = 'pd-form-status is-success';
      form.reset();
    });
  }
})();
