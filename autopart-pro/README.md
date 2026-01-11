# druzroadstar shop - Auto Parts Store

A modern auto parts e-commerce website with custom admin panel for easy product management, powered by Supabase for backend storage.

## Features

- Modern, responsive design
- Product search and filtering
- Product detail modals
- Admin panel for inventory management
- Supabase backend integration
- Automatic deployment via Netlify

## Getting Started

### Prerequisites

- Git
- GitHub account
- Netlify account
- Supabase account (free tier works great)

### Supabase Setup

1. Create a new Supabase project at https://supabase.com
2. Go to Settings > API to get your project URL and anon key
3. Create a table called `products` with these columns:
   - `id` (uuid, primary key, default: uuid_generate_v4())
   - `name` (text)
   - `category` (text)
   - `brand` (text)
   - `price` (numeric)
   - `description` (text)
   - `image` (text, optional)
   - `sold` (boolean, default: false)
   - `created_at` (timestamp, default: now())

### Local Development

1. Clone or download this repository
2. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
3. Edit `.env` with your Supabase credentials:
   ```
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your-anon-key-here
   ```
4. For local testing, the site will use the fallback credentials in supabase-config.js
5. Open `index.html` directly in your browser or use a local server:
   ```bash
   npx serve .
   ```

### Deploy to Netlify

#### Option 1: Connect GitHub Repository (Recommended)

1. Push your code to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   # Create repo on GitHub, then:
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

2. Connect to Netlify:
   - Go to https://app.netlify.com
   - Click "Add new site" → "Import an existing project"
   - Select your GitHub repository
   - Netlify will auto-detect settings from `netlify.toml`

3. **IMPORTANT**: Set Environment Variables in Netlify:
   - Go to Site Settings > Build & Deploy > Environment variables
   - Add the following variables:
     - `SUPABASE_URL`: Your Supabase project URL
     - `SUPABASE_ANON_KEY`: Your Supabase anon key
   - Click "Save"
   - Trigger a new deploy (Site Deploys > Trigger deploy)

4. Configure Supabase Authentication:
   - Go to Supabase Dashboard > Authentication > URL Configuration
   - Add your Netlify URL to "Site URL" (e.g., `https://your-site.netlify.app`)
   - Add your Netlify URL to "Redirect URLs" (e.g., `https://your-site.netlify.app/admin.html`)

#### Option 2: Manual Deploy (Drag & Drop)

1. Create a ZIP file of the entire `autopart-pro` folder
2. Go to https://app.netlify.com
3. Drag and drop the ZIP file to the deploy area
4. Set environment variables in Site Settings as described above
5. Configure Supabase authentication URLs

### Managing Products

**Admin Panel**
- Visit `/admin.html` on your site
- Enter the admin credentials configured in Supabase Auth
- Add, edit, or delete products visually
- Products sync automatically with Supabase

**Direct Database Edit**
- Edit products directly in Supabase Dashboard > Table Editor
- Changes reflect immediately on the storefront

### File Structure

```
autopart-pro/
├── index.html          # Main storefront
├── app.js              # Storefront JavaScript
├── styles.css          # Main styles
├── admin.html          # Admin panel
├── admin.js            # Admin JavaScript
├── admin.css           # Admin styles
├── supabase-config.js  # Supabase configuration
├── env-config.js       # Environment configuration
├── netlify.toml        # Netlify deployment config
├── _headers            # Netlify headers for caching
├── .env.example        # Environment template
├── .gitignore          # Git ignore rules
├── products/           # Individual product files (legacy)
├── images/             # Product images folder
└── logo.png            # Store logo
```

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `SUPABASE_URL` | Your Supabase project URL | Yes |
| `SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |

### Categories

- Brake System
- Filters
- Engine Parts
- Electrical
- Lighting
- Suspension

## Troubleshooting

**Products not loading:**
- Check browser console for errors
- Verify Supabase URL and key are correct in Netlify settings
- Ensure RLS policies allow read access

**Admin login failing:**
- Verify Supabase authentication URL configuration
- Check that email/password auth is enabled in Supabase
- Ensure user exists in Supabase Auth users

**Images not showing:**
- Check that images folder exists and contains files
- Verify image paths in product data

## License

MIT
