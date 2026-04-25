/** = 'sr-only';
    document.body.appendChild(liveRegion);
  }
  liveRegion.textContent = '';
  setTimeout(() => { liveRegion.textContent = message; }, 100);
};

// Main initialization
document.addEventListener('DOMContentLoaded', () => {
  try {
    initMobileNav();
    initActiveNav();
    initCopyButtons();
  } catch (error) {
    console.warn('[Joutrix] Script error:', error);
  }
});

// =========================
// Mobile navigation
// =========================
function initMobileNav() {
  const burger = document.querySelector('[data-burger]');
  const mobilePanel = document.querySelector('[data-mobile-panel]');

  if (!burger || !mobilePanel) return;

  // Initialize state
  mobilePanel.hidden = true;
  burger.setAttribute('aria-expanded', 'false');

  // Ensure aria-controls is correct (optional safety)
  if (burger.hasAttribute('aria-controls')) {
    const id = burger.getAttribute('aria-controls');
    if (id && mobilePanel.id !== id) {
      // If mismatch, we do not force-change IDs, just warn
      // console.warn('[Joutrix] aria-controls does not match mobile panel id');
    }
  }

  burger.addEventListener('click', () => {
    const isOpen = !mobilePanel.hidden;
    toggleMobileMenu(mobilePanel, burger, isOpen);
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !mobilePanel.hidden) {
      toggleMobileMenu(mobilePanel, burger, true);
      burger.focus();
    }
  });

  // Focus trap when open
  setupFocusTrap(mobilePanel);

  // Close when clicking outside (optional, but feels good on mobile/desktop)
  document.addEventListener('click', (e) => {
    if (mobilePanel.hidden) return;

    const clickedInsidePanel = mobilePanel.contains(e.target);
    const clickedBurger = burger.contains(e.target);

    if (!clickedInsidePanel && !clickedBurger) {
      toggleMobileMenu(mobilePanel, burger, true);
    }
  }, { passive: true });
}

function toggleMobileMenu(panel, burger, isOpen) {
  // isOpen = current state before toggle
  panel.hidden = isOpen; // if open -> hide; if closed -> show
  burger.setAttribute('aria-expanded', String(!isOpen));

  // Lock scroll while open (prevents background scrolling on mobile)
  document.body.style.overflow = isOpen ? '' : 'hidden';

  // When opening, move focus to first link for accessibility
  if (!isOpen) {
    const firstLink = panel.querySelector('a, button, [tabindex]:not([tabindex="-1"])');
    if (firstLink) firstLink.focus();

    // Close on nav link click (only once per open)
    panel.querySelectorAll('a[data-nav]').forEach((link) => {
      const close = () => {
        panel.hidden = true;
        burger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      };
      link.addEventListener('click', close, { once: true });
    });
  }
}

function setupFocusTrap(panel) {
  panel.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab' || panel.hidden) return;

    const focusable = panel.querySelectorAll(
      'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey) {
      // Shift + Tab
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      // Tab
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });
}

// =========================
// Active navigation highlighting
// =========================
function initActiveNav() {
  const path = location.pathname.split('/').pop() || 'index.html';
  const currentPage = path.replace('.html', '') || 'index';

  document.querySelectorAll('a[data-nav]').forEach((link) => {
    const hrefRaw = link.getAttribute('href') || '';
    const href = hrefRaw.replace('.html', '').replace('./', '');

    // Match: index.html OR empty
    const isIndex = (href === 'index' && currentPage === 'index');

    if (href === currentPage || isIndex) {
      link.setAttribute('aria-current', 'page');
      link.classList.add('active');
    } else {
      link.removeAttribute('aria-current');
      link.classList.remove('active');
    }
  });
}

// =========================
// Copy to clipboard with feedback
// =========================
function initCopyButtons() {
  document.querySelectorAll('[data-copy]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const value = btn.getAttribute('data-copy');
      if (!value) return;

      const originalHTML = btn.innerHTML;

      try {
        await navigator.clipboard.writeText(value);

        btn.innerHTML = `
          <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"></path>
          </svg>
          Copied!
        `;
        btn.disabled = true;
        announce('Email address copied to clipboard');

        setTimeout(() => {
          btn.innerHTML = originalHTML;
          btn.disabled = false;
        }, 2000);
      } catch (err) {
        // Fallback method (older browsers / restricted contexts)
        const textarea = document.createElement('textarea');
        textarea.value = value;
        textarea.style.cssText = 'position:fixed;opacity:0;left:-9999px;top:-9999px;';
        document.body.appendChild(textarea);
        textarea.select();
        textarea.setSelectionRange(0, textarea.value.length);

        try {
          const ok = document.execCommand('copy');
          if (ok) {
            btn.textContent = 'Copied ✓';
            announce('Email address copied to clipboard');
            setTimeout(() => {
              btn.innerHTML = originalHTML;
            }, 1500);
          } else {
            // If copy fails, fallback to mailto
            window.location.href = `mailto:${value}`;
          }
        } catch {
          window.location.href = `mailto:${value}`;
        } finally {
          document.body.removeChild(textarea);
        }
      }
    });
  });
}
``
 * Joutrix Cybersecurity - Frontend Scripts
 * Lightweight, accessible, no dependencies
 * Site: https://tmp.joutrix.com
 */

'use strict';

// Utility: debounce for performance (optional use)
const debounce = (fn, delay = 150) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(null, args), delay);
  };
};

// Utility: announce messages to screen readers (polite)
const announce = (message) => {
  let liveRegion = document.getElementById('aria-live-region');
  if (!liveRegion) {
    liveRegion = document.createElement('div');
    liveRegion.id = 'aria-live-region';
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
