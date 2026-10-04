(() => {
  const pages = [
    { href: './shop.html', label: 'Shop', file: 'shop.html' },
    { href: './how-it-works.html', label: 'How It Works', file: 'how-it-works.html' },
    { href: './resources.html', label: 'Resources', file: 'resources.html' },
    { href: './blog.html', label: 'Blog', file: 'blog.html' },
    { href: './about.html', label: 'About', file: 'about.html' }
  ];

  class GlobalHeader extends HTMLElement {
    connectedCallback() {
      const currentFile = window.location.pathname.split('/').pop() || 'index.html';
      const navLinks = pages
        .map(({ href, label, file }) => {
          const active = currentFile === file;
          return `<a${active ? ' class="active" aria-current="page"' : ''} href="${href}">${label}</a>`;
        })
        .join('');

      this.innerHTML = `
        <a class="brand" href="./index.html" aria-label="Boundless Backer home">
          <span class="bookstack" aria-hidden="true"><i></i><i></i><i></i></span>
          <span>Boundless<br />Backer<span class="period">.</span></span>
        </a>
        <nav aria-label="Primary navigation">${navLinks}</nav>
        <div class="header-actions">
          <a class="button button-gold small" href="./shop.html">Fund a Book</a>
          <!-- Cart link + count badge. WordPress: Elementor Menu Cart widget prints the real count (WooCommerce fragments). Demo count below is a placeholder. -->
          <a class="cart-button" href="./cart.html" aria-label="Cart, 3 items" title="Cart"${currentFile === 'cart.html' ? ' aria-current="page"' : ''}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
              <path d="M3 3h2l2.4 11.2A2.25 2.25 0 0 0 9.6 16h8.2a2.25 2.25 0 0 0 2.2-1.7L22 7H6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
              <circle cx="10" cy="20" r="1.35" fill="currentColor"></circle>
              <circle cx="18" cy="20" r="1.35" fill="currentColor"></circle>
            </svg>
            <span class="cart-count" aria-hidden="true">3</span>
          </a>
        </div>
      `;
    }
  }

  if (!customElements.get('global-site-header')) {
    customElements.define('global-site-header', GlobalHeader);
  }
})();
