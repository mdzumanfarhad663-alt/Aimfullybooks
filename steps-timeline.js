/* Home "From discovery to real impact" scroll-linked timeline.
   Gold line fill follows scroll; each step activates when the fill reaches its node. */
(function () {
  var list = document.querySelector('.steps-timeline');
  if (!list) return;
  var items = Array.prototype.slice.call(list.children);
  var nodes = items.map(function (li) { return li.querySelector('span'); });
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var centers = [], ticking = false, inView = false;

  function measure() {
    var top = list.getBoundingClientRect().top;
    centers = nodes.map(function (n) {
      var r = n.getBoundingClientRect();
      return r.top - top + r.height / 2;
    });
    var first = nodes[0].getBoundingClientRect();
    var listLeft = list.getBoundingClientRect().left;
    list.style.setProperty('--tl-top', centers[0] + 'px');
    list.style.setProperty('--tl-height', (centers[centers.length - 1] - centers[0]) + 'px');
    list.style.setProperty('--tl-left', (first.left - listLeft + first.width / 2) + 'px');
  }

  function update() {
    ticking = false;
    var span = centers[centers.length - 1] - centers[0];
    var fill;
    if (reduce.matches) {
      fill = span;
    } else {
      /* The draw point is 60% down the viewport. */
      var start = list.getBoundingClientRect().top + centers[0];
      fill = Math.min(Math.max(window.innerHeight * 0.6 - start, -1), span);
    }
    list.style.setProperty('--tl-progress', span > 0 ? Math.max(fill, 0) / span : 1);
    items.forEach(function (li, i) {
      li.classList.toggle('is-active', fill >= centers[i] - centers[0]);
    });
  }

  function request() {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }

  new IntersectionObserver(function (entries) {
    inView = entries[0].isIntersecting;
    if (inView) request();
  }, { rootMargin: '20% 0px' }).observe(list);

  window.addEventListener('scroll', function () { if (inView) request(); }, { passive: true });
  window.addEventListener('resize', function () { measure(); request(); });
  if (reduce.addEventListener) reduce.addEventListener('change', request);
  window.addEventListener('load', function () { measure(); request(); });

  measure();
  list.classList.add('is-ready');
  update();
})();
