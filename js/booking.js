// ============================================================
// booking.js — Nitara Stays Booking Form
// ============================================================

let currentStep = 1;
const totalSteps = 3;

// Destination data (hardcoded so no Supabase needed for display)
const destinations = [
  { id: 1, name: 'The Dhanachuli House',   price: 12000 },
  { id: 2, name: 'The Forest Terrace',     price: 9500  },
  { id: 3, name: 'The Summit Suite',       price: 18000 },
  { id: 4, name: 'The Orchard Cottage',    price: 8000  },
  { id: 5, name: 'The Valley View Lodge',  price: 10500 },
  { id: 6, name: 'The Stargazers Retreat', price: 15000 },
  { id: 7, name: 'The Kasar Sanctuary',    price: 11000 },
  { id: 8, name: 'The Waterfall Cabin',    price: 8500  },
  { id: 9, name: "The Pilgrim's Rest",     price: 7500  }
];

const addons = {
  'Airport Transfer': 2500,
  'Spa Package':      5000,
  'Candlelight Dinner': 3500,
  'Adventure Package':  4000
};

// Booking state
let booking = {
  destination_id: null,
  destination_name: '',
  price_per_night: 0,
  checkin_date: '',
  checkout_date: '',
  num_guests: 1,
  room_type: '',
  guest_name: '',
  guest_email: '',
  guest_phone: '',
  country: '',
  special_requests: '',
  addons: [],
  addons_cost: 0,
  nights: 0,
  room_cost: 0,
  total_price: 0
};

// ── Init ──────────────────────────────────────────────────────
function initBooking() {
  populateDestinations();
  setupStep1Listeners();
  setupStep2Listeners();
  updateProgressBar();

  // Pre-fill from URL param if coming from destination detail
  const params = new URLSearchParams(window.location.search);
  const destId = params.get('destination');
  if (destId) {
    const sel = document.getElementById('destination-select');
    if (sel) { sel.value = destId; sel.dispatchEvent(new Event('change')); }
  }
}

// ── Populate destination dropdown ────────────────────────────
function populateDestinations() {
  const sel = document.getElementById('destination-select');
  if (!sel) return;
  destinations.forEach(d => {
    const opt = document.createElement('option');
    opt.value = d.id;
    opt.textContent = d.name + ' — ₹' + d.price.toLocaleString('en-IN') + '/night';
    opt.dataset.price = d.price;
    sel.appendChild(opt);
  });
}

// ── Step 1 listeners ─────────────────────────────────────────
function setupStep1Listeners() {
  const sel      = document.getElementById('destination-select');
  const checkin  = document.getElementById('checkin-date');
  const checkout = document.getElementById('checkout-date');
  const guests   = document.getElementById('num-guests');

  if (sel)      sel.addEventListener('change', calcPrice);
  if (checkin)  checkin.addEventListener('change', () => { enforceCheckout(); calcPrice(); });
  if (checkout) checkout.addEventListener('change', calcPrice);
  if (guests)   guests.addEventListener('change', calcPrice);

  // Set min check-in to today
  const today = new Date().toISOString().split('T')[0];
  if (checkin) checkin.min = today;
}

function enforceCheckout() {
  const checkin  = document.getElementById('checkin-date').value;
  const checkout = document.getElementById('checkout-date');
  if (checkin && checkout) {
    const minOut = new Date(checkin);
    minOut.setDate(minOut.getDate() + 1);
    checkout.min = minOut.toISOString().split('T')[0];
    if (checkout.value && checkout.value <= checkin) checkout.value = '';
  }
}

function calcPrice() {
  const sel      = document.getElementById('destination-select');
  const checkin  = document.getElementById('checkin-date').value;
  const checkout = document.getElementById('checkout-date').value;
  const guests   = parseInt(document.getElementById('num-guests').value) || 1;

  if (!sel.value || !checkin || !checkout) {
    clearPriceSummary(); return;
  }

  const dest = destinations.find(d => d.id == sel.value);
  if (!dest) return;

  const nights = Math.round((new Date(checkout) - new Date(checkin)) / 86400000);
  if (nights <= 0) { clearPriceSummary(); return; }

  booking.destination_id   = dest.id;
  booking.destination_name = dest.name;
  booking.price_per_night  = dest.price;
  booking.checkin_date     = checkin;
  booking.checkout_date    = checkout;
  booking.num_guests       = guests;
  booking.nights           = nights;
  booking.room_cost        = dest.price * nights;

  recalcTotal();
  showPriceSummary();
}

function recalcTotal() {
  booking.addons_cost  = booking.addons.reduce((s, a) => s + (addons[a] || 0), 0);
  booking.total_price  = booking.room_cost + booking.addons_cost;
}

function showPriceSummary() {
  const el = document.getElementById('price-summary');
  if (!el) return;
  el.style.display = 'block';
  document.getElementById('summary-nights').textContent     = booking.nights + ' night' + (booking.nights > 1 ? 's' : '');
  document.getElementById('summary-room-cost').textContent  = '₹' + booking.room_cost.toLocaleString('en-IN');
  document.getElementById('summary-addons-cost').textContent = '₹' + booking.addons_cost.toLocaleString('en-IN');
  document.getElementById('summary-total').textContent      = '₹' + booking.total_price.toLocaleString('en-IN');
}

