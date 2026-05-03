/* ============================================================
   NITARA STAYS — Gallery Page JS
   ============================================================ */

/* ─── Gallery Data ─── */
const GALLERY_ITEMS = [
  { index: 0,  src: 'https://www.genspark.ai/api/files/s/9dBT4k1w',  alt: 'Snow-covered Nitara villa — Mukteshwar winter',       cat: 'retreat',     title: 'Winter at The Dhanachuli House' },
  { index: 1,  src: 'https://www.genspark.ai/api/files/s/BzrQBgzk',  alt: 'Trekkers on snow-covered Himalayan slopes',           cat: 'landscape',   title: 'The High Trek — 3,200m' },
  { index: 2,  src: 'https://www.genspark.ai/api/files/s/3WTkihgw',  alt: 'Panoramic Himalayan range view',                      cat: 'landscape',   title: 'The Full Himalayan Arc' },
  { index: 3,  src: 'https://www.genspark.ai/api/files/s/aIdMy56z',  alt: 'Alpine forest trek — frozen lake in pine forest',     cat: 'experiences', title: 'Forest Trek — Frozen Lake Trail' },
  { index: 4,  src: 'https://www.genspark.ai/api/files/s/k6ltd7CC',  alt: 'Mountain valley — Kumaon Himalaya',                   cat: 'landscape',   title: 'The Valley Below' },
  { index: 5,  src: 'https://www.genspark.ai/api/files/s/9dBT4k1w',  alt: 'Private terrace with Himalayan view',                 cat: 'retreat',     title: 'The Morning Terrace' },
  { index: 6,  src: 'https://www.genspark.ai/api/files/s/3WTkihgw',  alt: 'First snowfall — Mukteshwar December',                cat: 'seasons',     title: 'First Snow — December' },
  { index: 7,  src: 'https://www.genspark.ai/api/files/s/aIdMy56z',  alt: 'Organic farm-to-table meal at Nitara',                cat: 'cuisine',     title: 'The Morning Thali' },
  { index: 8,  src: 'https://www.genspark.ai/api/files/s/BzrQBgzk',  alt: 'Himalayan sunrise — Nanda Devi in golden light',      cat: 'landscape',   title: 'Nanda Devi at Dawn' },
  { index: 9,  src: 'https://www.genspark.ai/api/files/s/k6ltd7CC',  alt: 'Stargazing session above the valley',                 cat: 'experiences', title: 'Under 10,000 Stars' },
  { index: 10, src: 'https://www.genspark.ai/api/files/s/aIdMy56z',  alt: 'Rhododendron forest in spring bloom',                 cat: 'seasons',     title: 'Rhododendron Season — April' },
  { index: 11, src: 'https://www.genspark.ai/api/files/s/9dBT4k1w',  alt: 'Warm interiors of Nitara mountain villa',             cat: 'retreat',     title: 'The Living Room at Dusk' },
];

/* ─── Filter Logic ─── */
(function () {
  const tabs    = document.querySelectorAll('.gallery-filter-tab');
  const items   = document.querySelectorAll('.gallery-item');
  const countEl = document.getElementById('gallery-count');
  const emptyEl = document.getElementById('gallery-empty');
  if (!tabs.length) return;

  function applyFilter(filter) {
    let visible = 0;
    items.forEach(item => {
      const cat = item.dataset.category;
      const show = filter === 'all' || cat === filter;
      item.classList.toggle('gallery-item--hidden', !show);
      item.setAttribute('aria-hidden', String(!show));
      if (show) visible++;
    });

    if (countEl) countEl.textContent = visible + ' Image' + (visible !== 1 ? 's' : '');
    if (emptyEl) emptyEl.hidden = visible > 0;
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      applyFilter(tab.dataset.filter);
    });
    tab.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); tab.click(); }
    });
  });

  applyFilter('all');
})();

