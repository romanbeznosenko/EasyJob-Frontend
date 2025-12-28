import { createContext, createRef, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { User, LoginPayload } from '../types/auth';
import { loginRequest, logoutRequest, getCurrentUserRequest } from '../services/auth.service';

export interface AuthContextType {
  user: User | null;
  isSignedIn: boolean;
  isLoading: boolean;
  loginUser: (payload: LoginPayload) => Promise<User>;
  logoutUser: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

export const initialAuthContextState: AuthContextType = {
  user: null,
  isSignedIn: false,
  isLoading: true,
  loginUser: async () => {
    throw new Error('AuthProvider not initialized');
  },
  logoutUser: async () => {
    throw new Error('AuthProvider not initialized');
  },
  refreshUser: async () => {
    throw new Error('AuthProvider not initialized');
  },
};

export const authContextRef = createRef<AuthContextType>();

const AuthContext = createContext<AuthContextType>(initialAuthContextState);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize: Check if user is already logged in
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Try to get current user from backend
        const response = await getCurrentUserRequest();
        if (response.data) {
          setUser(response.data);
          localStorage.setItem('currentUser', JSON.stringify(response.data));
        } else {
          // No active session
          localStorage.removeItem('currentUser');
          setUser(null);
        }
      } catch (error) {
        // Not authenticated or error
        console.log('No active session');
        localStorage.removeItem('currentUser');
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  // Login function
  const loginUser = useCallback(async (payload: LoginPayload): Promise<User> => {
    try {
      // Login request already fetches user data after successful login
      const response = await loginRequest(payload);

      if (!response.data) {
        throw new Error('Login failed: No user data received');
      }

      const userData = response.data;
      setUser(userData);
      localStorage.setItem('currentUser', JSON.stringify(userData));

      return userData;
    } catch (error) {
      console.error('Login failed:', error);
      setUser(null);
      localStorage.removeItem('currentUser');
      throw error;
    }
  }, []);

  // Logout function
  const logoutUser = useCallback(async () => {
    try {
      // Call backend logout
      await logoutRequest();
    } catch (error) {
      console.error('Logout request failed:', error);
    } finally {
      // Always clear local state regardless of backend response
      setUser(null);
      localStorage.removeItem('currentUser');
    }
  }, []);

  // Refresh user data from backend
  const refreshUser = useCallback(async () => {
    try {
      const response = await getCurrentUserRequest();
      if (response.data) {
        setUser(response.data);
        localStorage.setItem('currentUser', JSON.stringify(response.data));
      } else {
        setUser(null);
        localStorage.removeItem('currentUser');
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
      setUser(null);
      localStorage.removeItem('currentUser');
    }
  }, []);

  const contextValue: AuthContextType = {
    user,
    isSignedIn: !!user,
    isLoading,
    loginUser,
    logoutUser,
    refreshUser,
  };

  // Update ref for use in interceptors
  useEffect(() => {
    (authContextRef as any).current = contextValue;
  }, [contextValue]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        fontSize: '18px',
        color: '#666'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
