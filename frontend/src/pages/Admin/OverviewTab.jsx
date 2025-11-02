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
      <div className="stat-number">{`KSh ${stats.total_revenue.toLocaleString(
        "en-KE"
      )}`}</div>
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

export default OverviewTab;
