import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Container, Spinner } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

const AuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  useEffect(() => {
    // Get token from URL query params
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const isNewUser = params.get('isNewUser') === 'true';
    
    if (token) {
      // Store token in localStorage
      localStorage.setItem('token', token);
      
      // Fetch user data with token
      const fetchUserData = async () => {
        try {
          // You would typically have an endpoint to get user data using the token
          // For now, we'll just set a basic user object
          const user = {
            id: 'user-id', // This would come from your API
            username: 'User', // This would come from your API
          };
          
          // Update auth context
          login(user);
          
          // Redirect based on whether it's a new user or existing user
          if (isNewUser) {
            navigate('/dashboard?welcome=new');
          } else {
            navigate('/dashboard');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          // Handle error, maybe redirect to login with error message
          navigate('/login?error=auth_failed');
        }
      };
      
      fetchUserData();
    } else {
      // If no token, redirect to login
      navigate('/login?error=no_token');
    }
  }, [location, navigate, login]);
  
  return (
    <Container className="text-center" style={{ marginTop: '100px' }}>
      <Spinner animation="border" role="status" variant="primary" style={{ width: '4rem', height: '4rem' }} />
      <h2 className="mt-3">Authenticating...</h2>
      <p>Please wait while we complete the authentication process.</p>
    </Container>
  );
};

export default AuthCallback;
