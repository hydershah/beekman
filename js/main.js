/**
 * Beekman Strategic - Main JavaScript
 * Handles theme toggle, navigation, animations, and interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all modules
  initThemeToggle();
  initLanguageSelector();
  initMobileNav();
  initScrollAnimations();
  initSmoothScroll();
  initHeaderScroll();
  initContactForm();
  initActiveNavigation();
  handleHashOnLoad();
});

/**
 * Set Active Navigation State
 * Highlights current page in navigation
 */
function initActiveNavigation() {
  const currentPage = document.body.dataset.page;
  if (!currentPage) return;

  // Handle main nav active states
  document.querySelectorAll('.main-nav > a, .main-nav .nav-dropdown > a').forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;

    // Check if this link matches current page
    if (currentPage === 'home' && (href === '/' || href === 'index.html')) {
      link.classList.add('active');
    } else if (currentPage === 'about' && href.includes('about')) {
      link.classList.add('active');
    } else if (currentPage === 'services' && href.includes('services')) {
      link.classList.add('active');
    } else if (currentPage === 'blog' && href.includes('blog')) {
      link.classList.add('active');
    } else if (currentPage === 'contact' && href.includes('contact')) {
      link.classList.add('active');
    }
  });
}

/**
 * Handle Hash on Page Load
 * Scrolls to anchor if URL contains hash (for cross-page links)
 */
function handleHashOnLoad() {
  if (window.location.hash) {
    const target = document.querySelector(window.location.hash);
    if (target) {
      // Wait for page to fully render
      setTimeout(() => {
        const headerHeight = document.getElementById('header')?.offsetHeight || 0;
        window.scrollTo({
          top: target.offsetTop - headerHeight,
          behavior: 'smooth'
        });
      }, 100);
    }
  }
}

/**
 * Theme Toggle (Light/Dark Mode)
 */
function initThemeToggle() {
  const toggle = document.getElementById('themeToggle');
  if (!toggle) return;

  // Check for stored preference or system preference
  const storedTheme = localStorage.getItem('beekman-theme');
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  // Default to light mode as per requirements
  const initialTheme = storedTheme || 'light';
  document.documentElement.dataset.theme = initialTheme;

  toggle.addEventListener('click', () => {
    const current = document.documentElement.dataset.theme;
    const next = current === 'dark' ? 'light' : 'dark';

    document.documentElement.dataset.theme = next;
    localStorage.setItem('beekman-theme', next);

    // Trigger constellation redraw
    if (window.constellation) {
      window.constellation.draw();
    }
  });

  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('beekman-theme')) {
      document.documentElement.dataset.theme = e.matches ? 'dark' : 'light';
    }
  });
}

/**
 * Language Selector
 */
function initLanguageSelector() {
  const selector = document.querySelector('.lang-selector');
  const btn = document.getElementById('langBtn');
  const dropdown = document.getElementById('langDropdown');

  if (!selector || !btn || !dropdown) return;

  // Toggle dropdown
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    selector.classList.toggle('active');
  });

  // Handle language selection
  dropdown.querySelectorAll('button').forEach(langBtn => {
    langBtn.addEventListener('click', () => {
      const lang = langBtn.dataset.lang;
      if (window.i18n) {
        window.i18n.setLang(lang);
      }
      selector.classList.remove('active');
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!selector.contains(e.target)) {
      selector.classList.remove('active');
    }
  });

  // Close on escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      selector.classList.remove('active');
    }
  });
}

/**
 * Mobile Navigation
 */
function initMobileNav() {
  const toggle = document.getElementById('mobileToggle');
  const nav = document.getElementById('mainNav');

  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    nav.classList.toggle('active');
    document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
  });

  // Handle mobile dropdown toggle (Services menu)
  const dropdowns = nav.querySelectorAll('.nav-dropdown');
  const isMobile = () => window.innerWidth <= 768;

  dropdowns.forEach(dropdown => {
    const dropdownLink = dropdown.querySelector(':scope > a');

    if (dropdownLink) {
      dropdownLink.addEventListener('click', (e) => {
        // Only toggle dropdown on mobile screens
        if (isMobile()) {
          e.preventDefault();
          e.stopPropagation();
          dropdown.classList.toggle('expanded');
        }
      });
    }
  });

  // Close nav on link click (but not on dropdown toggle links on mobile)
  nav.querySelectorAll('.nav-dropdown-content a').forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('active');
      nav.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // Close nav on non-dropdown link click
  nav.querySelectorAll(':scope > a').forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('active');
      nav.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // Close on escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('active')) {
      toggle.classList.remove('active');
      nav.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}

/**
 * Scroll Animations (Reveal on scroll)
 */
function initScrollAnimations() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    }
  );

  document.querySelectorAll('.reveal').forEach(el => {
    observer.observe(el);
  });
}

