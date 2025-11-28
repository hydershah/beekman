// Beekman CMS Admin Panel
const API_BASE = '/api';

// State
let currentUser = null;
let token = localStorage.getItem('cms_token');
let currentPage = 'overview';
let editingPost = null;
let editingType = 'post'; // 'post' or 'page'

// DOM Elements
const loginScreen = document.getElementById('login-screen');
const dashboard = document.getElementById('dashboard');
const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('login-error');
const logoutBtn = document.getElementById('logout-btn');
const pageTitle = document.getElementById('page-title');
const userName = document.getElementById('user-name');
const userAvatar = document.getElementById('user-avatar');

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
  if (token) {
    try {
      await checkAuth();
      showDashboard();
      loadDashboardData();
    } catch (err) {
      showLogin();
    }
  } else {
    showLogin();
  }

  initNavigation();
  initEditorModal();
  initSEOTabs();
  initMediaUpload();
  initCharCounters();
});

// API Helper
async function api(endpoint, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'API Error');
  }

  return data;
}

// Auth Functions
async function checkAuth() {
  const response = await api('/auth/me');
  currentUser = response.user;
  return currentUser;
}

function showLogin() {
  loginScreen.classList.remove('hidden');
  dashboard.classList.add('hidden');
}

function showDashboard() {
  loginScreen.classList.add('hidden');
  dashboard.classList.remove('hidden');

  if (currentUser) {
    userName.textContent = currentUser.name;
    userAvatar.textContent = currentUser.name.charAt(0).toUpperCase();
  }
}

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  loginError.textContent = '';

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const response = await api('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });

    token = response.token;
    currentUser = response.user;
    localStorage.setItem('cms_token', token);

    showDashboard();
    loadDashboardData();
  } catch (err) {
    loginError.textContent = err.message;
  }
});

logoutBtn.addEventListener('click', async (e) => {
  e.preventDefault();

  try {
    await api('/auth/logout', { method: 'POST' });
  } catch (err) {
    console.error('Logout error:', err);
  }

  token = null;
  currentUser = null;
  localStorage.removeItem('cms_token');
  showLogin();
});

// Navigation
function initNavigation() {
  const navItems = document.querySelectorAll('.nav-item[data-page]');
  const viewAllLinks = document.querySelectorAll('.view-all[data-page]');

  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      navigateTo(item.dataset.page);
    });
  });

  viewAllLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      navigateTo(link.dataset.page);
    });
  });

  // Mobile menu toggle
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const sidebar = document.querySelector('.sidebar');

  mobileToggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
  });
}

function navigateTo(page) {
  currentPage = page;

  // Update nav
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.toggle('active', item.dataset.page === page);
  });

  // Update page content
  document.querySelectorAll('.page-content').forEach(content => {
    content.classList.toggle('active', content.id === `page-${page}`);
  });

  // Update title
  const titles = {
    overview: 'Dashboard',
    posts: 'Blog Posts',
    pages: 'Pages',
    media: 'Media Library',
    seo: 'SEO Settings',
    analytics: 'Analytics'
  };
  pageTitle.textContent = titles[page] || 'Dashboard';

  // Load page data
  loadPageData(page);

  // Close mobile menu
  document.querySelector('.sidebar').classList.remove('open');
}

function loadPageData(page) {
  switch (page) {
    case 'overview':
      loadDashboardData();
      break;
    case 'posts':
      loadPosts();
      break;
    case 'pages':
      loadPages();
      break;
    case 'media':
      loadMedia();
      break;
    case 'seo':
      loadSEOSettings();
      break;
    case 'analytics':
      loadAnalytics();
      break;
  }
}

