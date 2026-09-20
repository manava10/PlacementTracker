import { useAuth } from "../context/useAuth";

function CompanyNavbar() {
  const { user } = useAuth();
  const displayName = user?.name || "Company Recruiter";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <header className="navbar">

      <div>
        <h2>Company Dashboard</h2>
        <p>Welcome back, {displayName}!</p>
      </div>

      <div className="navbar-profile">

        <div className="profile-circle">
          {initial}
        </div>

        <div>
          <strong>{displayName}</strong>
          <span>Company</span>
        </div>

      </div>

    </header>
  );
}

export default CompanyNavbar;