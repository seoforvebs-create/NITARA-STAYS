/* ============================================================
   NITARA STAYS — Destination Detail Page JS
   ============================================================ */

const STATIC_DESTINATIONS = {
  1: {
    id: 1, name: 'The Dhanachuli House', category: 'Mountain',
    tagline: 'Perched above the clouds',
    description: 'A private mountain house with floor-to-ceiling windows framing the full Himalayan arc — from Nanda Devi to Trishul. The Dhanachuli House is the original Nitara property — the one that started it all. Designed by architects who spent months on the ridge before placing a single stone, the house follows the natural contours of the land. Its three interconnected volumes step down the hillside, each oriented to capture a different arc of the Himalayan panorama. Wake to pink-gold peaks at dawn. Breakfast on the terrace as clouds pour into the valley below. Spend afternoons in silence with the mountains as your only company.',
    image_url: 'https://www.genspark.ai/api/files/s/9dBT4k1w',
    gallery_images: ['https://www.genspark.ai/api/files/s/9dBT4k1w','https://www.genspark.ai/api/files/s/BzrQBgzk','https://www.genspark.ai/api/files/s/3WTkihgw','https://www.genspark.ai/api/files/s/aIdMy56z'],
    price_per_night: 18500, rating: 5.0,
    amenities: ['Panoramic Mountain View','Private Terrace','King Bed','Wood Fireplace','Farm Breakfast Included','In-house Chef','Heated Floors','High-Speed Wi-Fi','EV Charging']
  },
  2: {
    id: 2, name: 'The Forest Terrace', category: 'Forest',
    tagline: 'Oak canopy, infinite sky',
    description: 'Nestled within a dense oak and rhododendron forest at 2,100m, The Forest Terrace is a terrace villa where morning mist and birdsong replace alarm clocks. The property sits within a 200-year-old forest — the Nitara team has simply cleared a quiet space within it, leaving the canopy intact above and around. The main living area opens onto a wide stone terrace that floats among the treetops. At dawn, you hear nothing but birdsong — over 140 species have been recorded on the Nitara property.',
    image_url: 'https://www.genspark.ai/api/files/s/aIdMy56z',
    gallery_images: ['https://www.genspark.ai/api/files/s/aIdMy56z','https://www.genspark.ai/api/files/s/k6ltd7CC','https://www.genspark.ai/api/files/s/9dBT4k1w','https://www.genspark.ai/api/files/s/BzrQBgzk'],
    price_per_night: 14500, rating: 4.9,
    amenities: ['Forest Canopy View','Stone Terrace','King Bed','Organic Garden','Farm Breakfast Included','Nature Walk Guide','Bird Watching Kit','High-Speed Wi-Fi','Rain Shower']
  },
  3: {
    id: 3, name: 'The Summit Suite', category: 'Mountain',
    tagline: '180° Himalayan panorama',
    description: 'The crown jewel of Nitara Stays. A panoramic suite at elevation with a private deck offering unobstructed views of Panchachuli, Kedarnath and Nanda Kot. Positioned at the highest point of the Nitara property — at 2,286 metres — The Summit Suite is designed around one singular idea: the view. Three walls of floor-to-ceiling glass ensure that whether you are in bed, in the bath, or at the dining table, eight named Himalayan peaks are always in sight. It is, without question, one of the finest rooms in the Indian Himalaya.',
    image_url: 'https://www.genspark.ai/api/files/s/BzrQBgzk',
    gallery_images: ['https://www.genspark.ai/api/files/s/BzrQBgzk','https://www.genspark.ai/api/files/s/9dBT4k1w','https://www.genspark.ai/api/files/s/3WTkihgw','https://www.genspark.ai/api/files/s/k6ltd7CC'],
    price_per_night: 24500, rating: 5.0,
    amenities: ['180° Peak View','Glass-Wall Bedroom','King Bed','Private Plunge Pool Deck','In-house Chef','Farm Breakfast','Evening Bonfire','Telescope','Butler Service','Heated Floors']
  },
  4: {
    id: 4, name: 'The Alpine Chalet', category: 'Mountain',
    tagline: 'Snow, silence & stone',
    description: 'A stone-and-timber chalet designed for winter. Thick walls, a wood fire, wool blankets and snowfall from your window — the Himalayan winter as it should be experienced. The Alpine Chalet was built using stone quarried from the hillside and timber reclaimed from an old Kumaoni mill. Its thick walls keep the cold firmly outside, while inside a wood-burning fireplace and underfloor heating create a cocoon of warmth. In December and January, snowfall transforms the view from the wide picture windows into something from a fairy tale.',
    image_url: 'https://www.genspark.ai/api/files/s/3WTkihgw',
    gallery_images: ['https://www.genspark.ai/api/files/s/3WTkihgw','https://www.genspark.ai/api/files/s/9dBT4k1w','https://www.genspark.ai/api/files/s/BzrQBgzk','https://www.genspark.ai/api/files/s/aIdMy56z'],
    price_per_night: 21000, rating: 4.8,
    amenities: ['Mountain & Snow View','Stone Fireplace','King Bed','Underfloor Heating','Farm Breakfast','Wool & Cashmere Bedding','Snow Boots Provided','High-Speed Wi-Fi','Clawfoot Bath']
  },
  5: {
    id: 5, name: 'The Valley Retreat', category: 'Mountain',
    tagline: 'Where rivers begin',
    description: 'Positioned above a glacial valley with views of ancient pine forests cascading down to silver streams. A contemplative space for writers, thinkers and dreamers. The Valley Retreat is the quietest of all Nitara properties — set slightly apart, facing east, looking out over a valley through which a seasonal glacier melt stream runs silver in summer. It is chosen by guests who need not just rest but true solitude — writers on deadline, executives in recovery, couples rediscovering conversation.',
    image_url: 'https://www.genspark.ai/api/files/s/k6ltd7CC',
    gallery_images: ['https://www.genspark.ai/api/files/s/k6ltd7CC','https://www.genspark.ai/api/files/s/aIdMy56z','https://www.genspark.ai/api/files/s/9dBT4k1w','https://www.genspark.ai/api/files/s/3WTkihgw'],
    price_per_night: 16500, rating: 4.9,
    amenities: ['Valley & Pine View','Writing Desk & Library','King Bed','Meditation Space','Farm Breakfast','Yoga Mat & Props','Stream Access','High-Speed Wi-Fi','Outdoor Fire Pit']
  },
  6: { id: 6, name: 'The Orchard Cottage', category: 'Forest', tagline: 'Among apple blossoms', description: 'Set within Nitara\'s working apple and plum orchard. A cottage stay with farm-to-table breakfasts, orchard walks and the sweet perfume of Kumaoni summer. The Orchard Cottage is the most intimate of Nitara\'s properties — a single-room stone cottage set among rows of apple and plum trees. In May, the orchard is in full blossom; in September, you can pick fruit from the branches outside your window. Breakfast is plucked, pressed and cooked within 50 metres of your bed.', image_url: 'https://www.genspark.ai/api/files/s/aIdMy56z', gallery_images: ['https://www.genspark.ai/api/files/s/aIdMy56z','https://www.genspark.ai/api/files/s/k6ltd7CC'], price_per_night: 12500, rating: 4.7, amenities: ['Orchard View','Stone Cottage','Queen Bed','Farm Breakfast','Fruit Picking Access','Village Walk','High-Speed Wi-Fi'] },
  7: { id: 7, name: 'The Ridgeline Studio', category: 'Premium', tagline: 'Minimalism at altitude', description: 'A glass-and-stone studio perched right on the Mukteshwar ridge. Floor-to-ceiling glazing on three sides ensures uninterrupted sky from your bed. The most architecturally daring of the Nitara collection. Three walls of glass, a minimalist palette of stone and pale oak, and not a single obstruction between you and the Himalayan horizon. The Ridgeline Studio is for those who want the mountain experience distilled to its most essential form.', image_url: 'https://www.genspark.ai/api/files/s/BzrQBgzk', gallery_images: ['https://www.genspark.ai/api/files/s/BzrQBgzk','https://www.genspark.ai/api/files/s/9dBT4k1w'], price_per_night: 28000, rating: 5.0, amenities: ['360° Ridge View','Three-Wall Glass','King Bed','Private Butler','Breakfast & Dinner','Heated Bath','Telescope','Curated Library'] },
  8: { id: 8, name: 'The Kumaoni Farmhouse', category: 'Village', tagline: 'Authentic village life', description: 'A lovingly restored 100-year-old Kumaoni farmhouse with original stone walls, a working clay oven, and the scent of pine smoke and marigold. The Farmhouse is not a hotel room — it is a home. A real Kumaoni home, a century old, with the thick stone walls, low lintels and internal courtyard that define the mountain vernacular. Our team has restored it with obsessive care — original everything, but with modern plumbing, a great bed and the quietest nights you will ever experience.', image_url: 'https://www.genspark.ai/api/files/s/k6ltd7CC', gallery_images: ['https://www.genspark.ai/api/files/s/k6ltd7CC','https://www.genspark.ai/api/files/s/aIdMy56z'], price_per_night: 11000, rating: 4.8, amenities: ['100-Year Stone House','Courtyard Garden','King Bed','Clay Oven Cooking Class','Farm Breakfast','Village Walk','Local Weaving Demo'] },
  9: { id: 9, name: 'The Cloud Villa', category: 'Premium', tagline: 'Above the treeline', description: 'At 2,400 metres — above the treeline — this contemporary villa sits literally in the clouds. On clear mornings, eight named Himalayan peaks are visible simultaneously. The Cloud Villa is the highest and most secluded of all Nitara properties. Accessible by a private jeep track, it sits on a clearing above the treeline, with unobstructed 270° views. On clear winter mornings, eight Himalayan peaks are visible — Nanda Devi, Trishul, Panchachuli, Kedarnath, Nanda Kot, Hathi Parvat, Nanda Ghunti and Maiktoli.', image_url: 'https://www.genspark.ai/api/files/s/9dBT4k1w', gallery_images: ['https://www.genspark.ai/api/files/s/9dBT4k1w','https://www.genspark.ai/api/files/s/BzrQBgzk','https://www.genspark.ai/api/files/s/3WTkihgw'], price_per_night: 32000, rating: 5.0, amenities: ['270° Peak View','Contemporary Villa','2 King Bedrooms','Private Plunge Pool','Full-Board Dining','Private Butler','Helicopter Transfer Option','Heated Floors','Observatory Deck'] },
};

