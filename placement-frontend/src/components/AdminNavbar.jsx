import { useAuth } from "../context/useAuth";

function AdminNavbar() {
  const { user } = useAuth();
  const displayName = user?.name || "Administrator";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <header className="navbar">

      <div>
        <h2>Admin Dashboard</h2>
        <p>Welcome back, {displayName}!</p>
      </div>

      <div className="navbar-profile">

        <div className="profile-circle">
          {initial}
        </div>

        <div>
          <strong>{displayName}</strong>
          <span>Admin</span>
        </div>

      </div>

    </header>
  );
}

export default AdminNavbar;