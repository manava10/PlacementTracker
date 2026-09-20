import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { studentAPI } from "../../services/api";

const formatDate = (value) =>
  value ? new Date(value).toLocaleDateString() : "N/A";

const formatTime = (value) =>
  value
    ? new Date(value).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "N/A";

const isUpcoming = (interview) => {
  const status = (interview.status || "").toLowerCase();
  if (status === "completed" || status === "cancelled") return false;
  if (interview.scheduledDate) {
    return new Date(interview.scheduledDate).getTime() >= Date.now();
  }
  return true;
};

function Interviews() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    studentAPI.getInterviews()
      .then((res) => setInterviews(res.data || []))
      .catch(() => setMessage("Unable to load your interviews."))
      .finally(() => setLoading(false));
  }, []);

  const sorted = [...interviews].sort(
    (a, b) => new Date(a.scheduledDate || 0) - new Date(b.scheduledDate || 0)
  );

  const upcoming = sorted.filter(isUpcoming);
  const past = sorted.filter((i) => !isUpcoming(i)).reverse();
  const nextInterview = upcoming[0];

  const label = (interview) => ({
    company: interview.company?.companyName || "Company",
    role: interview.placementDrive?.jobRole || interview.placementDrive?.title || "Position",
    round: interview.round || "Interview",
    date: formatDate(interview.scheduledDate),
    time: formatTime(interview.scheduledDate),
    mode: interview.location || "Online",
    interviewer: interview.interviewer || "Technical Panel",
    status: interview.status ? interview.status.toUpperCase() : "SCHEDULED",
  });

  return (
    <DashboardLayout>
      <div className="interviews-page">

        <div className="interviews-heading">
          <div>
            <h1>My Interviews</h1>
            <p>View and manage your scheduled placement interviews.</p>
          </div>
        </div>

        {loading && <p className="no-data">Loading your interviews...</p>}

        {!loading && interviews.length === 0 && (
          <p className="no-data">{message || "You have no scheduled interviews yet."}</p>
        )}

        {!loading && nextInterview && (
          <section className="upcoming-interview-card">

            <div className="upcoming-label">
              UPCOMING INTERVIEW
            </div>

            {(() => {
              const info = label(nextInterview);
              return (
                <>
                  <div className="interview-main">

                    <div className="interview-company-logo">
                      {info.company.charAt(0).toUpperCase()}
                    </div>

                    <div className="interview-info">
                      <h2>{info.role}</h2>
                      <h3>{info.company}</h3>

                      <div className="interview-tags">
                        <span>🎯 {info.round}</span>
                        <span>💻 {info.mode}</span>
                      </div>
                    </div>

                  </div>

                  <div className="interview-details-grid">

                    <div>
                      <span>📅 Date</span>
                      <strong>{info.date}</strong>
                    </div>

                    <div>
                      <span>⏰ Time</span>
                      <strong>{info.time}</strong>
                    </div>

                    <div>
                      <span>👨‍💼 Interviewer</span>
                      <strong>{info.interviewer}</strong>
                    </div>

                  </div>

                  {nextInterview.joinLink ? (
                    <a
                      className="meeting-btn"
                      href={nextInterview.joinLink}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Join Interview
                    </a>
                  ) : (
                    <button className="meeting-btn" disabled>
                      Join link not available
                    </button>
                  )}
                </>
              );
            })()}

          </section>
        )}

        {past.length > 0 && (
          <section className="past-interviews-card">

            <div className="past-interviews-heading">
              <h2>Interview History</h2>
              <p>Your previous placement interviews</p>
            </div>

            <div className="past-interview-list">

              {past.map((interview) => {
                const info = label(interview);
                return (
                  <div className="past-interview-item" key={interview._id}>

                    <div className="past-company-logo">
                      {info.company.charAt(0).toUpperCase()}
                    </div>

                    <div className="past-interview-info">
                      <h3>{info.role}</h3>
                      <p>{info.company}</p>

                      <div>
                        <span>📅 {info.date}</span>
                        <span>🎯 {info.round}</span>
                      </div>
                    </div>

                    <span className="completed-badge">
                      ✓ {info.status}
                    </span>

                  </div>
                );
              })}

            </div>

          </section>
        )}

      </div>
    </DashboardLayout>
  );
}

export default Interviews;