const STATIC_ROOMS = {
  1: [
    { id: 1, room_name: 'The Panorama King', size_sqft: 680, max_guests: 2, price_per_night: 18500, description: 'Master bedroom with floor-to-ceiling glass facing Nanda Devi. King-sized bed with organic cotton linen.' },
    { id: 2, room_name: 'The Forest Studio', size_sqft: 420, max_guests: 2, price_per_night: 15500, description: 'Compact studio with a terraced garden view. Perfect for couples seeking a quieter option.' },
  ],
  3: [
    { id: 3, room_name: 'The Summit Penthouse', size_sqft: 960, max_guests: 2, price_per_night: 24500, description: 'Full-floor penthouse with 180° panoramic glass walls. Includes private plunge pool deck.' },
  ],
  7: [
    { id: 4, room_name: 'The Ridge Studio', size_sqft: 750, max_guests: 2, price_per_night: 28000, description: 'Single luxurious studio with three glass walls. Curated minibar stocked with local produce.' },
  ],
  9: [
    { id: 5, room_name: 'The Cloud Master Suite', size_sqft: 820, max_guests: 2, price_per_night: 32000, description: 'Primary suite with king bed and direct panoramic views.' },
    { id: 6, room_name: 'The Cloud Guest Room', size_sqft: 540, max_guests: 2, price_per_night: 26000, description: 'Secondary room with mountain-facing windows and ensuite bath.' },
  ],
};

