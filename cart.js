/* ==========================================================================
   Boundless Backer: cart demo behavior (prototype only)
   --------------------------------------------------------------------------
   Quantity stepper, remove + undo, live totals, empty state (?empty=1),
   coupon demo notice, mobile sticky checkout bar.
   WordPress: WooCommerce does all of this (update cart / AJAX fragments).
   Shipping and tax are never calculated here.
   ========================================================================== */
(() => {
  const list = document.querySelector('.cart-items');
  if (!list) return;
  const layout = document.querySelector('.cart-layout');
  const empty = document.querySelector('.cart-empty');
  const notice = document.querySelector('.cart-notice');
  const noticeText = notice.querySelector('.cart-notice-text');
  const undoBtn = notice.querySelector('.cart-notice-undo');
  const bar = document.querySelector('.cart-bar');
  const money = (n) => `$${n.toFixed(2)}`;
  let lastRemoved = null;

  const showNotice = (text, undo = false) => {
    noticeText.textContent = text;
    undoBtn.hidden = !undo;
    notice.hidden = false;
  };

  const update = () => {
    const items = [...list.querySelectorAll('.cart-item')];
    let subtotal = 0;
    let count = 0;
    items.forEach((item) => {
      const input = item.querySelector('.cart-qty-input');
      let qty = parseInt(input.value, 10);
      if (!Number.isFinite(qty) || qty < 1) qty = 1;
      if (qty > 99) qty = 99;
      input.value = qty;
      item.querySelector('[data-step="-1"]').disabled = qty <= 1;
      const line = Number(item.dataset.price) * qty;
      item.querySelector('.cart-line-amount').textContent = money(line);
      subtotal += line;
      count += qty;
    });
    document.querySelectorAll('.cart-subtotal, .cart-total, .cart-bar-subtotal').forEach((el) => { el.textContent = money(subtotal); });
    document.querySelector('.cart-items-count').textContent = count;
    document.querySelector('.cart-items-word').textContent = count === 1 ? 'item' : 'items';
    // Header badge (WordPress: Menu Cart widget fragment).
    const badge = document.querySelector('.cart-count');
    if (badge) {
      badge.textContent = count;
      badge.hidden = count === 0;
      badge.parentElement.setAttribute('aria-label', `Cart, ${count} ${count === 1 ? 'item' : 'items'}`);
    }
    const isEmpty = items.length === 0;
    layout.hidden = isEmpty;
    empty.hidden = !isEmpty;
    if (bar) bar.hidden = isEmpty;
  };

  list.addEventListener('click', (e) => {
    const step = e.target.closest('.cart-qty-btn');
    if (step) {
      const input = step.parentElement.querySelector('.cart-qty-input');
      input.value = (parseInt(input.value, 10) || 1) + Number(step.dataset.step);
      update();
      return;
    }
    const remove = e.target.closest('.cart-remove');
    if (remove) {
      const item = remove.closest('.cart-item');
      lastRemoved = { item, next: item.nextElementSibling };
      item.remove();
      update();
      // WooCommerce wording: “Product” removed. Undo?
      showNotice(`“${item.dataset.name}” removed.`, true);
      (list.querySelector('.cart-remove') || document.querySelector('.cart-empty .button') || undoBtn).focus();
    }
  });
  list.addEventListener('change', (e) => { if (e.target.matches('.cart-qty-input')) update(); });

  undoBtn.addEventListener('click', () => {
    if (!lastRemoved) return;
    list.insertBefore(lastRemoved.item, lastRemoved.next && lastRemoved.next.isConnected ? lastRemoved.next : null);
    lastRemoved.item.querySelector('.cart-remove').focus();
    lastRemoved = null;
    notice.hidden = true;
    update();
  });

  const coupon = document.querySelector('.cart-coupon-form');
  if (coupon) {
    coupon.addEventListener('submit', (e) => {
      e.preventDefault();
      showNotice('Demo only: coupons are applied by WooCommerce on the live site.');
    });
  }
  const calc = document.querySelector('.cart-calc-form');
  if (calc) {
    calc.addEventListener('submit', (e) => {
      e.preventDefault();
      showNotice('Demo only: shipping is calculated by WooCommerce on the live site.');
    });
  }

  // Empty-state preview: cart.html?empty=1
  if (new URLSearchParams(location.search).get('empty') === '1') list.innerHTML = '';

  // Mobile bar: hide once the real checkout button is on screen.
  const checkout = document.getElementById('cart-checkout');
  if (bar && checkout && 'IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => bar.classList.toggle('is-hidden', entry.isIntersecting)).observe(checkout);
  }

  update();
})();
