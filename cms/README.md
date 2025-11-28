# Beekman Strategic CMS

A custom Content Management System for the Beekman Strategic website featuring blog management, content editing, SEO tools, and analytics.

## Features

- **Blog Management** - Create, edit, publish, and schedule blog posts with Markdown support
- **Page Management** - Manage static pages with customizable content blocks
- **SEO Tools** - Comprehensive SEO settings, site audit, meta tag management
- **Media Library** - Upload and manage images with automatic thumbnail generation
- **Multi-language Support** - Content in English, Spanish, French, and Portuguese
- **Analytics Dashboard** - Track views, content performance, and SEO health
- **Sitemap & Robots.txt** - Auto-generated and customizable
- **Redirects Management** - 301/302 redirect configuration

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT + Session-based
- **Image Processing**: Sharp
- **Markdown**: Marked.js

## Quick Start

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)

### Installation

1. Navigate to the CMS directory:
```bash
cd beekman/cms
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Edit `.env` with your configuration:
```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/beekman-cms
SESSION_SECRET=your-secret-key
JWT_SECRET=your-jwt-secret
ADMIN_EMAIL=admin@beekmanstrategic.com
ADMIN_PASSWORD=your-secure-password
```

5. Start MongoDB (if local):
```bash
mongod
```

6. Seed the database with initial data:
```bash
npm run seed
```

7. Start the CMS server:
```bash
npm run dev
```

8. Access the admin panel at: http://localhost:3001/admin

## Default Login

After running the seed script:
- **Email**: admin@beekmanstrategic.com
- **Password**: BeekmanAdmin123! (change this in .env before running seed)

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### Blog Posts
- `GET /api/blog` - List posts (with pagination, filters)
- `GET /api/blog/:slug` - Get single post
- `POST /api/blog` - Create post (auth required)
- `PUT /api/blog/:id` - Update post (auth required)
- `DELETE /api/blog/:id` - Delete post (auth required)
- `POST /api/blog/:id/duplicate` - Duplicate post (auth required)

### Pages
- `GET /api/pages` - List pages
- `GET /api/pages/:slug` - Get single page
- `POST /api/pages` - Create page (auth required)
- `PUT /api/pages/:id` - Update page (auth required)
- `DELETE /api/pages/:id` - Delete page (auth required)

### SEO
- `GET /api/seo/settings` - Get SEO settings
- `PUT /api/seo/settings` - Update SEO settings (admin only)
- `GET /api/seo/analyze/:type/:id` - Analyze content SEO
- `GET /api/seo/audit` - Run full site SEO audit (admin only)
- `POST /api/seo/redirects` - Add redirect (admin only)
- `DELETE /api/seo/redirects/:index` - Delete redirect (admin only)

### Media
- `GET /api/media` - List media files
- `POST /api/media/upload` - Upload file (auth required)
- `PUT /api/media/:id` - Update media metadata
- `DELETE /api/media/:id` - Delete media file

### Analytics
- `GET /api/analytics/dashboard` - Dashboard stats
- `GET /api/analytics/content` - Content performance
- `GET /api/analytics/seo-health` - SEO health metrics
- `POST /api/analytics/track-view` - Track page view (public)

### SEO Files (Public)
- `GET /sitemap.xml` - Auto-generated sitemap
- `GET /robots.txt` - Configurable robots.txt

## Directory Structure

```
cms/
├── admin/              # Admin panel frontend
│   ├── index.html
│   ├── styles.css
│   └── app.js
├── models/             # Mongoose models
│   ├── User.js
│   ├── BlogPost.js
│   ├── Page.js
│   ├── SEOSettings.js
│   └── Media.js
├── routes/             # Express routes
│   ├── auth.js
│   ├── blog.js
│   ├── pages.js
│   ├── seo.js
│   ├── media.js
│   ├── analytics.js
│   ├── sitemap.js
│   └── robots.js
├── middleware/         # Express middleware
│   └── auth.js
├── scripts/            # Utility scripts
│   └── seed.js
├── uploads/            # Uploaded files
├── server.js           # Main server file
├── package.json
└── .env.example
```

## Frontend Integration

The frontend website integrates with the CMS via the `js/cms.js` file which:

1. Fetches published blog posts for the homepage insights section
2. Loads blog listing with pagination on the blog page
3. Loads SEO settings and applies structured data
4. Tracks page views for analytics

### Configuration

Edit the API URL in `js/cms.js` if your CMS is hosted elsewhere:

```javascript
const CMS = {
  config: {
    apiUrl: 'http://localhost:3001/api',
    // Change to your production URL:
    // apiUrl: 'https://cms.beekmanstrategic.com/api'
  }
}
```

## SEO Features

### Meta Tags
- Custom meta title and description per post/page
- Open Graph tags for social sharing
- Twitter Card support
- Canonical URLs
- noindex/nofollow options

### Structured Data
- Organization schema
- Article schema (auto-generated for blog posts)
- Breadcrumb support

### Technical SEO
- Auto-generated XML sitemap
- Configurable robots.txt
- 301/302 redirect management
- Focus keyword tracking
- SEO audit tool

## Security

- JWT authentication with HTTP-only cookies
- Rate limiting on API endpoints
- Helmet.js security headers
- Input validation with validator.js
- Password hashing with bcrypt

## Production Deployment

1. Set `NODE_ENV=production` in environment
2. Use a secure `SESSION_SECRET` and `JWT_SECRET`
3. Configure MongoDB Atlas or secure MongoDB instance
4. Set up HTTPS with reverse proxy (nginx/Caddy)
5. Configure CORS for your production domains
6. Run with process manager (PM2, systemd)

Example PM2 start:
```bash
pm2 start server.js --name beekman-cms
```

## License

Proprietary - Beekman Strategic
