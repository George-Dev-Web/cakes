// // frontend/src/pages/Order.jsx
// import { useState, useEffect } from "react";
// import { useAuth } from "../contexts/AuthContext";
// import { submitOrder, fetchCakes } from "../utils/api";
// import "./Order.css";

// const Order = () => {
//   const [orderData, setOrderData] = useState({
//     cake_id: "",
//     quantity: 1,
//     delivery_date: "",
//     special_requests: "",
//     customer_name: "",
//     customer_email: "",
//     customer_phone: "",
//     delivery_address: "",
//   });
//   const [cakes, setCakes] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const { currentUser } = useAuth();

//   // Format price as Kenyan Shillings
//   const formatPrice = (price) => {
//     return `KSh ${price.toLocaleString("en-KE")}`;
//   };

//   useEffect(() => {
//     // Pre-fill form with user data if logged in
//     if (currentUser) {
//       setOrderData((prev) => ({
//         ...prev,
//         customer_name: currentUser.name || "",
//         customer_email: currentUser.email || "",
//         customer_phone: currentUser.phone || "",
//         delivery_address: currentUser.address || "",
//       }));
//     }

//     // Fetch available cakes
//     const getCakes = async () => {
//       try {
//         const cakesData = await fetchCakes();
//         setCakes(cakesData);
//       } catch (err) {
//         setError("Failed to load cakes. Please try again later.");
//         console.error(err);
//       }
//     };

//     getCakes();
//   }, [currentUser]);

//   const handleChange = (e) => {
//     setOrderData({
//       ...orderData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setLoading(true);

//     try {
//       // Validate required fields
//       if (
//         !orderData.cake_id ||
//         !orderData.delivery_date ||
//         !orderData.customer_name ||
//         !orderData.customer_email ||
//         !orderData.customer_phone ||
//         !orderData.delivery_address
//       ) {
//         setError("Please fill in all required fields");
//         setLoading(false);
//         return;
//       }

//       await submitOrder(orderData);
//       alert(
//         "Thank you for your order! We will confirm the details via email shortly."
//       );

//       // Reset form but keep user details
//       setOrderData({
//         cake_id: "",
//         quantity: 1,
//         delivery_date: "",
//         special_requests: "",
//         customer_name: currentUser ? currentUser.name : "",
//         customer_email: currentUser ? currentUser.email : "",
//         customer_phone: currentUser ? currentUser.phone : "",
//         delivery_address: currentUser ? currentUser.address : "",
//       });
//     } catch (err) {
//       const errorMessage =
//         err.response?.data?.message ||
//         "Failed to place order. Please try again.";
//       setError(errorMessage);
//       console.error("Order error:", err.response?.data);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Calculate delivery date constraints (min: tomorrow, max: 3 months from now)
//   const today = new Date();
//   const minDate = new Date(today);
//   minDate.setDate(today.getDate() + 1);

//   const maxDate = new Date(today);
//   maxDate.setMonth(today.getMonth() + 3);

//   const formatDate = (date) => {
//     return date.toISOString().split("T")[0];
//   };

//   return (
//     <div className="order-page">
//       <div className="container">
//         <h1>Place Your Order</h1>
//         {error && <div className="error-message">{error}</div>}

//         <form className="order-form" onSubmit={handleSubmit}>
//           <div className="form-section">
//             <h3>Cake Selection</h3>
//             <div className="form-row">
//               <div className="form-group">
//                 <label htmlFor="cake_id">Select Cake *</label>
//                 <select
//                   id="cake_id"
//                   name="cake_id"
//                   value={orderData.cake_id}
//                   onChange={handleChange}
//                   required
//                 >
//                   <option value="">Choose a cake</option>
//                   {cakes.map((cake) => (
//                     <option key={cake.id} value={cake.id}>
//                       {cake.name} - {formatPrice(cake.price)}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div className="form-group">
//                 <label htmlFor="quantity">Quantity *</label>
//                 <input
//                   type="number"
//                   id="quantity"
//                   name="quantity"
//                   min="1"
//                   max="10"
//                   value={orderData.quantity}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>
//             </div>

//             <div className="form-group">
//               <label htmlFor="delivery_date">Preferred Delivery Date *</label>
//               <input
//                 type="date"
//                 id="delivery_date"
//                 name="delivery_date"
//                 value={orderData.delivery_date}
//                 onChange={handleChange}
//                 min={formatDate(minDate)}
//                 max={formatDate(maxDate)}
//                 required
//               />
//             </div>

//             <div className="form-group">
//               <label htmlFor="special_requests">Special Requests</label>
//               <textarea
//                 id="special_requests"
//                 name="special_requests"
//                 value={orderData.special_requests}
//                 onChange={handleChange}
//                 placeholder="Any special instructions, dietary requirements, or customization requests"
//                 rows="4"
//               ></textarea>
//             </div>
//           </div>

//           <div className="form-section">
//             <h3>Your Information</h3>
//             <div className="form-row">
//               <div className="form-group">
//                 <label htmlFor="customer_name">Your Name *</label>
//                 <input
//                   type="text"
//                   id="customer_name"
//                   name="customer_name"
//                   value={orderData.customer_name}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>
//               <div className="form-group">
//                 <label htmlFor="customer_email">Email Address *</label>
//                 <input
//                   type="email"
//                   id="customer_email"
//                   name="customer_email"
//                   value={orderData.customer_email}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>
//             </div>

