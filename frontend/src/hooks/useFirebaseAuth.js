import { useState } from 'react';
import { 
    signInWithGooglePopup, 
    getGoogleRedirectResult,
    signOut as firebaseSignOut
} from '../services/firebase';
import { useAuth } from '../context/AuthContext';

export const useFirebaseAuth = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { login } = useAuth();

    // Handle Firebase user authentication with backend
    const authenticateWithBackend = async (firebaseUser) => {
        try {
            setLoading(true);
            
            console.log(' Sending user data to backend (no token verification)...');

            console.log(' Sending to backend:', {
                email: firebaseUser.email,
                uid: firebaseUser.uid,
                displayName: firebaseUser.displayName
            });
            
            // Send to backend for user creation/update and JWT creation
            const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/firebase-login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    displayName: firebaseUser.displayName,
                    email: firebaseUser.email,
                    photoURL: firebaseUser.photoURL,
                    uid: firebaseUser.uid
                }),
            });

            console.log(' Backend response status:', response.status);
            const responseText = await response.text();
            console.log(' Backend response text:', responseText);

            if (response.ok) {
                const data = JSON.parse(responseText);
                console.log(' Backend success:', data);

                // Store JWT token and login user
                localStorage.setItem('token', data.token);
                login(data.user, data.token);
                
                return { success: true, user: data.user };
            } else {
                let errorData;
                try {
                    errorData = JSON.parse(responseText);
                } catch (e) {
                    errorData = { message: responseText };
                }
                console.error(' Backend error:', errorData);
                throw new Error(errorData.message || 'Authentication failed');
            }
        } catch (error) {
            console.error(' Backend authentication error:', error);
            setError(error.message);
            return { success: false, error: error.message };
        } finally {
            setLoading(false);
        }
    };

    // Google Sign-In with Popup
    const signInWithGoogle = async () => {
        try {
            setLoading(true);
            setError(null);
            
            console.log(' Starting Google sign-in...');
            console.log(' Firebase config check:', {
                apiKey: process.env.REACT_APP_FIREBASE_API_KEY?.substring(0, 10) + '...',
                projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
                authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN
            });
            
            const result = await signInWithGooglePopup();
            console.log(' Google popup result:', result);
            
            if (result.success) {
                console.log(' Google sign-in successful, calling backend...');
                const backendResult = await authenticateWithBackend(result.user);
                console.log(' Backend authentication result:', backendResult);
                return backendResult;
            } else {
                console.error(' Google sign-in failed:', result.error);
                throw new Error(result.error || 'Google sign-in failed');
            }
        } catch (error) {
            console.error(' Google sign-in error:', error);
            setError(error.message);
            return { success: false, error: error.message };
        } finally {
            setLoading(false);
        }
    };

    // Google Sign-In with Redirect (fallback)
    const signInWithGoogleRedirect = async () => {
        try {
            setLoading(true);
            setError(null);
            await signInWithGoogleRedirect();
        } catch (error) {
            console.error('Google redirect sign-in error:', error);
            setError(error.message);
        }
    };

    // Check for redirect result on app load
    const checkRedirectResult = async () => {
        try {
            const result = await getGoogleRedirectResult();
            if (result.success && result.user) {
                return await authenticateWithBackend(result.user);
            }
        } catch (error) {
            console.error('Redirect result error:', error);
            setError(error.message);
        }
    };

    // Sign out
    const signOut = async () => {
        try {
            setLoading(true);
            await firebaseSignOut();
            localStorage.removeItem('token');
            return { success: true };
        } catch (error) {
            console.error('Sign out error:', error);
            setError(error.message);
            return { success: false, error: error.message };
        } finally {
            setLoading(false);
        }
    };

    return {
        signInWithGoogle,
        signInWithGoogleRedirect,
        checkRedirectResult,
        signOut,
        loading,
        error,
        setError
    };
};
