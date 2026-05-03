/* ============================================================
   NITARA STAYS — Experiences JS
   ============================================================ */

/* ─── Enquire Now ─── */
window.enquireExp = function(name) {
  window.location.href = `contact.html?subject=${encodeURIComponent('Enquiry: ' + name)}`;
};

/* ─── Drag & Drop Itinerary Builder ─── */
(function () {
  const pool      = document.getElementById('drag-pool');
  const dropZone  = document.getElementById('itinerary-drop-zone');
  const itemsEl   = document.getElementById('itinerary-items');
  const totalsEl  = document.getElementById('itinerary-totals');
  const emailForm = document.getElementById('itin-email-form');
  const sendNote  = document.getElementById('itin-send-note');
  const placeholder = document.getElementById('drop-placeholder');
  const countEl   = document.getElementById('itin-count');
  const durEl     = document.getElementById('itin-duration');
  const costEl    = document.getElementById('itin-cost');
  if (!pool || !dropZone) return;

  let itinerary = [];
  let draggedItem = null;

  /* Pool drag start */
  pool.querySelectorAll('.drag-item').forEach(item => {
    item.addEventListener('dragstart', e => {
      draggedItem = {
        name:     item.dataset.name,
        duration: item.dataset.duration,
        cost:     parseInt(item.dataset.cost) || 0
      };
      item.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'copy';
    });
    item.addEventListener('dragend', () => item.classList.remove('dragging'));
  });

  /* Drop Zone */
  dropZone.addEventListener('dragover', e => {
    e.preventDefault();
    dropZone.classList.add('drag-over');
    e.dataTransfer.dropEffect = 'copy';
  });
  dropZone.addEventListener('dragleave', () => dropZone.classList.remove('drag-over'));
  dropZone.addEventListener('drop', e => {
    e.preventDefault();
    dropZone.classList.remove('drag-over');
    if (!draggedItem) return;
    // Avoid duplicates
    if (itinerary.find(x => x.name === draggedItem.name)) {
      window.showToast('Already in your itinerary');
      return;
    }
    itinerary.push({ ...draggedItem });
    renderItinerary();
    draggedItem = null;
  });

  /* Touch fallback (tap to add) */
  pool.querySelectorAll('.drag-item').forEach(item => {
    item.addEventListener('click', () => {
      const d = {
        name:     item.dataset.name,
        duration: item.dataset.duration,
        cost:     parseInt(item.dataset.cost) || 0
      };
      if (itinerary.find(x => x.name === d.name)) { window.showToast('Already in your itinerary'); return; }
      itinerary.push(d);
      renderItinerary();
    });
  });

  function renderItinerary() {
    if (!itemsEl) return;
    if (itinerary.length === 0) {
      itemsEl.innerHTML = '';
      if (placeholder) placeholder.style.display = 'flex';
      totalsEl.style.display = 'none';
      emailForm.style.display = 'none';
      sendNote.style.display = 'none';
      return;
    }
    if (placeholder) placeholder.style.display = 'none';
    itemsEl.innerHTML = itinerary.map((item, i) => `
      <div class="itinerary-item" role="listitem">
        <div>
          <p class="itinerary-item-name">${item.name}</p>
          <p class="itinerary-item-detail">${item.duration} · ₹${item.cost.toLocaleString('en-IN')}</p>
        </div>
        <button class="itinerary-item-remove" 
                aria-label="Remove ${item.name}"
                onclick="removeItinItem(${i})">✕</button>
      </div>
    `).join('');

    const totalCost = itinerary.reduce((s, i) => s + i.cost, 0);
    const totalHours = itinerary.reduce((s, i) => {
      const h = parseFloat(i.duration) || 0;
      return s + h;
    }, 0);

    countEl.textContent    = `${itinerary.length} experience${itinerary.length > 1 ? 's' : ''}`;
    durEl.textContent      = `~${Math.round(totalHours)} hours`;
    costEl.textContent     = `₹${totalCost.toLocaleString('en-IN')}`;
    totalsEl.style.display = 'block';
    emailForm.style.display = 'flex';
    sendNote.style.display  = 'block';
  }

  window.removeItinItem = function(idx) {
    itinerary.splice(idx, 1);
    renderItinerary();
  };

  /* Send Itinerary */
  document.getElementById('itin-send-btn')?.addEventListener('click', async () => {
    const emailEl = document.getElementById('itin-email');
    const email = emailEl?.value.trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      window.showToast('Please enter a valid email address.');
      return;
    }
    if (itinerary.length === 0) { window.showToast('Add some experiences first.'); return; }

    const totalCost = itinerary.reduce((s, i) => s + i.cost, 0);
    const payload = {
      guest_email:      email,
      experiences:      itinerary.map(i => i.name),
      total_duration:   itinerary.reduce((s, i) => s + (parseFloat(i.duration) || 0), 0) + 'h',
      estimated_cost:   totalCost,
      created_at:       new Date().toISOString()
    };

    try {
      if (window.supabase) {
        await supabase.from('itineraries').insert([payload]);
      }
    } catch (e) { console.warn('Supabase unavailable'); }

    emailEl.value = '';
    window.showToast('✦ Your itinerary has been sent. Our concierge will be in touch.');
  });
})();
