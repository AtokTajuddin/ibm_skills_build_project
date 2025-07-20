// Firebase configuration and initialization
import { initializeApp } from 'firebase/app';
import { 
    getAuth, 
    GoogleAuthProvider, 
    signInWithPopup, 
    signInWithRedirect,
    getRedirectResult,
    onAuthStateChanged,
    signOut as firebaseSignOut
} from 'firebase/auth';

// Firebase config - you'll get these from Firebase Console
const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Configure Google Auth Provider
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('email');
googleProvider.addScope('profile');

// Google Sign In with Popup (One-Click)
export const signInWithGooglePopup = async () => {
    try {
        console.log('🔥 Firebase: Starting Google popup...');
        console.log('🔥 Auth object:', auth);
        console.log('🔥 Google provider:', googleProvider);
        
        const result = await signInWithPopup(auth, googleProvider);
        console.log('🔥 Firebase: Popup successful!', result);
        
        return {
            success: true,
            user: result.user,
            credential: GoogleAuthProvider.credentialFromResult(result)
        };
    } catch (error) {
        console.error('🔥 Firebase: Google sign-in error:', error);
        console.error('🔥 Error code:', error.code);
        console.error('🔥 Error message:', error.message);
        
        // Check for specific Firebase errors
        if (error.code === 'auth/popup-blocked') {
            console.error('🔥 Popup was blocked by browser');
        } else if (error.code === 'auth/popup-closed-by-user') {
            console.error('🔥 User closed the popup');
        } else if (error.code === 'auth/unauthorized-domain') {
            console.error('🔥 Domain not authorized in Firebase Console');
        }
        
        return {
            success: false,
            error: error.message
        };
    }
};

// Google Sign In with Redirect (fallback for mobile)
export const signInWithGoogleRedirect = async () => {
    try {
        await signInWithRedirect(auth, googleProvider);
    } catch (error) {
        console.error('Google redirect sign-in error:', error);
        throw error;
    }
};

// Check for redirect result (call this on app load)
export const getGoogleRedirectResult = async () => {
    try {
        const result = await getRedirectResult(auth);
        if (result) {
            return {
                success: true,
                user: result.user,
                credential: GoogleAuthProvider.credentialFromResult(result)
            };
        }
        return { success: false };
    } catch (error) {
        console.error('Google redirect result error:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

// Auth state listener
export const onAuthStateChange = (callback) => {
    return onAuthStateChanged(auth, callback);
};

// Sign out
export const signOut = async () => {
    try {
        await firebaseSignOut(auth);
        return { success: true };
    } catch (error) {
        console.error('Sign out error:', error);
        return { success: false, error: error.message };
    }
};

export default app;
