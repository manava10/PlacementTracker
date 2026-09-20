import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { adminAPI } from "../../services/api";

const toLpa = (value) => (value ? (value / 100000).toFixed(1) : "0.0");

function Reports() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.generateReports()
      .then((res) => setReport(res.data))
      .catch((err) => console.error("Error loading reports:", err))
      .finally(() => setLoading(false));
  }, []);

  const totalStudents = report?.totalStudents || 0;
  const placedStudents = report?.placedStudents || 0;
  const unplacedStudents = report?.unplacedStudents || 0;
  const placementRate = report?.placementRate || 0;
  const placedPct = totalStudents > 0 ? (placedStudents / totalStudents) * 100 : 0;
  const unplacedPct = totalStudents > 0 ? (unplacedStudents / totalStudents) * 100 : 0;
  const packageDistribution = report?.packageDistribution || [];
  const topCompanies = report?.topCompanies || [];

  return (
    <AdminLayout>

      <div className="company-heading">

        <div>
          <h1>Reports & Analytics</h1>
          <p>
            View complete placement system analytics and reports.
          </p>
        </div>

        {report && (
          <button
            className="create-drive-btn"
            onClick={() =>
              alert(
                `Placement Report\n\nTotal Students: ${totalStudents}\nPlaced: ${placedStudents}\nPlacement Rate: ${placementRate}%\nAverage Package: ₹${toLpa(report.averagePackage)} LPA\nHighest Package: ₹${toLpa(report.highestPackage)} LPA\nCompanies: ${report.totalCompanies}\nDrives: ${report.totalDrives}\nApplications: ${report.totalApplications}\nInterviews: ${report.totalInterviews}`
              )
            }
          >
            Generate Report
          </button>
        )}

      </div>

      {loading && <p className="no-data">Loading report data...</p>}

      {!loading && (
        <>
          <div className="company-stats">

            <div className="company-stat-card">
              <h3>Placement Rate</h3>
              <strong>{placementRate}%</strong>
              <p>{placedStudents} students placed</p>
            </div>

            <div className="company-stat-card">
              <h3>Average Package</h3>
              <strong>₹{toLpa(report?.averagePackage)} LPA</strong>
              <p>Average package</p>
            </div>

            <div className="company-stat-card">
              <h3>Highest Package</h3>
              <strong>₹{toLpa(report?.highestPackage)} LPA</strong>
              <p>Highest package offered</p>
            </div>

            <div className="company-stat-card">
              <h3>Companies</h3>
              <strong>{report?.totalCompanies || 0}</strong>
              <p>Recruiting companies</p>
            </div>

          </div>

          <div className="company-section">

            <h2>Placement Performance</h2>

            <p className="report-subtitle">
              Overall student placement performance.
            </p>

            <div className="report-bars">

              <div className="report-bar-item">
                <div>
                  <span>Total Students</span>
                  <strong>{totalStudents}</strong>
                </div>
                <div className="report-bar">
                  <div className="report-bar-fill" style={{ width: "100%" }}></div>
                </div>
              </div>

              <div className="report-bar-item">
                <div>
                  <span>Students Placed</span>
                  <strong>{placedStudents}</strong>
                </div>
                <div className="report-bar">
                  <div className="report-bar-fill" style={{ width: `${placedPct}%` }}></div>
                </div>
              </div>

              <div className="report-bar-item">
                <div>
                  <span>Students Unplaced</span>
                  <strong>{unplacedStudents}</strong>
                </div>
                <div className="report-bar">
                  <div className="report-bar-fill" style={{ width: `${unplacedPct}%` }}></div>
                </div>
              </div>

            </div>

          </div>

          <div className="company-section">

            <h2>Package Analysis</h2>

            <p className="report-subtitle">
              Distribution of students based on salary packages.
            </p>

            <div className="package-list">
              {packageDistribution.map((bucket) => (
                <div className="package-item" key={bucket.label}>
                  <span>{bucket.label}</span>
                  <strong>{bucket.count} Students</strong>
                </div>
              ))}
            </div>

          </div>

          <div className="company-section">

            <h2>Top Recruiting Companies</h2>

            <p className="report-subtitle">
              Companies contributing most to student placements.
            </p>

            <div className="report-company-grid">
              {topCompanies.length > 0 ? (
                topCompanies.map((company) => (
                  <div className="report-company-card" key={company.name}>
                    <div className="company-avatar">
                      {company.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <strong>{company.name}</strong>
                      <span>{company.applicants} applicants</span>
                    </div>
                    <b>{company.placed} Placed</b>
                  </div>
                ))
              ) : (
                <p className="no-data">No recruitment data available yet.</p>
              )}
            </div>

          </div>

          <div className="company-section">

            <h2>Quick Reports</h2>

            <div className="quick-report-grid">

              <button
                onClick={() =>
                  alert(
                    `Student Report\n\nTotal Students: ${totalStudents}\nPlaced: ${placedStudents}\nUnplaced: ${unplacedStudents}\nPlacement Rate: ${placementRate}%`
                  )
                }
              >
                👨‍🎓
                <span>Student Report</span>
                <small>Student registration and placement data</small>
              </button>

              <button
                onClick={() =>
                  alert(
                    `Company Report\n\nTotal Companies: ${report?.totalCompanies || 0}\nVerified: ${report?.verifiedCompanies || 0}`
                  )
                }
              >
                🏢
                <span>Company Report</span>
                <small>Company recruitment information</small>
              </button>

              <button
                onClick={() =>
                  alert(
                    `Drive Report\n\nTotal Drives: ${report?.totalDrives || 0}\nActive Drives: ${report?.activeDrives || 0}\nTotal Applications: ${report?.totalApplications || 0}`
                  )
                }
              >
                📢
                <span>Placement Drive Report</span>
                <small>Drive performance and applications</small>
              </button>

              <button
                onClick={() =>
                  alert(
                    `Package Analysis\n\nAverage Package: ₹${toLpa(report?.averagePackage)} LPA\nHighest Package: ₹${toLpa(report?.highestPackage)} LPA\n\n` +
                      packageDistribution
                        .map((b) => `${b.label}: ${b.count}`)
                        .join("\n")
                  )
                }
              >
                💰
                <span>Package Analysis</span>
                <small>Salary package statistics</small>
              </button>

            </div>

          </div>
        </>
      )}

    </AdminLayout>
  );
}

export default Reports;
