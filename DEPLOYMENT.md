# DormChef Deployment Guide

## Pre-deployment Checklist

### 1. Firebase Setup (Required)
- [ ] Firebase Authentication enabled with Google sign-in
- [ ] Firestore database created in test mode
- [ ] Authorized domains configured (add your deployment domain)
- [ ] Environment variables correctly set

### 2. Environment Variables
Ensure these are set in your deployment platform:
```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_SPOONACULAR_API_KEY=your_spoonacular_key
```

### 3. Build Verification
```bash
npm run build
npm run preview
```

## Deployment Options

### Option 1: Netlify (Recommended)
1. Connect GitHub repository to Netlify
2. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. Add environment variables in Netlify dashboard
4. Deploy

### Option 2: Vercel
1. Connect GitHub repository to Vercel
2. Framework preset: Vite
3. Add environment variables in Vercel dashboard
4. Deploy

### Option 3: Replit Deployment
1. Use the deploy button in Replit
2. Environment variables are automatically included
3. Custom domain available with paid plans

## Post-deployment Steps

### 1. Update Firebase Authorized Domains
Add your new domain to Firebase Console:
- Authentication > Settings > Authorized domains
- Add: `your-app-name.netlify.app` or `your-app-name.vercel.app`

### 2. Test Core Features
- [ ] Google sign-in works
- [ ] Grocery items can be added/edited
- [ ] Recipe suggestions load
- [ ] Meal planning calendar functions
- [ ] PWA installation prompt appears

### 3. Performance Optimization
- All images are optimized SVGs
- Service worker caches static assets
- Firebase queries are efficient
- Spoonacular API calls are rate-limited

## Troubleshooting

### Common Issues
1. **Authentication fails**: Check Firebase authorized domains
2. **Recipes don't load**: Verify Spoonacular API key
3. **PWA doesn't install**: Check manifest.json and HTTPS
4. **Data doesn't sync**: Verify Firestore rules

### Debug Commands
```bash
# Check build
npm run build

# Test locally
npm run preview

# Check service worker
Open DevTools > Application > Service Workers
```

## Security Notes
- Firebase rules are set to test mode (development)
- For production, implement proper security rules
- Spoonacular API key is client-side visible (normal for frontend apps)
- All data is user-specific and isolated

Your personal DormChef app is ready for deployment once Firebase authentication is properly configured!