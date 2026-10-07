(() => {
  class GlobalHeader extends HTMLElement {
    connectedCallback() {
      const currentFile = window.location.pathname.split('/').pop() || 'index.html';
      const active = (file) => currentFile === file ? ' class="active" aria-current="page"' : '';

      this.innerHTML = `
        <a class="brand" href="./index.html" aria-label="Boundless Backer home">
          <img class="brand-logo" src="./assets/BoundlessBacker_PrimaryLogo_Main.svg" alt="Boundless Backer" width="210" height="88" />
        </a>
        <nav aria-label="Primary navigation">
          <a${active('index.html')} href="./index.html">Home</a>
          <div class="nav-shop">
            <a${active('shop.html')} href="./shop.html" aria-haspopup="true">Shop</a>
            <div class="mega-menu" aria-label="Shop categories">
              <div><p class="mega-heading">Browse the shelf</p><a href="./shop.html#catalog">All titles <span aria-hidden="true">→</span></a><a href="./shop.html?stage=raising#catalog">Raising funds <span aria-hidden="true">→</span></a><a href="./shop.html?stage=funded#catalog">Funded &amp; in stock <span aria-hidden="true">→</span></a></div>
              <div><p class="mega-heading">Shop by category</p><a href="./shop.html?category=coloring-books#catalog">Coloring Books <span aria-hidden="true">→</span></a><a href="./shop.html?category=childrens-books#catalog">Children's Books <span aria-hidden="true">→</span></a><a href="./shop.html?category=comic-books#catalog">Comic Books <span aria-hidden="true">→</span></a><a href="./shop.html?category=illustrated-books#catalog">Illustrated Books <span aria-hidden="true">→</span></a><a href="./shop.html?category=world-books#catalog">World Books <span aria-hidden="true">→</span></a><a href="./shop.html?category=art-supplies#catalog">Art Supplies <span aria-hidden="true">→</span></a><a href="./shop.html?category=printables#catalog">Printables <span aria-hidden="true">→</span></a></div>
            </div>
          </div>
          <a${active('how-it-works.html')} href="./how-it-works.html">How It Works</a>
          <a${active('sponsored-journeys.html')} href="./sponsored-journeys.html">Sponsored Journeys</a>
          <a${active('about.html')} href="./about.html">About</a>
        </nav>
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
