/* ============================================================
   NITARA STAYS — Destinations Page JS
   ============================================================ */

const ALL_DESTINATIONS = [
  {
    id: 1, name: 'The Dhanachuli House', category: 'Mountain',
    tagline: 'Perched above the clouds',
    description: 'A private mountain house with floor-to-ceiling windows framing the full Himalayan arc — from Nanda Devi to Trishul. Wake to pink-gold peaks.',
    image_url: 'https://www.genspark.ai/api/files/s/9dBT4k1w',
    price_per_night: 18500, rating: 5.0
  },
  {
    id: 2, name: 'The Forest Terrace', category: 'Forest',
    tagline: 'Oak canopy, infinite sky',
    description: 'Nestled within a dense oak and rhododendron forest at 2,100m. A terrace villa where morning mist and birdsong replace alarm clocks.',
    image_url: 'https://www.genspark.ai/api/files/s/aIdMy56z',
    price_per_night: 14500, rating: 4.9
  },
  {
    id: 3, name: 'The Summit Suite', category: 'Mountain',
    tagline: '180° Himalayan panorama',
    description: 'The crown jewel of Nitara Stays. A panoramic suite at elevation with a private deck offering unobstructed views of Panchachuli, Kedarnath and Nanda Kot.',
    image_url: 'https://www.genspark.ai/api/files/s/BzrQBgzk',
    price_per_night: 24500, rating: 5.0
  },
  {
    id: 4, name: 'The Alpine Chalet', category: 'Mountain',
    tagline: 'Snow, silence & stone',
    description: 'A stone-and-timber chalet designed for winter. Thick walls, a wood fire, wool blankets and snowfall from your window — the Himalayan winter as it should be experienced.',
    image_url: 'https://www.genspark.ai/api/files/s/3WTkihgw',
    price_per_night: 21000, rating: 4.8
  },
  {
    id: 5, name: 'The Valley Retreat', category: 'Mountain',
    tagline: 'Where rivers begin',
    description: 'Positioned above a glacial valley with views of ancient pine forests cascading down to silver streams. A contemplative space for writers, thinkers and dreamers.',
    image_url: 'https://www.genspark.ai/api/files/s/k6ltd7CC',
    price_per_night: 16500, rating: 4.9
  },
  {
    id: 6, name: 'The Orchard Cottage', category: 'Forest',
    tagline: 'Among apple blossoms',
    description: 'Set within Nitara\'s working apple and plum orchard. Farm-to-table breakfasts, orchard walks and the sweet perfume of Kumaoni summer.',
    image_url: 'https://www.genspark.ai/api/files/s/aIdMy56z',
    price_per_night: 12500, rating: 4.7
  },
  {
    id: 7, name: 'The Ridgeline Studio', category: 'Premium',
    tagline: 'Minimalism at altitude',
    description: 'A glass-and-stone studio perched right on the Mukteshwar ridge. Floor-to-ceiling glazing on three sides ensures uninterrupted sky from your bed.',
    image_url: 'https://www.genspark.ai/api/files/s/BzrQBgzk',
    price_per_night: 28000, rating: 5.0
  },
  {
    id: 8, name: 'The Kumaoni Farmhouse', category: 'Village',
    tagline: 'Authentic village life',
    description: 'A lovingly restored 100-year-old Kumaoni farmhouse with original stone walls, a working clay oven, and the scent of pine smoke and marigold.',
    image_url: 'https://www.genspark.ai/api/files/s/k6ltd7CC',
    price_per_night: 11000, rating: 4.8
  },
  {
    id: 9, name: 'The Cloud Villa', category: 'Premium',
    tagline: 'Above the treeline',
    description: 'At 2,400 metres — above the treeline — this contemporary villa sits literally in the clouds. On clear mornings, eight named Himalayan peaks are visible simultaneously.',
    image_url: 'https://www.genspark.ai/api/files/s/9dBT4k1w',
    price_per_night: 32000, rating: 5.0
  },
];

function renderStars(rating) {
  const full = Math.floor(rating);
  return '★'.repeat(full) + (rating % 1 >= 0.5 ? '½' : '');
}

function buildDestinationCard(dest) {
  return `
    <article class="destination-card reveal"
             tabindex="0"
             role="article"
             aria-label="${dest.name} — from ₹${Number(dest.price_per_night).toLocaleString('en-IN')} per night"
             onclick="window.location.href='destination-detail.html?id=${dest.id}'"
             onkeydown="if(event.key==='Enter')window.location.href='destination-detail.html?id=${dest.id}'">
      <div class="destination-card__img-wrap">
        <img src="${dest.image_url}"
             alt="${dest.name} — ${dest.tagline}"
             loading="lazy"
             class="destination-card__img" />
        <div class="destination-card__img-overlay"></div>
        <span class="destination-card__tag">${dest.category}</span>
      </div>
      <div class="destination-card__body">
        <h3 class="destination-card__name">${dest.name}</h3>
        <p class="destination-card__tagline">${dest.tagline}</p>
        <p class="destination-card__desc">${dest.description}</p>
        <div class="destination-card__footer">
          <div>
            <p class="destination-card__price">From ₹${Number(dest.price_per_night).toLocaleString('en-IN')}<span>/night</span></p>
            <p class="destination-card__rating" aria-label="${dest.rating} stars">
              <span aria-hidden="true">${renderStars(dest.rating)}</span> ${dest.rating}
            </p>
          </div>
          <a href="destination-detail.html?id=${dest.id}" class="destination-card__cta" tabindex="-1" aria-hidden="true">View Retreat →</a>
        </div>
      </div>
    </article>
  `;
}

async function loadDestinations() {
  let destinations = ALL_DESTINATIONS;

  try {
    if (window.supabase) {
      const { data, error } = await supabase
        .from('destinations')
        .select('id,name,category,tagline,description,image_url,price_per_night,rating')
        .order('created_at', { ascending: false });
      if (!error && data && data.length > 0) destinations = data;
    }
  } catch (_) {}

  window._allDestinations = destinations;
  renderGrid(destinations);
  updateCount(destinations.length);
}

function renderGrid(destinations) {
  const grid    = document.getElementById('destinations-grid');
  const emptyEl = document.getElementById('dest-empty');
  if (!grid) return;

  if (!destinations.length) {
    grid.innerHTML = '';
    if (emptyEl) emptyEl.style.display = 'flex';
    return;
  }
  if (emptyEl) emptyEl.style.display = 'none';
  grid.innerHTML = destinations.map(buildDestinationCard).join('');

  // Re-trigger reveal observer on new cards
  const newCards = grid.querySelectorAll('.reveal:not(.revealed)');
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  newCards.forEach(c => revealObs.observe(c));
}

function updateCount(n) {
  const countEl = document.getElementById('dest-count');
  if (countEl) countEl.textContent = `${n} Curated Retreat${n !== 1 ? 's' : ''}`;
}

/* ─── Filter Tabs ─── */
(function () {
  const tabs = document.querySelectorAll('.filter-tab');
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      const filter = tab.dataset.filter;
      const all    = window._allDestinations || ALL_DESTINATIONS;
      const filtered = filter === 'all'
        ? all
        : all.filter(d => d.category === filter);

      renderGrid(filtered);
      updateCount(filtered.length);
    });

    tab.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); tab.click(); }
    });
  });
})();

/* ─── Parallax Hero ─── */
(function () {
  const heroBg = document.getElementById('hero-parallax');
  if (!heroBg) return;
  window.addEventListener('scroll', () => {
    const offset = window.scrollY * 0.3;
    heroBg.style.transform = `translateY(${offset}px)`;
  }, { passive: true });
})();

loadDestinations();
