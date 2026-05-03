/* ============================================================
   NITARA STAYS — Home Page JS
   ============================================================ */

/* ─── Destination Cards (Static Fallback + Supabase) ─── */
const STATIC_DESTINATIONS = [
  {
    id: 1, name: 'The Dhanachuli House', category: 'Mountain',
    tagline: 'Perched above the clouds',
    description: 'A private mountain house with floor-to-ceiling windows framing the full Himalayan arc — from Nanda Devi to Trishul. Wake to pink-gold peaks.',
    image_url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80',
    price_per_night: 18500, rating: 5.0
  },
  {
    id: 2, name: 'The Forest Terrace', category: 'Forest',
    tagline: 'Oak canopy, infinite sky',
    description: 'Nestled within a dense oak and rhododendron forest at 2,100m. A terrace villa where morning mist and birdsong replace alarm clocks.',
    image_url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80',
    price_per_night: 14500, rating: 4.9
  },
  {
    id: 3, name: 'The Summit Suite', category: 'Mountain',
    tagline: '180° Himalayan panorama',
    description: 'The crown jewel of Nitara Stays. A panoramic suite at elevation with a private deck offering unobstructed views of Panchachuli, Kedarnath and Nanda Kot.',
    image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    price_per_night: 24500, rating: 5.0
  },
  {
    id: 4, name: 'The Alpine Chalet', category: 'Mountain',
    tagline: 'Snow, silence & stone',
    description: 'A stone-and-timber chalet designed for winter. Thick walls, a wood fire, wool blankets and snowfall from your window — the Himalayan winter as it should be experienced.',
    image_url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=80',
    price_per_night: 21000, rating: 4.8
  },
  {
    id: 5, name: 'The Valley Retreat', category: 'Mountain',
    tagline: 'Where rivers begin',
    description: 'Positioned above a glacial valley with views of ancient pine forests cascading down to silver streams. A contemplative space for writers, thinkers and dreamers.',
    image_url: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80',
    price_per_night: 16500, rating: 4.9
  },
  {
    id: 6, name: 'The Orchard Cottage', category: 'Forest',
    tagline: 'Among apple blossoms',
    description: 'Set within Nitara\'s working apple and plum orchard. A cottage stay with farm-to-table breakfasts, orchard walks and the sweet perfume of Kumaoni summer.',
    image_url: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=800&q=80',
    price_per_night: 12500, rating: 4.7
  }
];

function renderStars(rating) {
  const full = Math.floor(rating);
  return '★'.repeat(full) + (rating % 1 >= 0.5 ? '½' : '');
}

function buildDestCard(dest) {
  return `
    <article class="dest-card"
             onclick="window.location.href='destination-detail.html?id=${dest.id}'"
             tabindex="0"
             role="article"
             aria-label="${dest.name} — from ₹${Number(dest.price_per_night).toLocaleString('en-IN')}/night"
             onkeydown="if(event.key==='Enter')window.location.href='destination-detail.html?id=${dest.id}'">
      <div class="dest-card-img">
        <img src="${dest.image_url}" alt="${dest.name} — ${dest.tagline}" loading="lazy" />
        <div class="dest-card-img-overlay"></div>
        <span class="dest-card-tag">${dest.category}</span>
        <div class="dest-card-info">
          <h3 class="dest-card-name">${dest.name}</h3>
          <p class="dest-card-tagline">${dest.tagline}</p>
          <div class="dest-card-meta">
            <span class="dest-card-price">From ₹${Number(dest.price_per_night).toLocaleString('en-IN')}/night</span>
            <span class="dest-card-stars" aria-label="${dest.rating} stars">${renderStars(dest.rating)}</span>
          </div>
          <span class="dest-card-btn" aria-hidden="true">Explore →</span>
        </div>
      </div>
    </article>
  `;
}

async function loadDestinations() {
  const track = document.getElementById('dest-track');
  if (!track) return;

  let destinations = STATIC_DESTINATIONS;

  try {
    if (window.supabase) {
      const { data, error } = await supabase
        .from('destinations')
        .select('id,name,category,tagline,description,image_url,price_per_night,rating')
        .order('created_at', { ascending: false })
        .limit(6);
      if (!error && data && data.length > 0) destinations = data;
    }
  } catch (e) { /* use static */ }

  track.innerHTML = destinations.map(buildDestCard).join('');
}

loadDestinations();

/* ─── Testimonials Carousel ─── */
(function () {
  const track = document.getElementById('testimonials-track');
  const dotsContainer = document.getElementById('test-dots');
  const prevBtn = document.getElementById('test-prev');
  const nextBtn = document.getElementById('test-next');
  if (!track) return;

  const slides = track.querySelectorAll('.testimonial-slide');
  let current = 0;
  let autoTimer;

  function buildDots() {
    dotsContainer.innerHTML = '';
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'testimonial-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
      dot.setAttribute('role', 'tab');
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    });
  }

  function goTo(n) {
    current = (n + slides.length) % slides.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    dotsContainer.querySelectorAll('.testimonial-dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  function startAuto() {
    autoTimer = setInterval(() => goTo(current + 1), 5500);
  }
  function stopAuto() { clearInterval(autoTimer); }

  buildDots();
  prevBtn && prevBtn.addEventListener('click', () => { stopAuto(); goTo(current - 1); startAuto(); });
  nextBtn && nextBtn.addEventListener('click', () => { stopAuto(); goTo(current + 1); startAuto(); });

  track.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') { stopAuto(); goTo(current - 1); startAuto(); }
    if (e.key === 'ArrowRight') { stopAuto(); goTo(current + 1); startAuto(); }
  });

  let touchStartX = 0;
  track.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { stopAuto(); goTo(current + (diff > 0 ? 1 : -1)); startAuto(); }
  }, { passive: true });

  startAuto();
})();

/* ─── Newsletter Supabase Submit ─── */
(function () {
  const form = document.getElementById('newsletter-form');
  if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const emailInput = document.getElementById('newsletter-email');
    const email = emailInput.value.trim();
    if (!email) return;

    const btn = form.querySelector('button');
    btn.textContent = 'Subscribing…';
    btn.disabled = true;

    try {
      if (window.supabase) {
        const { error } = await supabase
          .from('newsletter_subscribers')
          .insert([{ email, subscribed_at: new Date().toISOString() }]);
        if (error && error.code !== '23505') throw error;
      }
      emailInput.value = '';
      window.showToast('✦ Welcome to The Nitara Dispatch');
    } catch (err) {
      window.showToast('Something went wrong. Please try again.');
    } finally {
      btn.textContent = 'Subscribe';
      btn.disabled = false;
    }
  });
})();
