import { useEffect, useState } from "react";
import TPOLayout from "../../layouts/TPOLayout";
import { tpoAPI } from "../../services/api";

const formatPackage = (value) =>
  value ? `₹${(value / 100000).toFixed(1)} LPA` : "N/A";

const formatDate = (value) =>
  value ? new Date(value).toLocaleDateString() : "N/A";

const isActive = (status) =>
  ["upcoming", "ongoing", "active", "open"].includes((status || "").toLowerCase());

function PlacementDrives() {
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    tpoAPI.getDrives()
      .then((res) => setDrives(res.data || []))
      .catch((err) => console.error("Error loading drives:", err))
      .finally(() => setLoading(false));
  }, []);

  const statusOptions = [...new Set(drives.map((d) => d.status).filter(Boolean))];

  const filteredDrives = drives.filter((drive) => {
    const job = drive.jobRole || drive.title || "";
    const company = drive.company?.companyName || "";
    const location = drive.location || "";
    const matchesSearch =
      job.toLowerCase().includes(search.toLowerCase()) ||
      company.toLowerCase().includes(search.toLowerCase()) ||
      location.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || drive.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const activeDrives = drives.filter((d) => isActive(d.status)).length;
  const closedDrives = drives.length - activeDrives;
  const totalApplicants = drives.reduce(
    (sum, drive) => sum + (drive.applicantCount || 0),
    0
  );

  return (
    <TPOLayout>
      <div className="company-heading">
        <div>
          <h1>Placement Drives</h1>
          <p>Monitor and manage all placement drives.</p>
        </div>
      </div>

      <div className="company-stats">
        <div className="company-stat-card">
          <h3>Total Drives</h3>
          <strong>{drives.length}</strong>
          <p>All placement drives</p>
        </div>

        <div className="company-stat-card">
          <h3>Active Drives</h3>
          <strong>{activeDrives}</strong>
          <p>Currently accepting applications</p>
        </div>

        <div className="company-stat-card">
          <h3>Closed Drives</h3>
          <strong>{closedDrives}</strong>
          <p>Completed drives</p>
        </div>

        <div className="company-stat-card">
          <h3>Total Applicants</h3>
          <strong>{totalApplicants}</strong>
          <p>Applications received</p>
        </div>
      </div>

      <div className="company-section">
        <div className="student-toolbar">
          <div>
            <h2>All Placement Drives</h2>
            <p>View placement opportunities from all companies.</p>
          </div>

          <div className="student-filters">
            <input
              type="text"
              placeholder="Search drives..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Drives</option>
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="student-table-wrapper">
          <table className="student-table">
            <thead>
              <tr>
                <th>Job Role</th>
                <th>Company</th>
                <th>Package</th>
                <th>Location</th>
                <th>Applicants</th>
                <th>Deadline</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredDrives.map((drive) => {
                const job = drive.jobRole || drive.title || "Position";
                const company = drive.company?.companyName || "Company";
                return (
                  <tr key={drive._id}>
                    <td>
                      <div className="student-name">
                        <strong>{job}</strong>
                        <span>Placement Drive</span>
                      </div>
                    </td>

                    <td>{company}</td>

                    <td>
                      <strong>{formatPackage(drive.salary)}</strong>
                    </td>

                    <td>{drive.location || "N/A"}</td>

                    <td>{drive.applicantCount || 0}</td>

                    <td>{formatDate(drive.registrationDeadline)}</td>

                    <td>
                      <span
                        className={
                          isActive(drive.status)
                            ? "status-badge placed"
                            : "status-badge unplaced"
                        }
                      >
                        {drive.status || "N/A"}
                      </span>
                    </td>

                    <td>
                      <button
                        className="view-btn"
                        onClick={() =>
                          alert(
                            `Job Role: ${job}\nCompany: ${company}\nPackage: ${formatPackage(drive.salary)}\nLocation: ${drive.location || "N/A"}\nApplicants: ${drive.applicantCount || 0}\nDeadline: ${formatDate(drive.registrationDeadline)}\nStatus: ${drive.status || "N/A"}`
                          )
                        }
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {loading && (
            <div className="no-students">Loading placement drives...</div>
          )}

          {!loading && filteredDrives.length === 0 && (
            <div className="no-students">
              No placement drives found.
            </div>
          )}
        </div>
      </div>
    </TPOLayout>
  );
}

export default PlacementDrives;
