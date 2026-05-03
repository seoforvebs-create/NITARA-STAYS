// ============================================================
// booking.js — Nitara Stays | Matches booking.html exactly
// ============================================================

const DEST_PRICES = {
  '1': { name: 'The Dhanachuli House',   price: 18500 },
  '2': { name: 'The Forest Terrace',     price: 14500 },
  '3': { name: 'The Summit Suite',       price: 24500 },
  '4': { name: 'The Alpine Chalet',      price: 21000 },
  '5': { name: 'The Valley Retreat',     price: 16500 },
  '6': { name: 'The Orchard Cottage',    price: 12500 },
  '7': { name: 'The Heritage Haveli',    price: 13500 },
  '8': { name: 'The Starlight Deck',     price: 28000 },
  '9': { name: 'The Mist Bungalow',      price: 15500 }
};

const TAX_RATE = 0.18;

const ADDON_PRICES = {
  'airport_transfer':   2500,
  'spa_package':        5000,
  'candlelight_dinner': 3500,
  'adventure_package':  4000
};

const ADDON_LABELS = {
  'airport_transfer':   'Airport Transfer',
  'spa_package':        'Spa Package',
  'candlelight_dinner': 'Candlelight Dinner',
  'adventure_package':  'Adventure Package'
};

let bk = {
  destination_id: '', destination_name: '', price_per_night: 0,
  checkin_date: '', checkout_date: '', nights: 0, num_guests: 2,
  room_type: '', guest_name: '', guest_email: '', guest_phone: '',
  country: 'India', special_requests: '', addons: [],
  addons_cost: 0, room_cost: 0, tax: 0, total_price: 0
};

let currentStep = 1;

// ── Boot ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  setMinDates();
  bindStep1();
  bindStep2();
  bindNavButtons();

  const destParam = new URLSearchParams(window.location.search).get('destination');
  if (destParam) {
    const sel = document.getElementById('f-destination');
    if (sel) { sel.value = destParam; sel.dispatchEvent(new Event('change')); }
  }
});

// ── Min dates ─────────────────────────────────────────────────
function setMinDates() {
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('f-checkin').min  = today;
  document.getElementById('f-checkout').min = today;
}

// ── Step 1 ────────────────────────────────────────────────────
function bindStep1() {
  document.getElementById('f-destination').addEventListener('change', onStep1Change);
  document.getElementById('f-checkin').addEventListener('change', () => {
    const ci = document.getElementById('f-checkin').value;
    if (ci) {
      const next = new Date(ci);
      next.setDate(next.getDate() + 1);
      document.getElementById('f-checkout').min = next.toISOString().split('T')[0];
      if (document.getElementById('f-checkout').value <= ci)
        document.getElementById('f-checkout').value = '';
    }
    onStep1Change();
  });
  document.getElementById('f-checkout').addEventListener('change', onStep1Change);
  document.getElementById('f-guests').addEventListener('change', onStep1Change);
}

function onStep1Change() {
  const destId   = document.getElementById('f-destination').value;
  const checkin  = document.getElementById('f-checkin').value;
  const checkout = document.getElementById('f-checkout').value;
  const guests   = document.getElementById('f-guests').value;

  bk.destination_id = destId;
  bk.num_guests     = parseInt(guests) || 2;

  if (DEST_PRICES[destId]) {
    bk.destination_name = DEST_PRICES[destId].name;
    bk.price_per_night  = DEST_PRICES[destId].price;
    document.getElementById('sidebar-name').textContent = DEST_PRICES[destId].name;
  }

  if (checkin && checkout && checkout > checkin) {
    bk.checkin_date  = checkin;
    bk.checkout_date = checkout;
    bk.nights = Math.round((new Date(checkout) - new Date(checkin)) / 86400000);
    document.getElementById('f-nights-display').textContent =
      bk.nights + ' night' + (bk.nights > 1 ? 's' : '');
    document.getElementById('sidebar-dates').innerHTML =
      `<svg viewBox="0 0 24 24" fill="none" stroke-width="1.5">
        <rect x="3" y="4" width="18" height="18" rx="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
       </svg>
       ${formatDisplayDate(checkin)} → ${formatDisplayDate(checkout)}`;
  } else {
    bk.nights = 0;
    document.getElementById('f-nights-display').textContent = 'Select dates above';
  }

  calcAndShowPrice();
}

