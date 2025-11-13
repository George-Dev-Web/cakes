import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { submitOrder, fetchCakes, fetchCustomizations } from "../utils/api";
import "./Order.css";

// Define which categories allow multiple selections (e.g., Topping, Art)
const MULTI_SELECT_CATEGORIES = ["Topping", "Art"];

const OrderPage = () => {
  const { currentUser } = useAuth();

  const initialOrderData = {
    cake_id: "",
    quantity: 1,
    delivery_date: "",
    special_requests: "",
    customer_name: currentUser?.name || "",
    customer_email: currentUser?.email || "",
    customer_phone: currentUser?.phone || "",
    delivery_address: currentUser?.address || "",
  };

  const [orderData, setOrderData] = useState(initialOrderData);
  const [cakes, setCakes] = useState([]);
  const [customizations, setCustomizations] = useState([]);
  const [selectedCustomizations, setSelectedCustomizations] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const formatPrice = (price) =>
    `KSh ${parseFloat(price).toLocaleString("en-KE")}`;

  // --- DATA FETCHING & STANDARDIZATION ---
  useEffect(() => {
    // Re-initialize orderData on user change (e.g., login/logout)
    setOrderData((prev) => ({
      ...prev,
      customer_name: currentUser?.name || "",
      customer_email: currentUser?.email || "",
      customer_phone: currentUser?.phone || "",
      delivery_address: currentUser?.address || "",
    }));

    const fetchData = async () => {
      try {
        const [cakesData, customData] = await Promise.all([
          fetchCakes(),
          fetchCustomizations(),
        ]);

        // Data Standardization: Ensure customData is an array and options are arrays
        const safeCustomData = Array.isArray(customData) ? customData : [];
        const standardizedCustomData = safeCustomData.map((group) => ({
          ...group,
          options: Array.isArray(group.options) ? group.options : [],
        }));

        setCakes(cakesData);
        setCustomizations(standardizedCustomData);
      } catch (err) {
        setError("Failed to load data. Please try again later.");
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    const val = type === "number" ? Number(value) : value;
    setOrderData({ ...orderData, [name]: val });
  };

  // --- CORE CUSTOMIZATION LOGIC ---
  const handleCustomizationSelect = (category, option) => {
    const isMultiSelect = MULTI_SELECT_CATEGORIES.includes(category);

    setSelectedCustomizations((prev) => {
      if (isMultiSelect) {
        // Multi-Select Logic (Toppings, Art): Toggle item in an array
        const currentOptions = Array.isArray(prev[category])
          ? prev[category]
          : [];
        const index = currentOptions.findIndex((o) => o.id === option.id);

        if (index > -1) {
          // Remove option (Deselect)
          return {
            ...prev,
            [category]: currentOptions.filter((_, i) => i !== index),
          };
        } else {
          // Add option (Select)
          return { ...prev, [category]: [...currentOptions, option] };
        }
      } else {
        // Single-Select Logic (Design, Flavor): Toggle single object
        return {
          ...prev,
          [category]: prev[category]?.id === option.id ? null : option,
        };
      }
    });
  };

  const calculateTotal = () => {
    let total = 0;
    const quantity = orderData.quantity || 1;

    // 1. Base Cake Price
    const baseCake = cakes.find(
      (cake) => cake.id === Number(orderData.cake_id)
    );
    if (baseCake) total += baseCake.price * quantity;

    // 2. Customizations Price
    Object.values(selectedCustomizations).forEach((selection) => {
      if (Array.isArray(selection)) {
        // Handle Multi-select categories (like Toppings or Art)
        selection.forEach((opt) => {
          if (opt && typeof opt.price === "number")
            total += opt.price * quantity;
        });
      } else if (selection && typeof selection.price === "number") {
        // Handle Single-select categories (like Design or Flavor)
        total += selection.price * quantity;
      }
    });

    return total;
  };

  const resetForm = () => {
    setOrderData(initialOrderData);
    setSelectedCustomizations({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!orderData.cake_id || !orderData.delivery_date) {
        setError("Please select a cake and delivery date.");
        setLoading(false);
        return;
      }
      if (
        !orderData.customer_name ||
        !orderData.customer_email ||
        !orderData.customer_phone ||
        !orderData.delivery_address
      ) {
        setError("Please fill in all required contact and delivery fields.");
        setLoading(false);
        return;
      }

      // Collect all selected IDs into one flat array for the backend payload
      let allCustomizationIds = [];
      Object.values(selectedCustomizations).forEach((selection) => {
        if (Array.isArray(selection)) {
          allCustomizationIds.push(...selection.map((c) => c.id));
        } else if (selection) {
          allCustomizationIds.push(selection.id);
        }
      });

      const payload = {
        ...orderData,
        customizations: allCustomizationIds,
        total_price: calculateTotal(),
      };

      await submitOrder(payload);
      // NOTE: Using alert() is generally discouraged, replacing with console log for safety
      console.log("Order placed successfully!");
      alert(
        "Thank you for your order! We will confirm the details via email shortly."
      );

      resetForm();
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        "Failed to place order. Please try again.";
      setError(errorMessage);
      console.error("Order error:", err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  // Delivery date constraints
  const today = new Date();
  const minDate = new Date(today);
  minDate.setDate(today.getDate() + 1);
  const maxDate = new Date(today);
  maxDate.setMonth(today.getMonth() + 3);
  const formatDate = (date) => date.toISOString().split("T")[0];

  return (
    <div className="order-page">
      <div className="container">
        <h1>Place Your Custom Cake Order</h1>
        {error && <div className="error-message">{error}</div>}

        <form className="order-form" onSubmit={handleSubmit}>
          {/* Cake Selection */}
          <div className="form-section">
            <h3>🎂 Base Cake Selection</h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="cake_id">Select Cake *</label>
                <select
                  id="cake_id"
                  name="cake_id"
                  value={orderData.cake_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">Choose a cake</option>
                  {cakes.map((cake) => (
                    <option key={cake.id} value={cake.id}>
                      {cake.name} - {formatPrice(cake.price)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="quantity">Quantity *</label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  min="1"
                  max="10"
                  value={orderData.quantity}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="delivery_date">Preferred Delivery Date *</label>
              <input
                type="date"
                id="delivery_date"
                name="delivery_date"
                value={orderData.delivery_date}
                onChange={handleChange}
                min={formatDate(minDate)}
                max={formatDate(maxDate)}
                required
              />
            </div>
          </div>

          {/* Customizations */}
          <div className="form-section customization-area">
            <h3>🎨 Customization Options</h3>
            {customizations.length > 0 ? (
              customizations.map((group) => {
                const isMulti = MULTI_SELECT_CATEGORIES.includes(
                  group.category
                );
                const isSelected = (optionId) => {
                  const selection = selectedCustomizations[group.category];
                  if (isMulti && Array.isArray(selection)) {
                    return selection.some((opt) => opt.id === optionId);
                  }
                  return selection?.id === optionId;
                };

                return (
                  <div key={group.category} className="customization-group">
                    <h4>
                      {group.category}{" "}
                      {isMulti ? "(Multi-Select)" : "(Single-Select)"}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {group.category === "Art"
                        ? "E.g., Special lettering or complex frosting."
                        : ""}
                    </p>

                    <div className="customization-options">
                      {group.options.map((option) => (
                        <div
                          key={option.id}
                          className={`customization-option ${
                            isSelected(option.id) ? "selected" : ""
                          }`}
                          onClick={() =>
                            handleCustomizationSelect(group.category, option)
                          }
                        >
                          {option.image_url && (
                            <img
                              src={option.image_url}
                              alt={option.name}
                              className="customization-img"
                              // Placeholder if image fails to load
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src =
                                  "https://placehold.co/64x64/CCCCCC/333333?text=IMG";
                              }}
                            />
                          )}
                          <div className="option-details">
                            <span>{option.name}</span>
                            {option.price > 0 && (
                              <span className="customization-price">
                                +{formatPrice(option.price)}
                              </span>
                            )}
                          </div>
                          {option.description && (
                            <p className="description">{option.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })
            ) : (
              <p>Loading customization options...</p>
            )}
            <div className="total-section mt-8 pt-4 border-t border-gray-300">
              <strong>Order Total: {formatPrice(calculateTotal())}</strong>
            </div>
          </div>

          {/* User Info and Requests */}
          <div className="form-section">
            <h3>📝 Final Details & Delivery</h3>

            <div className="form-group">
              <label htmlFor="special_requests">
                Special Requests (e.g., specific placement for art)
              </label>
              <textarea
                id="special_requests"
                name="special_requests"
                value={orderData.special_requests}
                onChange={handleChange}
                placeholder="Any special instructions or notes"
                rows="4"
              ></textarea>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="customer_name">Your Name *</label>
                <input
                  type="text"
                  id="customer_name"
                  name="customer_name"
                  value={orderData.customer_name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="customer_email">Email Address *</label>
                <input
                  type="email"
                  id="customer_email"
                  name="customer_email"
                  value={orderData.customer_email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="customer_phone">Phone Number *</label>
                <input
                  type="tel"
                  id="customer_phone"
                  name="customer_phone"
                  value={orderData.customer_phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="delivery_address">Delivery Address *</label>
              <textarea
                id="delivery_address"
                name="delivery_address"
                value={orderData.delivery_address}
                onChange={handleChange}
                required
                rows="3"
                placeholder="Full address for delivery"
              ></textarea>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? "Placing Order..." : "Place Order"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OrderPage;
