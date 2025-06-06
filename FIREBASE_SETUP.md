# Firebase Setup Guide - Fix Sign-in Error

The "string did not match the expected pattern" error means Firebase Authentication needs to be properly configured.

## Required Steps:

### 1. Enable Firebase Authentication
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **dormchef-66651**
3. Click **Authentication** in the left sidebar
4. Click **Get Started** if you see it
5. Go to **Sign-in method** tab
6. Find **Google** and click on it
7. Toggle **Enable** to ON
8. Add your support email (required for Google sign-in)
9. Click **Save**

### 2. Add Authorized Domains
1. In Authentication, go to **Settings** tab
2. Scroll to **Authorized domains**
3. Add these domains:
   - `localhost` (for development)
   - Your Replit domain when you get it

### 3. Create Firestore Database
1. Click **Firestore Database** in left sidebar
2. Click **Create database**
3. Choose **Start in test mode**
4. Select your preferred location
5. Click **Done**

### 4. Verify Configuration
Your current config should work once Authentication is enabled:
```
Project ID: dormchef-66651
API Key: (already set)
App ID: (already set)
```

## After Setup
Once you complete these steps, try the Google sign-in button again. The error should be resolved.