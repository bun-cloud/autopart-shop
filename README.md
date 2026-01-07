# druzroadstar shop - Auto Parts Store

A modern auto parts e-commerce website with Decap CMS for easy product management.

## Features

- Modern, responsive design
- Product search and filtering
- Product detail modals
- Admin panel for inventory management
- **Decap CMS** for Git-based content management
- Automatic deployment via Netlify

## Getting Started

### Prerequisites

- Git
- GitHub account
- Netlify account

### Installation

1. Clone or download this repository
2. Push to your GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   # Create repo on GitHub, then:
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

3. Connect to Netlify:
   - Go to https://app.netlify.com
   - Click "Add new site" → "Import an existing project"
   - Select your GitHub repository
   - Deploy!

### Managing Products

**Option 1: CMS Editor (Recommended)**
- Visit `https://your-site.netlify.app/admin/`
- Sign in with Netlify Identity (or GitHub)
- Add, edit, or delete products visually
- Changes auto-commit to GitHub and deploy

**Option 2: Direct Git Edit**
- Edit `products/*.json` files directly in GitHub
- Or edit `inventory.json` for bulk changes
- Commit changes to trigger auto-deploy

### File Structure

```
├── index.html          # Main storefront
├── app.js              # Storefront JavaScript
├── styles.css          # Main styles
├── inventory.json      # Products data (for direct editing)
├── netlify.toml        # Netlify configuration
├── admin/
│   ├── index.html      # Old admin panel (still works)
│   ├── admin.html      # Admin panel
│   ├── admin.js        # Admin JavaScript
│   ├── admin.css       # Admin styles
│   ├── config.yml      # Decap CMS configuration
│   └── index.html      # Decap CMS admin page
├── products/           # Individual product files (for CMS)
└── images/             # Product images folder
```

## Categories

- Brake System
- Filters
- Engine Parts
- Electrical
- Lighting
- Suspension

## License

MIT
