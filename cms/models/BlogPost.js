const mongoose = require('mongoose');
const slugify = require('slugify');

const blogPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: 200
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  excerpt: {
    type: String,
    maxlength: 500
  },
  content: {
    type: String,
    required: [true, 'Content is required']
  },
  contentHtml: {
    type: String
  },
  featuredImage: {
    url: String,
    alt: String,
    caption: String
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    enum: ['insights', 'market-analysis', 'wealth-management', 'investment-banking', 'company-news', 'press-release'],
    default: 'insights'
  },
  tags: [{
    type: String,
    trim: true
  }],
  status: {
    type: String,
    enum: ['draft', 'published', 'scheduled', 'archived'],
    default: 'draft'
  },
  publishedAt: {
    type: Date,
    default: null
  },
  scheduledAt: {
    type: Date,
    default: null
  },

  // SEO Fields
  seo: {
    metaTitle: {
      type: String,
      maxlength: 70
    },
    metaDescription: {
      type: String,
      maxlength: 160
    },
    focusKeyword: {
      type: String
    },
    secondaryKeywords: [{
      type: String
    }],
    canonicalUrl: {
      type: String
    },
    ogImage: {
      type: String
    },
    ogTitle: {
      type: String
    },
    ogDescription: {
      type: String
    },
    twitterCard: {
      type: String,
      enum: ['summary', 'summary_large_image'],
      default: 'summary_large_image'
    },
    noIndex: {
      type: Boolean,
      default: false
    },
    noFollow: {
      type: Boolean,
      default: false
    },
    structuredData: {
      type: mongoose.Schema.Types.Mixed
    }
  },

  // Analytics
  views: {
    type: Number,
    default: 0
  },
  readTime: {
    type: Number, // in minutes
    default: 0
  },

  // Localization
  language: {
    type: String,
    enum: ['en', 'es', 'fr', 'pt'],
    default: 'en'
  },
  translations: [{
    language: String,
    postId: mongoose.Schema.Types.ObjectId
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Create slug from title
blogPostSchema.pre('save', function(next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }

  // Calculate read time (average 200 words per minute)
  if (this.content) {
    const wordCount = this.content.split(/\s+/).length;
    this.readTime = Math.ceil(wordCount / 200);
  }

  next();
});

// Auto-set publishedAt when status changes to published
blogPostSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

// Index for full-text search
blogPostSchema.index({ title: 'text', content: 'text', excerpt: 'text', tags: 'text' });

// Index for common queries
blogPostSchema.index({ status: 1, publishedAt: -1 });
blogPostSchema.index({ category: 1, status: 1 });
blogPostSchema.index({ slug: 1 });
blogPostSchema.index({ author: 1 });

// Virtual for URL
blogPostSchema.virtual('url').get(function() {
  return `/blog/${this.slug}`;
});

// Static method to get published posts
blogPostSchema.statics.getPublished = function(options = {}) {
  const { limit = 10, skip = 0, category, language = 'en' } = options;

  const query = {
    status: 'published',
    publishedAt: { $lte: new Date() },
    language
  };

  if (category) query.category = category;

  return this.find(query)
    .populate('author', 'name avatar')
    .sort({ publishedAt: -1 })
    .skip(skip)
    .limit(limit);
};

// Increment view count
blogPostSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save({ validateBeforeSave: false });
};

module.exports = mongoose.model('BlogPost', blogPostSchema);
