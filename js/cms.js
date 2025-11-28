/**
 * Beekman Strategic - CMS Frontend Integration
 * Fetches and displays dynamic content from the CMS API
 */

const CMS = {
  // API Configuration
  config: {
    apiUrl: 'http://localhost:3001/api',
    language: localStorage.getItem('beekman-lang') || 'en'
  },

  // Initialize CMS integration
  init() {
    this.loadInsights();
    this.initBlogPage();
    this.loadSEOSettings();
    this.trackPageView();
  },

  // Fetch from API
  async fetch(endpoint, options = {}) {
    try {
      const response = await fetch(`${this.config.apiUrl}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        }
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('CMS Fetch Error:', error);
      return null;
    }
  },

  // Load insights/articles for homepage
  async loadInsights() {
    const container = document.getElementById('insights-container');
    if (!container) return;

    try {
      const response = await this.fetch(`/blog?limit=3&status=published&language=${this.config.language}`);

      if (!response || !response.data || response.data.length === 0) {
        // Keep static content if no posts
        return;
      }

      container.innerHTML = response.data.map(post => this.renderInsightCard(post)).join('');

      // Re-initialize scroll animations for new content
      this.initScrollAnimations(container);
    } catch (error) {
      console.error('Failed to load insights:', error);
    }
  },

  // Render insight card
  renderInsightCard(post) {
    const date = new Date(post.publishedAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const categoryLabels = {
      'insights': 'Insights',
      'market-analysis': 'Market Analysis',
      'wealth-management': 'Wealth Management',
      'investment-banking': 'Investment Banking',
      'company-news': 'Company News',
      'press-release': 'Press Release'
    };

    return `
      <article class="insight-card reveal">
        ${post.featuredImage?.url ? `
          <div class="insight-image">
            <img src="${this.escapeHtml(post.featuredImage.url)}" alt="${this.escapeHtml(post.featuredImage.alt || post.title)}">
          </div>
        ` : `
          <div class="insight-image">
            <div class="insight-placeholder">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
              </svg>
            </div>
          </div>
        `}
        <div class="insight-content">
          <span class="insight-category">${categoryLabels[post.category] || 'Insights'}</span>
          <h3>${this.escapeHtml(post.title)}</h3>
          <p>${this.escapeHtml(post.excerpt || '')}</p>
          <div class="insight-meta">
            <span class="insight-date">${date}</span>
            <span class="insight-read-time">${post.readTime || 5} min read</span>
          </div>
          <a href="/blog/${post.slug}" class="insight-link" data-slug="${post.slug}">
            Read More
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>
        </div>
      </article>
    `;
  },

  // Initialize blog listing page
  async initBlogPage() {
    const blogContainer = document.getElementById('blog-posts-container');
    if (!blogContainer) return;

    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const page = parseInt(urlParams.get('page')) || 1;
    const category = urlParams.get('category');
    const tag = urlParams.get('tag');
    const search = urlParams.get('search');

    let endpoint = `/blog?page=${page}&limit=9&language=${this.config.language}`;
    if (category) endpoint += `&category=${encodeURIComponent(category)}`;
    if (tag) endpoint += `&tag=${encodeURIComponent(tag)}`;
    if (search) endpoint += `&search=${encodeURIComponent(search)}`;

    try {
      const response = await this.fetch(endpoint);

      if (!response || !response.data) {
        blogContainer.innerHTML = '<p class="no-posts">No posts found.</p>';
        return;
      }

      // Render posts
      blogContainer.innerHTML = `
        <div class="blog-grid">
          ${response.data.map(post => this.renderBlogCard(post)).join('')}
        </div>
      `;

      // Render pagination
      if (response.pagination.pages > 1) {
        this.renderPagination(response.pagination);
      }

      // Load categories sidebar
      this.loadCategories();

      // Initialize scroll animations
      this.initScrollAnimations(blogContainer);
    } catch (error) {
      console.error('Failed to load blog posts:', error);
      blogContainer.innerHTML = '<p class="error">Failed to load posts. Please try again later.</p>';
    }
  },

  // Render blog card (full version)
  renderBlogCard(post) {
    const date = new Date(post.publishedAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    return `
      <article class="blog-card reveal">
        ${post.featuredImage?.url ? `
          <div class="blog-card-image">
            <img src="${this.escapeHtml(post.featuredImage.url)}" alt="${this.escapeHtml(post.featuredImage.alt || post.title)}" loading="lazy">
          </div>
        ` : ''}
        <div class="blog-card-content">
          <div class="blog-card-meta">
            <span class="blog-card-category">${post.category}</span>
            <span class="blog-card-date">${date}</span>
          </div>
          <h2 class="blog-card-title">
            <a href="/blog/${post.slug}">${this.escapeHtml(post.title)}</a>
          </h2>
          <p class="blog-card-excerpt">${this.escapeHtml(post.excerpt || '')}</p>
          <div class="blog-card-footer">
            ${post.author ? `
              <div class="blog-card-author">
                <span>By ${this.escapeHtml(post.author.name)}</span>
              </div>
            ` : ''}
            <span class="blog-card-read-time">${post.readTime || 5} min read</span>
          </div>
        </div>
      </article>
    `;
  },

  // Render pagination
  renderPagination(pagination) {
    const paginationContainer = document.getElementById('blog-pagination');
    if (!paginationContainer) return;

    const { page, pages } = pagination;
    let html = '<div class="pagination">';

    // Previous button
    if (page > 1) {
      html += `<a href="?page=${page - 1}" class="pagination-btn prev">Previous</a>`;
    }

    // Page numbers
    for (let i = 1; i <= pages; i++) {
      if (i === 1 || i === pages || (i >= page - 1 && i <= page + 1)) {
        html += `<a href="?page=${i}" class="pagination-btn ${i === page ? 'active' : ''}">${i}</a>`;
      } else if (i === page - 2 || i === page + 2) {
        html += '<span class="pagination-ellipsis">...</span>';
      }
    }

    // Next button
    if (page < pages) {
      html += `<a href="?page=${page + 1}" class="pagination-btn next">Next</a>`;
    }

    html += '</div>';
    paginationContainer.innerHTML = html;
  },

  // Load categories for sidebar
  async loadCategories() {
    const categoriesContainer = document.getElementById('blog-categories');
    if (!categoriesContainer) return;

    try {
      const response = await this.fetch('/blog/categories');

      if (!response || !response.data) return;

      const categoryLabels = {
        'insights': 'Insights',
        'market-analysis': 'Market Analysis',
        'wealth-management': 'Wealth Management',
        'investment-banking': 'Investment Banking',
        'company-news': 'Company News',
        'press-release': 'Press Release'
      };

      categoriesContainer.innerHTML = `
        <h4>Categories</h4>
        <ul class="category-list">
          <li><a href="/blog">All Posts</a></li>
          ${response.data.map(cat => `
            <li>
              <a href="/blog?category=${cat._id}">
                ${categoryLabels[cat._id] || cat._id}
                <span class="count">(${cat.count})</span>
              </a>
            </li>
          `).join('')}
        </ul>
      `;
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  },

  // Load single blog post
  async loadBlogPost(slug) {
    const container = document.getElementById('blog-post-container');
    if (!container) return;

    try {
      const response = await this.fetch(`/blog/${slug}`);

      if (!response || !response.data) {
        container.innerHTML = '<div class="error">Post not found.</div>';
        return;
      }

      const post = response.data;

      // Update page title and meta
      document.title = post.seo?.metaTitle || `${post.title} | Beekman Strategic`;

      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', post.seo?.metaDescription || post.excerpt || '');
      }

      // Render post
      container.innerHTML = this.renderFullPost(post);

      // Load related posts
      this.loadRelatedPosts(post.category, post._id);

    } catch (error) {
      console.error('Failed to load post:', error);
      container.innerHTML = '<div class="error">Failed to load post. Please try again later.</div>';
    }
  },

  // Render full blog post
  renderFullPost(post) {
    const date = new Date(post.publishedAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    return `
      <article class="blog-post">
        <header class="blog-post-header">
          <div class="blog-post-meta">
            <span class="blog-post-category">${post.category}</span>
            <span class="blog-post-date">${date}</span>
            <span class="blog-post-read-time">${post.readTime || 5} min read</span>
          </div>
          <h1 class="blog-post-title">${this.escapeHtml(post.title)}</h1>
          ${post.author ? `
            <div class="blog-post-author">
              <span>By ${this.escapeHtml(post.author.name)}</span>
            </div>
          ` : ''}
        </header>

        ${post.featuredImage?.url ? `
          <figure class="blog-post-featured-image">
            <img src="${this.escapeHtml(post.featuredImage.url)}" alt="${this.escapeHtml(post.featuredImage.alt || post.title)}">
            ${post.featuredImage.caption ? `<figcaption>${this.escapeHtml(post.featuredImage.caption)}</figcaption>` : ''}
          </figure>
        ` : ''}

        <div class="blog-post-content">
          ${post.contentHtml || this.escapeHtml(post.content)}
        </div>

        ${post.tags && post.tags.length > 0 ? `
          <footer class="blog-post-footer">
            <div class="blog-post-tags">
              ${post.tags.map(tag => `<a href="/blog?tag=${encodeURIComponent(tag)}" class="tag">#${this.escapeHtml(tag)}</a>`).join('')}
            </div>
          </footer>
        ` : ''}
      </article>
    `;
  },

  // Load related posts
  async loadRelatedPosts(category, excludeId) {
    const container = document.getElementById('related-posts');
    if (!container) return;

    try {
      const response = await this.fetch(`/blog?category=${category}&limit=3&language=${this.config.language}`);

      if (!response || !response.data) return;

      const relatedPosts = response.data.filter(p => p._id !== excludeId).slice(0, 3);

      if (relatedPosts.length === 0) {
        container.style.display = 'none';
        return;
      }

      container.innerHTML = `
        <h3>Related Articles</h3>
        <div class="related-posts-grid">
          ${relatedPosts.map(post => this.renderInsightCard(post)).join('')}
        </div>
      `;
    } catch (error) {
      console.error('Failed to load related posts:', error);
    }
  },

  // Load SEO settings
  async loadSEOSettings() {
    try {
      const response = await this.fetch('/seo/settings');

      if (!response || !response.data) return;

      const settings = response.data;

      // Apply verification codes if on homepage
      if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
        // Google verification
        if (settings.verification?.googleSiteVerification) {
          let meta = document.querySelector('meta[name="google-site-verification"]');
          if (!meta) {
            meta = document.createElement('meta');
            meta.name = 'google-site-verification';
            document.head.appendChild(meta);
          }
          meta.content = settings.verification.googleSiteVerification;
        }

        // Structured data
        if (settings.structuredData?.organization) {
          const script = document.createElement('script');
          script.type = 'application/ld+json';
          script.textContent = JSON.stringify({
            '@context': 'https://schema.org',
            '@type': settings.structuredData.organization.type || 'Organization',
            name: settings.structuredData.organization.name,
            description: settings.structuredData.organization.description,
            url: settings.structuredData.organization.url
          });
          document.head.appendChild(script);
        }
      }
    } catch (error) {
      console.error('Failed to load SEO settings:', error);
    }
  },

  // Track page view
  async trackPageView() {
    // Get slug from URL if on blog post page
    const pathParts = window.location.pathname.split('/');
    if (pathParts[1] === 'blog' && pathParts[2]) {
      try {
        await this.fetch('/analytics/track-view', {
          method: 'POST',
          body: JSON.stringify({
            type: 'blog',
            slug: pathParts[2]
          })
        });
      } catch (error) {
        // Silent fail for analytics
      }
    }
  },

  // Initialize scroll animations for dynamically loaded content
  initScrollAnimations(container) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    container.querySelectorAll('.reveal').forEach(el => {
      observer.observe(el);
    });
  },

  // Utility: Escape HTML
  escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
};

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  CMS.init();
});

// Export for use in other scripts
window.CMS = CMS;
