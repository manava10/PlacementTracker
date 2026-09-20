import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../layouts/AdminLayout";
import { adminAPI } from "../../services/api";
import { useAuth } from "../../context/useAuth";

function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    adminAPI.getDashboard()
      .then((res) => setStats(res.data))
      .catch((err) => console.error("Error loading Admin dashboard stats:", err));
  }, []);

  return (
    <AdminLayout>

      {/* Page Header */}

      <div className="company-heading">

        <div>
          <h1>Welcome back, {user?.name || "Admin"}!</h1>
          <p>
            Manage and monitor the complete placement management system.
          </p>
        </div>

        <button
          className="create-drive-btn"
          onClick={() => navigate('/admin/reports')}
        >
          Generate Report
        </button>

      </div>

      {/* Statistics */}

      <div className="company-stats">

        <div className="company-stat-card">
          <h3>Total Students</h3>
          <strong>{stats ? stats.totalStudents : "--"}</strong>
          <p>Registered students</p>
        </div>

        <div className="company-stat-card">
          <h3>Total Companies</h3>
          <strong>{stats ? stats.totalCompanies : "--"}</strong>
          <p>Registered companies</p>
        </div>

        <div className="company-stat-card">
          <h3>Placement Drives</h3>
          <strong>{stats ? stats.totalDrives : "--"}</strong>
          <p>Total placement drives</p>
        </div>

        <div className="company-stat-card">
          <h3>Students Placed</h3>
          <strong>{stats ? stats.placedStudents : "--"}</strong>
          <p>Successfully placed</p>
        </div>

      </div>

      {/* System Overview */}

      <div className="company-section">

        <h2>System Overview</h2>
        <p className="report-subtitle">
          Current status of the placement management system.
        </p>

        <div className="admin-overview-grid">

          <div className="admin-overview-card">
            <div className="admin-icon">👨‍🎓</div>

            <div>
              <strong>Students</strong>
              <span>{stats?.totalStudents || 0} registered</span>
            </div>

            <b>Active</b>
          </div>

          <div className="admin-overview-card">
            <div className="admin-icon">🏢</div>

            <div>
              <strong>Companies</strong>
              <span>{stats?.totalCompanies || 0} registered</span>
            </div>

            <b>Active</b>
          </div>

          <div className="admin-overview-card">
            <div className="admin-icon">📢</div>

            <div>
              <strong>Placement Drives</strong>
              <span>{stats?.totalDrives || 0} active</span>
            </div>

            <b>Active</b>
          </div>

          <div className="admin-overview-card">
            <div className="admin-icon">🎯</div>

            <div>
              <strong>Placed</strong>
              <span>{stats?.placedStudents || 0} candidates</span>
            </div>

            <b>Successful</b>
          </div>

        </div>

      </div>

      {/* Quick Actions */}

      <div className="company-section">

        <h2>Quick Actions</h2>

        <div className="quick-report-grid">

          <button onClick={() => navigate("/admin/students")}>
            👨‍🎓
            <span>Manage Students</span>
            <small>View and manage student accounts</small>
          </button>

          <button onClick={() => navigate("/admin/companies")}>
            🏢
            <span>Manage Companies</span>
            <small>View registered companies</small>
          </button>

          <button onClick={() => navigate("/admin/drives")}>
            📢
            <span>Manage Drives</span>
            <small>Monitor placement drives</small>
          </button>

          <button onClick={() => navigate("/admin/reports")}>
            📊
            <span>View Reports</span>
            <small>View system analytics</small>
          </button>

        </div>

      </div>

    </AdminLayout>
  );
}

export default AdminDashboard;