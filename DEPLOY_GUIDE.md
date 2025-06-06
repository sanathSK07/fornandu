# Free Deployment Guide for DormChef

## Option 1: Netlify (Recommended)

### Quick Deploy
1. Fork this repository to your GitHub account
2. Go to [netlify.com](https://netlify.com) and sign up with GitHub
3. Click "New site from Git" → Connect to GitHub
4. Select your DormChef repository
5. Build settings are auto-configured from netlify.toml:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Add environment variables in Site Settings → Environment Variables:
   ```
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_PROJECT_ID=dormchef-66651
   VITE_FIREBASE_APP_ID=1:358729674150:web:cb4e3ce02f7b298e1a3367
   VITE_SPOONACULAR_API_KEY=your_spoonacular_key
   ```
7. Deploy!

Your app will be available at: `https://your-app-name.netlify.app`

## Option 2: Vercel

### Quick Deploy
1. Fork this repository to your GitHub account
2. Go to [vercel.com](https://vercel.com) and sign up with GitHub
3. Click "New Project" → Import your DormChef repository
4. Framework preset: Vite (auto-detected)
5. Add environment variables during setup or in Project Settings
6. Deploy!

Your app will be available at: `https://your-app-name.vercel.app`

## Required Environment Variables

### Firebase Configuration
Get these from [Firebase Console](https://console.firebase.google.com/) → Project Settings:
- `VITE_FIREBASE_API_KEY`: Your API key
- `VITE_FIREBASE_PROJECT_ID`: Your project ID (dormchef-66651)
- `VITE_FIREBASE_APP_ID`: Your app ID

### Spoonacular API
Get from [Spoonacular API](https://spoonacular.com/food-api):
- `VITE_SPOONACULAR_API_KEY`: Your API key (free tier: 150 requests/day)

## Post-Deployment Steps

### 1. Update Firebase Authorized Domains
1. Go to Firebase Console → Authentication → Settings
2. Add your new domain to Authorized domains:
   - `your-app-name.netlify.app` or `your-app-name.vercel.app`

### 2. Enable Firebase Services
1. **Authentication**: Enable Google sign-in provider
2. **Firestore**: Create database in test mode
3. **Hosting** (optional): You can also deploy directly to Firebase

### 3. Test Your Deployed App
- Google sign-in works
- Can add grocery items
- Recipe suggestions load
- PWA install prompt appears

## Cost Breakdown (Free Tiers)

### Netlify Free
- 100GB bandwidth/month
- 300 build minutes/month
- Custom domain support
- Perfect for personal use

### Vercel Free
- 100GB bandwidth/month
- Unlimited personal projects
- Custom domain support
- Serverless functions included

### Firebase Free (Spark Plan)
- Authentication: 50,000 MAU
- Firestore: 1GB storage, 50K reads/day
- More than enough for personal use

### Spoonacular Free
- 150 API calls/day
- Perfect for personal recipe suggestions

## Custom Domain (Optional)
Both Netlify and Vercel support custom domains on free plans:
1. Buy domain from any registrar
2. Add domain in deployment platform settings
3. Update DNS records as instructed
4. Add domain to Firebase authorized domains

Your personal DormChef app will be live and fully functional!