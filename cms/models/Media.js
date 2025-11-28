const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  mimeType: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  path: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },

  // Image specific
  dimensions: {
    width: Number,
    height: Number
  },
  thumbnails: {
    small: String,  // 150x150
    medium: String, // 300x300
    large: String   // 800x800
  },

  // Metadata
  alt: {
    type: String,
    default: ''
  },
  caption: String,
  title: String,

  // Organization
  folder: {
    type: String,
    default: 'general'
  },
  tags: [String],

  // SEO
  seo: {
    title: String,
    description: String
  },

  // Usage tracking
  usedIn: [{
    model: String,
    documentId: mongoose.Schema.Types.ObjectId,
    field: String
  }],

  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes
mediaSchema.index({ folder: 1 });
mediaSchema.index({ mimeType: 1 });
mediaSchema.index({ tags: 1 });
mediaSchema.index({ originalName: 'text', title: 'text', alt: 'text' });

// Virtual for checking if image
mediaSchema.virtual('isImage').get(function() {
  return this.mimeType.startsWith('image/');
});

// Get by folder
mediaSchema.statics.getByFolder = function(folder, options = {}) {
  const { limit = 50, skip = 0 } = options;
  return this.find({ folder })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
};

module.exports = mongoose.model('Media', mediaSchema);
