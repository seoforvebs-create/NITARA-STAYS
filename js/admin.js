/* ============================================================
   NITARA STAYS — Admin Dashboard JS
   ============================================================ */

(function () {
  'use strict';

  /* ─── Password Gate ─── */
  const ADMIN_PASSWORD = 'nitara2024';
  const gate       = document.getElementById('admin-gate');
  const dashboard  = document.getElementById('admin-dashboard');
  const loginForm  = document.getElementById('admin-login-form');
  const gateError  = document.getElementById('admin-gate-error');
  const logoutBtn  = document.getElementById('admin-logout');

  // Check session
  if (sessionStorage.getItem('nitara_admin') === 'true') {
    showDashboard();
  }

  loginForm && loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const pass = document.getElementById('admin-password-input').value;
    if (pass === ADMIN_PASSWORD) {
      sessionStorage.setItem('nitara_admin', 'true');
      showDashboard();
    } else {
      // Also try Supabase admin_settings table
      let valid = false;
      try {
        if (window.supabase) {
          const { data } = await supabase
            .from('admin_settings')
            .select('value')
            .eq('key', 'admin_password')
            .single();
          if (data && data.value === pass) valid = true;
        }
      } catch (_) {}

      if (valid) {
        sessionStorage.setItem('nitara_admin', 'true');
        showDashboard();
      } else {
        if (gateError) gateError.hidden = false;
        document.getElementById('admin-password-input').value = '';
        document.getElementById('admin-password-input').focus();
      }
    }
  });

  logoutBtn && logoutBtn.addEventListener('click', () => {
    sessionStorage.removeItem('nitara_admin');
    if (dashboard) dashboard.hidden = true;
    if (gate) gate.hidden = false;
  });

  function showDashboard() {
    if (gate)      gate.hidden = true;
    if (dashboard) { dashboard.hidden = false; initDashboard(); }
  }

  /* ─── Date Display ─── */
  function initDashboard() {
    const dateEl = document.getElementById('admin-date-display');
    if (dateEl) {
      dateEl.textContent = new Date().toLocaleDateString('en-IN', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
      });
    }
    initNavigation();
    loadOverview();
  }

  /* ─── Sidebar Navigation ─── */
  function initNavigation() {
    const navItems = document.querySelectorAll('.admin-nav-item[data-section]');
    navItems.forEach(item => {
      item.addEventListener('click', () => {
        const section = item.dataset.section;
        switchSection(section);
      });
    });

    const inlineLinks = document.querySelectorAll('.admin-nav-item-inline[data-section]');
    inlineLinks.forEach(link => {
      link.addEventListener('click', () => switchSection(link.dataset.section));
    });
  }

  function switchSection(name) {
    document.querySelectorAll('.admin-nav-item[data-section]').forEach(item => {
      item.classList.toggle('active', item.dataset.section === name);
      item.setAttribute('aria-pressed', String(item.dataset.section === name));
    });
    document.querySelectorAll('.admin-section').forEach(sec => {
      const isActive = sec.id === `section-${name}`;
      sec.classList.toggle('active', isActive);
      sec.hidden = !isActive;
    });
    loadSection(name);
  }

  /* ─── Section Loaders ─── */
  function loadSection(name) {
    if (name === 'overview')   loadOverview();
    if (name === 'bookings')   loadAllBookings();
    if (name === 'messages')   loadMessages();
    if (name === 'newsletter') loadNewsletter();
  }

  /* ─── Static Mock Data (fallback when Supabase not configured) ─── */
  const MOCK_BOOKINGS = [
    { id: 1, booking_ref: 'ARP1701234001', guest_name: 'Arjun Mehta', guest_email: 'arjun@example.com', destination_id: 1, checkin_date: '2025-05-10', checkout_date: '2025-05-14', num_guests: 2, total_price: 74000, status: 'confirmed', created_at: new Date().toISOString() },
    { id: 2, booking_ref: 'ARP1701245002', guest_name: 'Priya Sharma', guest_email: 'priya@example.com', destination_id: 3, checkin_date: '2025-05-18', checkout_date: '2025-05-21', num_guests: 2, total_price: 98000, status: 'pending', created_at: new Date().toISOString() },
    { id: 3, booking_ref: 'ARP1701256003', guest_name: 'Rahul & Ananya Rao', guest_email: 'rahul@example.com', destination_id: 2, checkin_date: '2025-06-01', checkout_date: '2025-06-05', num_guests: 3, total_price: 62500, status: 'confirmed', created_at: new Date().toISOString() },
    { id: 4, booking_ref: 'ARP1701267004', guest_name: 'Siddharth Kapoor', guest_email: 'sid@example.com', destination_id: 4, checkin_date: '2025-04-20', checkout_date: '2025-04-23', num_guests: 2, total_price: 87000, status: 'completed', created_at: new Date().toISOString() },
    { id: 5, booking_ref: 'ARP1701278005', guest_name: 'Kavita Nair', guest_email: 'kavita@example.com', destination_id: 1, checkin_date: '2025-03-15', checkout_date: '2025-03-18', num_guests: 1, total_price: 55500, status: 'cancelled', created_at: new Date().toISOString() },
  ];

  const MOCK_MESSAGES = [
    { id: 1, name: 'Vikram Singh', email: 'vikram@example.com', phone: '+91 98001 23456', subject: 'Booking Enquiry', message: 'Hi, I am planning a trip to Mukteshwar for the last week of June with my family (2 adults, 1 child). Do you have availability at The Summit Suite? What would be the total cost including meals?', created_at: new Date(Date.now() - 3600000).toISOString() },
    { id: 2, name: 'Neha Gupta', email: 'neha@example.com', phone: null, subject: 'Special Occasion Request', message: 'It\'s our 10th anniversary in August. We would love a special arrangement — perhaps a private dinner with mountain views and a cake? Could you help plan this?', created_at: new Date(Date.now() - 86400000).toISOString() },
    { id: 3, name: 'Rohan Bhatia', email: 'rohan@example.com', phone: '+91 77001 88765', subject: 'Group / Corporate Stay', message: 'We are a team of 12 from a Bengaluru startup looking for an offsite venue in October. We need a mix of work space (basic), accommodation, and team activities. Can Nitara accommodate?', created_at: new Date(Date.now() - 172800000).toISOString() },
  ];

  /* ─── Load Overview ─── */
  async function loadOverview() {
    let bookings = MOCK_BOOKINGS;
    let messages = MOCK_MESSAGES;

    try {
      if (window.supabase) {
        const { data: bData } = await supabase.from('bookings').select('*').order('created_at', { ascending: false }).limit(50);
        if (bData && bData.length) bookings = bData;
        const { data: mData } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false }).limit(50);
        if (mData && mData.length) messages = mData;
      }
    } catch (_) {}

    // KPI
    const totalRevenue = bookings.filter(b => b.status !== 'cancelled').reduce((s, b) => s + (b.total_price || 0), 0);
    const pendingEnq   = messages.length;

    setKPI('kpi-bookings', bookings.length, 'kpi-bookings-trend', `${bookings.filter(b=>b.status==='confirmed').length} confirmed`);
    setKPI('kpi-revenue',  '₹' + formatINR(totalRevenue), 'kpi-revenue-trend', 'All time');
    setKPI('kpi-enquiries', pendingEnq, 'kpi-enquiries-trend', pendingEnq ? 'Awaiting response' : 'All clear');

    // Recent bookings table
    const tbody = document.getElementById('overview-bookings-body');
    if (!tbody) return;
    const recent = bookings.slice(0, 5);
    tbody.innerHTML = recent.map(b => `
      <tr>
        <td><code style="font-size:0.75rem;color:var(--gold)">${b.booking_ref || '—'}</code></td>
        <td>${escHtml(b.guest_name || '—')}</td>
        <td>Retreat #${b.destination_id || '—'}</td>
        <td>${formatDate(b.checkin_date)}</td>
        <td>₹${formatINR(b.total_price || 0)}</td>
        <td><span class="status-badge status-badge--${b.status || 'pending'}">${b.status || 'pending'}</span></td>
      </tr>
    `).join('') || '<tr><td colspan="6" class="admin-table-loading">No bookings yet.</td></tr>';

    // Refresh button
    const refreshBtn = document.getElementById('refresh-btn');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', () => loadOverview(), { once: false });
    }
  }

  function setKPI(valueId, value, trendId, trend) {
    const valEl   = document.getElementById(valueId);
    const trendEl = document.getElementById(trendId);
    if (valEl)   valEl.textContent   = value;
    if (trendEl) trendEl.textContent = trend;
  }

  /* ─── Load All Bookings ─── */
  let allBookings = [];

  async function loadAllBookings() {
    allBookings = MOCK_BOOKINGS;
    try {
      if (window.supabase) {
        const { data } = await supabase.from('bookings').select('*').order('created_at', { ascending: false });
        if (data && data.length) allBookings = data;
      }
    } catch (_) {}

    renderBookingsTable(allBookings);

    // Filter + Search
    const statusFilter = document.getElementById('booking-status-filter');
    const searchInput  = document.getElementById('booking-search');

    function filterBookings() {
      const status = statusFilter ? statusFilter.value : '';
      const query  = searchInput ? searchInput.value.toLowerCase() : '';
      const filtered = allBookings.filter(b => {
        const matchStatus = !status || b.status === status;
        const matchSearch = !query ||
          (b.guest_name || '').toLowerCase().includes(query) ||
          (b.booking_ref || '').toLowerCase().includes(query) ||
          (b.guest_email || '').toLowerCase().includes(query);
        return matchStatus && matchSearch;
      });
      renderBookingsTable(filtered);
    }

    if (statusFilter) statusFilter.addEventListener('change', filterBookings);
    if (searchInput)  searchInput.addEventListener('input', filterBookings);

    // Export CSV
    const exportBtn = document.getElementById('export-bookings-btn');
    if (exportBtn) {
      exportBtn.replaceWith(exportBtn.cloneNode(true));
      document.getElementById('export-bookings-btn')
        .addEventListener('click', () => exportCSV(allBookings, 'nitara_bookings'));
    }
  }

  function renderBookingsTable(data) {
    const tbody  = document.getElementById('all-bookings-body');
    const metaEl = document.getElementById('bookings-meta');
    if (!tbody) return;

    if (!data.length) {
      tbody.innerHTML = '<tr><td colspan="9" class="admin-table-loading">No bookings found.</td></tr>';
      if (metaEl) metaEl.textContent = '';
      return;
    }

    tbody.innerHTML = data.map(b => `
      <tr>
        <td><code style="font-size:0.72rem;color:var(--gold)">${escHtml(b.booking_ref || '—')}</code></td>
        <td>${escHtml(b.guest_name || '—')}</td>
        <td style="color:rgba(255,255,255,0.4);font-size:0.8rem">${escHtml(b.guest_email || '—')}</td>
        <td>Retreat #${b.destination_id || '—'}</td>
        <td>${formatDate(b.checkin_date)}</td>
        <td>${formatDate(b.checkout_date)}</td>
        <td style="text-align:center">${b.num_guests || '—'}</td>
        <td><strong>₹${formatINR(b.total_price || 0)}</strong></td>
        <td>
          <select class="status-select" data-id="${b.id}" aria-label="Update status for ${escHtml(b.booking_ref || '')}">
            <option value="pending"   ${b.status==='pending'   ? 'selected' : ''}>Pending</option>
            <option value="confirmed" ${b.status==='confirmed' ? 'selected' : ''}>Confirmed</option>
            <option value="completed" ${b.status==='completed' ? 'selected' : ''}>Completed</option>
            <option value="cancelled" ${b.status==='cancelled' ? 'selected' : ''}>Cancelled</option>
          </select>
        </td>
      </tr>
    `).join('');

    if (metaEl) metaEl.textContent = `Showing ${data.length} booking${data.length !== 1 ? 's' : ''}`;

    // Inline status update
    tbody.querySelectorAll('.status-select').forEach(sel => {
      sel.addEventListener('change', async () => {
        const id     = sel.dataset.id;
        const status = sel.value;
        try {
          if (window.supabase) {
            await supabase.from('bookings').update({ status }).eq('id', id);
          }
          // Update local
          const booking = allBookings.find(b => String(b.id) === String(id));
          if (booking) booking.status = status;
          window.showToast && window.showToast('Status updated to ' + status);
        } catch (_) {
          window.showToast && window.showToast('Failed to update status.');
        }
      });
    });
  }

  /* ─── Load Messages ─── */
  async function loadMessages() {
    let messages = MOCK_MESSAGES;
    try {
      if (window.supabase) {
        const { data } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false });
        if (data && data.length) messages = data;
      }
    } catch (_) {}

    const container = document.getElementById('messages-list');
    if (!container) return;

    if (!messages.length) {
      container.innerHTML = '<p style="color:rgba(255,255,255,0.3);text-align:center;padding:48px;">No messages yet.</p>';
      return;
    }

    container.innerHTML = messages.map(m => `
      <div class="message-card" role="listitem">
        <div class="message-card-header">
          <div class="message-card-meta">
            <p class="message-card-name">${escHtml(m.name || '—')}</p>
            <p class="message-card-contact">${escHtml(m.email || '')}${m.phone ? ' · ' + escHtml(m.phone) : ''}</p>
          </div>
          <p class="message-card-date">${formatDateTime(m.created_at)}</p>
        </div>
        <p class="message-card-subject">${escHtml(m.subject || 'General')}</p>
        <p class="message-card-body">${escHtml(m.message || '')}</p>
      </div>
    `).join('');

    // Export CSV
    const exportBtn = document.getElementById('export-messages-btn');
    if (exportBtn) {
      exportBtn.replaceWith(exportBtn.cloneNode(true));
      document.getElementById('export-messages-btn')
        .addEventListener('click', () => exportCSV(messages, 'nitara_messages'));
    }
  }

  /* ─── Load Newsletter ─── */
  async function loadNewsletter() {
    let subscribers = [];
    try {
      if (window.supabase) {
        const { data } = await supabase.from('newsletter_subscribers').select('*').order('subscribed_at', { ascending: false });
        if (data) subscribers = data;
      }
    } catch (_) {}

    const tbody  = document.getElementById('newsletter-body');
    const metaEl = document.getElementById('newsletter-meta');
    if (!tbody) return;

    if (!subscribers.length) {
      tbody.innerHTML = '<tr><td colspan="3" class="admin-table-loading">No subscribers yet.</td></tr>';
      if (metaEl) metaEl.textContent = '';
      return;
    }

    tbody.innerHTML = subscribers.map((s, i) => `
      <tr>
        <td style="color:rgba(255,255,255,0.3)">${i + 1}</td>
        <td>${escHtml(s.email || '—')}</td>
        <td style="color:rgba(255,255,255,0.4);font-size:0.8rem">${formatDateTime(s.subscribed_at)}</td>
      </tr>
    `).join('');

    if (metaEl) metaEl.textContent = `${subscribers.length} subscriber${subscribers.length !== 1 ? 's' : ''}`;

    const exportBtn = document.getElementById('export-newsletter-btn');
    if (exportBtn) {
      exportBtn.replaceWith(exportBtn.cloneNode(true));
      document.getElementById('export-newsletter-btn')
        .addEventListener('click', () => exportCSV(subscribers, 'nitara_newsletter'));
    }
  }

  /* ─── Export CSV ─── */
  function exportCSV(data, filename) {
    if (!data || !data.length) return;
    const headers = Object.keys(data[0]);
    const rows = data.map(row =>
      headers.map(h => {
        const val = row[h] == null ? '' : String(row[h]);
        return '"' + val.replace(/"/g, '""') + '"';
      }).join(',')
    );
    const csv = [headers.join(','), ...rows].join('\r\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url  = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href     = url;
    link.download = filename + '_' + new Date().toISOString().slice(0,10) + '.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /* ─── Utilities ─── */
  function escHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function formatINR(num) {
    return Number(num).toLocaleString('en-IN');
  }

  function formatDate(str) {
    if (!str) return '—';
    try {
      return new Date(str).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch (_) { return str; }
  }

  function formatDateTime(str) {
    if (!str) return '—';
    try {
      return new Date(str).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch (_) { return str; }
  }

  /* ─── Toast (standalone for admin, no global.js loaded) ─── */
  window.showToast = function(msg, duration) {
    let toast = document.getElementById('admin-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'admin-toast';
      Object.assign(toast.style, {
        position: 'fixed', bottom: '32px', left: '50%',
        transform: 'translateX(-50%) translateY(20px)',
        background: '#1a1a1a', color: '#fff',
        padding: '14px 28px', borderLeft: '3px solid #C8A96E',
        fontSize: '0.88rem', opacity: '0', transition: 'all 0.3s ease',
        zIndex: '9999', whiteSpace: 'nowrap', letterSpacing: '0.04em'
      });
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) translateY(20px)';
    }, duration || 3500);
  };

  /* ─── Page Loader ─── */
  window.addEventListener('load', () => {
    const loader = document.getElementById('page-loader');
    if (loader) setTimeout(() => { loader.style.opacity = '0'; loader.style.visibility = 'hidden'; }, 600);
  });

})();
