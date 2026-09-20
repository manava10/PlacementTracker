import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { adminAPI } from "../../services/api";

const formatDate = (value) =>
  value ? new Date(value).toLocaleDateString() : "N/A";

const formatTime = (value) =>
  value
    ? new Date(value).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "N/A";

const statusClass = (status) => {
  const s = (status || "").toLowerCase();
  if (s === "completed") return "status-badge placed";
  if (s === "scheduled" || s === "upcoming") return "status-badge active";
  return "status-badge unplaced";
};

function Interviews() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    adminAPI.getInterviews()
      .then((res) => setInterviews(res.data || []))
      .catch((err) => console.error("Error loading interviews:", err))
      .finally(() => setLoading(false));
  }, []);

  const statusOptions = [...new Set(interviews.map((i) => i.status).filter(Boolean))];

  const filteredInterviews = interviews.filter(
    (interview) => statusFilter === "All" || interview.status === statusFilter
  );

  const countBy = (value) =>
    interviews.filter((i) => (i.status || "").toLowerCase() === value).length;

  return (
    <AdminLayout>

      <div className="company-heading">
        <div>
          <h1>Interviews</h1>
          <p>
            Manage and monitor all placement interviews.
          </p>
        </div>
      </div>

      <div className="company-stats">

        <div className="company-stat-card">
          <h3>Total Interviews</h3>
          <strong>{interviews.length}</strong>
          <p>All scheduled interviews</p>
        </div>

        <div className="company-stat-card">
          <h3>Scheduled</h3>
          <strong>{countBy("scheduled") + countBy("upcoming")}</strong>
          <p>Interviews coming up</p>
        </div>

        <div className="company-stat-card">
          <h3>Completed</h3>
          <strong>{countBy("completed")}</strong>
          <p>Completed interviews</p>
        </div>

        <div className="company-stat-card">
          <h3>Pending</h3>
          <strong>{countBy("pending")}</strong>
          <p>Awaiting action</p>
        </div>

      </div>

      <div className="company-section">

        <div className="student-toolbar">

          <div>
            <h2>Interview Schedule</h2>
            <p>
              View and manage interviews across all companies.
            </p>
          </div>

          <div className="student-filters">

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Interviews</option>
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
                <th>Student</th>
                <th>Company</th>
                <th>Job Role</th>
                <th>Date</th>
                <th>Time</th>
                <th>Round</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>

              {filteredInterviews.map((interview) => {
                const studentName = interview.student?.userId?.name || "Student";
                const company = interview.company?.companyName || "Company";
                const role =
                  interview.placementDrive?.jobRole ||
                  interview.placementDrive?.title ||
                  "Position";

                return (
                  <tr key={interview._id}>

                    <td>
                      <div className="student-name">
                        <strong>{studentName}</strong>
                        <span>{interview.student?.userId?.email || "Student"}</span>
                      </div>
                    </td>

                    <td>{company}</td>

                    <td>{role}</td>

                    <td>{formatDate(interview.scheduledDate)}</td>

                    <td>{formatTime(interview.scheduledDate)}</td>

                    <td>{interview.round || "N/A"}</td>

                    <td>
                      <span className={statusClass(interview.status)}>
                        {interview.status || "N/A"}
                      </span>
                    </td>

                    <td>
                      <button
                        className="view-btn"
                        onClick={() =>
                          alert(
                            `Student: ${studentName}\nCompany: ${company}\nJob Role: ${role}\nDate: ${formatDate(interview.scheduledDate)}\nTime: ${formatTime(interview.scheduledDate)}\nRound: ${interview.round || "N/A"}\nStatus: ${interview.status || "N/A"}`
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
            <div className="no-students">Loading interviews...</div>
          )}

          {!loading && filteredInterviews.length === 0 && (
            <div className="no-students">
              No interviews found.
            </div>
          )}

        </div>

      </div>

    </AdminLayout>
  );
}

export default Interviews;