/**
 * Smooth Scroll for Anchor Links
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      const headerHeight = document.getElementById('header')?.offsetHeight || 0;
      const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });

      // Update URL without jumping
      history.pushState(null, '', href);
    });
  });
}

/**
 * Header Scroll Effect
 */
function initHeaderScroll() {
  const header = document.getElementById('header');
  if (!header) return;

  let lastScroll = 0;
  let ticking = false;

  const updateHeader = () => {
    const currentScroll = window.scrollY;

    // Add shadow on scroll
    if (currentScroll > 10) {
      header.style.boxShadow = 'var(--shadow-md)';
    } else {
      header.style.boxShadow = 'none';
    }

    // Hide/show header on scroll direction (optional - commented out for fixed header)
    // if (currentScroll > lastScroll && currentScroll > 200) {
    //   header.style.transform = 'translateY(-100%)';
    // } else {
    //   header.style.transform = 'translateY(0)';
    // }

    lastScroll = currentScroll;
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateHeader);
      ticking = true;
    }
  });
}

/**
 * Contact Form Handler
 */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.textContent;

    // Get form data
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Validate
    if (!data.firstName || !data.lastName || !data.email) {
      showNotification('Please fill in all required fields', 'error');
      return;
    }

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      showNotification('Please enter a valid email address', 'error');
      return;
    }

    // Show loading state
    btn.disabled = true;
    btn.textContent = 'Sending...';

    try {
      // Simulate API call (replace with actual endpoint)
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Success
      showNotification('Message sent successfully! We\'ll be in touch soon.', 'success');
      form.reset();
    } catch (error) {
      showNotification('Something went wrong. Please try again.', 'error');
    } finally {
      btn.disabled = false;
      btn.textContent = originalText;
    }
  });
}

/**
 * Notification Helper
 */
function showNotification(message, type = 'info') {
  // Remove existing notifications
  document.querySelectorAll('.notification').forEach(n => n.remove());

  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <span>${message}</span>
    <button onclick="this.parentElement.remove()" aria-label="Close">&times;</button>
  `;

  // Add styles if not already added
  if (!document.getElementById('notification-styles')) {
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
      .notification {
        position: fixed;
        bottom: 24px;
        right: 24px;
        padding: 16px 24px;
        background: var(--bg-primary);
        border: 1px solid var(--border-color);
        border-radius: var(--radius);
        box-shadow: var(--shadow-lg);
        display: flex;
        align-items: center;
        gap: 16px;
        z-index: 9999;
        animation: slide-up 0.3s ease;
        max-width: 400px;
      }
      .notification-success {
        border-color: #10b981;
        background: rgba(16, 185, 129, 0.1);
      }
      .notification-error {
        border-color: #ef4444;
        background: rgba(239, 68, 68, 0.1);
      }
      .notification button {
        background: none;
        border: none;
        font-size: 20px;
        cursor: pointer;
        color: var(--text-muted);
        padding: 0;
        line-height: 1;
      }
      .notification button:hover {
        color: var(--text-primary);
      }
      @keyframes slide-up {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `;
    document.head.appendChild(style);
  }

  document.body.appendChild(notification);

  // Auto remove after 5 seconds
  setTimeout(() => {
    notification.style.animation = 'slide-up 0.3s ease reverse';
    setTimeout(() => notification.remove(), 300);
  }, 5000);
}

/**
 * Counter Animation for Stats
 */
function animateCounters() {
  const counters = document.querySelectorAll('[data-count]');

  counters.forEach(counter => {
    if (counter.dataset.animated) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            counter.dataset.animated = 'true';
            const target = parseInt(counter.dataset.count);
            const prefix = counter.textContent.match(/^\D*/)?.[0] || '';
            const suffix = counter.textContent.match(/\D*$/)?.[0] || '';

            animateValue(counter, 0, target, 2000, prefix, suffix);
            observer.unobserve(counter);
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(counter);
  });
}

function animateValue(el, start, end, duration, prefix = '', suffix = '') {
  const startTime = performance.now();

  const update = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Ease out cubic
    const easeOut = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(start + (end - start) * easeOut);

    el.textContent = prefix + current + suffix;

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  };

  requestAnimationFrame(update);
}

// Initialize counters after DOM load
document.addEventListener('DOMContentLoaded', animateCounters);

/**
 * Globe Card Visibility
 * The WebGL globe is handled by globe.js module
 */
function initGlobeVisibility() {
  const globeCard = document.querySelector('.globe-card');
  if (!globeCard) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          globeCard.classList.add('visible');
        }
      });
    },
    {
      threshold: 0.2,
      rootMargin: '0px 0px -50px 0px'
    }
  );

  observer.observe(globeCard);
}

// Initialize globe visibility after DOM load
document.addEventListener('DOMContentLoaded', initGlobeVisibility);
