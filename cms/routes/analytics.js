const express = require('express');
const router = express.Router();
const BlogPost = require('../models/BlogPost');
const Page = require('../models/Page');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/analytics/dashboard
// @desc    Get dashboard analytics
// @access  Private
router.get('/dashboard', protect, async (req, res) => {
  try {
    const [
      totalPosts,
      publishedPosts,
      draftPosts,
      totalPages,
      totalViews,
      recentPosts,
      topPosts,
      postsByCategory
    ] = await Promise.all([
      BlogPost.countDocuments(),
      BlogPost.countDocuments({ status: 'published' }),
      BlogPost.countDocuments({ status: 'draft' }),
      Page.countDocuments(),
      BlogPost.aggregate([{ $group: { _id: null, total: { $sum: '$views' } } }]),
      BlogPost.find().sort({ createdAt: -1 }).limit(5).select('title slug status createdAt'),
      BlogPost.find({ status: 'published' }).sort({ views: -1 }).limit(5).select('title slug views'),
      BlogPost.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ])
    ]);

    res.json({
      success: true,
      data: {
        overview: {
          totalPosts,
          publishedPosts,
          draftPosts,
          totalPages,
          totalViews: totalViews[0]?.total || 0
        },
        recentPosts,
        topPosts,
        postsByCategory
      }
    });
  } catch (error) {
    console.error('Dashboard analytics error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/analytics/content
// @desc    Get content performance analytics
// @access  Private
router.get('/content', protect, async (req, res) => {
  try {
    const { period = '30d' } = req.query;

    // Calculate date range
    const now = new Date();
    let startDate;
    switch (period) {
      case '7d':
        startDate = new Date(now - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now - 30 * 24 * 60 * 60 * 1000);
    }

    const [publishedInPeriod, viewsByPost] = await Promise.all([
      BlogPost.countDocuments({
        publishedAt: { $gte: startDate }
      }),
      BlogPost.find({ status: 'published' })
        .sort({ views: -1 })
        .limit(10)
        .select('title slug views publishedAt category')
    ]);

    res.json({
      success: true,
      data: {
        period,
        publishedInPeriod,
        topPerforming: viewsByPost
      }
    });
  } catch (error) {
    console.error('Content analytics error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/analytics/seo-health
// @desc    Get SEO health metrics
// @access  Private (admin)
router.get('/seo-health', protect, authorize('admin'), async (req, res) => {
  try {
    const posts = await BlogPost.find({ status: 'published' });
    const pages = await Page.find({ status: 'published' });

    const metrics = {
      posts: {
        total: posts.length,
        withMetaTitle: 0,
        withMetaDescription: 0,
        withFocusKeyword: 0,
        withFeaturedImage: 0
      },
      pages: {
        total: pages.length,
        withMetaTitle: 0,
        withMetaDescription: 0,
        withFocusKeyword: 0
      }
    };

    posts.forEach(post => {
      if (post.seo?.metaTitle) metrics.posts.withMetaTitle++;
      if (post.seo?.metaDescription) metrics.posts.withMetaDescription++;
      if (post.seo?.focusKeyword) metrics.posts.withFocusKeyword++;
      if (post.featuredImage?.url) metrics.posts.withFeaturedImage++;
    });

    pages.forEach(page => {
      if (page.seo?.metaTitle) metrics.pages.withMetaTitle++;
      if (page.seo?.metaDescription) metrics.pages.withMetaDescription++;
      if (page.seo?.focusKeyword) metrics.pages.withFocusKeyword++;
    });

    // Calculate percentages
    const calculatePercentage = (value, total) =>
      total > 0 ? Math.round((value / total) * 100) : 0;

    const health = {
      posts: {
        ...metrics.posts,
        metaTitlePercentage: calculatePercentage(metrics.posts.withMetaTitle, metrics.posts.total),
        metaDescriptionPercentage: calculatePercentage(metrics.posts.withMetaDescription, metrics.posts.total),
        focusKeywordPercentage: calculatePercentage(metrics.posts.withFocusKeyword, metrics.posts.total),
        featuredImagePercentage: calculatePercentage(metrics.posts.withFeaturedImage, metrics.posts.total)
      },
      pages: {
        ...metrics.pages,
        metaTitlePercentage: calculatePercentage(metrics.pages.withMetaTitle, metrics.pages.total),
        metaDescriptionPercentage: calculatePercentage(metrics.pages.withMetaDescription, metrics.pages.total),
        focusKeywordPercentage: calculatePercentage(metrics.pages.withFocusKeyword, metrics.pages.total)
      },
      overallScore: calculateOverallSEOScore(metrics)
    };

    res.json({ success: true, data: health });
  } catch (error) {
    console.error('SEO health error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/analytics/track-view
// @desc    Track page view (for frontend)
// @access  Public
router.post('/track-view', async (req, res) => {
  try {
    const { type, slug } = req.body;

    if (type === 'blog') {
      await BlogPost.findOneAndUpdate(
        { slug, status: 'published' },
        { $inc: { views: 1 } }
      );
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

function calculateOverallSEOScore(metrics) {
  const postTotal = metrics.posts.total;
  const pageTotal = metrics.pages.total;
  const total = postTotal + pageTotal;

  if (total === 0) return 100;

  const completedChecks =
    metrics.posts.withMetaTitle +
    metrics.posts.withMetaDescription +
    metrics.posts.withFocusKeyword +
    metrics.posts.withFeaturedImage +
    metrics.pages.withMetaTitle +
    metrics.pages.withMetaDescription +
    metrics.pages.withFocusKeyword;

  const totalChecks = postTotal * 4 + pageTotal * 3;

  return totalChecks > 0 ? Math.round((completedChecks / totalChecks) * 100) : 100;
}

module.exports = router;
