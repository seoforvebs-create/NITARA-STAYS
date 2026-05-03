// ============================================================
// admin.js — Nitara Stays Admin Dashboard
// ============================================================

const ADMIN_PASSWORD_KEY = 'nitara_admin_auth';

// ── Auth ────────────────────────────────────────────────────
async function checkAuth() {
  if (sessionStorage.getItem(ADMIN_PASSWORD_KEY) === 'true') {
    document.getElementById('auth-overlay').style.display = 'none';
    document.getElementById('dashboard').style.display = 'block';
    initDashboard();
    return;
  }
  document.getElementById('auth-overlay').style.display = 'flex';
  document.getElementById('dashboard').style.display = 'none';
}

async function handleLogin() {
  const input = document.getElementById('admin-password').value.trim();
  const errEl = document.getElementById('auth-error');
  if (!input) { errEl.textContent = 'Please enter the password.'; return; }

  const { data, error } = await supabase
    .from('admin_settings')
    .select('value')
    .eq('key', 'admin_password')
    .single();

  if (error || !data) { errEl.textContent = 'Could not verify. Try again.'; return; }

  if (input === data.value) {
    sessionStorage.setItem(ADMIN_PASSWORD_KEY, 'true');
    document.getElementById('auth-overlay').style.display = 'none';
    document.getElementById('dashboard').style.display = 'block';
    initDashboard();
  } else {
    errEl.textContent = 'Incorrect password.';
  }
}

function handleLogout() {
  sessionStorage.removeItem(ADMIN_PASSWORD_KEY);
  location.reload();
}

// ── Init ────────────────────────────────────────────────────
async function initDashboard() {
  await Promise.all([loadStats(), loadBookings(), loadMessages()]);
  setupFilters();
  document.getElementById('current-date').textContent =
    new Date().toLocaleDateString('en-IN', { weekday:'long', year:'numeric', month:'long', day:'numeric' });
}

// ── Stats ───────────────────────────────────────────────────
async function loadStats() {
  const { data: bookings } = await supabase.from('bookings').select('*');
  const { data: messages } = await supabase.from('contact_messages').select('id');

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const monthBookings = (bookings || []).filter(b => b.created_at >= monthStart);
  const revenue = monthBookings.reduce((sum, b) => sum + (b.total_price || 0), 0);
  const pending = (bookings || []).filter(b => b.status === 'Pending').length;

  document.getElementById('stat-total').textContent = (bookings || []).length;
  document.getElementById('stat-revenue').textContent = '₹' + revenue.toLocaleString('en-IN');
  document.getElementById('stat-pending').textContent = pending;
  document.getElementById('stat-messages').textContent = (messages || []).length;
}

// ── Bookings ─────────────────────────────────────────────────
let allBookings = [];

async function loadBookings() {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) { console.error(error); return; }
  allBookings = data || [];
  renderBookings(allBookings);
  populateDestinationFilter(allBookings);
  document.getElementById('booking-count').textContent =
    allBookings.length + ' booking' + (allBookings.length !== 1 ? 's' : '');
}

function renderBookings(bookings) {
  const tbody = document.getElementById('bookings-tbody');
  const empty = document.getElementById('bookings-empty');

  if (!bookings.length) {
    tbody.innerHTML = '';
    empty.style.display = 'block';
    return;
  }
  empty.style.display = 'none';

  tbody.innerHTML = bookings.map(b => `
    <tr>
      <td><span class="booking-ref">${b.booking_ref || '—'}</span></td>
      <td>
        <div class="guest-name">${b.guest_name || '—'}</div>
        <div class="guest-email">${b.guest_email || ''}</div>
        <div class="guest-phone">${b.guest_phone || ''}</div>
      </td>
      <td>${b.destination_id || '—'}</td>
      <td>${formatDate(b.checkin_date)}</td>
      <td>${formatDate(b.checkout_date)}</td>
      <td class="center">${b.num_guests || 1}</td>
      <td class="price">₹${(b.total_price || 0).toLocaleString('en-IN')}</td>
      <td>
        <select class="status-select status-${(b.status || 'Pending').toLowerCase()}"
          onchange="updateStatus(${b.id}, this)">
          <option ${b.status === 'Pending' ? 'selected' : ''}>Pending</option>
          <option ${b.status === 'Confirmed' ? 'selected' : ''}>Confirmed</option>
          <option ${b.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
        </select>
      </td>
      <td>
        <button class="btn-view" onclick="viewBooking(${b.id})">View</button>
      </td>
    </tr>
  `).join('');
}