// Dashboard
async function loadDashboardData() {
  try {
    const [dashboardData, seoHealth] = await Promise.all([
      api('/analytics/dashboard'),
      api('/analytics/seo-health').catch(() => ({ data: { overallScore: 0 } }))
    ]);

    const { overview, recentPosts, topPosts } = dashboardData.data;

    // Update stats
    document.getElementById('stat-posts').textContent = overview.totalPosts;
    document.getElementById('stat-pages').textContent = overview.totalPages;
    document.getElementById('stat-views').textContent = formatNumber(overview.totalViews);
    document.getElementById('stat-seo').textContent = `${seoHealth.data.overallScore}%`;

    // Recent posts
    const recentList = document.getElementById('recent-posts-list');
    if (recentPosts.length > 0) {
      recentList.innerHTML = recentPosts.map(post => `
        <div class="post-item">
          <div class="post-info">
            <div class="post-title">${escapeHtml(post.title)}</div>
            <div class="post-meta">${formatDate(post.createdAt)}</div>
          </div>
          <span class="post-status ${post.status}">${post.status}</span>
        </div>
      `).join('');
    } else {
      recentList.innerHTML = '<p class="empty-state">No posts yet</p>';
    }

    // Top posts
    const topList = document.getElementById('top-posts-list');
    if (topPosts.length > 0) {
      topList.innerHTML = topPosts.map(post => `
        <div class="post-item">
          <div class="post-info">
            <div class="post-title">${escapeHtml(post.title)}</div>
          </div>
          <span class="post-views">${formatNumber(post.views)} views</span>
        </div>
      `).join('');
    } else {
      topList.innerHTML = '<p class="empty-state">No data available</p>';
    }
  } catch (err) {
    console.error('Dashboard load error:', err);
    showToast('Failed to load dashboard data', 'error');
  }
}

// Posts
async function loadPosts() {
  const postsList = document.getElementById('posts-list');
  postsList.innerHTML = '<p class="empty-state">Loading posts...</p>';

  try {
    const response = await api('/blog');
    const posts = response.data;

    if (posts.length === 0) {
      postsList.innerHTML = '<p class="empty-state">No posts yet. Create your first post!</p>';
      return;
    }

    postsList.innerHTML = `
      <table class="posts-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Category</th>
            <th>Status</th>
            <th>Date</th>
            <th>Views</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${posts.map(post => `
            <tr>
              <td><strong>${escapeHtml(post.title)}</strong></td>
              <td>${post.category || '-'}</td>
              <td><span class="post-status ${post.status}">${post.status}</span></td>
              <td>${formatDate(post.createdAt)}</td>
              <td>${formatNumber(post.views || 0)}</td>
              <td class="post-actions">
                <button onclick="editPost('${post._id}')" title="Edit">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                </button>
                <button onclick="duplicatePost('${post._id}')" title="Duplicate">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                </button>
                <button class="delete" onclick="deletePost('${post._id}')" title="Delete">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                </button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  } catch (err) {
    console.error('Load posts error:', err);
    postsList.innerHTML = '<p class="empty-state">Failed to load posts</p>';
  }
}

// New post button
document.getElementById('new-post-btn').addEventListener('click', () => {
  editingPost = null;
  editingType = 'post';
  openEditor('New Post');
});

// Editor Modal
function initEditorModal() {
  const modal = document.getElementById('editor-modal');
  const closeBtn = document.getElementById('close-editor');
  const cancelBtn = document.getElementById('cancel-editor');
  const saveBtn = document.getElementById('save-editor');
  const statusSelect = document.getElementById('post-status');
  const scheduleGroup = document.getElementById('schedule-group');

  closeBtn.addEventListener('click', closeEditor);
  cancelBtn.addEventListener('click', closeEditor);

  saveBtn.addEventListener('click', saveContent);

  statusSelect.addEventListener('change', () => {
    scheduleGroup.style.display = statusSelect.value === 'scheduled' ? 'block' : 'none';
  });

  // Auto-generate slug from title
  document.getElementById('post-title').addEventListener('input', (e) => {
    if (!editingPost) {
      const slug = slugify(e.target.value);
      document.getElementById('post-slug').value = slug;
    }
  });
}

function openEditor(title) {
  document.getElementById('editor-title').textContent = title;
  document.getElementById('editor-modal').classList.remove('hidden');

  // Reset form if new
  if (!editingPost) {
    document.getElementById('post-title').value = '';
    document.getElementById('post-slug').value = '';
    document.getElementById('post-excerpt').value = '';
    document.getElementById('post-content').value = '';
    document.getElementById('post-status').value = 'draft';
    document.getElementById('post-category').value = 'insights';
    document.getElementById('post-tags').value = '';
    document.getElementById('post-image').value = '';
    document.getElementById('post-image-alt').value = '';
    document.getElementById('seo-meta-title').value = '';
    document.getElementById('seo-meta-desc').value = '';
    document.getElementById('seo-focus-keyword').value = '';
    document.getElementById('post-language').value = 'en';
  }
}

