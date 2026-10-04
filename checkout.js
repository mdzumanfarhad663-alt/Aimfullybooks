/* ==========================================================================
   Boundless Backer: checkout demo toggles (DESIGN ONLY)
   --------------------------------------------------------------------------
   Ship-to-different-address, coupon, WooPay save-info, mobile order summary,
   payment method switching. No validation, no submission; Place order does
   nothing. WordPress: WooCommerce checkout scripts handle all of this.
   ========================================================================== */
(() => {
  // Checkbox that reveals a block (aria-controls).
  document.querySelectorAll('#ship_to_different, #woopay_save').forEach((box) => {
    const target = document.getElementById(box.getAttribute('aria-controls'));
    box.addEventListener('change', () => {
      target.hidden = !box.checked;
      box.setAttribute('aria-expanded', String(box.checked));
    });
  });

  // Button that reveals a block (aria-controls).
  const couponBtn = document.querySelector('.co-coupon .co-link');
  if (couponBtn) {
    couponBtn.addEventListener('click', () => {
      const form = document.getElementById(couponBtn.getAttribute('aria-controls'));
      const open = form.hidden;
      form.hidden = !open;
      couponBtn.setAttribute('aria-expanded', String(open));
      if (open) form.querySelector('input').focus();
    });
  }

  // Mobile "Show order summary" bar.
  const summaryBtn = document.querySelector('.co-summary-toggle');
  const order = document.getElementById('co-order');
  if (summaryBtn && order) {
    summaryBtn.addEventListener('click', () => {
      const open = !order.classList.contains('is-open');
      order.classList.toggle('is-open', open);
      summaryBtn.setAttribute('aria-expanded', String(open));
      summaryBtn.querySelector('.co-summary-toggle-label').textContent = open ? 'Hide order summary' : 'Show order summary';
    });
  }

  // Sticky summary: when the right column is taller than the viewport, use a
  // negative top so it scrolls to its end (Place order) and then sticks.
  const right = document.querySelector('.co-right');
  if (right) {
    const fit = () => {
      if (getComputedStyle(right).display === 'contents') return; // stacked layout
      right.style.top = `${Math.min(104, window.innerHeight - right.offsetHeight - 24)}px`;
    };
    window.addEventListener('resize', fit, { passive: true });
    new ResizeObserver(fit).observe(right);
    fit();
  }

  // Payment method radios: show the selected method's box.
  const methods = [...document.querySelectorAll('.co-method')];
  methods.forEach((li) => {
    li.querySelector('input[type="radio"]').addEventListener('change', () => {
      methods.forEach((m) => {
        const on = m === li;
        m.classList.toggle('is-selected', on);
        const body = m.querySelector('.co-method-body');
        if (body) body.hidden = !on;
      });
    });
  });
})();
