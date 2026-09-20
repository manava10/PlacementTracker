import { useAuth } from "../context/useAuth";

function Navbar() {
  const { user } = useAuth();
  const displayName = user?.name || "Student";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <header className="navbar">

      <div>
        <h2>Student Dashboard</h2>
        <p>Welcome back, {displayName}!</p>
      </div>

      <div className="navbar-profile">
        <div className="profile-circle">
          {initial}
        </div>

        <div>
          <strong>{displayName}</strong>
          <span>{user?.role ? user.role.toUpperCase() : "Student"}</span>
        </div>
      </div>

    </header>
  );
}

export default Navbar;