function closeEditor() {
  document.getElementById('editor-modal').classList.add('hidden');
  editingPost = null;
}

async function editPost(id) {
  try {
    const response = await api(`/blog/${id}`);
    editingPost = response.data;
    editingType = 'post';

    // Populate form
    document.getElementById('post-title').value = editingPost.title || '';
    document.getElementById('post-slug').value = editingPost.slug || '';
    document.getElementById('post-excerpt').value = editingPost.excerpt || '';
    document.getElementById('post-content').value = editingPost.content || '';
    document.getElementById('post-status').value = editingPost.status || 'draft';
    document.getElementById('post-category').value = editingPost.category || 'insights';
    document.getElementById('post-tags').value = (editingPost.tags || []).join(', ');
    document.getElementById('post-image').value = editingPost.featuredImage?.url || '';
    document.getElementById('post-image-alt').value = editingPost.featuredImage?.alt || '';
    document.getElementById('seo-meta-title').value = editingPost.seo?.metaTitle || '';
    document.getElementById('seo-meta-desc').value = editingPost.seo?.metaDescription || '';
    document.getElementById('seo-focus-keyword').value = editingPost.seo?.focusKeyword || '';
    document.getElementById('post-language').value = editingPost.language || 'en';

    openEditor('Edit Post');
  } catch (err) {
    showToast('Failed to load post', 'error');
  }
}