//             <div className="form-row">
//               <div className="form-group">
//                 <label htmlFor="customer_phone">Phone Number *</label>
//                 <input
//                   type="tel"
//                   id="customer_phone"
//                   name="customer_phone"
//                   value={orderData.customer_phone}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>
//             </div>

//             <div className="form-group">
//               <label htmlFor="delivery_address">Delivery Address *</label>
//               <textarea
//                 id="delivery_address"
//                 name="delivery_address"
//                 value={orderData.delivery_address}
//                 onChange={handleChange}
//                 required
//                 rows="3"
//                 placeholder="Full address for delivery"
//               ></textarea>
//             </div>
//           </div>

//           <button type="submit" disabled={loading} className="btn btn-primary">
//             {loading ? "Placing Order..." : "Place Order"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Order;

// frontend/src/pages/OrderPage.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { submitOrder, fetchCakes, fetchCustomizations } from "../utils/api";
import "./Order.css";

const Order = () => {
  const { currentUser } = useAuth();

  const [orderData, setOrderData] = useState({
    cake_id: "",
    quantity: 1,
    delivery_date: "",
    special_requests: "",
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    delivery_address: "",
  });

  const [cakes, setCakes] = useState([]);
  const [customizations, setCustomizations] = useState([]);
  const [selectedCustomizations, setSelectedCustomizations] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const formatPrice = (price) => `KSh ${price.toLocaleString("en-KE")}`;

  useEffect(() => {
    // Pre-fill form with user data
    if (currentUser) {
      setOrderData((prev) => ({
        ...prev,
        customer_name: currentUser.name || "",
        customer_email: currentUser.email || "",
        customer_phone: currentUser.phone || "",
        delivery_address: currentUser.address || "",
      }));
    }

    const fetchData = async () => {
      try {
        const [cakesData, customData] = await Promise.all([
          fetchCakes(),
          fetchCustomizations(),
        ]);
        setCakes(cakesData);
        setCustomizations(customData);
      } catch (err) {
        setError("Failed to load data. Please try again later.");
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, [currentUser]);

  const handleChange = (e) => {
    setOrderData({ ...orderData, [e.target.name]: e.target.value });
  };

  const handleCustomizationSelect = (category, option) => {
    setSelectedCustomizations((prev) => ({
      ...prev,
      [category]: prev[category]?.id === option.id ? null : option,
    }));
  };

  const calculateTotal = () => {
    let total = 0;
    const baseCake = cakes.find(
      (cake) => cake.id === Number(orderData.cake_id)
    );
    if (baseCake) total += baseCake.price * orderData.quantity;

    Object.values(selectedCustomizations).forEach((opt) => {
      if (opt) total += opt.price * orderData.quantity;
    });

    return total;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (
        !orderData.cake_id ||
        !orderData.delivery_date ||
        !orderData.customer_name ||
        !orderData.customer_email ||
        !orderData.customer_phone ||
        !orderData.delivery_address
      ) {
        setError("Please fill in all required fields");
        setLoading(false);
        return;
      }

      const payload = {
        ...orderData,
        customizations: Object.values(selectedCustomizations)
          .filter(Boolean)
          .map((c) => c.id),
        total_price: calculateTotal(),
      };

      await submitOrder(payload);
      alert(
        "Thank you for your order! We will confirm the details via email shortly."
      );

      // Reset form but keep user details
      setOrderData({
        cake_id: "",
        quantity: 1,
        delivery_date: "",
        special_requests: "",
        customer_name: currentUser ? currentUser.name : "",
        customer_email: currentUser ? currentUser.email : "",
        customer_phone: currentUser ? currentUser.phone : "",
        delivery_address: currentUser ? currentUser.address : "",
      });
      setSelectedCustomizations({});
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
        <h1>Place Your Order</h1>
        {error && <div className="error-message">{error}</div>}

        <form className="order-form" onSubmit={handleSubmit}>
          {/* Cake Selection */}
          <div className="form-section">
            <h3>Cake Selection</h3>
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

            <div className="form-group">
              <label htmlFor="special_requests">Special Requests</label>
              <textarea
                id="special_requests"
                name="special_requests"
                value={orderData.special_requests}
                onChange={handleChange}
                placeholder="Any special instructions or notes"
                rows="4"
              ></textarea>
            </div>
          </div>

          {/* Customizations */}
          <div className="form-section">
            <h3>Customize Your Cake (Optional)</h3>
            {customizations.length > 0 ? (
              customizations.map((category) => (
                <div key={category.name} className="customization-category">
                  <h4>{category.displayName}</h4>
                  <div className="customization-options">
                    {category.options.map((option) => (
                      <div
                        key={option.id}
                        className={`customization-option ${
                          selectedCustomizations[category.name]?.id ===
                          option.id
                            ? "selected"
                            : ""
                        }`}
                        onClick={() =>
                          handleCustomizationSelect(category.name, option)
                        }
                      >
                        {option.image_url && (
                          <img
                            src={option.image_url}
                            alt={option.name}
                            className="customization-img"
                          />
                        )}
                        <span>{option.name}</span>
                        {option.price > 0 && (
                          <span className="customization-price">
                            +{formatPrice(option.price)}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <p>No customization options available</p>
            )}
            <div className="total-section">
              <strong>Total: {formatPrice(calculateTotal())}</strong>
            </div>
          </div>

          {/* User Info */}
          <div className="form-section">
            <h3>Your Information</h3>
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

export default Order;
