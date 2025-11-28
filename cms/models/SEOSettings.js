const mongoose = require('mongoose');

const seoSettingsSchema = new mongoose.Schema({
  // Global defaults
  siteName: {
    type: String,
    default: 'Beekman Strategic'
  },
  siteUrl: {
    type: String,
    default: 'https://beekmanstrategic.com'
  },
  defaultMetaTitle: {
    type: String,
    default: 'Beekman Strategic | Boutique Financial Advisory'
  },
  defaultMetaDescription: {
    type: String,
    maxlength: 160,
    default: 'Beekman Strategic is a boutique financial advisory and investment banking firm serving the global elite with personalized wealth management solutions.'
  },
  titleSeparator: {
    type: String,
    default: ' | '
  },
  titleFormat: {
    type: String,
    enum: ['page-site', 'site-page', 'page-only'],
    default: 'page-site'
  },

  // Social media
  social: {
    ogDefaultImage: String,
    twitterHandle: String,
    facebookAppId: String,
    linkedInCompany: String
  },

  // Verification codes
  verification: {
    googleSiteVerification: String,
    bingSiteVerification: String,
    yandexVerification: String,
    pinterestVerification: String
  },

  // Analytics
  analytics: {
    googleAnalyticsId: String,
    ga4MeasurementId: String,
    googleTagManagerId: String,
    facebookPixelId: String,
    linkedInInsightTag: String
  },

  // Robots & Crawling
  robots: {
    allowIndexing: {
      type: Boolean,
      default: true
    },
    customRules: [{
      userAgent: String,
      allow: [String],
      disallow: [String],
      crawlDelay: Number
    }],
    additionalDirectives: String
  },

  // Sitemap settings
  sitemap: {
    includePages: {
      type: Boolean,
      default: true
    },
    includeBlog: {
      type: Boolean,
      default: true
    },
    changeFrequency: {
      homepage: { type: String, default: 'daily' },
      pages: { type: String, default: 'weekly' },
      blog: { type: String, default: 'weekly' }
    },
    priority: {
      homepage: { type: Number, default: 1.0 },
      pages: { type: Number, default: 0.8 },
      blog: { type: Number, default: 0.7 }
    },
    excludePaths: [String]
  },

  // Schema.org structured data
  structuredData: {
    organization: {
      type: { type: String, default: 'FinancialService' },
      name: String,
      description: String,
      url: String,
      logo: String,
      address: {
        streetAddress: String,
        addressLocality: String,
        addressRegion: String,
        postalCode: String,
        addressCountry: String
      },
      contactPoint: [{
        type: String,
        telephone: String,
        email: String,
        areaServed: String
      }],
      sameAs: [String] // Social media URLs
    },
    localBusiness: mongoose.Schema.Types.Mixed,
    breadcrumbs: {
      enabled: {
        type: Boolean,
        default: true
      }
    }
  },

  // Redirects
  redirects: [{
    source: String,
    destination: String,
    type: {
      type: Number,
      enum: [301, 302],
      default: 301
    },
    isActive: {
      type: Boolean,
      default: true
    }
  }],

  // Custom head/body scripts
  customScripts: {
    headStart: String,
    headEnd: String,
    bodyStart: String,
    bodyEnd: String
  },

  // Performance
  performance: {
    enablePreconnect: {
      type: Boolean,
      default: true
    },
    preconnectUrls: [String],
    enableDnsPrefetch: {
      type: Boolean,
      default: true
    },
    dnsPrefetchUrls: [String]
  },

  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Ensure only one settings document exists
seoSettingsSchema.statics.getSettings = async function() {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

module.exports = mongoose.model('SEOSettings', seoSettingsSchema);