/* ─── Load Destination ─── */
async function loadDestinationDetail() {
  const params = new URLSearchParams(window.location.search);
  const id     = parseInt(params.get('id'), 10);

  if (!id) { window.location.href = 'destinations.html'; return; }

  let dest  = STATIC_DESTINATIONS[id];
  let rooms = STATIC_ROOMS[id] || [];

  try {
    if (window.supabase) {
      const { data: d } = await supabase.from('destinations').select('*').eq('id', id).single();
      if (d) dest = d;
      const { data: r } = await supabase.from('rooms').select('*').eq('destination_id', id);
      if (r && r.length) rooms = r;
    }
  } catch (_) {}

  if (!dest) { window.location.href = 'destinations.html'; return; }

  renderDestination(dest, rooms);
}

function renderDestination(dest, rooms) {
  // Hero background
  const heroBg = document.getElementById('detail-hero-bg');
  if (heroBg) heroBg.style.backgroundImage = `url('${dest.image_url}')`;

  // Hero content
  const heroLabel = document.getElementById('detail-hero-label');
  const heroTitle = document.getElementById('detail-hero-title');
  const heroSub   = document.getElementById('detail-hero-sub');
  if (heroLabel) heroLabel.textContent = dest.category + ' Retreat · Mukteshwar';
  if (heroTitle) heroTitle.textContent = dest.name;
  if (heroSub)   heroSub.textContent   = dest.tagline;

  // Page title
  document.title = dest.name + ' — Nitara Stays';

  // Gallery
  const galleryEl = document.getElementById('detail-gallery');
  if (galleryEl) {
    const images = Array.isArray(dest.gallery_images) ? dest.gallery_images : [dest.image_url];
    galleryEl.innerHTML = images.map((img, i) => `
      <div class="detail-gallery-item ${i === 0 ? 'detail-gallery-item--main' : ''}"
           tabindex="0" role="button" aria-label="View image ${i + 1}"
           onclick="openDetailLightbox(${i})" onkeydown="if(event.key==='Enter')openDetailLightbox(${i})">
        <img src="${img}" alt="${dest.name} — image ${i + 1}" loading="${i === 0 ? 'eager' : 'lazy'}" />
      </div>
    `).join('');
    window._detailImages = images;
    window._detailDest   = dest;
  }

  // Description
  const descEl = document.getElementById('detail-description');
  if (descEl) descEl.textContent = dest.description;

  // Amenities
  const amenEl = document.getElementById('detail-amenities');
  if (amenEl) {
    const amenities = Array.isArray(dest.amenities) ? dest.amenities : [];
    amenEl.innerHTML = amenities.map(a => `
      <div class="detail-amenity">
        <span class="detail-amenity-icon" aria-hidden="true">✦</span>
        <span>${a}</span>
      </div>
    `).join('');
  }

  // Price in booking widget
  const priceEl = document.getElementById('widget-price');
  if (priceEl) priceEl.textContent = '₹' + Number(dest.price_per_night).toLocaleString('en-IN');
  const widgetTitle = document.getElementById('widget-dest-name');
  if (widgetTitle) widgetTitle.textContent = dest.name;

  // Rating
  const ratingEl = document.getElementById('detail-rating');
  if (ratingEl) ratingEl.textContent = dest.rating || '5.0';

  // Rooms
  const roomsEl = document.getElementById('detail-rooms');
  if (roomsEl) {
    if (!rooms.length) {
      roomsEl.innerHTML = '<p style="color:var(--taupe);font-style:italic;">All rooms within this retreat share the same premium experience.</p>';
    } else {
      roomsEl.innerHTML = rooms.map(r => `
        <article class="detail-room-card">
          <div class="detail-room-card-body">
            <h4 class="detail-room-name">${r.room_name}</h4>
            <p class="detail-room-meta">${r.size_sqft} sq.ft · Up to ${r.max_guests} guests</p>
            <p class="detail-room-desc">${r.description}</p>
          </div>
          <div class="detail-room-price-wrap">
            <p class="detail-room-price">₹${Number(r.price_per_night).toLocaleString('en-IN')}<span>/night</span></p>
            <a href="booking.html?dest=${dest.id}&room=${r.id}" class="btn-gold" style="font-size:0.7rem;padding:10px 24px;">Book This Room</a>
          </div>
        </article>
      `).join('');
    }
  }

  // Booking widget button
  const bookBtn = document.getElementById('widget-book-btn');
  if (bookBtn) bookBtn.href = `booking.html?dest=${dest.id}`;
}

