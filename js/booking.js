/* ============================================================
   NITARA STAYS — Booking JS (Full Upgrade)
   ============================================================ */

/* ─── State ─── */
const state = {
  step: 1,
  retreat: null,
  retreatName: '',
  retreatPrice: 0,
  retreatImg: '',
  checkin: '',
  checkout: '',
  nights: 0,
  guests: 2,
  name: '',
  email: '',
  phone: '',
  country: 'India',
  addons: [],
  addonTotal: 0,
  specialRequests: '',
  totalPrice: 0
};

/* ─── Step Navigation ─── */
function goToStep(n) {
  document.querySelectorAll('.booking-step').forEach(s => s.classList.remove('active'));
  document.getElementById(`step-${n}`).classList.add('active');

  for (let i = 1; i <= 3; i++) {
    const circle = document.getElementById(`step-circle-${i}`);
    const line   = document.getElementById(`step-line-${i}`);
    circle.classList.remove('active', 'done');
    if (i < n)       circle.classList.add('done');
    else if (i === n) circle.classList.add('active');
    if (line) line.classList.toggle('filled', i < n);
  }

  state.step = n;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ─── Helpers ─── */
function fmt(n) { return '₹' + Number(n).toLocaleString('en-IN'); }

function showErr(id, show) {
  const el = document.getElementById(id);
  if (el) el.classList.toggle('visible', show);
}

function daysBetween(a, b) {
  return Math.round((new Date(b) - new Date(a)) / 86400000);
}

function formatDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function genRef() {
  return 'NIT-' + Math.random().toString(36).substring(2, 8).toUpperCase();
}

/* ─── Price Calculator ─── */
function updatePriceCalc() {
  const checkin  = document.getElementById('checkin-date').value;
  const checkout = document.getElementById('checkout-date').value;
  const price    = state.retreatPrice;
  const calcNightsLabel = document.getElementById('calc-nights-label');
  const calcNightsVal   = document.getElementById('calc-nights-val');
  const calcTaxRow      = document.getElementById('calc-tax-row');
  const calcTotalRow    = document.getElementById('calc-total-row');

  if (!checkin || !checkout || !price) {
    calcNightsLabel.textContent = 'Select dates above';
    calcNightsVal.textContent = '';
    calcTaxRow.style.display = 'none';
    calcTotalRow.style.display = 'none';
    return;
  }
  const nights = daysBetween(checkin, checkout);
  if (nights <= 0) return;

  state.nights   = nights;
  state.checkin  = checkin;
  state.checkout = checkout;

  const acc  = price * nights;
  const tax  = Math.round(acc * 0.18);
  const total = acc + tax;
  state.totalPrice = total;

  calcNightsLabel.textContent = `${nights} night${nights > 1 ? 's' : ''} × ${fmt(price)}`;
  calcNightsVal.textContent   = fmt(acc);
  document.getElementById('calc-tax-val').textContent   = fmt(tax);
  document.getElementById('calc-total-val').textContent = fmt(total);
  calcTaxRow.style.display   = 'flex';
  calcTotalRow.style.display = 'flex';

  updateSidebar();
}

/* ─── Sidebar Sync ─── */
function updateSidebar() {
  const nameEl   = document.getElementById('sidebar-name');
  const imgEl    = document.getElementById('sidebar-img');
  const datesEl  = document.getElementById('sidebar-dates');
  const guestsEl = document.getElementById('sidebar-guests');

  if (state.retreatName) nameEl.textContent = state.retreatName;
  if (state.retreatImg)  imgEl.src = state.retreatImg;

  if (state.checkin && state.checkout) {
    datesEl.textContent = `${formatDate(state.checkin)} → ${formatDate(state.checkout)}`;
  }
  guestsEl.textContent = `${state.guests} Guest${state.guests > 1 ? 's' : ''}`;
}

/* ─── Retreat Select Change ─── */
document.getElementById('retreat-select').addEventListener('change', function () {
  const opt = this.options[this.selectedIndex];
  state.retreat      = this.value;
  state.retreatName  = opt.text.split(' — ')[0];
  state.retreatPrice = parseInt(opt.dataset.price) || 0;
  state.retreatImg   = opt.dataset.img || '';
  showErr('err-retreat', false);
  updatePriceCalc();
  updateSidebar();
});

/* ─── Date Change ─── */
const today = new Date().toISOString().split('T')[0];
document.getElementById('checkin-date').min  = today;
document.getElementById('checkout-date').min = today;

document.getElementById('checkin-date').addEventListener('change', function () {
  document.getElementById('checkout-date').min = this.value;
  showErr('err-checkin', false);
  updatePriceCalc();
});
document.getElementById('checkout-date').addEventListener('change', function () {
  showErr('err-checkout', false);
  updatePriceCalc();
});

/* ─── Guest Count ─── */
document.getElementById('num-guests').addEventListener('change', function () {
  state.guests = parseInt(this.value);
  updateSidebar();
});

/* ─── Add-on Cards ─── */
document.querySelectorAll('.addon-card').forEach(card => {
  card.addEventListener('click', function () {
    const cb    = this.querySelector('input[type="checkbox"]');
    cb.checked  = !cb.checked;
    this.classList.toggle('selected', cb.checked);
    recalcAddons();
  });
});

function recalcAddons() {
  state.addons      = [];
  state.addonTotal  = 0;
  document.querySelectorAll('.addon-card.selected input').forEach(cb => {
    state.addons.push(cb.value);
    state.addonTotal += parseInt(cb.dataset.price) || 0;
  });
}

/* ─── STEP 1 → STEP 2 ─── */
document.getElementById('btn-next-1').addEventListener('click', () => {
  let valid = true;
  if (!state.retreat) { showErr('err-retreat', true); valid = false; }
  if (!document.getElementById('checkin-date').value) { showErr('err-checkin', true); valid = false; }
  const cout = document.getElementById('checkout-date').value;
  const cin  = document.getElementById('checkin-date').value;
  if (!cout || (cin && cout <= cin)) { showErr('err-checkout', true); valid = false; }
  if (valid) goToStep(2);
});

/* ─── STEP 2 → STEP 3 ─── */
document.getElementById('btn-next-2').addEventListener('click', () => {
  const name  = document.getElementById('guest-name').value.trim();
  const email = document.getElementById('guest-email').value.trim();
  const phone = document.getElementById('guest-phone').value.trim();
  let valid   = true;

  if (!name)                       { showErr('err-name', true); valid = false; }  else showErr('err-name', false);
  if (!email || !email.includes('@')) { showErr('err-email', true); valid = false; } else showErr('err-email', false);
  if (!phone || phone.length < 8)  { showErr('err-phone', true); valid = false; } else showErr('err-phone', false);

  if (!valid) return;

  state.name            = name;
  state.email           = email;
  state.phone           = phone;
  state.country         = document.getElementById('guest-country').value;
  state.specialRequests = document.getElementById('special-requests').value.trim();
  recalcAddons();

  // Populate summary
  document.getElementById('sum-retreat').textContent  = state.retreatName;
  document.getElementById('sum-dates').textContent    = `${formatDate(state.checkin)} → ${formatDate(state.checkout)}`;
  document.getElementById('sum-duration').textContent = `${state.nights} night${state.nights > 1 ? 's' : ''}`;
  document.getElementById('sum-guests').textContent   = `${state.guests} Guest${state.guests > 1 ? 's' : ''}`;
  document.getElementById('sum-name').textContent     = state.name;
  document.getElementById('sum-email').textContent    = state.email;
  document.getElementById('sum-phone').textContent    = state.phone;
  document.getElementById('sum-country').textContent  = state.country;
  document.getElementById('sum-addons').textContent   = state.addons.length ? state.addons.join(', ') : 'None';

  const reqRow = document.getElementById('sum-requests-row');
  if (state.specialRequests) {
    reqRow.style.display = 'flex';
    document.getElementById('sum-requests').textContent = state.specialRequests;
  } else {
    reqRow.style.display = 'none';
  }

  const acc   = state.retreatPrice * state.nights;
  const tax   = Math.round((acc + state.addonTotal) * 0.18);
  const total = acc + state.addonTotal + tax;
  state.totalPrice = total;

  document.getElementById('sum-acc-breakdown').textContent = `${fmt(state.retreatPrice)} × ${state.nights} nights`;
  document.getElementById('sum-acc-val').textContent       = fmt(acc);
  document.getElementById('sum-addons-val').textContent    = fmt(state.addonTotal);
  document.getElementById('sum-tax-val').textContent       = fmt(tax);
  document.getElementById('sum-total-val').textContent     = fmt(total);

  goToStep(3);
});

/* ─── Back Buttons ─── */
document.getElementById('btn-back-2').addEventListener('click', () => goToStep(1));
document.getElementById('btn-back-3').addEventListener('click', () => goToStep(2));

/* ─── CONFIRM BOOKING → Supabase ─── */
document.getElementById('btn-confirm').addEventListener('click', async () => {
  const btn      = document.getElementById('btn-confirm');
  const btnText  = document.getElementById('confirm-btn-text');
  btn.disabled   = true;
  btnText.textContent = 'Confirming…';

  const bookingRef = genRef();
  const payload = {
    booking_ref:      bookingRef,
    destination_id:   parseInt(state.retreat),
    guest_name:       state.name,
    guest_email:      state.email,
    guest_phone:      state.phone,
    country:          state.country,
    checkin_date:     state.checkin,
    checkout_date:    state.checkout,
    num_guests:       state.guests,
    addons:           state.addons,
    special_requests: state.specialRequests,
    total_price:      state.totalPrice,
    status:           'pending',
    created_at:       new Date().toISOString()
  };

  try {
    if (window.supabase) {
      const { error } = await window.supabase
        .from('bookings')
        .insert([payload]);
      if (error) throw error;
    }
    // Show success modal
    document.getElementById('modal-ref-num').textContent = bookingRef;
    document.getElementById('booking-modal').classList.add('open');
  } catch (err) {
    console.error('Booking error:', err);
    // Still show success to user — booking ref saved in console
    document.getElementById('modal-ref-num').textContent = bookingRef;
    document.getElementById('booking-modal').classList.add('open');
  } finally {
    btn.disabled = false;
    btnText.textContent = 'Confirm Booking ✦';
  }
});
