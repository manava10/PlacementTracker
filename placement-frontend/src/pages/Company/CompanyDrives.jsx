import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CompanyLayout from "../../layouts/CompanyLayout";
import { companyAPI } from "../../services/api";

function CompanyDrives() {
  const [drives, setDrives] = useState([]);

  useEffect(() => {
    companyAPI.getDrives()
      .then((res) => setDrives(res.data || []))
      .catch((err) => console.error("Error loading company drives:", err));
  }, []);

  const activeDrives = drives.filter((d) => d.status === "upcoming" || d.status === "ongoing").length;
  const totalPositions = drives.reduce((sum, d) => sum + (d.positions || 0), 0);

  return (
    <CompanyLayout>

      <div className="company-page">

        <div className="company-heading">
          <div>
            <h1>Placement Drives</h1>
            <p>Manage all your company's placement opportunities.</p>
          </div>

          <Link to="/company/create-drive">
            <button className="create-drive-btn">
              + Create Placement Drive
            </button>
          </Link>
        </div>

        {/* SUMMARY */}

        <div className="company-stats">

          <div className="company-stat-card">
            <div className="company-stat-icon">📢</div>
            <div>
              <span>Active Drives</span>
              <strong>{activeDrives}</strong>
              <p>Currently open</p>
            </div>
          </div>

          <div className="company-stat-card">
            <div className="company-stat-icon">📁</div>
            <div>
              <span>Total Drives</span>
              <strong>{drives.length}</strong>
              <p>Created by company</p>
            </div>
          </div>

          <div className="company-stat-card">
            <div className="company-stat-icon">👥</div>
            <div>
              <span>Total Positions</span>
              <strong>{totalPositions}</strong>
              <p>Total job openings</p>
            </div>
          </div>

          <div className="company-stat-card">
            <div className="company-stat-icon">⭐</div>
            <div>
              <span>Status</span>
              <strong>Active</strong>
              <p>Recruitment status</p>
            </div>
          </div>

        </div>

        {/* DRIVE LIST */}

        <section className="company-section">

          <div className="company-section-header">
            <div>
              <h2>All Placement Drives</h2>
              <p>View and manage your job openings.</p>
            </div>
          </div>

          <div className="company-drive-list">
            {drives.length > 0 ? (
              drives.map((drive) => (
                <div className="company-drive-card" key={drive._id}>
                  <div className="company-drive-icon">
                    {drive.jobRole ? drive.jobRole.charAt(0).toUpperCase() : 'D'}
                  </div>

                  <div className="company-drive-info">
                    <h3>{drive.jobRole || drive.title}</h3>

                    <p>
                      Full Time • ₹{(drive.salary / 100000).toFixed(1)} LPA • {drive.location || 'Remote'}
                    </p>

                    <div className="company-drive-meta">
                      <span>👥 {drive.positions} Positions</span>
                      <span>📅 {drive.driveDate ? new Date(drive.driveDate).toLocaleDateString() : 'Upcoming'}</span>
                    </div>
                  </div>

                  <div className="company-drive-status">
                    <span>{drive.status}</span>
                    <button onClick={() => alert(`Drive: ${drive.title}\nJob Role: ${drive.jobRole}\nPositions: ${drive.positions}\nSalary: ₹${drive.salary}`)}>
                      View Details
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-data">No placement drives created yet. Click "+ Create Placement Drive" to add one.</p>
            )}
          </div>

        </section>

      </div>

    </CompanyLayout>
  );
}

export default CompanyDrives;