async function saveContent() {
  const data = {
    title: document.getElementById('post-title').value,
    slug: document.getElementById('post-slug').value,
    excerpt: document.getElementById('post-excerpt').value,
    content: document.getElementById('post-content').value,
    status: document.getElementById('post-status').value,
    category: document.getElementById('post-category').value,
    tags: document.getElementById('post-tags').value.split(',').map(t => t.trim()).filter(Boolean),
    language: document.getElementById('post-language').value,
    featuredImage: {
      url: document.getElementById('post-image').value,
      alt: document.getElementById('post-image-alt').value
    },
    seo: {
      metaTitle: document.getElementById('seo-meta-title').value,
      metaDescription: document.getElementById('seo-meta-desc').value,
      focusKeyword: document.getElementById('seo-focus-keyword').value
    }
  };

  if (data.status === 'scheduled') {
    data.scheduledAt = document.getElementById('post-scheduled').value;
  }

  try {
    if (editingPost) {
      await api(`/blog/${editingPost._id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      });
      showToast('Post updated successfully', 'success');
    } else {
      await api('/blog', {
        method: 'POST',
        body: JSON.stringify(data)
      });
      showToast('Post created successfully', 'success');
    }

    closeEditor();
    loadPosts();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

async function deletePost(id) {
  if (!confirm('Are you sure you want to delete this post?')) return;

  try {
    await api(`/blog/${id}`, { method: 'DELETE' });
    showToast('Post deleted successfully', 'success');
    loadPosts();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

async function duplicatePost(id) {
  try {
    await api(`/blog/${id}/duplicate`, { method: 'POST' });
    showToast('Post duplicated successfully', 'success');
    loadPosts();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

// Pages
async function loadPages() {
  const pagesList = document.getElementById('pages-list');
  pagesList.innerHTML = '<p class="empty-state">Loading pages...</p>';

  try {
    const response = await api('/pages');
    const pages = response.data;

    if (pages.length === 0) {
      pagesList.innerHTML = '<p class="empty-state">No pages yet</p>';
      return;
    }

    pagesList.innerHTML = `
      <table class="posts-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Slug</th>
            <th>Template</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${pages.map(page => `
            <tr>
              <td><strong>${escapeHtml(page.title)}</strong></td>
              <td>/${page.slug}</td>
              <td>${page.template || 'default'}</td>
              <td><span class="post-status ${page.status}">${page.status}</span></td>
              <td class="post-actions">
                <button onclick="editPage('${page._id}')" title="Edit">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                </button>
                <button class="delete" onclick="deletePage('${page._id}')" title="Delete">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                </button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  } catch (err) {
    console.error('Load pages error:', err);
    pagesList.innerHTML = '<p class="empty-state">Failed to load pages</p>';
  }
}

document.getElementById('new-page-btn').addEventListener('click', () => {
  editingPost = null;
  editingType = 'page';
  openEditor('New Page');
});

// Media
function initMediaUpload() {
  const uploadBtn = document.getElementById('upload-media-btn');
  const fileInput = document.getElementById('file-input');

  uploadBtn.addEventListener('click', () => fileInput.click());

  fileInput.addEventListener('change', async (e) => {
    const files = e.target.files;
    if (!files.length) return;

    for (const file of files) {
      await uploadFile(file);
    }

    fileInput.value = '';
    loadMedia();
  });
}

async function uploadFile(file) {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch(`${API_BASE}/media/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    if (!response.ok) throw new Error('Upload failed');

    showToast('File uploaded successfully', 'success');
  } catch (err) {
    showToast(err.message, 'error');
  }
}

async function loadMedia() {
  const mediaGrid = document.getElementById('media-grid');
  mediaGrid.innerHTML = '<p class="empty-state">Loading media...</p>';

  try {
    const response = await api('/media');
    const media = response.data;

    if (media.length === 0) {
      mediaGrid.innerHTML = '<p class="empty-state">No media files. Upload your first file!</p>';
      return;
    }

    mediaGrid.innerHTML = media.map(item => `
      <div class="media-item" onclick="selectMedia('${item._id}')">
        ${item.mimeType.startsWith('image/') ?
          `<img src="${item.thumbnails?.medium || item.url}" alt="${escapeHtml(item.alt || item.originalName)}">` :
          `<div style="height:120px;display:flex;align-items:center;justify-content:center;background:#f0f0f0">
            <svg viewBox="0 0 24 24" fill="none" stroke="#666" stroke-width="2" width="32" height="32">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
            </svg>
          </div>`
        }
        <div class="media-item-info">
          <div class="media-item-name">${escapeHtml(item.originalName)}</div>
        </div>
      </div>
    `).join('');
  } catch (err) {
    console.error('Load media error:', err);
    mediaGrid.innerHTML = '<p class="empty-state">Failed to load media</p>';
  }
}

function selectMedia(id) {
  // Could open a details modal or copy URL
  console.log('Selected media:', id);
}

// SEO Settings
function initSEOTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;

      tabBtns.forEach(b => b.classList.toggle('active', b === btn));
      document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.toggle('active', content.id === `tab-${tab}`);
      });
    });
  });

  // Form submissions
  document.getElementById('seo-general-form').addEventListener('submit', saveSEOSettings);
  document.getElementById('seo-social-form').addEventListener('submit', saveSEOSettings);
  document.getElementById('seo-analytics-form').addEventListener('submit', saveSEOSettings);

  // Add redirect
  document.getElementById('add-redirect-btn').addEventListener('click', addRedirect);

  // Run audit
  document.getElementById('run-audit-btn').addEventListener('click', runSEOAudit);
}

async function loadSEOSettings() {
  try {
    const response = await api('/seo/settings');
    const settings = response.data;

    // General
    document.getElementById('site-name').value = settings.siteName || '';
    document.getElementById('site-url').value = settings.siteUrl || '';
    document.getElementById('default-meta-title').value = settings.defaultMetaTitle || '';
    document.getElementById('default-meta-description').value = settings.defaultMetaDescription || '';
    document.getElementById('title-separator').value = settings.titleSeparator || ' | ';
    document.getElementById('google-verification').value = settings.verification?.googleSiteVerification || '';
    document.getElementById('bing-verification').value = settings.verification?.bingSiteVerification || '';

    // Social
    document.getElementById('og-image').value = settings.social?.ogDefaultImage || '';
    document.getElementById('twitter-handle').value = settings.social?.twitterHandle || '';
    document.getElementById('facebook-app-id').value = settings.social?.facebookAppId || '';
    document.getElementById('linkedin-company').value = settings.social?.linkedInCompany || '';

    // Analytics
    document.getElementById('ga-id').value = settings.analytics?.googleAnalyticsId || '';
    document.getElementById('ga4-id').value = settings.analytics?.ga4MeasurementId || '';
    document.getElementById('gtm-id').value = settings.analytics?.googleTagManagerId || '';
    document.getElementById('fb-pixel').value = settings.analytics?.facebookPixelId || '';

    // Redirects
    loadRedirects(settings.redirects || []);

    // Update char counts
    updateCharCount('default-meta-title', 'meta-title-count');
    updateCharCount('default-meta-description', 'meta-desc-count');
  } catch (err) {
    console.error('Load SEO settings error:', err);
    showToast('Failed to load SEO settings', 'error');
  }
}

