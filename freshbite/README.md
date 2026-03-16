# 🌿 FreshBite — Healthy Recipes & Juice Lab

A complete, production-ready healthy food website with AI features, built for Netlify deployment.

---

## ✨ What's Included

| Feature | Details |
|---|---|
| 🏠 Homepage | Hero, AI recipe generator, nutrition calculator, blog, ads |
| 📖 Recipe Directory | 18 recipes, filter by diet/time/category, pagination |
| 🍳 Recipe Detail | Ingredients checklist, step-by-step, timer, nutrition facts, PDF gate, comments |
| 🥤 Juice Lab | Interactive builder, 35 ingredients, real-time nutrition |
| 📝 Blog | Listing + full post detail with progress bar, ToC |
| 🔐 Auth | Login + Signup (localStorage demo, easily replaced) |
| ⚙️ Admin | Dashboard with stats, recipe table, activity feed |
| 🤖 AI Features | Recipe Generator + Nutrition Chatbot (Netlify Functions) |
| 💰 Monetization | Google AdSense placeholders + affiliate product strip |
| 🔍 SEO | Schema.org, sitemap.xml, robots.txt, Open Graph, Twitter Cards |

---

## 🚀 Deploy to Netlify (Step by Step)

### Step 1: Create a GitHub repository

1. Go to [github.com](https://github.com) and sign up (free)
2. Click **"New repository"**
3. Name it `freshbite` (or anything you like)
4. Set to **Public**
5. Click **"Create repository"**

### Step 2: Upload the files

**Option A: GitHub Desktop (Easiest for beginners)**
1. Download [GitHub Desktop](https://desktop.github.com/)
2. Clone your new repository
3. Copy all the files from this project into the cloned folder
4. Commit and push

**Option B: Git command line**
```bash
git init
git add .
git commit -m "Initial FreshBite deploy"
git remote add origin https://github.com/YOUR_USERNAME/freshbite.git
git push -u origin main
```

### Step 3: Connect to Netlify

1. Go to [netlify.com](https://netlify.com) and sign up (free)
2. Click **"Add new site"** → **"Import an existing project"**
3. Choose **GitHub** and authorize Netlify
4. Select your `freshbite` repository
5. Settings:
   - **Branch**: `main`
   - **Base directory**: (leave empty)
   - **Build command**: `echo 'No build step'`
   - **Publish directory**: `public`
6. Click **"Deploy site"**

Your site will be live at `https://random-name.netlify.app` within 1-2 minutes! 🎉

### Step 4: Add your API key (for AI features)

1. In Netlify dashboard → **Site Settings** → **Environment Variables**
2. Click **"Add variable"**
3. Key: `ANTHROPIC_API_KEY`
4. Value: Your Anthropic API key from [console.anthropic.com](https://console.anthropic.com)
5. Click **"Save"**
6. Go to **Deploys** tab → click **"Trigger deploy"** → **"Deploy site"**

Get your Anthropic API key:
1. Sign up at [anthropic.com](https://anthropic.com)
2. Go to [console.anthropic.com/settings/keys](https://console.anthropic.com/settings/keys)
3. Click "Create Key" and copy it

### Step 5: Set your custom domain (optional)

1. Netlify dashboard → **Domain Settings** → **Add domain**
2. Enter your domain (e.g., `freshbite.com`)
3. Follow Netlify's DNS instructions
4. SSL certificate is automatic and free via Let's Encrypt ✅

---

## 💰 Setting Up Monetization

### Google AdSense

1. Apply at [google.com/adsense](https://google.com/adsense)
2. Once approved, go to **Ads** → **By ad unit** → **Display ads**
3. Copy your ad code
4. Replace the placeholder comments in the HTML files:
   ```html
   <!-- Google AdSense code goes here -->
   ```
   Replace with your actual AdSense code block

**Ad placements already configured:**
- `public/index.html` — Leaderboard (728×90) + 2× Rectangle (300×250)
- `public/recipes/index.html` — Wide Skyscraper (160×600)
- `public/recipes/detail.html` — Rectangle (300×250)

### Amazon Affiliate Links

1. Sign up at [affiliate-program.amazon.com](https://affiliate-program.amazon.com)
2. Find the kitchen products in `public/index.html` (affiliate products section)
3. Replace the `onclick="alert()"` buttons with your actual affiliate links

---

## 🎨 Customizing the Site

### Change the site name
Search and replace `FreshBite` in all HTML files with your brand name.

### Update the domain
Replace all instances of `freshbite.netlify.app` in:
- `public/sitemap.xml`
- `public/robots.txt`
- Schema.org markup in each page's `<script type="application/ld+json">`

### Customize colors
All colors are CSS variables in the `:root {}` block at the top of each page's `<style>` tag:
```css
:root {
  --forest: #1c3a2a;  /* Dark green - primary brand */
  --leaf: #2d6a4f;    /* Medium green */
  --lime: #74c69d;    /* Accent green */
  --cream: #f8f4ef;   /* Background */
}
```

### Add more recipes
In `public/recipes/index.html`, add to the `RECIPES` array:
```javascript
{
  id: 19,
  title: "My New Recipe",
  cat: "lunch",      // breakfast/lunch/dinner/desserts/healthy/quick/vegan
  emoji: "🥗",
  time: 20,          // minutes
  difficulty: "easy", // easy/medium/hard
  cal: 350,
  rating: 4.8,
  reviews: 100,
  desc: "A short description of the recipe.",
  tags: ["vegan", "gluten-free"]  // Optional tags
}
```

---

## 📁 Project Structure

```
freshbite/
├── public/                    ← Everything in here goes live
│   ├── index.html             ← Homepage
│   ├── sitemap.xml            ← SEO sitemap
│   ├── robots.txt             ← SEO robots
│   ├── recipes/
│   │   ├── index.html         ← Recipe directory
│   │   └── detail.html        ← Recipe detail page
│   ├── juice-builder/
│   │   └── index.html         ← Interactive juice builder
│   ├── blog/
│   │   ├── index.html         ← Blog listing
│   │   └── post.html          ← Blog post detail
│   ├── auth/
│   │   ├── login.html         ← Login page
│   │   └── signup.html        ← Signup page
│   └── admin/
│       └── index.html         ← Admin dashboard
├── functions/                 ← Netlify serverless functions
│   ├── ai-recipe.js           ← AI recipe generator
│   └── ai-chat.js             ← AI nutrition chatbot
├── netlify.toml               ← Netlify configuration
└── README.md                  ← This file
```

---

## 🔐 Authentication Notes

The current auth system uses **localStorage** for demo purposes. This is fine for prototyping but for production you should integrate a real auth provider:

**Easy options:**
- [Netlify Identity](https://docs.netlify.com/visitor-access/identity/) — Built into Netlify, free tier available
- [Supabase](https://supabase.com) — Free tier, Postgres + auth
- [Firebase Auth](https://firebase.google.com) — Google's auth solution, free tier

To replace the demo auth, search for `localStorage.getItem('fb_user')` in all files and replace with your chosen auth provider's session check.

---

## 📊 Analytics Setup

Replace the Google Analytics placeholder in `public/index.html`:

```html
<!-- Add before </head> -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');  // Your GA4 measurement ID
</script>
```

Get your GA4 ID from [analytics.google.com](https://analytics.google.com).

---

## 💬 Support

Built by Claude (Anthropic). For questions about customization or deployment, all major sections have clear HTML comments explaining what each part does.

Happy cooking! 🌿
