// frontend/src/pages/Order.jsx
import { useState } from "react";
import "./Order.css";

const Order = () => {
  const [orderData, setOrderData] = useState({
    cakeId: "",
    quantity: 1,
    deliveryDate: "",
    specialRequests: "",
    name: "",
    email: "",
    phone: "",
  });

  const handleChange = (e) => {
    setOrderData({
      ...orderData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // API call will be implemented in Phase 2
    console.log("Order submitted:", orderData);
    alert(
      "Thank you for your order! We will confirm the details via email shortly."
    );
    setOrderData({
      cakeId: "",
      quantity: 1,
      deliveryDate: "",
      specialRequests: "",
      name: "",
      email: "",
      phone: "",
    });
  };

  return (
    <div className="order-page">
      <div className="container">
        <h1>Place Your Order</h1>
        <form className="order-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="cakeId">Select Cake</label>
              <select
                id="cakeId"
                name="cakeId"
                value={orderData.cakeId}
                onChange={handleChange}
                required
              >
                <option value="">Choose a cake</option>
                <option value="1">Chocolate Dream - $45</option>
                <option value="2">Vanilla Bliss - $40</option>
                <option value="3">Red Velvet Elegance - $50</option>
                <option value="4">Lemon Delight - $42</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="quantity">Quantity</label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                min="1"
                value={orderData.quantity}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="deliveryDate">Preferred Delivery Date</label>
            <input
              type="date"
              id="deliveryDate"
              name="deliveryDate"
              value={orderData.deliveryDate}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="specialRequests">Special Requests</label>
            <textarea
              id="specialRequests"
              name="specialRequests"
              value={orderData.specialRequests}
              onChange={handleChange}
            ></textarea>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Your Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={orderData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={orderData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={orderData.phone}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn">
            Place Order
          </button>
        </form>
      </div>
    </div>
  );
};

export default Order;
