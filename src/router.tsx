import { createBrowserRouter } from 'react-router-dom';
import About from './pages/About';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import Register from './pages/Register';
import EmailVerification from './pages/EmailVerification';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import BrowseJobs from './pages/BrowseJobs';
import MyApplications from './pages/MyApplications';
import Companies from './pages/Companies';
import CompanyDetail from './pages/CompanyDetail';
import JobDetails from './pages/JobDetails';
import RecruiterDashboard from './pages/RecruiterDashboard';
import MyCompany from './pages/MyCompany';
import CreateJobOffer from './pages/CreateJobOffer';
import MyOffers from './pages/MyOffers';
import RecruiterJobOfferDetail from './pages/RecruiterJobOfferDetail';
import OfferApplicationDetail from './pages/OfferApplicationDetail';
import EvaluationResults from './pages/EvaluationResults';
import FirmApplications from './pages/FirmApplications';
import { ProtectedRoute } from './components/ProtectedRoute';
import { RoleProtectedRoute } from './components/RoleProtectedRoute';
import { RootRedirect } from './components/RootRedirect';
import { UserTypeEnum } from './types/auth';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootRedirect />,
  },
  {
    path: '/about',
    element: <About />,
  },
  {
    path: '/login',
    element: (
      <ProtectedRoute requireAuth={false}>
        <Login />
      </ProtectedRoute>
    ),
  },
  {
    path: '/register',
    element: (
      <ProtectedRoute requireAuth={false}>
        <Register />
      </ProtectedRoute>
    ),
  },
  {
    path: '/verify-email',
    element: (
      <ProtectedRoute requireAuth={false}>
        <EmailVerification />
      </ProtectedRoute>
    ),
  },
  {
    path: '/profile',
    element: (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    ),
  },
  // Job Seeker (APPLIER) Routes
  {
    path: '/dashboard',
    element: (
      <RoleProtectedRoute allowedRoles={[UserTypeEnum.APPLIER]}>
        <Dashboard />
      </RoleProtectedRoute>
    ),
  },
  {
    path: '/browse-jobs',
    element: (
      <RoleProtectedRoute allowedRoles={[UserTypeEnum.APPLIER]}>
        <BrowseJobs />
      </RoleProtectedRoute>
    ),
  },
  {
    path: '/jobs/:jobId',
    element: (
      <RoleProtectedRoute allowedRoles={[UserTypeEnum.APPLIER]}>
        <JobDetails />
      </RoleProtectedRoute>
    ),
  },
  {
    path: '/my-applications',
    element: (
      <RoleProtectedRoute allowedRoles={[UserTypeEnum.APPLIER]}>
        <MyApplications />
      </RoleProtectedRoute>
    ),
  },
  {
    path: '/companies',
    element: (
      <RoleProtectedRoute allowedRoles={[UserTypeEnum.APPLIER]}>
        <Companies />
      </RoleProtectedRoute>
    ),
  },
  {
    path: '/companies/:companyId',
    element: (
      <RoleProtectedRoute allowedRoles={[UserTypeEnum.APPLIER]}>
        <CompanyDetail />
      </RoleProtectedRoute>
    ),
  },
  // Recruiter Routes
  {
    path: '/recruiter-dashboard',
    element: (
      <RoleProtectedRoute allowedRoles={[UserTypeEnum.RECRUITER]}>
        <RecruiterDashboard />
      </RoleProtectedRoute>
    ),
  },
  {
    path: '/my-company',
    element: (
      <RoleProtectedRoute allowedRoles={[UserTypeEnum.RECRUITER]}>
        <MyCompany />
      </RoleProtectedRoute>
    ),
  },
  {
    path: '/create-job-offer',
    element: (
      <RoleProtectedRoute allowedRoles={[UserTypeEnum.RECRUITER]}>
        <CreateJobOffer />
      </RoleProtectedRoute>
    ),
  },
  {
    path: '/my-offers',
    element: (
      <RoleProtectedRoute allowedRoles={[UserTypeEnum.RECRUITER]}>
        <MyOffers />
      </RoleProtectedRoute>
    ),
  },
  {
    path: '/my-offers/:offerId',
    element: (
      <RoleProtectedRoute allowedRoles={[UserTypeEnum.RECRUITER]}>
        <RecruiterJobOfferDetail />
      </RoleProtectedRoute>
    ),
  },
  {
    path: '/firm-applications',
    element: (
      <RoleProtectedRoute allowedRoles={[UserTypeEnum.RECRUITER]}>
        <FirmApplications />
      </RoleProtectedRoute>
    ),
  },
  {
    path: '/applications/:applicationId',
    element: (
      <RoleProtectedRoute allowedRoles={[UserTypeEnum.RECRUITER]}>
        <OfferApplicationDetail />
      </RoleProtectedRoute>
    ),
  },
  {
    path: '/applications/:applicationId/evaluation',
    element: (
      <RoleProtectedRoute allowedRoles={[UserTypeEnum.RECRUITER]}>
        <EvaluationResults />
      </RoleProtectedRoute>
    ),
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);
