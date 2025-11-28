const express = require('express');
const router = express.Router();
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;
const Media = require('../models/Media');
const { protect } = require('../middleware/auth');

// Configure multer storage
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    const yearMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
    const destPath = path.join(uploadDir, yearMonth);

    try {
      await fs.mkdir(destPath, { recursive: true });
      cb(null, destPath);
    } catch (err) {
      cb(err);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueSuffix}${ext}`);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
    'application/pdf',
    'video/mp4',
    'video/webm'
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  }
});

// @route   GET /api/media
// @desc    Get all media
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { page = 1, limit = 50, folder, type, search } = req.query;

    const query = {};
    if (folder) query.folder = folder;
    if (type) query.mimeType = new RegExp(`^${type}/`);
    if (search) query.$text = { $search: search };

    const total = await Media.countDocuments(query);
    const media = await Media.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate('uploadedBy', 'name');

    res.json({
      success: true,
      data: media,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get media error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/media/folders
// @desc    Get folder list
// @access  Private
router.get('/folders', protect, async (req, res) => {
  try {
    const folders = await Media.distinct('folder');
    res.json({ success: true, data: folders });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/media/upload
// @desc    Upload file
// @access  Private
router.post('/upload', protect, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { folder = 'general', alt, title } = req.body;
    const file = req.file;

    const yearMonth = new Date().toISOString().slice(0, 7);
    const baseUrl = `/uploads/${yearMonth}`;

    const mediaData = {
      filename: file.filename,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      path: file.path,
      url: `${baseUrl}/${file.filename}`,
      folder,
      alt: alt || '',
      title: title || file.originalname,
      uploadedBy: req.user._id
    };

    // Process images
    if (file.mimetype.startsWith('image/') && !file.mimetype.includes('svg')) {
      const image = sharp(file.path);
      const metadata = await image.metadata();

      mediaData.dimensions = {
        width: metadata.width,
        height: metadata.height
      };

      // Generate thumbnails
      const thumbnailDir = path.join(__dirname, '../uploads', yearMonth, 'thumbnails');
      await fs.mkdir(thumbnailDir, { recursive: true });

      const baseName = path.parse(file.filename).name;
      const ext = '.webp';

      // Small thumbnail (150x150)
      const smallPath = path.join(thumbnailDir, `${baseName}-small${ext}`);
      await image.clone().resize(150, 150, { fit: 'cover' }).webp({ quality: 80 }).toFile(smallPath);

      // Medium thumbnail (300x300)
      const mediumPath = path.join(thumbnailDir, `${baseName}-medium${ext}`);
      await image.clone().resize(300, 300, { fit: 'cover' }).webp({ quality: 80 }).toFile(mediumPath);

      // Large thumbnail (800x800)
      const largePath = path.join(thumbnailDir, `${baseName}-large${ext}`);
      await image.clone().resize(800, 800, { fit: 'inside' }).webp({ quality: 85 }).toFile(largePath);

      mediaData.thumbnails = {
        small: `${baseUrl}/thumbnails/${baseName}-small${ext}`,
        medium: `${baseUrl}/thumbnails/${baseName}-medium${ext}`,
        large: `${baseUrl}/thumbnails/${baseName}-large${ext}`
      };
    }

    const media = await Media.create(mediaData);
    await media.populate('uploadedBy', 'name');

    res.status(201).json({ success: true, data: media });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message || 'Server error' });
  }
});

// @route   PUT /api/media/:id
// @desc    Update media metadata
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const { alt, title, folder, tags, seo } = req.body;

    const media = await Media.findByIdAndUpdate(
      req.params.id,
      { alt, title, folder, tags, seo },
      { new: true }
    );

    if (!media) {
      return res.status(404).json({ error: 'Media not found' });
    }

    res.json({ success: true, data: media });
  } catch (error) {
    console.error('Update media error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   DELETE /api/media/:id
// @desc    Delete media
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);

    if (!media) {
      return res.status(404).json({ error: 'Media not found' });
    }

    // Delete physical files
    try {
      await fs.unlink(media.path);
      if (media.thumbnails) {
        const dir = path.dirname(media.path);
        const baseName = path.parse(media.filename).name;
        await Promise.all([
          fs.unlink(path.join(dir, 'thumbnails', `${baseName}-small.webp`)).catch(() => {}),
          fs.unlink(path.join(dir, 'thumbnails', `${baseName}-medium.webp`)).catch(() => {}),
          fs.unlink(path.join(dir, 'thumbnails', `${baseName}-large.webp`)).catch(() => {})
        ]);
      }
    } catch (fileErr) {
      console.error('Error deleting files:', fileErr);
    }

    await media.deleteOne();

    res.json({ success: true, message: 'Media deleted successfully' });
  } catch (error) {
    console.error('Delete media error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
