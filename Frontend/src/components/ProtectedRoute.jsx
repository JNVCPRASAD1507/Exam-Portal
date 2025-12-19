import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();

  // While checking auth
  if (loading) {
    return <div style={{ textAlign: "center", marginTop: "2rem" }}>Loading...</div>;
  }

  // Not logged in
  if (!user || !user.role) {
    return <Navigate to="/login" replace />;
  }

  // Role mismatch → redirect to proper dashboard
  if (role && user.role !== role) {
    return (
      <Navigate
        to={user.role === "admin" ? "/admin" : "/taketest"}
        replace
      />
    );
  }

  return children;
};

export default ProtectedRoute;
