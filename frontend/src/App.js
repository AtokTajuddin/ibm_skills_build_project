import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';

// Components
import HomePage from './components/HomePage';
import Login from './components/Login';
import Register from './components/Register';
import AuthCallback from './components/AuthCallback';
import Dashboard from './components/Dashboard';
import VirtualDoctor from './components/VirtualDoctor';

// Context
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<PublicRoute><HomePage /></PublicRoute>} />
              <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
              <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              
              {/* Protected Routes */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/virtual-doctor" 
                element={
                  <ProtectedRoute>
                    <VirtualDoctor />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

// Protected route component - only for authenticated users
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Public route component - for non-authenticated pages
const PublicRoute = ({ children }) => {
  return children;
};

export default App;
