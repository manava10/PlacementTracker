import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TPOLayout from "../../layouts/TPOLayout";
import { tpoAPI } from "../../services/api";
import { useAuth } from "../../context/useAuth";

function TPODashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [report, setReport] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    tpoAPI.getDashboard()
      .then((res) => setStats(res.data))
      .catch((err) => console.error("Error loading TPO dashboard stats:", err));

    tpoAPI.generateReports()
      .then((res) => setReport(res.data))
      .catch((err) => console.error("Error loading TPO reports:", err));
  }, []);

  const totalStudents = stats?.totalStudents || 0;
  const placedStudents = stats?.placedStudents || 0;
  const placementRate = totalStudents > 0 ? ((placedStudents / totalStudents) * 100).toFixed(1) : "0.0";
  const avgPackage = report?.averagePackage ?? report?.averageSalary ?? 0;
  const avgSalaryLpa = (avgPackage / 100000).toFixed(1);

  return (
    <TPOLayout>

      <div className="tpo-page">

        {/* HEADER */}

        <div className="company-heading">

          <div>
            <h1>Welcome back, {user?.name || "TPO"}!</h1>

            <p>
              Monitor students, companies, placement drives and recruitment activities.
            </p>
          </div>

          <button className="create-drive-btn" onClick={() => navigate('/tpo/reports')}>
            📊 Generate Report
          </button>

        </div>


        {/* STATS */}

        <div className="company-stats">

          <div className="company-stat-card">

            <div className="company-stat-icon">
              👨‍🎓
            </div>

            <div>
              <span>Total Students</span>
              <strong>{totalStudents}</strong>
              <p>Registered students</p>
            </div>

          </div>


          <div className="company-stat-card">

            <div className="company-stat-icon">
              🏢
            </div>

            <div>
              <span>Companies</span>
              <strong>{stats?.totalCompanies || 0}</strong>
              <p>Registered recruiters</p>
            </div>

          </div>


          <div className="company-stat-card">

            <div className="company-stat-icon">
              📢
            </div>

            <div>
              <span>Active Drives</span>
              <strong>{stats?.totalDrives || 0}</strong>
              <p>Drives conducted</p>
            </div>

          </div>


          <div className="company-stat-card">

            <div className="company-stat-icon">
              🎯
            </div>

            <div>
              <span>Students Placed</span>
              <strong>{placedStudents}</strong>
              <p>Current placement season</p>
            </div>

          </div>

        </div>


        {/* PLACEMENT STATISTICS */}

        <section className="company-section">

          <div className="company-section-header">

            <div>
              <h2>Placement Statistics</h2>

              <p>
                Current placement season overview.
              </p>
            </div>

          </div>


          <div className="tpo-placement-stats">

            <div>
              <span>Placement Rate</span>
              <strong>{placementRate}%</strong>
            </div>

            <div>
              <span>Average Package</span>
              <strong>₹{avgSalaryLpa} LPA</strong>
            </div>

            <div>
              <span>Total Applications</span>
              <strong>{report?.totalApplications || 0}</strong>
            </div>

            <div>
              <span>Interviews Conducted</span>
              <strong>{report?.totalInterviews || 0}</strong>
            </div>

          </div>

        </section>


        {/* QUICK ACTIONS */}

        <section className="company-section">

          <div className="company-section-header">

            <div>
              <h2>Quick Actions</h2>

              <p>
                Frequently used TPO functions.
              </p>
            </div>

          </div>


          <div className="tpo-quick-actions">

            <button onClick={() => navigate('/tpo/students')}>
              👨‍🎓 Manage Students
            </button>

            <button onClick={() => navigate('/tpo/companies')}>
              🏢 Manage Companies
            </button>

            <button onClick={() => navigate('/tpo/drives')}>
              📢 Manage Placement Drives
            </button>

            <button onClick={() => navigate('/tpo/reports')}>
              📊 View Reports
            </button>

          </div>

        </section>

      </div>

    </TPOLayout>
  );
}

export default TPODashboard;