async function saveSEOSettings(e) {
  e.preventDefault();

  const formData = new FormData(e.target);
  const data = {};

  formData.forEach((value, key) => {
    const keys = key.split('.');
    if (keys.length === 2) {
      if (!data[keys[0]]) data[keys[0]] = {};
      data[keys[0]][keys[1]] = value;
    } else {
      data[key] = value;
    }
  });

  try {
    await api('/seo/settings', {
      method: 'PUT',
      body: JSON.stringify(data)
    });
    showToast('Settings saved successfully', 'success');
  } catch (err) {
    showToast(err.message, 'error');
  }
}

function loadRedirects(redirects) {
  const list = document.getElementById('redirects-list');

  if (!redirects.length) {
    list.innerHTML = '<p class="empty-state">No redirects configured</p>';
    return;
  }

  list.innerHTML = redirects.map((r, i) => `
    <div class="redirect-item">
      <span class="redirect-source">${escapeHtml(r.source)}</span>
      <span class="redirect-arrow">&rarr;</span>
      <span class="redirect-dest">${escapeHtml(r.destination)}</span>
      <span class="redirect-type">${r.type}</span>
      <button class="btn btn-sm btn-danger" onclick="deleteRedirect(${i})">Delete</button>
    </div>
  `).join('');
}

