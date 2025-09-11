// // frontend/src/components/ProtectedRoute.jsx
// import { useAuth } from "../contexts/AuthContext";
// import { Navigate } from "react-router-dom";

// const ProtectedRoute = ({ children }) => {
//   const { currentUser } = useAuth();
//   return currentUser ? children : <Navigate to="/login" />;
// };

// export default ProtectedRoute;

import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) return <div>Loading...</div>; // wait before deciding
  return currentUser ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
