/* ============================================================
   NITARA STAYS — About Page JS
   ============================================================ */

/* ─── Animated Stat Counters ─── */
(function () {
  const statCards = document.querySelectorAll('.stat-card');
  if (!statCards.length) return;

  function animateCounter(el, target, duration) {
    const numEl = el.querySelector('em');
    if (!numEl) return;
    let start = 0;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { start = target; clearInterval(timer); }
      numEl.textContent = Number(start).toLocaleString('en-IN');
    }, 16);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const card   = entry.target;
      const numEl  = card.querySelector('.stat-number');
      if (!numEl) return;
      const target = parseInt(numEl.dataset.target, 10) || 0;
      animateCounter(card, target, 1800);
      observer.unobserve(card);
    });
  }, { threshold: 0.4 });

  statCards.forEach(card => observer.observe(card));
})();