/* ─── Detail Lightbox ─── */
window.openDetailLightbox = function(index) {
  const images = window._detailImages || [];
  const dest   = window._detailDest || {};
  const lb     = document.getElementById('detail-lightbox');
  const backdrop = document.getElementById('detail-lb-backdrop');
  const img    = document.getElementById('detail-lb-img');
  if (!lb || !img) return;

  window._dlbIndex = index;
  img.src = images[index];
  img.alt = dest.name + ' — image ' + (index + 1);
  lb.removeAttribute('hidden');
  backdrop.classList.add('active');
  document.body.style.overflow = 'hidden';
  document.getElementById('detail-lb-counter').textContent = (index + 1) + ' / ' + images.length;
};

(function () {
  const lb       = document.getElementById('detail-lightbox');
  const backdrop = document.getElementById('detail-lb-backdrop');
  const closeBtn = document.getElementById('detail-lb-close');
  const prevBtn  = document.getElementById('detail-lb-prev');
  const nextBtn  = document.getElementById('detail-lb-next');

  function close() {
    if (lb) lb.setAttribute('hidden', '');
    if (backdrop) backdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  function navigate(dir) {
    const images = window._detailImages || [];
    if (!images.length) return;
    window._dlbIndex = (window._dlbIndex + dir + images.length) % images.length;
    const img = document.getElementById('detail-lb-img');
    if (img) img.src = images[window._dlbIndex];
    const ctr = document.getElementById('detail-lb-counter');
    if (ctr) ctr.textContent = (window._dlbIndex + 1) + ' / ' + images.length;
  }

  if (closeBtn) closeBtn.addEventListener('click', close);
  if (backdrop) backdrop.addEventListener('click', close);
  if (prevBtn)  prevBtn.addEventListener('click', () => navigate(-1));
  if (nextBtn)  nextBtn.addEventListener('click', () => navigate(1));

  document.addEventListener('keydown', e => {
    if (!lb || lb.hasAttribute('hidden')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft')  navigate(-1);
    if (e.key === 'ArrowRight') navigate(1);
  });
})();

/* ─── Widget Date Calculation ─── */
(function () {
  const checkIn  = document.getElementById('widget-checkin');
  const checkOut = document.getElementById('widget-checkout');
  const nights   = document.getElementById('widget-nights');

  function calcNights() {
    if (!checkIn || !checkOut || !nights) return;
    const d1 = new Date(checkIn.value);
    const d2 = new Date(checkOut.value);
    if (isNaN(d1) || isNaN(d2) || d2 <= d1) { nights.textContent = '—'; return; }
    const n = Math.ceil((d2 - d1) / 86400000);
    nights.textContent = n + ' night' + (n !== 1 ? 's' : '');
  }

  const today = new Date().toISOString().split('T')[0];
  if (checkIn)  checkIn.min  = today;
  if (checkOut) checkOut.min = today;

  if (checkIn)  checkIn.addEventListener('change',  calcNights);
  if (checkOut) checkOut.addEventListener('change', calcNights);
})();

loadDestinationDetail();
