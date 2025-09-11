// frontend/src/contexts/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { loginUser, registerUser, getCurrentUser } from "../utils/api";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   if (token) {
  //     getCurrentUser()
  //       .then((user) => {
  //         setCurrentUser(user);
  //       })
  //       .catch(() => {
  //         localStorage.removeItem("token");
  //       })
  //       .finally(() => {
  //         setLoading(false);
  //       });
  //   } else {
  //     setLoading(false);
  //   }
  // }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      getCurrentUser()
        .then((user) => {
          setCurrentUser(user);
        })
        .catch((error) => {
          console.error("Auth error:", error);
          // Clear invalid token
          localStorage.removeItem("token");
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  //
  // In your AuthContext.jsx, update the login and register functions:
  const login = async (email, password) => {
    const response = await loginUser(email, password);
    if (response.token) {
      localStorage.setItem("token", response.token);
      setCurrentUser(response.user);
      // No automatic navigation here - let the component handle it
      return { success: true };
    }
    return { success: false, message: response.message };
  };

  const register = async (userData) => {
    const response = await registerUser(userData);
    if (response.token) {
      localStorage.setItem("token", response.token);
      setCurrentUser(response.user);
      // No automatic navigation here - let the component handle it
      return { success: true };
    }
    return { success: false, message: response.message };
  };

  const logout = () => {
    localStorage.removeItem("token");
    setCurrentUser(null);
  };

  const updateUser = (userData) => {
    setCurrentUser((prev) => ({
      ...prev,
      ...userData,
    }));
  };

  const value = {
    currentUser,
    login,
    register,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
