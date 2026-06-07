import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = () => {
  const { user } = useContext(AuthContext);

  // If there is no authenticated user, redirect them to the login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render the child routes (via Outlet)
  return <Outlet />;
};

export default ProtectedRoute;
