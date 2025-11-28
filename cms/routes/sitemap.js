const express = require('express');
const router = express.Router();
const { SitemapStream, streamToPromise } = require('sitemap');
const { Readable } = require('stream');
const BlogPost = require('../models/BlogPost');
const Page = require('../models/Page');
const SEOSettings = require('../models/SEOSettings');

// Cache sitemap for 1 hour
let sitemapCache = null;
let lastGenerated = null;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

router.get('/', async (req, res) => {
  try {
    // Check cache
    if (sitemapCache && lastGenerated && (Date.now() - lastGenerated < CACHE_DURATION)) {
      res.header('Content-Type', 'application/xml');
      res.header('Cache-Control', 'public, max-age=3600');
      return res.send(sitemapCache);
    }

    const settings = await SEOSettings.getSettings();
    const siteUrl = settings.siteUrl || 'https://beekmanstrategic.com';

    const links = [];

    // Homepage
    if (settings.sitemap?.includePages !== false) {
      links.push({
        url: '/',
        changefreq: settings.sitemap?.changeFrequency?.homepage || 'daily',
        priority: settings.sitemap?.priority?.homepage || 1.0,
        lastmod: new Date().toISOString()
      });
    }

    // Get published pages
    if (settings.sitemap?.includePages !== false) {
      const pages = await Page.find({
        status: 'published',
        'seo.noIndex': { $ne: true }
      }).select('slug updatedAt');

      pages.forEach(page => {
        if (!settings.sitemap?.excludePaths?.includes(`/${page.slug}`)) {
          links.push({
            url: `/${page.slug}`,
            changefreq: settings.sitemap?.changeFrequency?.pages || 'weekly',
            priority: settings.sitemap?.priority?.pages || 0.8,
            lastmod: page.updatedAt.toISOString()
          });
        }
      });
    }

    // Get published blog posts
    if (settings.sitemap?.includeBlog !== false) {
      // Blog index page
      links.push({
        url: '/blog',
        changefreq: 'daily',
        priority: 0.9,
        lastmod: new Date().toISOString()
      });

      const posts = await BlogPost.find({
        status: 'published',
        publishedAt: { $lte: new Date() },
        'seo.noIndex': { $ne: true }
      }).select('slug updatedAt publishedAt');

      posts.forEach(post => {
        links.push({
          url: `/blog/${post.slug}`,
          changefreq: settings.sitemap?.changeFrequency?.blog || 'weekly',
          priority: settings.sitemap?.priority?.blog || 0.7,
          lastmod: (post.updatedAt || post.publishedAt).toISOString()
        });
      });
    }

    // Create sitemap stream
    const stream = new SitemapStream({ hostname: siteUrl });
    const xmlString = await streamToPromise(Readable.from(links).pipe(stream)).then(data => data.toString());

    // Cache the result
    sitemapCache = xmlString;
    lastGenerated = Date.now();

    res.header('Content-Type', 'application/xml');
    res.header('Cache-Control', 'public, max-age=3600');
    res.send(xmlString);
  } catch (error) {
    console.error('Sitemap generation error:', error);
    res.status(500).send('Error generating sitemap');
  }
});

// Force regenerate sitemap (admin)
router.post('/regenerate', async (req, res) => {
  sitemapCache = null;
  lastGenerated = null;
  res.json({ success: true, message: 'Sitemap cache cleared' });
});

module.exports = router;
