// frontend/src/utils/api.js
import axios from "axios";

// Base API URL - will be configured based on environment
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// API functions
export const fetchCakes = async () => {
  try {
    // For Phase 1, return mock data
    // In Phase 2, replace with: const response = await api.get('/cakes');
    // return response.data;

    return [
      {
        id: 1,
        name: "Chocolate Dream",
        description:
          "Rich chocolate cake with layers of chocolate mousse and ganache",
        price: 45,
        image: "https://placehold.co/400x300/ff7bac/white?text=Chocolate+Dream",
      },
      {
        id: 2,
        name: "Vanilla Bliss",
        description:
          "Classic vanilla sponge with buttercream frosting and fresh berries",
        price: 40,
        image: "https://placehold.co/400x300/f9d5e5/333?text=Vanilla+Bliss",
      },
      {
        id: 3,
        name: "Red Velvet Elegance",
        description:
          "Traditional red velvet with cream cheese frosting and decorative elements",
        price: 50,
        image:
          "https://placehold.co/400x300/d13b7f/white?text=Red+Velvet+Elegance",
      },
      {
        id: 4,
        name: "Lemon Delight",
        description:
          "Zesty lemon cake with lemon curd filling and meringue frosting",
        price: 42,
        image: "https://placehold.co/400x300/ff7bac/white?text=Lemon+Delight",
      },
    ];
  } catch (error) {
    console.error("Error fetching cakes:", error);
    throw error;
  }
};

export const submitContactForm = async (formData) => {
  try {
    // Will be implemented in Phase 2
    // const response = await api.post('/contact', formData);
    // return response.data;
    console.log("Contact form submitted:", formData);
    return { success: true, message: "Thank you for your message!" };
  } catch (error) {
    console.error("Error submitting contact form:", error);
    throw error;
  }
};

export const submitOrder = async (orderData) => {
  try {
    // Will be implemented in Phase 2
    // const response = await api.post('/orders', orderData);
    // return response.data;
    console.log("Order submitted:", orderData);
    return { success: true, message: "Order placed successfully!" };
  } catch (error) {
    console.error("Error submitting order:", error);
    throw error;
  }
};

export default api;
