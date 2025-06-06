import { useState, useEffect } from "react";
import { AlertTriangle, CheckCircle, Settings } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/firebase";

export default function FirebaseStatus() {
  const [firebaseError, setFirebaseError] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkFirebaseConfig = async () => {
      try {
        // Check if environment variables are present
        const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
        const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
        const appId = import.meta.env.VITE_FIREBASE_APP_ID;
        
        if (!apiKey || !projectId || !appId) {
          setFirebaseError('Missing Firebase environment variables.');
          return;
        }
        
        // Try to initialize Firebase auth
        await auth.app.options;
        setFirebaseError(null);
      } catch (error: any) {
        if (error.code === 'auth/configuration-not-found') {
          setFirebaseError('Firebase Authentication is not enabled in your Firebase project.');
        } else if (error.code === 'auth/invalid-api-key') {
          setFirebaseError('Invalid Firebase API key. Please check your configuration.');
        } else if (error.message?.includes('pattern')) {
          setFirebaseError('Google sign-in is not configured in Firebase Console.');
        } else {
          setFirebaseError('Firebase configuration error.');
        }
      } finally {
        setIsChecking(false);
      }
    };

    checkFirebaseConfig();
  }, []);

  if (isChecking) return null;

  if (firebaseError) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <div>
            <strong>Firebase Setup Required:</strong> {firebaseError}
            <br />
            <span className="text-sm">
              Please enable Authentication in your Firebase Console and ensure Firestore is set up.
            </span>
          </div>
          <Button variant="outline" size="sm" asChild>
            <a 
              href="https://console.firebase.google.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="ml-4"
            >
              <Settings className="h-4 w-4 mr-1" />
              Firebase Console
            </a>
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert className="mb-6 border-green-200 bg-green-50 dark:bg-green-900/20">
      <CheckCircle className="h-4 w-4 text-green-600" />
      <AlertDescription className="text-green-800 dark:text-green-200">
        Firebase is properly configured and ready to use.
      </AlertDescription>
    </Alert>
  );
}