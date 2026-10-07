/* Home reviews carousel: plain JS, loops, autoplay pauses on hover/focus. */
(function () {
  var root = document.querySelector('.review-slider');
  if (!root) return;
  var track = root.querySelector('.review-track');
  var viewport = root.querySelector('.review-viewport');
  var cards = Array.prototype.slice.call(track.children);
  var dotsWrap = root.querySelector('.review-dots');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var index = 0, timer = null, hoverPaused = false, focusPaused = false;

  function perView() {
    var w = window.innerWidth;
    return w >= 1024 ? 3 : w >= 640 ? 2 : 1;
  }
  function pages() { return Math.max(1, cards.length - perView() + 1); }

  function buildDots() {
    dotsWrap.innerHTML = '';
    for (var i = 0; i < pages(); i++) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'review-dot';
      b.setAttribute('aria-label', 'Show review ' + (i + 1));
      b.addEventListener('click', go.bind(null, i));
      dotsWrap.appendChild(b);
    }
  }

  function go(i) {
    var n = pages();
    index = (i + n) % n;
    var offset = cards[index].offsetLeft - cards[0].offsetLeft;
    track.style.transform = 'translateX(' + -offset + 'px)';
    var pv = perView();
    cards.forEach(function (c, k) {
      var visible = k >= index && k < index + pv;
      c.setAttribute('aria-hidden', visible ? 'false' : 'true');
      c.querySelectorAll('button').forEach(function (b) { b.tabIndex = visible ? 0 : -1; });
    });
    Array.prototype.forEach.call(dotsWrap.children, function (d, k) {
      d.setAttribute('aria-current', k === index ? 'true' : 'false');
    });
  }

  function start() {
    stop();
    if (reduce.matches || hoverPaused || focusPaused) return;
    timer = setInterval(function () { go(index + 1); }, 4000);
  }
  function stop() { clearInterval(timer); timer = null; }
  function syncAutoplay() { if (hoverPaused || focusPaused || reduce.matches) stop(); else start(); }

  /* Clamp long reviews; reveal "Read more" only when text overflows. */
  function setupClamp() {
    cards.forEach(function (c) {
      var text = c.querySelector('.review-text');
      var more = c.querySelector('.review-more');
      if (c.classList.contains('is-expanded')) return;
      more.hidden = text.scrollHeight <= text.clientHeight + 2;
    });
  }
  cards.forEach(function (c) {
    var more = c.querySelector('.review-more');
    more.addEventListener('click', function () {
      var open = c.classList.toggle('is-expanded');
      more.setAttribute('aria-expanded', open ? 'true' : 'false');
      more.textContent = open ? 'Read less' : 'Read more';
    });
  });

  root.querySelector('.review-prev').addEventListener('click', function () { go(index - 1); });
  root.querySelector('.review-next').addEventListener('click', function () { go(index + 1); });
  root.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(index - 1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); go(index + 1); }
  });
  root.addEventListener('mouseenter', function () { hoverPaused = true; syncAutoplay(); });
  root.addEventListener('mouseleave', function () { hoverPaused = false; syncAutoplay(); });
  root.addEventListener('focusin', function () { focusPaused = true; syncAutoplay(); });
  root.addEventListener('focusout', function (e) {
    if (!root.contains(e.relatedTarget)) { focusPaused = false; syncAutoplay(); }
  });

  var startX = null;
  viewport.addEventListener('touchstart', function (e) { hoverPaused = true; syncAutoplay(); startX = e.touches[0].clientX; }, { passive: true });
  viewport.addEventListener('touchend', function (e) {
    if (startX === null) return;
    var dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) go(dx < 0 ? index + 1 : index - 1);
    startX = null;
    hoverPaused = false;
    syncAutoplay();
  });

  var lastPv = perView();
  window.addEventListener('resize', function () {
    if (perView() !== lastPv) { lastPv = perView(); buildDots(); }
    go(Math.min(index, pages() - 1));
    setupClamp();
  });
  if (reduce.addEventListener) reduce.addEventListener('change', syncAutoplay);

  buildDots();
  go(0);
  setupClamp();
  start();
})();
