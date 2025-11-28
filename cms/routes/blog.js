const express = require('express');
const router = express.Router();
const BlogPost = require('../models/BlogPost');
const { protect, authorize } = require('../middleware/auth');
const { marked } = require('marked');

// Configure marked for security
marked.setOptions({
  headerIds: true,
  mangle: false
});

// @route   GET /api/blog
// @desc    Get all blog posts (with filters)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      category,
      language = 'en',
      search,
      author,
      tag
    } = req.query;

    const query = {};

    // Public access only sees published posts
    if (!req.headers.authorization) {
      query.status = 'published';
      query.publishedAt = { $lte: new Date() };
    } else if (status) {
      query.status = status;
    }

    if (category) query.category = category;
    if (language) query.language = language;
    if (author) query.author = author;
    if (tag) query.tags = { $in: [tag] };

    if (search) {
      query.$text = { $search: search };
    }

    const total = await BlogPost.countDocuments(query);
    const posts = await BlogPost.find(query)
      .populate('author', 'name avatar')
      .sort({ publishedAt: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: posts,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/blog/categories
// @desc    Get blog categories with counts
// @access  Public
router.get('/categories', async (req, res) => {
  try {
    const categories = await BlogPost.aggregate([
      { $match: { status: 'published' } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/blog/tags
// @desc    Get all tags with counts
// @access  Public
router.get('/tags', async (req, res) => {
  try {
    const tags = await BlogPost.aggregate([
      { $match: { status: 'published' } },
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 50 }
    ]);

    res.json({ success: true, data: tags });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/blog/:slug
// @desc    Get single blog post by slug
// @access  Public
router.get('/:slug', async (req, res) => {
  try {
    const post = await BlogPost.findOne({ slug: req.params.slug })
      .populate('author', 'name avatar');

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Only allow viewing published posts publicly
    if (post.status !== 'published' && !req.headers.authorization) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Increment views
    await post.incrementViews();

    res.json({ success: true, data: post });
  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/blog
// @desc    Create blog post
// @access  Private (admin, editor, author)
router.post('/', protect, async (req, res) => {
  try {
    const {
      title,
      slug,
      excerpt,
      content,
      featuredImage,
      category,
      tags,
      status,
      scheduledAt,
      seo,
      language
    } = req.body;

    // Convert markdown to HTML
    const contentHtml = content ? marked(content) : '';

    const post = await BlogPost.create({
      title,
      slug,
      excerpt,
      content,
      contentHtml,
      featuredImage,
      category,
      tags,
      status,
      scheduledAt,
      seo,
      language,
      author: req.user._id
    });

    await post.populate('author', 'name avatar');

    res.status(201).json({ success: true, data: post });
  } catch (error) {
    console.error('Create post error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ error: 'A post with this slug already exists' });
    }
    res.status(500).json({ error: error.message || 'Server error' });
  }
});

// @route   PUT /api/blog/:id
// @desc    Update blog post
// @access  Private (admin, editor, author)
router.put('/:id', protect, async (req, res) => {
  try {
    const {
      title,
      slug,
      excerpt,
      content,
      featuredImage,
      category,
      tags,
      status,
      scheduledAt,
      seo,
      language
    } = req.body;

    const post = await BlogPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Check ownership (unless admin)
    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to update this post' });
    }

    // Convert markdown to HTML
    const contentHtml = content ? marked(content) : post.contentHtml;

    const updatedPost = await BlogPost.findByIdAndUpdate(
      req.params.id,
      {
        title,
        slug,
        excerpt,
        content,
        contentHtml,
        featuredImage,
        category,
        tags,
        status,
        scheduledAt,
        seo,
        language
      },
      { new: true, runValidators: true }
    ).populate('author', 'name avatar');

    res.json({ success: true, data: updatedPost });
  } catch (error) {
    console.error('Update post error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ error: 'A post with this slug already exists' });
    }
    res.status(500).json({ error: error.message || 'Server error' });
  }
});

// @route   DELETE /api/blog/:id
// @desc    Delete blog post
// @access  Private (admin, editor)
router.delete('/:id', protect, authorize('admin', 'editor'), async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    await post.deleteOne();

    res.json({ success: true, message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/blog/:id/duplicate
// @desc    Duplicate a blog post
// @access  Private
router.post('/:id/duplicate', protect, async (req, res) => {
  try {
    const original = await BlogPost.findById(req.params.id);

    if (!original) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const duplicate = await BlogPost.create({
      title: `${original.title} (Copy)`,
      excerpt: original.excerpt,
      content: original.content,
      contentHtml: original.contentHtml,
      featuredImage: original.featuredImage,
      category: original.category,
      tags: original.tags,
      status: 'draft',
      seo: original.seo,
      language: original.language,
      author: req.user._id
    });

    await duplicate.populate('author', 'name avatar');

    res.status(201).json({ success: true, data: duplicate });
  } catch (error) {
    console.error('Duplicate post error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
