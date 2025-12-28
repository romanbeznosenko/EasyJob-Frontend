import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserTypeEnum } from '../types/auth';

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserTypeEnum[];
}

/**
 * Route component that restricts access based on user role.
 * Redirects users to their appropriate dashboard if they try to access unauthorized pages.
 */
export function RoleProtectedRoute({ children, allowedRoles }: RoleProtectedRouteProps) {
  const { isSignedIn, user, isLoading } = useAuth();

  // Show nothing while loading
  if (isLoading) {
    return null;
  }

  // User must be signed in
  if (!isSignedIn || !user) {
    return <Navigate to="/login" replace />;
  }

  // Check if user's role is allowed
  if (!allowedRoles.includes(user.userType)) {
    // Redirect to appropriate dashboard based on user type
    const dashboardPath = user.userType === UserTypeEnum.RECRUITER
      ? '/recruiter-dashboard'
      : '/dashboard';

    return <Navigate to={dashboardPath} replace />;
  }

  return <>{children}</>;
}
