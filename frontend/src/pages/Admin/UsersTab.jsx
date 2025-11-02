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

export default UsersTab;
