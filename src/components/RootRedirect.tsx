import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserTypeEnum } from '../types/auth';

export function RootRedirect() {
  const { isSignedIn, user } = useAuth();

  if (!isSignedIn) {
    return <Navigate to="/login" replace />;
  }

  const dashboardPath = user?.userType === UserTypeEnum.RECRUITER
    ? '/recruiter-dashboard'
    : '/dashboard';

  return <Navigate to={dashboardPath} replace />;
}
