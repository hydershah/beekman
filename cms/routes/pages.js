const express = require('express');
const router = express.Router();
const Page = require('../models/Page');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/pages
// @desc    Get all pages
// @access  Public (published only) / Private (all)
router.get('/', async (req, res) => {
  try {
    const { status, template, language = 'en', parent } = req.query;

    const query = {};

    if (!req.headers.authorization) {
      query.status = 'published';
    } else if (status) {
      query.status = status;
    }

    if (template) query.template = template;
    if (language) query.language = language;
    if (parent) query.parent = parent;

    const pages = await Page.find(query)
      .populate('parent', 'title slug')
      .populate('createdBy', 'name')
      .sort({ order: 1 });

    res.json({ success: true, data: pages });
  } catch (error) {
    console.error('Get pages error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/pages/navigation
// @desc    Get navigation tree
// @access  Public
router.get('/navigation', async (req, res) => {
  try {
    const { language = 'en' } = req.query;
    const navigation = await Page.getNavigation(language);
    res.json({ success: true, data: navigation });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/pages/:slug
// @desc    Get page by slug
// @access  Public (published) / Private (all)
router.get('/:slug', async (req, res) => {
  try {
    const page = await Page.findOne({ slug: req.params.slug })
      .populate('parent', 'title slug')
      .populate('createdBy', 'name')
      .populate('updatedBy', 'name');

    if (!page) {
      return res.status(404).json({ error: 'Page not found' });
    }

    if (page.status !== 'published' && !req.headers.authorization) {
      return res.status(404).json({ error: 'Page not found' });
    }

    res.json({ success: true, data: page });
  } catch (error) {
    console.error('Get page error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/pages
// @desc    Create page
// @access  Private (admin, editor)
router.post('/', protect, authorize('admin', 'editor'), async (req, res) => {
  try {
    const pageData = {
      ...req.body,
      createdBy: req.user._id,
      updatedBy: req.user._id
    };

    const page = await Page.create(pageData);
    await page.populate('createdBy', 'name');

    res.status(201).json({ success: true, data: page });
  } catch (error) {
    console.error('Create page error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ error: 'A page with this slug already exists' });
    }
    res.status(500).json({ error: error.message || 'Server error' });
  }
});

// @route   PUT /api/pages/:id
// @desc    Update page
// @access  Private (admin, editor)
router.put('/:id', protect, authorize('admin', 'editor'), async (req, res) => {
  try {
    const page = await Page.findById(req.params.id);

    if (!page) {
      return res.status(404).json({ error: 'Page not found' });
    }

    const updatedPage = await Page.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedBy: req.user._id },
      { new: true, runValidators: true }
    ).populate('createdBy', 'name').populate('updatedBy', 'name');

    res.json({ success: true, data: updatedPage });
  } catch (error) {
    console.error('Update page error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ error: 'A page with this slug already exists' });
    }
    res.status(500).json({ error: error.message || 'Server error' });
  }
});

// @route   DELETE /api/pages/:id
// @desc    Delete page
// @access  Private (admin)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const page = await Page.findById(req.params.id);

    if (!page) {
      return res.status(404).json({ error: 'Page not found' });
    }

    // Check if page has children
    const childrenCount = await Page.countDocuments({ parent: req.params.id });
    if (childrenCount > 0) {
      return res.status(400).json({
        error: 'Cannot delete page with children. Delete or reassign children first.'
      });
    }

    await page.deleteOne();

    res.json({ success: true, message: 'Page deleted successfully' });
  } catch (error) {
    console.error('Delete page error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/pages/reorder
// @desc    Reorder pages
// @access  Private (admin, editor)
router.put('/reorder', protect, authorize('admin', 'editor'), async (req, res) => {
  try {
    const { pages } = req.body; // Array of { id, order, parent }

    const bulkOps = pages.map(page => ({
      updateOne: {
        filter: { _id: page.id },
        update: { order: page.order, parent: page.parent || null }
      }
    }));

    await Page.bulkWrite(bulkOps);

    res.json({ success: true, message: 'Pages reordered successfully' });
  } catch (error) {
    console.error('Reorder pages error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
