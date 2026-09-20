import { useAuth } from "../context/useAuth";

function TPONavbar() {
  const { user } = useAuth();
  const displayName = user?.name || "TPO Officer";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <header className="navbar">

      <div>
        <h2>TPO Dashboard</h2>
        <p>Welcome back, {displayName}!</p>
      </div>

      <div className="navbar-profile">

        <div className="profile-circle">
          {initial}
        </div>

        <div>
          <strong>{displayName}</strong>
          <span>TPO</span>
        </div>

      </div>

    </header>
  );
}

export default TPONavbar;