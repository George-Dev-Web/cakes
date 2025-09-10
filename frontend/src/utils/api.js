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

export const getCurrentUser = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};

// Cakes API calls
export const fetchCakes = async () => {
  const response = await api.get("/cakes");
  return response.data;
};

// Orders API calls
export const submitOrder = async (orderData) => {
  const response = await api.post("/orders", orderData);
  return response.data;
};

export const fetchUserOrders = async () => {
  const response = await api.get("/orders/my-orders");
  return response.data;
};

// Contact API call
export const submitContactForm = async (formData) => {
  const response = await api.post("/contact", formData);
  return response.data;
};

export default api;
