import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CompanyLayout from "../../layouts/CompanyLayout";
import { companyAPI } from "../../services/api";
import { useAuth } from "../../context/useAuth";

function CompanyDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [drives, setDrives] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    companyAPI.getDashboard()
      .then((res) => setStats(res.data))
      .catch((err) => console.error("Error loading company dashboard stats:", err));

    companyAPI.getDrives()
      .then((res) => setDrives(res.data || []))
      .catch((err) => console.error("Error loading company drives:", err));

    companyAPI.getApplicants()
      .then((res) => setApplicants(res.data || []))
      .catch((err) => console.error("Error loading company applicants:", err));
  }, []);

  return (
    <CompanyLayout>
      <div className="company-page">

        <div className="company-heading">
          <div>
            <h1>Welcome back, {user?.name || "Recruiter"}!</h1>
            <p>
              Manage your placement activities and find suitable candidates.
            </p>
          </div>

          <Link to="/company/create-drive">
            <button className="create-drive-btn">
              + Create Placement Drive
            </button>
          </Link>
        </div>

        {/* STAT CARDS */}

        <div className="company-stats">

          <div className="company-stat-card">
            <div className="company-stat-icon">📢</div>
            <div>
              <span>Active Drives</span>
              <strong>{stats ? stats.totalDrives : "--"}</strong>
              <p>Currently open</p>
            </div>
          </div>

          <div className="company-stat-card">
            <div className="company-stat-icon">👥</div>
            <div>
              <span>Total Applicants</span>
              <strong>{stats ? stats.applications : "--"}</strong>
              <p>Across all drives</p>
            </div>
          </div>

          <div className="company-stat-card">
            <div className="company-stat-icon">⭐</div>
            <div>
              <span>Shortlisted</span>
              <strong>{stats ? stats.selected : "--"}</strong>
              <p>Selected students</p>
            </div>
          </div>

          <div className="company-stat-card">
            <div className="company-stat-icon">📅</div>
            <div>
              <span>Interviews</span>
              <strong>{stats ? stats.interviewed : "--"}</strong>
              <p>Scheduled interviews</p>
            </div>
          </div>

        </div>

        {/* ACTIVE DRIVES */}

        <section className="company-section">

          <div className="company-section-header">
            <div>
              <h2>Active Placement Drives</h2>
              <p>Currently open positions</p>
            </div>

            <button onClick={() => navigate('/company/drives')}>View All</button>
          </div>

          <div className="company-drive-list">
            {drives.length > 0 ? (
              drives.slice(0, 3).map((drive) => (
                <div key={drive._id} className="company-drive-card">
                  <div className="company-drive-icon">
                    {drive.jobRole ? drive.jobRole.charAt(0).toUpperCase() : 'D'}
                  </div>

                  <div className="company-drive-info">
                    <h3>{drive.jobRole || drive.title}</h3>
                    <p>Full Time • ₹{(drive.salary / 100000).toFixed(1)} LPA</p>

                    <div className="company-drive-meta">
                      <span>👥 {drive.positions} Positions</span>
                      <span>📅 {drive.driveDate ? new Date(drive.driveDate).toLocaleDateString() : 'Upcoming'}</span>
                    </div>
                  </div>

                  <div className="company-drive-status">
                    <span>{drive.status}</span>
                    <button onClick={() => navigate('/company/applicants')}>View Applicants</button>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-data">No active drives created yet.</p>
            )}
          </div>

        </section>

        {/* RECENT APPLICANTS */}

        <section className="company-section">

          <div className="company-section-header">
            <div>
              <h2>Recent Applicants</h2>
              <p>Students who recently applied to your drives</p>
            </div>

            <button onClick={() => navigate('/company/applicants')}>View All</button>
          </div>

          <div className="applicant-list">
            {applicants.length > 0 ? (
              applicants.slice(0, 4).map((app) => (
                <div key={app._id} className="applicant-row">
                  <div className="applicant-avatar">
                    {app.student?.userId?.name ? app.student.userId.name.charAt(0).toUpperCase() : 'S'}
                  </div>

                  <div className="applicant-info">
                    <h3>{app.student?.userId?.name || 'Student Candidate'}</h3>
                    <p>{app.placementDrive?.jobRole || 'Application'} • CGPA {app.student?.cgpa != null ? app.student.cgpa : 'N/A'}</p>
                  </div>

                  <span className="applicant-score">
                    ATS {app.student?.atsScore != null ? `${app.student.atsScore}%` : 'N/A'}
                  </span>

                  <span className="applicant-status">
                    {app.status}
                  </span>
                </div>
              ))
            ) : (
              <p className="no-data">No applicant records found.</p>
            )}
          </div>

        </section>

      </div>
    </CompanyLayout>
  );
}

export default CompanyDashboard;