import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import PageLoader from '../ui/PageLoader';

function ProtectedRoute({ children }) {
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

  return children;
}

export default ProtectedRoute;