// ── Price calculation ─────────────────────────────────────────
function calcAndShowPrice() {
  const calc = document.getElementById('price-calc');
  if (!bk.destination_id || bk.nights <= 0) {
    calc.style.display = 'none'; return;
  }

  bk.room_cost   = bk.price_per_night * bk.nights;
  bk.addons_cost = bk.addons.reduce((s, a) => s + (ADDON_PRICES[a] || 0), 0);
  const subtotal  = bk.room_cost + bk.addons_cost;
  bk.tax         = Math.round(subtotal * TAX_RATE);
  bk.total_price = subtotal + bk.tax;

  document.getElementById('calc-nights-label').textContent =
    bk.destination_name + ' × ' + bk.nights + ' night' + (bk.nights > 1 ? 's' : '');
  document.getElementById('calc-subtotal').textContent = '₹' + bk.room_cost.toLocaleString('en-IN');
  document.getElementById('calc-tax').textContent      = '₹' + bk.tax.toLocaleString('en-IN');
  document.getElementById('calc-total').textContent    = '₹' + bk.total_price.toLocaleString('en-IN');
  calc.style.display = 'block';
}

// ── Add-ons ───────────────────────────────────────────────────
function toggleAddon(card) {
  card.classList.toggle('selected');
  const key = card.dataset.addon;
  if (card.classList.contains('selected')) {
    if (!bk.addons.includes(key)) bk.addons.push(key);
  } else {
    bk.addons = bk.addons.filter(a => a !== key);
  }
  calcAndShowPrice();
}

// ── Step 2 ────────────────────────────────────────────────────
function bindStep2() {
  ['f-name', 'f-email', 'f-phone'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('blur', () => validateField(id));
  });
}

// ── Navigation ────────────────────────────────────────────────
function bindNavButtons() {
  document.getElementById('btn-next-1').addEventListener('click', () => {
    if (validateStep1()) { collectStep1(); goToStep(2); }
  });
  document.getElementById('btn-back-2').addEventListener('click',  () => goToStep(1));
  document.getElementById('btn-next-2').addEventListener('click',  () => {
    if (validateStep2()) { collectStep2(); goToStep(3); }
  });
  document.getElementById('btn-back-3').addEventListener('click',  () => goToStep(2));
  document.getElementById('btn-confirm').addEventListener('click', confirmBooking);
}

function goToStep(n) {
  document.querySelectorAll('.booking-step').forEach(s => s.classList.remove('active'));
  document.getElementById('step-' + n).classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });

  for (let i = 1; i <= 3; i++) {
    const circle = document.getElementById('sc-' + i);
    if (!circle) continue;
    circle.classList.remove('active', 'done');
    if (i < n)        circle.classList.add('done');
    else if (i === n) circle.classList.add('active');
  }
  for (let i = 1; i <= 2; i++) {
    const line = document.getElementById('sl-' + i);
    if (line) line.classList.toggle('done', i < n);
  }

  currentStep = n;
  if (n === 3) populateSummary();
}

// ── Collect data ──────────────────────────────────────────────
function collectStep1() {
  bk.destination_id   = document.getElementById('f-destination').value;
  bk.destination_name = DEST_PRICES[bk.destination_id]?.name || '';
  bk.price_per_night  = DEST_PRICES[bk.destination_id]?.price || 0;
  bk.checkin_date     = document.getElementById('f-checkin').value;
  bk.checkout_date    = document.getElementById('f-checkout').value;
  bk.num_guests       = parseInt(document.getElementById('f-guests').value) || 2;
  bk.room_type        = document.getElementById('f-room').value || '';
  bk.nights = Math.round((new Date(bk.checkout_date) - new Date(bk.checkin_date)) / 86400000);
  calcAndShowPrice();
}

function collectStep2() {
  bk.guest_name       = document.getElementById('f-name').value.trim();
  bk.guest_email      = document.getElementById('f-email').value.trim();
  bk.guest_phone      = document.getElementById('f-phone').value.trim();
  bk.country          = document.getElementById('f-country').value;
  bk.special_requests = document.getElementById('f-requests').value.trim();
  calcAndShowPrice();
}

// ── Validation ────────────────────────────────────────────────
function validateStep1() {
  let ok = true;
  clearAllErrors();
  if (!document.getElementById('f-destination').value)
    { showErr('err-destination', 'Please select a retreat.'); ok = false; }
  if (!document.getElementById('f-checkin').value)
    { showErr('err-checkin', 'Please select a check-in date.'); ok = false; }
  const ci = document.getElementById('f-checkin').value;
  const co = document.getElementById('f-checkout').value;
  if (!co)
    { showErr('err-checkout', 'Please select a checkout date.'); ok = false; }
  else if (co <= ci)
    { showErr('err-checkout', 'Check-out must be after check-in.'); ok = false; }
  return ok;
}

