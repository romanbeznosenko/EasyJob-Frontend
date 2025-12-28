import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserTypeEnum } from '../types/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export function ProtectedRoute({ children, requireAuth = true }: ProtectedRouteProps) {
  const { isSignedIn, user, isLoading } = useAuth();

  // Show nothing while loading
  if (isLoading) {
    return null;
  }

  // Route requires authentication but user is not signed in
  if (requireAuth && !isSignedIn) {
    return <Navigate to="/login" replace />;
  }

  // Route requires NO authentication (login/register pages) but user IS signed in
  if (!requireAuth && isSignedIn) {
    // Redirect to appropriate dashboard based on user type
    const dashboardPath = user?.userType === UserTypeEnum.RECRUITER
      ? '/recruiter-dashboard'
      : '/dashboard';
    return <Navigate to={dashboardPath} replace />;
  }

  return <>{children}</>;
}
