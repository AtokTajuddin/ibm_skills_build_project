import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on page load
    const checkLoggedIn = async () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      if (token && storedUser) {
        try {
          // Parse the stored user data
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          
          // Check if token needs refresh
          if (isTokenExpiringSoon(token)) {
            await refreshAuthTokenLocal();
          }
        } catch (error) {
          console.error('Error parsing stored user data:', error);
          // Clear invalid data
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
        }
      }
      
      setLoading(false);
    };

    // Refresh token automatically (local function)
    const refreshAuthTokenLocal = async () => {
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (!refreshToken) {
        logout();
        return;
      }

      try {
        const response = await fetch('http://localhost:5001/api/auth/refresh', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refreshToken }),
        });

        const data = await response.json();

        if (data.success) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('refreshToken', data.refreshToken);
          return data.token;
        } else {
          logout();
        }
      } catch (error) {
        console.error('Token refresh failed:', error);
        logout();
      }
    };
    
    checkLoggedIn();
  }, []);

  // Check if token is expiring soon (within 5 minutes)
  const isTokenExpiringSoon = (token) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = payload.exp * 1000; // Convert to milliseconds
      const currentTime = Date.now();
      const fiveMinutes = 5 * 60 * 1000;
      
      return (expirationTime - currentTime) < fiveMinutes;
    } catch (error) {
      return true; // If we can't decode, assume it needs refresh
    }
  };

  // Refresh token function (moved outside useEffect)
  const refreshAuthToken = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (!refreshToken) {
      logout();
      return;
    }

    try {
      const response = await fetch('http://localhost:5001/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('refreshToken', data.refreshToken);
        return data.token;
      } else {
        logout();
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      logout();
    }
  };

  const login = (userData, token, refreshToken) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    if (token) {
      localStorage.setItem('token', token);
    }
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }
  };

  const logout = async () => {
    const token = localStorage.getItem('token');
    
    // Call logout endpoint to invalidate session on server
    if (token) {
      try {
        await fetch('http://localhost:5001/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      } catch (error) {
        console.error('Error during logout:', error);
      }
    }
    
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setUser(null);
  };

  // Enhanced API call with automatic token refresh
  const authenticatedFetch = async (url, options = {}) => {
    let token = localStorage.getItem('token');
    
    // Check if token needs refresh
    if (token && isTokenExpiringSoon(token)) {
      token = await refreshAuthToken();
    }
    
    if (!token) {
      throw new Error('No valid token available');
    }

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    // If token is invalid, try to refresh and retry once
    if (response.status === 401) {
      const newToken = await refreshAuthToken();
      if (newToken) {
        headers['Authorization'] = `Bearer ${newToken}`;
        return fetch(url, { ...options, headers });
      }
    }

    return response;
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      loading, 
      authenticatedFetch,
      refreshAuthToken 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
