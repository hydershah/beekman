require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const SEOSettings = require('../models/SEOSettings');
const BlogPost = require('../models/BlogPost');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/beekman-cms';

async function seed() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Create admin user
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@beekmanstrategic.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'BeekmanAdmin123!';

    let admin = await User.findOne({ email: adminEmail });

    if (!admin) {
      admin = await User.create({
        email: adminEmail,
        password: adminPassword,
        name: 'Admin',
        role: 'admin'
      });
      console.log(`Admin user created: ${adminEmail}`);
      console.log(`Password: ${adminPassword}`);
    } else {
      console.log('Admin user already exists');
    }

    // Create default SEO settings
    let seoSettings = await SEOSettings.findOne();

    if (!seoSettings) {
      seoSettings = await SEOSettings.create({
        siteName: 'Beekman Strategic',
        siteUrl: 'https://beekmanstrategic.com',
        defaultMetaTitle: 'Beekman Strategic | Boutique Financial Advisory & Investment Banking',
        defaultMetaDescription: 'Boutique financial advisory and investment banking for the global elite. Personalized wealth management solutions.',
        titleSeparator: ' | ',
        social: {
          twitterHandle: '@beekmanstrategic'
        },
        structuredData: {
          organization: {
            type: 'FinancialService',
            name: 'Beekman Strategic',
            description: 'Boutique financial advisory and investment banking firm',
            url: 'https://beekmanstrategic.com'
          }
        },
        robots: {
          allowIndexing: true
        },
        sitemap: {
          includePages: true,
          includeBlog: true
        }
      });
      console.log('Default SEO settings created');
    } else {
      console.log('SEO settings already exist');
    }

    // Create sample blog posts
    const postCount = await BlogPost.countDocuments();

    if (postCount === 0) {
      const samplePosts = [
        {
          title: 'Navigating Market Volatility: A Strategic Approach',
          slug: 'navigating-market-volatility',
          excerpt: 'In times of market uncertainty, a disciplined investment approach becomes paramount. Learn how our strategic framework helps clients weather volatility.',
          content: `# Navigating Market Volatility: A Strategic Approach

Market volatility is an inevitable part of investing. While it can create anxiety for investors, it also presents opportunities for those with a disciplined approach and long-term perspective.

## Understanding Volatility

Volatility refers to the degree of variation in trading prices over time. High volatility means large price swings, while low volatility indicates more stable prices.

### Key Factors Driving Current Volatility

- Global economic uncertainty
- Interest rate fluctuations
- Geopolitical tensions
- Technological disruption

## Our Strategic Framework

At Beekman Strategic, we employ a multi-faceted approach to help our clients navigate uncertain markets:

1. **Diversification** - Spreading investments across asset classes
2. **Risk Assessment** - Regular portfolio stress testing
3. **Tactical Adjustments** - Opportunistic rebalancing
4. **Long-term Focus** - Maintaining strategic asset allocation

## Conclusion

While market volatility can be unsettling, it's important to remember that it's a normal part of the investment cycle. With proper planning and expert guidance, investors can not only weather volatile periods but potentially benefit from them.

*Contact our team to discuss how we can help protect and grow your wealth during uncertain times.*`,
          category: 'market-analysis',
          tags: ['investing', 'market volatility', 'wealth management', 'strategy'],
          status: 'published',
          publishedAt: new Date(),
          author: admin._id,
          seo: {
            metaTitle: 'Navigating Market Volatility | Beekman Strategic',
            metaDescription: 'Learn our strategic approach to navigating market volatility and protecting your wealth during uncertain times.',
            focusKeyword: 'market volatility'
          }
        },
        {
          title: 'The Future of Sustainable Investing',
          slug: 'future-sustainable-investing',
          excerpt: 'ESG investing has evolved from a niche strategy to a mainstream approach. Discover how sustainable investing is reshaping the financial landscape.',
          content: `# The Future of Sustainable Investing

Environmental, Social, and Governance (ESG) investing has transformed from a niche strategy into a fundamental consideration for modern portfolios.

## The Rise of ESG

The past decade has seen remarkable growth in sustainable investing:

- Global ESG assets exceeded $35 trillion in 2024
- Institutional investors increasingly mandate ESG integration
- Regulatory frameworks are evolving to support sustainable finance

## Why ESG Matters

### Performance

Contrary to early skepticism, ESG-focused investments have demonstrated competitive returns. Companies with strong ESG practices often exhibit:

- Better risk management
- Stronger governance
- Long-term value creation

### Impact

Beyond returns, ESG investing allows investors to align their portfolios with their values while contributing to positive change.

## Our Approach

Beekman Strategic integrates ESG considerations throughout our investment process, helping clients build portfolios that deliver both financial returns and positive impact.

*Schedule a consultation to learn how we can help you invest sustainably.*`,
          category: 'insights',
          tags: ['ESG', 'sustainable investing', 'impact investing', 'wealth management'],
          status: 'published',
          publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          author: admin._id,
          seo: {
            metaTitle: 'The Future of Sustainable Investing | Beekman Strategic',
            metaDescription: 'Explore how ESG and sustainable investing is reshaping the financial landscape and how to align your portfolio with your values.',
            focusKeyword: 'sustainable investing'
          }
        },
        {
          title: 'Wealth Transfer Strategies for High Net Worth Families',
          slug: 'wealth-transfer-strategies',
          excerpt: 'Effective wealth transfer requires careful planning. Learn about strategies that can help preserve and transfer wealth across generations.',
          content: `# Wealth Transfer Strategies for High Net Worth Families

For high net worth families, preserving and transferring wealth across generations requires sophisticated planning and execution.

## The Challenge

The "shirtsleeves to shirtsleeves" phenomenon—where family wealth dissipates within three generations—remains a significant concern. Effective wealth transfer planning addresses:

- Tax efficiency
- Family governance
- Values transmission
- Asset protection

## Key Strategies

### 1. Trust Structures

Various trust vehicles offer different benefits:

- **Grantor Retained Annuity Trusts (GRATs)** - Transfer appreciation tax-free
- **Dynasty Trusts** - Multi-generational wealth preservation
- **Charitable Trusts** - Philanthropic impact with tax benefits

### 2. Family Governance

Successful wealth transfer extends beyond legal structures to include:

- Family mission statements
- Regular family meetings
- Financial education for heirs
- Clear communication of values

### 3. Insurance Solutions

Life insurance can provide:

- Liquidity for estate taxes
- Equalization among heirs
- Wealth replacement for charitable giving

## Our Expertise

Beekman Strategic works closely with families and their advisors to develop comprehensive wealth transfer plans tailored to their unique circumstances and goals.

*Contact us to begin planning your family's financial legacy.*`,
          category: 'wealth-management',
          tags: ['wealth transfer', 'estate planning', 'trusts', 'high net worth'],
          status: 'published',
          publishedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
          author: admin._id,
          seo: {
            metaTitle: 'Wealth Transfer Strategies | Beekman Strategic',
            metaDescription: 'Learn about sophisticated wealth transfer strategies including trusts, family governance, and insurance solutions for preserving multi-generational wealth.',
            focusKeyword: 'wealth transfer'
          }
        }
      ];

      for (const post of samplePosts) {
        await BlogPost.create(post);
      }
      console.log(`Created ${samplePosts.length} sample blog posts`);
    } else {
      console.log(`${postCount} blog posts already exist`);
    }

    console.log('\n=================================');
    console.log('Seed completed successfully!');
    console.log('=================================');
    console.log(`\nAdmin Login:`);
    console.log(`Email: ${adminEmail}`);
    console.log(`Password: ${process.env.ADMIN_PASSWORD || 'BeekmanAdmin123!'}`);
    console.log(`\nAccess the CMS at: http://localhost:3001/admin`);
    console.log('=================================\n');

  } catch (error) {
    console.error('Seed error:', error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

seed();
