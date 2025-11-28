/**
 * Beekman Strategic - Blog Functionality
 * Handles filtering, reading time calculation, TOC, and share functionality
 */

(function() {
  'use strict';

  // --------------------------------------------------------------------------
  // Category Filtering
  // --------------------------------------------------------------------------
  function initCategoryFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const blogCards = document.querySelectorAll('.blog-card[data-category]');
    const featuredArticle = document.querySelector('.featured-article');

    if (!filterButtons.length) return;

    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        const category = button.dataset.category;

        // Update active state
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        // Filter cards
        blogCards.forEach(card => {
          const cardCategory = card.dataset.category;

          if (category === 'all' || cardCategory === category) {
            card.style.display = '';
            card.classList.add('reveal', 'visible');
          } else {
            card.style.display = 'none';
          }
        });

        // Handle featured article visibility
        if (featuredArticle) {
          const featuredCategory = featuredArticle.querySelector('[data-category]')?.dataset.category;
          if (category === 'all' || featuredCategory === category) {
            featuredArticle.closest('.featured-section').style.display = '';
          } else {
            featuredArticle.closest('.featured-section').style.display = 'none';
          }
        }

        // Update URL without page reload
        const url = new URL(window.location);
        if (category === 'all') {
          url.searchParams.delete('category');
        } else {
          url.searchParams.set('category', category);
        }
        window.history.pushState({}, '', url);
      });
    });

    // Check URL for initial category filter
    const urlParams = new URLSearchParams(window.location.search);
    const initialCategory = urlParams.get('category');
    if (initialCategory) {
      const targetButton = document.querySelector(`.filter-btn[data-category="${initialCategory}"]`);
      if (targetButton) {
        targetButton.click();
      }
    }
  }

  // --------------------------------------------------------------------------
  // Reading Time Calculator
  // --------------------------------------------------------------------------
  function calculateReadingTime(text) {
    const wordsPerMinute = 200;
    const words = text.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return minutes;
  }

  function initReadingTime() {
    const postContent = document.querySelector('.post-content');
    const readingTimeElements = document.querySelectorAll('.reading-time');

    if (postContent && readingTimeElements.length) {
      const text = postContent.textContent || postContent.innerText;
      const minutes = calculateReadingTime(text);

      readingTimeElements.forEach(el => {
        // Only update if it's a placeholder
        if (el.textContent.includes('min read')) {
          const svg = el.querySelector('svg');
          el.innerHTML = '';
          if (svg) el.appendChild(svg);
          el.appendChild(document.createTextNode(` ${minutes} min read`));
        }
      });
    }
  }

  // --------------------------------------------------------------------------
  // Table of Contents - Smooth Scroll & Active State
  // --------------------------------------------------------------------------
  function initTableOfContents() {
    const tocLinks = document.querySelectorAll('.toc-list a');
    const sections = [];

    tocLinks.forEach(link => {
      const targetId = link.getAttribute('href').slice(1);
      const section = document.getElementById(targetId);
      if (section) {
        sections.push({ id: targetId, element: section, link: link });
      }
    });

    if (!sections.length) return;

    // Smooth scroll to section
    tocLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').slice(1);
        const target = document.getElementById(targetId);

        if (target) {
          const headerHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) || 72;
          const offset = target.offsetTop - headerHeight - 24;

          window.scrollTo({
            top: offset,
            behavior: 'smooth'
          });

          // Update URL hash
          history.pushState(null, null, `#${targetId}`);
        }
      });
    });

    // Active state on scroll
    function updateActiveSection() {
      const scrollPosition = window.scrollY + 150;

      let activeSection = sections[0];

      sections.forEach(section => {
        if (section.element.offsetTop <= scrollPosition) {
          activeSection = section;
        }
      });

      tocLinks.forEach(link => link.classList.remove('active'));
      if (activeSection) {
        activeSection.link.classList.add('active');
      }
    }

    window.addEventListener('scroll', updateActiveSection, { passive: true });
    updateActiveSection();
  }

  // --------------------------------------------------------------------------
  // Share Functionality
  // --------------------------------------------------------------------------
  function initShareButtons() {
    const copyButtons = document.querySelectorAll('.share-copy');

    copyButtons.forEach(button => {
      button.addEventListener('click', async () => {
        const url = button.dataset.url || window.location.href;

        try {
          await navigator.clipboard.writeText(url);

          // Visual feedback
          const originalText = button.innerHTML;
          button.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 6L9 17l-5-5"/>
            </svg>
            Copied!
          `;
          button.style.color = 'var(--accent)';
          button.style.borderColor = 'var(--accent)';

          setTimeout(() => {
            button.innerHTML = originalText;
            button.style.color = '';
            button.style.borderColor = '';
          }, 2000);
        } catch (err) {
          console.error('Failed to copy URL:', err);
        }
      });
    });

    // Native share API for mobile
    if (navigator.share) {
      const shareButtons = document.querySelectorAll('[data-native-share]');
      shareButtons.forEach(button => {
        button.addEventListener('click', async () => {
          try {
            await navigator.share({
              title: document.title,
              url: window.location.href
            });
          } catch (err) {
            if (err.name !== 'AbortError') {
              console.error('Share failed:', err);
            }
          }
        });
      });
    }
  }

  // --------------------------------------------------------------------------
  // Progress Bar (Optional - for blog posts)
  // --------------------------------------------------------------------------
  function initProgressBar() {
    const progressBar = document.querySelector('.reading-progress');
    const postContent = document.querySelector('.post-content');

    if (!progressBar || !postContent) return;

    function updateProgress() {
      const contentTop = postContent.offsetTop;
      const contentHeight = postContent.offsetHeight;
      const windowHeight = window.innerHeight;
      const scrollY = window.scrollY;

      const progress = Math.min(
        Math.max((scrollY - contentTop + windowHeight * 0.3) / contentHeight, 0),
        1
      );

      progressBar.style.transform = `scaleX(${progress})`;
    }

    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  }

  // --------------------------------------------------------------------------
  // Lazy Load Images
  // --------------------------------------------------------------------------
  function initLazyLoad() {
    if ('loading' in HTMLImageElement.prototype) {
      // Native lazy loading supported
      const lazyImages = document.querySelectorAll('img[loading="lazy"]');
      lazyImages.forEach(img => {
        if (img.dataset.src) {
          img.src = img.dataset.src;
        }
      });
    } else {
      // Fallback for older browsers
      const lazyImages = document.querySelectorAll('img[loading="lazy"]');

      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
            }
            img.classList.add('loaded');
            observer.unobserve(img);
          }
        });
      }, {
        rootMargin: '50px 0px'
      });

      lazyImages.forEach(img => imageObserver.observe(img));
    }
  }

  // --------------------------------------------------------------------------
  // Newsletter Form
  // --------------------------------------------------------------------------
  function initNewsletterForm() {
    const forms = document.querySelectorAll('.newsletter-form, .newsletter-form-small');

    forms.forEach(form => {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const emailInput = form.querySelector('input[type="email"]');
        const submitButton = form.querySelector('button[type="submit"]');
        const email = emailInput.value;

        if (!email) return;

        // Disable form during submission
        submitButton.disabled = true;
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Subscribing...';

        try {
          // Simulate API call (replace with actual endpoint)
          await new Promise(resolve => setTimeout(resolve, 1000));

          // Success state
          submitButton.textContent = 'Subscribed!';
          submitButton.style.background = 'var(--accent)';
          emailInput.value = '';

          setTimeout(() => {
            submitButton.textContent = originalText;
            submitButton.style.background = '';
            submitButton.disabled = false;
          }, 3000);

        } catch (error) {
          console.error('Newsletter subscription failed:', error);
          submitButton.textContent = 'Error - Try Again';
          submitButton.style.background = '#ef4444';

          setTimeout(() => {
            submitButton.textContent = originalText;
            submitButton.style.background = '';
            submitButton.disabled = false;
          }, 3000);
        }
      });
    });
  }

  // --------------------------------------------------------------------------
  // Estimated Read Time for Card Listings
  // --------------------------------------------------------------------------
  function initCardReadingTimes() {
    // This would typically be calculated server-side or via a build process
    // For now, we'll use placeholder values already in the HTML
  }

  // --------------------------------------------------------------------------
  // Keyboard Navigation
  // --------------------------------------------------------------------------
  function initKeyboardNav() {
    document.addEventListener('keydown', (e) => {
      // Skip if user is typing in an input
      if (e.target.matches('input, textarea')) return;

      // Arrow key navigation between articles
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        const prevLink = document.querySelector('.pagination-prev');
        const nextLink = document.querySelector('.pagination-next');

        if (e.key === 'ArrowLeft' && prevLink) {
          prevLink.click();
        } else if (e.key === 'ArrowRight' && nextLink) {
          nextLink.click();
        }
      }
    });
  }

  // --------------------------------------------------------------------------
  // Initialize All Blog Functions
  // --------------------------------------------------------------------------
  function init() {
    initCategoryFilters();
    initReadingTime();
    initTableOfContents();
    initShareButtons();
    initProgressBar();
    initLazyLoad();
    initNewsletterForm();
    initCardReadingTimes();
    initKeyboardNav();
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
