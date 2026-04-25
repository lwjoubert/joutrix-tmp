// Mobile nav toggle
const burger = document.querySelector('[data-burger]');
const mobilePanel = document.querySelector('[data-mobile-panel]');

if (burger && mobilePanel) {
  burger.addEventListener('click', () => {
    const isOpen = mobilePanel.getAttribute('data-open') === 'true';
    mobilePanel.setAttribute('data-open', String(!isOpen));
    mobilePanel.style.display = isOpen ? 'none' : 'block';
    burger.setAttribute('aria-expanded', String(!isOpen));
  });

  // Start closed on mobile
  mobilePanel.style.display = 'none';
  mobilePanel.setAttribute('data-open', 'false');
  burger.setAttribute('aria-expanded', 'false');
}

// Highlight active link for current page in nav
(function setActiveNav() {
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('a[data-nav]').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path) a.style.color = 'var(--text)';
  });
})();

// Copy-to-clipboard helper for email
document.querySelectorAll('[data-copy]').forEach(btn => {
  btn.addEventListener('click', async () => {
    const value = btn.getAttribute('data-copy');
    try {
      await navigator.clipboard.writeText(value);
      const original = btn.textContent;
      btn.textContent = 'Copied ✓';
      setTimeout(() => (btn.textContent = original), 1100);
    } catch (e) {
      // fallback
      prompt('Copy:', value);
    }
  });
});
