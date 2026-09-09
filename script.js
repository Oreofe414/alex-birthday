document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('year').textContent = new Date().getFullYear();

  // ---- Mobile nav ----
  const menuBtn = document.getElementById('menuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  menuBtn.addEventListener('click', () => {
    const open = mobileMenu.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', open);
  });
  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', false);
    });
  });

  // ---- Toast helper ----
  function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(window._toastTimer);
    window._toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
  }

  // ---- Countdown to 15 October 2026 ----
  const targetDate = new Date('2026-10-15T00:00:00');
  const daysEl = document.getElementById('cd-days');
  const hoursEl = document.getElementById('cd-hours');
  const minsEl = document.getElementById('cd-mins');
  const secsEl = document.getElementById('cd-secs');

  function pad(n) { return String(n).padStart(2, '0'); }

  function updateCountdown() {
    const now = new Date();
    let diff = targetDate - now;

    if (diff <= 0) {
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minsEl.textContent = '00';
      secsEl.textContent = '00';
      document.getElementById('countdown').insertAdjacentHTML(
        'afterend',
        '<p style="margin-top:14px;color:var(--gold);font-weight:600;">🎉 It\'s the big day!</p>'
      );
      clearInterval(timer);
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / (1000 * 60)) % 60);
    const secs = Math.floor((diff / 1000) % 60);

    daysEl.textContent = pad(days);
    hoursEl.textContent = pad(hours);
    minsEl.textContent = pad(mins);
    secsEl.textContent = pad(secs);
  }

  updateCountdown();
  const timer = setInterval(updateCountdown, 1000);

  // ---- Copy account number ----
  const copyBtn = document.getElementById('copyBtn');
  copyBtn.addEventListener('click', async () => {
    const value = copyBtn.dataset.value;
    try {
      await navigator.clipboard.writeText(value);
      showToast('Account number copied');
    } catch (err) {
      showToast('Could not copy — please copy manually');
    }
  });

  // ---- Wish form via Formspree (AJAX so we can show our own toast) ----
  const wishForm = document.getElementById('wishForm');
  const formNote = document.getElementById('formNote');

  wishForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = wishForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    const formData = new FormData(wishForm);

    try {
      const res = await fetch(wishForm.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      });

      if (res.ok) {
        wishForm.reset();
        formNote.textContent = 'Thank you — your wish has been sent! 🎉';
        formNote.style.color = 'var(--gold-deep)';
        showToast('Wish sent — thank you!');
      } else {
        formNote.textContent = 'Something went wrong. Please try again, or check that the Formspree form ID is set correctly.';
      }
    } catch (err) {
      formNote.textContent = 'Network error — please try again.';
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });
});