/* ─── Lazy Loading with IntersectionObserver ─── */
(function () {
  const lazyImgs = document.querySelectorAll('.gallery-img.lazy');
  if (!lazyImgs.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const img = entry.target;
      const src = img.dataset.src;
      if (!src) return;
      img.src = src;
      img.onload  = () => img.classList.add('loaded');
      img.onerror = () => img.classList.add('loaded');
      observer.unobserve(img);
    });
  }, { rootMargin: '200px 0px' });

  lazyImgs.forEach(img => observer.observe(img));
})();

/* ─── Lightbox ─── */
(function () {
  const lightbox   = document.getElementById('lightbox');
  const backdrop   = document.getElementById('lb-backdrop');
  const closeBtn   = document.getElementById('lb-close');
  const prevBtn    = document.getElementById('lb-prev');
  const nextBtn    = document.getElementById('lb-next');
  const lbImg      = document.getElementById('lb-img');
  const lbCat      = document.getElementById('lb-cat');
  const lbTitle    = document.getElementById('lb-title');
  const lbCounter  = document.getElementById('lb-counter');
  const lbSpinner  = document.getElementById('lb-spinner');
  if (!lightbox) return;

  let currentIndex = 0;
  let visibleItems = [];

  function getVisibleItems() {
    return GALLERY_ITEMS.filter(item => {
      const el = document.querySelector(`.gallery-item[data-index="${item.index}"]`);
      return el && !el.classList.contains('gallery-item--hidden');
    });
  }

  function openLightbox(index) {
    visibleItems = getVisibleItems();
    const pos = visibleItems.findIndex(item => item.index === index);
    if (pos === -1) return;
    currentIndex = pos;
    lightbox.hidden = false;
    lightbox.classList.add('active');
    backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
    loadImage(currentIndex);
    lightbox.focus();
  }

  function closeLightbox() {
    lightbox.hidden = true;
    lightbox.classList.remove('active');
    backdrop.classList.remove('active');
    document.body.style.overflow = '';
    if (lbImg) { lbImg.src = ''; lbImg.classList.remove('loaded'); }
  }

  function loadImage(pos) {
    const item = visibleItems[pos];
    if (!item || !lbImg) return;

    lbImg.classList.remove('loaded');
    if (lbSpinner) lbSpinner.classList.remove('hidden');

    lbImg.onload = () => {
      lbImg.classList.add('loaded');
      if (lbSpinner) lbSpinner.classList.add('hidden');
    };
    lbImg.onerror = () => {
      if (lbSpinner) lbSpinner.classList.add('hidden');
    };
    lbImg.src  = item.src;
    lbImg.alt  = item.alt;
    if (lbCat)    lbCat.textContent    = item.cat.charAt(0).toUpperCase() + item.cat.slice(1);
    if (lbTitle)  lbTitle.textContent  = item.title;
    if (lbCounter) lbCounter.textContent = `${pos + 1} / ${visibleItems.length}`;
  }

  function navigate(dir) {
    currentIndex = (currentIndex + dir + visibleItems.length) % visibleItems.length;
    loadImage(currentIndex);
  }

  // Click items
  document.querySelectorAll('.gallery-item').forEach(item => {
    const openFn = () => openLightbox(parseInt(item.dataset.index, 10));
    item.addEventListener('click', openFn);
    item.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openFn(); }
    });
  });

  // Controls
  if (closeBtn)  closeBtn.addEventListener('click', closeLightbox);
  if (backdrop)  backdrop.addEventListener('click', closeLightbox);
  if (prevBtn)   prevBtn.addEventListener('click', () => navigate(-1));
  if (nextBtn)   nextBtn.addEventListener('click', () => navigate(1));

  // Keyboard navigation
  document.addEventListener('keydown', e => {
    if (lightbox.hidden) return;
    if (e.key === 'Escape')      closeLightbox();
    if (e.key === 'ArrowLeft')   navigate(-1);
    if (e.key === 'ArrowRight')  navigate(1);
  });

  // Touch swipe
  let touchX = 0;
  lightbox.addEventListener('touchstart', e => { touchX = e.changedTouches[0].clientX; }, { passive: true });
  lightbox.addEventListener('touchend',   e => {
    const diff = touchX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) navigate(diff > 0 ? 1 : -1);
  }, { passive: true });
})();