function validateStep2() {
  let ok = true;
  clearAllErrors();
  const name  = document.getElementById('f-name').value.trim();
  const email = document.getElementById('f-email').value.trim();
  const phone = document.getElementById('f-phone').value.trim();
  if (!name || name.length < 2)
    { showErr('err-name', 'Please enter your full name.'); ok = false; }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    { showErr('err-email', 'Please enter a valid email address.'); ok = false; }
  if (!phone || phone.replace(/\D/g, '').length < 7)
    { showErr('err-phone', 'Please enter a valid phone number.'); ok = false; }
  return ok;
}

function validateField(id) {
  const val = document.getElementById(id).value.trim();
  if (id === 'f-name'  && val.length < 2)
    showErr('err-name', 'Please enter your full name.');
  else if (id === 'f-email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val))
    showErr('err-email', 'Please enter a valid email.');
  else if (id === 'f-phone' && val.replace(/\D/g,'').length < 7)
    showErr('err-phone', 'Please enter a valid phone number.');
}

function showErr(id, msg) {
  const el = document.getElementById(id);
  if (el) { el.textContent = msg; el.style.display = 'block'; }
}

function clearAllErrors() {
  document.querySelectorAll('.form-error').forEach(e => {
    e.textContent = ''; e.style.display = 'none';
  });
}

// ── Step 3 Summary ────────────────────────────────────────────
function populateSummary() {
  const room = document.getElementById('f-room');
  const roomLabel = room?.options[room.selectedIndex]?.text || '—';

  set('sum-dest',    bk.destination_name || '—');
  set('sum-room',    roomLabel !== 'Select room (optional)…' ? roomLabel : '—');
  set('sum-dates',   formatDisplayDate(bk.checkin_date) + ' → ' + formatDisplayDate(bk.checkout_date));
  set('sum-nights',  bk.nights + ' night' + (bk.nights > 1 ? 's' : ''));
  set('sum-guests',  bk.num_guests + ' Guest' + (bk.num_guests > 1 ? 's' : ''));
  set('sum-name',    bk.guest_name);
  set('sum-email',   bk.guest_email);
  set('sum-phone',   bk.guest_phone);
  set('sum-country', bk.country);

  const addonsRow = document.getElementById('sum-addons-row');
  if (bk.addons.length) {
    set('sum-addons', bk.addons.map(a => ADDON_LABELS[a] || a).join(', '));
    addonsRow.style.display = 'flex';
  } else {
    addonsRow.style.display = 'none';
  }

  const reqRow = document.getElementById('sum-requests-row');
  if (bk.special_requests) {
    set('sum-requests', bk.special_requests);
    reqRow.style.display = 'flex';
  } else {
    reqRow.style.display = 'none';
  }

  set('sum-acc',          '₹' + bk.room_cost.toLocaleString('en-IN'));
  set('sum-addons-total', '₹' + bk.addons_cost.toLocaleString('en-IN'));
  set('sum-tax',          '₹' + bk.tax.toLocaleString('en-IN'));
  set('sum-grand',        '₹' + bk.total_price.toLocaleString('en-IN'));
}

function set(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

// ── Confirm & Save to Supabase ────────────────────────────────
async function confirmBooking() {
  const btn = document.getElementById('btn-confirm');
  btn.disabled    = true;
  btn.textContent = 'Processing…';

  const bookingRef = 'ARP' + Date.now();

  const payload = {
    booking_ref:      bookingRef,
    destination_id:   parseInt(bk.destination_id) || null,
    room_id:          null,
    guest_name:       bk.guest_name,
    guest_email:      bk.guest_email,
    guest_phone:      bk.guest_phone,
    country:          bk.country,
    checkin_date:     bk.checkin_date,
    checkout_date:    bk.checkout_date,
    num_guests:       bk.num_guests,
    addons:           bk.addons.map(a => ADDON_LABELS[a] || a),
    special_requests: bk.special_requests,
    total_price:      bk.total_price,
    status:           'Pending'
  };

  try {
    const { error } = await supabase.from('bookings').insert(payload);
    if (error) throw error;

    document.getElementById('modal-ref-code').textContent = bookingRef;
    document.getElementById('modal-email').textContent    = bk.guest_email;
    document.getElementById('booking-modal').style.display = 'flex';

  } catch (err) {
    console.error('Booking failed:', err);
    btn.disabled    = false;
    btn.textContent = 'Confirm Booking ✦';
    alert('Something went wrong. Please try again or WhatsApp us at +91 98765 43210');
  }
}

// ── Helper ────────────────────────────────────────────────────
function formatDisplayDate(d) {
  if (!d) return '—';
  return new Date(d + 'T00:00:00').toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric'
  });
}
