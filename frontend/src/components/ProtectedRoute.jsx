import React, { useContext, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(UserContext);
  const location = useLocation();

  useEffect(() => {
    console.log("🛡️ ProtectedRoute - Current state:", {
      user: user ? "Authenticated" : "Not authenticated",
      loading,
      path: location.pathname
    });
  }, [user, loading, location]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    console.log("🚫 Access denied - Redirecting to login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  console.log("✅ Access granted to protected route");
  return children;
};

export default ProtectedRoute; 