async function updateStatus(id, selectEl) {
  const newStatus = selectEl.value;
  selectEl.className = 'status-select status-' + newStatus.toLowerCase();

  const { error } = await supabase
    .from('bookings')
    .update({ status: newStatus })
    .eq('id', id);

  if (error) {
    showToast('❌ Failed to update status', 'error');
    return;
  }
  showToast('✅ Status updated to ' + newStatus, 'success');
  allBookings = allBookings.map(b => b.id === id ? { ...b, status: newStatus } : b);
  loadStats();
}

function viewBooking(id) {
  const b = allBookings.find(x => x.id === id);
  if (!b) return;
  const modal = document.getElementById('booking-modal');
  document.getElementById('modal-content').innerHTML = `
    <div class="modal-header">
      <h2>${b.booking_ref}</h2>
      <span class="modal-status status-${(b.status || '').toLowerCase()}">${b.status}</span>
    </div>
    <div class="modal-grid">
      <div class="modal-section">
        <h3>Guest Details</h3>
        <p><strong>Name:</strong> ${b.guest_name}</p>
        <p><strong>Email:</strong> ${b.guest_email}</p>
        <p><strong>Phone:</strong> ${b.guest_phone}</p>
        <p><strong>Country:</strong> ${b.country}</p>
      </div>
      <div class="modal-section">
        <h3>Stay Details</h3>
        <p><strong>Destination:</strong> ${b.destination_id}</p>
        <p><strong>Check-In:</strong> ${formatDate(b.checkin_date)}</p>
        <p><strong>Check-Out:</strong> ${formatDate(b.checkout_date)}</p>
        <p><strong>Guests:</strong> ${b.num_guests}</p>
      </div>
      <div class="modal-section full">
        <h3>Add-ons & Requests</h3>
        <p><strong>Add-ons:</strong> ${(b.addons || []).join(', ') || 'None'}</p>
        <p><strong>Special Requests:</strong> ${b.special_requests || 'None'}</p>
      </div>
      <div class="modal-section full price-summary">
        <div>Total Amount</div>
        <div class="big-price">₹${(b.total_price || 0).toLocaleString('en-IN')}</div>
      </div>
    </div>
  `;
  modal.style.display = 'flex';
}

function closeModal() {
  document.getElementById('booking-modal').style.display = 'none';
}

// ── Filters ──────────────────────────────────────────────────
function setupFilters() {
  document.getElementById('filter-search').addEventListener('input', applyFilters);
  document.getElementById('filter-status').addEventListener('change', applyFilters);
  document.getElementById('filter-destination').addEventListener('change', applyFilters);
  document.getElementById('filter-date-from').addEventListener('change', applyFilters);
  document.getElementById('filter-date-to').addEventListener('change', applyFilters);
}

function populateDestinationFilter(bookings) {
  const ids = [...new Set(bookings.map(b => b.destination_id).filter(Boolean))];
  const sel = document.getElementById('filter-destination');
  ids.forEach(id => {
    const opt = document.createElement('option');
    opt.value = id;
    opt.textContent = 'Destination ' + id;
    sel.appendChild(opt);
  });
}

function applyFilters() {
  const search = document.getElementById('filter-search').value.toLowerCase();
  const status = document.getElementById('filter-status').value;
  const dest   = document.getElementById('filter-destination').value;
  const from   = document.getElementById('filter-date-from').value;
  const to     = document.getElementById('filter-date-to').value;

  let filtered = allBookings.filter(b => {
    const matchSearch = !search ||
      (b.guest_name || '').toLowerCase().includes(search) ||
      (b.guest_email || '').toLowerCase().includes(search) ||
      (b.booking_ref || '').toLowerCase().includes(search);
    const matchStatus = !status || b.status === status;
    const matchDest   = !dest   || String(b.destination_id) === dest;
    const matchFrom   = !from   || b.checkin_date >= from;
    const matchTo     = !to     || b.checkin_date <= to;
    return matchSearch && matchStatus && matchDest && matchFrom && matchTo;
  });

  renderBookings(filtered);
  document.getElementById('booking-count').textContent =
    filtered.length + ' booking' + (filtered.length !== 1 ? 's' : '');
}

