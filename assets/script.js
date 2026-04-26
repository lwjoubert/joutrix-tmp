document.addEventListener('DOMContentLoaded', () => {
  // ==================== MOBILE MENU TOGGLE ====================
  const burger = document.querySelector('[data-burger]');
  const mobilePanel = document.querySelector('[data-mobile-panel]');
  
  if (burger && mobilePanel) {
    burger.addEventListener('click', () => {
      mobilePanel.hidden = !mobilePanel.hidden;
      burger.setAttribute('aria-expanded', !mobilePanel.hidden);
    });

    // Close on link click - CORRECT LOGIC
    const navLinks = mobilePanel.querySelectorAll('[data-nav]');
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent default jump
        
        const href = link.getAttribute('href');
        
        if (href && href.startsWith('#')) {
          const targetId = href.replace('#', '');
          const targetElement = document.getElementById(targetId);
          
          if (targetElement) {
            // Smooth scroll to section without redirecting
            window.scrollTo({
              top: targetElement.offsetTop - 80, // Offset for sticky header
              behavior: 'smooth'
            });
            
            // Close menu after small delay
            setTimeout(() => {
              mobilePanel.hidden = true;
              burger.setAttribute('aria-expanded', 'false');
              
              // Update hash for browser history
              window.location.hash = href;
            }, 1000);
          }
        }
      });
    });

    // Close on outside click - CORRECT LOGIC
    document.body.addEventListener('click', (e) => {
      if (!burger.contains(e.target) && !mobilePanel.contains(e.target)) {
        mobilePanel.hidden = true;
        burger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ==================== SMOOTH SCROLL FOR ANCHOR LINKS ====================
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  
  anchorLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      
      const href = link.getAttribute('href');
      
      if (href && href !== '#') {
        const targetId = href.replace('#', '');
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          // Get top offset of element
          const targetTop = targetElement.getBoundingClientRect().top + window.scrollY - 80; // Account for sticky header
      
          // Smooth scroll to target
          window.scrollTo({
            top: targetTop,
            behavior: 'smooth'
          });
          
          // Update hash after scroll completes
          setTimeout(() => {
            window.location.hash = href;
          }, 1500);
        }
      }
    });
  });

  // ==================== ACTIVE SECTION HIGHLIGHT (Optional) ====================
  const navLinks = document.querySelectorAll('[data-nav]');
  
  function updateActiveNav() {
    const scrollPosition = window.scrollY + window.innerHeight / 2; // Scroll position in viewport
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      
      const href = link.getAttribute('href');
      if (href === '#home' || href === 'about') {
        // Home is always active at start
        return;
      } else {
        const targetId = href.replace('#', '');
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          const targetTop = targetElement.getBoundingClientRect().top + window.scrollY - 80; // Account for sticky header
      
          if (scrollPosition >= targetTop && scrollPosition < targetTop + window.innerHeight * 0.35) {
            link.classList.add('active');
          }
        }
      }
    });
  }

  // Initialize active state on load
  updateActiveNav();

  // Listen for scroll events to update active nav (using requestAnimationFrame for performance)
  window.addEventListener('scroll', () => {
    requestAnimationFrame(updateActiveNav);
  }, false);

  // ==================== COPY EMAIL FUNCTIONALITY ====================
  const copyButtons = document.querySelectorAll('[data-copy]');
  
  copyButtons.forEach(button => {
    button.addEventListener('click', () => {
      try {
        const email = button.getAttribute('data-copy');
        
        navigator.clipboard.writeText(email).then(() => {
          const originalText = button.textContent;
          button.textContent = 'Copied!';
          
          setTimeout(() => {
            button.textContent = originalText;
          }, 2000);
        }).catch(err => {
          console.error('Failed to copy: ', err);
        });
      } catch (error) {
        console.error('Error in copy handler:', error);
      }
    });
  });

  // ==================== FORM SUBMIT HANDLING (Placeholder) ====================
  const contactForm = document.querySelector('form[action="#"]');
  
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      try {
        const formData = new FormData(contactForm);
        const name = formData.get('name') || 'User';
        
        console.log('Form submitted:', { name });
        
        // Visual feedback
        contactForm.reset();
        alert(`Thanks ${name}! We'll get back to you soon.`);
      } catch (error) {
        console.error('Error in form handler:', error);
      }
    });
  }

});
