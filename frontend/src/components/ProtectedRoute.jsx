import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRole }) {
  const { user, loading } = useContext(AuthContext);
  if (loading) {
  return <p>Loading...</p>;
  }
  if (!user) {
  return <Navigate to="/login" />;
  
  } 
  
  if (allowedRole && user.role !== allowedRole) {
  if (user.role === "STUDENT") {
    return <Navigate to="/student/dashboard" />;
  }

  if (user.role === "INSTRUCTOR") {
    return <Navigate to="/instructor/dashboard" />;
  }

  if (user.role === "ADMIN") {
    return <Navigate to="/admin/dashboard" />;
  }
}

  return children;
}

export default ProtectedRoute;