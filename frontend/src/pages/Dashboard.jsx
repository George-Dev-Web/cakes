// frontend/src/pages/Dashboard.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { fetchUserOrders } from "../utils/api";
import "./Dashboard.css";

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { currentUser } = useAuth();

  // useEffect(() => {
  //   const getUserOrders = async () => {
  //     try {
  //       const userOrders = await fetchUserOrders();
  //       setOrders(userOrders);
  //     } catch (err) {
  //       setError("Failed to load your orders. Please try again later.");
  //       console.error(err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   getUserOrders();
  // }, []);
  useEffect(() => {
    const getUserOrders = async () => {
      try {
        const userOrders = await fetchUserOrders();
        setOrders(userOrders);
      } catch (err) {
        setError(
          err.message || "Failed to load your orders. Please try again later."
        );
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getUserOrders();
  }, []);

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { class: "status-pending", text: "Pending" },
      confirmed: { class: "status-confirmed", text: "Confirmed" },
      completed: { class: "status-completed", text: "Completed" },
      cancelled: { class: "status-cancelled", text: "Cancelled" },
    };

    const config = statusConfig[status] || {
      class: "status-pending",
      text: status,
    };
    return (
      <span className={`status-badge ${config.class}`}>{config.text}</span>
    );
  };

  if (loading)
    return <div className="dashboard-loading">Loading your dashboard...</div>;
  if (error) return <div className="dashboard-error">{error}</div>;

  return (
    <div className="dashboard">
      <div className="container">
        {/* Welcome Header */}
        <div className="dashboard-header">
          <h1>Welcome back, {currentUser.name}!</h1>
          <p>
            Here's your personalized dashboard with all your cake ordering
            details.
          </p>
        </div>

        <div className="dashboard-grid">
          {/* Profile Card */}
          <div className="dashboard-card profile-card">
            <div className="card-header">
              <h2>Your Profile</h2>
              <span className="card-icon">👤</span>
            </div>
            <div className="profile-info">
              <div className="info-item">
                <label>Full Name:</label>
                <span>{currentUser.name}</span>
              </div>
              <div className="info-item">
                <label>Email:</label>
                <span>{currentUser.email}</span>
              </div>
              {currentUser.phone && (
                <div className="info-item">
                  <label>Phone:</label>
                  <span>{currentUser.phone}</span>
                </div>
              )}
              {currentUser.address && (
                <div className="info-item">
                  <label>Address:</label>
                  <span>{currentUser.address}</span>
                </div>
              )}
            </div>
            <div className="card-actions">
              <button className="btn-outline">Edit Profile</button>
            </div>
          </div>

          {/* Preferences Card */}
          <div className="dashboard-card preferences-card">
            <div className="card-header">
              <h2>Your Preferences</h2>
              <span className="card-icon">⭐</span>
            </div>
            <div className="preferences-info">
              {currentUser.preferences &&
              Object.keys(currentUser.preferences).length > 0 ? (
                <>
                  {currentUser.preferences.favoriteCakeType && (
                    <div className="preference-item">
                      <label>Favorite Cake:</label>
                      <span className="preference-value">
                        {currentUser.preferences.favoriteCakeType
                          .split("-")
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() + word.slice(1)
                          )
                          .join(" ")}
                      </span>
                    </div>
                  )}
                  {currentUser.preferences.dietaryRestrictions && (
                    <div className="preference-item">
                      <label>Dietary Needs:</label>
                      <span className="preference-value">
                        {currentUser.preferences.dietaryRestrictions
                          .split(",")
                          .filter(Boolean)
                          .map((restriction) =>
                            restriction
                              .split("-")
                              .map(
                                (word) =>
                                  word.charAt(0).toUpperCase() + word.slice(1)
                              )
                              .join(" ")
                          )
                          .join(", ")}
                      </span>
                    </div>
                  )}
                  {currentUser.preferences.specialOccasions && (
                    <div className="preference-item">
                      <label>Special Occasions:</label>
                      <span className="preference-value">
                        {currentUser.preferences.specialOccasions}
                      </span>
                    </div>
                  )}
                </>
              ) : (
                <div className="no-preferences">
                  <p>You haven't set any preferences yet.</p>
                  <p>
                    Set your preferences to get personalized cake
                    recommendations!
                  </p>
                </div>
              )}
            </div>
            <div className="card-actions">
              <button className="btn-outline">Update Preferences</button>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="dashboard-card actions-card">
            <div className="card-header">
              <h2>Quick Actions</h2>
              <span className="card-icon">⚡</span>
            </div>
            <div className="quick-actions">
              <Link to="/order" className="action-btn primary">
                <span className="action-icon">🎂</span>
                <span className="action-text">Order New Cake</span>
              </Link>
              <Link to="/" className="action-btn secondary">
                <span className="action-icon">👀</span>
                <span className="action-text">Browse Cakes</span>
              </Link>
              <Link to="#contact" className="action-btn secondary">
                <span className="action-icon">📞</span>
                <span className="action-text">Contact Us</span>
              </Link>
            </div>
          </div>

          {/* Orders Card */}
          <div className="dashboard-card orders-card">
            <div className="card-header">
              <h2>Your Orders</h2>
              <span className="card-icon">📦</span>
            </div>

            {orders.length === 0 ? (
              <div className="no-orders">
                <div className="no-orders-icon">🍰</div>
                <h3>No orders yet</h3>
                <p>You haven't placed any orders with us yet.</p>
                <Link to="/order" className="btn btn-primary">
                  Place Your First Order
                </Link>
              </div>
            ) : (
              <>
                <div className="orders-summary">
                  <div className="summary-item">
                    <span className="summary-number">{orders.length}</span>
                    <span className="summary-label">Total Orders</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-number">
                      {
                        orders.filter((order) => order.status === "completed")
                          .length
                      }
                    </span>
                    <span className="summary-label">Completed</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-number">
                      {
                        orders.filter(
                          (order) =>
                            order.status === "pending" ||
                            order.status === "confirmed"
                        ).length
                      }
                    </span>
                    <span className="summary-label">Active</span>
                  </div>
                </div>

                <div className="recent-orders">
                  <h4>Recent Orders</h4>
                  {orders.slice(0, 3).map((order) => (
                    <div key={order.id} className="order-item">
                      <div className="order-info">
                        <div className="order-main">
                          <span className="order-cake">{order.cake_name}</span>
                          <span className="order-date">
                            {new Date(order.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="order-details">
                          <span className="order-quantity">
                            Qty: {order.quantity}
                          </span>
                          <span className="order-price">
                            ${order.total_price}
                          </span>
                          {getStatusBadge(order.status)}
                        </div>
                      </div>
                      <div className="order-actions">
                        <button className="btn-sm">View Details</button>
                      </div>
                    </div>
                  ))}
                </div>

                {orders.length > 3 && (
                  <div className="view-all-orders">
                    <Link to="/orders" className="btn-link">
                      View all orders ({orders.length})
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
