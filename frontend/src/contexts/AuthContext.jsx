// frontend/src/contexts/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { loginUser, registerUser, getCurrentUser } from "../utils/api";
import { toast } from "react-toastify";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      getCurrentUser()
        .then((user) => {
          setCurrentUser(user);
        })
        .catch((error) => {
          console.error("Auth error:", error);
          localStorage.removeItem("token");
          toast.error("Session expired. Please log in again.");
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const response = await loginUser(email, password);
    if (response.token) {
      localStorage.setItem("token", response.token);
      setCurrentUser(response.user);
      toast.success("Login successful! 🎉");
      return { success: true };
    }
    toast.error(response.message || "Login failed ❌");
    return { success: false, message: response.message };
  };

  const register = async (userData) => {
    const response = await registerUser(userData);
    if (response.token) {
      localStorage.setItem("token", response.token);
      setCurrentUser(response.user);
      toast.success("Registration successful! 🎉");
      return { success: true };
    }
    toast.error(response.message || "Registration failed ❌");
    return { success: false, message: response.message };
  };

  const logout = () => {
    localStorage.removeItem("token");
    setCurrentUser(null);
    toast.info("Logged out successfully 👋");
  };

  const updateUser = (userData) => {
    setCurrentUser((prev) => ({
      ...prev,
      ...userData,
    }));
  };

  // Add admin check helper function
  const isAdmin = () => {
    return currentUser && currentUser.is_admin === true;
  };

  const value = {
    currentUser,
    login,
    register,
    logout,
    updateUser,
    isAdmin, // Add isAdmin function to context value
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
