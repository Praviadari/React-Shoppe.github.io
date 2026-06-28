import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { isAdminUser } from '../../utils/adminAccess';
import PageLoader from '../ui/PageLoader';

function AdminRoute({ children }) {
  const { user, loading, isAuthAvailable } = useAuth();
  const location = useLocation();

  if (loading) {
    return <PageLoader />;
  }

  if (!isAuthAvailable) {
    return <Navigate to="/login" state={{ from: location, reason: 'unconfigured' }} replace />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isAdminUser(user)) {
    return <Navigate to="/account" replace />;
  }

  return children;
}

export default AdminRoute;
