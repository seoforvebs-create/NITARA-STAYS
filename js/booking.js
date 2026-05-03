/* ============================================================
   NITARA STAYS — Booking JS
   ============================================================ */

const DEST_DATA = {
  1: { name: 'The Dhanachuli House',  price: 18500, img: 'https://www.genspark.ai/api/files/s/9dBT4k1w' },
  2: { name: 'The Forest Terrace',    price: 14500, img: 'https://www.genspark.ai/api/files/s/aIdMy56z' },
  3: { name: 'The Summit Suite',      price: 24500, img: 'https://www.genspark.ai/api/files/s/BzrQBgzk' },
  4: { name: 'The Alpine Chalet',     price: 21000, img: 'https://www.genspark.ai/api/files/s/3WTkihgw' },
  5: { name: 'The Valley Retreat',    price: 16500, img: 'https://www.genspark.ai/api/files/s/k6ltd7CC' },
  6: { name: 'The Orchard Cottage',   price: 12500, img: 'https://www.genspark.ai/api/files/s/aIdMy56z' },
  7: { name: 'The Heritage Haveli',   price: 13500, img: 'https://www.genspark.ai/api/files/s/9dBT4k1w' },
  8: { name: 'The Starlight Deck',    price: 28000, img: 'https://www.genspark.ai/api/files/s/BzrQBgzk' },
  9: { name: 'The Mist Bungalow',     price: 15500, img: 'https://www.genspark.ai/api/files/s/k6ltd7CC' },
};

let currentStep = 1;
let selectedAddons = [];

