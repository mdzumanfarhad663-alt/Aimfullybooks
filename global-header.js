(() => {
  const pages = [
    { href: './shop.html', label: 'Shop', file: 'shop.html' },
    { href: './how-it-works.html', label: 'How It Works', file: 'how-it-works.html' },
    { href: './resources.html', label: 'Resources', file: 'resources.html' },
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
          <button class="search" type="button" aria-label="Search">Search</button>
          <a class="button button-gold small" href="./shop.html">Fund a Book</a>
        </div>
      `;
    }
  }

  if (!customElements.get('global-site-header')) {
    customElements.define('global-site-header', GlobalHeader);
  }
})();
