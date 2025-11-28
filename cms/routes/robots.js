const SEOSettings = require('../models/SEOSettings');

module.exports = async (req, res) => {
  try {
    const settings = await SEOSettings.getSettings();
    const siteUrl = settings.siteUrl || 'https://beekmanstrategic.com';

    let robotsTxt = '';

    if (!settings.robots?.allowIndexing) {
      // Block all indexing
      robotsTxt = `User-agent: *\nDisallow: /\n`;
    } else {
      // Default rules
      robotsTxt = `User-agent: *\nAllow: /\n`;

      // Common disallows
      robotsTxt += `Disallow: /admin/\n`;
      robotsTxt += `Disallow: /api/\n`;
      robotsTxt += `Disallow: /uploads/\n`;

      // Custom rules
      if (settings.robots?.customRules?.length > 0) {
        settings.robots.customRules.forEach(rule => {
          robotsTxt += `\nUser-agent: ${rule.userAgent || '*'}\n`;

          if (rule.allow?.length > 0) {
            rule.allow.forEach(path => {
              robotsTxt += `Allow: ${path}\n`;
            });
          }

          if (rule.disallow?.length > 0) {
            rule.disallow.forEach(path => {
              robotsTxt += `Disallow: ${path}\n`;
            });
          }

          if (rule.crawlDelay) {
            robotsTxt += `Crawl-delay: ${rule.crawlDelay}\n`;
          }
        });
      }

      // Additional directives
      if (settings.robots?.additionalDirectives) {
        robotsTxt += `\n${settings.robots.additionalDirectives}\n`;
      }
    }

    // Add sitemap
    robotsTxt += `\nSitemap: ${siteUrl}/sitemap.xml\n`;

    res.header('Content-Type', 'text/plain');
    res.header('Cache-Control', 'public, max-age=86400');
    res.send(robotsTxt);
  } catch (error) {
    console.error('Robots.txt generation error:', error);
    // Return a safe default
    res.header('Content-Type', 'text/plain');
    res.send(`User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /api/\n`);
  }
};
