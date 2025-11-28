const express = require('express');
const router = express.Router();
const SEOSettings = require('../models/SEOSettings');
const BlogPost = require('../models/BlogPost');
const Page = require('../models/Page');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/seo/settings
// @desc    Get SEO settings
// @access  Public (limited) / Private (full)
router.get('/settings', async (req, res) => {
  try {
    const settings = await SEOSettings.getSettings();

    // Public access gets limited data
    if (!req.headers.authorization) {
      return res.json({
        success: true,
        data: {
          siteName: settings.siteName,
          siteUrl: settings.siteUrl,
          defaultMetaTitle: settings.defaultMetaTitle,
          defaultMetaDescription: settings.defaultMetaDescription,
          social: settings.social,
          structuredData: settings.structuredData
        }
      });
    }

    res.json({ success: true, data: settings });
  } catch (error) {
    console.error('Get SEO settings error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/seo/settings
// @desc    Update SEO settings
// @access  Private (admin)
router.put('/settings', protect, authorize('admin'), async (req, res) => {
  try {
    let settings = await SEOSettings.findOne();

    if (!settings) {
      settings = await SEOSettings.create({
        ...req.body,
        updatedBy: req.user._id
      });
    } else {
      Object.assign(settings, req.body);
      settings.updatedBy = req.user._id;
      await settings.save();
    }

    res.json({ success: true, data: settings });
  } catch (error) {
    console.error('Update SEO settings error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/seo/analyze/:type/:id
// @desc    Analyze SEO for a specific content
// @access  Private
router.get('/analyze/:type/:id', protect, async (req, res) => {
  try {
    const { type, id } = req.params;
    let content;

    if (type === 'blog') {
      content = await BlogPost.findById(id);
    } else if (type === 'page') {
      content = await Page.findById(id);
    }

    if (!content) {
      return res.status(404).json({ error: 'Content not found' });
    }

    const analysis = analyzeSEO(content, type);

    res.json({ success: true, data: analysis });
  } catch (error) {
    console.error('SEO analyze error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/seo/audit
// @desc    Run SEO audit on entire site
// @access  Private (admin)
router.get('/audit', protect, authorize('admin'), async (req, res) => {
  try {
    const [posts, pages, settings] = await Promise.all([
      BlogPost.find({ status: 'published' }),
      Page.find({ status: 'published' }),
      SEOSettings.getSettings()
    ]);

    const issues = [];
    const warnings = [];
    const passed = [];

    // Check global settings
    if (!settings.defaultMetaDescription || settings.defaultMetaDescription.length < 50) {
      issues.push({
        type: 'global',
        severity: 'error',
        message: 'Default meta description is missing or too short'
      });
    } else {
      passed.push('Default meta description is set');
    }

    if (!settings.social?.ogDefaultImage) {
      warnings.push({
        type: 'global',
        severity: 'warning',
        message: 'No default Open Graph image set'
      });
    }

    if (!settings.verification?.googleSiteVerification) {
      warnings.push({
        type: 'global',
        severity: 'warning',
        message: 'Google Search Console not verified'
      });
    }

    // Check posts
    posts.forEach(post => {
      const postAnalysis = analyzeSEO(post, 'blog');
      postAnalysis.issues.forEach(issue => {
        issues.push({
          ...issue,
          content: { type: 'blog', id: post._id, title: post.title, slug: post.slug }
        });
      });
      postAnalysis.warnings.forEach(warning => {
        warnings.push({
          ...warning,
          content: { type: 'blog', id: post._id, title: post.title, slug: post.slug }
        });
      });
    });

    // Check pages
    pages.forEach(page => {
      const pageAnalysis = analyzeSEO(page, 'page');
      pageAnalysis.issues.forEach(issue => {
        issues.push({
          ...issue,
          content: { type: 'page', id: page._id, title: page.title, slug: page.slug }
        });
      });
      pageAnalysis.warnings.forEach(warning => {
        warnings.push({
          ...warning,
          content: { type: 'page', id: page._id, title: page.title, slug: page.slug }
        });
      });
    });

    const score = calculateSEOScore(issues.length, warnings.length, passed.length);

    res.json({
      success: true,
      data: {
        score,
        summary: {
          totalContent: posts.length + pages.length,
          issues: issues.length,
          warnings: warnings.length,
          passed: passed.length
        },
        issues,
        warnings,
        passed
      }
    });
  } catch (error) {
    console.error('SEO audit error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/seo/redirects
// @desc    Add redirect
// @access  Private (admin)
router.post('/redirects', protect, authorize('admin'), async (req, res) => {
  try {
    const { source, destination, type = 301 } = req.body;

    const settings = await SEOSettings.getSettings();

    // Check for duplicate
    const exists = settings.redirects.find(r => r.source === source);
    if (exists) {
      return res.status(400).json({ error: 'Redirect for this source already exists' });
    }

    settings.redirects.push({ source, destination, type, isActive: true });
    await settings.save();

    res.json({ success: true, data: settings.redirects });
  } catch (error) {
    console.error('Add redirect error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   DELETE /api/seo/redirects/:index
// @desc    Delete redirect
// @access  Private (admin)
router.delete('/redirects/:index', protect, authorize('admin'), async (req, res) => {
  try {
    const settings = await SEOSettings.getSettings();

    const index = parseInt(req.params.index);
    if (index < 0 || index >= settings.redirects.length) {
      return res.status(404).json({ error: 'Redirect not found' });
    }

    settings.redirects.splice(index, 1);
    await settings.save();

    res.json({ success: true, data: settings.redirects });
  } catch (error) {
    console.error('Delete redirect error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Helper function to analyze SEO
function analyzeSEO(content, type) {
  const issues = [];
  const warnings = [];
  const suggestions = [];
  const passed = [];

  const seo = content.seo || {};
  const title = content.title || '';
  const bodyContent = type === 'blog' ? content.content : content.content;

  // Meta Title checks
  if (!seo.metaTitle) {
    issues.push({ severity: 'error', field: 'metaTitle', message: 'Meta title is missing' });
  } else if (seo.metaTitle.length < 30) {
    warnings.push({ severity: 'warning', field: 'metaTitle', message: 'Meta title is too short (< 30 chars)' });
  } else if (seo.metaTitle.length > 60) {
    warnings.push({ severity: 'warning', field: 'metaTitle', message: 'Meta title is too long (> 60 chars)' });
  } else {
    passed.push('Meta title length is optimal');
  }

  // Meta Description checks
  if (!seo.metaDescription) {
    issues.push({ severity: 'error', field: 'metaDescription', message: 'Meta description is missing' });
  } else if (seo.metaDescription.length < 70) {
    warnings.push({ severity: 'warning', field: 'metaDescription', message: 'Meta description is too short (< 70 chars)' });
  } else if (seo.metaDescription.length > 160) {
    warnings.push({ severity: 'warning', field: 'metaDescription', message: 'Meta description is too long (> 160 chars)' });
  } else {
    passed.push('Meta description length is optimal');
  }

  // Focus keyword checks
  if (!seo.focusKeyword) {
    warnings.push({ severity: 'warning', field: 'focusKeyword', message: 'No focus keyword set' });
  } else {
    // Check if keyword is in title
    if (!title.toLowerCase().includes(seo.focusKeyword.toLowerCase())) {
      suggestions.push({ field: 'focusKeyword', message: 'Focus keyword not found in title' });
    }
    // Check if keyword is in meta description
    if (seo.metaDescription && !seo.metaDescription.toLowerCase().includes(seo.focusKeyword.toLowerCase())) {
      suggestions.push({ field: 'focusKeyword', message: 'Focus keyword not found in meta description' });
    }
  }

  // Content checks for blog posts
  if (type === 'blog' && bodyContent) {
    const wordCount = bodyContent.split(/\s+/).length;
    if (wordCount < 300) {
      warnings.push({ severity: 'warning', field: 'content', message: 'Content is too short (< 300 words)' });
    } else if (wordCount >= 1000) {
      passed.push('Content has good length (1000+ words)');
    }

    // Check for images with alt text
    if (!content.featuredImage?.alt) {
      warnings.push({ severity: 'warning', field: 'featuredImage', message: 'Featured image missing alt text' });
    }
  }

  // Calculate score
  const score = calculateSEOScore(issues.length, warnings.length, passed.length);

  return { score, issues, warnings, suggestions, passed };
}

function calculateSEOScore(issueCount, warningCount, passedCount) {
  const total = issueCount * 3 + warningCount + passedCount;
  if (total === 0) return 50;

  const penalty = (issueCount * 20) + (warningCount * 5);
  const bonus = passedCount * 10;

  return Math.max(0, Math.min(100, 70 - penalty + bonus));
}

module.exports = router;