/* ─── Step Navigation ─── */
function goToStep(n) {
  document.querySelectorAll('.booking-step').forEach((s, i) => s.classList.toggle('active', i === n - 1));
  // Progress circles
  for (let i = 1; i <= 3; i++) {
    const sc = document.getElementById(`sc-${i}`);
    if (!sc) continue;
    sc.classList.remove('active', 'done');
    if (i < n) sc.classList.add('done');
    else if (i === n) sc.classList.add('active');
  }
  // Progress lines
  for (let i = 1; i <= 2; i++) {
    const sl = document.getElementById(`sl-${i}`);
    if (sl) sl.classList.toggle('filled', i < n);
  }
  currentStep = n;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ─── Validation Helpers ─── */
function showError(id, show) {
  const el = document.getElementById(id);
  if (el) el.classList.toggle('visible', show);
}
function markError(inputId, errId, condition) {
  const input = document.getElementById(inputId);
  if (input) input.classList.toggle('error', condition);
  showError(errId, condition);
  return condition;
}

/* ─── Price Calculation ─── */
function recalcPrice() {
  const destId   = parseInt(document.getElementById('f-destination').value);
  const checkin  = document.getElementById('f-checkin').value;
  const checkout = document.getElementById('f-checkout').value;
  const calcEl   = document.getElementById('price-calc');
  const nightDisp = document.getElementById('f-nights-display');

  if (!destId || !checkin || !checkout) { if (calcEl) calcEl.style.display = 'none'; return; }
  const ci = new Date(checkin), co = new Date(checkout);
  if (co <= ci) return;

  const nights     = Math.round((co - ci) / (1000 * 60 * 60 * 24));
  const pricePN    = DEST_DATA[destId]?.price || 15000;
  const addonTotal = selectedAddons.reduce((s, a) => s + (parseInt(a.price) || 0), 0);
  const subtotal   = nights * pricePN + addonTotal;
  const tax        = Math.round(subtotal * 0.18);
  const total      = subtotal + tax;

  if (nightDisp) nightDisp.textContent = `${nights} night${nights > 1 ? 's' : ''}`;
  if (calcEl) {
    calcEl.style.display = 'block';
    document.getElementById('calc-nights-label').textContent = `${nights} nights × ₹${pricePN.toLocaleString('en-IN')} + Add-ons`;
    document.getElementById('calc-subtotal').textContent     = `₹${subtotal.toLocaleString('en-IN')}`;
    document.getElementById('calc-tax').textContent          = `₹${tax.toLocaleString('en-IN')}`;
    document.getElementById('calc-total').textContent        = `₹${total.toLocaleString('en-IN')}`;
  }
}

/* ─── Addons ─── */
window.toggleAddon = function(card) {
  card.classList.toggle('selected');
  const cb    = card.querySelector('input[type="checkbox"]');
  if (cb) cb.checked = card.classList.contains('selected');
  selectedAddons = Array.from(document.querySelectorAll('.addon-card.selected')).map(c => ({
    name: c.dataset.addon, price: c.dataset.price
  }));
  recalcPrice();
};

/* ─── Destination change ─── */
document.getElementById('f-destination')?.addEventListener('change', (e) => {
  const id = parseInt(e.target.value);
  const dest = DEST_DATA[id];
  if (dest) {
    document.getElementById('sidebar-name').textContent = dest.name;
    document.getElementById('sidebar-img').src = dest.img;
  }
  recalcPrice();
});
document.getElementById('f-checkin')?.addEventListener('change', () => {
  const co = document.getElementById('f-checkout');
  const ci = document.getElementById('f-checkin').value;
  if (co && ci) co.min = ci;
  recalcPrice();
  updateSidebarDates();
});
document.getElementById('f-checkout')?.addEventListener('change', () => { recalcPrice(); updateSidebarDates(); });

function updateSidebarDates() {
  const ci = document.getElementById('f-checkin')?.value;
  const co = document.getElementById('f-checkout')?.value;
  const el = document.getElementById('sidebar-dates');
  if (!el) return;
  if (ci && co) {
    const nights = Math.round((new Date(co) - new Date(ci)) / (1000 * 60 * 60 * 24));
    el.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke-width="1.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>${ci} → ${co} (${nights} nights)`;
  }
}

/* ─── Step 1 Next ─── */
document.getElementById('btn-next-1')?.addEventListener('click', () => {
  let hasErr = false;
  if (markError('f-destination', 'err-destination', !document.getElementById('f-destination').value)) hasErr = true;
  if (markError('f-checkin', 'err-checkin', !document.getElementById('f-checkin').value)) hasErr = true;
  const ci = document.getElementById('f-checkin').value;
  const co = document.getElementById('f-checkout').value;
  if (markError('f-checkout', 'err-checkout', !co || new Date(co) <= new Date(ci))) hasErr = true;
  if (!hasErr) goToStep(2);
});

/* ─── Step 2 ─── */
document.getElementById('btn-back-2')?.addEventListener('click', () => goToStep(1));
document.getElementById('btn-next-2')?.addEventListener('click', () => {
  let hasErr = false;
  if (markError('f-name', 'err-name', !document.getElementById('f-name').value.trim())) hasErr = true;
  const email = document.getElementById('f-email').value.trim();
  if (markError('f-email', 'err-email', !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) hasErr = true;
  if (markError('f-phone', 'err-phone', !document.getElementById('f-phone').value.trim())) hasErr = true;
  if (!hasErr) { buildSummary(); goToStep(3); }
});

/* ─── Build Summary ─── */
function buildSummary() {
  const destId  = parseInt(document.getElementById('f-destination').value);
  const roomVal = document.getElementById('f-room').value;
  const ci      = document.getElementById('f-checkin').value;
  const co      = document.getElementById('f-checkout').value;
  const guests  = document.getElementById('f-guests').value;
  const name    = document.getElementById('f-name').value.trim();
  const email   = document.getElementById('f-email').value.trim();
  const phone   = document.getElementById('f-phone').value.trim();
  const country = document.getElementById('f-country').value;
  const requests = document.getElementById('f-requests').value.trim();

  const dest   = DEST_DATA[destId] || {};
  const nights = Math.round((new Date(co) - new Date(ci)) / (1000 * 60 * 60 * 24));
  const pricePN = dest.price || 0;
  const accTotal   = nights * pricePN;
  const addonTotal = selectedAddons.reduce((s, a) => s + parseInt(a.price || 0), 0);
  const subtotal   = accTotal + addonTotal;
  const tax        = Math.round(subtotal * 0.18);
  const grand      = subtotal + tax;

  setText('sum-dest',    dest.name || '—');
  setText('sum-room',    roomVal || 'Best available');
  setText('sum-dates',   `${ci} → ${co}`);
  setText('sum-nights',  `${nights} night${nights > 1 ? 's' : ''}`);
  setText('sum-guests',  `${guests} guest${guests > 1 ? 's' : ''}`);
  setText('sum-name',    name);
  setText('sum-email',   email);
  setText('sum-phone',   phone);
  setText('sum-country', country);
  setText('sum-acc',     `₹${accTotal.toLocaleString('en-IN')}`);
  setText('sum-addons-total', `₹${addonTotal.toLocaleString('en-IN')}`);
  setText('sum-tax',     `₹${tax.toLocaleString('en-IN')}`);
  setText('sum-grand',   `₹${grand.toLocaleString('en-IN')}`);

  if (selectedAddons.length) {
    setText('sum-addons', selectedAddons.map(a => a.name.replace(/_/g, ' ')).join(', '));
    document.getElementById('sum-addons-row').style.display = 'flex';
  }
  if (requests) {
    setText('sum-requests', requests);
    document.getElementById('sum-requests-row').style.display = 'flex';
  }
}

function setText(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

/* ─── Step 3 ─── */
document.getElementById('btn-back-3')?.addEventListener('click', () => goToStep(2));

document.getElementById('btn-confirm')?.addEventListener('click', async () => {
  const btn = document.getElementById('btn-confirm');
  btn.textContent = 'Confirming…';
  btn.disabled = true;

  const destId  = parseInt(document.getElementById('f-destination').value);
  const ci      = document.getElementById('f-checkin').value;
  const co      = document.getElementById('f-checkout').value;
  const nights  = Math.round((new Date(co) - new Date(ci)) / (1000 * 60 * 60 * 24));
  const pricePN = DEST_DATA[destId]?.price || 0;
  const addonTotal = selectedAddons.reduce((s, a) => s + parseInt(a.price || 0), 0);
  const subtotal = nights * pricePN + addonTotal;
  const tax = Math.round(subtotal * 0.18);
  const grand = subtotal + tax;
  const bookingRef = 'ARP' + Date.now();
  const email = document.getElementById('f-email').value.trim();

  const booking = {
    booking_ref:      bookingRef,
    destination_id:   destId,
    room_id:          null,
    guest_name:       document.getElementById('f-name').value.trim(),
    guest_email:      email,
    guest_phone:      document.getElementById('f-phone').value.trim(),
    country:          document.getElementById('f-country').value,
    checkin_date:     ci,
    checkout_date:    co,
    num_guests:       parseInt(document.getElementById('f-guests').value),
    addons:           selectedAddons.map(a => a.name),
    special_requests: document.getElementById('f-requests').value.trim(),
    total_price:      grand,
    status:           'pending',
    created_at:       new Date().toISOString()
  };

  try {
    if (window.supabase) {
      const { error } = await supabase.from('bookings').insert([booking]);
      if (error) console.warn('Supabase booking error:', error.message);
    }
  } catch (e) { console.warn('Supabase unavailable'); }

  // Show modal
  document.getElementById('modal-ref-code').textContent  = bookingRef;
  document.getElementById('modal-email').textContent     = email;
  document.getElementById('booking-modal').classList.add('open');

  btn.textContent = 'Confirm Booking ✦';
  btn.disabled = false;
});

/* ─── Pre-fill from URL params ─── */
(function() {
  const p = new URLSearchParams(window.location.search);
  if (p.get('checkin'))  { document.getElementById('f-checkin').value  = p.get('checkin'); }
  if (p.get('checkout')) { document.getElementById('f-checkout').value = p.get('checkout'); }
  if (p.get('guests'))   { document.getElementById('f-guests').value   = p.get('guests'); }
  recalcPrice();
  updateSidebarDates();
})();

/* ─── Set min dates ─── */
(function() {
  const today    = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const ci = document.getElementById('f-checkin');
  const co = document.getElementById('f-checkout');
  if (ci) ci.min = today;
  if (co) co.min = tomorrow;
})();
