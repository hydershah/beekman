const mongoose = require('mongoose');
const slugify = require('slugify');

const contentBlockSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['hero', 'text', 'image', 'gallery', 'cta', 'testimonial', 'stats', 'services', 'team', 'contact', 'custom'],
    required: true
  },
  order: {
    type: Number,
    default: 0
  },
  settings: {
    type: mongoose.Schema.Types.Mixed
  },
  content: {
    type: mongoose.Schema.Types.Mixed
  },
  isVisible: {
    type: Boolean,
    default: true
  }
}, { _id: true });

const pageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  template: {
    type: String,
    enum: ['default', 'landing', 'about', 'services', 'contact', 'blog-list', 'custom'],
    default: 'default'
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  content: {
    type: String
  },
  contentBlocks: [contentBlockSchema],

  // Page hierarchy
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Page',
    default: null
  },
  order: {
    type: Number,
    default: 0
  },
  showInNav: {
    type: Boolean,
    default: true
  },
  showInFooter: {
    type: Boolean,
    default: false
  },

  // SEO
  seo: {
    metaTitle: {
      type: String,
      maxlength: 70
    },
    metaDescription: {
      type: String,
      maxlength: 160
    },
    focusKeyword: String,
    canonicalUrl: String,
    ogImage: String,
    ogTitle: String,
    ogDescription: String,
    noIndex: {
      type: Boolean,
      default: false
    },
    noFollow: {
      type: Boolean,
      default: false
    },
    structuredData: mongoose.Schema.Types.Mixed
  },

  // Localization
  language: {
    type: String,
    enum: ['en', 'es', 'fr', 'pt'],
    default: 'en'
  },
  translations: [{
    language: String,
    pageId: mongoose.Schema.Types.ObjectId
  }],

  // Author tracking
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  publishedAt: Date
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Create slug
pageSchema.pre('save', function(next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

// Indexes
pageSchema.index({ slug: 1 });
pageSchema.index({ status: 1 });
pageSchema.index({ parent: 1 });

// Virtual URL
pageSchema.virtual('url').get(function() {
  return `/${this.slug}`;
});

// Get navigation tree
pageSchema.statics.getNavigation = async function(language = 'en') {
  const pages = await this.find({
    status: 'published',
    showInNav: true,
    language
  }).sort({ order: 1 });

  // Build tree structure
  const tree = [];
  const map = {};

  pages.forEach(page => {
    map[page._id] = { ...page.toObject(), children: [] };
  });

  pages.forEach(page => {
    if (page.parent && map[page.parent]) {
      map[page.parent].children.push(map[page._id]);
    } else {
      tree.push(map[page._id]);
    }
  });

  return tree;
};

module.exports = mongoose.model('Page', pageSchema);
