// frontend/src/components/AdminProtectedRoute.jsx
import { useAuth } from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";

const AdminProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();

  // Redirect to login if not authenticated
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  // Redirect to dashboard if not admin
  if (!currentUser.is_admin) {
    return <Navigate to="/dashboard" />;
  }

  // User is authenticated and is admin
  return children;
};

export default AdminProtectedRoute;
