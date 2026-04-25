/**
 * Joutrix Cybersecurity - Frontend Scripts
 * Lightweight, accessible, no dependencies
 * Site: https://tmp.joutrix.com
 */

'use strict';

const debounce = (fn, delay = 150) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(null, args), delay);
  };
};

const announce = (message) => {
  let liveRegion = document.getElementById('aria-live-region');
  if (!liveRegion) {
    liveRegion = document.createElement('div');
    liveRegion.id = 'aria-live-region';
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    document.body.appendChild(liveRegion);
  }
  liveRegion.textContent = '';
  setTimeout(() => { liveRegion.textContent = message; }, 100);
};

document.addEventListener('DOMContentLoaded', () => {
  try {
    initMobileNav();
    initActiveNav();
    initCopyButtons();
  } catch (error) {
    console.warn('[Joutrix] Script error:', error);
  }
});

// Mobile navigation
function initMobileNav() {
  const burger = document.querySelector('[data-burger]');
  const mobilePanel = document.querySelector('[data-mobile-panel]');
  
  if (!burger || !mobilePanel) return;
  
  // Initialize
  mobilePanel.hidden = true;
  burger.setAttribute('aria-expanded', 'false');
  
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
}

function toggleMobileMenu(panel, burger, isOpen) {
  panel.hidden = isOpen;
  burger.setAttribute('aria-expanded', String(!isOpen));
  document.body.style.overflow = isOpen ? '' : 'hidden';
  
  // Close on nav link click
  if (!isOpen) {
    panel.querySelectorAll('a[data-nav]').forEach(link => {
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
  const focusable = panel.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])');
  if (focusable.length < 2) return;
  
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  
  panel.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab' || panel.hidden) return;
    
    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });
}

// Active navigation highlighting
function initActiveNav() {
  const path = location.pathname.split('/').pop() || 'index.html';
  const currentPage = path.replace('.html', '');
  
  document.querySelectorAll('a[data-nav]').forEach(link => {
    const href = link.getAttribute('href')?.replace('.html', '');
    if (href === currentPage || (href === 'index' && currentPage === '')) {
      link.setAttribute('aria-current', 'page');
      link.classList.add('active');
    }
  });
}

// Copy to clipboard with feedback
function initCopyButtons() {
  document.querySelectorAll('[data-copy]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const value = btn.getAttribute('data-copy');
      const originalHTML = btn.innerHTML;
      
      try {
        await navigator.clipboard.writeText(value);
        btn.innerHTML = `<svg class="icon" viewBox="0 0 24 24"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg>Copied!`;
        btn.disabled = true;
        announce('Email address copied to clipboard');
        
        setTimeout(() => {
          btn.innerHTML = originalHTML;
          btn.disabled = false;
        }, 2000);
      } catch {
        // Fallback
        const textarea = document.createElement('textarea');
        textarea.value = value;
        textarea.style.cssText = 'position:fixed;opacity:0;left:-9999px';
        document.body.appendChild(textarea);
        textarea.select();
        
        try {
          document.execCommand('copy');
          btn.textContent = 'Copied ✓';
          announce('Email address copied to clipboard');
          setTimeout(() => { btn.innerHTML = originalHTML; }, 1500);
        } catch {
          window.location.href = `mailto:${value}`;
        }
        document.body.removeChild(textarea);
      }
    });
  });
}
