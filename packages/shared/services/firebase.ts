import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  Auth,
} from 'firebase/auth';

// Firebase configuration interface
interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

// Singleton Firebase app instance
let firebaseApp: FirebaseApp | null = null;
let auth: Auth | null = null;

/**
 * Initialize Firebase with configuration from environment variables
 */
export const initializeFirebase = (): FirebaseApp => {
  // Check if Firebase is already initialized
  if (getApps().length > 0 && firebaseApp) {
    return firebaseApp;
  }

  // Get configuration from environment variables
  const firebaseConfig: FirebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
  };

  // Validate configuration
  if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    throw new Error(
      'Firebase configuration is missing. Please check your environment variables.'
    );
  }

  // Initialize Firebase
  firebaseApp = initializeApp(firebaseConfig);
  auth = getAuth(firebaseApp);

  console.log('Firebase initialized successfully');
  return firebaseApp;
};

/**
 * Get Firebase Auth instance
 */
export const getFirebaseAuth = (): Auth => {
  if (!auth) {
    initializeFirebase();
  }
  if (!auth) {
    throw new Error('Firebase Auth is not initialized');
  }
  return auth;
};

/**
 * Sign in with email and password
 */
export const firebaseSignIn = async (
  email: string,
  password: string
): Promise<{ user: User; token: string }> => {
  const auth = getFirebaseAuth();
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const token = await userCredential.user.getIdToken();

  return {
    user: userCredential.user,
    token,
  };
};

/**
 * Create new user with email and password
 */
export const firebaseSignUp = async (
  email: string,
  password: string
): Promise<{ user: User; token: string }> => {
  const auth = getFirebaseAuth();
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const token = await userCredential.user.getIdToken();

  return {
    user: userCredential.user,
    token,
  };
};

/**
 * Sign out current user
 */
export const firebaseSignOut = async (): Promise<void> => {
  const auth = getFirebaseAuth();
  await signOut(auth);
};

/**
 * Get current user's ID token
 */
export const getCurrentUserToken = async (): Promise<string | null> => {
  const auth = getFirebaseAuth();
  const user = auth.currentUser;

  if (!user) {
    return null;
  }

  try {
    // Force refresh if token is about to expire (within 5 minutes)
    const token = await user.getIdToken(false);
    return token;
  } catch (error) {
    console.error('Error getting user token:', error);
    return null;
  }
};

/**
 * Get current user
 */
export const getCurrentUser = (): User | null => {
  const auth = getFirebaseAuth();
  return auth.currentUser;
};

/**
 * Listen to auth state changes
 */
export const onAuthStateChange = (
  callback: (user: User | null) => void
): (() => void) => {
  const auth = getFirebaseAuth();
  return onAuthStateChanged(auth, callback);
};

/**
 * Refresh current user's token
 */
export const refreshUserToken = async (): Promise<string | null> => {
  const auth = getFirebaseAuth();
  const user = auth.currentUser;

  if (!user) {
    return null;
  }

  try {
    // Force refresh the token
    const token = await user.getIdToken(true);
    return token;
  } catch (error) {
    console.error('Error refreshing user token:', error);
    return null;
  }
};

// Initialize Firebase on module load (client-side only)
if (typeof window !== 'undefined') {
  try {
    initializeFirebase();
  } catch (error) {
    console.error('Failed to initialize Firebase:', error);
  }
}

export default {
  initializeFirebase,
  getFirebaseAuth,
  firebaseSignIn,
  firebaseSignUp,
  firebaseSignOut,
  getCurrentUserToken,
  getCurrentUser,
  onAuthStateChange,
  refreshUserToken,
};
