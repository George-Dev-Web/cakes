// frontend/src/pages/Dashboard.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { fetchUserOrders } from "../utils/api";
import "./Dashboard.css";

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { currentUser } = useAuth();

  useEffect(() => {
    const getUserOrders = async () => {
      try {
        const userOrders = await fetchUserOrders();
        setOrders(userOrders);
      } catch (err) {
        setError("Failed to load your orders. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getUserOrders();
  }, []);

  if (loading) return <div className="loading">Loading your orders...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="dashboard">
      <div className="container">
        <h1>Welcome, {currentUser.name}!</h1>
        <p>Here's your order history:</p>

        {orders.length === 0 ? (
          <div className="no-orders">
            <p>You haven't placed any orders yet.</p>
            <a href="/order" className="btn">
              Place Your First Order
            </a>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <h3>Order #{order.id}</h3>
                  <span className={`status status-${order.status}`}>
                    {order.status}
                  </span>
                </div>
                <div className="order-details">
                  <p>
                    <strong>Cake:</strong> {order.cake_name}
                  </p>
                  <p>
                    <strong>Quantity:</strong> {order.quantity}
                  </p>
                  <p>
                    <strong>Total:</strong> ${order.total_price}
                  </p>
                  <p>
                    <strong>Delivery Date:</strong>{" "}
                    {new Date(order.delivery_date).toLocaleDateString()}
                  </p>
                  {order.special_requests && (
                    <p>
                      <strong>Special Requests:</strong>{" "}
                      {order.special_requests}
                    </p>
                  )}
                </div>
                <div className="order-footer">
                  <p>
                    Placed on {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