async function addRedirect() {
  const source = document.getElementById('redirect-source').value;
  const destination = document.getElementById('redirect-dest').value;
  const type = parseInt(document.getElementById('redirect-type').value);

  if (!source || !destination) {
    showToast('Please fill in both source and destination', 'error');
    return;
  }

  try {
    await api('/seo/redirects', {
      method: 'POST',
      body: JSON.stringify({ source, destination, type })
    });

    document.getElementById('redirect-source').value = '';
    document.getElementById('redirect-dest').value = '';

    showToast('Redirect added successfully', 'success');
    loadSEOSettings();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

async function deleteRedirect(index) {
  try {
    await api(`/seo/redirects/${index}`, { method: 'DELETE' });
    showToast('Redirect deleted', 'success');
    loadSEOSettings();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

async function runSEOAudit() {
  const results = document.getElementById('audit-results');
  results.innerHTML = '<p class="empty-state">Running audit...</p>';

  try {
    const response = await api('/seo/audit');
    const audit = response.data;

    const scoreClass = audit.score >= 70 ? 'good' : audit.score >= 40 ? 'warning' : 'poor';

    results.innerHTML = `
      <div class="audit-score">
        <div class="score ${scoreClass}">${audit.score}</div>
        <div>SEO Score</div>
      </div>

      <div class="audit-summary" style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:24px;text-align:center">
        <div style="padding:16px;background:#f8f9fa;border-radius:8px">
          <div style="font-size:24px;font-weight:700;color:#dc3545">${audit.summary.issues}</div>
          <div>Issues</div>
        </div>
        <div style="padding:16px;background:#f8f9fa;border-radius:8px">
          <div style="font-size:24px;font-weight:700;color:#ffc107">${audit.summary.warnings}</div>
          <div>Warnings</div>
        </div>
        <div style="padding:16px;background:#f8f9fa;border-radius:8px">
          <div style="font-size:24px;font-weight:700;color:#28a745">${audit.summary.passed}</div>
          <div>Passed</div>
        </div>
      </div>

      ${audit.issues.length > 0 ? `
        <div class="audit-section">
          <h4>Issues (${audit.issues.length})</h4>
          ${audit.issues.map(issue => `
            <div class="audit-issue">
              <div>
                <strong>${issue.message}</strong>
                ${issue.content ? `<div style="font-size:12px;color:#666;margin-top:4px">${issue.content.type}: ${escapeHtml(issue.content.title)}</div>` : ''}
              </div>
            </div>
          `).join('')}
        </div>
      ` : ''}

      ${audit.warnings.length > 0 ? `
        <div class="audit-section">
          <h4>Warnings (${audit.warnings.length})</h4>
          ${audit.warnings.slice(0, 10).map(warning => `
            <div class="audit-warning">
              <div>
                <strong>${warning.message}</strong>
                ${warning.content ? `<div style="font-size:12px;color:#666;margin-top:4px">${warning.content.type}: ${escapeHtml(warning.content.title)}</div>` : ''}
              </div>
            </div>
          `).join('')}
          ${audit.warnings.length > 10 ? `<p style="color:#666;font-size:13px">...and ${audit.warnings.length - 10} more warnings</p>` : ''}
        </div>
      ` : ''}

      ${audit.passed.length > 0 ? `
        <div class="audit-section">
          <h4>Passed (${audit.passed.length})</h4>
          ${audit.passed.map(item => `
            <div class="audit-passed">${item}</div>
          `).join('')}
        </div>
      ` : ''}
    `;
  } catch (err) {
    console.error('SEO audit error:', err);
    results.innerHTML = '<p class="empty-state">Failed to run audit</p>';
  }
}

// Analytics
async function loadAnalytics() {
  const content = document.getElementById('analytics-content');

  try {
    const response = await api('/analytics/content');
    const data = response.data;

    content.innerHTML = `
      <div style="margin-bottom:24px">
        <p>Published in last ${data.period}: <strong>${data.publishedInPeriod}</strong> posts</p>
      </div>

      <h4>Top Performing Content</h4>
      ${data.topPerforming.length > 0 ? `
        <table class="posts-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Views</th>
              <th>Published</th>
            </tr>
          </thead>
          <tbody>
            ${data.topPerforming.map(post => `
              <tr>
                <td>${escapeHtml(post.title)}</td>
                <td>${post.category || '-'}</td>
                <td>${formatNumber(post.views || 0)}</td>
                <td>${formatDate(post.publishedAt)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      ` : '<p class="empty-state">No published content yet</p>'}
    `;
  } catch (err) {
    console.error('Load analytics error:', err);
    content.innerHTML = '<p class="empty-state">Failed to load analytics</p>';
  }
}

// Character counters
function initCharCounters() {
  const inputs = [
    ['default-meta-title', 'meta-title-count'],
    ['default-meta-description', 'meta-desc-count'],
    ['seo-meta-title', 'seo-title-count'],
    ['seo-meta-desc', 'seo-desc-count']
  ];

  inputs.forEach(([inputId, countId]) => {
    const input = document.getElementById(inputId);
    if (input) {
      input.addEventListener('input', () => updateCharCount(inputId, countId));
    }
  });
}

function updateCharCount(inputId, countId) {
  const input = document.getElementById(inputId);
  const count = document.getElementById(countId);
  if (input && count) {
    count.textContent = input.value.length;
  }
}

// Utility Functions
function showToast(message, type = 'info') {
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toast-message');

  toastMessage.textContent = message;
  toast.className = `toast ${type}`;

  setTimeout(() => {
    toast.classList.add('hidden');
  }, 3000);
}

function escapeHtml(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function formatDate(dateStr) {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

function formatNumber(num) {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}

function slugify(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Make functions global for onclick handlers
window.editPost = editPost;
window.deletePost = deletePost;
window.duplicatePost = duplicatePost;
window.editPage = editPage;
window.deletePage = deletePage;
window.selectMedia = selectMedia;
window.deleteRedirect = deleteRedirect;

// Page functions (placeholders)
async function editPage(id) {
  showToast('Page editing coming soon', 'info');
}

async function deletePage(id) {
  if (!confirm('Are you sure you want to delete this page?')) return;

  try {
    await api(`/pages/${id}`, { method: 'DELETE' });
    showToast('Page deleted successfully', 'success');
    loadPages();
  } catch (err) {
    showToast(err.message, 'error');
  }
}
