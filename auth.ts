import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  User
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebase";
import type { InsertUser } from "@shared/schema";

const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Check if user exists in Firestore, if not create them
    await createOrUpdateUser(user);
    
    return user;
  } catch (error: any) {
    console.error("Error signing in with Google:", error);
    
    // Provide clearer error messages
    if (error.code === 'auth/configuration-not-found') {
      throw new Error('Firebase Authentication not enabled. Please enable Google sign-in in Firebase Console.');
    } else if (error.code === 'auth/popup-blocked') {
      throw new Error('Popup blocked. Please allow popups and try again.');
    } else if (error.message?.includes('pattern')) {
      throw new Error('Google sign-in not configured. Please enable it in Firebase Console.');
    }
    
    throw error;
  }
};

export const signInWithEmail = async (email: string, password: string) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error) {
    console.error("Error signing in with email:", error);
    throw error;
  }
};

export const signUpWithEmail = async (email: string, password: string, displayName?: string) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const user = result.user;
    
    // Create user document in Firestore
    await createOrUpdateUser(user, displayName);
    
    return user;
  } catch (error) {
    console.error("Error signing up with email:", error);
    throw error;
  }
};

export const logOut = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};

const createOrUpdateUser = async (user: User, customDisplayName?: string) => {
  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);
  
  if (!userSnap.exists()) {
    const userData: InsertUser = {
      firebaseUid: user.uid,
      email: user.email!,
      displayName: customDisplayName || user.displayName || "",
      photoURL: user.photoURL || "",
    };
    
    await setDoc(userRef, {
      ...userData,
      createdAt: new Date(),
    });
  }
};
