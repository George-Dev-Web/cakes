// frontend/src/pages/AdminDashboard.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  fetchAdminStats,
  fetchAdminOrders,
  updateOrderStatus,
  fetchAdminCakes,
  createCake,
  updateCake,
  deleteCake,
  fetchAdminUsers,
} from "../utils/api";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [cakes, setCakes] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser && currentUser.is_admin) {
      loadData();
    }
  }, [currentUser, activeTab]);

  const loadData = async () => {
    try {
      setLoading(true);
      switch (activeTab) {
        case "overview": {
          const statsData = await fetchAdminStats();
          setStats(statsData);
          break;
        }
        case "orders": {
          const ordersData = await fetchAdminOrders();
          setOrders(ordersData.orders || []);
          break;
        }
        case "cakes": {
          const cakesData = await fetchAdminCakes();
          setCakes(cakesData);
          break;
        }
        case "users": {
          const usersData = await fetchAdminUsers();
          setUsers(usersData.users || []);
          break;
        }
        default:
          break;
      }
    } catch (err) {
      setError("Failed to load data. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      // Refresh orders
      const ordersData = await fetchAdminOrders();
      setOrders(ordersData.orders || []);
    } catch (err) {
      setError("Failed to update order status.");
      console.error(err);
    }
  };

  if (!currentUser || !currentUser.is_admin) {
    return (
      <div className="admin-denied">
        <div className="container">
          <h2>Access Denied</h2>
          <p>You do not have permission to access the admin dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="container">
        <div className="admin-header">
          <h1>Admin Dashboard</h1>
          <p>Manage orders, users, and cake inventory</p>
        </div>

        <div className="admin-tabs">
          <button
            className={activeTab === "overview" ? "active" : ""}
            onClick={() => setActiveTab("overview")}
          >
            Overview
          </button>
          <button
            className={activeTab === "orders" ? "active" : ""}
            onClick={() => setActiveTab("orders")}
          >
            Orders
          </button>
          <button
            className={activeTab === "cakes" ? "active" : ""}
            onClick={() => setActiveTab("cakes")}
          >
            Cakes
          </button>
          <button
            className={activeTab === "users" ? "active" : ""}
            onClick={() => setActiveTab("users")}
          >
            Users
          </button>
        </div>

        <div className="admin-content">
          {loading && <div className="loading">Loading...</div>}
          {error && <div className="error">{error}</div>}

          {activeTab === "overview" && stats && <OverviewTab stats={stats} />}

          {activeTab === "orders" && (
            <OrdersTab orders={orders} onStatusUpdate={handleStatusUpdate} />
          )}

          {activeTab === "cakes" && (
            <CakesTab cakes={cakes} onRefresh={loadData} />
          )}

          {activeTab === "users" && <UsersTab users={users} />}
        </div>
      </div>
    </div>
  );
};

// Tab Components
const OverviewTab = ({ stats }) => (
  <div className="overview-grid">
    <div className="stat-card">
      <h3>Total Users</h3>
      <div className="stat-number">{stats.total_users}</div>
    </div>
    <div className="stat-card">
      <h3>Total Orders</h3>
      <div className="stat-number">{stats.total_orders}</div>
    </div>
    <div className="stat-card">
      <h3>Total Revenue</h3>
      <div className="stat-number">${stats.total_revenue.toFixed(2)}</div>
    </div>
    <div className="stat-card">
      <h3>Recent Orders (7 days)</h3>
      <div className="stat-number">{stats.recent_orders}</div>
    </div>

    <div className="status-grid">
      <h3>Orders by Status</h3>
      <div className="status-cards">
        <div className="status-card pending">
          <span>Pending</span>
          <strong>{stats.orders_by_status.pending}</strong>
        </div>
        <div className="status-card confirmed">
          <span>Confirmed</span>
          <strong>{stats.orders_by_status.confirmed}</strong>
        </div>
        <div className="status-card completed">
          <span>Completed</span>
          <strong>{stats.orders_by_status.completed}</strong>
        </div>
        <div className="status-card cancelled">
          <span>Cancelled</span>
          <strong>{stats.orders_by_status.cancelled}</strong>
        </div>
      </div>
    </div>
  </div>
);

const OrdersTab = ({ orders, onStatusUpdate }) => (
  <div className="orders-table">
    <h3>All Orders</h3>
    {orders.length === 0 ? (
      <p>No orders found.</p>
    ) : (
      <table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Cake</th>
            <th>Quantity</th>
            <th>Total</th>
            <th>Status</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>#{order.id}</td>
              <td>
                <div>{order.customer_name}</div>
                <small>{order.customer_email}</small>
              </td>
              <td>{order.cake_name}</td>
              <td>{order.quantity}</td>
              <td>${order.total_price}</td>
              <td>
                <span className={`status-badge status-${order.status}`}>
                  {order.status}
                </span>
              </td>
              <td>{new Date(order.created_at).toLocaleDateString()}</td>
              <td>
                <div className="order-actions">
                  {order.status === "pending" && (
                    <>
                      <button
                        onClick={() => onStatusUpdate(order.id, "confirmed")}
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => onStatusUpdate(order.id, "cancelled")}
                      >
                        Cancel
                      </button>
                    </>
                  )}
                  {order.status === "confirmed" && (
                    <button
                      onClick={() => onStatusUpdate(order.id, "completed")}
                    >
                      Complete
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
);

const CakesTab = ({ cakes, onRefresh }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingCake, setEditingCake] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image_url: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCake) {
        await updateCake(editingCake.id, formData);
      } else {
        await createCake(formData);
      }
      setFormData({ name: "", description: "", price: "", image_url: "" });
      setEditingCake(null);
      setIsAdding(false);
      onRefresh();
    } catch (err) {
      console.error("Error saving cake:", err);
    }
  };

  const handleEdit = (cake) => {
    setEditingCake(cake);
    setFormData({
      name: cake.name,
      description: cake.description,
      price: cake.price,
      image_url: cake.image_url,
    });
    setIsAdding(true);
  };

  const handleDelete = async (cakeId) => {
    if (window.confirm("Are you sure you want to delete this cake?")) {
      try {
        await deleteCake(cakeId);
        onRefresh();
      } catch (err) {
        console.error("Error deleting cake:", err);
      }
    }
  };

  return (
    <div className="cakes-management">
      <div className="cakes-header">
        <h3>Cake Inventory</h3>
        <button onClick={() => setIsAdding(!isAdding)}>
          {isAdding ? "Cancel" : "Add New Cake"}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="cake-form">
          <h4>{editingCake ? "Edit Cake" : "Add New Cake"}</h4>
          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>
          <div className="form-group">
            <label>Description:</label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
            />
          </div>
          <div className="form-group">
            <label>Price:</label>
            <input
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              required
            />
          </div>
          <div className="form-group">
            <label>Image URL:</label>
            <input
              type="url"
              value={formData.image_url}
              onChange={(e) =>
                setFormData({ ...formData, image_url: e.target.value })
              }
              required
            />
          </div>
          <button type="submit">
            {editingCake ? "Update Cake" : "Add Cake"}
          </button>
        </form>
      )}

      <div className="cakes-grid">
        {cakes.map((cake) => (
          <div key={cake.id} className="cake-card">
            <img src={cake.image_url} alt={cake.name} />
            <div className="cake-info">
              <h4>{cake.name}</h4>
              <p>{cake.description}</p>
              <div className="cake-price">${cake.price}</div>
              <div className="cake-actions">
                <button onClick={() => handleEdit(cake)}>Edit</button>
                <button onClick={() => handleDelete(cake.id)}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const UsersTab = ({ users }) => (
  <div className="users-table">
    <h3>Registered Users</h3>
    {users.length === 0 ? (
      <p>No users found.</p>
    ) : (
      <table>
        <thead>
          <tr>
            <th>User ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Orders</th>
            <th>Admin</th>
            <th>Joined</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>#{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.phone || "N/A"}</td>
              <td>{user.order_count}</td>
              <td>
                <span className={user.is_admin ? "admin-badge" : "user-badge"}>
                  {user.is_admin ? "Admin" : "User"}
                </span>
              </td>
              <td>{new Date(user.created_at).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
);

export default AdminDashboard;
