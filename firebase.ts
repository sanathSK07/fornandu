import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getMessaging, isSupported } from "firebase/messaging";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebasestorage.app`,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Enable offline persistence for better performance
import { enableNetwork, disableNetwork } from "firebase/firestore";

// Configure Firestore settings for better performance
export const configureFirestore = async () => {
  try {
    // This helps with faster writes and offline support
    await enableNetwork(db);
  } catch (error) {
    console.log("Firestore offline persistence already enabled");
  }
};

// Initialize Firebase Cloud Messaging and get a reference to the service
export const messaging = async () => {
  if (await isSupported()) {
    return getMessaging(app);
  }
  return null;
};

export default app;
