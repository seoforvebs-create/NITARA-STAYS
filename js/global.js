/* ============================================================
   NITARA STAYS — Global JS
   ============================================================ */

/* ─── Page Loader ─── */
window.addEventListener('load', () => {
  const loader = document.getElementById('page-loader');
  if (loader) {
    setTimeout(() => loader.classList.add('hidden'), 600);
  }
});

/* ─── Navbar Scroll ─── */
(function () {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  function updateNav() {
    if (window.scrollY > 60) {
      navbar.classList.remove('transparent');
      navbar.classList.add('solid');
    } else {
      navbar.classList.remove('solid');
      navbar.classList.add('transparent');
    }
  }
  updateNav();
  window.addEventListener('scroll', updateNav, { passive: true });
})();

/* ─── Mobile Menu ─── */
(function () {
  const hamburger = document.getElementById('nav-hamburger');
  const panel     = document.getElementById('nav-mobile-panel');
  const overlay   = document.getElementById('nav-overlay');
  if (!hamburger || !panel) return;

  function openMenu() {
    hamburger.classList.add('open');
    panel.classList.add('open');
    if (overlay) overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  function closeMenu() {
    hamburger.classList.remove('open');
    panel.classList.remove('open');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
  }
  hamburger.addEventListener('click', () => {
    panel.classList.contains('open') ? closeMenu() : openMenu();
  });
  if (overlay) overlay.addEventListener('click', closeMenu);
  panel.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
})();

/* ─── Scroll-to-Top ─── */
(function () {
  const btn = document.getElementById('scroll-top');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 300);
  }, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();

/* ─── Reveal on Scroll (IntersectionObserver) ─── */
(function () {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  els.forEach(el => observer.observe(el));
})();

/* ─── Active Nav Link ─── */
(function () {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .nav-mobile-panel a').forEach(a => {
    const href = a.getAttribute('href') || '';
    if (href === page || (page === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
})();

/* ─── Toast Notification ─── */
window.showToast = function (msg, duration = 3500) {
  let toast = document.getElementById('global-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'global-toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), duration);
};
