import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { studentAPI } from "../../services/api";

const statusClass = (status) => {
  switch (status) {
    case "selected": return "status-badge selected";
    case "shortlisted": return "status-badge shortlisted";
    case "rejected": return "status-badge rejected";
    default: return "status-badge applied";
  }
};

const formatPackage = (value) =>
  value ? `₹${(value / 100000).toFixed(1)} LPA` : "N/A";

function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    studentAPI.getApplications()
      .then((res) => setApplications(res.data || []))
      .catch(() => setMessage("Unable to load your applications."))
      .finally(() => setLoading(false));
  }, []);

  const total = applications.length;
  const shortlisted = applications.filter((a) => a.status === "shortlisted").length;
  const selected = applications.filter((a) => a.status === "selected").length;
  const rejected = applications.filter((a) => a.status === "rejected").length;

  return (
    <DashboardLayout>
      <div className="applications-page">

        <div className="applications-heading">
          <div>
            <h1>My Applications</h1>
            <p>Track the status of your placement applications.</p>
          </div>
        </div>

        <div className="application-summary">
          <div>
            <span>Total Applications</span>
            <strong>{total}</strong>
          </div>
          <div>
            <span>Shortlisted</span>
            <strong>{shortlisted}</strong>
          </div>
          <div>
            <span>Selected</span>
            <strong>{selected}</strong>
          </div>
          <div>
            <span>Rejected</span>
            <strong>{rejected}</strong>
          </div>
        </div>

        <section className="applications-card">

          <div className="applications-card-header">
            <div>
              <h2>Application History</h2>
              <p>Your recent placement applications</p>
            </div>
          </div>

          <div className="application-list">

            {loading && <p className="no-data">Loading your applications...</p>}

            {!loading && applications.length === 0 && (
              <p className="no-data">{message || "You have not applied to any placement drives yet."}</p>
            )}

            {applications.map((application) => {
              const company = application.company?.companyName || "Company";
              const role = application.placementDrive?.jobRole || application.placementDrive?.title || "Position";
              const pkg = formatPackage(application.salary || application.placementDrive?.salary);
              const date = application.appliedAt
                ? new Date(application.appliedAt).toLocaleDateString()
                : "N/A";

              return (
                <div className="application-item" key={application._id}>

                  <div className="application-company-logo">
                    {company.charAt(0).toUpperCase()}
                  </div>

                  <div className="application-info">
                    <h3>{role}</h3>
                    <p>{company}</p>

                    <div className="application-details">
                      <span>💰 {pkg}</span>
                      <span>📅 Applied {date}</span>
                    </div>
                  </div>

                  <div className="application-status">
                    <span className={statusClass(application.status)}>
                      {application.status ? application.status.toUpperCase() : "APPLIED"}
                    </span>
                  </div>

                </div>
              );
            })}

          </div>

        </section>

      </div>
    </DashboardLayout>
  );
}

export default Applications;
