# DormChef - Smart Grocery & Meal Planning PWA

A modern Progressive Web App designed for students to manage groceries, discover recipes, and plan meals efficiently. Built with React, Firebase, and the Spoonacular API.

## Features

### 🥗 Grocery Management
- Add, edit, and track grocery items with expiry dates
- Categorize items by type (fruits, vegetables, dairy, etc.)
- Real-time inventory tracking with quantity and units
- Expiry date alerts and notifications

### 🍳 Recipe Discovery
- AI-powered recipe suggestions based on available ingredients
- Integration with Spoonacular API for thousands of recipes
- Search functionality for specific recipes
- Match percentage calculation for available ingredients
- External recipe links for detailed cooking instructions

### 📅 Meal Planning
- Interactive weekly calendar view
- Plan meals by date and meal type (breakfast, lunch, dinner, snack)
- Visual meal scheduling with drag-and-drop interface
- Auto-planning feature for weekly meal suggestions

### 🛒 Shopping List
- Create and manage shopping lists
- Mark items as completed
- Priority-based organization
- Sync across devices in real-time

### 📱 PWA Features
- Installable on mobile devices and desktop
- Offline functionality with service worker
- Push notifications for expiry alerts
- Auto-update mechanism for new app versions
- Responsive design optimized for all screen sizes

### 🎨 User Experience
- Clean, minimalistic UI inspired by Notion/Google Keep
- Light/dark mode toggle with system preference detection
- Mobile-first responsive design
- Smooth animations and transitions
- Accessible design patterns

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **shadcn/ui** component library
- **Wouter** for client-side routing
- **TanStack Query** for API state management
- **React Hook Form** with Zod validation

### Backend & Services
- **Firebase Authentication** (Google & Email sign-in)
- **Cloud Firestore** for real-time database
- **Firebase Cloud Messaging** for push notifications
- **Spoonacular API** for recipe data

### PWA Tools
- **Service Worker** for offline functionality
- **Web App Manifest** for installability
- **Workbox** for caching strategies

## Prerequisites

Before you begin, ensure you have:
- Node.js 18+ installed
- A Firebase project set up
- A Spoonacular API key

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd dormchef
npm install
```

### 2. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing "dormchef-66651"
3. Enable Authentication:
   - Go to Authentication → Get Started
   - Enable Email/Password and Google sign-in methods
   - Add your domain to Authorized domains
4. Enable Firestore:
   - Go to Firestore Database → Create database
   - Start in test mode for development
5. Get your Firebase config from Project Settings → General → SDK setup

### 3. Spoonacular API Setup

1. Go to [Spoonacular API](https://spoonacular.com/food-api)
2. Create a free account
3. Get your API key from the dashboard

### 4. Environment Variables

Create a `.env` file in the root directory:

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
VITE_SPOONACULAR_API_KEY=your_spoonacular_api_key
```

### 5. Development

```bash
npm run dev
```

The app will be available at `http://localhost:5000`

## Deployment

### Deploy to Netlify

1. Build the project:
```bash
npm run build
```

2. Deploy to Netlify:
   - Connect your GitHub repository to Netlify
   - Set build command: `npm run build`
   - Set publish directory: `dist`
   - Add environment variables in Netlify dashboard

### Deploy to Vercel

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel --prod
```

3. Add environment variables in Vercel dashboard

### Environment Variables for Production

In your deployment platform, add these environment variables:
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_PROJECT_ID` 
- `VITE_FIREBASE_APP_ID`
- `VITE_SPOONACULAR_API_KEY`

## PWA Features

### Installation
- The app can be installed on mobile devices and desktop
- Look for the "Install" prompt in supported browsers
- On iOS: Safari → Share → Add to Home Screen

### Offline Support
- Basic app functionality works offline
- Data syncs when connection is restored
- Cached pages load instantly

### Push Notifications
- Get notified when groceries are expiring
- Meal planning reminders
- Recipe suggestions based on available ingredients

## Testing

### Manual Testing Checklist

1. **Authentication**
   - [ ] Google sign-in works
   - [ ] Email/password sign-in works
   - [ ] User data persists after refresh

2. **Grocery Management**
   - [ ] Add new grocery items
   - [ ] Edit existing items
   - [ ] Delete items
   - [ ] Expiry date tracking works

3. **Recipe Features**
   - [ ] Recipe suggestions based on ingredients
   - [ ] Search functionality works
   - [ ] External recipe links open correctly

4. **Meal Planning**
   - [ ] Add meals to calendar
   - [ ] Edit planned meals
   - [ ] Weekly view displays correctly

5. **PWA Features**
   - [ ] App installs correctly
   - [ ] Works offline
   - [ ] Service worker registers
   - [ ] Push notifications (if enabled)

## Project Structure

```
├── client/
│   ├── public/
│   │   ├── icons/          # PWA icons
│   │   ├── manifest.json   # PWA manifest
│   │   └── sw.js          # Service worker
│   └── src/
│       ├── components/    # Reusable UI components
│       ├── contexts/      # React contexts
│       ├── hooks/         # Custom hooks
│       ├── lib/          # Utilities and API clients
│       └── pages/        # Page components
├── server/               # Express backend (for development)
├── shared/              # Shared types and schemas
└── README.md

```

## License

MIT License - see LICENSE file for details

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Support

For issues and questions:
1. Check the Firebase setup guide in `FIREBASE_SETUP.md`
2. Verify all environment variables are set correctly
3. Ensure Firebase Authentication and Firestore are enabled
4. Check browser console for detailed error messages
