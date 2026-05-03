/* ============================================================
   NITARA STAYS — Contact Page JS
   ============================================================ */

/* ─── Contact Form → Supabase ─── */
(function () {
  const form    = document.getElementById('contact-form');
  const submitBtn = document.getElementById('contact-submit-btn');
  const successEl = document.getElementById('contact-success');
  if (!form) return;

  function validateField(id, errId, condition) {
    const field = document.getElementById(id);
    const err   = document.getElementById(errId);
    if (!field) return true;
    if (!condition(field.value)) {
      field.classList.add('error');
      if (err) { err.classList.add('visible'); }
      return false;
    }
    field.classList.remove('error');
    if (err) { err.classList.remove('visible'); }
    return true;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const validName    = validateField('cf-name', 'cf-name-err', v => v.trim().length > 1);
    const validEmail   = validateField('cf-email', 'cf-email-err', v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()));
    const validSubject = validateField('cf-subject', 'cf-subject-err', v => v !== '');
    const validMessage = validateField('cf-message', 'cf-message-err', v => v.trim().length > 10);

    if (!validName || !validEmail || !validSubject || !validMessage) return;

    const btnText   = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');
    submitBtn.disabled = true;
    btnText.hidden  = true;
    btnLoader.hidden = false;

    const payload = {
      name:       document.getElementById('cf-name').value.trim(),
      email:      document.getElementById('cf-email').value.trim(),
      phone:      document.getElementById('cf-phone').value.trim() || null,
      subject:    document.getElementById('cf-subject').value,
      message:    document.getElementById('cf-message').value.trim(),
      created_at: new Date().toISOString()
    };

    try {
      if (window.supabase) {
        const { error } = await supabase.from('contact_messages').insert([payload]);
        if (error) throw error;
      }
      form.hidden = true;
      successEl.hidden = false;
    } catch (err) {
      console.error('Contact form error:', err);
      window.showToast && window.showToast('Something went wrong. Please try again or call us directly.');
    } finally {
      submitBtn.disabled = false;
      btnText.hidden  = false;
      btnLoader.hidden = true;
    }
  });

  // Live validation clear
  ['cf-name','cf-email','cf-subject','cf-message'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('input', () => {
      el.classList.remove('error');
      const err = document.getElementById(id + '-err');
      if (err) err.classList.remove('visible');
    });
  });
})();

/* ─── Travel Tabs ─── */
(function () {
  const tabs   = document.querySelectorAll('.travel-tab');
  const panels = document.querySelectorAll('.travel-panel');
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetId = tab.dataset.target;

      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      panels.forEach(p => {
        p.classList.remove('active');
        p.hidden = true;
      });

      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      const target = document.getElementById(targetId);
      if (target) { target.classList.add('active'); target.hidden = false; }
    });

    // Keyboard
    tab.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); tab.click(); }
    });
  });
})();

/* ─── FAQ Accordion ─── */
(function () {
  const questions = document.querySelectorAll('.faq-question');
  if (!questions.length) return;

  questions.forEach(btn => {
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      const answerId = btn.getAttribute('aria-controls');
      const answer   = document.getElementById(answerId);

      // Close all others
      questions.forEach(other => {
        if (other !== btn) {
          other.setAttribute('aria-expanded', 'false');
          const otherId = other.getAttribute('aria-controls');
          const otherAns = document.getElementById(otherId);
          if (otherAns) otherAns.hidden = true;
        }
      });

      btn.setAttribute('aria-expanded', String(!expanded));
      if (answer) answer.hidden = expanded;
    });

    btn.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); btn.click(); }
    });
  });
})();
