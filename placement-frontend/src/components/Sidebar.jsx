import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";

function Sidebar() {
  const { logout } = useAuth();

  return (
    <aside className="sidebar">

      <div className="sidebar-logo">
        <h2>Placement Portal</h2>
        <p>Student Panel</p>
      </div>

      <nav className="sidebar-menu">

        <Link to="/student">
          🏠 Dashboard
        </Link>

        <Link to="/student/profile">
          👤 My Profile
        </Link>

        <Link to="/student/resume">
          📄 Resume
        </Link>

        <Link to="/student/jobs">
          💼 Placement Drives
        </Link>

        <Link to="/student/applications">
          📋 Applications
        </Link>

        <Link to="/student/interviews">
          📅 Interviews
        </Link>

        <Link to="/student/ats">
          🤖 AI Resume Analysis
        </Link>

      </nav>

      <div className="sidebar-bottom">
        <Link to="/" onClick={logout}>
          🚪 Logout
        </Link>
      </div>

    </aside>
  );
}

export default Sidebar;