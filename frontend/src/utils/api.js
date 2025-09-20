// frontend/src/utils/api.js
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle authentication errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const loginUser = async (email, password) => {
  const response = await api.post("/auth/login", { email, password });
  return response.data;
};

export const registerUser = async (userData) => {
  const response = await api.post("/auth/register", userData);
  return response.data;
};

// FIXED getCurrentUser function
export const getCurrentUser = async () => {
  try {
    const response = await api.get("/auth/me");
    return response.data;
  } catch (error) {
    console.error("Error fetching current user:", error.response?.data);
    throw error;
  }
};

// Cakes API calls
export const fetchCakes = async () => {
  const response = await api.get("/cakes");
  return response.data;
};

// Orders API calls
export const submitOrder = async (orderData) => {
  try {
    // Ensure delivery_date is properly formatted
    const formattedData = {
      ...orderData,
      delivery_date: orderData.deliveryDate || orderData.delivery_date,
    };

    const response = await api.post("/orders", formattedData);
    return response.data;
  } catch (error) {
    console.error("Order submission error:", error.response?.data);
    throw error;
  }
};

export const fetchUserOrders = async () => {
  try {
    const response = await api.get("/orders/my-orders");
    return response.data;
  } catch (error) {
    console.error("Error fetching user orders:", error.response?.data);

    // Handle specific error cases
    if (error.response?.status === 422) {
      throw new Error("Unable to fetch orders. Please try logging in again.");
    } else if (error.response?.status === 401) {
      // Token might be invalid, clear it
      localStorage.removeItem("token");
      throw new Error("Session expired. Please log in again.");
    } else {
      throw new Error("Failed to load orders. Please try again later.");
    }
  }
};

export const cancelOrder = async (orderId) => {
  try {
    const response = await api.delete(`/orders/${orderId}`);
    return response.data;
  } catch (error) {
    console.error("Error cancelling order:", error.response?.data);
    throw error;
  }
};

export const updateUserProfile = async (profileData) => {
  try {
    const response = await api.put("/auth/profile", profileData);
    return response.data;
  } catch (error) {
    console.error("Error updating profile:", error.response?.data);
    throw error;
  }
};

// Contact API call
export const submitContactForm = async (formData) => {
  const response = await api.post("/contact", formData);
  return response.data;
};

// Admin API calls - Added without changing existing logic
export const fetchAdminStats = async () => {
  try {
    const response = await api.get("/admin/dashboard/stats");
    return response.data;
  } catch (error) {
    console.error("Error fetching admin stats:", error.response?.data);
    throw error;
  }
};

export const fetchAdminOrders = async (params = {}) => {
  try {
    const response = await api.get("/admin/orders", { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching admin orders:", error.response?.data);
    throw error;
  }
};

export const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await api.put(`/admin/orders/${orderId}/status`, {
      status,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating order status:", error.response?.data);
    throw error;
  }
};

export const fetchAdminCakes = async () => {
  try {
    const response = await api.get("/admin/cakes");
    return response.data;
  } catch (error) {
    console.error("Error fetching admin cakes:", error.response?.data);
    throw error;
  }
};

export const createCake = async (cakeData) => {
  try {
    const response = await api.post("/admin/cakes", cakeData);
    return response.data;
  } catch (error) {
    console.error("Error creating cake:", error.response?.data);
    throw error;
  }
};

export const updateCake = async (cakeId, cakeData) => {
  try {
    const response = await api.put(`/admin/cakes/${cakeId}`, cakeData);
    return response.data;
  } catch (error) {
    console.error("Error updating cake:", error.response?.data);
    throw error;
  }
};

export const deleteCake = async (cakeId) => {
  try {
    const response = await api.delete(`/admin/cakes/${cakeId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting cake:", error.response?.data);
    throw error;
  }
};

export const fetchAdminUsers = async (params = {}) => {
  try {
    const response = await api.get("/admin/users", { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching admin users:", error.response?.data);
    throw error;
  }
};

export default api;
