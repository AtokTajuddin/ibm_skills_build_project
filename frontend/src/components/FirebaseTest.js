import React from 'react';
import { Button, Container, Alert } from 'react-bootstrap';

const FirebaseTest = () => {
  const checkFirebaseConfig = () => {
    console.log('🔧 Firebase Configuration Check:');
    console.log('API Key:', process.env.REACT_APP_FIREBASE_API_KEY ? '✅ Set' : '❌ Missing');
    console.log('Auth Domain:', process.env.REACT_APP_FIREBASE_AUTH_DOMAIN ? '✅ Set' : '❌ Missing');
    console.log('Project ID:', process.env.REACT_APP_FIREBASE_PROJECT_ID ? '✅ Set' : '❌ Missing');
    console.log('App ID:', process.env.REACT_APP_FIREBASE_APP_ID ? '✅ Set' : '❌ Missing');
    
    console.log('Full config:', {
      apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
      authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
      storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.REACT_APP_FIREBASE_APP_ID
    });
  };

  const testBackendConnection = async () => {
    try {
      console.log('🔧 Testing backend connection...');
      const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/firebase-status`);
      const data = await response.json();
      console.log('🔧 Backend Firebase status:', data);
    } catch (error) {
      console.error('🔧 Backend connection failed:', error);
    }
  };

  return (
    <Container className="mt-4">
      <h2>Firebase Debug Console</h2>
      <Alert variant="info">
        Open your browser console (F12) to see debug information.
      </Alert>
      
      <div className="d-grid gap-2">
        <Button variant="primary" onClick={checkFirebaseConfig}>
          Check Firebase Config
        </Button>
        
        <Button variant="secondary" onClick={testBackendConnection}>
          Test Backend Connection
        </Button>
      </div>
      
      <div className="mt-4">
        <h4>Quick Firebase Setup Check:</h4>
        <ol>
          <li>Go to <a href="https://console.firebase.google.com" target="_blank" rel="noopener noreferrer">Firebase Console</a></li>
          <li>Select project: <strong>virtual-hospital-project</strong></li>
          <li>Go to Authentication → Sign-in method</li>
          <li>Enable Google provider</li>
          <li>Add localhost to authorized domains</li>
        </ol>
      </div>
    </Container>
  );
};

export default FirebaseTest;