function clearFilters() {
  document.getElementById('filter-search').value = '';
  document.getElementById('filter-status').value = '';
  document.getElementById('filter-destination').value = '';
  document.getElementById('filter-date-from').value = '';
  document.getElementById('filter-date-to').value = '';
  renderBookings(allBookings);
  document.getElementById('booking-count').textContent =
    allBookings.length + ' bookings';
}

// ── Messages ─────────────────────────────────────────────────
async function loadMessages() {
  const { data, error } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return;
  const container = document.getElementById('messages-list');
  if (!data || !data.length) {
    container.innerHTML = '<div class="empty-state">No messages yet.</div>';
    return;
  }
  container.innerHTML = data.map(m => `
    <div class="message-card">
      <div class="message-header">
        <div>
          <span class="message-name">${m.name}</span>
          <span class="message-subject">${m.subject || 'General Enquiry'}</span>
        </div>
        <span class="message-date">${formatDateTime(m.created_at)}</span>
      </div>
      <div class="message-meta">
        <span>✉ ${m.email}</span>
        ${m.phone ? `<span>📞 ${m.phone}</span>` : ''}
      </div>
      <div class="message-body">${m.message}</div>
      <div class="message-actions">
        <a href="mailto:${m.email}?subject=Re: ${m.subject || 'Your Enquiry — Nitara Stays'}"
           class="btn-reply">Reply via Email</a>
        ${m.phone ? `<a href="https://wa.me/91${m.phone.replace(/\D/g, '')}?text=Hello ${encodeURIComponent(m.name)}, thank you for contacting Nitara Stays!"
           class="btn-whatsapp" target="_blank">WhatsApp</a>` : ''}
      </div>
    </div>
  `).join('');
}

// ── CSV Export ───────────────────────────────────────────────
function exportCSV() {
  if (!allBookings.length) { showToast('No bookings to export', 'error'); return; }

  const headers = [
    'Booking Ref', 'Guest Name', 'Email', 'Phone', 'Country',
    'Destination', 'Check-In', 'Check-Out', 'Guests',
    'Add-ons', 'Special Requests', 'Total Price', 'Status', 'Created At'
  ];

  const rows = allBookings.map(b => [
    b.booking_ref, b.guest_name, b.guest_email, b.guest_phone, b.country,
    b.destination_id, b.checkin_date, b.checkout_date, b.num_guests,
    (b.addons || []).join('|'), b.special_requests, b.total_price,
    b.status, formatDateTime(b.created_at)
  ].map(v => `"${String(v || '').replace(/"/g, '""')}"`).join(','));

  const csv = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `nitara-bookings-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  showToast('✅ CSV downloaded!', 'success');
}

// ── Helpers ──────────────────────────────────────────────────
function formatDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric'
  });
}

function formatDateTime(d) {
  if (!d) return '—';
  return new Date(d).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
}

function showToast(msg, type = 'success') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'toast toast-' + type + ' show';
  setTimeout(() => t.classList.remove('show'), 3000);
}

// ── Tab Switching ────────────────────────────────────────────
function switchTab(tab) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  document.querySelector('[data-tab="' + tab + '"]').classList.add('active');
  document.getElementById('tab-' + tab).classList.add('active');
}

// ── Real-time New Bookings ───────────────────────────────────
function setupRealtime() {
  supabase
    .channel('bookings-channel')
    .on('postgres_changes', {
      event: 'INSERT', schema: 'public', table: 'bookings'
    }, payload => {
      allBookings.unshift(payload.new);
      renderBookings(allBookings);
      loadStats();
      showToast('🏔 New booking: ' + payload.new.booking_ref, 'success');
    })
    .subscribe();
}

// ── Boot ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
  setupRealtime();

  document.getElementById('login-btn').addEventListener('click', handleLogin);
  document.getElementById('admin-password').addEventListener('keydown', e => {
    if (e.key === 'Enter') handleLogin();
  });
  document.getElementById('logout-btn').addEventListener('click', handleLogout);
  document.getElementById('export-csv').addEventListener('click', exportCSV);
  document.getElementById('modal-close').addEventListener('click', closeModal);
  document.getElementById('booking-modal').addEventListener('click', e => {
    if (e.target === e.currentTarget) closeModal();
  });
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });
});
