import React from "react";
import { ChildrenProps } from "../types/index.ts";
import useAuth from "../hooks/useAuth.tsx";
import { Navigate, useLocation } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner.tsx";

const PrivateRoute: React.FC<ChildrenProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  
  if (loading) {
    return <LoadingSpinner message="Checking authentication..." size="medium" />;
  }
  
  if (user) {
    return <>{children}</>;
  }
  
  return <Navigate to="/login" state={{ from: location }} replace></Navigate>;
};

export default PrivateRoute;