function clearPriceSummary() {
  const el = document.getElementById('price-summary');
  if (el) el.style.display = 'none';
}

// ── Step 2 listeners ─────────────────────────────────────────
function setupStep2Listeners() {
  document.querySelectorAll('.addon-checkbox').forEach(cb => {
    cb.addEventListener('change', () => {
      booking.addons = [...document.querySelectorAll('.addon-checkbox:checked')]
        .map(c => c.value);
      recalcTotal();
      showPriceSummary();
      updateAddonCosts();
    });
  });
}

function updateAddonCosts() {
  document.querySelectorAll('.addon-price').forEach(el => {
    const name = el.dataset.addon;
    el.textContent = '₹' + (addons[name] || 0).toLocaleString('en-IN');
  });
}

// ── Step navigation ──────────────────────────────────────────
function nextStep() {
  if (!validateStep(currentStep)) return;
  collectStepData(currentStep);
  if (currentStep < totalSteps) {
    currentStep++;
    showStep(currentStep);
  }
}

function prevStep() {
  if (currentStep > 1) {
    currentStep--;
    showStep(currentStep);
  }
}

function showStep(step) {
  document.querySelectorAll('.booking-step').forEach(s => s.classList.remove('active'));
  const el = document.getElementById('step-' + step);
  if (el) { el.classList.add('active'); el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  updateProgressBar();
  if (step === totalSteps) renderSummary();
}

function updateProgressBar() {
  document.querySelectorAll('.progress-step').forEach((el, i) => {
    el.classList.toggle('active',  i + 1 === currentStep);
    el.classList.toggle('done',    i + 1 < currentStep);
  });
  const pct = ((currentStep - 1) / (totalSteps - 1)) * 100;
  const bar = document.getElementById('progress-fill');
  if (bar) bar.style.width = pct + '%';
}

// ── Collect data per step ─────────────────────────────────────
function collectStepData(step) {
  if (step === 1) {
    const sel = document.getElementById('destination-select');
    booking.destination_id   = sel.value;
    booking.destination_name = sel.options[sel.selectedIndex]?.text.split(' — ')[0] || '';
    booking.checkin_date     = document.getElementById('checkin-date').value;
    booking.checkout_date    = document.getElementById('checkout-date').value;
    booking.num_guests       = parseInt(document.getElementById('num-guests').value) || 1;
    booking.room_type        = document.getElementById('room-type')?.value || '';
  }
  if (step === 2) {
    booking.guest_name        = document.getElementById('guest-name').value.trim();
    booking.guest_email       = document.getElementById('guest-email').value.trim();
    booking.guest_phone       = document.getElementById('guest-phone').value.trim();
    booking.country           = document.getElementById('guest-country').value.trim();
    booking.special_requests  = document.getElementById('special-requests')?.value.trim() || '';
    booking.addons = [...document.querySelectorAll('.addon-checkbox:checked')].map(c => c.value);
    recalcTotal();
  }
}

// ── Validation ───────────────────────────────────────────────
function validateStep(step) {
  clearErrors();
  let valid = true;

  if (step === 1) {
    if (!document.getElementById('destination-select').value)
      { showError('err-destination', 'Please select a destination.'); valid = false; }
    if (!document.getElementById('checkin-date').value)
      { showError('err-checkin', 'Please select a check-in date.'); valid = false; }
    if (!document.getElementById('checkout-date').value)
      { showError('err-checkout', 'Please select a check-out date.'); valid = false; }
    if (booking.nights <= 0 && document.getElementById('checkin-date').value && document.getElementById('checkout-date').value)
      { showError('err-checkout', 'Check-out must be after check-in.'); valid = false; }
  }

  if (step === 2) {
    const name  = document.getElementById('guest-name').value.trim();
    const email = document.getElementById('guest-email').value.trim();
    const phone = document.getElementById('guest-phone').value.trim();
    const country = document.getElementById('guest-country').value.trim();

    if (!name)
      { showError('err-name', 'Please enter your full name.'); valid = false; }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      { showError('err-email', 'Please enter a valid email address.'); valid = false; }
    if (!phone || phone.length < 8)
      { showError('err-phone', 'Please enter a valid phone number.'); valid = false; }
    if (!country)
      { showError('err-country', 'Please enter your country.'); valid = false; }
  }

  return valid;
}

function showError(id, msg) {
  const el = document.getElementById(id);
  if (el) { el.textContent = msg; el.style.display = 'block'; }
}

function clearErrors() {
  document.querySelectorAll('.field-error').forEach(el => {
    el.textContent = ''; el.style.display = 'none';
  });
}

// ── Render Step 3 Summary ────────────────────────────────────
function renderSummary() {
  const s = booking;
  const el = document.getElementById('booking-summary');
  if (!el) return;

  el.innerHTML = `
    <div class="summary-section">
      <div class="summary-label">DESTINATION</div>
      <div class="summary-value">${s.destination_name}</div>
    </div>
    <div class="summary-section">
      <div class="summary-label">CHECK-IN</div>
      <div class="summary-value">${formatDisplayDate(s.checkin_date)}</div>
    </div>
    <div class="summary-section">
      <div class="summary-label">CHECK-OUT</div>
      <div class="summary-value">${formatDisplayDate(s.checkout_date)}</div>
    </div>
    <div class="summary-section">
      <div class="summary-label">DURATION</div>
      <div class="summary-value">${s.nights} Night${s.nights > 1 ? 's' : ''}</div>
    </div>
    <div class="summary-section">
      <div class="summary-label">GUESTS</div>
      <div class="summary-value">${s.num_guests} Guest${s.num_guests > 1 ? 's' : ''}</div>
    </div>
    <div class="summary-section">
      <div class="summary-label">GUEST NAME</div>
      <div class="summary-value">${s.guest_name}</div>
    </div>
    <div class="summary-section">
      <div class="summary-label">EMAIL</div>
      <div class="summary-value">${s.guest_email}</div>
    </div>
    <div class="summary-section">
      <div class="summary-label">PHONE</div>
      <div class="summary-value">${s.guest_phone}</div>
    </div>
    <div class="summary-section">
      <div class="summary-label">COUNTRY</div>
      <div class="summary-value">${s.country}</div>
    </div>
    ${s.addons.length ? `
    <div class="summary-section">
      <div class="summary-label">ADD-ONS</div>
      <div class="summary-value">${s.addons.join(', ')}</div>
    </div>` : ''}
    ${s.special_requests ? `
    <div class="summary-section">
      <div class="summary-label">SPECIAL REQUESTS</div>
      <div class="summary-value">${s.special_requests}</div>
    </div>` : ''}
    <div class="summary-price-breakdown">
      <div class="summary-row">
        <span>Room Cost (${s.nights} nights × ₹${s.price_per_night.toLocaleString('en-IN')})</span>
        <span>₹${s.room_cost.toLocaleString('en-IN')}</span>
      </div>
      ${s.addons_cost ? `
      <div class="summary-row">
        <span>Add-ons</span>
        <span>₹${s.addons_cost.toLocaleString('en-IN')}</span>
      </div>` : ''}
      <div class="summary-row summary-total-row">
        <span>TOTAL AMOUNT</span>
        <span>₹${s.total_price.toLocaleString('en-IN')}</span>
      </div>
    </div>
  `;
}

// ── Confirm & Save to Supabase ───────────────────────────────
async function confirmBooking() {
  const btn = document.getElementById('confirm-btn');
  btn.disabled = true;
  btn.textContent = 'Processing...';

  const bookingRef = 'ARP' + Date.now();

  const payload = {
    booking_ref:      bookingRef,
    destination_id:   parseInt(booking.destination_id),
    room_id:          null,
    guest_name:       booking.guest_name,
    guest_email:      booking.guest_email,
    guest_phone:      booking.guest_phone,
    country:          booking.country,
    checkin_date:     booking.checkin_date,
    checkout_date:    booking.checkout_date,
    num_guests:       booking.num_guests,
    addons:           booking.addons,
    special_requests: booking.special_requests,
    total_price:      booking.total_price,
    status:           'Pending'
  };

  const { data, error } = await supabase
    .from('bookings')
    .insert(payload)
    .select()
    .single();

  if (error) {
    console.error('Booking error:', error);
    btn.disabled = false;
    btn.textContent = 'Confirm Booking';
    showBookingError('Something went wrong. Please try again or contact us on WhatsApp.');
    return;
  }

  showSuccessModal(bookingRef);
}

function showBookingError(msg) {
  const el = document.getElementById('confirm-error');
  if (el) { el.textContent = msg; el.style.display = 'block'; }
}

// ── Success Modal ─────────────────────────────────────────────
function showSuccessModal(ref) {
  const modal = document.getElementById('success-modal');
  const refEl = document.getElementById('success-ref');
  if (refEl) refEl.textContent = ref;
  if (modal) modal.style.display = 'flex';
}

function closeSuccessModal() {
  window.location.href = 'index.html';
}

// ── Helper ────────────────────────────────────────────────────
function formatDisplayDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-IN', {
    weekday: 'short', day: '2-digit', month: 'long', year: 'numeric'
  });
}

// ── Boot ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initBooking();
  showStep(1);

  document.getElementById('next-step-1')?.addEventListener('click', nextStep);
  document.getElementById('next-step-2')?.addEventListener('click', nextStep);
  document.getElementById('prev-step-2')?.addEventListener('click', prevStep);
  document.getElementById('prev-step-3')?.addEventListener('click', prevStep);
  document.getElementById('confirm-btn')?.addEventListener('click', confirmBooking);
  document.getElementById('modal-close-btn')?.addEventListener('click', closeSuccessModal);
});
